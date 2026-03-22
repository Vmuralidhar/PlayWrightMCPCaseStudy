@echo off
REM InvenTree API Test Runner for Windows
REM This script sets up the environment and runs the Playwright API tests

setlocal enabledelayedexpansion

REM Colors for output (Windows CMD)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Function to print colored output
:print_status
echo [94m[INFO][0m %~1
goto :eof

:print_success
echo [92m[SUCCESS][0m %~1
goto :eof

:print_warning
echo [93m[WARNING][0m %~1
goto :eof

:print_error
echo [91m[ERROR][0m %~1
goto :eof

REM Function to check if a command exists
:command_exists
where "%~1" >nul 2>nul
goto :eof

REM Function to wait for InvenTree to be ready
:wait_for_inventree
set "url=%~1"
set "max_attempts=60"
set "attempt=1"

call :print_status "Waiting for InvenTree to be ready at %url%..."

:wait_loop
if %attempt% gtr %max_attempts% (
    call :print_error "InvenTree failed to start within %max_attempts%0 seconds"
    exit /b 1
)

curl -f -s "%url%/api/" >nul 2>nul
if %errorlevel% equ 0 (
    call :print_success "InvenTree is ready!"
    goto :eof
)

call :print_status "Attempt %attempt%/%max_attempts% - InvenTree not ready yet..."
timeout /t 5 /nobreak >nul
set /a "attempt+=1"
goto wait_loop

REM Function to setup environment
:setup_environment
call :print_status "Setting up test environment..."

REM Create .env.test if it doesn't exist
if not exist ".env.test" (
    call :print_status "Creating .env.test file..."
    (
        echo # InvenTree API Configuration
        echo INVENTREE_URL=http://localhost:8000
        echo TEST_USER=admin
        echo TEST_PASSWORD=admin
        echo.
        echo # Test Configuration
        echo HEADLESS=true
        echo SLOW_MO=0
        echo TIMEOUT=30000
        echo.
        echo # Parallel execution
        echo WORKERS=4
    ) > .env.test
    call :print_success "Created .env.test file"
) else (
    call :print_status ".env.test file already exists"
)

REM Check if Docker is available
call :command_exists docker
if %errorlevel% neq 0 (
    call :print_error "Docker is not installed. Please install Docker to run InvenTree."
    exit /b 1
)
call :print_status "Docker is available"

REM Check if Node.js is available
call :command_exists node
if %errorlevel% neq 0 (
    call :print_error "Node.js is not installed. Please install Node.js 16+."
    exit /b 1
)
call :print_status "Node.js is available"

REM Check if npm is available
call :command_exists npm
if %errorlevel% neq 0 (
    call :print_error "npm is not installed. Please install npm."
    exit /b 1
)
call :print_status "npm is available"
goto :eof

REM Function to start InvenTree
:start_inventree
call :print_status "Starting InvenTree with Docker Compose..."

REM Check if container is already running
docker ps --filter "name=inventree-api-test" --format "{{.Names}}" | findstr "inventree-api-test" >nul 2>nul
if %errorlevel% equ 0 (
    call :print_warning "InvenTree container is already running"
    goto :eof
)

REM Start InvenTree
docker compose up -d
if %errorlevel% neq 0 (
    REM Try with docker-compose (older versions)
    docker-compose up -d
    if %errorlevel% neq 0 (
        call :print_error "Failed to start InvenTree with Docker Compose"
        exit /b 1
    )
)

REM Wait for InvenTree to be ready
call :wait_for_inventree "http://localhost:8000"
goto :eof

REM Function to stop InvenTree
:stop_inventree
call :print_status "Stopping InvenTree..."

docker compose down 2>nul
if %errorlevel% neq 0 (
    docker-compose down 2>nul
)

call :print_success "InvenTree stopped"
goto :eof

REM Function to install dependencies
:install_dependencies
call :print_status "Installing npm dependencies..."

if not exist "node_modules" (
    npm install
    if %errorlevel% neq 0 (
        call :print_error "Failed to install npm dependencies"
        exit /b 1
    )
    call :print_success "Dependencies installed"
) else (
    call :print_status "Dependencies already installed"
)

REM Install Playwright browsers
call :print_status "Installing Playwright browsers..."
npx playwright install
if %errorlevel% neq 0 (
    call :print_error "Failed to install Playwright browsers"
    exit /b 1
)
call :print_success "Playwright browsers installed"
goto :eof

REM Function to run tests
:run_tests
set "test_filter=%~1"
set "workers=%~2"

call :print_status "Running API tests..."

REM Set environment variables
if "%INVENTREE_URL%"=="" set "INVENTREE_URL=http://localhost:8000"
if "%TEST_USER%"=="" set "TEST_USER=admin"
if "%TEST_PASSWORD%"=="" set "TEST_PASSWORD=admin"

REM Build test command
set "cmd=npx playwright test tests\inventree-parts-api.spec.ts --reporter=line"

if defined test_filter (
    set "cmd=%cmd% -g "%test_filter%""
)

if defined workers (
    set "cmd=%cmd% --workers=%workers%"
)

call :print_status "Executing: %cmd%"

REM Run the tests
%cmd%
set "exit_code=%errorlevel%"

if %exit_code% equ 0 (
    call :print_success "All tests passed!"
) else (
    call :print_error "Some tests failed. Exit code: %exit_code%"
)

exit /b %exit_code%

REM Function to show usage
:show_usage
echo InvenTree API Test Runner for Windows
echo.
echo Usage: %0 [COMMAND] [OPTIONS]
echo.
echo Commands:
echo     setup          Setup the test environment
echo     start          Start InvenTree instance
echo     stop           Stop InvenTree instance
echo     install        Install dependencies
echo     test           Run all API tests
echo     smoke          Run smoke tests (CRUD only)
echo     clean          Clean up test environment
echo.
echo Options:
echo     --filter FILTER    Run tests matching filter (grep pattern)
echo     --workers NUM      Number of parallel workers (default: 4)
echo     --headed           Run tests in headed mode (show browser)
echo     --debug            Run tests in debug mode
echo     --help             Show this help message
echo.
echo Examples:
echo     %0 setup                    # Setup environment
echo     %0 start                    # Start InvenTree
echo     %0 test                     # Run all tests
echo     %0 test --filter "CRUD"     # Run CRUD tests only
echo     %0 smoke                    # Run smoke tests
echo     %0 stop                     # Stop InvenTree
echo.
echo Environment Variables:
echo     INVENTREE_URL       InvenTree base URL (default: http://localhost:8000)
echo     TEST_USER           Test username (default: admin)
echo     TEST_PASSWORD       Test password (default: admin)
echo.
goto :eof

REM Main script logic
:main
set "command=%~1"
shift

if "%command%"=="setup" (
    call :setup_environment
    call :install_dependencies
) else if "%command%"=="start" (
    call :setup_environment
    call :start_inventree
) else if "%command%"=="stop" (
    call :stop_inventree
) else if "%command%"=="install" (
    call :install_dependencies
) else if "%command%"=="test" (
    set "filter="
    set "workers="
    set "headed=false"
    set "debug=false"

    :parse_args
    if "%~1"=="" goto end_parse_args
    if "%~1"=="--filter" (
        set "filter=%~2"
        shift & shift
    ) else if "%~1"=="--workers" (
        set "workers=%~2"
        shift & shift
    ) else if "%~1"=="--headed" (
        set "HEADLESS=false"
        shift
    ) else if "%~1"=="--debug" (
        set "PWDEBUG=1"
        shift
    ) else (
        call :print_error "Unknown option: %~1"
        call :show_usage
        exit /b 1
    )
    goto parse_args
    :end_parse_args

    call :setup_environment
    call :start_inventree
    call :run_tests "%filter%" "%workers%"
) else if "%command%"=="smoke" (
    call :setup_environment
    call :start_inventree
    call :run_tests "CRUD" "1"
) else if "%command%"=="clean" (
    call :print_status "Cleaning up test environment..."
    call :stop_inventree
    if exist "test-results" rmdir /s /q "test-results"
    call :print_success "Cleanup complete"
) else if "%command%"=="" (
    REM Default action: setup, start, and run tests
    call :setup_environment
    call :install_dependencies
    call :start_inventree
    call :run_tests
) else if "%command%"=="--help" (
    call :show_usage
) else if "%command%"=="-h" (
    call :show_usage
) else (
    call :print_error "Unknown command: %command%"
    call :show_usage
    exit /b 1
)

goto :eof

REM Run main function with all arguments
call :main %*
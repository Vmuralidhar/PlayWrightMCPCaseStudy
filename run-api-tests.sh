#!/bin/bash

# InvenTree API Test Runner
# This script sets up the environment and runs the Playwright API tests

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to wait for InvenTree to be ready
wait_for_inventree() {
    local url=$1
    local max_attempts=60
    local attempt=1

    print_status "Waiting for InvenTree to be ready at $url..."

    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url/api/" > /dev/null 2>&1; then
            print_success "InvenTree is ready!"
            return 0
        fi

        print_status "Attempt $attempt/$max_attempts - InvenTree not ready yet..."
        sleep 5
        ((attempt++))
    done

    print_error "InvenTree failed to start within $(($max_attempts * 5)) seconds"
    return 1
}

# Function to setup environment
setup_environment() {
    print_status "Setting up test environment..."

    # Create .env.test if it doesn't exist
    if [ ! -f ".env.test" ]; then
        print_status "Creating .env.test file..."
        cat > .env.test << EOF
# InvenTree API Configuration
INVENTREE_URL=http://localhost:8000
TEST_USER=admin
TEST_PASSWORD=admin

# Test Configuration
HEADLESS=true
SLOW_MO=0
TIMEOUT=30000

# Parallel execution
WORKERS=4
EOF
        print_success "Created .env.test file"
    else
        print_status ".env.test file already exists"
    fi

    # Check if Docker is available
    if command_exists docker; then
        print_status "Docker is available"

        # Check if docker-compose is available
        if command_exists docker-compose; then
            print_status "docker-compose is available"
        else
            print_warning "docker-compose not found. Please install docker-compose or use 'docker compose' (Docker Compose V2)"
        fi
    else
        print_error "Docker is not installed. Please install Docker to run InvenTree."
        exit 1
    fi

    # Check if Node.js is available
    if command_exists node; then
        print_status "Node.js is available"
    else
        print_error "Node.js is not installed. Please install Node.js 16+."
        exit 1
    fi

    # Check if npm is available
    if command_exists npm; then
        print_status "npm is available"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Function to start InvenTree
start_inventree() {
    print_status "Starting InvenTree with Docker Compose..."

    # Check if container is already running
    if docker ps | grep -q inventree-api-test; then
        print_warning "InvenTree container is already running"
        return 0
    fi

    # Start InvenTree
    if command_exists docker-compose; then
        docker-compose up -d
    else
        docker compose up -d
    fi

    # Wait for InvenTree to be ready
    wait_for_inventree "http://localhost:8000"
}

# Function to stop InvenTree
stop_inventree() {
    print_status "Stopping InvenTree..."

    if command_exists docker-compose; then
        docker-compose down
    else
        docker compose down
    fi

    print_success "InvenTree stopped"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing npm dependencies..."

    if [ ! -d "node_modules" ]; then
        npm install
        print_success "Dependencies installed"
    else
        print_status "Dependencies already installed"
    fi

    # Install Playwright browsers
    print_status "Installing Playwright browsers..."
    npx playwright install
    print_success "Playwright browsers installed"
}

# Function to run tests
run_tests() {
    local test_filter="$1"
    local workers="$2"

    print_status "Running API tests..."

    # Set environment variables
    export INVENTREE_URL="${INVENTREE_URL:-http://localhost:8000}"
    export TEST_USER="${TEST_USER:-admin}"
    export TEST_PASSWORD="${TEST_PASSWORD:-admin}"

    # Build test command
    local cmd="npx playwright test tests/inventree-parts-api.spec.ts --reporter=line"

    if [ -n "$test_filter" ]; then
        cmd="$cmd -g \"$test_filter\""
    fi

    if [ -n "$workers" ]; then
        cmd="$cmd --workers=$workers"
    fi

    print_status "Executing: $cmd"

    # Run the tests
    eval "$cmd"
    local exit_code=$?

    if [ $exit_code -eq 0 ]; then
        print_success "All tests passed!"
    else
        print_error "Some tests failed. Exit code: $exit_code"
    fi

    return $exit_code
}

# Function to show usage
show_usage() {
    cat << EOF
InvenTree API Test Runner

Usage: $0 [COMMAND] [OPTIONS]

Commands:
    setup          Setup the test environment
    start          Start InvenTree instance
    stop           Stop InvenTree instance
    install        Install dependencies
    test           Run all API tests
    smoke          Run smoke tests (CRUD only)
    clean          Clean up test environment

Options:
    --filter FILTER    Run tests matching filter (grep pattern)
    --workers NUM      Number of parallel workers (default: 4)
    --headed           Run tests in headed mode (show browser)
    --debug            Run tests in debug mode
    --help             Show this help message

Examples:
    $0 setup                    # Setup environment
    $0 start                    # Start InvenTree
    $0 test                     # Run all tests
    $0 test --filter "CRUD"     # Run CRUD tests only
    $0 smoke                    # Run smoke tests
    $0 stop                     # Stop InvenTree

Environment Variables:
    INVENTREE_URL       InvenTree base URL (default: http://localhost:8000)
    TEST_USER           Test username (default: admin)
    TEST_PASSWORD       Test password (default: admin)

EOF
}

# Main script logic
main() {
    local command="$1"
    shift

    case "$command" in
        setup)
            setup_environment
            install_dependencies
            ;;
        start)
            setup_environment
            start_inventree
            ;;
        stop)
            stop_inventree
            ;;
        install)
            install_dependencies
            ;;
        test)
            local filter=""
            local workers=""
            local headed=false
            local debug=false

            while [[ $# -gt 0 ]]; do
                case $1 in
                    --filter)
                        filter="$2"
                        shift 2
                        ;;
                    --workers)
                        workers="$2"
                        shift 2
                        ;;
                    --headed)
                        headed=true
                        shift
                        ;;
                    --debug)
                        debug=true
                        shift
                        ;;
                    *)
                        print_error "Unknown option: $1"
                        show_usage
                        exit 1
                        ;;
                esac
            done

            if [ "$headed" = true ]; then
                export HEADLESS=false
            fi

            if [ "$debug" = true ]; then
                export PWDEBUG=1
            fi

            setup_environment
            start_inventree
            run_tests "$filter" "$workers"
            ;;
        smoke)
            shift
            setup_environment
            start_inventree
            run_tests "CRUD" "1"
            ;;
        clean)
            print_status "Cleaning up test environment..."
            stop_inventree
            rm -rf test-results
            print_success "Cleanup complete"
            ;;
        --help|-h)
            show_usage
            ;;
        "")
            # Default action: setup, start, and run tests
            setup_environment
            install_dependencies
            start_inventree
            run_tests
            ;;
        *)
            print_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
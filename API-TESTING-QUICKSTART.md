# InvenTree API Testing Suite - Quick Start Guide

## 🎯 Overview

This project provides a comprehensive API testing solution for InvenTree Parts and Part Categories using Playwright. The suite includes both manual test cases and automated Playwright tests covering CRUD operations, validation, filtering, and edge cases.

## 📁 Project Structure

```
PlayWrightMCP/
├── tests/
│   ├── inventree-parts-api.spec.ts          # Automated Playwright tests
│   ├── inventree-parts-api-manual-tests.md  # Manual test specifications
│   ├── README-API-TESTING.md               # Comprehensive testing guide
│   └── pageObjects/
│       └── partDocsPage.ts                  # Page object for documentation
├── docker-compose.yml                       # InvenTree Docker setup
├── run-api-tests.sh                         # Linux/Mac test runner
├── run-api-tests.bat                        # Windows test runner
├── package.json                             # Updated with test scripts
└── playwright.config.ts                     # Playwright configuration
```

## 🚀 Quick Start (Windows)

### 1. Prerequisites
- **Docker Desktop** installed and running
- **Node.js 16+** installed
- **Git** for cloning repositories

### 2. Setup Environment
```batch
# Clone and setup the project
git clone <your-repo-url>
cd PlayWrightMCP

# Run setup script (installs dependencies and configures environment)
run-api-tests.bat setup
```

### 3. Start InvenTree Instance
```batch
# Start InvenTree with Docker
run-api-tests.bat start
```

### 4. Run Tests
```batch
# Run all API tests
run-api-tests.bat test

# Or use npm scripts
npm test
```

### 5. View Results
```batch
# View HTML test report
npm run report
```

## 🐧 Quick Start (Linux/Mac)

### 1. Prerequisites
- **Docker** installed and running
- **Node.js 16+** installed
- **Git** for cloning repositories

### 2. Setup Environment
```bash
# Clone and setup the project
git clone <your-repo-url>
cd PlayWrightMCP

# Run setup script
./run-api-tests.sh setup
```

### 3. Start InvenTree Instance
```bash
# Start InvenTree with Docker
./run-api-tests.sh start
```

### 4. Run Tests
```bash
# Run all API tests
./run-api-tests.sh test

# Or use npm scripts
npm test
```

## 📋 Test Coverage

### ✅ Automated Tests (`inventree-parts-api.spec.ts`)
- **Authentication**: Token acquisition and validation
- **CRUD Operations**: Create, Read, Update, Delete for Parts and Categories
- **Validation**: Required fields, length limits, uniqueness, data types
- **Filtering & Search**: Category filtering, status filtering, text search, pagination
- **Relational Integrity**: Category relationships, foreign key constraints
- **Edge Cases**: Invalid payloads, unauthorized access, non-existent resources
- **Data-Driven Tests**: Parameterized test cases with multiple scenarios

### ✅ Manual Tests (`inventree-parts-api-manual-tests.md`)
- **50+ detailed test cases** with step-by-step instructions
- **Comprehensive coverage** of all API functionality
- **Success criteria** and expected results for each test
- **Execution guidelines** and prerequisites

## 🛠️ Available Commands

### Test Execution
```batch
# Windows
run-api-tests.bat test                    # Run all tests
run-api-tests.bat test --filter "CRUD"   # Run specific tests
run-api-tests.bat smoke                  # Run smoke tests (CRUD only)
run-api-tests.bat test --headed          # Run with browser UI
run-api-tests.bat test --debug           # Debug mode

# npm scripts (cross-platform)
npm test                                 # Run all tests
npm run test:smoke                      # Smoke tests
npm run test:headed                     # Headed mode
npm run test:debug                      # Debug mode
npm run test:ui                         # UI mode
```

### Environment Management
```batch
# Windows
run-api-tests.bat setup                 # Setup environment
run-api-tests.bat start                 # Start InvenTree
run-api-tests.bat stop                  # Stop InvenTree
run-api-tests.bat clean                 # Clean up

# npm scripts
npm run setup                          # Setup environment
npm run start:inventree                # Start InvenTree
npm run stop:inventree                 # Stop InvenTree
```

## 🔧 Configuration

### Environment Variables
Create a `.env.test` file or set environment variables:

```bash
# InvenTree Configuration
INVENTREE_URL=http://localhost:8000
TEST_USER=admin
TEST_PASSWORD=admin

# Test Configuration
HEADLESS=true          # false for headed mode
WORKERS=4             # Parallel workers
TIMEOUT=30000         # Test timeout in ms
SLOW_MO=0             # Slow motion delay
```

### Docker Configuration
The `docker-compose.yml` provides:
- **InvenTree latest** image
- **SQLite database** for testing
- **Admin user**: admin/admin
- **Port mapping**: 8000
- **Persistent volumes** for data

## 📊 Test Results

### HTML Report
```batch
npm run report
```
Opens interactive HTML report with:
- Test execution timeline
- Screenshots and videos
- Detailed error messages
- Performance metrics

### JSON/JUnit Reports
```batch
npm run test:ci
```
Generates:
- `test-results/results.json` - Detailed JSON results
- `test-results/results.xml` - JUnit XML for CI/CD
- `test-results/index.html` - HTML report

## 🔍 Debugging Tests

### Debug Mode
```batch
# Step through tests interactively
run-api-tests.bat test --debug

# Or use UI mode
npm run test:ui
```

### Common Issues

#### ❌ "InvenTree not ready"
```batch
# Check if Docker is running
docker ps

# Restart InvenTree
run-api-tests.bat stop
run-api-tests.bat start
```

#### ❌ "401 Unauthorized"
```batch
# Check credentials in .env.test
TEST_USER=admin
TEST_PASSWORD=admin
```

#### ❌ "Connection refused"
```batch
# Verify InvenTree URL
curl http://localhost:8000/api/
```

#### ❌ "Test timeout"
```batch
# Increase timeout
set TIMEOUT=60000
run-api-tests.bat test
```

## 📚 Documentation

### Comprehensive Guides
- **[API Testing Guide](tests/README-API-TESTING.md)** - Complete testing documentation
- **[Manual Test Cases](tests/inventree-parts-api-manual-tests.md)** - Detailed manual test specifications
- **[Playwright Config](playwright.config.ts)** - Test framework configuration

### API Resources
- **InvenTree API Docs**: https://docs.inventree.org/en/stable/api/
- **Playwright Docs**: https://playwright.dev/docs/api-testing
- **Docker Compose**: https://docs.docker.com/compose/

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: API Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Setup Docker
        run: docker --version
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Start InvenTree
        run: docker compose up -d
      - name: Wait for InvenTree
        run: |
          timeout 300 bash -c 'until curl -f http://localhost:8000/api/; do sleep 5; done'
      - name: Run tests
        run: npm run test:ci
      - name: Upload results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: test-results/
```

## 🎯 Test Categories Summary

| Category | Tests | Coverage |
|----------|-------|----------|
| Authentication | 2 | Token & Basic auth |
| CRUD Parts | 8 | Create, Read, Update, Delete |
| CRUD Categories | 8 | Create, Read, Update, Delete |
| Validation | 5 | Required, length, uniqueness, types |
| Filtering | 6 | Category, status, search, pagination |
| Relations | 5 | Categories, locations, suppliers |
| Edge Cases | 8 | Invalid data, auth, resources |
| Data-Driven | 3 | Parameterized scenarios |
| **Total** | **45+** | **Complete API coverage** |

## ⏱️ Performance Benchmarks

- **Full test suite**: 5-10 minutes
- **CRUD only**: 2-3 minutes
- **Single test**: 10-30 seconds
- **Parallel execution**: 4 workers recommended

## 🤝 Contributing

### Adding New Tests
1. **Manual tests**: Add to `inventree-parts-api-manual-tests.md`
2. **Automated tests**: Add to `inventree-parts-api.spec.ts`
3. **Update documentation**: Modify `README-API-TESTING.md`
4. **Test locally**: Run `npm run test:smoke`

### Code Standards
- Use TypeScript for type safety
- Follow Playwright best practices
- Include proper error handling
- Add descriptive test names
- Document test objectives

---

## 📞 Support

### Getting Help
1. **Check the logs**: `docker logs inventree-api-test`
2. **View test output**: `npm run report`
3. **Debug mode**: `npm run test:debug`
4. **Manual verification**: Follow steps in manual test guide

### Common Commands Reference
```batch
# Quick validation
run-api-tests.bat smoke

# Full test run
run-api-tests.bat test

# Clean restart
run-api-tests.bat clean && run-api-tests.bat setup && run-api-tests.bat start && run-api-tests.bat test

# Debug specific test
run-api-tests.bat test --filter "Create basic part" --debug
```

---

**Ready to test?** Run `run-api-tests.bat setup` to get started! 🚀
# InvenTree API Testing with Playwright

## Overview

This document provides comprehensive guidance for running the InvenTree Parts API automation tests using Playwright. The test suite covers CRUD operations, validation, filtering, and edge cases for both Parts and Part Categories.

## Prerequisites

### System Requirements
- Node.js 16+
- npm or yarn
- Docker (for running InvenTree instance)
- Git

### InvenTree Instance Setup

#### Option 1: Docker Setup (Recommended)

1. **Clone InvenTree repository:**
```bash
git clone https://github.com/inventree/InvenTree.git
cd InvenTree
```

2. **Start InvenTree with Docker:**
```bash
# Quick development setup
docker run -p 8000:8000 --name inventree-dev \
  -e INVENTREE_DEBUG=True \
  -e INVENTREE_DB_ENGINE=sqlite3 \
  -e INVENTREE_ADMIN_USER=admin \
  -e INVENTREE_ADMIN_PASSWORD=admin \
  -e INVENTREE_ADMIN_EMAIL=admin@example.com \
  inventree/inventree:latest

# Or use docker-compose for full setup
docker-compose up -d
```

3. **Verify InvenTree is running:**
```bash
curl http://localhost:8000/api/
```

#### Option 2: Local Development Setup

1. **Follow InvenTree development setup:**
   - See: https://docs.inventree.org/en/stable/start/bare_dev/

2. **Create admin user:**
```bash
cd InvenTree
python manage.py createsuperuser
```

## Test Environment Setup

### 1. Install Dependencies

```bash
# Navigate to your test project
cd /path/to/your/playwright/project

# Install Playwright and dependencies
npm install -D @playwright/test
npm install -D dotenv  # For environment variables

# Install Playwright browsers
npx playwright install
```

### 2. Environment Configuration

Create a `.env.test` file in your project root:

```bash
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
```

### 3. Playwright Configuration

Update `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  workers: process.env.WORKERS ? parseInt(process.env.WORKERS) : 4,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['line']
  ],
  use: {
    baseURL: process.env.INVENTREE_URL || 'http://localhost:8000',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    actionTimeout: 0,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'api-tests',
      testDir: './tests',
      testMatch: '**/inventree-parts-api.spec.ts',
      use: {
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS !== 'false',
        slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
      },
    },
  ],
});
```

## Running the Tests

### Quick Start Commands

```bash
# Run all API tests
npm test

# Run with verbose output
npx playwright test tests/inventree-parts-api.spec.ts --reporter=line

# Run in headed mode (see browser)
HEADLESS=false npx playwright test tests/inventree-parts-api.spec.ts

# Run specific test
npx playwright test tests/inventree-parts-api.spec.ts -g "Create basic part"

# Run with debug mode
npx playwright test tests/inventree-parts-api.spec.ts --debug

# Run with UI mode
npx playwright test tests/inventree-parts-api.spec.ts --ui
```

### Test Execution Modes

#### Development Mode
```bash
# Run tests with maximum verbosity
npx playwright test tests/inventree-parts-api.spec.ts \
  --reporter=line \
  --workers=1 \
  --headed \
  --slow-mo=100
```

#### CI/CD Mode
```bash
# Run tests optimized for CI
CI=true npx playwright test tests/inventree-parts-api.spec.ts \
  --workers=4 \
  --reporter=json,junit,html \
  --output=test-results
```

#### Smoke Test (Quick Validation)
```bash
# Run only critical CRUD tests
npx playwright test tests/inventree-parts-api.spec.ts \
  -g "CRUD" \
  --workers=1
```

### Parallel Execution

```bash
# Run with different worker counts
npx playwright test --workers=1   # Sequential
npx playwright test --workers=4   # Parallel (default)
npx playwright test --workers=8   # High parallel
```

## Test Reports and Results

### HTML Report
```bash
# Generate and view HTML report
npx playwright show-report

# Or specify custom report directory
npx playwright show-report test-results
```

### JSON Report
```bash
# View JSON results
cat test-results/results.json | jq '.'
```

### JUnit XML (for CI/CD)
```bash
# View XML results
cat test-results/results.xml
```

## Test Organization

### Test Structure
```
tests/
├── inventree-parts-api.spec.ts     # Main API test suite
├── inventree-parts-api-manual-tests.md  # Manual test cases
└── README-API-TESTING.md          # This file
```

### Test Categories

#### Authentication Tests
- Token acquisition
- Invalid credentials handling

#### CRUD Operations
- **Parts:** Create, Read, Update, Delete
- **Categories:** Create, Read, Update, Delete with hierarchy

#### Validation Tests
- Required fields
- Field length limits
- Uniqueness constraints
- Data type validation

#### Filtering & Search
- Category filtering
- Status filtering (active/inactive)
- Text search
- Pagination

#### Relational Integrity
- Category relationships
- Foreign key constraints
- Cascade operations

#### Edge Cases
- Invalid payloads
- Unauthorized access
- Non-existent resources
- Special characters
- Boundary values

#### Data-Driven Tests
- Parameterized test cases
- Multiple scenarios with single test

## Debugging Tests

### Debug Mode
```bash
# Run specific test in debug mode
npx playwright test tests/inventree-parts-api.spec.ts \
  -g "Create basic part" \
  --debug
```

### Step-by-Step Execution
```bash
# Use UI mode for interactive debugging
npx playwright test tests/inventree-parts-api.spec.ts --ui
```

### Logging and Tracing

Enable detailed logging in your test:

```typescript
// Add to test file
test.use({
  launchOptions: {
    slowMo: 100,
  },
});

// Add console logging
console.log('API Response:', await response.json());
```

### Common Issues

#### Connection Issues
```bash
# Test API connectivity
curl -X GET http://localhost:8000/api/ \
  -H "Authorization: Token YOUR_TOKEN"

# Check InvenTree logs
docker logs inventree-dev
```

#### Authentication Issues
```bash
# Get token manually
curl -X POST http://localhost:8000/api/user/token/ \
  -d "username=admin&password=admin"
```

#### Test Data Conflicts
- Tests create unique data with timestamps
- Automatic cleanup removes test data
- Run tests in isolation to avoid conflicts

## Performance Optimization

### Test Execution Time
- **Full suite:** ~5-10 minutes
- **CRUD only:** ~2-3 minutes
- **Single test:** ~10-30 seconds

### Optimization Tips
```bash
# Increase timeout for slow networks
TIMEOUT=60000 npx playwright test

# Reduce workers for resource-constrained environments
npx playwright test --workers=2

# Skip slow tests in development
npx playwright test --grep-invert "slow"
```

## CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/api-tests.yml`:

```yaml
name: API Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  api-tests:
    runs-on: ubuntu-latest

    services:
      inventree:
        image: inventree/inventree:latest
        ports:
          - 8000:8000
        env:
          INVENTREE_DEBUG: True
          INVENTREE_DB_ENGINE: sqlite3
          INVENTREE_ADMIN_USER: admin
          INVENTREE_ADMIN_PASSWORD: admin
          INVENTREE_ADMIN_EMAIL: admin@example.com

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Install Playwright
      run: npx playwright install --with-deps

    - name: Wait for InvenTree
      run: |
        timeout 300 bash -c 'until curl -f http://localhost:8000/api/; do sleep 5; done'

    - name: Run API tests
      run: npm run test:ci
      env:
        INVENTREE_URL: http://localhost:8000

    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: test-results/
```

### Package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "test": "playwright test tests/inventree-parts-api.spec.ts",
    "test:ci": "playwright test tests/inventree-parts-api.spec.ts --workers=2 --reporter=json,junit,html",
    "test:debug": "playwright test tests/inventree-parts-api.spec.ts --debug",
    "test:ui": "playwright test tests/inventree-parts-api.spec.ts --ui",
    "test:smoke": "playwright test tests/inventree-parts-api.spec.ts -g 'CRUD'",
    "report": "playwright show-report"
  }
}
```

## Advanced Configuration

### Custom Test Fixtures

Create `tests/fixtures.ts`:

```typescript
import { test as base } from '@playwright/test';

type TestFixtures = {
  authToken: string;
  testCategory: { id: number; name: string };
};

export const test = base.extend<TestFixtures>({
  authToken: async ({ request }, use) => {
    const response = await request.post('/api/user/token/', {
      data: { username: 'admin', password: 'admin' }
    });
    const data = await response.json();
    await use(data.token);
  },

  testCategory: async ({ request, authToken }, use) => {
    const response = await request.post('/api/part/category/', {
      headers: { 'Authorization': `Token ${authToken}` },
      data: { name: `Test Category ${Date.now()}` }
    });
    const data = await response.json();

    await use({ id: data.pk, name: data.name });

    // Cleanup
    await request.delete(`/api/part/category/${data.pk}/`, {
      headers: { 'Authorization': `Token ${authToken}` }
    });
  },
});
```

### Global Setup/Teardown

Create `tests/global-setup.ts`:

```typescript
import { request } from '@playwright/test';

async function globalSetup() {
  // Setup code here
  console.log('Global setup for API tests');
}

export default globalSetup;
```

## Troubleshooting

### Common Error Messages

#### "connect ECONNREFUSED"
- **Cause:** InvenTree not running or wrong URL
- **Fix:** Check `INVENTREE_URL`, verify InvenTree is accessible

#### "401 Unauthorized"
- **Cause:** Invalid credentials or token expired
- **Fix:** Check `TEST_USER`/`TEST_PASSWORD`, get new token

#### "404 Not Found"
- **Cause:** Wrong API endpoint or resource doesn't exist
- **Fix:** Verify endpoint URLs, check InvenTree API docs

#### "400 Bad Request"
- **Cause:** Invalid request data or validation error
- **Fix:** Check request payload, review validation rules

#### "Test timeout"
- **Cause:** Slow network or InvenTree performance
- **Fix:** Increase `TIMEOUT`, check network connectivity

### Network Debugging

```bash
# Enable request logging
DEBUG=pw:api npx playwright test

# Use curl to test manually
curl -X GET http://localhost:8000/api/part/ \
  -H "Authorization: Token YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Database Issues

```bash
# Reset InvenTree database
docker exec inventree-dev python manage.py flush --no-input

# Recreate admin user
docker exec -it inventree-dev python manage.py createsuperuser
```

## Test Maintenance

### Updating Tests for API Changes

1. **Check API schema changes:**
   ```bash
   curl http://localhost:8000/api/schema/ | jq .
   ```

2. **Update test expectations** based on schema changes

3. **Run regression tests** to ensure no breaking changes

### Adding New Test Cases

1. **Identify new functionality** in InvenTree
2. **Add manual test case** to `inventree-parts-api-manual-tests.md`
3. **Implement automated test** in `inventree-parts-api.spec.ts`
4. **Update fixtures** if needed

## Performance Benchmarks

### Test Execution Times (approximate)
- Authentication tests: 2-5 seconds
- Single CRUD operation: 5-15 seconds
- Full validation suite: 2-3 minutes
- Complete test suite: 5-10 minutes

### Resource Usage
- Memory: ~100-200MB per worker
- CPU: ~10-20% per worker
- Network: ~50-100KB per test

## Security Considerations

### Test Data
- Tests create temporary data with unique identifiers
- Automatic cleanup prevents data accumulation
- No sensitive production data used

### Authentication
- Use dedicated test user accounts
- Rotate tokens regularly in production
- Never commit real credentials to version control

### Network Security
- Run tests in isolated network segments
- Use HTTPS in production environments
- Implement proper firewall rules

## Contributing

### Code Standards
- Use TypeScript for type safety
- Follow Playwright best practices
- Include proper error handling
- Add descriptive test names and comments

### Documentation
- Update this guide when adding new tests
- Document any new dependencies or setup steps
- Include examples for common scenarios

---

## Quick Reference

### Run Tests
```bash
npm test                    # All tests
npm run test:smoke         # Quick validation
npm run test:debug         # Debug mode
npm run report             # View results
```

### Environment Variables
```bash
INVENTREE_URL=http://localhost:8000
TEST_USER=admin
TEST_PASSWORD=admin
HEADLESS=true
WORKERS=4
```

### Useful Commands
```bash
# Check InvenTree status
curl http://localhost:8000/api/

# Get API token
curl -X POST http://localhost:8000/api/user/token/ \
  -d "username=admin&password=admin"

# View test results
npx playwright show-report
```

---

**Last Updated:** March 2026
**Test Framework:** Playwright v1.40+
**InvenTree Version:** 0.15.0+
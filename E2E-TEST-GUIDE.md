# InvenTree Parts E2E Test Execution Guide

## Overview

This guide covers automated UI testing for InvenTree Parts functionality using **Playwright Framework**. The test suite includes:

- ✅ **Phase 1 Smoke Tests** (8 critical test cases)
- ✅ **Cross-Functional E2E Workflows** (1 complete flow)
- ✅ **Attribute Management Tests** (2 attribute tests)
- ✅ **Edge Case & Stress Tests** (2 edge case tests)
- ✅ **Navigation & UI Tests** (2 UI flow tests)

**Total:** 15+ automated test cases with robust selectors and assertions

---

## Architecture

### Page Object Model (POM)
**File:** `pageObjects/partsPOM.ts`

Provides centralized, reusable selectors and actions:

```typescript
// Flexible multi-selector strategy for robustness
const nameField = await page.waitForSelector(
  'input[name="name"], input[id*="name"], [data-test="name-input"]'
);

// Method-based actions
await pom.fillPartCreationForm({ name, ipn, description });
await pom.submitPartForm();
await pom.openTab('Stock');
```

**Key Methods:**
- `login()` - Robust multi-selector login
- `fillPartCreationForm()` - Smart form filling
- `createStockItem()` - Stock creation with multiple location strategies
- `addParameter()` - Parameter management
- `getStockTableData()` - Data extraction
- `verifyPartCreated()` - Assertion helpers

### Test Suite
**File:** `inventree-parts-e2e.spec.ts`

Comprehensive tests organized by category with detailed logging:

```typescript
// Phase 1 Smoke Tests
test('TC-PC-001: Create basic part with minimal fields')
test('TC-PC-002: Create part with all field values')
test('TC-PD-001: Display part detail view')

// Cross-Functional E2E
test('Cross-Functional E2E: Create Part → Add Parameters → Create Stock')

// Attribute Tests
test('TC-ATTR-ASSEMBLY-001: Enable assembly attribute')
test('TC-ATTR-TRACKABLE-001: Enable trackable attribute')
```

---

## Setup

### Prerequisites

```bash
# Node.js 16+ and npm installed
node --version  # Should be v16+
npm --version

# InvenTree running
curl http://localhost:5000/  # Should return HTML

# Playwright installed
npm install -D @playwright/test
```

### Environment Configuration

Create `.env.test` file or set environment variables:

```bash
# InvenTree Instance
export INVENTREE_URL='http://localhost:5000'
export TEST_USER='admin'
export TEST_PASSWORD='admin'

# Playwright Options
export HEADED='false'        # Set to 'true' to see browser
export SLOW_MO='0'          # Millisecond delay between actions
export DEBUG='pw:api'       # Enable debug logging (optional)
```

### Install Dependencies

```bash
cd c:\git\PlayWrightMCP

# Install Playwright and browsers
npm install -D @playwright/test

# Download browsers (one-time)
npx playwright install
```

---

## Running Tests

### Quick Start (All Tests)

```bash
# Run all tests
npx playwright test tests/inventree-parts-e2e.spec.ts

# Run with UI mode (recommended for first run)
npx playwright test tests/inventree-parts-e2e.spec.ts --ui

# Run in headed mode (see browser)
npx playwright test tests/inventree-parts-e2e.spec.ts --headed
```

### Phase 1 Smoke Tests Only

```bash
# Run just the critical path tests
npx playwright test tests/inventree-parts-e2e.spec.ts -g "TC-PC-001|TC-PC-002|TC-PD-001|TC-ATTR-ACTIVE-001|TC-NEG-001"

# Estimated time: 5-10 minutes
```

### Specific Test Groups

```bash
# Run CRUD tests only
npx playwright test tests/inventree-parts-e2e.spec.ts -g "Create part|Part detail"

# Run cross-functional tests
npx playwright test tests/inventree-parts-e2e.spec.ts -g "Cross-Functional"

# Run edge case tests
npx playwright test tests/inventree-parts-e2e.spec.ts -g "Edge Case"

# Run attribute tests
npx playwright test tests/inventree-parts-e2e.spec.ts -g "TC-ATTR"
```

### Browser-Specific Testing

```bash
# Chromium only
npx playwright test tests/inventree-parts-e2e.spec.ts --project=chromium

# Firefox only
npx playwright test tests/inventree-parts-e2e.spec.ts --project=firefox

# Safari (macOS only)
npx playwright test tests/inventree-parts-e2e.spec.ts --project=webkit

# All browsers (parallel)
npx playwright test tests/inventree-parts-e2e.spec.ts
```

### Debug Mode

```bash
# Run tests with Playwright Inspector
npx playwright test tests/inventree-parts-e2e.spec.ts --debug

# Takes you through each step interactively
# Then run: npx playwright show-report
```

### Watch Mode (for TDD)

```bash
# Re-run tests on file changes
npx playwright test tests/inventree-parts-e2e.spec.ts --watch
```

---

## Test Reports

### HTML Report (Most Useful)

```bash
# Generate after test run
npx playwright show-report

# Opens interactive HTML report with:
# - Screenshots on failure
# - Videos of test execution
# - Detailed error traces
# - Test duration and status
```

### Command-Line Report

```bash
# View results in terminal
npx playwright test tests/inventree-parts-e2e.spec.ts --reporter=line

# Verbose output
npx playwright test tests/inventree-parts-e2e.spec.ts --reporter=list
```

### JSON Report

```bash
# Machine-readable results
cat test-results/results.json

# Parse with jq
jq '.suites[].tests[] | select(.status=="failed")' test-results/results.json
```

---

## Test Execution Plans

### Plan A: Quick Validation (5-10 min)

```bash
# Just critical path
npx playwright test tests/inventree-parts-e2e.spec.ts \
  -g "Create basic part|Create part with all|Part detail|duplicate IPN" \
  --project=chromium \
  --headed
```

**Coverage:** Part CRUD, validation, constraints

### Plan B: Standard Testing (20-30 min)

```bash
# Phase 1 + attributes + cross-functional
npx playwright test tests/inventree-parts-e2e.spec.ts \
  -g "TC-PC-|TC-PD-|TC-ATTR-|Cross-Functional" \
  --project=chromium \
  --headed

# Then view report
npx playwright show-report
```

**Coverage:** Creation, detail view, attributes, end-to-end flow

### Plan C: Comprehensive Testing (40-60 min)

```bash
# All tests, all browsers
npx playwright test tests/inventree-parts-e2e.spec.ts

# View results
npx playwright show-report
```

**Coverage:** All tests on Chrome, Firefox, Safari

### Plan D: CI/CD Pipeline

```bash
# Non-headed, with detailed reporting
CI=true npx playwright test tests/inventree-parts-e2e.spec.ts \
  --reporter=html \
  --reporter=json \
  --reporter=junit \
  --workers=1
```

**Output:**
- `test-results/html-report/index.html` - HTML report
- `test-results/results.json` - JSON results
- `test-results/junit.xml` - JUnit XML for CI systems

---

## Selector Strategies

### Multi-Selector Fallback Pattern

Tests use robust selector chains to handle UI variations:

```typescript
// Try multiple selectors in order
const element = await page.$(
  'button:has-text("Submit"), ' +
  'button[type="submit"], ' +
  '[data-test="submit-btn"]'
);
```

### Data-Test Attributes (Recommended)

If you control InvenTree frontend, add data-test attributes:

```html
<!-- InvenTree template -->
<input data-test="name-input" name="name" />
<button data-test="submit-btn" type="submit">Submit</button>
```

Then tests use:
```typescript
await page.fill('[data-test="name-input"]', partName);
await page.click('[data-test="submit-btn"]');
```

### Text Content Selectors

Fallback to text matching:
```typescript
await page.click('button:has-text("Create Part")');
await page.click('text="Submit"');
```

---

## Handling Common Issues

### Issue: "Element not found" Errors

**Solution:** Use UI mode to see actual selectors

```bash
npx playwright test tests/inventree-parts-e2e.spec.ts --ui

# In UI mode, hover over elements to see selectors
# Update POM.ts with correct selectors
```

### Issue: Timeout Errors

**Solution:** Increase timeouts for slow networks

```bash
# Update CONFIG in test file
const CONFIG = {
  TIMEOUT: 20000,      // 20 seconds
  WAIT_TIMEOUT: 10000  // 10 seconds
};
```

### Issue: Login Fails

**Solution:** Verify credentials and user permissions

```bash
# Test manually first
curl -X POST http://localhost:5000/api/login \
  -d "username=admin&password=admin"

# Verify user has staff permissions
# Try different username/password in .env
```

### Issue: Form Fields Not Filling

**Solution:** Check if field requires special handling

```typescript
// Try alternative approaches:

// Approach 1: Direct input
await page.fill('input[name="name"]', value);

// Approach 2: Type character by character
await page.click('input[name="name"]');
await page.keyboard.press('Control+A');
await page.keyboard.type(value);

// Approach 3: Use evaluate for hidden/shadow DOM
await page.evaluate((val) => {
  document.querySelector('input[name="name"]').value = val;
}, value);
```

### Issue: Tests Pass Locally but Fail in CI

**Solution:** CI environment issues

```bash
# Add verbose logging
DEBUG=pw:api npm test

# Check network connectivity
# Increase retries: retries: 2
# Reduce workers: workers: 1
# Add delays: waitForTimeout(500)
```

---

## Customization

### Add Custom Test

Add to `inventree-parts-e2e.spec.ts`:

```typescript
test('Custom Test: Your scenario', async ({ page }) => {
  pom = new PartsPOM(page, CONFIG.BASE_URL);
  
  // Your test logic
  await pom.navigateToParts();
  // ... rest of test
});
```

### Add Custom Assertion

Add to `partsPOM.ts`:

```typescript
async verifyCustomCondition(condition: string) {
  const element = await this.page.$(`[data-test="${condition}"]`);
  expect(element).toBeTruthy();
}
```

### Support New UI Element

Update POM selector:

```typescript
// Old
readonly submitBtn = 'button:has-text("Submit")';

// New (more robust)
readonly submitBtn = 'button:has-text("Submit"), button[type="submit"], [data-test="save"]';
```

---

## Performance Benchmarks

Expected test execution times:

| Test | Time | Notes |
|------|------|-------|
| TC-PC-001 (Basic create) | 8-12s | Simple form |
| TC-PC-002 (Full create) | 10-15s | Multiple fields |
| TC-NEG-001 (Duplicate IPN) | 15-20s | Two parts created |
| Cross-Functional E2E | 30-45s | 5 workflow steps |
| **Full Phase 1 Smoke Suite** | 3-5 min | 8 tests, Chromium |
| **All Tests (3 browsers)** | 15-20 min | 15 tests × 3 browsers |

---

## Best Practices

### 1. **Use Explicit Waits**
```typescript
// ✅ Good
await page.waitForSelector('form', { timeout: 5000 });

// ❌ Avoid
await page.waitForTimeout(2000); // Arbitrary delay
```

### 2. **Combine Actions**
```typescript
// ✅ Good
await pom.fillPartCreationForm({ name, ipn });
await pom.submitPartForm();

// ❌ Avoid
await page.fill('...', name);
await page.fill('...', ipn);
await page.click('...');
// (Repeats across many tests)
```

### 3. **Clear Error Handling**
```typescript
// ✅ Good
try {
  await pom.openTab('Parameters');
  await pom.addParameter({ template: 'Voltage', value: '5V' });
} catch (error) {
  console.log('Parameters not available:', error.message);
}

// ❌ Avoid
try {
  await pom.openTab('Parameters');
} catch (e) {}
```

### 4. **Test Dependencies**
```typescript
// ✅ Good
test.describe.serial('Workflow', () => {
  test('Create', async () => { /* ... */ });
  test('Modify', async () => { /* depends on Create */ });
});

// ❌ Avoid
test('Independent-1', () => { /* ... */ });
test('Independent-2', () => { /* depends on Independent-1 */ });
```

### 5. **Data Cleanup**
Use unique identifiers:
```typescript
const timestamp = Date.now();
const partName = `Test-Part-${timestamp}`;
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      inventree:
        image: inventree/inventree:latest
        options: >-
          --health-cmd "curl -f http://localhost:5000/ || exit 1"
          --health-interval 10s
        ports:
          - 5000:5000

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - run: npm ci
      - run: npx playwright install --with-deps
      
      - run: npm test
        env:
          INVENTREE_URL: http://localhost:5000
          TEST_USER: admin
          TEST_PASSWORD: admin
      
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: test-results/html-report/
```

---

## Troubleshooting Checklist

- [ ] Node.js 16+ installed
- [ ] Playwright browsers downloaded (`npx playwright install`)
- [ ] InvenTree running and accessible at `INVENTREE_URL`
- [ ] Test user exists with correct credentials
- [ ] Required part categories exist in InvenTree
- [ ] JSON report shows actual vs expected errors
- [ ] Screenshots captured in test-results/
- [ ] No network connectivity issues
- [ ] Sufficient disk space for videos/screenshots
- [ ] Browser not blocked by firewall

---

## Support & Documentation

- **Playwright Docs:** https://playwright.dev
- **InvenTree Docs:** https://docs.inventree.org
- **Test Spec:** `inventree-parts-spec.md`
- **POM Source:** `pageObjects/partsPOM.ts`

---

**Last Updated:** March 2026  
**Playwright Version:** 1.40+  
**Node.js:** 16 LTS+

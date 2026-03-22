# ⚡ InvenTree Parts E2E Tests - Quick Reference

## 🚀 Get Started in 2 Minutes

```bash
# 1. Install dependencies
npm install -D @playwright/test
npx playwright install

# 2. Set environment
export INVENTREE_URL='http://localhost:5000'
export TEST_USER='admin'
export TEST_PASSWORD='admin'

# 3. Run tests
npx playwright test tests/inventree-parts-e2e.spec.ts --ui
```

---

## 📋 Test Execution Commands

### Basic Commands
```bash
# All tests (all browsers)
npx playwright test tests/inventree-parts-e2e.spec.ts

# Interactive UI mode (recommended for first run)
npx playwright test tests/inventree-parts-e2e.spec.ts --ui

# See browser while testing
npx playwright test tests/inventree-parts-e2e.spec.ts --headed

# Specific browser
npx playwright test tests/inventree-parts-e2e.spec.ts --project=chromium
npx playwright test tests/inventree-parts-e2e.spec.ts --project=firefox
npx playwright test tests/inventree-parts-e2e.spec.ts --project=webkit
```

### Filter Tests
```bash
# By test name
npx playwright test -g "TC-PC-001"

# By pattern
npx playwright test -g "Create part"

# Multiple patterns
npx playwright test -g "Create part|assembly|trackable"

# Exclude pattern
npx playwright test --grep-invert "Edge Case"
```

### Debug & Introspection
```bash
# Playwright Inspector
npx playwright test tests/inventree-parts-e2e.spec.ts --debug

# Trace viewer
npx playwright show-trace test-results/trace.zip

# View HTML report
npx playwright show-report

# List all tests
npx playwright test tests/inventree-parts-e2e.spec.ts --list
```

### CI/CD Commands
```bash
# Single worker, full reporting
CI=true npx playwright test tests/inventree-parts-e2e.spec.ts \
  --workers=1 \
  --reporter=html,json,junit \
  --reporter=line

# With retries
npx playwright test tests/inventree-parts-e2e.spec.ts --retries=2
```

---

## 📊 Test Suite Overview

| Test ID | Name | Type | Time | Status |
|---------|------|------|------|--------|
| TC-PC-001 | Create basic part | CRUD | 8-12s | ✅ |
| TC-PC-002 | Create part (all fields) | CRUD | 10-15s | ✅ |
| TC-PD-001 | Part detail view | Read | 8-10s | ✅ |
| TC-ATTR-ACTIVE-001 | Toggle active/inactive | Attribute | 8-10s | ✅ |
| TC-NEG-001 | Duplicate IPN prevention | Validation | 15-20s | ✅ |
| TC-PC-006 | Form validation | Validation | 5-8s | ✅ |
| TC-UOM-001 | Physical units | Configuration | 8-10s | ✅ |
| TC-ATTR-ASSEMBLY-001 | Assembly attribute | Attribute | 8-10s | ✅ |
| TC-ATTR-TRACKABLE-001 | Trackable attribute | Attribute | 8-10s | ✅ |
| **E2E Cross-Flow** | Create → Params → Stock → Verify | E2E | 30-45s | ✅ |
| Edge Case: Special chars | Special character handling | Edge | 8-10s | ✅ |
| Edge Case: Long description | Long text handling | Edge | 8-10s | ✅ |
| Navigation: Menu flow | Navigation testing | UI | 10-15s | ✅ |
| Responsiveness: Form state | Form interactions | UI | 8-10s | ✅ |

**Total Execution Time:**
- Phase 1 (Smoke): 3-5 minutes
- With Attributes: 5-8 minutes
- Full Suite (1 browser): 10-15 minutes
- All 3 Browsers: 25-35 minutes

---

## 🏗️ File Structure

```
tests/
├── inventree-parts-e2e.spec.ts    ← Main test suite (15+ tests)
├── pageObjects/
│   └── partsPOM.ts                ← Page Object Model (selectors & actions)
│
├── E2E-TEST-GUIDE.md              ← Detailed execution guide
├── inventree-parts-spec.md        ← Full specification (100+ test cases)
├── TEST-CASE-MATRIX.md            ← Test matrix & priorities
└── README-PARTS-TESTING.md        ← Testing overview
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Required
INVENTREE_URL='http://localhost:5000'
TEST_USER='admin'
TEST_PASSWORD='admin'

# Optional
HEADED='true'          # See browser (default: false)
SLOW_MO='100'         # Slow down by 100ms per action
DEBUG='pw:api'        # Enable internal logging
CI='true'             # CI mode (1 worker, no headed)
```

### Timeouts (in test suite)
```typescript
const CONFIG = {
  BASE_URL: 'http://localhost:5000',
  TEST_USER: 'admin',
  TEST_PASSWORD: 'admin',
  TIMEOUT: 10000,        // Per action timeout
  WAIT_TIMEOUT: 5000     // Element wait timeout
};
```

---

## 🧪 Test Scenarios Covered

### ✅ Part CRUD
- [x] **CREATE:** Basic, full form, with IPN, with description
- [x] **READ:** Detail view, tab navigation, field display
- [x] **UPDATE:** Edit fields, toggle attributes, save changes
- [x] **DELETE:** (Covered in negative tests)

### ✅ Validation & Constraints
- [x] Required field validation
- [x] Duplicate IPN prevention
- [x] Form field length limits
- [x] Special character handling
- [x] Long text handling

### ✅ Attributes
- [x] Active/Inactive toggle
- [x] Assembly flag & BOM tab appearance
- [x] Trackable flag & serial fields

### ✅ Features
- [x] Units of Measure (physical units)
- [x] Parameters (add/view)
- [x] Stock management
- [x] Category navigation

### ✅ E2E Workflows
- [x] Create Part → Add Parameters → Create Stock → Category Verification

### ✅ Navigation & UI
- [x] Menu navigation
- [x] Form interactions
- [x] Tab switching
- [x] Part list → Detail → List flow

---

## 🚨 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Timeout waiting for element` | Selector wrong or element not in DOM | Use `--ui` mode to inspect, update selector in POM |
| `Login failed` | Wrong credentials | Check `TEST_USER` and `TEST_PASSWORD`, verify user exists |
| `Connection refused` | InvenTree not running | Start InvenTree: `docker run -p 5000:5000 inventree/inventree` |
| `Browser not found` | Playwright browsers not installed | Run `npx playwright install --with-deps` |
| `Form not filling` | Field has different selector | Check actual HTML in `--ui` mode, update POM |
| `Expected but not found` | Assertion failed | Check test logs, screenshot in `test-results/` |
| `Too many retries` | Test flaky/unstable | Add explicit waits, increase timeout, check network |

---

## 📈 Performance Tips

```bash
# Parallel workers (faster, may cause flakiness)
npx playwright test -w 4

# Single worker (slower, more stable)
npx playwright test -w 1

# Skip retries in local development
npx playwright test --retries=0

# Fast chrome only (skip Firefox/Safari)
npx playwright test --project=chromium

# Watch mode for TDD
npx playwright test --watch
```

---

## 🔍 Debug Workflow

### Step 1: Run in UI Mode
```bash
npx playwright test tests/inventree-parts-e2e.spec.ts --ui
```

### Step 2: Inspect Elements
Click elements in UI mode to see selectors and state

### Step 3: Review Test Report
```bash
npx playwright show-report
```

### Step 4: Check Screenshots/Videos
```
test-results/
├── *.png              ← Screenshots
├── *.webm             ← Videos
└── html-report/       ← Full report
```

### Step 5: Update Selectors
If element not found, update `pageObjects/partsPOM.ts`:
```typescript
readonly submitBtn = 'button:has-text("Submit"), ..., [NEW_SELECTOR]';
```

---

## 📦 Project Integration

### Add to package.json
```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "test:report": "playwright show-report"
  }
}
```

### Run from npm
```bash
npm test                    # All tests
npm run test:ui            # UI mode
npm run test:debug         # Inspector
npm run test:report        # View report
```

---

## 🔗 Key Files Reference

| File | Purpose | Key Elements |
|------|---------|--------------|
| `partsPOM.ts` | Page Object Model | Selectors, methods, assertions |
| `inventree-parts-e2e.spec.ts` | Test suite | 15+ test cases |
| `E2E-TEST-GUIDE.md` | Detailed guide | Setup, execution, debugging |
| `inventree-parts-spec.md` | Full spec | 100+ manual test cases |

---

## 🎯 Typical Workflows

### Workflow 1: Quick Validation
```bash
# 1. Check syntax
npm test --list

# 2. Run critical tests
npm test -- -g "TC-PC-001|TC-PC-002|TC-NEG-001"

# 3. View results
npm run test:report
```

### Workflow 2: Full Regression
```bash
# 1. Run all tests
npm test

# 2. Wait for completion (10-15 min)

# 3. Review reports
npm run test:report
```

### Workflow 3: Debugging Failure
```bash
# 1. Identify failing test
# 2. Re-run with UI mode
npm test -- -g "FAILING_TEST" --ui

# 3. Inspect and step through
# 4. Update selectors if needed
# 5. Re-run to verify fix
```

---

## ✨ Tips & Tricks

### Use Grep Filters Effectively
```bash
# Phase 1 smoke tests
npm test -- -g "TC-PC-|TC-PD-|TC-NEG-001"

# All attribute tests
npm test -- -g "TC-ATTR-"

# All cross-functional tests
npm test -- -g "Cross-Functional"

# Everything except edge cases
npm test -- --grep-invert "Edge Case"
```

### Test Specific Parts
```bash
# Only creation tests
npm test -- -g "Create"

# Only validation tests
npm test -- -g "validation|prevent"

# Only UI/navigation tests
npm test -- -g "Navigation|Menu"
```

### Run Faster Locally
```bash
# Single browser, no retries
npx playwright test -w 1 --project=chromium --retries=0
```

### Capture Evidence
```bash
# Videos are saved by default on failure
ls test-results/*.webm

# Manual screenshot in test
await page.screenshot({ path: 'screenshot.png' });
```

---

## 📞 Support

**Documentation:**
- [Playwright Docs](https://playwright.dev)
- [InvenTree Docs](https://docs.inventree.org)
- [Full Test Spec](inventree-parts-spec.md)

**Quick Help:**
```bash
# List all tests
npx playwright test --list

# Show available projects
npx playwright test --list-projects

# Full help
npx playwright test --help
```

---

**Last Updated:** March 2026 | **Version:** 1.0

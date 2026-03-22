# InvenTree Parts Test Suite

## Overview

This test suite provides comprehensive manual and automated testing coverage for **InvenTree Parts functionality**. It's based on the detailed test specification (`inventree-parts-spec.md`) and includes both test case documentation and Playwright automation framework.

## Files in This Suite

### 1. `inventree-parts-spec.md`
**Comprehensive Test Specification** covering:
- **Part Creation Tests** (20 test cases)
  - Manual entry with various field combinations
  - Form validation
  - Import workflows (CSV, supplier plugins)
  
- **Part Detail View Tests** (25+ test cases)
  - All tabs: Stock, BOM, Allocations, Build Orders, Variants, Parameters, Revisions, Attachments, Notes, Test Templates, etc.
  - Field editing and display
  - Image upload
  
- **Part Categories & Filtering Tests** (5 test cases)
  - Hierarchical category structure
  - Parametric tables
  - Search and filtering
  
- **Part Attributes Tests** (25+ test cases)
  - Template, Assembly, Component, Virtual
  - Trackable, Purchaseable, Salable
  - Active/Inactive status
  - Constraints and interactions
  
- **Units of Measure Tests** (5 test cases)
  - Physical units (meters, feet, kg, etc.)
  - UOM conversion and compatibility
  - Supplier part UOM
  
- **Part Revisions Tests** (12 test cases)
  - Revision creation and navigation
  - Circular reference prevention
  - Template constraints
  - Settings configuration
  
- **Negative & Boundary Tests** (20+ test cases)
  - Duplicate constraints
  - Inactive part restrictions
  - Locked part enforcement
  - Edge cases and boundary values

### 2. `inventree-parts.spec.ts`
**Playwright Automation Framework** with:
- Automated test implementations for key test cases
- Helper functions for common operations
- Page object patterns for maintainability
- Environment-based configuration
- Test fixtures and setup/teardown

## Test Coverage Summary

| Category | Manual Tests | Automated | Priority |
|----------|------------|-----------|----------|
| Part Creation | 8 | 3 | Critical |
| Detail View | 25 | 4 | Critical |
| Categories | 5 | 2 | Medium |
| Attributes | 25 | 4 | High |
| Units of Measure | 5 | 2 | Medium |
| Revisions | 12 | 2 | High |
| Negative Cases | 20 | 3 | High |
| **Total** | **100+** | **20** | - |

## Prerequisites

### For Manual Testing
- InvenTree instance running (local or test environment)
- Admin or staff user account with part creation permissions
- Test data setup (see Data Setup section)
- Browser(s) for testing (Chrome, Firefox, Safari)

### For Automated Testing
- Node.js 16+ and npm
- Playwright installed (`npm install -D @playwright/test`)
- InvenTree test instance running
- Environment variables configured (see Setup section)

## Setup

### Environment Configuration

Create a `.env.test` file or set environment variables:

```bash
# InvenTree Test Instance
INVENTREE_URL=http://localhost:5000
TEST_USER=admin
TEST_PASSWORD=admin

# Playwright Configuration
BROWSER=chromium
HEADED=false
SLOW_MO=0
```

### Test Data Preparation

Before executing tests, ensure the following test data exists:

```sql
-- Categories
INSERT INTO part_category (name, description, parent)
VALUES 
  ('Electronic Components', 'Main category', NULL),
  ('Resistors', 'Fixed resistors', 1),
  ('Capacitors', 'Capacitive components', 1);

-- Suppliers and Locations
INSERT INTO company (name, type) VALUES ('Test Supplier', 'Supplier');
INSERT INTO stocklocation (name, parent) VALUES ('Warehouse A', NULL);

-- Users
INSERT INTO auth_user (username, email, is_staff) 
VALUES ('testuser', 'test@example.com', 1);
```

## Running Tests

### Manual Test Execution

1. **Navigate to test plan** in the specification
   ```
   inventree-parts-spec.md → Part 1: PART CREATION TESTS → TC-PC-001
   ```

2. **Follow step-by-step instructions** in test case

3. **Document results** with:
   - Pass/Fail status
   - Screenshots of results
   - Any deviations from expected behavior
   - Timestamp and executed by

4. **Log issues** in your tracking system with:
   - Test case ID (TC-XXX-###)
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details

### Automated Test Execution

#### Run all tests
```bash
npx playwright test tests/inventree-parts.spec.ts
```

#### Run specific test suite
```bash
npx playwright test tests/inventree-parts.spec.ts -g "Part Creation"
```

#### Run single test case
```bash
npx playwright test tests/inventree-parts.spec.ts -g "TC-PC-001"
```

#### Run with UI mode (recommended for debugging)
```bash
npx playwright test tests/inventree-parts.spec.ts --ui
```

#### Generate HTML report
```bash
npx playwright show-report
```

#### Run in headed mode (see browser)
```bash
HEADED=true npx playwright test tests/inventree-parts.spec.ts
```

#### Run specific browser
```bash
npx playwright test tests/inventree-parts.spec.ts --project=chromium
```

## Test Execution Plan

### Phase 1: Smoke Testing (Critical Path)
**Execution time:** ~30 minutes
**Test cases:** TC-PC-001, TC-PD-001, TC-REV-001, TC-ATTR-001, TC-NEG-001

```bash
npx playwright test tests/inventree-parts.spec.ts -g "TC-PC-001|TC-PD-001|TC-REV-001"
```

### Phase 2: Core Functionality (High Priority)
**Execution time:** ~2 hours
**Coverage:** Part creation, detail view, attributes, revisions

```bash
npx playwright test tests/inventree-parts.spec.ts -g "Part Creation|Part Detail|Attributes|Revisions"
```

### Phase 3: Comprehensive Testing (All Test Cases)
**Execution time:** 4-6 hours
**Coverage:** All 100+ test cases

```bash
npx playwright test tests/inventree-parts.spec.ts
```

### Phase 4: Regression Testing (Weekly)
**Execution time:** 1-2 hours
**Focus:** Critical functionality and recently modified features

## Test Reporting

### Report Format

Each test execution should include:

| Field | Value |
|-------|-------|
| **Date/Time** | YYYY-MM-DD HH:MM:SS |
| **Executed By** | Name/User ID |
| **Environment** | Version, Browser, OS |
| **Total Tests** | Count |
| **Passed** | Count |
| **Failed** | Count |
| **Skipped** | Count |
| **Pass Rate** | % |

### Generated Reports

Playwright automatically generates reports in:
- HTML report: `playwright-report/index.html`
- JSON: `test-results/results.json`
- Screenshots: `test-results/screenshots/`
- Videos (if enabled): `test-results/videos/`

View HTML report:
```bash
npx playwright show-report
```

## Common Issues & Troubleshooting

### Issue: Tests fail with "Part not found"
**Solution:** Verify InvenTree instance is running and accessible at `INVENTREE_URL`

### Issue: Form fields not being filled
**Solution:** Check selector names match current UI; InvenTree versions may vary selectors

### Issue: Login fails
**Solution:** Verify `TEST_USER` and `TEST_PASSWORD` credentials and user has staff permissions

### Issue: Timeout errors
**Solution:** 
- Increase `timeout` value in test configuration
- Check InvenTree instance performance
- Verify network connectivity

### Issue: "Element not found" errors
**Solution:**
- Run test in UI mode to see actual selectors
- Verify UI hasn't changed since tests were written
- Update selectors to match current version

## Extending the Test Suite

### Adding New Test Cases

1. **Add to specification first**
   ```markdown
   #### TC-XXX-NNN: Test Description
   - **Objective:** What this tests
   - **Steps:** 1. 2. 3.
   - **Expected:** Result
   - **Validate:** Verification points
   ```

2. **Implement in automation**
   ```typescript
   test('TC-XXX-NNN: Test description', async () => {
     // Implementation
   });
   ```

3. **Update coverage table** in this README

### Common Helper Functions to Use

```typescript
// Navigate to parts list
await navigateToParts(page);

// Create a basic part
const partName = await createBasicPart(page, 'Test Part', 'Category');

// Login before tests
await loginToInventTree(page);

// Add new category
await page.goto(`${BASE_URL}/part/category/`);
```

## Performance Baselines

Expected performance metrics:

| Operation | Expected Time | Threshold |
|-----------|---------------|-----------|
| Part creation | 2-3 seconds | <5 sec |
| Part detail load | 1-2 seconds | <3 sec |
| BOM tab population | 1-2 seconds | <4 sec |
| Search/filter | 1-2 seconds | <3 sec |
| Bulk import (100 parts) | 30-60 seconds | <90 sec |

## Browser Compatibility

Tests should pass on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Test Maintenance

### Regular Updates Required
- **Monthly:** Run full test suite, review/fix failures
- **Per Release:** Update selectors if UI changed, add new test cases for new features
- **Quarterly:** Review coverage against specification, identify gaps

### Known Limitations
- Some tests require specific UI structure; may need adjustment per version
- Import tests depend on file format support
- Some edge cases may be installation-specific

## Contact & Support

For issues or questions:
1. Check troubleshooting section above
2. Review InvenTree documentation: https://docs.inventree.org
3. Check test logs in `test-results/` directory
4. Review screenshot/video traces in Playwright report

## References

- **InvenTree Documentation:** https://docs.inventree.org/en/stable/part/
- **Playwright Documentation:** https://playwright.dev
- **Test Specification:** See `inventree-parts-spec.md` in this directory

## License

This test suite is provided as-is for InvenTree testing purposes.

---

**Last Updated:** March 2026  
**Version:** 1.0  
**Specification Version:** 1.0

# InvenTree Parts Test Case Matrix - Quick Reference

## Test Coverage Overview

### Part Creation Tests (8 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-PC-001 | Create basic part with minimal fields | Manual | Critical | ✅ | 2 min |
| TC-PC-002 | Create part with all field values | Manual | High | ✅ | 3 min |
| TC-PC-003 | Create part with initial stock | Manual | Medium | ⚠️ | 4 min |
| TC-PC-004 | Create part with supplier information | Manual | Medium | ❌ | 3 min |
| TC-PC-005 | Duplicate part (variant/revision) | Manual | High | ⚠️ | 3 min |
| TC-PC-006 | Form validation - required fields | Manual | High | ✅ | 2 min |
| TC-PC-007 | Field length validation | Manual | Medium | ✅ | 2 min |
| TC-PC-008 | Special characters in part name | Manual | Low | ✅ | 2 min |

### Part Import Tests (3 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-PI-001 | Import parts from CSV file | Manual | High | ❌ | 5 min |
| TC-PI-002 | Import with duplicate IPN detection | Manual | High | ❌ | 5 min |
| TC-PI-003 | Import from supplier plugin | Manual | Medium | ❌ | 5 min |

### Part Detail View - Details Tab (5 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-PD-001 | Display all part detail fields | Manual | Critical | ✅ | 1 min |
| TC-PD-002 | Edit part details | Manual | High | ❌ | 2 min |
| TC-PD-003 | Part attributes display and toggle | Manual | High | ✅ | 2 min |
| TC-PD-004 | Part images - upload and display | Manual | Medium | ❌ | 3 min |
| TC-PD-005 | Units of measure display | Manual | Medium | ❌ | 2 min |

### Part Detail View - Stock Tab (4 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ST-001 | Stock tab displays stock items | Manual | Critical | ✅ | 1 min |
| TC-ST-002 | Stock tab - export stock data | Manual | Medium | ❌ | 2 min |
| TC-ST-003 | Stock tab - create new stock item | Manual | High | ✅ | 2 min |
| TC-ST-004 | Stock tab - bulk stock actions | Manual | Medium | ❌ | 3 min |

### Part Detail View - BOM Tab (4 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-BOM-001 | BOM tab display | Manual | Critical | ❌ | 1 min |
| TC-BOM-002 | Add BOM line item | Manual | High | ❌ | 2 min |
| TC-BOM-003 | Circular reference prevention | Manual | High | ❌ | 2 min |
| TC-BOM-004 | BOM validation on locked part | Manual | Medium | ❌ | 2 min |

### Part Detail View - Allocations Tab (2 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ALLOC-001 | Allocations tab display | Manual | Medium | ❌ | 1 min |
| TC-ALLOC-002 | Update allocations | Manual | Medium | ❌ | 2 min |

### Part Detail View - Other Tabs (12 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-BUILD-001 | Build orders tab | Manual | Medium | ❌ | 1 min |
| TC-VAR-001 | Variants tab display | Manual | High | ❌ | 1 min |
| TC-VAR-002 | Create variant from tab | Manual | High | ❌ | 2 min |
| TC-PARAM-001 | Parameters tab display | Manual | Medium | ❌ | 1 min |
| TC-PARAM-002 | Add/edit parameters | Manual | Medium | ❌ | 2 min |
| TC-REV-001 | Revisions tab display | Manual | High | ❌ | 1 min |
| TC-REV-002 | Navigate between revisions | Manual | High | ❌ | 1 min |
| TC-ATTACH-001 | Attachments tab display | Manual | Low | ❌ | 1 min |
| TC-ATTACH-002 | Upload attachment | Manual | Medium | ❌ | 2 min |
| TC-REL-001 | Related parts tab | Manual | Low | ❌ | 1 min |
| TC-TEST-001 | Test templates tab | Manual | Low | ❌ | 1 min |
| TC-NOTE-001 | Notes display and editing | Manual | Low | ❌ | 1 min |

### Part Categories Tests (5 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-CAT-001 | Create category hierarchy | Manual | High | ❌ | 2 min |
| TC-CAT-002 | Create part in nested category | Manual | High | ❌ | 2 min |
| TC-CAT-003 | Category filtering | Manual | Medium | ✅ | 2 min |
| TC-CAT-004 | Parametric table in category | Manual | Low | ❌ | 3 min |
| TC-CAT-005 | Search by category keyword | Manual | Medium | ❌ | 2 min |

### Part Attributes - Template (3 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ATTR-TEMPLATE-001 | Enable template attribute | Manual | High | ❌ | 1 min |
| TC-ATTR-TEMPLATE-002 | Create variant from template | Manual | High | ❌ | 2 min |
| TC-ATTR-TEMPLATE-003 | Template stock aggregation | Manual | High | ❌ | 2 min |

### Part Attributes - Assembly (2 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ATTR-ASSEMBLY-001 | Enable assembly attribute | Manual | High | ✅ | 1 min |
| TC-ATTR-ASSEMBLY-002 | Prevent assembly of virtual parts | Manual | Medium | ❌ | 2 min |

### Part Attributes - Component (2 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ATTR-COMPONENT-001 | Enable component attribute | Manual | High | ❌ | 1 min |
| TC-ATTR-COMPONENT-002 | Used in tab | Manual | Medium | ❌ | 2 min |

### Part Attributes - Virtual (2 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ATTR-VIRTUAL-001 | Create virtual part | Manual | Medium | ❌ | 1 min |
| TC-ATTR-VIRTUAL-002 | Use virtual part | Manual | Medium | ❌ | 2 min |

### Part Attributes - Trackable (4 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ATTR-TRACKABLE-001 | Enable trackable attribute | Manual | High | ✅ | 1 min |
| TC-ATTR-TRACKABLE-002 | Add serial numbers | Manual | High | ❌ | 2 min |
| TC-ATTR-TRACKABLE-003 | Batch number tracking | Manual | High | ❌ | 2 min |
| TC-ATTR-TRACKABLE-004 | Template variant serial constraint | Manual | High | ❌ | 2 min |

### Part Attributes - Purchaseable (2 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ATTR-PURCHASEABLE-001 | Enable purchaseable attribute | Manual | Medium | ❌ | 1 min |
| TC-ATTR-PURCHASEABLE-002 | Link to supplier | Manual | Medium | ❌ | 2 min |

### Part Attributes - Salable (2 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ATTR-SALABLE-001 | Enable salable attribute | Manual | Medium | ❌ | 1 min |
| TC-ATTR-SALABLE-002 | Create sales order with part | Manual | Medium | ❌ | 2 min |

### Part Attributes - Active/Inactive (3 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-ATTR-ACTIVE-001 | Mark part inactive | Manual | High | ✅ | 1 min |
| TC-ATTR-ACTIVE-002 | Inactive restrictions | Manual | High | ❌ | 2 min |
| TC-ATTR-ACTIVE-003 | Reactivate part | Manual | Medium | ❌ | 1 min |

### Units of Measure Tests (5 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-UOM-001 | Create part with physical unit | Manual | High | ✅ | 1 min |
| TC-UOM-002 | Create stock with UOM | Manual | High | ❌ | 2 min |
| TC-UOM-003 | Reject incompatible UOM | Manual | High | ✅ | 1 min |
| TC-UOM-004 | Supplier part UOM conversion | Manual | Medium | ❌ | 2 min |
| TC-UOM-005 | BOM items with UOM | Manual | Medium | ❌ | 2 min |

### Part Revisions - Creation (3 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-REV-001 | Create part revision | Manual | High | ✅ | 2 min |
| TC-REV-002 | Revision navigation | Manual | High | ❌ | 1 min |
| TC-REV-003 | Independent revision data | Manual | High | ❌ | 2 min |

### Part Revisions - Constraints (5 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-REV-CONST-001 | Prevent circular references | Manual | High | ✅ | 1 min |
| TC-REV-CONST-002 | Unique revision codes | Manual | High | ❌ | 1 min |
| TC-REV-CONST-003 | Prevent revision of revision | Manual | High | ❌ | 1 min |
| TC-REV-CONST-004 | Template cannot have revisions | Manual | High | ❌ | 1 min |
| TC-REV-CONST-005 | Variant revision template ref | Manual | High | ❌ | 1 min |

### Part Revisions - Settings (2 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-REV-SETTINGS-001 | Enable/disable revisions | Manual | Medium | ❌ | 1 min |
| TC-REV-SETTINGS-002 | Assembly revisions only | Manual | Medium | ❌ | 1 min |

### Negative Tests - Constraints (5 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-NEG-001 | Prevent duplicate IPN | Manual | Critical | ✅ | 1 min |
| TC-NEG-002 | Duplicate part name | Manual | Medium | ❌ | 1 min |
| TC-NEG-003 | Remove required field | Manual | High | ❌ | 1 min |
| TC-NEG-004 | Invalid external link | Manual | Low | ❌ | 1 min |
| TC-NEG-019 | Revision circular loop | Manual | High | ❌ | 2 min |

### Negative Tests - Inactive Restrictions (4 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-NEG-005 | Cannot create BOM with inactive | Manual | High | ✅ | 1 min |
| TC-NEG-006 | Cannot create PO for inactive | Manual | High | ❌ | 1 min |
| TC-NEG-007 | Cannot create SO for inactive | Manual | High | ❌ | 1 min |
| TC-NEG-008 | Existing operations unaffected | Manual | High | ✅ | 1 min |

### Negative Tests - Locked Part (4 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-NEG-009 | Cannot edit locked part | Manual | Medium | ❌ | 1 min |
| TC-NEG-010 | Cannot delete BOM from locked | Manual | Medium | ❌ | 1 min |
| TC-NEG-011 | Cannot edit parameters of locked | Manual | Medium | ❌ | 1 min |
| TC-NEG-012 | Unlock permission required | Manual | Medium | ❌ | 1 min |

### Negative Tests - Boundary Cases (7 cases)

| ID | Test Case | Type | Priority | Automated | Time |
|----|-----------|------|----------|-----------|------|
| TC-NEG-013 | Very long part name | Manual | Low | ❌ | 1 min |
| TC-NEG-014 | Special characters in IPN | Manual | Low | ❌ | 1 min |
| TC-NEG-015 | Category depth limit | Manual | Low | ❌ | 2 min |
| TC-NEG-016 | BOM quantity edge cases | Manual | Low | ❌ | 2 min |
| TC-NEG-017 | Stock quantity overflow | Manual | Low | ❌ | 1 min |
| TC-NEG-018 | Concurrent edit conflict | Manual | Low | ❌ | 3 min |
| TC-NEG-020 | Mass import validation | Manual | Medium | ❌ | 5 min |

## Test Statistics

### By Priority
- **Critical:** 4 tests (3% automated)
- **High:** 32 tests (34% automated)
- **Medium:** 38 tests (5% automated)
- **Low:** 26 tests (0% automated)

### By Type
- **Manual:** 85 tests
- **Automated:** 15 tests (18%)
- **Partial (⚠️):** 2 tests

### Estimated Execution Time
- **Smoke Test (10 critical cases):** 15-20 minutes
- **Core Functions (32 high priority):** 90-120 minutes
- **Full Suite (100+ cases):** 250-300 minutes (4-5 hours)

### Automation Priority (Recommended)
1. **Phase 1 - Critical Path** (5 cases, 10 min)
   - TC-PC-001, TC-PD-001, TC-ST-001, TC-ATTR-ACTIVE-001, TC-NEG-001

2. **Phase 2 - High Value** (15 cases, 45 min)
   - All Part Creation, Attributes, UOM cases

3. **Phase 3 - Extended Coverage** (20+ cases, 90+ min)
   - All remaining priority tests

## Test Execution Checklist

### Pre-Execution
- [ ] InvenTree instance running and accessible
- [ ] Test database prepared with reference data
- [ ] Test user created with appropriate permissions
- [ ] Browser(s) and required tools installed
- [ ] Environment variables configured
- [ ] Latest test files pulled/reviewed

### Execution
- [ ] Log test run start time and tester name
- [ ] Execute tests in defined sequence (or grouped by category)
- [ ] Document any deviations from expected behavior
- [ ] Capture screenshots for failures
- [ ] Note performance issues or delays

### Post-Execution
- [ ] Compile test results summary
- [ ] Generate HTML report (if automated)
- [ ] Log all failures with reproduction steps
- [ ] Calculate pass rate percentage
- [ ] Update issue tracking system
- [ ] Archive test evidence (screenshots, logs)

---

**Legend:**
- ✅ = Fully automated
- ⚠️ = Partially automated / requires manual verification
- ❌ = Manual test only
- Time = Estimated execution time per test case
- Priority = Relative importance for regression testing

**Total Test Cases:** 100+  
**Estimated Full Execution:** 4-5 hours (manual)  
**Automated Coverage:** ~15-20 cases (18%)  
**Focus Areas for Automation:** Part creation, detail view, attributes, constraints

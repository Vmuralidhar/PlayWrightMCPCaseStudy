# InvenTree Parts API Manual Test Cases

## Overview

This document contains comprehensive manual test cases for the InvenTree Parts and Part Categories API endpoints. Test cases cover CRUD operations, filtering, pagination, search, field validation, relational integrity, and edge cases.

## API Endpoints Covered

### Part Endpoints
- `GET /api/part/` - List parts
- `POST /api/part/` - Create part
- `GET /api/part/{id}/` - Get part detail
- `PUT /api/part/{id}/` - Update part
- `PATCH /api/part/{id}/` - Partial update part
- `DELETE /api/part/{id}/` - Delete part

### Part Category Endpoints
- `GET /api/part/category/` - List categories
- `POST /api/part/category/` - Create category
- `GET /api/part/category/{id}/` - Get category detail
- `PUT /api/part/category/{id}/` - Update category
- `PATCH /api/part/category/{id}/` - Partial update category
- `DELETE /api/part/category/{id}/` - Delete category

## Authentication Requirements

All API requests require authentication via:
- Token authentication: `Authorization: Token <token>`
- Basic authentication: `Authorization: Basic <base64(username:password)>`

## Test Case Categories

### 1. CRUD Operations on Parts

#### TC-API-PART-CRUD-001: Create Basic Part
**Objective:** Verify basic part creation with minimal required fields
**Preconditions:**
- Valid authentication token
- No existing part with same name in same category

**Steps:**
1. Send POST request to `/api/part/`
2. Include payload: `{"name": "Test Part 001", "category": 1}`
3. Verify response status 201
4. Verify response contains part ID
5. Verify part appears in GET `/api/part/` list

**Expected Results:**
- Status: 201 Created
- Response contains: pk, name, category, active=true, creation_date
- Part appears in list endpoint

#### TC-API-PART-CRUD-002: Create Part with All Fields
**Objective:** Verify part creation with all available fields
**Preconditions:**
- Valid authentication token
- Category exists
- Default location exists (optional)

**Steps:**
1. Send POST request to `/api/part/`
2. Include comprehensive payload:
```json
{
  "name": "Comprehensive Test Part",
  "IPN": "CTP-001",
  "description": "A comprehensive test part",
  "category": 1,
  "keywords": "test, comprehensive, api",
  "link": "https://example.com",
  "units": "pcs",
  "assembly": true,
  "component": true,
  "purchaseable": true,
  "salable": true,
  "trackable": false,
  "testable": false,
  "virtual": false,
  "active": true,
  "minimum_stock": 10,
  "default_location": 1,
  "revision": "v1.0"
}
```

**Expected Results:**
- Status: 201 Created
- All fields correctly set in response
- Part appears in list with correct values

#### TC-API-PART-CRUD-003: Read Part Detail
**Objective:** Verify retrieving individual part details
**Preconditions:**
- Part exists with ID {part_id}

**Steps:**
1. Send GET request to `/api/part/{part_id}/`
2. Verify response status 200
3. Verify all expected fields are present
4. Verify field values match creation/update

**Expected Results:**
- Status: 200 OK
- Response contains all part fields
- Related data (category_detail, default_location_detail) included

#### TC-API-PART-CRUD-004: Update Part (Full)
**Objective:** Verify complete part update via PUT
**Preconditions:**
- Part exists

**Steps:**
1. Send PUT request to `/api/part/{part_id}/` with complete payload
2. Include all required fields plus updates
3. Verify response status 200
4. Verify all fields updated correctly

**Expected Results:**
- Status: 200 OK
- All fields reflect new values
- Read-only fields unchanged

#### TC-API-PART-CRUD-005: Update Part (Partial)
**Objective:** Verify partial part update via PATCH
**Preconditions:**
- Part exists

**Steps:**
1. Send PATCH request to `/api/part/{part_id}/`
2. Include only fields to update: `{"description": "Updated description"}`
3. Verify response status 200
4. Verify only specified fields changed

**Expected Results:**
- Status: 200 OK
- Only patched fields updated
- Other fields unchanged

#### TC-API-PART-CRUD-006: Delete Part
**Objective:** Verify part deletion
**Preconditions:**
- Part exists and has no dependent stock/BOM items

**Steps:**
1. Send DELETE request to `/api/part/{part_id}/`
2. Verify response status 204
3. Send GET request to `/api/part/{part_id}/`
4. Verify response status 404

**Expected Results:**
- DELETE returns 204 No Content
- Subsequent GET returns 404 Not Found

### 2. CRUD Operations on Part Categories

#### TC-API-CATEGORY-CRUD-001: Create Basic Category
**Objective:** Verify basic category creation
**Preconditions:**
- Valid authentication token

**Steps:**
1. Send POST request to `/api/part/category/`
2. Include payload: `{"name": "Test Category 001"}`
3. Verify response status 201
4. Verify category appears in list

**Expected Results:**
- Status: 201 Created
- Category has pk, name, pathstring
- Appears in GET `/api/part/category/` list

#### TC-API-CATEGORY-CRUD-002: Create Nested Category
**Objective:** Verify hierarchical category creation
**Preconditions:**
- Parent category exists

**Steps:**
1. Send POST request to `/api/part/category/`
2. Include payload: `{"name": "Sub Category", "parent": 1}`
3. Verify response status 201
4. Verify pathstring includes parent

**Expected Results:**
- Status: 201 Created
- pathstring: "Parent Category/Sub Category"
- parent field set correctly

#### TC-API-CATEGORY-CRUD-003: Read Category Detail
**Objective:** Verify category detail retrieval
**Preconditions:**
- Category exists

**Steps:**
1. Send GET request to `/api/part/category/{id}/`
2. Verify response contains all fields
3. Verify part_count reflects actual parts

**Expected Results:**
- Status: 200 OK
- Includes part_count, subcategories count
- Path information correct

#### TC-API-CATEGORY-CRUD-004: Update Category
**Objective:** Verify category update
**Preconditions:**
- Category exists

**Steps:**
1. Send PUT/PATCH request to `/api/part/category/{id}/`
2. Update name and/or parent
3. Verify pathstring updates correctly

**Expected Results:**
- Status: 200 OK
- Name and pathstring updated
- Child categories' paths updated if parent changed

#### TC-API-CATEGORY-CRUD-005: Delete Empty Category
**Objective:** Verify category deletion when empty
**Preconditions:**
- Category exists with no parts or subcategories

**Steps:**
1. Send DELETE request to `/api/part/category/{id}/`
2. Verify response status 204
3. Verify category no longer exists

**Expected Results:**
- Status: 204 No Content
- Category removed from system

### 3. Filtering, Pagination, and Search on Parts List

#### TC-API-PART-FILTER-001: Filter by Category
**Objective:** Verify category filtering
**Preconditions:**
- Multiple parts exist in different categories

**Steps:**
1. Send GET request to `/api/part/?category=1`
2. Verify only parts in category 1 returned
3. Test with different category IDs

**Expected Results:**
- Only parts in specified category returned
- Count reflects filtered results

#### TC-API-PART-FILTER-002: Filter by Active Status
**Objective:** Verify active/inactive filtering
**Preconditions:**
- Mix of active and inactive parts

**Steps:**
1. Send GET request to `/api/part/?active=true`
2. Verify only active parts returned
3. Send GET request to `/api/part/?active=false`
4. Verify only inactive parts returned

**Expected Results:**
- Correct filtering by active status
- Default shows active parts only

#### TC-API-PART-FILTER-003: Filter by Assembly/Component
**Objective:** Verify part type filtering
**Preconditions:**
- Mix of assembly and component parts

**Steps:**
1. Send GET request to `/api/part/?assembly=true`
2. Send GET request to `/api/part/?component=true`
3. Send GET request to `/api/part/?is_template=true`

**Expected Results:**
- Correct filtering by part attributes
- Can combine multiple filters

#### TC-API-PART-FILTER-004: Search by Name
**Objective:** Verify text search functionality
**Preconditions:**
- Parts with various names exist

**Steps:**
1. Send GET request to `/api/part/?search=test`
2. Verify parts with "test" in name/description returned
3. Test case-insensitive search

**Expected Results:**
- Search matches name, description, IPN fields
- Case-insensitive matching

#### TC-API-PART-FILTER-005: Pagination
**Objective:** Verify pagination works correctly
**Preconditions:**
- Many parts exist (> default page size)

**Steps:**
1. Send GET request to `/api/part/?limit=10`
2. Verify exactly 10 results returned
3. Check next/previous URLs in response
4. Navigate to next page

**Expected Results:**
- Correct number of results per page
- Proper pagination links
- Total count in response

#### TC-API-PART-FILTER-006: Complex Filtering
**Objective:** Verify multiple filters work together
**Preconditions:**
- Diverse part data exists

**Steps:**
1. Send GET request with multiple filters:
   `/api/part/?category=1&active=true&assembly=true&search=test&limit=5`

**Expected Results:**
- All filters applied correctly
- Results match intersection of all criteria

### 4. Field-Level Validation

#### TC-API-VALIDATION-001: Required Fields
**Objective:** Verify required field validation
**Preconditions:**
- None

**Steps:**
1. Send POST request to `/api/part/` with empty payload
2. Send POST request missing "name" field
3. Verify appropriate error responses

**Expected Results:**
- Status: 400 Bad Request
- Error messages for missing required fields
- "name" is required for parts

#### TC-API-VALIDATION-002: Field Length Limits
**Objective:** Verify maximum length constraints
**Preconditions:**
- None

**Steps:**
1. Attempt to create part with name > 100 characters
2. Attempt to create part with IPN > 100 characters
3. Attempt to create part with description > 250 characters

**Expected Results:**
- Status: 400 Bad Request
- Validation errors for exceeded length limits

#### TC-API-VALIDATION-003: IPN Uniqueness
**Objective:** Verify IPN uniqueness constraint
**Preconditions:**
- Part with IPN "TEST-001" exists

**Steps:**
1. Attempt to create another part with IPN "TEST-001"
2. Verify duplicate IPN rejected

**Expected Results:**
- Status: 400 Bad Request
- Error message about duplicate IPN

#### TC-API-VALIDATION-004: Units Validation
**Objective:** Verify units field accepts valid physical units
**Preconditions:**
- None

**Steps:**
1. Create part with valid units: "pcs", "kg", "m", "L"
2. Attempt to create part with invalid units: "invalid_unit"

**Expected Results:**
- Valid units accepted
- Invalid units rejected with validation error

#### TC-API-VALIDATION-005: URL Validation
**Objective:** Verify link field accepts valid URLs
**Preconditions:**
- None

**Steps:**
1. Create part with valid URL: "https://example.com"
2. Attempt to create part with invalid URL: "not-a-url"

**Expected Results:**
- Valid URLs accepted
- Invalid URLs rejected

#### TC-API-VALIDATION-006: Read-Only Fields
**Objective:** Verify read-only fields cannot be set
**Preconditions:**
- Part exists

**Steps:**
1. Attempt to update creation_date, creation_user
2. Verify these fields ignored or rejected

**Expected Results:**
- Read-only fields cannot be modified
- No error if included in payload (fields ignored)

### 5. Relational Integrity

#### TC-API-RELATION-001: Category Assignment
**Objective:** Verify category relationships work correctly
**Preconditions:**
- Categories exist

**Steps:**
1. Create part with valid category ID
2. Update part to change category
3. Verify category_detail populated correctly

**Expected Results:**
- Category relationships maintained
- Category path information correct

#### TC-API-RELATION-002: Default Location Assignment
**Objective:** Verify default location relationships
**Preconditions:**
- Stock locations exist

**Steps:**
1. Create part with default_location
2. Verify default_location_detail populated
3. Update default location

**Expected Results:**
- Location relationships work
- Location details included in responses

#### TC-API-RELATION-003: Supplier Linkage
**Objective:** Verify supplier part relationships
**Preconditions:**
- Company and supplier parts exist

**Steps:**
1. Create part with initial_supplier data
2. Verify supplier parts created
3. Check manufacturer_parts relationship

**Expected Results:**
- Supplier relationships established
- Related supplier parts accessible

#### TC-API-RELATION-004: Category Deletion Protection
**Objective:** Verify categories with parts cannot be deleted
**Preconditions:**
- Category has parts assigned

**Steps:**
1. Attempt to delete category with parts
2. Verify deletion rejected

**Expected Results:**
- Status: 400 Bad Request
- Error message about existing parts

#### TC-API-RELATION-005: Structural Category Validation
**Objective:** Verify structural categories prevent part assignment
**Preconditions:**
- Structural category exists

**Steps:**
1. Attempt to create part in structural category
2. Attempt to move part to structural category

**Expected Results:**
- Part creation/movement rejected
- Clear error messages

### 6. Edge Cases and Error Scenarios

#### TC-API-EDGE-001: Invalid Payload Format
**Objective:** Verify handling of malformed JSON
**Preconditions:**
- None

**Steps:**
1. Send POST request with invalid JSON
2. Send POST request with wrong content type

**Expected Results:**
- Status: 400 Bad Request
- Appropriate error messages

#### TC-API-EDGE-002: Unauthorized Access
**Objective:** Verify authentication requirements
**Preconditions:**
- No authentication provided

**Steps:**
1. Send API request without Authorization header
2. Send API request with invalid token

**Expected Results:**
- Status: 401 Unauthorized
- Authentication required message

#### TC-API-EDGE-003: Forbidden Actions
**Objective:** Verify permission-based access control
**Preconditions:**
- User without required permissions

**Steps:**
1. Attempt part creation without part.add permission
2. Attempt category deletion without part_category.delete permission

**Expected Results:**
- Status: 403 Forbidden
- Permission denied messages

#### TC-API-EDGE-004: Non-existent Resources
**Objective:** Verify handling of invalid IDs
**Preconditions:**
- None

**Steps:**
1. Send GET request to `/api/part/99999/`
2. Send PUT request to `/api/part/99999/`
3. Reference non-existent category ID

**Expected Results:**
- Status: 404 Not Found
- Appropriate error messages

#### TC-API-EDGE-005: Concurrent Updates
**Objective:** Verify handling of concurrent modifications
**Preconditions:**
- Part exists

**Steps:**
1. Get current part data
2. Modify part in separate session
3. Attempt update with stale data

**Expected Results:**
- Appropriate conflict resolution
- Data consistency maintained

#### TC-API-EDGE-006: Large Dataset Handling
**Objective:** Verify performance with large datasets
**Preconditions:**
- Many parts exist (1000+)

**Steps:**
1. Request full part list without pagination
2. Request with search/filtering
3. Monitor response times

**Expected Results:**
- Reasonable response times
- No server errors
- Proper pagination encouraged

#### TC-API-EDGE-007: Special Characters
**Objective:** Verify handling of special characters
**Preconditions:**
- None

**Steps:**
1. Create parts with Unicode characters in names
2. Create parts with special characters in descriptions
3. Test search with special characters

**Expected Results:**
- Special characters handled correctly
- No encoding issues
- Search works with Unicode

#### TC-API-EDGE-008: Boundary Values
**Objective:** Verify boundary value handling
**Preconditions:**
- None

**Steps:**
1. Test minimum_stock = 0
2. Test minimum_stock with large values
3. Test empty strings vs null values

**Expected Results:**
- Boundary values handled appropriately
- Validation prevents invalid values

## Test Execution Guidelines

### Prerequisites
1. InvenTree instance running and accessible
2. Valid user account with appropriate permissions
3. Authentication token obtained
4. Test data prepared (categories, locations, etc.)

### Test Data Setup
- Create test categories with known IDs
- Create test stock locations
- Prepare supplier/manufacturer data if needed

### Execution Order
1. Execute CRUD tests first
2. Then validation tests
3. Follow with filtering/search tests
4. End with edge case tests

### Success Criteria
- All expected HTTP status codes returned
- Response schemas match expectations
- Data integrity maintained
- Error messages informative and accurate
- Performance acceptable for production use

## Tools Required
- HTTP client (curl, Postman, or similar)
- JSON validation tools
- Authentication token management
- Response time monitoring
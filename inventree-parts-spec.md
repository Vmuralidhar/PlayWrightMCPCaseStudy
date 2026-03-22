# InvenTree Parts Test Case Specification
## Comprehensive UI/Manual Test Coverage

**Document Version:** 1.0  
**Last Updated:** March 2026  
**Framework:** Playwright  
**Test Type:** UI/Manual Testing  

---

## Part 1: PART CREATION TESTS

### 1.1 Manual Part Creation

#### TC-PC-001: Create Basic Part with Minimal Fields
- **Objective:** Create a part with only required fields
- **Steps:**
  1. Navigate to Parts section
  2. Click "Add Parts" > "Create Part"
  3. Enter Part Name (e.g., "Resistor-1K")
  4. Leave Category empty (if optional)
  5. Click Submit
- **Expected:** Part created successfully, redirects to part detail page
- **Validate:** 
  - Part name displays correctly
  - Part detail view is accessible
  - Part ID is auto-assigned

#### TC-PC-002: Create Part with All Field Values
- **Objective:** Create a part with comprehensive information
- **Steps:**
  1. Open Create Part form
  2. Fill in:
     - Part Name: "Power Supply Unit-500W"
     - Internal Part Number (IPN): "PSU-500-001"
     - Description: "Industrial power supply 500W, 48V DC output"
     - Category: Select "Power Supplies"
     - Keywords: "power, supply, industrial"
     - External Link: `https://example.com/psu/specs`
     - Units of Measure: "pieces"
  3. Submit
- **Expected:** Part created with all fields populated
- **Validate:**
  - All input fields retained in detail view
  - Creation metadata displays (date, user)
  - Part searchable by keyword

#### TC-PC-003: Create Part with Initial Stock
- **Objective:** Create part with initial inventory setup
- **Prerequisite:** "Create Initial Stock" setting enabled
- **Steps:**
  1. Open Create Part form
  2. Fill basic part info
  3. Check "Create Initial Stock"
  4. Enter:
     - Quantity: 100
     - Location: Select warehouse/bin
     - Batch/Serial: Optional value
  5. Submit
- **Expected:** Part created with initial stock entry
- **Validate:**
  - Stock tab shows 100 units
  - Stock location correct
  - Initial stock transaction logged

#### TC-PC-004: Create Part with Supplier Information
- **Objective:** Link supplier data to new part
- **Prerequisite:** Part marked as "Purchaseable", supplier exists
- **Steps:**
  1. Open Create Part form
  2. Enter part info
  3. Check "Add Supplier Data"
  4. Select Supplier
  5. Enter Supplier Part Number: "SUPPLIER-XYZ-001"
  6. Enter Manufacturer (optional)
  7. Submit
- **Expected:** Part created with supplier link
- **Validate:**
  - Suppliers tab shows linked supplier
  - Supplier part number correct
  - Can navigate to supplier details

#### TC-PC-005: Duplicate Part (Create Variant/Revision)
- **Objective:** Create a copy of existing part
- **Steps:**
  1. Navigate to existing part detail page
  2. Click context menu > "Duplicate Part"
  3. Modify fields as needed (e.g., add "-V2" to name)
  4. Submit
- **Expected:** New part created as duplicate
- **Validate:**
  - Original part unchanged
  - Duplicate has unique ID
  - Can select duplicate independently

#### TC-PC-006: Create Part Form Validation - Required Fields
- **Objective:** Test form validation for mandatory fields
- **Steps:**
  1. Open Create Part form
  2. Try to submit with Part Name empty
  3. Try to submit with no Category selected (if required)
- **Expected:** Form rejects submission with error messages
- **Validate:**
  - Error messages clear and specific
  - Problem fields highlighted
  - Form data retained on error

#### TC-PC-007: Create Part - Field Length Validation
- **Objective:** Test max length constraints
- **Steps:**
  1. Open Create Part form
  2. Enter very long Part Name (>255 chars)
  3. Enter very long Description (>10000 chars)
  4. Submit
- **Expected:** System accepts/rejects per configuration
- **Validate:**
  - Either validation error or truncation message
  - No database errors or truncation without notice

#### TC-PC-008: Create Part - Special Characters in Name
- **Objective:** Test special character handling
- **Steps:**
  1. Create part with Name: `Part@#$%-001`
  2. Create part with Name: `Part (with/parentheses)`
  3. Create part with Name: `Partition™`
- **Expected:** Parts created or validation error (design-dependent)
- **Validate:**
  - Database stores field correctly
  - Display renders without corruption
  - Search works correctly

### 1.2 Part Import

#### TC-PI-001: Import Parts from CSV File
- **Objective:** Import multiple parts from spreadsheet
- **Steps:**
  1. Navigate to Parts > Import from File
  2. Upload CSV with columns: Name, Category, IPN, Description, UOM
  3. Sample rows:
     - "Capacitor-100uF", "Capacitors", "CAP-001", "100µF 50V", "pieces"
     - "Inductor-10mH", "Inductors", "IND-001", "10mH 5A", "pieces"
  4. Follow import wizard, map fields
  5. Confirm import
- **Expected:** Parts imported successfully
- **Validate:**
  - Parts appear in part list
  - IPN values correctly mapped
  - Categories assigned correctly
  - Import count matches CSV rows

#### TC-PI-002: Import with Duplicate IPN Detection
- **Objective:** Test handling of duplicate IPNs during import
- **Steps:**
  1. Create part with IPN "EXISTING-001"
  2. Attempt import with same IPN in CSV
  3. Check system behavior (update vs error)
- **Expected:** System prevents duplicate IPN or updates existing
- **Validate:**
  - No orphaned duplicates created
  - User informed of conflict resolution
  - Data integrity maintained

#### TC-PI-003: Import Parts from Supplier Plugin
- **Objective:** Import parts from external supplier API
- **Prerequisite:** Supplier plugin installed and configured
- **Steps:**
  1. Navigate to Part Category
  2. Click "Import Part"
  3. Select supplier plugin
  4. Search for component (e.g., "Resistor 10K")
  5. Select result
  6. Follow wizard to create stock/supplier links
- **Expected:** Part created with supplier data auto-populated
- **Validate:**
  - Part name/description from supplier database
  - Manufacturer info linked
  - Supplier part number linked
  - Can modify before finalizing

#### TC-PI-004: Import - Field Mapping
- **Objective:** Test custom field mapping during import
- **Steps:**
  1. Upload CSV with non-standard column names: "Item", "Qty", "Code"
  2. In import wizard, map:
     - "Item" → Part Name
     - "Code" → IPN
     - "Qty" → Skip
  3. Import
- **Expected:** Fields correctly mapped despite non-standard names
- **Validate:**
  - Part names populated correctly
  - IPNs populated correctly
  - Skipped field ignored
  - Data correctly assigned

#### TC-PI-005: Import - Validation Errors
- **Objective:** Test import error handling
- **Steps:**
  1. Upload CSV with missing required fields
  2. Upload CSV with invalid category references
  3. Upload CSV with invalid UOM values
  4. Attempt import each
- **Expected:** System reports validation errors before import
- **Validate:**
  - Error messages specific and actionable
  - No partial imports
  - Option to modify and retry
  - Data not corrupted

---

## Part 2: PART DETAIL VIEW TESTS

### 2.1 Part Details Tab

#### TC-PD-001: Display All Part Detail Fields
- **Objective:** Verify all part metadata displays correctly
- **Steps:**
  1. Create comprehensive part with IPN, keywords, links
  2. Open Part Detail view
  3. Toggle "Show Part Details" panel
- **Expected:** All fields displayed properly
- **Validate:**
  - Part Name, IPN, Description visible
  - Keywords displayed
  - External Link functional
  - Creation date/user metadata shows
  - Modification timestamp updates on edits

#### TC-PD-002: Edit Part Details
- **Objective:** Modify part information after creation
- **Steps:**
  1. Navigate to part detail
  2. Click Edit (or inline edit)
  3. Modify:
     - Description
     - Keywords
     - External Link
  4. Save changes
- **Expected:** Changes persisted
- **Validate:**
  - Detail view reflects changes immediately
  - Changes logged in part history
  - Previous values preserved in history
  - Cannot edit IPN or Name (locked fields)

#### TC-PD-003: Part Attributes Display and Toggle
- **Objective:** Verify part attribute flags visible and editable
- **Steps:**
  1. Open part detail
  2. Verify attribute indicators:
     - Template, Assembly, Component, Virtual
     - Trackable, Purchaseable, Salable
     - Active/Inactive status
  3. Toggle each attribute
  4. Save
- **Expected:** Attributes update and persist
- **Validate:**
  - UI reflects toggle state
  - Related tabs appear/disappear (e.g., BOM tab for assemblies)
  - Validation prevents invalid combinations
  - Changes logged

#### TC-PD-004: Part Images - Upload and Display
- **Objective:** Test part image functionality
- **Steps:**
  1. Open part detail
  2. Click on part image area
  3. Upload image file (PNG, JPG)
  4. Verify thumbnail generated
  5. Try "Select from existing images"
  6. Try "Delete image"
- **Expected:** Image operations work correctly
- **Validate:**
  - Image displays at appropriate resolution
  - Thumbnail created automatically
  - Can switch between multiple images
  - Delete removes image without affecting part
  - Image accessible from part list view

#### TC-PD-005: Units of Measure Display
- **Objective:** Verify UOM settings and display
- **Steps:**
  1. Create part with UOM: "meters"
  2. Open detail view
  3. Try to create stock with different UOM
  4. Create stock with compatible UOM (e.g., "feet")
- **Expected:** UOM constraints enforced
- **Validate:**
  - Part UOM displayed
  - Stock UOM must be compatible
  - Conversion factor applied (if configured)
  - Error message for incompatible UOM

### 2.2 Stock Tab

#### TC-ST-001: Stock Tab - Display Stock Items
- **Objective:** View all stock items for a part
- **Steps:**
  1. Create part
  2. Create multiple stock items:
     - Location A: 50 units
     - Location B: 30 units
     - Location C: 20 units (serial tracked)
  3. Open Part > Stock tab
- **Expected:** Stock items displayed in table
- **Validate:**
  - All locations listed
  - Quantities correct
  - Serial numbers visible for trackable items
  - Total stock calculated (100)
  - Stock status shown (good, low, critical)

#### TC-ST-002: Stock Tab - Export Stock Data
- **Objective:** Export stock information
- **Steps:**
  1. Open Part > Stock tab
  2. Select items (or use "Select All")
  3. Click "Export" button
  4. Choose export format (CSV, Excel, etc.)
- **Expected:** File downloads with stock data
- **Validate:**
  - Export format correct
  - All selected items included
  - Quantities/locations accurate
  - Serial numbers included
  - timestamp metadata present

#### TC-ST-003: Stock Tab - Create New Stock Item
- **Objective:** Add stock from detail view
- **Steps:**
  1. Open Part > Stock tab
  2. Click "New Stock Item"
  3. Fill:
     - Location: Select bin
     - Quantity: 50
     - Serial Number: AUTO-001 (if trackable)
     - Notes: "Received from supplier"
  4. Submit
- **Expected:** Stock created and visible in list
- **Validate:**
  - Stock appears immediately
  - Location link functional
  - Quantity updates part total
  - Serial tracked correctly
  - Timestamp recorded

#### TC-ST-004: Stock Tab - Stock Actions (Select Multiple)
- **Objective:** Perform bulk actions on stock items
- **Steps:**
  1. Select multiple stock items (checkbox)
  2. Click "Stock Actions" dropdown
  3. Perform action (e.g., Move, Adjust Quantity, Delete)
- **Expected:** Bulk action applied
- **Validate:**
  - Multiple items updated
  - Confirmation dialog appears
  - Changes logged with user/timestamp
  - Part total updated correctly

### 2.3 Bill of Materials (BOM) Tab

#### TC-BOM-001: BOM Tab Display
- **Objective:** View BOM for assembly parts
- **Prerequisite:** Part is Assembly
- **Steps:**
  1. Navigate to Assembly part
  2. Open BOM tab
- **Expected:** BOM table displays
- **Validate:**
  - Tab only visible for assemblies
  - Component parts listed
  - Quantities per assembly shown
  - Reference designators visible
  - Supplier links shown (if configured)

#### TC-BOM-002: Add BOM Line Item
- **Objective:** Add component to BOM
- **Steps:**
  1. Open Assembly > BOM tab
  2. Click "Add BOM Item"
  3. Select Part (e.g., "Resistor-1K")
  4. Enter Quantity: 10
  5. Enter Reference: "R1-R10"
  6. Optional: Add Note
  7. Submit
- **Expected:** BOM line created
- **Validate:**
  - Line appears in BOM table
  - Component linked correctly
  - Quantity updates assembly cost
  - Reference visible
  - Can edit/delete line

#### TC-BOM-003: Circular Reference Prevention
- **Objective:** Prevent assembly containing itself
- **Steps:**
  1. Create Assembly part "Main-Assembly"
  2. Try to add "Main-Assembly" to its own BOM
- **Expected:** System prevents and shows error
- **Validate:**
  - Error message clear
  - BOM not modified
  - Cannot select part in own BOM tree

#### TC-BOM-004: BOM Validation on Locked Part
- **Objective:** Cannot edit BOM of locked assembly
- **Steps:**
  1. Lock Assembly part
  2. Try to add/edit/delete BOM items
- **Expected:** Operations rejected
- **Validate:**
  - Appropriate error/message
  - Read-only state shown
  - Unlock option available to admin

### 2.4 Allocations Tab

#### TC-ALLOC-001: Allocations Tab Display
- **Objective:** View allocated stock
- **Prerequisite:** Component part, sales/build orders exist
- **Steps:**
  1. Create Component part
  2. Create stock: 100 units
  3. Create Sales Order allocating 30 units
  4. Create Build Order allocating 20 units
  5. Open Part > Allocations tab
- **Expected:** Tab visible, allocations displayed
- **Validate:**
  - 50 units shown as allocated
  - Remaining available: 50
  - Links to sales/build orders
  - Allocation source shown (order number, type)

#### TC-ALLOC-002: Update Allocations
- **Objective:** Modify or remove allocations
- **Steps:**
  1. On Allocations tab, select allocation
  2. Edit quantity
  3. Confirm
- **Expected:** Allocation updated
- **Validate:**
  - New allocation quantity applied
  - Available stock recalculated
  - Audit log updated

### 2.5 Build Orders Tab

#### TC-BUILD-001: Build Orders Tab
- **Objective:** View builds for assembly part
- **Prerequisite:** Assembly part, build orders exist
- **Steps:**
  1. Navigate to Assembly part
  2. Open Build Orders tab
- **Expected:** Build orders listed
- **Validate:**
  - All builds shown
  - Status visible (pending, in-progress, complete)
  - Build quantity, dates shown
  - Links to build detail functional

### 2.6 Variants Tab

#### TC-VAR-001: Variants Tab Display
- **Objective:** View variants of template part
- **Prerequisite:** Part marked as Template
- **Steps:**
  1. Create part and enable Template
  2. Create 2-3 variants
  3. Open Variants tab
- **Expected:** All variants listed
- **Validate:**
  - Variants table populated
  - Links to variant detail functional
  - Can create new variant from tab

#### TC-VAR-002: Create Variant from Tab
- **Objective:** Add variant through UI
- **Steps:**
  1. Open Template part > Variants tab
  2. Click "New Variant"
  3. Duplicate form opens
  4. Modify name (e.g., add "-V2")
  5. Submit
- **Expected:** Variant created
- **Validate:**
  - Appears in variants list
  - Template relationship set
  - Unique part ID assigned
  - Stock counted in template total

### 2.7 Parameters Tab

#### TC-PARAM-001: Parameters Tab Display
- **Objective:** View part parameters
- **Prerequisite:** Parameters defined for part
- **Steps:**
  1. Create part with parameters:
     - Voltage: 5V
     - Current: 2A
     - Power: 10W
  2. Open Parameters tab
- **Expected:** Parameters displayed in table
- **Validate:**
  - All parameters shown
  - Names and values correct
  - Units displayed
  - Template reference shown (if exists)

#### TC-PARAM-002: Add/Edit Part Parameters
- **Objective:** Manage part parameters
- **Steps:**
  1. Open Parameters tab
  2. Click "Add Parameter"
  3. Enter:
     - Template: Select "Temperature Range"
     - Value: "-40°C to +85°C"
  4. Submit
- **Expected:** Parameter added
- **Validate:**
  - Appears in table
  - Can edit existing parameters
  - Can delete parameters
  - Changes logged

### 2.8 Revisions Tab

#### TC-REV-001: Revisions Tab Display
- **Objective:** Show part revision history
- **Prerequisite:** Part has revisions
- **Steps:**
  1. Create part with revisions (Rev A, Rev B, Rev C)
  2. Navigate to any revision
  3. Open Revisions tab
- **Expected:** All revisions listed
- **Validate:**
  - Current revision highlighted
  - Links to each revision
  - Revision number shown
  - Can navigate between revisions

#### TC-REV-002: Navigate Between Revisions
- **Objective:** Switch revision view easily
- **Steps:**
  1. Open part detail for Rev A
  2. Use revision dropdown at top or Revisions tab
  3. Select Rev B
- **Expected:** Detail view updates
- **Validate:**
  - Correct revision loads
  - BOM for revision displays
  - Stock for revision shown
  - Revision-specific data loaded

### 2.9 Attachments Tab

#### TC-ATTACH-001: Attachments Tab Display
- **Objective:** View part attachments
- **Steps:**
  1. Open Attachments tab for part
- **Expected:** Tab displays
- **Validate:**
  - Shows all attached files
  - File names, sizes displayed
  - Upload date shown
  - Download links functional

#### TC-ATTACH-002: Upload Attachment
- **Objective:** Add file to part
- **Steps:**
  1. Open Attachments tab
  2. Click "Upload Attachment" or drag-drop
  3. Select file (datasheet PDF, schematic PNG)
  4. Enter optional description
  5. Upload
- **Expected:** File added to attachments
- **Validate:**
  - File appears in list
  - Download works
  - Can delete attachment
  - File persists after page reload

### 2.10 Related Parts Tab

#### TC-REL-001: Related Parts Tab Display
- **Objective:** View related parts
- **Prerequisite:** Related parts feature enabled
- **Steps:**
  1. Create part "Processor-A"
  2. Create part "Processor-B"
  3. Link as related parts
  4. Open part detail
  5. Check Related Parts tab
- **Expected:** Links shown
- **Validate:**
  - Related parts listed
  - Links navigable
  - Relationship description shown

#### TC-REL-002: Add Related Part
- **Objective:** Create part relationship
- **Steps:**
  1. Open Related Parts tab
  2. Click "Add Related Part"
  3. Search and select part
  4. Add relationship description (optional)
  5. Submit
- **Expected:** Related part added
- **Validate:**
  - Appears in list
  - Bidirectional link (if configured)
  - Can remove relationship

### 2.11 Test Templates Tab

#### TC-TEST-001: Test Templates Tab Display
- **Objective:** View test templates for testable part
- **Prerequisite:** Part marked as Testable
- **Steps:**
  1. Mark part as Testable
  2. Open Test Templates tab
- **Expected:** Tab displays
- **Validate:**
  - Existing test templates shown
  - Can add new test template
  - Test requirements listed

#### TC-TEST-002: Add Test Template
- **Objective:** Define test for part
- **Steps:**
  1. Open Test Templates tab
  2. Click "Add Test"
  3. Enter Test Name: "Continuity Check"
  4. Description: "Verify circuit continuity"
  5. Set pass/fail criteria
  6. Submit
- **Expected:** Test template created
- **Validate:**
  - Shows in test templates
  - Can be assigned to future stock items
  - Can edit/delete test

### 2.12 Suppliers Tab (Purchaseable Parts)

#### TC-SUPP-001: Suppliers Tab Display
- **Objective:** View supplier information
- **Prerequisite:** Part marked Purchaseable, suppliers linked
- **Steps:**
  1. Create Purchaseable part
  2. Link to Supplier with part number
  3. Open Suppliers tab
- **Expected:** Supplier list displayed
- **Validate:**
  - Supplier name linked
  - Supplier part number shown
  - Lead time (if specified)
  - Pricing info (if available)

#### TC-SUPP-002: Add Supplier to Part
- **Objective:** Link new supplier
- **Steps:**
  1. Open Suppliers tab
  2. Click "Add Supplier"
  3. Search and select supplier
  4. Enter supplier part number
  5. Optional: Enter MOQ, lead time, price
  6. Submit
- **Expected:** Supplier link created
- **Validate:**
  - Appears in suppliers list
  - Can edit/delete link
  - Can import supplier part info

### 2.13 Purchase Orders Tab

#### TC-PO-001: Purchase Orders Tab
- **Objective:** View POs for purchaseable part
- **Prerequisite:** Part Purchaseable, POs exist
- **Steps:**
  1. Create PO with purchaseable part
  2. Open part > Purchase Orders tab
- **Expected:** PO listed
- **Validate:**
  - PO number linked
  - Quantity shown
  - Status visible (pending, received, etc.)
  - Link to PO detail functional

### 2.14 Sales Orders Tab

#### TC-SO-001: Sales Orders Tab
- **Objective:** View SOs for salable part
- **Prerequisite:** Part marked Salable, SOs exist
- **Steps:**
  1. Create SO with salable part
  2. Open part > Sales Orders tab
- **Expected:** SO listed
- **Validate:**
  - SO number linked
  - Customer name shown
  - Quantity ordered
  - Status/shipment date shown

### 2.15 Notes Tab

#### TC-NOTE-001: Notes Display and Editing
- **Objective:** Add markdown notes to part
- **Steps:**
  1. Open Notes tab
  2. Click Edit
  3. Enter markdown text:
     - Headers
     - Lists
     - Links
     - Code blocks
  4. Save
- **Expected:** Notes saved and formatted
- **Validate:**
  - Markdown renders correctly
  - Notes persist
  - Can edit again
  - Timestamps shown

### 2.16 Stock History Tab

#### TC-HIST-001: Stock History Display
- **Objective:** View stock transaction history
- **Steps:**
  1. Perform stock operations (add, move, adjust)
  2. Open Stock History tab
- **Expected:** Transactions listed
- **Validate:**
  - All transactions shown
  - Dates/times correct
  - User who made change shown
  - Quantity changes visible
  - Transaction type shown (add, move, adjust, etc.)

---

## Part 3: PART CATEGORIES & FILTERING TESTS

### 3.1 Category Hierarchy

#### TC-CAT-001: Create Category Hierarchy
- **Objective:** Organize parts in nested categories
- **Steps:**
  1. Create root category: "Electronic Components"
  2. Create subcategories:
     - "Resistors"
     - "Capacitors"
     - "Inductors"
  3. Create sub-subcategory:
     - "Resistors" > "Fixed Resistors"
     - "Resistors" > "Variable Resistors"
- **Expected:** Hierarchy created
- **Validate:**
  - All levels visible in category tree
  - Can navigate through hierarchy
  - Breadcrumb shows path

#### TC-CAT-002: Create Part in Nested Category
- **Objective:** Assign part to subcategory
- **Steps:**
  1. Create part
  2. Select category: "Electronic Components > Resistors > Fixed Resistors"
  3. Save
- **Expected:** Part assigned to deep category
- **Validate:**
  - Part appears under category
  - Breadcrumb shows full path
  - Part searchable by category

#### TC-CAT-003: Category Filtering
- **Objective:** Filter parts by category
- **Steps:**
  1. Navigate to "Electronic Components" category
  2. View parts list (includes subcategory parts)
  3. Use category filter to show only "Resistors"
  4. Use filter to show only "Fixed Resistors"
- **Expected:** Filter works correctly
- **Validate:**
  - Part count accurate
  - Only selected category shown (recursive)
  - Can remove filter

#### TC-CAT-004: Parametric Table in Category
- **Objective:** Compare parts in category by parameters
- **Prerequisite:** Category parts have parameters
- **Steps:**
  1. Navigate to category with multiple parts
  2. View parametric table (if available)
  3. Show columns: Name, Voltage, Current, Price
- **Expected:** Table displays comparison
- **Validate:**
  - Parameters for all parts displayed
  - Column customizable
  - Sortable by column
  - Can filter by parameter values

### 3.2 Category Searching

#### TC-CAT-005: Search by Category Keyword
- **Objective:** Find parts using keywords
- **Steps:**
  1. Create parts with keywords:
     - Part 1: keywords "power", "supply", "industrial"
     - Part 2: keywords "power", "adapter"
  2. Search for "power"
- **Expected:** Both parts found
- **Validate:**
  - Search matches keywords
  - Results ranked/sorted
  - Can filter results

---

## Part 4: PART ATTRIBUTES TESTS

### 4.1 Template Attribute

#### TC-ATTR-TEMPLATE-001: Enable Template Attribute
- **Objective:** Mark part as template
- **Steps:**
  1. Create part
  2. Open detail, find Part Options
  3. Toggle "Template" to ON
  4. Save
- **Expected:** Part becomes template
- **Validate:**
  - "Variants" tab appears
  - Can create variants

#### TC-ATTR-TEMPLATE-002: Create Variant from Template
- **Objective:** Generate variant of template part
- **Steps:**
  1. Create Template part
  2. Open Variants tab
  3. Click "New Variant"
  4. Modify name (add suffix)
  5. Submit
- **Expected:** Variant created
- **Validate:**
  - Linked to template
  - Unique ID assigned
  - Inherits template properties
  - Stock counted in template total

#### TC-ATTR-TEMPLATE-003: Template Stock Aggregation
- **Objective:** Verify template stock includes variants
- **Steps:**
  1. Create template with variants
  2. Add stock to template: 50
  3. Add stock to variant 1: 30
  4. Add stock to variant 2: 20
  5. View template stock tab
- **Expected:** Total stock shown as 100
- **Validate:**
  - Template shows aggregated stock
  - Can drill down to variant stock
  - Allocation respects hierarchy

### 4.2 Assembly Attribute

#### TC-ATTR-ASSEMBLY-001: Enable Assembly Attribute
- **Objective:** Mark part as assembly
- **Steps:**
  1. Create part
  2. Toggle "Assembly" ON
  3. Save
- **Expected:** Part becomes assembly
- **Validate:**
  - BOM tab appears
  - Can add BOM items
  - Allocations tab appears

#### TC-ATTR-ASSEMBLY-002: Prevent Assembly of Virtual Parts
- **Objective:** Cannot use virtual part in BOM
- **Steps:**
  1. Create Virtual part
  2. Try to add to BOM
- **Expected:** System prevents or warns
- **Validate:**
  - Virtual part not selectable
  - Or warning shown
  - System maintains data integrity

### 4.3 Component Attribute

#### TC-ATTR-COMPONENT-001: Enable Component Attribute
- **Objective:** Mark part as component (can be used in BOM)
- **Steps:**
  1. Create part
  2. Toggle "Component" ON
  3. Save
- **Expected:** Part can be used in assemblies
- **Validate:**
  - "Used In" tab appears
  - Can add to BOM of another part

#### TC-ATTR-COMPONENT-002: Used In Tab
- **Objective:** View where component is used
- **Steps:**
  1. Create Component part
  2. Add to BOM of Assembly 1 (qty 5)
  3. Add to BOM of Assembly 2 (qty 10)
  4. Open Component > "Used In" tab
- **Expected:** Shows usage
- **Validate:**
  - Both assemblies listed
  - Quantities shown (5, 10)
  - Links to parent assemblies functional

### 4.4 Virtual Attribute

#### TC-ATTR-VIRTUAL-001: Create Virtual Part
- **Objective:** Create non-physical trackable item
- **Steps:**
  1. Create part
  2. Toggle "Virtual" ON
  3. Save
- **Expected:** Virtual part created
- **Validate:**
  - Part marked as virtual
  - Can track quantity (labor, licenses, etc.)
  - Cannot add to BOM (or marked as special)

#### TC-ATTR-VIRTUAL-002: Use Virtual Part
- **Objective:** Track virtual items (e.g., machine time)
- **Steps:**
  1. Create Virtual part "Assembly Labor - 1 hour"
  2. Set UOM: "hours"
  3. Create stock: 1000 hours available
  4. Allocate to build order: 50 hours
- **Expected:** Virtual quantity tracked
- **Validate:**
  - Stock tracks abstract quantity
  - Allocation works normally
  - Cannot have physical location

### 4.5 Trackable Attribute

#### TC-ATTR-TRACKABLE-001: Enable Trackable Attribute
- **Objective:** Mark part for serial/batch tracking
- **Steps:**
  1. Create part
  2. Toggle "Trackable" ON
  3. Save
- **Expected:** Part becomes trackable
- **Validate:**
  - Serial number fields appear
  - Batch number fields appear
  - Stock items require serial/batch

#### TC-ATTR-TRACKABLE-002: Add Serial Numbers
- **Objective:** Track individual units with serial numbers
- **Steps:**
  1. Create trackable part
  2. Add stock with serial numbers:
     - SN001, SN002, SN003
  3. View stock list
- **Expected:** Serial numbers tracked
- **Validate:**
  - Serial numbers displayed
  - Linked to specific stock item
  - Can trace serial to customer

#### TC-ATTR-TRACKABLE-003: Batch Number Tracking
- **Objective:** Track batch/lot numbers
- **Steps:**
  1. Create trackable part
  2. Add stock with batch: BATCH-2025-001 (qty 100)
  3. Add stock with batch: BATCH-2025-002 (qty 100)
- **Expected:** Batches tracked
- **Validate:**
  - Batch number displayed
  - Stock aggregated by batch
  - Can filter by batch

#### TC-ATTR-TRACKABLE-004: Template Variant Serial Constraint
- **Objective:** Serial numbers unique across template/variants
- **Prerequisite:** Template part with variants, all trackable
- **Steps:**
  1. Create template + 2 variants
  2. Add stock to variant 1: SN001
  3. Try to add same serial to variant 2: SN001
- **Expected:** System prevents duplicate
- **Validate:**
  - Error message shown
  - Can use different serial
  - Constraint documented

### 4.6 Purchaseable Attribute

#### TC-ATTR-PURCHASEABLE-001: Enable Purchaseable Attribute
- **Objective:** Mark part for purchase
- **Steps:**
  1. Create part
  2. Toggle "Purchaseable" ON
  3. Save
- **Expected:** Part purchaseable
- **Validate:**
  - Suppliers tab appears
  - Purchase Orders tab appears
  - Can link to supplier

#### TC-ATTR-PURCHASEABLE-002: Link to Supplier
- **Objective:** Create supplier relationship
- **Steps:**
  1. Create purchaseable part
  2. Open Suppliers tab
  3. Add Supplier with part number: SUP-001
  4. Set MOQ: 100, Lead time: 2 weeks
- **Expected:** Supplier linked
- **Validate:**
  - Supplier tab shows link
  - Can create PO from supplier

### 4.7 Salable Attribute

#### TC-ATTR-SALABLE-001: Enable Salable Attribute
- **Objective:** Mark part for sales
- **Steps:**
  1. Create part
  2. Toggle "Salable" ON
  3. Save
- **Expected:** Part salable
- **Validate:**
  - Sales Orders tab appears
  - Can add to sales order
  - Allocations tab appears

#### TC-ATTR-SALABLE-002: Create Sales Order with Salable Part
- **Objective:** Sell part to customer
- **Steps:**
  1. Create salable part with stock
  2. Create Sales Order
  3. Add part: quantity 50
  4. Confirm order
- **Expected:** Part allocated/shipped
- **Validate:**
  - Stock decremented
  - Allocation visible
  - Sales Order tab shows order

### 4.8 Active/Inactive Status

#### TC-ATTR-ACTIVE-001: Mark Part Inactive
- **Objective:** Deprecate part without deletion
- **Steps:**
  1. Create active part
  2. Mark as inactive
  3. Save
- **Expected:** Part status changed
- **Validate:**
  - Inactive indicator shown
  - Cannot add to new orders (or warning)
  - Existing references unchanged

#### TC-ATTR-ACTIVE-002: Inactive Restriction
- **Objective:** Cannot use inactive parts in new operations
- **Steps:**
  1. Create inactive part
  2. Try to add to BOM
  3. Try to create PO
  4. Try to create SO
- **Expected:** System prevents or warns
- **Validate:**
  - Cannot select in dropdown
  - Or warning message

#### TC-ATTR-ACTIVE-003: Reactivate Part
- **Objective:** Restore inactive part to active
- **Steps:**
  1. Inactive part
  2. Mark as active
  3. Save
- **Expected:** Part reactivated
- **Validate:**
  - Can now use in operations
  - No data lost during inactivation
  - History preserved

---

## Part 5: UNITS OF MEASURE TESTS

### 5.1 UOM Configuration

#### TC-UOM-001: Create Part with Physical Unit
- **Objective:** Track part in physical units (not pieces)
- **Steps:**
  1. Create part "Copper Wire"
  2. Set UOM: "meters"
  3. Save
- **Expected:** Part uses meters as base unit
- **Validate:**
  - UOM displayed in stock tab
  - Can create stock: 100 meters

#### TC-UOM-002: Create Stock with UOM
- **Objective:** Add stock with unit conversion
- **Steps:**
  1. Create part with UOM: "meters"
  2. Add stock:
     - Location A: 50 meters
     - Location B: 100 feet (converted to ~30.5 meters)
- **Expected:** Quantities tracked in different units
- **Validate:**
  - Conversion applied automatically
  - Total calculated correctly
  - Display shows conversion factor

#### TC-UOM-003: Incompatible UOM Rejection
- **Objective:** Prevent incompatible unit assignment
- **Steps:**
  1. Create part with UOM: "meters" (length)
  2. Try to create stock with UOM: "kg" (mass)
- **Expected:** System rejects with error
- **Validate:**
  - Cannot select incompatible unit
  - Or error message shown
  - Form not submitted

#### TC-UOM-004: Supplier Part UOM Conversion
- **Objective:** Supplier part in different UOM than base
- **Steps:**
  1. Create part uom: "meters"
  2. Add supplier offering in: "feet"
  3. Set conversion in supplier record
- **Expected:** Quantities converted
- **Validate:**
  - Supplier UOM shown
  - Conversion applied
  - Receiving stock auto-converts

#### TC-UOM-005: BOM Items with UOM
- **Objective:** BOM quantities respect unit
- **Prerequisite:** Assembly with UOM = "feet", component = "meters"
- **Steps:**
  1. Create assembly with UOM (length-based)
  2. Add component to BOM
  3. Set quantity: 10 meters
- **Expected:** BOM tracks unit
- **Validate:**
  - Quantity 10 in correct unit
  - Can specify different unit per BOM line
  - Conversion shown if needed

---

## Part 6: PART REVISIONS TESTS

### 6.1 Revision Creation

#### TC-REV-001: Create Part Revision
- **Objective:** Create new revision of existing part
- **Steps:**
  1. Create part "Amplifier-A"
  2. Navigate to Revisions tab
  3. Click "Duplicate Part"
  4. Set:
     - Part Name: "Amplifier-A"
     - Revision Of: "Amplifier-A" (original)
     - Revision: "B"
  5. Submit
- **Expected:** New revision created
- **Validate:**
  - New part ID assigned
  - Linked to original
  - Revisions tab shows both

#### TC-REV-002: Revision Navigation
- **Objective:** Switch between revisions easily
- **Steps:**
  1. Create part with revisions: Rev A, Rev B, Rev C
  2. Navigate to any revision
  3. Use revision selector dropdown
  4. Select different revision
- **Expected:** Detail view switches
- **Validate:**
  - Correct revision data loaded
  - BOM for revision shown
  - Stock for revision shown
  - Breadcrumb updated

#### TC-REV-003: Independent Revision Data
- **Objective:** Revisions have separate stock, BOM, etc.
- **Steps:**
  1. Create part + revision
  2. Add stock to Rev A: 100 units
  3. Add stock to Rev B: 50 units
  4. Add BOM to Rev A
  5. View Rev B BOM (empty)
- **Expected:** Data independent
- **Validate:**
  - Stock separate per revision
  - BOM separate per revision
  - Can modify Rev A without affecting Rev B

### 6.2 Revision Constraints

#### TC-REV-CONST-001: Prevent Circular References
- **Objective:** Cannot make part a revision of itself
- **Steps:**
  1. Create part "Component"
  2. Try to set "Revision Of" to "Component"
  3. Try to submit
- **Expected:** System rejects
- **Validate:**
  - Cannot select own part
  - Or error message shown
  - Form not submitted

#### TC-REV-CONST-002: Unique Revision Codes
- **Objective:** Each revision code unique per part
- **Steps:**
  1. Create part with revision "A"
  2. Create revision "B"
  3. Try to create another revision "A"
- **Expected:** System rejects duplicate
- **Validate:**
  - Cannot create duplicate revision code
  - Error message shown
  - Unique constraint enforced

#### TC-REV-CONST-003: Prevent Revision of Revision
- **Objective:** Cannot make revision of a revision
- **Steps:**
  1. Create part "Master"
  2. Create revision "Rev-A" of Master
  3. Try to create revision of "Rev-A"
- **Expected:** System prevents or warns
- **Validate:**
  - Cannot select revision in "Revision Of"
  - Or error message shown
  - Hierarchy limited to 2 levels

#### TC-REV-CONST-004: Template Part Cannot Have Revisions
- **Objective:** Template parts cannot be revised
- **Steps:**
  1. Create part
  2. Enable Template flag
  3. Try to create revision
- **Expected:** System prevents
- **Validate:**
  - Cannot set revision for template
  - Error message shown
  - Variants allowed instead

#### TC-REV-CONST-005: Variant Revision Template Reference
- **Objective:** Variant revision must reference same template
- **Steps:**
  1. Create template "Widget"
  2. Create variant "Widget-001"
  3. Create revision of "Widget-001" as "Widget-001-Rev-B"
  4. New revision should reference template "Widget"
- **Expected:** Template reference correct
- **Validate:**
  - Revision linked to Widget template
  - Cannot link to different template

### 6.3 Revision Settings

#### TC-REV-SETTINGS-001: Enable/Disable Revisions
- **Objective:** Control whether revisions allowed
- **Steps:**
  1. Go to Global Settings > Parts
  2. Toggle "Enable Revisions"
  3. Try to create revision
- **Expected:** Revisions enabled/disabled based on setting
- **Validate:**
  - Setting affects all parts
  - Cannot create revision if disabled
  - Error message appropriate

#### TC-REV-SETTINGS-002: Assembly Revisions Only
- **Objective:** Only assemblies can have revisions
- **Steps:**
  1. Go to Global Settings > Parts
  2. Enable "Assembly Revisions Only"
  3. Try to create revision on non-assembly part
- **Expected:** Non-assembly cannot be revised
- **Validate:**
  - "Revision Of" field not available for non-assembly
  - Assembly parts can have revisions
  - Error if attempted on non-assembly

---

## Part 7: NEGATIVE & BOUNDARY TESTS

### 7.1 Duplicate & Constraint Tests

#### TC-NEG-001: Duplicate IPN
- **Objective:** Prevent duplicate Internal Part Number
- **Steps:**
  1. Create part with IPN "UNIQUE-001"
  2. Try to create another with same IPN
- **Expected:** System prevents duplicate
- **Validate:**
  - Cannot create part
  - Error message shown
  - First part unchanged

#### TC-NEG-002: Duplicate Part Name (Same Category)
- **Objective:** Test naming constraints
- **Steps:**
  1. Create part "Resistor-1K" in category "Resistors"
  2. Try to create another "Resistor-1K" in same category
- **Expected:** May be allowed or prevented (design-dependent)
- **Validate:**
  - System behavior documented
  - No corruption if allowed
  - User warned if risky

#### TC-NEG-003: Remove Required Field
- **Objective:** Cannot save part without required fields
- **Steps:**
  1. Create part
  2. Clear Part Name field
  3. Try to save
- **Expected:** Validation error
- **Validate:**
  - Field marked as required
  - Error message shown
  - Form not submitted
  - Previous data retained

#### TC-NEG-004: Invalid External Link
- **Objective:** Validate URL format
- **Steps:**
  1. Create part with External Link: "not-a-url"
  2. Create part with External Link: "http://valid.url"
- **Expected:** Invalid URL rejected or warning
- **Validate:**
  - Validation check performed
  - Valid URL accepted
  - Invalid URL prevented or marked

### 7.2 Inactive Part Restrictions

#### TC-NEG-005: Cannot Create BOM with Inactive Component
- **Objective:** Assembly cannot use inactive parts
- **Steps:**
  1. Create inactive component
  2. Try to add to assembly BOM
- **Expected:** Cannot select
- **Validate:**
  - Inactive part not in dropdown
  - Or warning/error shown
  - BOM not created

#### TC-NEG-006: Cannot Create PO for Inactive Purchaseable
- **Objective:** Cannot purchase inactive part
- **Steps:**
  1. Create inactive purchaseable part
  2. Try to create PO
- **Expected:** Cannot select
- **Validate:**
  - Cannot add to PO
  - Error if attempted
  - Status message clear

#### TC-NEG-007: Cannot Create SO for Inactive Salable
- **Objective:** Cannot sell inactive part
- **Steps:**
  1. Create inactive salable part
  2. Try to create SO
- **Expected:** Cannot select
- **Validate:**
  - Cannot add to SO
  - Error if attempted

#### TC-NEG-008: Existing Operations Not Affected
- **Objective:** Inactivating part doesn't break existing orders
- **Steps:**
  1. Create part with active SO/PO
  2. Mark part inactive
- **Expected:** Existing orders unaffected
- **Validate:**
  - SO/PO still visible
  - Can complete operations
  - Only new operations blocked

### 7.3 Locked Part Restrictions

#### TC-NEG-009: Cannot Edit Locked Part
- **Objective:** Locked parts are read-only
- **Steps:**
  1. Create part
  2. Lock it
  3. Try to edit fields
- **Expected:** Cannot edit
- **Validate:**
  - Fields read-only
  - Edit button disabled
  - Fields grayed out

#### TC-NEG-010: Cannot Delete BOM from Locked Assembly
- **Objective:** Cannot modify BOM of locked assembly
- **Steps:**
  1. Create assembly with BOM
  2. Lock assembly
  3. Try to add/edit/delete BOM items
- **Expected:** Operations blocked
- **Validate:**
  - BOM read-only
  - Actions disabled
  - Error message on attempt

#### TC-NEG-011: Cannot Edit Parameters of Locked Part
- **Objective:** Parameters immutable for locked part
- **Steps:**
  1. Create part with parameters
  2. Lock part
  3. Try to edit parameter values
- **Expected:** Cannot edit
- **Validate:**
  - Parameter fields read-only
  - Cannot add/delete parameters
  - Error on attempt

#### TC-NEG-012: Unlock Permission Required
- **Objective:** Only authorized users can unlock
- **Steps:**
  1. Lock part (admin user)
  2. Switch to readonly user
  3. Try to unlock
- **Expected:** Permission denied
- **Validate:**
  - Unlock button hidden/disabled
  - Error message if attempted
  - Unlock action logged

### 7.4 Boundary & Edge Cases

#### TC-NEG-013: Very Long Part Name
- **Objective:** Handle long field values
- **Steps:**
  1. Create part with Name: 500 characters
  2. Save
- **Expected:** Either truncated or error
- **Validate:**
  - No database errors
  - Clear message if truncated
  - Database field constraint respected

#### TC-NEG-014: Special Characters in IPN
- **Objective:** Handle special chars in IPN
- **Steps:**
  1. Create part with IPN: "PART#@-001"
  2. Create part with IPN: "PART/\\-001"
  3. Create part with IPN: "PART-日本語-001"
- **Expected:** System handles or rejects
- **Validate:**
  - Clear error or acceptance
  - Database stores correctly
  - Search/filter works

#### TC-NEG-015: Category Depth Limit
- **Objective:** Test nested category limit (if exists)
- **Steps:**
  1. Create deeply nested category structure (10+ levels)
  2. Verify display/performance
- **Expected:** No UI/database issues
- **Validate:**
  - Navigation still responsive
  - No truncation of path
  - Performance acceptable

#### TC-NEG-016: BOM Quantity Edge Cases
- **Objective:** Test BOM quantity boundaries
- **Steps:**
  1. Create BOM with quantity: 0
  2. Create BOM with quantity: 1,000,000
  3. Create BOM with negative quantity
  4. Create BOM with decimal quantity: 0.5
- **Expected:** Validation applied
- **Validate:**
  - 0 or negative rejected
  - Large quantities accepted
  - Decimals allowed/rejected per config
  - Clear error messages

#### TC-NEG-017: Stock Quantity Overflow
- **Objective:** Test very large stock quantities
- **Steps:**
  1. Create stock item with quantity: 999,999,999
  2. Allocate large quantity
  3. Try to exceed database capacity
- **Expected:** No overflow
- **Validate:**
  - Large numbers handled
  - No database overflow
  - Calculation accuracy maintained
  - Clear error if limit reached

#### TC-NEG-018: Concurrent Edit Conflict
- **Objective:** Two users editing same part
- **Steps:**
  1. User A opens part for edit
  2. User B opens same part for edit
  3. User A saves changes
  4. User B tries to save
- **Expected:** Conflict detected
- **Validate:**
  - User B gets conflict error
  - Last-write-wins or merge option
  - User notified of conflict
  - No data loss/corruption

#### TC-NEG-019: Revision Circular Loop Prevention
- **Objective:** Prevent accidental circular revision refs
- **Steps:**
  1. Create Part A, revision Rev-A
  2. Create Part B, revision Rev-B
  3. Try to make Part A revision of Rev-B AND Rev-B revision of Part A
- **Expected:** Circular reference prevented
- **Validate:**
  - Cannot create circular link
  - System validates on save
  - Error message clear

#### TC-NEG-020: Mass Import with Constraint Violations
- **Objective:** Import rejects invalid data
- **Steps:**
  1. Create CSV with:
     - Duplicate IPN in file
     - Missing required field
     - Invalid category reference
  2. Attempt import
- **Expected:** Import fails/partially succeeds
- **Validate:**
  - Validation before import
  - Errors reported clearly
  - Option to fix and retry
  - No partial corrupted data

---

## Test Execution Notes

### Test Data Setup
- Create at least 5-10 test categories with hierarchy
- Create 20+ test parts with various attribute combinations
- Pre-populate some test data for searches/filters
- Create supplier, customer, location reference data

### Environment Requirements
- InvenTree instance with demo data
- Test user account with standard permissions
- Admin account for permission testing
- Multiple browsers (Chrome, Firefox, Safari if applicable)

### Test Execution Approach
- Execute systematically by test section
- Document screenshots for critical paths
- Log any UI inconsistencies
- Record performance metrics for large data sets
- Test browser compatibility per test
- Verify accessibility (keyboard navigation, screen readers)

### Regression Testing
- Run full spec after each major release
- Run critical path (core creation/modification) weekly
- Run category-specific tests after related feature changes

### Known Limitations/Design Decisions to Document
- IPN uniqueness constraint scope (global vs per-category)
- Inactive part behavior (hard block vs warning)
- Revision depth limitation (if exists)
- Category depth limitation (if exists)
- Special character support in various fields
- UOM conversion accuracy tolerance

---

## Appendix A: Test Data Examples

### Sample Part Creation Data
```
Part Name: Resistor-1K-1W
IPN: RES-1K-1W-001
Category: Electronic Components > Resistors > Fixed Resistors
Description: 1K Ohm 1 Watt Carbon Film Resistor
Keywords: resistor, 1K, 1W, passive
External Link: https://example.com/resistor/1k-1w
UOM: pieces
```

### Sample Assembly Data
```
Assembly Name: Amplifier Module
IPN: AMP-MOD-001
Type: Assembly

BOM Items:
- Op-Amp IC (qty 2)
- Resistor-10K (qty 20)
- Capacitor-100uF (qty 10)
- PCB Assembly (qty 1)
```

### Sample Supplier Data
```
Supplier: DigiKey Electronics
Supplier Part: DK-12345-ND
Manufacturer: Texas Instruments
MPN: SN74HC595
Lead Time: 1 week
MOQ: 100
Price: $0.45 @ 100+
```

---

## Appendix B: Key Test Metrics

- **Critical Path Tests:** TC-PC-001, TC-PD-001, TC-REV-001, TC-ATTR-ACTIVE-001
- **High Priority:** Part creation, BOM management, revision constraints
- **Medium Priority:** Category organization, advance attributes
- **Low Priority:** UI polish, performance optimization
- **Accessibility Tests:** Keyboard navigation, screen reader compatibility

---

**End of Specification**

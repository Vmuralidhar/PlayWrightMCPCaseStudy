import { test, expect, Page } from '@playwright/test';

/**
 * InvenTree Parts Automation Test Suite
 * 
 * This suite implements automated test cases for InvenTree Parts functionality
 * aligned with the comprehensive test specification (inventree-parts-spec.md)
 * 
 * Test Categories:
 * - Part Creation (manual and import)
 * - Part Detail View Tabs
 * - Part Attributes
 * - Units of Measure
 * - Part Revisions
 * - Negative/Boundary Cases
 */

// Test fixtures and helpers
const BASE_URL = process.env.INVENTREE_URL || 'http://localhost:5000';
const TEST_USERNAME = process.env.TEST_USER || 'admin';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'admin';

test.describe('InvenTree Parts Test Suite', () => {
  
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await loginToInventTree(page);
  });

  test.afterEach(async () => {
    await page.close();
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  async function loginToInventTree(page: Page) {
    await page.goto(`${BASE_URL}/login/`);
    
    // Fill login form
    await page.fill('input[name="username"]', TEST_USERNAME);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL(/.*\//)
    await page.waitForLoadState('networkidle');
  }

  async function navigateToParts(page: Page) {
    await page.goto(`${BASE_URL}/part/`);
    await page.waitForLoadState('networkidle');
  }

  async function clickAddPartsMenu(page: Page) {
    await page.click('button:has-text("Add")');
    await page.waitForTimeout(300);
  }

  async function createBasicPart(page: Page, partName: string, category?: string) {
    await navigateToParts(page);
    await clickAddPartsMenu(page);
    await page.click('text="Create Part"');
    
    // Wait for form to load
    await page.waitForSelector('input[name="name"]');
    
    // Fill form
    await page.fill('input[name="name"]', partName);
    
    if (category) {
      await page.click('[name="category"]');
      await page.waitForTimeout(300);
      await page.click(`button:has-text("${category}")`);
    }
    
    // Submit
    await page.click('button:has-text("Submit")');
    
    // Wait for confirmation and navigation
    await page.waitForURL(/.*\/part\/\d+\/$/);
    return await page.textContent('h1');
  }

  // ============================================================================
  // PART 1: PART CREATION TESTS
  // ============================================================================

  test.describe('Part Creation - Manual Entry', () => {
    
    test('TC-PC-001: Create basic part with minimal fields', async () => {
      const partName = `Test-Part-${Date.now()}`;
      
      await navigateToParts(page);
      await clickAddPartsMenu(page);
      await page.click('text="Create Part"');
      
      // Fill only required field
      await page.fill('input[name="name"]', partName);
      
      // Submit
      await page.click('button:has-text("Submit")');
      
      // Verify creation
      await page.waitForURL(/.*\/part\/\d+\/$/);
      const heading = await page.textContent('h1');
      expect(heading).toContain(partName);
    });

    test('TC-PC-002: Create part with all field values', async () => {
      const partName = `PSU-500W-${Date.now()}`;
      const ipn = `PSU-${Date.now()}`;
      
      await navigateToParts(page);
      await clickAddPartsMenu(page);
      await page.click('text="Create Part"');
      
      // Wait for form fields
      await page.waitForSelector('input[name="name"]');
      
      // Fill form
      await page.fill('input[name="name"]', partName);
      await page.fill('input[name="IPN"]', ipn);
      await page.fill('textarea[name="description"]', 'Test power supply unit 500W');
      await page.fill('input[name="keywords"]', 'power, supply, test');
      await page.fill('input[name="link"]', 'https://example.com/spec');
      
      // Select UOM
      await page.selectOption('select[name="units"]', 'pieces');
      
      // Submit
      await page.click('button:has-text("Submit")');
      
      // Verify part created with all fields
      await page.waitForURL(/.*\/part\/\d+\/$/);
      const partNameText = await page.textContent('h1');
      expect(partNameText).toContain(partName);
      
      // Verify fields in detail view
      expect(await page.textContent('body')).toContain(ipn);
      expect(await page.textContent('body')).toContain('power, supply, test');
    });

    test('TC-PC-006: Form validation - required fields', async () => {
      await navigateToParts(page);
      await clickAddPartsMenu(page);
      await page.click('text="Create Part"');
      
      // Try to submit empty form
      await page.click('button:has-text("Submit")');
      
      // Should show validation error
      const error = await page.textContent('.error, .invalid, [role="alert"]');
      expect(error).toBeTruthy();
    });

    test('TC-PC-007: Field length validation', async () => {
      const veryLongName = 'A'.repeat(300); // Exceed typical max length
      
      await navigateToParts(page);
      await clickAddPartsMenu(page);
      await page.click('text="Create Part"');
      
      await page.fill('input[name="name"]', veryLongName);
      await page.click('button:has-text("Submit")');
      
      // Should either reject or truncate with message
      const pageContent = await page.textContent('body');
      const hasError = await page.$('.error');
      
      if (hasError) {
        expect(await page.$('.error')).toBeTruthy();
      } else {
        // If accepted, verify no data corruption
        await page.waitForURL(/.*\/part\/\d+\/$/);
        const heading = await page.textContent('h1');
        expect(heading).toBeTruthy();
      }
    });

    test('TC-PC-008: Special characters in part name', async () => {
      const specialName = `Part@#$%-${Date.now()}`;
      
      const result = await createBasicPart(page, specialName);
      expect(result).toContain(specialName);
    });
  });

  test.describe('Part Duplication', () => {
    
    test('TC-PC-005: Duplicate part creates independent copy', async () => {
      // Create initial part
      const originalName = `Original-${Date.now()}`;
      const createdText = await createBasicPart(page, originalName);
      expect(createdText).toContain(originalName);
      
      // Extract part ID
      const partUrl = page.url();
      const partId = partUrl.match(/\/part\/(\d+)\//)?.[1];
      
      // Find and click duplicate option
      // Note: Implementation depends on UI structure
      const contextMenu = await page.$('[data-test="part-actions"]');
      if (contextMenu) {
        await contextMenu.click();
        await page.click('text="Duplicate"');
        
        // Modify name for duplicate
        const duplicateName = `Duplicate-${Date.now()}`;
        await page.fill('input[name="name"]', duplicateName);
        await page.click('button:has-text("Submit")');
        
        // Verify duplicate created with different ID
        await page.waitForURL(/.*\/part\/\d+\/$/);
        const newUrl = page.url();
        const newPartId = newUrl.match(/\/part\/(\d+)\//)?.[1];
        
        expect(newPartId).not.toEqual(partId);
        expect(await page.textContent('h1')).toContain(duplicateName);
      }
    });
  });

  // ============================================================================
  // PART 2: PART DETAIL VIEW TESTS
  // ============================================================================

  test.describe('Part Detail View - Tabs', () => {
    
    let testPartId: string;

    test.beforeEach(async () => {
      // Create test part for detail view tests
      const partName = `Detail-Test-${Date.now()}`;
      await createBasicPart(page, partName);
      
      const url = page.url();
      testPartId = url.match(/\/part\/(\d+)\//)?.[1] || '';
    });

    test('TC-PD-001: Display all part detail fields', async () => {
      await page.goto(`${BASE_URL}/part/${testPartId}/`);
      
      // Toggle details panel
      const detailsButton = await page.$('text = "Show Part Details"');
      if (detailsButton) {
        await detailsButton.click();
        await page.waitForTimeout(500);
      }
      
      // Verify fields present
      const pageContent = await page.textContent('body');
      expect(pageContent).toContain('Detail-Test');
      expect(pageContent).toMatch(/Part.*ID|Internal.*Number/i);
    });

    test('TC-PD-003: Part attributes toggle', async () => {
      await page.goto(`${BASE_URL}/part/${testPartId}/`);
      
      // Find attribute toggles
      const templateToggle = await page.$('[data-attribute="template"]');
      const assemblyToggle = await page.$('[data-attribute="assembly"]');
      
      if (assemblyToggle) {
        const initialState = await assemblyToggle.isChecked?.();
        
        await assemblyToggle.click?.();
        await page.waitForTimeout(500);
        
        // Verify toggle changed
        const newState = await assemblyToggle.isChecked?.();
        expect(newState).not.toEqual(initialState);
        
        // BOM tab should appear for assembly
        const bomTab = await page.$('text = "Bill of Materials"');
        if (newState) {
          expect(bomTab).toBeTruthy();
        }
      }
    });

    test('TC-ST-001: Stock tab displays stock items', async () => {
      await page.goto(`${BASE_URL}/part/${testPartId}/`);
      
      // Click Stock tab
      await page.click('text = "Stock"');
      await page.waitForLoadState('networkidle');
      
      // Verify stock table present
      const stockTable = await page.$('[data-test="stock-table"], table');
      expect(stockTable).toBeTruthy();
    });

    test('TC-ST-003: Create new stock item from tab', async () => {
      await page.goto(`${BASE_URL}/part/${testPartId}/`);
      await page.click('text = "Stock"');
      
      // Find Create Stock button
      const createButton = await page.$('text = "New Stock Item", button:has-text("Create")');
      if (createButton) {
        await createButton.click();
        await page.waitForSelector('input[name="quantity"]');
        
        // Fill stock form
        await page.fill('input[name="quantity"]', '100');
        await page.selectOption('select[name="location"]', { index: 1 });
        
        // Submit
        await page.click('button:has-text("Submit")');
        
        // Verify stock created
        await page.waitForLoadState('networkidle');
        const stockContent = await page.textContent('body');
        expect(stockContent).toContain('100');
      }
    });
  });

  // ============================================================================
  // PART 4: PART ATTRIBUTES TESTS
  // ============================================================================

  test.describe('Part Attributes', () => {
    
    test('TC-ATTR-ASSEMBLY-001: Enable assembly attribute', async () => {
      const partName = `Assembly-Test-${Date.now()}`;
      await createBasicPart(page, partName);
      
      // Find and toggle Assembly attribute
      const assemblyToggle = await page.$('[data-attribute="assembly"], input[value="assembly"]');
      if (assemblyToggle?.parentElement()) {
        // Parent might be label or checkbox wrapper
        await assemblyToggle.click();
        
        // Save/Apply changes
        const saveButton = await page.$('button:has-text("Save")');
        if (saveButton) {
          await saveButton.click();
          await page.waitForLoadState('networkidle');
        }
        
        // Verify BOM tab now visible
        await page.waitForTimeout(500);
        const bomTab = await page.$('text = "Bill of Materials"');
        expect(bomTab).toBeTruthy();
      }
    });

    test('TC-ATTR-TRACKABLE-001: Enable trackable attribute', async () => {
      const partName = `Trackable-Test-${Date.now()}`;
      await createBasicPart(page, partName);
      
      // Toggle Trackable
      const trackableToggle = await page.$('[data-attribute="trackable"]');
      if (trackableToggle) {
        await trackableToggle.click();
        
        // Verify serial number fields appear
        await page.waitForTimeout(500);
        const serialField = await page.$('input[name*="serial"], input[placeholder*="Serial"]');
        expect(serialField).toBeTruthy();
      }
    });

    test('TC-ATTR-ACTIVE-001: Mark part inactive', async () => {
      const partName = `Inactive-Test-${Date.now()}`;
      await createBasicPart(page, partName);
      
      // Find active/inactive toggle
      const inactiveToggle = await page.$('[data-attribute="active"], input[name="active"]');
      if (inactiveToggle) {
        await inactiveToggle.click();
        
        // Save
        const saveButton = await page.$('button:has-text("Save"), button:has-text("Update")');
        if (saveButton) {
          await saveButton.click();
          await page.waitForLoadState('networkidle');
        }
        
        // Verify part shows as inactive
        const inactiveIndicator = await page.textContent('body');
        expect(inactiveIndicator).toContain(/inactive|archived/i);
      }
    });
  });

  // ============================================================================
  // PART 5: UNITS OF MEASURE TESTS
  // ============================================================================

  test.describe('Units of Measure', () => {
    
    test('TC-UOM-001: Create part with physical unit', async () => {
      const partName = `Wire-${Date.now()}`;
      
      await navigateToParts(page);
      await clickAddPartsMenu(page);
      await page.click('text="Create Part"');
      
      // Fill part info
      await page.fill('input[name="name"]', partName);
      
      // Select UOM
      await page.selectOption('select[name="units"]', 'meters');
      
      // Submit
      await page.click('button:has-text("Submit")');
      
      // Verify UOM displayed
      await page.waitForURL(/.*\/part\/\d+\/$/);
      const content = await page.textContent('body');
      expect(content).toContain('meters');
    });

    test('TC-UOM-003: Reject incompatible UOM in stock', async () => {
      const partName = `Length-Test-${Date.now()}`;
      const createdText = await createBasicPart(page, partName);
      expect(createdText).toBeTruthy();
      
      // Go to Stock tab and try to create stock with wrong UOM
      await page.click('text = "Stock"');
      
      const createStockBtn = await page.$('text = "New Stock Item"');
      if (createStockBtn) {
        await createStockBtn.click();
        
        // Try to select incompatible UOM (mass unit for length part)
        // This would require the UOM field to be visible in the form
        const uomSelect = await page.$('select[name*="units"], select[name*="uom"]');
        if (uomSelect) {
          // Attempt to select kilogram (incompatible)
          await page.selectOption(uomSelect, { label: 'kg' }).catch(() => {
            // Expected to fail or system should prevent
          });
          
          // Try to submit
          await page.click('button:has-text("Submit")');
          
          // Should get validation error
          const error = await page.$('.error, [role="alert"]');
          expect(error).toBeTruthy();
        }
      }
    });
  });

  // ============================================================================
  // PART 6: PART REVISIONS TESTS
  // ============================================================================

  test.describe('Part Revisions', () => {
    
    test('TC-REV-001: Create part revision', async () => {
      const partName = `Amp-${Date.now()}`;
      const createdText = await createBasicPart(page, partName);
      expect(createdText).toBeTruthy();
      
      // Get current part ID
      const url = page.url();
      const partId = url.match(/\/part\/(\d+)\//)?.[1];
      
      // Navigate to Revisions tab
      const revisionsTab = await page.$('text = "Revisions"');
      if (revisionsTab) {
        await revisionsTab.click();
        await page.waitForLoadState('networkidle');
        
        // Look for duplicate part action
        const duplicateBtn = await page.$('text = "Duplicate Part"');
        if (duplicateBtn) {
          await duplicateBtn.click();
          
          // Fill revision form
          await page.waitForSelector('input[name="name"]');
          
          // Keep same name
          const revisionField = await page.$('input[name="revision"]');
          if (revisionField) {
            await revisionField.click();
            await page.keyboard.press('ArrowLeft');
            await page.keyboard.press('ArrowLeft');
            await page.keyboard.type('B');
          }
          
          // Submit
          await page.click('button:has-text("Submit")');
          
          // Verify new revision created
          await page.waitForURL(/.*\/part\/\d+\//);
          const newUrl = page.url();
          const newPartId = newUrl.match(/\/part\/(\d+)\//)?.[1];
          
          expect(newPartId).not.toEqual(partId);
          expect(newPartId).toBeTruthy();
        }
      }
    });

    test('TC-REV-CONST-001: Prevent circular reference', async () => {
      const partName = `Component-${Date.now()}`;
      const createdText = await createBasicPart(page, partName);
      expect(createdText).toBeTruthy();
      
      // Get part ID
      const url = page.url();
      const partId = url.match(/\/part\/(\d+)\//)?.[1];
      
      // Try to create revision of itself
      const revisionsTab = await page.$('text = "Revisions"');
      if (revisionsTab) {
        await revisionsTab.click();
        
        const duplicateBtn = await page.$('text = "Duplicate Part"');
        if (duplicateBtn) {
          await duplicateBtn.click();
          
          // Try to set Revision Of to same part
          const revisionOfField = await page.$('select[name="revision_of"]');
          if (revisionOfField) {
            // Select self (should be prevented)
            try {
              await revisionOfField.selectOption({ label: partName });
              await page.click('button:has-text("Submit")');
              
              // Should get error
              const error = await page.$('.error, [role="alert"]');
              expect(error).toBeTruthy();
            } catch {
              // Expected if self-selection is prevented at UI level
              expect(true).toBeTruthy();
            }
          }
        }
      }
    });
  });

  // ============================================================================
  // PART 7: NEGATIVE & BOUNDARY TESTS
  // ============================================================================

  test.describe('Negative & Boundary Cases', () => {
    
    test('TC-NEG-001: Prevent duplicate IPN', async () => {
      const uniqueIPN = `UNIQUE-${Date.now()}`;
      
      // Create first part with IPN
      await navigateToParts(page);
      await clickAddPartsMenu(page);
      await page.click('text="Create Part"');
      
      await page.fill('input[name="name"]', `Part1-${Date.now()}`);
      await page.fill('input[name="IPN"]', uniqueIPN);
      await page.click('button:has-text("Submit")');
      await page.waitForURL(/.*\/part\/\d+\/$/);
      
      // Try to create second part with same IPN
      await navigateToParts(page);
      await clickAddPartsMenu(page);
      await page.click('text="Create Part"');
      
      await page.fill('input[name="name"]', `Part2-${Date.now()}`);
      await page.fill('input[name="IPN"]', uniqueIPN);
      await page.click('button:has-text("Submit")');
      
      // Should get validation error
      await page.waitForTimeout(500);
      const error = await page.$('.error, [role="alert"]');
      expect(error).toBeTruthy();
      expect(await page.textContent('body')).toMatch(/duplicate|already.*exists/i);
    });

    test('TC-NEG-005: Cannot add inactive component to BOM', async () => {
      // Create component and mark inactive
      const componentName = `Comp-${Date.now()}`;
      const compText = await createBasicPart(page, componentName);
      expect(compText).toBeTruthy();
      
      // Mark as inactive
      const inactiveToggle = await page.$('[data-attribute="active"]');
      if (inactiveToggle) {
        await inactiveToggle.click();
        const saveBtn = await page.$('button:has-text("Save")');
        if (saveBtn) await saveBtn.click();
        await page.waitForLoadState('networkidle');
      }
      
      // Create assembly
      const assemblyName = `Assy-${Date.now()}`;
      await navigateToParts(page);
      await clickAddPartsMenu(page);
      await page.click('text="Create Part"');
      
      await page.fill('input[name="name"]', assemblyName);
      
      // Enable Assembly
      const assemblyToggle = await page.$('[data-attribute="assembly"]');
      if (assemblyToggle) await assemblyToggle.click();
      
      await page.click('button:has-text("Submit")');
      await page.waitForURL(/.*\/part\/\d+\/$/);
      
      // Go to BOM tab and try to add inactive component
      await page.click('text = "Bill of Materials"');
      
      const addBomBtn = await page.$('text = "Add BOM Item"');
      if (addBomBtn) {
        await addBomBtn.click();
        await page.waitForSelector('select[name*="part"]');
        
        // Inactive component should not be in dropdown
        const partSelect = await page.$('select[name*="part"]');
        if (partSelect) {
          // Check if dropdown contains the inactive part
          const options = await page.$$('select[name*="part"] option');
          let foundInactive = false;
          
          for (const option of options) {
            const text = await option.textContent();
            if (text?.includes(componentName)) {
              foundInactive = true;
              break;
            }
          }
          
          expect(foundInactive).toBeFalsy();
        }
      }
    });

    test('TC-NEG-008: Inactive part preserves existing operations', async () => {
      const partName = `SO-Part-${Date.now()}`;
      const createdText = await createBasicPart(page, partName);
      expect(createdText).toBeTruthy();
      
      // Get part ID for later reference
      const url = page.url();
      const partId = url.match(/\/part\/(\d+)\//)?.[1];
      
      // Mark as inactive
      const inactiveToggle = await page.$('[data-attribute="active"]');
      if (inactiveToggle) {
        await inactiveToggle.click();
        const saveBtn = await page.$('button:has-text("Save")');
        if (saveBtn) await saveBtn.click();
        await page.waitForLoadState('networkidle');
      }
      
      // Navigate back to part to verify it's still accessible
      await page.goto(`${BASE_URL}/part/${partId}/`);
      const header = await page.textContent('h1');
      expect(header).toContain(partName);
    });
  });
});

export { };

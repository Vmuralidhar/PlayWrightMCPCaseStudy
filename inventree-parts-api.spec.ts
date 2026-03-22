import { test, expect, APIRequestContext } from '@playwright/test';

// Configuration
const BASE_URL = process.env.INVENTREE_URL || 'http://localhost:5000';
const API_BASE = `${BASE_URL}/api`;
const TEST_USER = process.env.TEST_USER || 'admin';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'admin';

// Test data
const TEST_DATA = {
  categories: {
    electronics: { name: 'Electronics', description: 'Electronic components' },
    mechanical: { name: 'Mechanical', description: 'Mechanical parts' },
    subCategory: { name: 'Resistors', description: 'Resistor components', parent: null }
  },
  parts: {
    basic: {
      name: 'Test Resistor 1K',
      description: '1K ohm resistor for testing',
      category: null, // Will be set dynamically
      IPN: 'RES-1K-001',
      units: 'pcs'
    },
    comprehensive: {
      name: 'Comprehensive Test Part',
      IPN: 'CTP-001',
      description: 'A comprehensive test part with all fields',
      category: null, // Will be set dynamically
      keywords: 'test, comprehensive, api',
      link: 'https://example.com',
      units: 'pcs',
      assembly: true,
      component: true,
      purchaseable: true,
      salable: true,
      trackable: false,
      testable: false,
      virtual: false,
      active: true,
      minimum_stock: 10,
      revision: 'v1.0'
    }
  }
};

// Helper functions
async function getAuthToken(request: APIRequestContext): Promise<string> {
  const response = await request.post(`${API_BASE}/user/token/`, {
    data: {
      username: TEST_USER,
      password: TEST_PASSWORD
    }
  });

  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  return data.token;
}

async function createTestCategory(request: APIRequestContext, token: string, categoryData: any): Promise<number> {
  const response = await request.post(`${API_BASE}/part/category/`, {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    },
    data: categoryData
  });

  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  return data.pk;
}

async function createTestPart(request: APIRequestContext, token: string, partData: any): Promise<number> {
  const response = await request.post(`${API_BASE}/part/`, {
    headers: {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    },
    data: partData
  });

  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  return data.pk;
}

async function cleanupTestData(request: APIRequestContext, token: string, partIds: number[], categoryIds: number[]) {
  // Delete parts first (to avoid foreign key constraints)
  for (const partId of partIds) {
    try {
      await request.delete(`${API_BASE}/part/${partId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
    } catch (error) {
      console.log(`Failed to delete part ${partId}:`, error);
    }
  }

  // Delete categories (children first due to tree structure)
  for (const categoryId of categoryIds.reverse()) {
    try {
      await request.delete(`${API_BASE}/part/category/${categoryId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
    } catch (error) {
      console.log(`Failed to delete category ${categoryId}:`, error);
    }
  }
}

test.describe('InvenTree Parts API Tests', () => {
  let request: APIRequestContext;
  let token: string;
  let createdPartIds: number[] = [];
  let createdCategoryIds: number[] = [];

  test.beforeAll(async ({ playwright }) => {
    request = await playwright.request.newContext({
      baseURL: BASE_URL
    });
    token = await getAuthToken(request);
  });

  test.afterAll(async () => {
    await cleanupTestData(request, token, createdPartIds, createdCategoryIds);
    await request.dispose();
  });

  test.describe('Authentication', () => {
    test('should obtain valid authentication token', async () => {
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('should reject invalid credentials', async () => {
      const response = await request.post(`${API_BASE}/user/token/`, {
        data: {
          username: 'invalid_user',
          password: 'invalid_password'
        }
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('non_field_errors');
    });
  });

  test.describe('Part CRUD Operations', () => {
    test('TC-API-PART-CRUD-001: Create basic part', async () => {
      const electronicsCategoryId = await createTestCategory(request, token, TEST_DATA.categories.electronics);
      createdCategoryIds.push(electronicsCategoryId);

      const partData = { ...TEST_DATA.parts.basic, category: electronicsCategoryId };

      const response = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: partData
      });

      expect(response.status()).toBe(201);
      const data = await response.json();

      expect(data).toHaveProperty('pk');
      expect(data.name).toBe(partData.name);
      expect(data.category).toBe(electronicsCategoryId);
      expect(data.active).toBe(true);
      expect(data).toHaveProperty('creation_date');

      createdPartIds.push(data.pk);
    });

    test('TC-API-PART-CRUD-002: Create part with all fields', async () => {
      const mechanicalCategoryId = await createTestCategory(request, token, TEST_DATA.categories.mechanical);
      createdCategoryIds.push(mechanicalCategoryId);

      const partData = { ...TEST_DATA.parts.comprehensive, category: mechanicalCategoryId };

      const response = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: partData
      });

      expect(response.status()).toBe(201);
      const data = await response.json();

      // Verify all fields are set correctly
      expect(data.name).toBe(partData.name);
      expect(data.IPN).toBe(partData.IPN);
      expect(data.description).toBe(partData.description);
      expect(data.category).toBe(mechanicalCategoryId);
      expect(data.keywords).toBe(partData.keywords);
      expect(data.link).toBe(partData.link);
      expect(data.units).toBe(partData.units);
      expect(data.assembly).toBe(partData.assembly);
      expect(data.component).toBe(partData.component);
      expect(data.purchaseable).toBe(partData.purchaseable);
      expect(data.salable).toBe(partData.salable);
      expect(data.trackable).toBe(partData.trackable);
      expect(data.testable).toBe(partData.testable);
      expect(data.virtual).toBe(partData.virtual);
      expect(data.active).toBe(partData.active);
      expect(data.minimum_stock).toBe(partData.minimum_stock);
      expect(data.revision).toBe(partData.revision);

      createdPartIds.push(data.pk);
    });

    test('TC-API-PART-CRUD-003: Read part detail', async () => {
      // Create a test part first
      const categoryId = await createTestCategory(request, token, { name: 'Read Test Category' });
      createdCategoryIds.push(categoryId);

      const partId = await createTestPart(request, token, {
        name: 'Read Test Part',
        category: categoryId
      });
      createdPartIds.push(partId);

      // Now read the part detail
      const response = await request.get(`${API_BASE}/part/${partId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.pk).toBe(partId);
      expect(data.name).toBe('Read Test Part');
      expect(data.category).toBe(categoryId);
      expect(data).toHaveProperty('category_detail');
      expect(data.category_detail.name).toBe('Read Test Category');
    });

    test('TC-API-PART-CRUD-004: Update part (full)', async () => {
      // Create a test part first
      const categoryId = await createTestCategory(request, token, { name: 'Update Test Category' });
      createdCategoryIds.push(categoryId);

      const partId = await createTestPart(request, token, {
        name: 'Update Test Part',
        description: 'Original description',
        category: categoryId
      });
      createdPartIds.push(partId);

      // Update the part with full payload
      const updateData = {
        name: 'Updated Test Part',
        description: 'Updated description',
        category: categoryId,
        active: false,
        IPN: 'UPD-001'
      };

      const response = await request.put(`${API_BASE}/part/${partId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: updateData
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.name).toBe('Updated Test Part');
      expect(data.description).toBe('Updated description');
      expect(data.active).toBe(false);
      expect(data.IPN).toBe('UPD-001');
    });

    test('TC-API-PART-CRUD-005: Update part (partial)', async () => {
      // Create a test part first
      const categoryId = await createTestCategory(request, token, { name: 'Patch Test Category' });
      createdCategoryIds.push(categoryId);

      const partId = await createTestPart(request, token, {
        name: 'Patch Test Part',
        description: 'Original description',
        category: categoryId
      });
      createdPartIds.push(partId);

      // Update only the description
      const response = await request.patch(`${API_BASE}/part/${partId}/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: { description: 'Patched description' }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.name).toBe('Patch Test Part'); // Unchanged
      expect(data.description).toBe('Patched description'); // Changed
      expect(data.category).toBe(categoryId); // Unchanged
    });

    test('TC-API-PART-CRUD-006: Delete part', async () => {
      // Create a test part first
      const categoryId = await createTestCategory(request, token, { name: 'Delete Test Category' });
      createdCategoryIds.push(categoryId);

      const partId = await createTestPart(request, token, {
        name: 'Delete Test Part',
        category: categoryId
      });

      // Delete the part
      const deleteResponse = await request.delete(`${API_BASE}/part/${partId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(deleteResponse.status()).toBe(204);

      // Verify part is gone
      const getResponse = await request.get(`${API_BASE}/part/${partId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(getResponse.status()).toBe(404);
    });
  });

  test.describe('Part Category CRUD Operations', () => {
    test('TC-API-CATEGORY-CRUD-001: Create basic category', async () => {
      const response = await request.post(`${API_BASE}/part/category/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: { name: 'Basic Test Category' }
      });

      expect(response.status()).toBe(201);
      const data = await response.json();

      expect(data).toHaveProperty('pk');
      expect(data.name).toBe('Basic Test Category');
      expect(data).toHaveProperty('pathstring');
      expect(data.pathstring).toBe('Basic Test Category');

      createdCategoryIds.push(data.pk);
    });

    test('TC-API-CATEGORY-CRUD-002: Create nested category', async () => {
      // Create parent category first
      const parentResponse = await request.post(`${API_BASE}/part/category/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: { name: 'Parent Category' }
      });
      const parentData = await parentResponse.json();
      createdCategoryIds.push(parentData.pk);

      // Create child category
      const childResponse = await request.post(`${API_BASE}/part/category/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Child Category',
          parent: parentData.pk
        }
      });

      expect(childResponse.status()).toBe(201);
      const childData = await childResponse.json();

      expect(childData.parent).toBe(parentData.pk);
      expect(childData.pathstring).toBe('Parent Category/Child Category');

      createdCategoryIds.push(childData.pk);
    });

    test('TC-API-CATEGORY-CRUD-003: Read category detail', async () => {
      // Create a test category with parts
      const categoryId = await createTestCategory(request, token, { name: 'Detail Test Category' });
      createdCategoryIds.push(categoryId);

      // Create a part in this category
      const partId = await createTestPart(request, token, {
        name: 'Part in Detail Category',
        category: categoryId
      });
      createdPartIds.push(partId);

      // Get category detail
      const response = await request.get(`${API_BASE}/part/category/${categoryId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.pk).toBe(categoryId);
      expect(data.name).toBe('Detail Test Category');
      expect(data.part_count).toBe(1);
    });
  });

  test.describe('Filtering, Pagination, and Search', () => {
    let testCategory1: number;
    let testCategory2: number;
    let testPart1: number;
    let testPart2: number;
    let testPart3: number;

    test.beforeAll(async () => {
      // Setup test data
      testCategory1 = await createTestCategory(request, token, { name: 'Filter Category 1' });
      testCategory2 = await createTestCategory(request, token, { name: 'Filter Category 2' });

      testPart1 = await createTestPart(request, token, {
        name: 'Active Filter Part',
        category: testCategory1,
        active: true
      });

      testPart2 = await createTestPart(request, token, {
        name: 'Inactive Filter Part',
        category: testCategory1,
        active: false
      });

      testPart3 = await createTestPart(request, token, {
        name: 'Assembly Filter Part',
        category: testCategory2,
        assembly: true
      });

      createdCategoryIds.push(testCategory1, testCategory2);
      createdPartIds.push(testPart1, testPart2, testPart3);
    });

    test('TC-API-PART-FILTER-001: Filter by category', async () => {
      const response = await request.get(`${API_BASE}/part/?category=${testCategory1}`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.count).toBe(2); // Both parts in category 1
      expect(data.results.every((part: any) => part.category === testCategory1)).toBe(true);
    });

    test('TC-API-PART-FILTER-002: Filter by active status', async () => {
      const activeResponse = await request.get(`${API_BASE}/part/?active=true`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(activeResponse.status()).toBe(200);
      const activeData = await activeResponse.json();

      expect(activeData.results.every((part: any) => part.active === true)).toBe(true);

      const inactiveResponse = await request.get(`${API_BASE}/part/?active=false`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(inactiveResponse.status()).toBe(200);
      const inactiveData = await inactiveResponse.json();

      expect(inactiveData.results.every((part: any) => part.active === false)).toBe(true);
    });

    test('TC-API-PART-FILTER-003: Filter by assembly/component', async () => {
      const assemblyResponse = await request.get(`${API_BASE}/part/?assembly=true`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(assemblyResponse.status()).toBe(200);
      const assemblyData = await assemblyResponse.json();

      expect(assemblyData.results.some((part: any) => part.assembly === true)).toBe(true);
    });

    test('TC-API-PART-FILTER-004: Search by name', async () => {
      const response = await request.get(`${API_BASE}/part/?search=Filter`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.count).toBeGreaterThan(0);
      expect(data.results.every((part: any) =>
        part.name.toLowerCase().includes('filter') ||
        (part.description && part.description.toLowerCase().includes('filter'))
      )).toBe(true);
    });

    test('TC-API-PART-FILTER-005: Pagination', async () => {
      const response = await request.get(`${API_BASE}/part/?limit=2`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.results.length).toBeLessThanOrEqual(2);
      expect(data).toHaveProperty('next');
      expect(data).toHaveProperty('previous');
      expect(data).toHaveProperty('count');
    });

    test('TC-API-PART-FILTER-006: Complex filtering', async () => {
      const response = await request.get(`${API_BASE}/part/?category=${testCategory1}&active=true&limit=10`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.results.every((part: any) =>
        part.category === testCategory1 && part.active === true
      )).toBe(true);
    });
  });

  test.describe('Field-Level Validation', () => {
    test('TC-API-VALIDATION-001: Required fields', async () => {
      const response = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {} // Empty payload
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('name'); // name is required
    });

    test('TC-API-VALIDATION-002: Field length limits', async () => {
      const longName = 'a'.repeat(101); // Name max length is 100
      const response = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: longName,
          category: 1
        }
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('name');
    });

    test('TC-API-VALIDATION-003: IPN uniqueness', async () => {
      // Create first part with IPN
      const categoryId = await createTestCategory(request, token, { name: 'IPN Test Category' });
      createdCategoryIds.push(categoryId);

      const partId = await createTestPart(request, token, {
        name: 'First IPN Part',
        IPN: 'UNIQUE-IPN-001',
        category: categoryId
      });
      createdPartIds.push(partId);

      // Try to create second part with same IPN
      const response = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Second IPN Part',
          IPN: 'UNIQUE-IPN-001', // Same IPN
          category: categoryId
        }
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data).toHaveProperty('IPN');
    });

    test('TC-API-VALIDATION-004: Units validation', async () => {
      const categoryId = await createTestCategory(request, token, { name: 'Units Test Category' });
      createdCategoryIds.push(categoryId);

      // Valid units
      const validResponse = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Valid Units Part',
          units: 'kg',
          category: categoryId
        }
      });

      expect(validResponse.status()).toBe(201);
      const validData = await validResponse.json();
      createdPartIds.push(validData.pk);

      // Invalid units
      const invalidResponse = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Invalid Units Part',
          units: 'invalid_unit',
          category: categoryId
        }
      });

      expect(invalidResponse.status()).toBe(400);
      const invalidData = await invalidResponse.json();
      expect(invalidData).toHaveProperty('units');
    });

    test('TC-API-VALIDATION-005: URL validation', async () => {
      const categoryId = await createTestCategory(request, token, { name: 'URL Test Category' });
      createdCategoryIds.push(categoryId);

      // Valid URL
      const validResponse = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Valid URL Part',
          link: 'https://example.com',
          category: categoryId
        }
      });

      expect(validResponse.status()).toBe(201);
      const validData = await validResponse.json();
      createdPartIds.push(validData.pk);

      // Invalid URL
      const invalidResponse = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Invalid URL Part',
          link: 'not-a-valid-url',
          category: categoryId
        }
      });

      expect(invalidResponse.status()).toBe(400);
      const invalidData = await invalidResponse.json();
      expect(invalidData).toHaveProperty('link');
    });
  });

  test.describe('Relational Integrity', () => {
    test('TC-API-RELATION-001: Category assignment', async () => {
      const categoryId = await createTestCategory(request, token, { name: 'Relation Test Category' });
      createdCategoryIds.push(categoryId);

      const partId = await createTestPart(request, token, {
        name: 'Relation Test Part',
        category: categoryId
      });
      createdPartIds.push(partId);

      // Get part detail to verify category relationship
      const response = await request.get(`${API_BASE}/part/${partId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(200);
      const data = await response.json();

      expect(data.category).toBe(categoryId);
      expect(data.category_detail.name).toBe('Relation Test Category');
    });

    test('TC-API-RELATION-004: Category deletion protection', async () => {
      const categoryId = await createTestCategory(request, token, { name: 'Protected Category' });
      const partId = await createTestPart(request, token, {
        name: 'Part in Protected Category',
        category: categoryId
      });
      createdPartIds.push(partId);

      // Try to delete category with parts
      const response = await request.delete(`${API_BASE}/part/category/${categoryId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(400);
      const data = await response.json();
      expect(data.detail).toContain('parts');

      // Clean up - delete part first, then category
      await request.delete(`${API_BASE}/part/${partId}/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      createdPartIds.pop(); // Remove from cleanup list

      createdCategoryIds.push(categoryId); // Add to cleanup
    });
  });

  test.describe('Edge Cases and Error Scenarios', () => {
    test('TC-API-EDGE-001: Invalid payload format', async () => {
      const response = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: '{invalid json' // Invalid JSON
      });

      expect(response.status()).toBe(400);
    });

    test('TC-API-EDGE-002: Unauthorized access', async () => {
      const response = await request.get(`${API_BASE}/part/`, {
        headers: { 'Authorization': 'Token invalid_token' }
      });

      expect(response.status()).toBe(401);
    });

    test('TC-API-EDGE-003: Forbidden actions', async () => {
      // This would require setting up a user with limited permissions
      // For now, we'll test with invalid token (covered above)
      // In a real scenario, you'd create a user with read-only permissions
    });

    test('TC-API-EDGE-004: Non-existent resources', async () => {
      const response = await request.get(`${API_BASE}/part/99999/`, {
        headers: { 'Authorization': `Token ${token}` }
      });

      expect(response.status()).toBe(404);
    });

    test('TC-API-EDGE-007: Special characters', async () => {
      const categoryId = await createTestCategory(request, token, { name: 'Unicode Test Category' });
      createdCategoryIds.push(categoryId);

      const response = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Part with Unicode: ñáéíóú 🚀',
          description: 'Description with special chars: @#$%^&*()',
          category: categoryId
        }
      });

      expect(response.status()).toBe(201);
      const data = await response.json();
      createdPartIds.push(data.pk);

      expect(data.name).toBe('Part with Unicode: ñáéíóú 🚀');
      expect(data.description).toBe('Description with special chars: @#$%^&*()');
    });

    test('TC-API-EDGE-008: Boundary values', async () => {
      const categoryId = await createTestCategory(request, token, { name: 'Boundary Test Category' });
      createdCategoryIds.push(categoryId);

      // Test minimum_stock = 0
      const zeroStockResponse = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Zero Stock Part',
          minimum_stock: 0,
          category: categoryId
        }
      });

      expect(zeroStockResponse.status()).toBe(201);
      const zeroStockData = await zeroStockResponse.json();
      createdPartIds.push(zeroStockData.pk);
      expect(zeroStockData.minimum_stock).toBe(0);

      // Test large minimum_stock
      const largeStockResponse = await request.post(`${API_BASE}/part/`, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          name: 'Large Stock Part',
          minimum_stock: 1000000,
          category: categoryId
        }
      });

      expect(largeStockResponse.status()).toBe(201);
      const largeStockData = await largeStockResponse.json();
      createdPartIds.push(largeStockData.pk);
      expect(largeStockData.minimum_stock).toBe(1000000);
    });
  });

  test.describe('Data-Driven Tests', () => {
    const testCases = [
      {
        name: 'Basic part creation',
        data: { name: 'Data Driven Part 1', category: null },
        expectedStatus: 201
      },
      {
        name: 'Part with IPN',
        data: { name: 'Data Driven Part 2', IPN: 'DD-002', category: null },
        expectedStatus: 201
      },
      {
        name: 'Part with invalid IPN length',
        data: { name: 'Data Driven Part 3', IPN: 'a'.repeat(101), category: null },
        expectedStatus: 400
      },
      {
        name: 'Part without required name',
        data: { category: null },
        expectedStatus: 400
      }
    ];

    for (const testCase of testCases) {
      test(`Data-driven: ${testCase.name}`, async () => {
        const categoryId = await createTestCategory(request, token, { name: `DD Category ${Date.now()}` });
        createdCategoryIds.push(categoryId);

        const data = { ...testCase.data, category: categoryId };

        const response = await request.post(`${API_BASE}/part/`, {
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
          },
          data: data
        });

        expect(response.status()).toBe(testCase.expectedStatus);

        if (testCase.expectedStatus === 201) {
          const responseData = await response.json();
          createdPartIds.push(responseData.pk);
          expect(responseData.name).toBe(data.name);
        }
      });
    }
  });
});
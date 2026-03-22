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
  retries: process.env.CI ? 2 : 0,
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
    trace: 'on-first-retry',
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

import { test } from '@playwright/test';
import { PartDocsPage } from './pageObjects/partDocsPage';

test.use({ headless: false });

test.describe('InvenTree part docs', () => {
  test('should navigate, validate Part Creation, and submit Add Part', async ({ page }) => {
    const partDocsPage = new PartDocsPage(page);

    await partDocsPage.goto();
    await partDocsPage.clickCreatingParts();
    await partDocsPage.expectPartCreationTextVisible();
    await partDocsPage.clickAddPart();
    await partDocsPage.clickSubmit();
  });
});

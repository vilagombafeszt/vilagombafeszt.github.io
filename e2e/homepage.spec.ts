import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ViláGomba/);
  });

  test('navigation menu is visible', async ({ page }) => {
    await page.goto('/');
    // The nav menu should be rendered on the page
    await expect(page.locator('nav, header, [role="navigation"]').first()).toBeVisible();
  });
});

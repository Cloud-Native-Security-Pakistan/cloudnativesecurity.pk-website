// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('CNSPK Website E2E Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/CNSPK|Cloud Native Security Pakistan/);
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const navLinks = ['about.html', 'join.html', 'projects.html', 'members.html', 'events.html'];
    
    for (const link of navLinks) {
      await page.click(`a[href="${link}"]`);
      await expect(page).toHaveURL(new RegExp(link));
    }
  });

  test('all required pages exist', async ({ page }) => {
    const pages = ['index.html', 'about.html', 'join.html', 'projects.html', 'members.html', 'events.html'];
    
    for (const pagePath of pages) {
      const response = await page.goto(pagePath);
      expect(response?.status()).toBe(200);
    }
  });

  test('members page loads map', async ({ page }) => {
    await page.goto('/members.html');
    
    // Wait for map container
    const mapContainer = page.locator('#member-map');
    await expect(mapContainer).toBeVisible({ timeout: 10000 });
  });

  test('events page displays events', async ({ page }) => {
    await page.goto('/events.html');
    
    // Check for events container
    const eventsContainer = page.locator('#events-container, .events-list, [data-testid="events"]');
    await expect(eventsContainer.first()).toBeVisible({ timeout: 5000 });
  });
});


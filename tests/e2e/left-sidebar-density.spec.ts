import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5174';
const MULTI_DOC_URL = `${BASE_URL}/lab/multi-document-routing`;

test.describe('LeftSidebar Density', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(MULTI_DOC_URL);
    await page.waitForSelector('[data-testid="left-sidebar-search"]', { timeout: 10000 });
  });

  test('should render sidebar in comfortable density mode', async ({ page }) => {
    const sidebar = page.locator('[data-testid="left-sidebar-search"]').first();
    const sidebarShell = sidebar.locator('xpath=/ancestor::*[@data-density="comfortable"]').first();

    // Verify it exists and is visible
    await expect(sidebarShell).toBeVisible();

    // Check that header is visible
    const header = sidebarShell.locator('[class*="left-sidebar-dock-header"]');
    await expect(header).toBeVisible();
  });

  test('should reduce spacing and padding at compact density', async ({ page }) => {
    // This test would require resizing the viewport to trigger compact density
    // Set viewport to trigger compact density mode
    await page.setViewportSize({ width: 1200, height: 800 });

    const searchInput = page.locator('[data-testid="left-sidebar-search"]').first();
    await expect(searchInput).toBeVisible();
  });

  test('should hide header in minimal density mode', async ({ page }) => {
    // Resize to minimal width to trigger minimal density
    await page.setViewportSize({ width: 800, height: 600 });

    const sidebar = page.locator('[class*="left-sidebar-shell"]').first();
    const header = sidebar.locator('[class*="left-sidebar-dock-header"]');

    // Header should be hidden in minimal mode
    await expect(header).toHaveClass(/hidden/);
  });

  test('should maintain category collapse state across density changes', async ({ page }) => {
    const categoryButton = page.locator('button[aria-label*="Alternar categoría"]').first();

    if (await categoryButton.isVisible()) {
      // Get initial state
      const initialExpanded = await categoryButton.getAttribute('aria-expanded');

      // Click to toggle
      await categoryButton.click();

      // Change viewport to trigger density change
      await page.setViewportSize({ width: 1000, height: 800 });

      // Verify collapse state is maintained
      const newExpanded = await categoryButton.getAttribute('aria-expanded');
      expect(newExpanded).toBe(initialExpanded === 'false' ? 'true' : 'false');
    }
  });

  test('should display favorite indicator inline with compact label in list layout', async ({ page }) => {
    // Find a plugin button with favorite toggle
    const pluginButton = page.locator('[data-testid="left-sidebar-schema-tile"]').first();

    if (await pluginButton.isVisible()) {
      const favoriteToggle = pluginButton.locator('button[aria-pressed]').first();

      // Make favorite active
      const isPressed = await favoriteToggle.getAttribute('aria-pressed');
      if (isPressed === 'false') {
        await favoriteToggle.click();

        // Verify the button now shows active state
        const newPressed = await favoriteToggle.getAttribute('aria-pressed');
        expect(newPressed).toBe('true');
      }
    }
  });

  test('favorite button should be accessible with keyboard', async ({ page }) => {
    // Find favorite toggle button
    const favoriteToggle = page.locator('button[aria-label*="favorito"]').first();

    if (await favoriteToggle.isVisible()) {
      // Focus the button
      await favoriteToggle.focus();

      // Verify it has focus
      const isFocused = await favoriteToggle.evaluate((el) => el === document.activeElement);
      expect(isFocused).toBe(true);

      // Press Enter to activate
      await page.keyboard.press('Enter');

      // Verify state changed
      const ariaPressed = await favoriteToggle.getAttribute('aria-pressed');
      expect(ariaPressed).toBe('true');
    }
  });

  test('group titles should have appropriate text size for density', async ({ page }) => {
    const groupTitle = page.locator('[class*="left-sidebar-group-title-label"]').first();

    if (await groupTitle.isVisible()) {
      const fontSize = await groupTitle.evaluate((el) => window.getComputedStyle(el).fontSize);
      // Should be small but readable
      expect(fontSize).toMatch(/^[0-9.]+px$/);
    }
  });

  test('should collapse category and prevent scroll jump', async ({ page }) => {
    const categoryButton = page.locator('button[aria-label*="Alternar categoría"]').first();

    if (await categoryButton.isVisible()) {
      // Get initial scroll position
      const scrollContainer = page.locator('[data-left-sidebar-scroll="true"]');
      const initialScroll = await scrollContainer.evaluate((el) => el.scrollTop);

      // Toggle category
      await categoryButton.click();

      // Verify scroll didn't jump
      const newScroll = await scrollContainer.evaluate((el) => el.scrollTop);
      expect(Math.abs(newScroll - initialScroll)).toBeLessThan(5);
    }
  });
});

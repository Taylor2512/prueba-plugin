import { expect, test } from '@playwright/test';

test.describe('lab landing design enhancements', () => {
  test('renders schema coverage metrics and per-card schema coverage chips', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Schemas full')).toBeVisible();

    const coverageChips = page.locator('.sisad-pdfme-lab-card-topline .sisad-pdfme-lab-chip', {
      hasText: /Schemas\s+\d+\/\d+/i,
    });
    const chipsCount = await coverageChips.count();
    expect(chipsCount).toBeGreaterThanOrEqual(5);

    await expect(page.locator('.sisad-pdfme-lab-card[data-schema-coverage="full"]').first()).toBeVisible();
  });

  test('landing remains horizontally stable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Suite de laboratorio/i })).toBeVisible();

    const overflow = await page.evaluate(() => {
      const root = document.documentElement;
      return root.scrollWidth - root.clientWidth;
    });

    expect(overflow).toBeLessThanOrEqual(16);
  });
});

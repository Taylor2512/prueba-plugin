import { expect, test } from '@playwright/test';

test.describe('right sidebar docs tab', () => {
  test('opens the docs tab by default on the multi-document routing lab', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const docsTab = page.locator('#sisad-pdfme-right-sidebar-tab-docs').first();
    await expect(docsTab).toBeVisible();
    await expect(docsTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('aside[data-panel-mode="docs"]').first()).toBeVisible();
    await expect(page.getByText('Documentos cargados').first()).toBeVisible();
  });
});

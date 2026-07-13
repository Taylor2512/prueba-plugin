import { expect, test } from '@playwright/test';

const UX_MODE_STORAGE_KEY = 'sisad-pdfme.lab.ux-mode';

test.describe('results panel placement', () => {
  test('renders the drawer below the workspace in canvas-first mode', async ({ page }) => {
    await page.addInitScript(
      ({ storageKey }) => {
        globalThis.localStorage?.setItem(storageKey, 'canvas-first');
      },
      { storageKey: UX_MODE_STORAGE_KEY },
    );

    await page.goto('/lab/multi-document-routing');

    const workspace = page.locator('.sisad-pdfme-lab-workspace').first();
    const resultsDrawer = page.locator('.sisad-pdfme-lab-results-drawer').first();
    const toggle = page.getByRole('button', { name: /Resultados/i }).first();

    await expect(workspace).toBeVisible();
    await expect(resultsDrawer).toBeVisible();
    await expect(resultsDrawer).toHaveCSS('position', 'relative');

    const workspaceBox = await workspace.boundingBox();
    const resultsBox = await resultsDrawer.boundingBox();
    expect(workspaceBox).not.toBeNull();
    expect(resultsBox).not.toBeNull();
    expect((resultsBox?.y || 0)).toBeGreaterThan((workspaceBox?.y || 0) + (workspaceBox?.height || 0) - 1);

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.click();
    await expect(page.getByRole('dialog', { name: /Panel de resultados/i })).toBeVisible();
  });
});

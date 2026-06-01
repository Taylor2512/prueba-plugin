import { test, expect } from '@playwright/test';

test.describe('canvas visual toggles', () => {
  test('guides and padding toggles remain synchronized with canvas data attributes', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const canvas = page.locator('.sisad-pdfme-designer-canvas').first();
    await expect(canvas).toBeVisible();

    const moreActions = page.locator('.sisad-pdfme-ui-control-bar [title="Más acciones"]').first();
    await expect(moreActions).toBeVisible();

    await moreActions.click();
    const guidesMenuItem = page.getByRole('menuitem', { name: /Ocultar guías|Mostrar guías/i }).first();
    const beforeGuides = await canvas.getAttribute('data-guides-visible');
    await guidesMenuItem.click();
    if (beforeGuides === 'true') {
      await expect(canvas).toHaveAttribute('data-guides-visible', 'false');
    } else {
      await expect(canvas).toHaveAttribute('data-guides-visible', 'true');
    }

    await moreActions.click();
    const paddingMenuItem = page.getByRole('menuitem', { name: /Ocultar padding|Mostrar padding/i }).first();
    const beforePadding = await canvas.getAttribute('data-padding-visible');
    await paddingMenuItem.click();
    if (beforePadding === 'true') {
      await expect(canvas).toHaveAttribute('data-padding-visible', 'false');
    } else {
      await expect(canvas).toHaveAttribute('data-padding-visible', 'true');
    }
  });
});

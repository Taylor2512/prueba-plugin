import { test, expect } from '@playwright/test';
import { openDesigner, openPanel, rightSidebar, schemaOnCanvas } from '../fixtures/designer.fixture';

test.describe('Baseline visual generado', () => {
  test('shell canvas-first 1440x900', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openDesigner(page);
    await expect(page).toHaveScreenshot('designer-shell-1440x900.png', { animations: 'disabled', fullPage: true });
  });

  test('RightSidebar Fields', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openDesigner(page);
    await openPanel(page, /Campos/i);
    await expect(rightSidebar(page)).toHaveScreenshot('right-sidebar-fields.png', { animations: 'disabled' });
  });

  test('RightSidebar Detail attachment', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openDesigner(page);
    const attachment = page.locator('[data-schema-type="attachment"]').first();
    test.skip(!(await attachment.count()), 'Attachment no disponible');
    await attachment.click();
    await openPanel(page, /Detalle/i);
    await expect(rightSidebar(page)).toHaveScreenshot('right-sidebar-detail-attachment.png', { animations: 'disabled' });
  });

  test('RightSidebar Docs', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openDesigner(page);
    await openPanel(page, /Docs/i);
    await expect(rightSidebar(page)).toHaveScreenshot('right-sidebar-docs.png', { animations: 'disabled' });
  });
});

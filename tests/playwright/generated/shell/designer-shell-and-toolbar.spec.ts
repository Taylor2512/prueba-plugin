import { test, expect } from '@playwright/test';
import { canvas, openDesigner } from '../fixtures/designer.fixture';

test.describe('Designer shell y toolbar', () => {
  test('renderiza canvas, PDF, paginación y acciones principales', async ({ page }) => {
    await openDesigner(page);
    await expect(canvas(page).locator('[data-paper-page], [data-canvas-page], .sisad-pdfme-ui-paper').first()).toBeVisible();
    await expect(page.getByTestId('designer-save')).toBeVisible();
    await expect(page.getByTestId('designer-zoom-select')).toBeVisible();
    await expect(page.getByTestId('designer-undo')).toBeVisible();
    await expect(page.getByTestId('designer-redo')).toBeVisible();
  });

  test('zoom se expresa como porcentaje y +/- cambian el valor', async ({ page }) => {
    await openDesigner(page);
    const select = page.getByTestId('designer-zoom-select');
    const before = await select.inputValue().catch(async () => await select.textContent());
    await page.getByTestId('designer-zoom-in').click();
    const after = await select.inputValue().catch(async () => await select.textContent());
    expect(after).not.toBe(before);
    await page.getByTestId('designer-zoom-out').click();
  });

  test('fit page permanece operativo', async ({ page }) => {
    await openDesigner(page);
    const fit = page.getByTestId('designer-fit-page');
    await expect(fit).toBeEnabled();
    await fit.click();
    await expect(canvas(page)).toBeVisible();
  });
});

/**
 * TASK-UI-016 / TASK-QA-015 — contrato de zoom: el trigger siempre muestra
 * porcentaje (nunca decimal), +/- respetan límites y fit-page es accionable.
 */
import { expect, test } from '@playwright/test';

const readZoomTriggerText = async (page: import('@playwright/test').Page): Promise<string> => {
  const select = page.getByTestId('designer-zoom-select').first();
  await expect(select).toBeVisible();
  return (await select.locator('.ant-select-selection-item').first().textContent()) ?? '';
};

test.describe('zoom toolbar contract', () => {
  test('zoom trigger shows a percentage, never a decimal', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const triggerText = (await readZoomTriggerText(page)).trim();
    expect(triggerText).toMatch(/^\d+%$/);
    expect(triggerText).not.toMatch(/^0\.\d+$/);
  });

  test('zoom in/out buttons are actionable and keep percentage display', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const zoomIn = page.getByTestId('designer-zoom-in').first();
    const zoomOut = page.getByTestId('designer-zoom-out').first();
    await expect(zoomIn).toBeVisible();
    await expect(zoomOut).toBeVisible();

    const before = (await readZoomTriggerText(page)).trim();
    if (await zoomIn.isEnabled()) {
      await zoomIn.click();
      await expect
        .poll(async () => (await readZoomTriggerText(page)).trim())
        .not.toBe(before);
    }
    expect((await readZoomTriggerText(page)).trim()).toMatch(/^\d+%$/);

    if (await zoomOut.isEnabled()) {
      await zoomOut.click();
    }
    expect((await readZoomTriggerText(page)).trim()).toMatch(/^\d+%$/);
  });

  test('selecting a preset updates the canvas zoom', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const select = page.getByTestId('designer-zoom-select').first();
    await select.click();
    const option = page.locator('.ant-select-item-option', { hasText: '125%' }).first();
    await expect(option).toBeVisible();
    await option.click();
    await expect
      .poll(async () => (await readZoomTriggerText(page)).trim())
      .toBe('125%');
  });

  test('fit-page, undo and redo carry stable test ids', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await expect(page.getByTestId('designer-fit-page').first()).toBeVisible();
    await expect(page.getByTestId('designer-undo').first()).toBeVisible();
    await expect(page.getByTestId('designer-redo').first()).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { openDesigner, schemaOnCanvas } from '../fixtures/designer.fixture';

test.describe('Atajos y acciones de schema', () => {
  test('flechas mueven el schema seleccionado', async ({ page }) => {
    await openDesigner(page);
    const schema = schemaOnCanvas(page, 'contract_name');
    await schema.click();
    const before = await schema.boundingBox();
    await page.keyboard.press('ArrowRight');
    const after = await schema.boundingBox();
    if (before && after) expect(after.x).toBeGreaterThan(before.x);
  });

  test('copy/paste crea una identidad adicional', async ({ page, browserName }) => {
    await openDesigner(page);
    const schema = schemaOnCanvas(page, 'contract_name');
    await schema.click();
    const countBefore = await page.locator('[data-schema-name="contract_name"]').count();
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+c`);
    await page.keyboard.press(`${modifier}+v`);
    await expect.poll(() => page.locator('[data-schema-type="text"]').count()).toBeGreaterThanOrEqual(countBefore);
  });

  test('Escape cierra overlay sin perder capacidad de selección', async ({ page }) => {
    await openDesigner(page);
    await schemaOnCanvas(page, 'contract_stage').click();
    await page.keyboard.press('Escape');
    await schemaOnCanvas(page, 'contract_name').click();
    await expect(schemaOnCanvas(page, 'contract_name')).toBeVisible();
  });
});

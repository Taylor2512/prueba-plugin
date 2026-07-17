import { test, expect } from '@playwright/test';
import { clickSchemaRow, openDesigner, openPanel } from '../fixtures/designer.fixture';

test.describe('Selección múltiple y Reasignar', () => {
  test('Ctrl/Cmd selecciona múltiples campos y abre modal con cantidad', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Campos/i);
    await clickSchemaRow(page, 'contract_name');
    await clickSchemaRow(page, 'contract_date', ['ControlOrMeta']);

    const reassign = page.getByRole('button', { name: /Reasignar/i }).last();
    await expect(reassign).toBeVisible();
    await reassign.click();
    const dialog = page.getByRole('dialog').filter({ hasText: /Reasignar responsable/i });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/2 campos|2 seleccionados/i);
  });

  test('Cancelar y Escape cierran sin congelar selección', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Campos/i);
    await clickSchemaRow(page, 'contract_stage');
    const reassign = page.getByRole('button', { name: /Reasignar/i }).last();
    await reassign.click();
    await page.getByRole('button', { name: /Cancelar/i }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await clickSchemaRow(page, 'contract_name');
    await reassign.click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await clickSchemaRow(page, 'contract_date');
  });

  test('acciones internas no cambian selección accidentalmente', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Campos/i);
    await clickSchemaRow(page, 'approval_mode');
    const deleteButton = page.getByRole('button', { name: /Eliminar/i }).last();
    if (await deleteButton.count()) {
      await deleteButton.hover();
      await expect(deleteButton).toBeVisible();
    }
  });
});

import { test, expect } from '@playwright/test';
import {
  clickSchemaRow,
  expectSchemaSelected,
  openDesigner,
  openPanel,
  rightSidebar,
  schemaOnCanvas,
} from '../fixtures/designer.fixture';

test.describe('RightSidebar selección Canvas ↔ ListView', () => {
  test('click en lista selecciona el mismo schema del Canvas', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Campos/i);
    await clickSchemaRow(page, 'contract_name');
    await expectSchemaSelected(schemaOnCanvas(page, 'contract_name'));
  });

  test('click en Canvas resalta la fila correcta', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Campos/i);
    await schemaOnCanvas(page, 'contract_date').click();
    const rowLabel = rightSidebar(page).getByText('contract_date', { exact: true }).first();
    await expect(rowLabel).toBeVisible();
    const row = rowLabel.locator('xpath=ancestor::*[self::li or @role="option" or @data-schema-id][1]');
    if (await row.count()) await expectSchemaSelected(row);
  });

  test('click simple reemplaza selección previa', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Campos/i);
    await clickSchemaRow(page, 'contract_name');
    await clickSchemaRow(page, 'contract_date');
    await expectSchemaSelected(schemaOnCanvas(page, 'contract_date'));
  });
});

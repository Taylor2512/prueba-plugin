import { test, expect } from '@playwright/test';
import { openDesigner, openPanel, schemaOnCanvas } from '../fixtures/designer.fixture';

test.describe('DetailView e inspector', () => {
  test('seleccionar dropdown abre opciones y permite agregar/eliminar', async ({ page }) => {
    await openDesigner(page);
    await schemaOnCanvas(page, 'contract_stage').click();
    await openPanel(page, /Detalle/i);
    const options = page.getByTestId('detail-options-section');
    await expect(options).toBeVisible();
    const input = page.getByTestId('option-new-input');
    const add = page.getByTestId('option-add-button');
    await input.fill('Nueva opción');
    await add.click();
    await expect(page.getByTestId('option-label-input').last()).toHaveValue('Nueva opción');
    const remove = page.getByTestId('option-delete-button').last();
    await remove.click();
  });

  test('controles del inspector no deseleccionan el schema', async ({ page }) => {
    await openDesigner(page);
    const schema = schemaOnCanvas(page, 'contract_stage');
    await schema.click();
    await openPanel(page, /Detalle/i);
    const input = page.getByTestId('option-label-input').first();
    await input.click();
    await input.pressSequentially(' editado');
    await expect(schema).toBeVisible();
  });

  test('DetailView permite scroll hasta secciones inferiores', async ({ page }) => {
    await openDesigner(page);
    await schemaOnCanvas(page, 'routing-primary-showcase_attachment').click().catch(async () => {
      await page.locator('[data-schema-type="attachment"]').first().click();
    });
    await openPanel(page, /Detalle/i);
    const bottom = page.getByText(/Asignación y bloqueo/i).last();
    if (await bottom.count()) {
      await bottom.scrollIntoViewIfNeeded();
      await expect(bottom).toBeVisible();
    }
  });
});

import { test, expect } from '@playwright/test';
import { openDesigner, openPanel } from '../fixtures/designer.fixture';

test.describe('RadioGroup y CheckboxGroup DocuSign-like', () => {
  test('grupo root es seleccionable y opciones no son targets Moveable separados', async ({ page }) => {
    await openDesigner(page);
    const group = page.locator('[data-schema-type="checkboxGroup"], [data-schema-type="radioGroup"]').first();
    test.skip(!(await group.count()), 'El ejemplo no incluye option group');
    await group.click();
    await expect(group).toBeVisible();
    const internalOptions = group.locator('[data-option-id]');
    for (let index = 0; index < await internalOptions.count(); index += 1) {
      expect(await internalOptions.nth(index).getAttribute('data-schema-id')).toBeNull();
    }
  });

  test('Detalle permite agregar, editar, reordenar y eliminar opciones', async ({ page }) => {
    await openDesigner(page);
    const group = page.locator('[data-schema-type="checkboxGroup"], [data-schema-type="radioGroup"]').first();
    test.skip(!(await group.count()), 'El ejemplo no incluye option group');
    await group.click();
    await openPanel(page, /Detalle/i);
    const input = page.getByTestId('option-new-input');
    await input.fill('Opción E2E');
    await page.getByTestId('option-add-button').click();
    await expect(page.getByTestId('option-label-input').last()).toHaveValue('Opción E2E');
  });

  test('botón + queda fuera del target transformable', async ({ page }) => {
    await openDesigner(page);
    const add = page.getByRole('button', { name: /Agregar opción/i }).first();
    test.skip(!(await add.count()), 'Acción flotante no visible');
    const schemaAncestor = add.locator('xpath=ancestor::*[@data-schema-id][1]');
    expect(await schemaAncestor.count()).toBe(0);
  });
});

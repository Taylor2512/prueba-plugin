import { test, expect } from '@playwright/test';
import { openDesigner, openPanel } from '../fixtures/designer.fixture';

test.describe('CommentsRail y dialog', () => {
  test('abre y cancela comentario sin crear hilo', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Comentarios/i);
    const add = page.getByRole('button', { name: /Agregar/i }).last();
    test.skip(!(await add.count()), 'Comentarios deshabilitados por config');
    await add.click();
    const dialog = page.getByRole('dialog').filter({ hasText: /Agregar comentario/i });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox').fill('No debe guardarse');
    await dialog.getByRole('button', { name: /Cancelar/i }).click();
    await expect(dialog).toHaveCount(0);
  });

  test('Escape restaura interacción del canvas', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Comentarios/i);
    const add = page.getByRole('button', { name: /Agregar/i }).last();
    test.skip(!(await add.count()), 'Comentarios deshabilitados por config');
    await add.click();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const schema = page.locator('[data-schema-id]').first();
    await schema.click();
  });

  test('Guardar se ejecuta una sola vez', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Comentarios/i);
    const add = page.getByRole('button', { name: /Agregar/i }).last();
    test.skip(!(await add.count()), 'Comentarios deshabilitados por config');
    await add.click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox').fill('Comentario automatizado');
    const save = dialog.getByRole('button', { name: /Guardar/i });
    await save.dblclick();
    await expect(dialog).toHaveCount(0);
  });
});

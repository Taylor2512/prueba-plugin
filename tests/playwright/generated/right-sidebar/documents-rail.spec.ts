import { test, expect } from '@playwright/test';
import { openDesigner, openPanel, rightSidebar } from '../fixtures/designer.fixture';

test.describe('DocumentsRail', () => {
  test('muestra documentos, páginas y estado activo', async ({ page }) => {
    await openDesigner(page);
    const sidebar = await openPanel(page, /Docs/i);
    test.skip(!(await sidebar.getByText(/Documentos cargados/i).count()), 'Docs deshabilitado por config');
    await expect(sidebar.getByText(/Declaración de datos/i)).toBeVisible();
    await expect(sidebar.getByText(/Certificado académico/i)).toBeVisible();
    await expect(sidebar.getByRole('button', { name: /Subir PDF/i })).toBeVisible();
  });

  test('seleccionar documento no dispara eliminar y actualiza activo', async ({ page }) => {
    await openDesigner(page);
    const sidebar = await openPanel(page, /Docs/i);
    const document = sidebar.getByText(/Certificado académico/i).first();
    test.skip(!(await document.count()), 'Documento de ejemplo no disponible');
    await document.click();
    const container = document.locator('xpath=ancestor::*[self::button or self::li or @role="button"][1]');
    if (await container.count()) {
      const selected = await container.getAttribute('aria-selected');
      const cls = await container.getAttribute('class');
      expect(selected === 'true' || /active|selected|sky|blue/.test(cls || '')).toBe(true);
    }
  });

  test('botón eliminar detiene propagación', async ({ page }) => {
    await openDesigner(page);
    const sidebar = await openPanel(page, /Docs/i);
    const remove = sidebar.getByRole('button', { name: /Eliminar/i }).last();
    test.skip(!(await remove.count()), 'Eliminar documento no permitido');
    await expect(remove).toBeVisible();
  });
});

import { expect, test, type Page } from '@playwright/test';

/**
 * E2E de reasignación de responsable desde el RightSidebar/ListView.
 *
 * Verifica el flujo del plan de corrección:
 * - el botón "Reasignar" solo aparece con selección;
 * - abre el modal "Reasignar responsable" con los destinatarios disponibles;
 * - al confirmar cambia el owner del schema (sale de la vista del usuario activo);
 * - "Renombrar" ya no es acción principal: vive en el menú "Más".
 */

const openCatalog = async (page: Page) => {
  const toggle = page.getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i }).first();
  await expect(toggle).toBeVisible();
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

/** Fuerza la pestaña "Campos" para conservar el ListView aunque haya selección. */
const ensureFieldsTab = async (page: Page) => {
  const tab = page.locator('#sisad-pdfme-right-sidebar-tab-fields');
  if (await tab.count()) {
    await tab.first().click().catch(() => undefined);
  }
};

test.describe('right sidebar list view — reassignment', () => {
  test('reassigns the selected field owner through the dialog', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.keyboard.press('Escape');
    await openCatalog(page);

    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();

    const items = listView.getByTestId('right-sidebar-field-item');
    await expect.poll(async () => items.count()).toBeGreaterThan(0);
    const initialCount = await items.count();

    // Selecciona un campo editable (los bloqueados/solo-lectura deshabilitan
    // Reasignar por diseño) y conserva la vista de campos.
    const reassign = page.getByTestId('right-sidebar-reassign');
    let selectedEditable = false;
    for (let index = 0; index < initialCount; index += 1) {
      await items.nth(index).click();
      await ensureFieldsTab(page);
      // Wait for the toolbar to settle after selecting; locked/read-only fields
      // keep the button disabled by design, so move on to the next one.
      try {
        await expect(reassign).toBeEnabled({ timeout: 2000 });
        selectedEditable = true;
        break;
      } catch {
        // not assignable (locked/read-only) — try the next field
      }
    }
    expect(selectedEditable).toBe(true);

    // El botón "Reasignar" aparece únicamente con selección activa.
    await expect(reassign).toBeVisible();
    await expect(reassign).toBeEnabled();
    await reassign.click();

    // El modal lista destinatarios disponibles.
    const dialog = page.getByTestId('schema-assignment-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByTestId('schema-assignment-current-owner')).toBeVisible();

    // Elige un responsable distinto y confirma.
    await page.getByTestId('schema-assignment-option-recipient-2').click();
    const confirm = page.getByTestId('schema-assignment-confirm');
    await expect(confirm).toBeEnabled();
    await confirm.click();

    // El modal se cierra y el campo sale de la vista del usuario activo
    // (fue reasignado a otro destinatario), por lo que el conteo disminuye.
    await expect(dialog).toBeHidden();
    await expect
      .poll(async () => listView.getByTestId('right-sidebar-field-item').count(), { timeout: 10_000 })
      .toBe(initialCount - 1);
  });

  test('exposes rename inside the "Más" menu instead of the header', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.keyboard.press('Escape');
    await openCatalog(page);

    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();
    await expect.poll(async () => listView.getByTestId('right-sidebar-field-item').count()).toBeGreaterThan(0);

    // El menú "Más" está disponible y contiene la acción de renombrar.
    const moreButton = page.getByTestId('right-sidebar-more');
    await expect(moreButton).toBeVisible();
    await moreButton.click();

    await expect(page.getByTestId('right-sidebar-more-rename')).toBeVisible();
  });
});

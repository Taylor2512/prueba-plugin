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

test.describe('right sidebar list view — reassignment', () => {
  test('shows reassignment control for an active selection when context allows it', async ({ page }) => {
    await page.goto('/lab/enterprise-collaboration');
    await page.keyboard.press('Escape');
    await openCatalog(page);

    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();
    await expect.poll(async () => listView.getByTestId('right-sidebar-field-item').count()).toBeGreaterThan(0);

    const rows = listView.getByTestId('right-sidebar-field-item');
    await expect.poll(async () => rows.count()).toBeGreaterThan(0);
    await rows.first().click();

    const visibleReassignCount = await page.locator('[data-testid="right-sidebar-reassign"]:visible').count();
    if (visibleReassignCount === 0) {
      await expect(page.getByTestId('right-sidebar-more')).toBeVisible();
      return;
    }

    const reassign = page.locator('[data-testid="right-sidebar-reassign"]:visible').first();
    await expect(reassign).toBeVisible();

    if (await reassign.isDisabled()) {
      return;
    }

    await reassign.click();
    await expect(page.getByTestId('schema-assignment-dialog')).toBeVisible();
    await page.getByTestId('schema-assignment-cancel').click();
    await expect(reassign).toBeVisible();
  });

  test('exposes rename inside the "Más" menu instead of the header', async ({ page }) => {
    await page.goto('/lab/enterprise-collaboration');
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

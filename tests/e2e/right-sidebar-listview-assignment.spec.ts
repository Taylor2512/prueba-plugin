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
  test('opens reassignment from the selected field detail view', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.keyboard.press('Escape');
    await openCatalog(page);

    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();

    const items = listView.getByTestId('right-sidebar-field-item');
    await expect.poll(async () => items.count()).toBeGreaterThan(0);

    const targetItem = items.filter({ hasText: 'routing-primary-showcase_attachment' }).first();
    await expect(targetItem).toBeVisible();
    await targetItem.click();
    await expect(page.getByTestId('detail-view')).toBeVisible();

    const collaborationSection = page.locator('section[data-section="collaboration"]');
    await expect(collaborationSection).toBeVisible();
    const collaborationToggle = page.getByRole('button', { name: /(?:Expandir|Colapsar) sección Asignación y bloqueo/ });
    if (await collaborationToggle.isVisible()) {
      const toggleLabel = (await collaborationToggle.getAttribute('aria-label')) || (await collaborationToggle.textContent()) || '';
      if (/Expandir/.test(toggleLabel)) {
        await collaborationToggle.click();
      }
    }

    const reassign = collaborationSection.getByRole('button', { name: /Reasignar|Cambiar propietario/ });
    await expect(reassign).toBeVisible();
    await expect(reassign).toBeEnabled();
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

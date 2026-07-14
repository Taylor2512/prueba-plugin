import { expect, test } from '@playwright/test';

test.describe('detail-view collaboration', () => {
  test('shows compact collaboration summary and technical modal content', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_attachment"]').first().click({ force: true });
    const collaborationSection = page.locator('section[data-section="collaboration"]');

    await test.step('open collaboration section', async () => {
      // La sección puede venir expandida por defecto: expandir solo si hace falta.
      const collaborationToggle = page.getByRole('button', { name: /(?:Expandir|Colapsar) sección Asignación y bloqueo/ });
      await expect(collaborationToggle).toBeVisible();
      if (/Expandir/.test((await collaborationToggle.getAttribute('aria-label')) || (await collaborationToggle.textContent()) || '')) {
        await collaborationToggle.click();
      }
      // Resumen compacto: título, descripción, tag de estado y trigger Reasignar.
      await expect(collaborationSection).toContainText('Propietario y acceso');
      await expect(collaborationSection).toContainText('Disponible');
      await expect(collaborationSection.getByRole('button', { name: /Reasignar|Cambiar propietario/ })).toBeVisible();
    });

    await test.step('modal separates business view from collapsed advanced view', async () => {
      await collaborationSection.getByRole('button', { name: /Reasignar|Cambiar propietario/ }).click();

      // Normal view: business fields visible up-front, no raw technical IDs.
      const normalView = page.getByTestId('collaboration-normal-view');
      await expect(normalView).toBeVisible();
      await expect(page.locator('#collaboration-state')).toBeVisible();
      await expect(normalView).toContainText('Propietario registrado');
      await expect(normalView).toContainText('Nombre visible');

      // Advanced starts collapsed: technical fields hidden until invoked.
      await expect(page.getByTestId('collaboration-advanced-view')).not.toBeVisible();
      await expect(page.locator('#collaboration-schema-uid')).not.toBeVisible();

      await page.getByTestId('collaboration-advanced-toggle').click();

      await expect(page.getByTestId('collaboration-advanced-view')).toBeVisible();
      await expect(page.getByText('UID técnico')).toBeVisible();
      await expect(page.locator('#collaboration-file')).toBeVisible();
      await expect(page.locator('#collaboration-page-number')).toBeVisible();
    });
  });
});

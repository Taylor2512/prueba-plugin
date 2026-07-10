import { expect, test } from '@playwright/test';

test.describe('detail-view collaboration', () => {
  test('shows compact collaboration summary and technical modal content', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_attachment"]').first().click({ force: true });
    const collaborationSection = page.locator('section[data-section="collaboration"]');

    await test.step('open collaboration section', async () => {
      await page.getByRole('button', { name: 'Expandir sección Asignación y bloqueo' }).click();
      await expect(collaborationSection).toContainText('Propietario y acceso.');
      await expect(collaborationSection).toContainText('Estado');
      await expect(collaborationSection).toContainText('Disponible');
      await expect(collaborationSection).toContainText('Asignado a');
      await expect(collaborationSection).toContainText('Cliente Principal');
      await expect(collaborationSection.getByRole('button', { name: 'Gestionar' })).toBeVisible();
    });

    await test.step('open technical modal section', async () => {
      await collaborationSection.getByRole('button', { name: 'Gestionar' }).click();
      await page.getByText('Información técnica').click();

      await expect(page.locator('#collaboration-state')).toBeVisible();
      await expect(page.getByText('UID técnico')).toBeVisible();
      await expect(page.locator('#collaboration-file')).toBeVisible();
      await expect(page.locator('#collaboration-page-number')).toBeVisible();
    });
  });
});

import { expect, test } from '@playwright/test';

test.describe('detail-view collaboration', () => {
  test('expanding collaboration section exposes owner and lock controls', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.locator('button[aria-label="contract_name"]').click();

    await page.getByRole('button', { name: 'Expandir sección Asignación y bloqueo' }).click();

    await expect(page.getByText('Propietario y acceso.')).toBeVisible();
    await expect(page.getByText('Estado')).toBeVisible();
    await expect(page.getByText('Bloqueado para edición')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Gestionar' })).toBeVisible();
  });
});

import { expect, test } from '@playwright/test';

const openControls = async (page: import('@playwright/test').Page) => {
  const controls = page.getByRole('button', { name: 'Controles' }).first();
  await expect(controls).toBeVisible();
  await controls.evaluate((node) => {
    (node as HTMLButtonElement).click();
  });
};

test.describe('form viewer generator parity', () => {
  test('switches between designer, form and viewer runtimes from the lab controls', async ({ page }) => {
    test.setTimeout(180000);
    await page.goto('/lab/multi-document-routing');
    await openControls(page);

    await expect(page.getByRole('button', { name: 'Formulario' })).toBeVisible();
    await page.getByRole('button', { name: 'Formulario' }).evaluate((node) => {
      (node as HTMLButtonElement).click();
    });
    await expect(page.locator('main.sisad-pdfme-lab-page')).toHaveAttribute('data-runtime-mode', 'form');

    await openControls(page);
    await expect(page.getByRole('button', { name: 'Visor' })).toBeVisible();
    await page.getByRole('button', { name: 'Visor' }).evaluate((node) => {
      (node as HTMLButtonElement).click();
    });
    await expect(page.locator('main.sisad-pdfme-lab-page')).toHaveAttribute('data-runtime-mode', 'viewer');

    await openControls(page);
    await expect(page.getByRole('button', { name: 'Diseñador' })).toBeVisible();
    await page.getByRole('button', { name: 'Diseñador' }).evaluate((node) => {
      (node as HTMLButtonElement).click();
    });
    await expect(page.locator('main.sisad-pdfme-lab-page')).toHaveAttribute('data-runtime-mode', 'designer');
  });
});

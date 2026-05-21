import { expect, test } from './runtime-guard.js';
import type { Page } from '@playwright/test';

const mod = process.platform === 'darwin' ? 'Meta' : 'Control';

const openMultiuserRoute = async (page: Page) => {
  await page.goto('/lab/multiuser-collaboration');
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.sisad-pdfme-lab-page')).toBeVisible();
};

const openCollaborationDisclosure = async (page: Page) => {
  const contextDetails = page.locator('.sisad-pdfme-lab-page-details');
  if ((await contextDetails.getAttribute('open')) === null) {
    await contextDetails.locator(':scope > summary').click();
  }
  const collaboration = page.locator('.sisad-pdfme-lab-collaboration-disclosure');
  if ((await collaboration.getAttribute('open')) === null) {
    await collaboration.locator(':scope > summary').click();
  }
};

const clickFirstFieldOnCanvas = async (page: Page) => {
  const paper = page.locator('[data-paper-page="true"]').first();
  await expect(paper).toBeVisible();
  const box = await paper.boundingBox();
  if (!box) throw new Error('paper not found');
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.15);
};

test.describe('keyboard shortcuts - domain suite', () => {
  test('Mod+Z restores schema count after delete', async ({ page }) => {
    await openMultiuserRoute(page);
    await openCollaborationDisclosure(page);
    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');

    const schemas = page.locator('.sisad-pdfme-designer-canvas [data-schema-uid]');
    const before = await schemas.count();
    expect(before).toBeGreaterThan(0);

    await clickFirstFieldOnCanvas(page);
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.keyboard.press('Delete');
    await expect(schemas).toHaveCount(before - 1);
    await page.keyboard.press(`${mod}+z`);
    await expect(schemas).toHaveCount(before);
  });

  test('Mod+A on canvas creates multi-selection context', async ({ page }) => {
    await openMultiuserRoute(page);
    const contextHeader = page.getByLabel('Contexto activo del editor');
    const paper = page.locator('[data-paper-page="true"]').first();
    await paper.click();

    await page.keyboard.press(`${mod}+a`);
    await expect
      .poll(async () => (await contextHeader.textContent()) ?? '')
      .toMatch(/Selección(:\s*)?[2-9]\d*|Selección múltiple/i);
  });

  test('Delete in textarea does not remove schemas', async ({ page }) => {
    await openMultiuserRoute(page);
    await openCollaborationDisclosure(page);
    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');
    const schemas = page.locator('.sisad-pdfme-designer-canvas [data-schema-uid]');
    const before = await schemas.count();
    await clickFirstFieldOnCanvas(page);

    const addCommentButton = page.getByRole('button', { name: /Agregar comentario|Añadir comentario/i }).first();
    await addCommentButton.click();
    const dialog = page.getByRole('dialog');
    const textarea = dialog.locator('textarea').first();
    await textarea.fill('nota qa');
    await page.keyboard.press('Delete');
    await expect(textarea).toHaveValue('nota qa');
    await expect(schemas).toHaveCount(before);
  });
});

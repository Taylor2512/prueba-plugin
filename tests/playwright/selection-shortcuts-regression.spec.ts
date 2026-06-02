import { expect, test } from '@playwright/test';

const shortcutMod = process.platform === 'darwin' ? 'Meta' : 'Control';

const selectSchema = async (page: import('@playwright/test').Page, name: string) => {
  const schema = page.locator(`[data-schema-name="${name}"]`).first();
  await expect(schema).toBeVisible();
  await schema.click({ force: true });
  await schema.focus();
  return schema;
};

test.describe('selection shortcuts regression', () => {
  test('duplicate, undo, redo and delete act on the current selection', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await selectSchema(page, 'contract_name');
    const initialCount = await page.locator('.sisad-pdfme-ui-custom-selectable').count();

    await page.keyboard.press(`${shortcutMod}+D`);
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable').count()).toBe(initialCount + 1);

    await page.keyboard.press(`${shortcutMod}+Z`);
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable').count()).toBe(initialCount);

    await page.keyboard.press(`${shortcutMod}+Shift+Z`);
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable').count()).toBe(initialCount + 1);

    await page.keyboard.press('Backspace');
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable').count()).toBe(initialCount);
  });

  test('editable detail inputs suppress shortcuts until focus returns to the canvas', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const schema = await selectSchema(page, 'contract_name');
    const initialCount = await page.locator('.sisad-pdfme-ui-custom-selectable').count();

    const nameInput = page.getByRole('textbox', { name: '* Nombre del campo' });
    await expect(nameInput).toBeVisible();
    await nameInput.click();

    await page.keyboard.press(`${shortcutMod}+D`);
    await expect(page.locator('.sisad-pdfme-ui-custom-selectable')).toHaveCount(initialCount);

    await schema.click({ force: true });
    await schema.focus();
    await page.keyboard.press(`${shortcutMod}+D`);
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable').count()).toBe(initialCount + 1);
  });
});

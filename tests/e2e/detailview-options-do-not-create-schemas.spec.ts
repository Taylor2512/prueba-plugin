import { expect, test, type Locator, type Page } from '@playwright/test';

const optionSchemas = [
  { name: 'contract_stage', type: 'select' },
  { name: 'approval_mode', type: 'radioGroup' },
  { name: 'required_documents', type: 'checkboxGroup' },
];

const selectSchema = async (page: Page, name: string) => {
  const locator = page.locator(`.sisad-pdfme-ui-custom-selectable[data-schema-name="${name}"]`).first();
  await expect(locator).toBeVisible();
  await locator.click({ force: true });
};

const addOptionViaKeyboard = async (input: Locator, label: string) => {
  await input.evaluate((element, nextValue) => {
    const inputEl = element as HTMLInputElement;
    inputEl.value = String(nextValue);
    inputEl.dispatchEvent(new Event('input', { bubbles: true }));
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  }, label);
};

const renameOptionViaKeyboard = async (input: Locator, label: string) => {
  await input.evaluate((element, nextValue) => {
    const inputEl = element as HTMLInputElement;
    inputEl.value = String(nextValue);
    inputEl.dispatchEvent(new Event('change', { bubbles: true }));
  }, label);
};

test.describe('detailview options', () => {
  for (const item of optionSchemas) {
    test(`adding an option in ${item.name} does not create extra schemas`, async ({ page }) => {
      await page.goto('/lab/multi-document-routing');
      await selectSchema(page, item.name);

      const optionsSection = page.locator('section[data-section="options"]');
      await expect(optionsSection).toBeVisible();

      const schemaLocator = page.locator(`.sisad-pdfme-ui-custom-selectable[data-schema-name="${item.name}"]`).first();
      const beforeSchemaCount = await page.locator('.sisad-pdfme-ui-custom-selectable').count();
      const beforeRowCount = await optionsSection.locator('[data-testid="option-row"]').count();

      const newInput = optionsSection.locator('[data-testid="option-new-input"]').first();
      await expect(newInput).toBeVisible();
      await addOptionViaKeyboard(newInput, `Nueva opción ${item.name}`);

      await expect(optionsSection.locator('[data-testid="option-row"]')).toHaveCount(beforeRowCount + 1);
      await expect(page.locator('.sisad-pdfme-ui-custom-selectable')).toHaveCount(beforeSchemaCount);
      await expect(schemaLocator).toHaveAttribute('data-schema-type', item.type);
    });
  }

  test('select options can be renamed and deleted without creating schemas', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await selectSchema(page, 'contract_stage');

    const optionsSection = page.locator('section[data-section="options"]');
    const schemaLocator = page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_stage"]').first();
    const beforeSchemaCount = await page.locator('.sisad-pdfme-ui-custom-selectable').count();
    const beforeRowCount = await optionsSection.locator('[data-testid="option-row"]').count();

    const newInput = optionsSection.locator('[data-testid="option-new-input"]').first();
    await addOptionViaKeyboard(newInput, 'Opción temporal E2E');
    await expect(optionsSection.locator('[data-testid="option-row"]')).toHaveCount(beforeRowCount + 1);

    const firstLabelInput = optionsSection.locator('[data-testid="option-label-input"]').first();
    await renameOptionViaKeyboard(firstLabelInput, 'Pendiente editado');
    await expect(firstLabelInput).toHaveValue('Pendiente editado');

    const deleteButton = optionsSection.locator('[data-testid="option-delete-button"]').last();
    await deleteButton.evaluate((element) => {
      (element as HTMLButtonElement).click();
    });

    await expect(optionsSection.locator('[data-testid="option-row"]')).toHaveCount(beforeRowCount);
    await expect(page.locator('.sisad-pdfme-ui-custom-selectable')).toHaveCount(beforeSchemaCount);
    await expect(schemaLocator).toHaveAttribute('data-schema-type', 'select');
  });
});

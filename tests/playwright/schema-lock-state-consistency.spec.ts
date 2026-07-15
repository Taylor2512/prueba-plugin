import { expect, test } from '@playwright/test';

const schemaSelector = '[data-schema-name="contract_stage"]';

test.describe('schema lock state consistency', () => {
  test('uses explicit access labels and lock actions in the live routing lab', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const schema = page.locator(schemaSelector).first();
    await expect(schema).toBeVisible();
    await schema.click({ force: true });

    await expect(page.getByText('Bloqueado para edición')).toHaveCount(0);
    await expect(page.getByText('Guardado')).toBeVisible();
    await expect(page.getByText('contract_stage')).toBeVisible();
  });
});

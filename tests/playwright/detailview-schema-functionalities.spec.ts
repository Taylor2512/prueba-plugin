import { expect, test, type Page } from '@playwright/test';

const selectCanvasSchema = async (page: Page, selector: string) => {
  const target = page.locator(selector).first();
  await expect(target).toBeVisible();
  await target.click({ force: true });
  await expect(page.getByTestId('detail-header-card')).toBeVisible();
};

test.describe('DetailView · funcionalidades por tipo de schema', () => {
  test('select: Opciones renders as the flat React editor (no Ant Card, no bullets)', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_stage"]');

    const optionsSection = page.getByTestId('detail-section-options');
    await expect(optionsSection).toBeVisible();

    await test.step('no internal Ant Card / form shell inside Opciones', async () => {
      await expect(optionsSection.locator('.ant-card')).toHaveCount(0);
      await expect(optionsSection.locator('.ant-row')).toHaveCount(0);
      await expect(
        optionsSection.locator('.sisad-pdfme-designer-detail-view-form-shell'),
      ).toHaveCount(0);
    });

    await test.step('flat structure: section card → options editor', async () => {
      const editor = optionsSection.getByTestId('detail-options-section');
      await expect(editor).toBeVisible();
      await expect(editor).toHaveAttribute('data-options-kind', 'select');
      await expect(optionsSection.locator('li')).toHaveCount(0);
      expect(await editor.getByTestId('option-row').count()).toBeGreaterThanOrEqual(3);
    });

    await test.step('counter and default control are present', async () => {
      await expect(optionsSection.locator('text=/\\d+ valores?/').first()).toBeVisible();
      expect(await optionsSection.getByTestId('option-default-control').count()).toBeGreaterThanOrEqual(3);
    });
  });

  test('radioGroup and checkboxGroup use the same editor and preserve their type', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await test.step('radioGroup', async () => {
      await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-type="radioGroup"]');
      const editor = page.getByTestId('detail-options-section');
      await expect(editor.first()).toBeVisible();
      await expect(editor.first()).toHaveAttribute('data-options-kind', 'radio');
      expect(await editor.getByTestId('option-row').count()).toBeGreaterThanOrEqual(1);
      await expect(
        page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="radioGroup"]').first(),
      ).toHaveAttribute('data-schema-type', 'radioGroup');
    });

    await test.step('checkboxGroup', async () => {
      await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]');
      const editor = page.getByTestId('detail-options-section');
      await expect(editor.first()).toBeVisible();
      await expect(editor.first()).toHaveAttribute('data-options-kind', 'checkbox');
      expect(await editor.getByTestId('option-row').count()).toBeGreaterThanOrEqual(1);
      await expect(
        page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]').first(),
      ).toHaveAttribute('data-schema-type', 'checkboxGroup');
    });
  });

  test('Técnico never renders empty-expanded; header shows for every selected schema', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]');

    const technical = page.getByTestId('detail-section-technical');
    if (await technical.count()) {
      await expect(technical.first()).toHaveAttribute('data-collapsed', 'true');
      // A collapsed section still must have a visible title (never a blank card).
      await expect(technical.first().getByRole('button')).toBeVisible();
    }
  });
});

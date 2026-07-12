import { expect, test, type Page } from '@playwright/test';

const openCatalog = async (page: Page) => {
  const toggle = page.getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i }).first();
  await expect(toggle).toBeVisible();
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

const selectCanvasSchema = async (page: Page, selector: string) => {
  const target = page.locator(`[data-paper-page="true"] ${selector}`).first();
  await expect(target).toBeVisible();
  await target.click({ force: true });
  const detailView = page.getByTestId('detail-view');
  if (!(await detailView.isVisible().catch(() => false))) {
    const openDetail = page.getByRole('button', { name: /Abrir panel Detalle|Ver detalle|Detalle/i }).first();
    if (await openDetail.count()) {
      await openDetail.click({ force: true }).catch(() => {});
    }
  }
  await expect(detailView).toBeVisible();
};

const expectSectionVisible = async (page: Page, testId: string) => {
  await expect(page.getByTestId(testId).first()).toBeVisible();
};

const ensureOptionsSectionExpanded = async (page: Page) => {
  const optionsSection = page.getByTestId('detail-section-options').first();
  if (await optionsSection.isVisible().catch(() => false)) {
    return;
  }

  const expand = page.getByRole('button', { name: /Expandir sección Opciones/i }).first();
  if (await expand.count()) {
    await expand.click({ timeout: 2000 }).catch(() => {});
  }
  await expect(page.getByTestId('detail-section-options').first()).toBeVisible();
};

test.describe('inspector detailview profiles', () => {
  test('select, radioGroup and checkboxGroup expose options + validation contracts', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_stage"]');
    await expectSectionVisible(page, 'detail-section-options');
    await expectSectionVisible(page, 'detail-section-fill-rules');
    await expect(page.getByTestId('detail-options-section').first()).toContainText(/valores?/i);

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-type="radioGroup"]');
    await ensureOptionsSectionExpanded(page);
    await expect(page.getByTestId('detail-options-section').first()).toHaveAttribute('data-options-kind', /radio|select/i);

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]');
    await ensureOptionsSectionExpanded(page);
    await expect(page.getByTestId('detail-options-section').first()).toHaveAttribute('data-options-kind', /checkbox/i);
  });

  test('attachment, signing and actions resolve proportional sections', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_attachment"]');
    await expect(page.getByText('Reglas del archivo')).toBeVisible();
    await expect(page.getByText('Asignación y bloqueo')).toBeVisible();
    await expect(page.getByTestId('detail-section-options')).toHaveCount(0);

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_signature"]');
    await expect(page.getByTestId('detail-view')).toContainText(/Asignación y bloqueo/i);
    await expect(page.getByTestId('detail-view')).toContainText(/Ayuda del campo/i);
    await expect(page.getByTestId('detail-view')).not.toContainText(/Opciones/i);

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_initials"]');
    await expect(page.getByTestId('detail-view')).toContainText(/Asignación y bloqueo/i);
    await expect(page.getByTestId('detail-view')).not.toContainText(/Opciones/i);

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_datesigned"]');
    await expect(page.getByTestId('detail-view')).toContainText(/Formato de fecha/i);
    await expect(page.getByTestId('detail-view')).not.toContainText(/Opciones/i);

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_approve"]');
    await expect(page.getByTestId('detail-section-behavior')).toBeVisible();
    await expect(page.getByTestId('detail-view')).not.toContainText(/Opciones/i);

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_decline"]');
    await expect(page.getByTestId('detail-section-behavior')).toBeVisible();
    await expect(page.getByTestId('detail-view')).not.toContainText(/Opciones/i);
  });

  test('text and number expose content and validation without option noise', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await selectCanvasSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]');
    await expectSectionVisible(page, 'detail-section-info');
    await expectSectionVisible(page, 'detail-section-fill-rules');
    await expect(page.getByTestId('detail-view')).not.toContainText(/Opciones/i);

    await openCatalog(page);
    await page.getByRole('tab', { name: /Campos estándar/i }).click();
    const numberTile = page.locator('[data-schema-type="number"]').first();
    await expect(numberTile).toBeVisible();
    await expect(page.getByTestId('detail-view')).not.toContainText(/Opciones/i);
  });
});

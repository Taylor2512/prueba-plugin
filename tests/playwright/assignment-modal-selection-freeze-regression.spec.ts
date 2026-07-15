/**
 * TASK-INTERACTION-016 — regresión: tras abrir/cerrar el modal "Reasignar
 * responsable" (Cancelar/X/Escape/Confirmar) el diseñador NO debe quedar
 * bloqueado: seleccionar, multi-seleccionar (Cmd/Ctrl) y limpiar con click
 * vacío deben seguir funcionando, y la selección NO se pierde al cancelar.
 */
import { expect, test, type Page } from '@playwright/test';

const schemaLocator = (page: Page, name: string) =>
  page.locator(`.sisad-pdfme-ui-custom-selectable[data-schema-name="${name}"]`).first();

const selectSchema = async (page: Page, name: string) => {
  await schemaLocator(page, name).click({ force: true });
  await expect(schemaLocator(page, name)).toHaveAttribute('data-schema-active', 'true');
};

const addToSelection = async (page: Page, name: string) => {
  await schemaLocator(page, name).click({ force: true, modifiers: ['ControlOrMeta'] });
  await expect(schemaLocator(page, name)).toHaveAttribute('data-schema-active', 'true');
};

const clickEmptyPaper = async (page: Page) => {
  const paper = page.locator('.sisad-pdfme-paper-page').first();
  const box = await paper.boundingBox();
  expect(box).not.toBeNull();
  // Zona baja de la página: libre de schemas en el template del lab.
  await paper.click({ position: { x: (box?.width ?? 400) * 0.5, y: (box?.height ?? 800) * 0.92 }, force: true });
};

const openFieldsPanel = async (page: Page) => {
  const fieldsTab = page.getByRole('tab', { name: 'Abrir panel Campos' }).first();
  if (await fieldsTab.count()) {
    await fieldsTab.click();
  }
};

const openReassignDialog = async (page: Page) => {
  await openFieldsPanel(page);
  const reassign = page.getByTestId('right-sidebar-reassign').first();
  await expect(reassign).toBeVisible();
  await expect(reassign).toBeEnabled();
  await reassign.click();
  await expect(page.getByTestId('schema-assignment-dialog')).toBeVisible();
};

test.describe('assignment modal selection freeze regression', () => {
  test('mandatory flow: cancel → select → multi-select → empty click → escape → select again', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    // a. seleccionar contract_stage
    await selectSchema(page, 'contract_stage');

    // b. abrir Reasignar
    await openReassignDialog(page);

    // c. Cancelar
    await page.getByTestId('schema-assignment-cancel').click();
    await expect(page.getByTestId('schema-assignment-dialog')).toBeHidden();

    // activeElements NO se limpia por cancelar.
    await expect(schemaLocator(page, 'contract_stage')).toHaveAttribute('data-schema-active', 'true');

    // d. seleccionar contract_date (el canvas NO está congelado)
    await selectSchema(page, 'contract_date');

    // e. Cmd/Ctrl click contract_name (multi-select sigue funcionando)
    await addToSelection(page, 'contract_name');
    await expect(schemaLocator(page, 'contract_date')).toHaveAttribute('data-schema-active', 'true');

    // f. click vacío limpia selección
    await clickEmptyPaper(page);
    await expect(schemaLocator(page, 'contract_date')).toHaveAttribute('data-schema-active', 'false');
    await expect(schemaLocator(page, 'contract_name')).toHaveAttribute('data-schema-active', 'false');

    // g. abrir Reasignar de nuevo (requiere selección)
    await selectSchema(page, 'contract_stage');
    await openReassignDialog(page);

    // h. cerrar con Escape
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('schema-assignment-dialog')).toBeHidden();

    // i. seleccionar approval_mode — j. no debe quedar bloqueado
    await selectSchema(page, 'approval_mode');
  });

  test('closing with the X keeps the canvas interactive', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await selectSchema(page, 'contract_stage');
    await openReassignDialog(page);

    await page.locator('.sisad-pdfme-schema-assignment-dialog .ant-modal-close').first().click();
    await expect(page.getByTestId('schema-assignment-dialog')).toBeHidden();

    await expect(schemaLocator(page, 'contract_stage')).toHaveAttribute('data-schema-active', 'true');
    await selectSchema(page, 'contract_date');
  });

  test('confirming a reassignment keeps the canvas interactive', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await selectSchema(page, 'contract_stage');
    await openReassignDialog(page);

    // Elegir Avalista (recipient-2 del lab) y confirmar.
    await page.getByTestId('schema-assignment-option-recipient-2').click();
    const confirm = page.getByTestId('schema-assignment-confirm');
    await expect(confirm).toBeEnabled();
    await confirm.click();
    await expect(page.getByTestId('schema-assignment-dialog')).toBeHidden();

    // Después de confirmar puedo seguir seleccionando.
    await selectSchema(page, 'contract_date');
    await selectSchema(page, 'approval_mode');
  });

  test('double-clicking Reasignar never opens two modals', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await selectSchema(page, 'contract_stage');
    await openFieldsPanel(page);
    const reassign = page.getByTestId('right-sidebar-reassign').first();
    await expect(reassign).toBeVisible();
    await reassign.dblclick();

    await expect(page.getByTestId('schema-assignment-dialog')).toBeVisible();
    expect(await page.locator('.sisad-pdfme-schema-assignment-dialog .ant-modal').count()).toBe(1);

    await page.getByTestId('schema-assignment-cancel').click();
    await expect(page.getByTestId('schema-assignment-dialog')).toBeHidden();
    await selectSchema(page, 'contract_date');
  });
});

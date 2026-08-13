import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  await page.getByText('Cada ruta es data-driven,').click();
  await page.getByRole('heading', { name: 'Catálogo de ejemplos del' }).click();
  await expect(page.getByRole('banner')).toBeVisible();
  await page.getByRole('link', { name: 'Designer: multiusuario Colaboración con varios usuarios y cambio de actor' }).click();
  await page.locator('.sisad-pdfme-designer-canvas').click();
  await expect(page.locator('.sisad-pdfme-designer-canvas')).toBeVisible();
  // Check runtime viewport contains the expected sample text and primary actions.
  const runtime = page.getByTestId('-runtime-viewport');
  await expect(runtime.getByText(/Texto de ejemplo/)).toBeVisible();
  // Target the runtime action buttons specifically by their action-button class.
  await expect(runtime.locator('button.sisad-pdfme-action-button:has-text("Aprobar")')).toBeVisible();
  await expect(runtime.locator('button.sisad-pdfme-action-button:has-text("Rechazar")')).toBeVisible();
  await expect(runtime.locator('#text-0')).toHaveText(/Texto de ejemplo/);
  // Select the sample text field so the inspector shows the field widgets.
  await runtime.locator('#text-0').click();
  await expect(page.getByTestId('inspector-required-switch')).toBeVisible();
  await page.getByTestId('inspector-required-switch').click();
  await page.getByTestId('inspector-required-switch').click();
  await page.getByRole('button', { name: 'Colapsar sección Interacción' }).click();
  await page.locator('.ant-form-item.fr-field.css-dev-only-do-not-override-dzfy24.ant-form-item-has-success > .ant-row > .ant-col.ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content').click();
  await page.locator('.ant-form-item.fr-field.css-dev-only-do-not-override-dzfy24.ant-form-item-has-success > .ant-row > .ant-col.ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content').click();
  await page.locator('.ant-form-item.fr-field.css-dev-only-do-not-override-dzfy24.ant-form-item-has-success > .ant-row > .ant-col.ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content').dblclick();
  await page.locator('.ant-form-item.fr-field.css-dev-only-do-not-override-dzfy24.ant-form-item-has-success > .ant-row > .ant-col.ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content').dblclick();
  await page.getByRole('button', { name: 'Colapsar sección Reglas de' }).click();
  await page.locator('.sisad-pdfme-designer-detail-view-sections').click();
  await page.getByRole('button', { name: 'Expandir sección Reglas de' }).click();
  await page.locator('div').filter({ hasText: /^Solo lectura$/ }).nth(5).click();
  // Wait for the active-recipient select to appear and be interactive.
  await expect(page.getByTestId('designer-activerecipient-select')).toBeVisible({ timeout: 20000 });
  await page.getByTestId('designer-activerecipient-select').selectOption('bob');
  await page.getByTestId('designer-activerecipient-select').selectOption('carla');
  await page.getByTestId('designer-activerecipient-select').selectOption('bob');
  await page.getByLabel('Lista de campos del documento').click();
  await page.getByTestId('designer-activerecipient-select').selectOption('alice');
  await page.getByText('Texto de ejemplo42Ada').click();
  await page.getByRole('button', { name: 'Fecha de firma Fecha de firma' }).click();
  await page.getByRole('button', { name: 'Número' }).click();
});
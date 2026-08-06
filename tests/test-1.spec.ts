import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:5174/');
  await page.getByText('Cada ruta es data-driven,').click();
  await page.getByRole('heading', { name: 'Catálogo de ejemplos del' }).click();
  await expect(page.getByRole('banner')).toBeVisible();
  await page.getByRole('link', { name: 'Designer: multiusuario Colaboración con varios usuarios y cambio de actor' }).click();
  await page.locator('.sisad-pdfme-designer-canvas').click();
  await expect(page.locator('.sisad-pdfme-designer-canvas')).toBeVisible();
  await expect(page.getByTestId('example-runtime-viewport')).toMatchAriaSnapshot(`
    - text: "/Texto de ejemplo \\\\d+ Ada Lovelace ada@acme\\\\.example Acme Labs Analista senior Add text here using \\\\{\\\\} for variables ✍ Firma Alice Firma dibujada ✍ Firma Alice Firma dibujada \\\\d+\\\\/\\\\d+\\\\/\\\\d+ \\\\d+\\\\/\\\\d+\\\\/\\\\d+ \\\\d+:\\\\d+ PM \\\\d+\\\\/\\\\d+\\\\/\\\\d+ \\\\d+:\\\\d+ Seleccionar/"
    - button
    - img
    - text: Adjuntar archivo Nota informativa
    - button "Aprobar":
      - img
      - text: ""
    - button "Rechazar":
      - img
      - text: ""
    - text: Seleccionar
    - button
    - text: Seleccionar
    - button
    - radiogroup "Grupo de opción":
      - radio "Opción 1" [checked] [disabled]
      - radio "Opción 2" [disabled]
    - group "Grupo de casillas":
      - checkbox "Casilla 1" [disabled]
      - checkbox "Casilla 2" [disabled]
    `);
  await expect(page.locator('#text-0')).toMatchAriaSnapshot(`- text: Texto de ejemplo`);
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
  await page.getByTestId('example-recipient-select').selectOption('bob');
  await page.getByTestId('example-recipient-select').selectOption('carla');
  await page.getByTestId('example-recipient-select').selectOption('bob');
  await page.getByLabel('Lista de campos del documento').click();
  await page.getByTestId('example-recipient-select').selectOption('alice');
  await page.getByText('Texto de ejemplo42Ada').click();
  await page.getByRole('button', { name: 'Fecha de firma Fecha de firma' }).click();
  await page.getByRole('button', { name: 'Número' }).click();
});
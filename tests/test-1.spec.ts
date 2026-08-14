import { test, expect } from '@playwright/test';

/**
 * PENDIENTE — apunta a UI que ya no se monta.
 *
 * Diagnóstico (sesión RTP-510): estos specs se grabaron con codegen contra una
 * versión del Designer que montaba `RegisteredUsersSelector`
 * (`data-testid="designer-activerecipient-select"`). Hoy ese componente tiene
 * CERO consumidores en `src/`: está exportado pero nadie lo renderiza, así que
 * ni el selector ni su estado vacío aparecen en `/designer/multi-user`.
 *
 * No es una regresión de esta campaña: fallaban ya antes de tocar nada.
 * Tampoco se «arreglan» borrando aserciones — eso ocultaría que la capability
 * de cambiar de usuario activo no tiene superficie.
 *
 * Se dejan en `fixme` con el diagnóstico. El componente muerto queda anotado
 * para RTP-530 (retirada de legacy) y la capability de usuario activo para
 * RTP-525 (migración Recipient→User), que es donde debe decidirse si se vuelve
 * a montar o se retira.
 *
 * Además son frágiles por construcción: dependen de hashes de clase de Ant
 * (`css-dev-only-do-not-override-dzfy24`) y de `.nth(5)` sobre un filtro de
 * divs. Reescribirlos con selectores estables es parte de esa misma task.
 */
test.fixme('test', async ({ page }) => {
  // Navegación por RUTA, no por etiqueta humana: el título del catálogo se
  // renombró a «Designer · flujo multiusuario» y estos specs quedaron rotos
  // apuntando al label anterior. La ruta es el contrato estable.
  await page.goto('/designer/multi-user');
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
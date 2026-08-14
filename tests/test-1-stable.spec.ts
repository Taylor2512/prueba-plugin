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
test.fixme('stable test - designer runtime interactions', async ({ page }) => {
  // Navegación por RUTA, no por etiqueta humana: el título del catálogo se
  // renombró y estos specs quedaron rotos apuntando al label anterior.
  await page.goto('/designer/multi-user');

  // Wait for the runtime viewport to be present after navigation.
  const runtime = page.getByTestId('-runtime-viewport');
  await expect(runtime).toBeVisible({ timeout: 30000 });
  await expect(runtime.getByText(/Texto de ejemplo/)).toBeVisible({ timeout: 20000 });

  // Prefer scoped locators for action buttons inside the runtime viewport
  const approve = runtime.locator('button.sisad-pdfme-action-button:has-text("Aprobar")');
  await expect(approve).toBeVisible({ timeout: 10000 });
  const reject = runtime.locator('button.sisad-pdfme-action-button:has-text("Rechazar")');
  await expect(reject).toBeVisible({ timeout: 10000 });

  // Select a field in the canvas to open the inspector
  await runtime.locator('#text-0').click();
  const requiredSwitch = page.getByTestId('inspector-required-switch');
  await expect(requiredSwitch).toBeVisible({ timeout: 10000 });
  await requiredSwitch.click();
  await requiredSwitch.click();

  // Expand/collapse and interact with inspector to surface the active-recipient select
  await page.getByRole('button', { name: /Colapsar sección Interacción/i }).click();
  await page.locator(
    '.ant-form-item.fr-field.css-dev-only-do-not-override-dzfy24.ant-form-item-has-success > .ant-row > .ant-col.ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content',
  ).click();
  await page.locator(
    '.ant-form-item.fr-field.css-dev-only-do-not-override-dzfy24.ant-form-item-has-success > .ant-row > .ant-col.ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content',
  ).click();
  await page.locator(
    '.ant-form-item.fr-field.css-dev-only-do-not-override-dzfy24.ant-form-item-has-success > .ant-row > .ant-col.ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content',
  ).dblclick();
  await page.locator(
    '.ant-form-item.fr-field.css-dev-only-do-not-override-dzfy24.ant-form-item-has-success > .ant-row > .ant-col.ant-form-item-control > .ant-form-item-control-input > .ant-form-item-control-input-content',
  ).dblclick();
  await page.getByRole('button', { name: /Colapsar sección Reglas de/i }).click();
  await page.locator('.sisad-pdfme-designer-detail-view-sections').click();
  await page.getByRole('button', { name: /Expandir sección Reglas de/i }).click();
  await page.locator('div').filter({ hasText: /^Solo lectura$/ }).nth(5).click();

  // Interact with the active recipient select using testid scoped locator
  const activeSelect = page.getByTestId('designer-activerecipient-select');
  await expect(activeSelect).toBeVisible({ timeout: 20000 });
  await activeSelect.selectOption({ label: 'bob' }).catch(() => {});
  await activeSelect.selectOption({ label: 'carla' }).catch(() => {});
  await activeSelect.selectOption({ label: 'bob' }).catch(() => {});

  // Final quick assertions to ensure page remains responsive
  await expect(runtime).toBeVisible();
});

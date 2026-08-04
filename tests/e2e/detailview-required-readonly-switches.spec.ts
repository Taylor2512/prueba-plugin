/**
 * INSPECTOR-001/002 — switches de "Obligatorio" y "Solo lectura".
 *
 * Criterios cubiertos: un clic produce un cambio, el switch no rebota ni vuelve
 * al valor anterior, el cambio persiste al volver a seleccionar el campo, y
 * activar `readOnly` no deshabilita el propio switch que lo activó.
 */
import { expect, test, type Locator, type Page } from '@playwright/test';

const DESIGNER_ROUTE = '/examples/designer/single-user';
const SCHEMA_SELECTOR = '.sisad-pdfme-ui-custom-selectable[data-schema-name="text"]';

/** Espera a que el debounce de escritura (180 ms) y su commit hayan pasado. */
const SETTLE_MS = 600;

/** Abre la sección que contiene un switch, si está colapsada. */
const revealSwitch = async (page: Page, testId: string): Promise<Locator> => {
  const control = page.getByTestId(testId);
  if (await control.isVisible().catch(() => false)) return control;

  const collapsedToggles = page.locator('section[data-section] button[aria-expanded="false"]');
  const count = await collapsedToggles.count();
  for (let index = 0; index < count; index += 1) {
    await collapsedToggles.nth(index).click();
    if (await control.isVisible().catch(() => false)) return control;
  }
  return control;
};

/** Selecciona el campo de prueba y espera al inspector. */
const selectSchema = async (page: Page): Promise<void> => {
  await page.locator(SCHEMA_SELECTOR).first().click({ force: true });
  await expect(page.getByTestId('detail-view')).toBeVisible();
};

test.describe('inspector — switches de required y readOnly', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DESIGNER_ROUTE);
    await selectSchema(page);
  });

  test('required cambia con un solo clic y no rebota', async ({ page }) => {
    const requiredSwitch = await revealSwitch(page, 'inspector-required-switch');
    await expect(requiredSwitch).toBeVisible();

    const before = (await requiredSwitch.getAttribute('aria-checked')) || 'false';
    const expectedAfter = before === 'true' ? 'false' : 'true';

    await requiredSwitch.click();
    await expect(requiredSwitch).toHaveAttribute('aria-checked', expectedAfter);

    // Un segundo commit tardío (doble handler o rehidratación) devolvería el
    // valor anterior: debe seguir estable pasado el debounce.
    await page.waitForTimeout(SETTLE_MS);
    await expect(requiredSwitch).toHaveAttribute('aria-checked', expectedAfter);
  });

  test('required persiste al deseleccionar y volver a seleccionar', async ({ page }) => {
    const requiredSwitch = await revealSwitch(page, 'inspector-required-switch');
    const before = (await requiredSwitch.getAttribute('aria-checked')) || 'false';
    const expectedAfter = before === 'true' ? 'false' : 'true';

    await requiredSwitch.click();
    await expect(requiredSwitch).toHaveAttribute('aria-checked', expectedAfter);
    await page.waitForTimeout(SETTLE_MS);

    await page.keyboard.press('Escape');
    await selectSchema(page);

    const reopened = await revealSwitch(page, 'inspector-required-switch');
    await expect(reopened).toHaveAttribute('aria-checked', expectedAfter);
  });

  test('solo lectura se puede activar y volver a desactivar', async ({ page }) => {
    const readOnlySwitch = await revealSwitch(page, 'inspector-readonly-switch');
    await expect(readOnlySwitch).toBeVisible();

    const before = (await readOnlySwitch.getAttribute('aria-checked')) || 'false';
    const expectedAfter = before === 'true' ? 'false' : 'true';

    await readOnlySwitch.click();
    await expect(readOnlySwitch).toHaveAttribute('aria-checked', expectedAfter);
    await page.waitForTimeout(SETTLE_MS);

    // `schema.readOnly` describe el runtime del formulario, no el permiso del
    // diseñador: el control tiene que seguir operable para revertirlo.
    await expect(readOnlySwitch).toBeEnabled();
    await readOnlySwitch.click();
    await expect(readOnlySwitch).toHaveAttribute('aria-checked', before);
  });

  test('activar solo lectura no deshabilita el resto del inspector', async ({ page }) => {
    const readOnlySwitch = await revealSwitch(page, 'inspector-readonly-switch');
    const before = (await readOnlySwitch.getAttribute('aria-checked')) || 'false';

    if (before !== 'true') {
      await readOnlySwitch.click();
      await expect(readOnlySwitch).toHaveAttribute('aria-checked', 'true');
      await page.waitForTimeout(SETTLE_MS);
    }

    const requiredSwitch = await revealSwitch(page, 'inspector-required-switch');
    await expect(requiredSwitch).toBeEnabled();
    await expect(page.getByTestId('detail-view-access-notice')).toHaveCount(0);
  });

  test('el switch no anida controles interactivos', async ({ page }) => {
    const requiredSwitch = await revealSwitch(page, 'inspector-required-switch');
    await expect(requiredSwitch).toBeVisible();

    const nestedButtons = await requiredSwitch.evaluate(
      (element) => element.querySelectorAll('button').length,
    );
    const hasButtonAncestor = await requiredSwitch.evaluate((element) =>
      Boolean(element.parentElement?.closest('button')),
    );

    expect(nestedButtons).toBe(0);
    expect(hasButtonAncestor).toBe(false);
  });

  test('conserva los atributos de exclusión del canvas', async ({ page }) => {
    const requiredSwitch = await revealSwitch(page, 'inspector-required-switch');
    const exclusions = await requiredSwitch.evaluate((element) => {
      const host = element.closest('[data-sisad-inspector-interactive="true"]');
      return {
        selecto: host?.getAttribute('data-selecto-ignore') ?? null,
        moveable: host?.getAttribute('data-moveable-ignore') ?? null,
        drop: host?.getAttribute('data-canvas-drop-ignore') ?? null,
      };
    });

    expect(exclusions).toEqual({ selecto: 'true', moveable: 'true', drop: 'true' });
  });

  test('el nombre persiste con debounce y conserva lo escrito', async ({ page }) => {
    const nameInput = page.getByTestId('detail-view').locator('input#name');
    await nameInput.fill('renombrado_e2e');
    await page.waitForTimeout(SETTLE_MS);

    // Rehidratar el formulario en cada render borraba lo tecleado.
    await expect(nameInput).toHaveValue('renombrado_e2e');
    await expect(
      page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="renombrado_e2e"]'),
    ).toHaveCount(1);
  });

  test('un nombre duplicado no se persiste y muestra el error', async ({ page }) => {
    const nameInput = page.getByTestId('detail-view').locator('input#name');
    await nameInput.fill('number');
    await page.waitForTimeout(SETTLE_MS);

    await expect(page.getByTestId('detail-view').locator('.ant-form-item-explain-error')).toHaveCount(1);
    await expect(
      page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="number"]'),
    ).toHaveCount(1);
  });

  test('cambiar un switch no colapsa ni remonta su sección', async ({ page }) => {
    const requiredSwitch = await revealSwitch(page, 'inspector-required-switch');
    const section = page.locator('section[data-section="validation"]');
    await expect(section).toBeVisible();

    await requiredSwitch.click();
    await page.waitForTimeout(SETTLE_MS);

    await expect(section).toBeVisible();
    await expect(requiredSwitch).toBeVisible();
  });
});

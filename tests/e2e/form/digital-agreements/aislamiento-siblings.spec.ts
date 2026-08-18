import { expect, test } from '@playwright/test';
import {
  abrirForm,
  CAMPOS,
  desenfocar,
  esperarValores,
  fijar,
  NO_TEXTUALES,
  type ClaveCampo,
} from '../../../support/playwright';

/**
 * La clase de regresión que más ha costado en este repositorio es el
 * **rollback selectivo entre siblings**: interactuar con B revertía A. Aquí se
 * cruzan las cinco familias, así que cada comprobación verifica el campo tocado
 * Y todos los vecinos ya escritos.
 *
 * El repro histórico mínimo del incidente vive en
 * `tests/e2e/regressions/sibling-rollback.spec.ts`; esto es la matriz completa.
 */
test.beforeEach(async ({ page }) => {
  await abrirForm(page, '/runtime/form/digital-agreements');
});

test.describe('Form digital-agreements — aislamiento entre siblings', () => {
  // @caso RUN-004
  // @caso UC-21
  test('rotación por las cinco familias preservando todo lo anterior', async ({ page }) => {
    const orden: ClaveCampo[] = ['text', 'number', 'fullName', 'company', 'title', 'email'];
    const esperado: Partial<Record<ClaveCampo, string>> = {};

    for (let ronda = 1; ronda <= 3; ronda += 1) {
      for (const clave of orden) {
        const valor = clave === 'number' ? `${ronda}00` : `${clave}-${ronda}`;
        await fijar(page, clave, valor);
        esperado[clave] = valor;
        // Tras CADA edición, todos los campos ya tocados siguen intactos.
        await esperarValores(page, esperado);
      }
    }
  });

  // @caso SCH-007
  // @caso RUN-004
  test('interactuar con un schema de elección no revierte los de texto', async ({ page }) => {
    await fijar(page, 'text', 'Antes de elegir');
    await fijar(page, 'number', '99');

    await page.locator(NO_TEXTUALES.radioGroup).click();
    await desenfocar(page);
    await page.locator(NO_TEXTUALES.checkboxGroup).click();
    await desenfocar(page);

    await esperarValores(page, { text: 'Antes de elegir', number: '99' });
  });

  // @caso RUN-007
  test('interactuar con una acción no revierte los campos rellenados', async ({ page }) => {
    await fijar(page, 'text', 'Antes de aprobar');
    await fijar(page, 'company', 'ACME');

    await page.locator(NO_TEXTUALES.approve).click();
    await desenfocar(page);

    await esperarValores(page, { text: 'Antes de aprobar', company: 'ACME' });
  });

  // @caso RUN-004
  test('un sibling nunca tocado conserva su valor inicial de plantilla', async ({ page }) => {
    const inicial = await page.locator(CAMPOS.title).textContent();
    await fijar(page, 'text', 'Sólo este');
    await fijar(page, 'number', '5');
    await expect(page.locator(CAMPOS.title)).toHaveText(inicial ?? '');
  });
});

import { test, expect } from '@playwright/test';
import {
  abrirForm,
  CAMPOS,
  desenfocar,
  escribirCampo,
  leerCampo,
  leerInteraccion,
  NO_TEXTUALES,
} from '../../support/playwright';

/**
 * Entradas y salidas canónicas del Form.
 *
 * Este spec no había llegado a ejecutarse nunca: el helper de apertura exigía
 * una clase que ningún componente aplica, así que fallaba antes de la primera
 * aserción. Al arreglarlo salieron dos premisas falsas que se corrigen aquí:
 *
 *   - Buscaba «varios schemas de tipo `text`». La ruta monta UNO solo; los
 *     vecinos son tipos propios (`fullName`, `company`, …) que reutilizan el
 *     `ui` de `text`. Ese cruce entre plugins es justamente el interesante.
 *   - Buscaba `data-schema-type="checkbox"`. La familia montada es
 *     `checkboxGroup`; `checkbox` no existe en esta plantilla.
 */
test.describe('Form — entradas y salidas canónicas', () => {
  test.beforeEach(async ({ page }) => {
    await abrirForm(page, '/runtime/form/digital-agreements');
  });

  // @caso RUN-002
  // @caso RUN-004
  // @caso UC-21
  test('RUN-004 — una edición de texto queda en el mismo schema y no modifica un sibling', async ({
    page,
  }) => {
    const editado = page.locator(CAMPOS.text);
    const vecino = page.locator(CAMPOS.fullName);
    await expect(editado).toBeVisible();
    await expect(vecino).toBeVisible();

    const vecinoAntes = await leerCampo(vecino);
    await escribirCampo(editado, 'ENTRADA-CANONICA-TEXTO');
    await desenfocar(page);

    await expect(editado).toHaveText('ENTRADA-CANONICA-TEXTO');
    expect(await leerCampo(vecino)).toBe(vecinoAntes);

    // El modelo debe reflejar la interacción, no sólo el DOM del campo.
    const estado = await leerInteraccion(page, 'text', [
      'data-touched',
      'data-dirty',
      'data-interaction-count',
    ]);
    expect(estado['data-touched']).toBe('true');
    expect(estado['data-dirty']).toBe('true');
    expect(Number(estado['data-interaction-count'])).toBeGreaterThan(0);
  });

  // @caso SCH-005
  // @caso UC-21
  test('SCH-005 — el número 0 se conserva como valor válido y no se trata como vacío', async ({
    page,
  }) => {
    const campo = page.locator(CAMPOS.number);
    await expect(campo).toBeVisible();
    await escribirCampo(campo, '0');
    await desenfocar(page);
    await expect(campo).toHaveText('0');
  });

  // @caso SCH-007
  test('SCH-007 — una casilla cambia mediante interacción real y expone su estado accesible', async ({
    page,
  }) => {
    const casilla = page.locator(NO_TEXTUALES.checkboxGroup).getByRole('checkbox').first();
    await expect(casilla).toBeVisible();

    const antes = await casilla.getAttribute('aria-checked');
    await casilla.click();
    await expect(casilla).toHaveAttribute('aria-checked', antes === 'true' ? 'false' : 'true');
  });

  // @caso SCH-010
  test('SCH-010 — select cambia con el control nativo sin mutación directa del DOM', async ({
    page,
  }) => {
    const select = page.locator(NO_TEXTUALES.select).locator('select').first();
    await expect(select).toBeVisible();

    const opciones = await select
      .locator('option')
      .evaluateAll((els) => els.map((e) => (e as HTMLOptionElement).value).filter(Boolean));
    expect(opciones.length).toBeGreaterThan(0);

    await select.selectOption(opciones[0]);
    await expect(select).toHaveValue(opciones[0]);
  });
});

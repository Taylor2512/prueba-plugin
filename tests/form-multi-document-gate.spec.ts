import { expect, test, type Page } from '@playwright/test';

/**
 * RTP-510.A/C — gate de navegador para scope User × Document e interaction state.
 *
 * Los contratos unitarios ya fijan la proyección por scope. Lo que este spec
 * añade es que el Form real —renderer imperativo incluido— respeta ese scope
 * cuando el usuario conmuta desde la interfaz, y que `touched`/`dirty`/`valid`/
 * `completed` que expone el modelo coinciden con lo que acaba de ocurrir.
 *
 * La ruta monta la MISMA estructura de schemas en dos documentos: sin eso no se
 * puede afirmar que un mismo campo vale una cosa en D1 y otra en D2.
 */
const FIELD = '#text-text-0';

const userSelect = (page: Page) => page.getByTestId('lab-active-user-select');
const documentSelect = (page: Page) => page.getByTestId('lab-active-document-select');

const blur = (page: Page) =>
  page.evaluate(() =>
    document.activeElement instanceof HTMLElement ? document.activeElement.blur() : undefined,
  );

const setValue = async (page: Page, value: string) => {
  await page.locator(FIELD).click();
  await page.keyboard.press('ControlOrMeta+a');
  if (value === '') await page.keyboard.press('Delete');
  else await page.keyboard.type(value);
  await blur(page);
};

const switchDocument = async (page: Page, documentId: string) => {
  await documentSelect(page).selectOption(documentId);
  await page.waitForTimeout(350);
};

const switchUser = async (page: Page, userId: string) => {
  await userSelect(page).selectOption(userId);
  await page.waitForTimeout(350);
};

/**
 * Lee el estado de interacción que expone el MODELO, no el DOM del campo.
 *
 * El shell inmersivo mantiene el panel plegado y, abierto, cubre el área de
 * edición. Por eso se abre sólo para leer y se vuelve a cerrar: así el gate
 * observa el modelo sin alterar cómo se interactúa con el formulario.
 */
const readInteraction = async (
  page: Page,
  schemaName: string,
  attributes: string[],
): Promise<Record<string, string | null>> => {
  await page.getByTestId('-info-toggle').click();
  const fila = page.getByTestId(`lab-interaction-${schemaName}`);
  await expect(fila).toHaveCount(1);

  const result: Record<string, string | null> = {};
  for (const attribute of attributes) {
    result[attribute] = await fila.getAttribute(attribute);
  }

  // El drawer es un diálogo modal: su overlay cubre el propio botón que lo
  // abrió, así que se cierra por teclado, que es como lo cerraría un usuario.
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('-info-panel')).toHaveCount(0);
  return result;
};

test.beforeEach(async ({ page }) => {
  await page.goto('/runtime/form/multi-document');
  await page.waitForSelector(FIELD);
});

test.describe('scope de documento', () => {
  test('los dos conmutadores están disponibles', async ({ page }) => {
    await expect(documentSelect(page)).toHaveCount(1);
    await expect(documentSelect(page).locator('option')).toHaveCount(2);
    await expect(userSelect(page)).toHaveCount(1);
  });

  test('D1 → D2 → D1 conserva el valor de cada documento', async ({ page }) => {
    await switchDocument(page, 'doc-uno');
    await setValue(page, 'valor D1');
    await expect(page.locator(FIELD)).toHaveText('valor D1');

    await switchDocument(page, 'doc-dos');
    await expect(page.locator(FIELD), 'D2 no puede heredar lo de D1').not.toHaveText('valor D1');

    await setValue(page, 'valor D2');
    await expect(page.locator(FIELD)).toHaveText('valor D2');

    await switchDocument(page, 'doc-uno');
    await expect(page.locator(FIELD)).toHaveText('valor D1');

    await switchDocument(page, 'doc-dos');
    await expect(page.locator(FIELD)).toHaveText('valor D2');
  });

  test('la matriz Usuario × Documento mantiene celdas independientes', async ({ page }) => {
    const matriz = [
      ['alice', 'doc-uno'],
      ['alice', 'doc-dos'],
      ['bob', 'doc-uno'],
      ['bob', 'doc-dos'],
    ] as const;

    for (const [userId, documentId] of matriz) {
      await switchUser(page, userId);
      await switchDocument(page, documentId);
      await setValue(page, `${userId}-${documentId}`);
    }

    for (const [userId, documentId] of matriz) {
      await switchUser(page, userId);
      await switchDocument(page, documentId);
      await expect(page.locator(FIELD), `celda ${userId}/${documentId}`).toHaveText(
        `${userId}-${documentId}`,
      );
    }
  });

  test('conmutar rápido entre documentos no pierde valores', async ({ page }) => {
    await switchDocument(page, 'doc-uno');
    await setValue(page, 'estable');

    for (let i = 0; i < 4; i += 1) {
      await documentSelect(page).selectOption('doc-dos');
      await documentSelect(page).selectOption('doc-uno');
    }
    await page.waitForTimeout(500);

    await expect(page.locator(FIELD)).toHaveText('estable');
  });
});

test.describe('interaction state observable', () => {
  test('un campo sin tocar no está touched ni dirty', async ({ page }) => {
    const estado = await readInteraction(page, 'text', [
      'data-touched',
      'data-dirty',
      'data-interaction-count',
    ]);
    expect(estado['data-touched']).toBe('false');
    expect(estado['data-dirty']).toBe('false');
    expect(estado['data-interaction-count']).toBe('0');
  });

  test('escribir marca touched y dirty en el modelo', async ({ page }) => {
    await setValue(page, 'algo nuevo');
    const estado = await readInteraction(page, 'text', ['data-touched', 'data-dirty']);
    expect(estado['data-touched']).toBe('true');
    expect(estado['data-dirty']).toBe('true');
  });

  test('volver al valor original deja dirty en false conservando touched', async ({ page }) => {
    const original = (await page.locator(FIELD).textContent()) ?? '';

    await setValue(page, 'modificado');
    expect((await readInteraction(page, 'text', ['data-dirty']))['data-dirty']).toBe('true');

    await setValue(page, original);
    const estado = await readInteraction(page, 'text', ['data-touched', 'data-dirty']);
    // El usuario SÍ interactuó, simplemente no dejó nada cambiado.
    expect(estado['data-touched']).toBe('true');
    expect(estado['data-dirty']).toBe('false');
  });

  test('cada edición incrementa el contador de interacciones', async ({ page }) => {
    await setValue(page, 'uno');
    await setValue(page, 'dos');
    const estado = await readInteraction(page, 'text', ['data-interaction-count']);
    expect(Number(estado['data-interaction-count'])).toBeGreaterThanOrEqual(2);
  });

  test('el panel expone estado para todos los schemas montados', async ({ page }) => {
    await page.getByTestId('-info-toggle').click();
    await expect(page.getByTestId('lab-interaction-list')).toHaveCount(1);
    const filas = page.locator('[data-testid^="lab-interaction-"][data-touched]');
    expect(await filas.count()).toBeGreaterThan(0);
  });
});

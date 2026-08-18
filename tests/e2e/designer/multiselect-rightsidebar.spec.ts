import { expect, test, type Locator, type Page } from '@playwright/test';
import { abrirDesigner } from '../../support/playwright';

/**
 * RightSidebar — multiselección por long-press sin redirigir a Detalle.
 *
 * Antes de este slice, ListView no tenía ninguna vía de "mantener pulsado
 * para entrar a multiselección": el único camino a selección múltiple era
 * modifier-click (Shift/Ctrl/Cmd), y CUALQUIER click que resolviera a una
 * única selección disparaba el salto automático a la pestaña Detalle, sin
 * distinguir "quiero elegir este campo" de "quiero verlo en detalle".
 *
 * El contrato que cierra esta spec:
 * - long-press entra a multiselección y alterna membresía SIN abrir Detalle;
 * - mientras el modo está activo, un click corto (sin modificador) también
 *   alterna, en vez de reemplazar la selección;
 * - Espacio reproduce el mismo efecto que long-press (equivalente de teclado);
 * - modifier-click y click corto fuera del modo conservan su comportamiento;
 * - movimiento por encima del umbral cancela el gesto y dnd-kit sigue
 *   pudiendo reordenar desde el grip;
 * - Canvas y ListView nunca contradicen la selección activa.
 */

const TAB_FIELDS = '#sisad-pdfme-right-sidebar-tab-fields';
const TAB_DETAIL = '#sisad-pdfme-right-sidebar-tab-detail';
const FIELD_LIST = '[data-testid="right-sidebar-field-list"]';
const SHELL = '[class*="list-view-sortable-shell"]';

const vigilarConsola = (page: Page) => {
  const criticos: string[] = [];
  page.on('console', (m) => {
    if (/Maximum update depth exceeded/i.test(m.text())) criticos.push(m.text());
  });
  page.on('pageerror', (e) => criticos.push(`pageerror: ${e.message}`));
  return criticos;
};

const filas = (page: Page): Locator => page.locator('[data-testid="right-sidebar-field-item"]');

/** Mantiene pulsado un punto el tiempo suficiente para disparar el long-press (500ms + margen). */
const mantenerPulsado = async (page: Page, fila: Locator, ms = 650): Promise<void> => {
  const box = await fila.boundingBox();
  expect(box, 'la fila debe tener geometría').not.toBeNull();
  if (!box) return;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.waitForTimeout(ms);
  await page.mouse.up();
};

/** Estado del modo multiselección publicado por el contenedor. */
const modoActivo = (page: Page): Promise<boolean> =>
  page.locator(SHELL).first().getAttribute('data-multi-select-mode').then((v) => v === 'true');

/**
 * Vuelve a la pestaña Campos.
 *
 * Comportamiento EXISTENTE, no tocado por este slice: un click corto que dejó
 * exactamente un campo seleccionado navega a Detalle y la lista deja de ser
 * visible. Un usuario real pulsa la pestaña Campos para volver antes de elegir
 * otro campo; los tests que encadenan clicks cortos hacen lo mismo.
 */
const volverACampos = async (page: Page): Promise<void> => {
  const tab = page.locator(TAB_FIELDS);
  if ((await tab.getAttribute('aria-selected')) === 'true') return;
  await tab.click();
  await expect(page.locator(FIELD_LIST)).toBeVisible();
};

test.beforeEach(async ({ page }) => {
  await abrirDesigner(page, '/designer/single-user');
  // El perfil `single-user` configura `sidebars.right.defaultPanel: 'detail'`
  // a propósito (host config, no relacionado con selección): el panel arranca
  // en Detalle sin que nada esté seleccionado. Es una decisión legítima de la
  // demo, pero para probar "el long-press NO navega a Detalle" primero hay que
  // partir de Campos, igual que haría un usuario real de esta ruta.
  await volverACampos(page);
  await expect(filas(page).first()).toBeVisible();
});

test.describe('entrada por long-press', () => {
  test('mantener pulsado entra a multiselección sin abrir Detalle', async ({ page }) => {
    const criticos = vigilarConsola(page);
    const primera = filas(page).first();

    await mantenerPulsado(page, primera);

    expect(await modoActivo(page), 'el long-press debe activar el modo').toBe(true);
    await expect(primera).toHaveAttribute('data-selected', 'true');
    // El panel sigue siendo Campos: no hubo redirección a Detalle.
    await expect(page.locator(FIELD_LIST)).toBeVisible();
    const tabDetail = page.locator(TAB_DETAIL);
    if (await tabDetail.count()) {
      await expect(tabDetail).toHaveAttribute('aria-selected', 'false');
    }
    expect(criticos).toEqual([]);
  });

  test('el equivalente de teclado (Espacio) produce el mismo efecto', async ({ page }) => {
    const primera = filas(page).first();
    // El foco real recae en el hit-target interno, no en el `<li>` contenedor.
    await primera.locator('[class*="list-view-item-hit-target"]').focus();
    await page.keyboard.press(' ');
    await page.waitForTimeout(150);

    expect(await modoActivo(page), 'Espacio debe activar multiselección igual que long-press').toBe(true);
    await expect(primera).toHaveAttribute('data-selected', 'true');
    await expect(page.locator(FIELD_LIST)).toBeVisible();
  });

  test('un movimiento por encima del umbral cancela el long-press', async ({ page }) => {
    const primera = filas(page).first();
    const box = await primera.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(120);
    // Movimiento amplio, muy por encima de la tolerancia de 6px.
    await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 + 40, { steps: 8 });
    await page.waitForTimeout(500);
    await page.mouse.up();
    await page.waitForTimeout(150);

    expect(await modoActivo(page), 'el movimiento debe cancelar el reconocimiento').toBe(false);
  });

  test('soltar antes del umbral se comporta como un click corto normal', async ({ page }) => {
    const primera = filas(page).first();
    const box = await primera.boundingBox();
    expect(box).not.toBeNull();
    if (!box) return;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(120);
    await page.mouse.up();
    await page.waitForTimeout(150);

    expect(await modoActivo(page)).toBe(false);
    await expect(primera).toHaveAttribute('data-selected', 'true');
    // Click corto fuera de multi mode SÍ conserva el salto a Detalle.
    const tabDetail = page.locator(TAB_DETAIL);
    if (await tabDetail.count()) {
      await expect(tabDetail).toHaveAttribute('aria-selected', 'true');
    }
  });
});

test.describe('mientras el modo está activo', () => {
  test('clicks cortos alternan membresía y permanecen en Campos', async ({ page }) => {
    const criticos = vigilarConsola(page);
    const filasLocator = filas(page);
    const primera = filasLocator.nth(0);
    const segunda = filasLocator.nth(1);
    const tercera = filasLocator.nth(2);

    await mantenerPulsado(page, primera);
    expect(await modoActivo(page)).toBe(true);

    await segunda.click();
    await tercera.click();
    await expect(primera).toHaveAttribute('data-selected', 'true');
    await expect(segunda).toHaveAttribute('data-selected', 'true');
    await expect(tercera).toHaveAttribute('data-selected', 'true');
    await expect(page.locator(FIELD_LIST)).toBeVisible();

    // Alternar: volver a pulsar la segunda la retira sin salir de Campos.
    await segunda.click();
    await expect(segunda).toHaveAttribute('data-selected', 'false');
    await expect(page.locator(FIELD_LIST)).toBeVisible();
    expect(criticos).toEqual([]);
  });

  test('reducir la selección a un único campo NO abre Detalle mientras el modo sigue activo', async ({ page }) => {
    const filasLocator = filas(page);
    const primera = filasLocator.nth(0);
    const segunda = filasLocator.nth(1);

    await mantenerPulsado(page, primera);
    await segunda.click();
    // Vuelve a quedar sólo `primera` seleccionada, pero el modo sigue activo.
    await segunda.click();

    expect(await modoActivo(page)).toBe(true);
    await expect(primera).toHaveAttribute('data-selected', 'true');
    await expect(page.locator(FIELD_LIST), 'un único seleccionado en multi mode no debe saltar a Detalle').toBeVisible();
  });

  test('Escape sale del modo sin vaciar la selección', async ({ page }) => {
    const primera = filas(page).first();
    await mantenerPulsado(page, primera);
    expect(await modoActivo(page)).toBe(true);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);

    expect(await modoActivo(page), 'Escape debe salir del modo').toBe(false);
    await expect(primera).toHaveAttribute('data-selected', 'true');
  });

  test('vaciar la selección por completo sale del modo automáticamente', async ({ page }) => {
    const primera = filas(page).first();
    await mantenerPulsado(page, primera);
    expect(await modoActivo(page)).toBe(true);

    // Alternar la misma fila la deselecciona: la selección queda vacía.
    await primera.click();
    await page.waitForTimeout(150);

    expect(await modoActivo(page), 'sin selección no tiene sentido seguir en multi mode').toBe(false);
    await expect(primera).toHaveAttribute('data-selected', 'false');
  });
});

test.describe('compatibilidad con lo existente', () => {
  test('modifier-click (Ctrl/Cmd) sigue multi-seleccionando fuera de multi mode', async ({ page }) => {
    const filasLocator = filas(page);
    const primera = filasLocator.nth(0);
    const segunda = filasLocator.nth(1);

    await primera.click();
    // Comportamiento existente sin tocar: seleccionar UN campo navega a
    // Detalle. Un usuario real vuelve a Campos antes de sumar el segundo con
    // Ctrl/Cmd; es el mismo regreso que hace un click normal encadenado.
    await volverACampos(page);
    await segunda.click({ modifiers: ['ControlOrMeta'] });

    await expect(primera).toHaveAttribute('data-selected', 'true');
    await expect(segunda).toHaveAttribute('data-selected', 'true');
  });

  test('click corto fuera de multi mode sigue reemplazando la selección', async ({ page }) => {
    const filasLocator = filas(page);
    const primera = filasLocator.nth(0);
    const segunda = filasLocator.nth(1);

    await primera.click();
    await volverACampos(page);
    await segunda.click();

    await expect(primera).toHaveAttribute('data-selected', 'false');
    await expect(segunda).toHaveAttribute('data-selected', 'true');
  });

  /**
   * El grip de reordenamiento no comparte elemento con el reconocedor de
   * long-press: éste sólo escucha en el hit-target de la fila (el `<button>`
   * que cubre toda la fila para click/selección), nunca en el grip. Esta
   * prueba verifica esa no-interferencia — que iniciar un arrastre desde el
   * grip no dispara el long-press ni entra a multiselección.
   *
   * No se afirma aquí que el arrastre COMPLETE un reordenamiento: seleccionar
   * el campo arrastrado dispara el mismo salto automático a Detalle que
   * cualquier click corto (`onDragStart` selecciona antes de mover), lo que
   * desmonta la lista a mitad de gesto. Es un comportamiento preexistente,
   * ajeno a las cuatro brechas de este prompt, y queda anotado como riesgo
   * residual en el cierre en vez de ocultarlo detrás de una aserción que no
   * podía fallar.
   */
  test('iniciar un arrastre desde el grip no activa el long-press', async ({ page }) => {
    const criticos = vigilarConsola(page);
    const filasLocator = filas(page);
    const grip = filasLocator.nth(0).locator('[aria-label="Reordenar campo"]');
    await expect(grip).toBeVisible();
    const gripBox = await grip.boundingBox();
    expect(gripBox).not.toBeNull();
    if (!gripBox) return;

    await page.mouse.move(gripBox.x + gripBox.width / 2, gripBox.y + gripBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(gripBox.x + 4, gripBox.y + 4, { steps: 3 });
    await page.mouse.move(gripBox.x + 4, gripBox.y + 60, { steps: 8 });
    await page.waitForTimeout(650);
    expect(await modoActivo(page), 'el grip no debe disparar el reconocedor de long-press').toBe(false);
    await page.mouse.up();
    expect(criticos).toEqual([]);
  });
});

test.describe('sincronía Canvas ↔ ListView', () => {
  test('la selección por long-press en ListView se refleja en el canvas', async ({ page }) => {
    const primera = filas(page).first();
    const schemaType = await primera.getAttribute('data-schema-type');
    await mantenerPulsado(page, primera);

    const activosEnCanvas = page.locator(`[data-canvas-page="true"] [data-schema-active="true"][data-schema-type="${schemaType}"]`);
    await expect(activosEnCanvas.first()).toBeVisible();
  });
});

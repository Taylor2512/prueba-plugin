import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Interacciones de usuario compartidas por los E2E.
 *
 * Todo lo que hay aquí reproduce un gesto real: ratón, teclado sobre el
 * locator, o control nativo. No hay `page.evaluate` que escriba en el DOM ni
 * `waitForTimeout`: un test que fabrica su propio éxito no prueba nada.
 */

/** Quita el foco pinchando en una zona neutra, como haría un usuario. */
export const desenfocar = (page: Page): Promise<void> =>
  page.locator('body').click({ position: { x: 5, y: 5 } });

/**
 * Resuelve el nodo realmente editable.
 *
 * Los specs pasan indistintamente el campo (`#text-text-0`) o el envoltorio del
 * schema (`[data-schema-type="text"][data-schema-id]`). Resolver aquí evita que
 * cada spec repita el descenso al hijo editable — y que uno se equivoque.
 */
export async function campoEditable(locator: Locator): Promise<Locator> {
  const interno = locator
    .locator('input, textarea, [contenteditable="true"], [contenteditable="plaintext-only"]')
    .first();
  return (await interno.count()) ? interno : locator;
}

/**
 * Reemplaza el contenido de un campo del Form.
 *
 * Los campos del runtime son `contenteditable`, así que se selecciona todo y
 * se borra antes de teclear: `fill()` sobre contenteditable no dispara el
 * guard de `beforeinput` que aplica el schema `number`, de modo que el filtro
 * de entrada quedaría sin ejercitar.
 */
export async function escribirCampo(locator: Locator, valor: string): Promise<void> {
  const campo = await campoEditable(locator);
  await expect(campo).toBeVisible();
  await campo.click();
  await campo.press('ControlOrMeta+a');
  await campo.press('Delete');
  if (valor !== '') await campo.pressSequentially(valor);
}

/** Escribe y confirma el valor saliendo del campo. */
export async function fijarCampo(page: Page, campo: Locator, valor: string): Promise<void> {
  await escribirCampo(campo, valor);
  await desenfocar(page);
}

/** Lee el valor visible de un campo, sea contenteditable o control nativo. */
export async function leerCampo(locator: Locator): Promise<string> {
  const editable = locator.locator('input, textarea, select, [contenteditable="true"]').first();
  if (await editable.count()) {
    const tag = await editable.evaluate((el) => el.tagName.toLowerCase());
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return editable.inputValue();
    return (await editable.textContent()) ?? '';
  }
  return (await locator.textContent()) ?? '';
}

/**
 * Arrastra con ratón real desde el centro del origen hasta el destino.
 *
 * El primer micro-movimiento después de `mouse.down()` es obligatorio: sin él
 * dnd-kit no considera iniciado el gesto y el drop se pierde.
 */
export async function arrastrarAlCentro(
  page: Page,
  origen: Locator,
  destino: Locator,
  offsetX = 0,
  offsetY = 0,
): Promise<void> {
  await origen.scrollIntoViewIfNeeded();
  await destino.scrollIntoViewIfNeeded();
  const from = await origen.boundingBox();
  const to = await destino.boundingBox();
  expect(from, 'El origen debe tener geometría').not.toBeNull();
  expect(to, 'El destino debe tener geometría').not.toBeNull();
  if (!from || !to) return;

  const sx = from.x + from.width / 2;
  const sy = from.y + from.height / 2;
  const tx = to.x + Math.max(24, Math.min(to.width - 24, to.width / 2 + offsetX));
  const ty = to.y + Math.max(24, Math.min(to.height - 24, to.height / 2 + offsetY));

  await page.mouse.move(sx, sy);
  await page.mouse.down();
  await page.mouse.move(sx + 8, sy + 8, { steps: 3 });
  await page.mouse.move(tx, ty, { steps: 16 });
  await page.mouse.up();
}

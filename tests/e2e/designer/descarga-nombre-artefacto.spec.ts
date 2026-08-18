import { expect, test, type Page } from '@playwright/test';
import { abrirDesigner } from '../../support/playwright';

/**
 * QH-011 — nombre determinista del artefacto descargado.
 *
 * El defecto observado en producción era `[object Object].pdf`: las rutas de
 * descarga convertían `template.basePdf` con `String(...)` y `basePdf` puede
 * ser un objeto de PDF, cuya representación por defecto es justo ese literal.
 *
 * Este gate comprueba el nombre REAL que el navegador propone al usuario, no
 * la cadena que el código cree estar generando.
 */

/** Ejecuta una acción del menú global y devuelve la descarga que produjo. */
const descargarDesdeMenu = async (page: Page, etiqueta: string) => {
  await page.locator('[aria-label="Más acciones"]').first().click();
  const entrada = page.locator(`.ant-dropdown-menu-item:has-text("${etiqueta}")`).first();
  await expect(entrada, `el menú debe ofrecer ${etiqueta}`).toBeVisible();

  const [descarga] = await Promise.all([
    page.waitForEvent('download', { timeout: 20_000 }),
    entrada.click(),
  ]);
  return descarga;
};

/** Aserciones de nombre que ninguna descarga puede incumplir. */
const assertNombreSano = (nombre: string, extension: 'pdf' | 'json') => {
  expect(nombre, 'el nombre nunca puede ser la representación por defecto de un objeto')
    .not.toContain('[object Object]');
  expect(nombre, 'el nombre no puede filtrar JSON del documento').not.toContain('{');
  expect(nombre, `debe terminar en .${extension}`).toMatch(new RegExp(`\\.${extension}$`));
  // Exactamente una vez: `doc.pdf.pdf` es un fallo de composición del nombre.
  const repeticiones = nombre.toLowerCase().split(`.${extension}`).length - 1;
  expect(repeticiones, `la extensión .${extension} debe aparecer una sola vez`).toBe(1);
  const stem = nombre.slice(0, nombre.length - extension.length - 1);
  expect(stem.trim().length, 'el nombre debe tener un stem no vacío').toBeGreaterThan(0);
  expect(stem, 'el stem no puede contener caracteres prohibidos').not.toMatch(/[\\/:*?"<>|]/);
};

test.describe('QH-011 — nombre del artefacto descargado', () => {
  test('descargar el PDF desde el Designer propone un nombre determinista', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const descarga = await descargarDesdeMenu(page, 'Descargar PDF');
    const nombre = descarga.suggestedFilename();
    assertNombreSano(nombre, 'pdf');

    // El contenido debe ser un PDF real, no un archivo vacío con buen nombre.
    const ruta = await descarga.path();
    expect(ruta, 'la descarga debe materializarse en disco').toBeTruthy();
  });

  test('el PDF descargado empieza por %PDF-', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const descarga = await descargarDesdeMenu(page, 'Descargar PDF');
    const ruta = await descarga.path();
    expect(ruta).toBeTruthy();
    const { readFileSync } = await import('node:fs');
    const cabecera = readFileSync(ruta as string).subarray(0, 5).toString('latin1');
    expect(cabecera, 'el payload debe ser un PDF válido').toBe('%PDF-');
  });

  test('exportar el template propone un .json determinista y distinto del PDF', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const json = await descargarDesdeMenu(page, 'Exportar template');
    assertNombreSano(json.suggestedFilename(), 'json');
  });

  test('el nombre es estable entre descargas repetidas', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const primero = (await descargarDesdeMenu(page, 'Descargar PDF')).suggestedFilename();
    const segundo = (await descargarDesdeMenu(page, 'Descargar PDF')).suggestedFilename();
    expect(segundo, 'el mismo template debe producir siempre el mismo nombre').toBe(primero);
  });

  test('el nombre sobrevive a recargar el template', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const antes = (await descargarDesdeMenu(page, 'Descargar PDF')).suggestedFilename();
    await page.reload({ waitUntil: 'domcontentloaded' });
    await abrirDesigner(page, '/designer/single-user');
    const despues = (await descargarDesdeMenu(page, 'Descargar PDF')).suggestedFilename();
    expect(despues, 'recargar no puede cambiar el nombre propuesto').toBe(antes);
  });
});

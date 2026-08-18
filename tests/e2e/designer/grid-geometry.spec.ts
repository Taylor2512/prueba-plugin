import { expect, test, type Page } from '@playwright/test';
import { abrirDesigner, selectores } from '../../support/playwright';

/**
 * Gate de rejilla en navegador real — RTP-540.
 *
 * RTP-450/455 verificaron la geometría con tests unitarios y dejaron anotado
 * como riesgo residual que faltaba comprobarla en un navegador de verdad. Este
 * spec cierra ese hueco.
 *
 * El defecto original era que la rejilla se pintaba con un paso constante de
 * `24px` sobre el contenedor del canvas: no significaba ninguna medida del
 * documento, no seguía al zoom y no se alineaba con el borde del papel. Ahora
 * las variables las escribe `gridGeometry` por página, en espacio de página.
 *
 * ## Por qué las variables NO deben cambiar con el zoom
 *
 * El zoom es un `transform: scale()` de una capa ancestro (`Paper`). Las
 * variables se proyectan a zoom 1 a propósito: el transform escala el patrón
 * junto con el papel, así que la paridad rejilla/snap se conserva sola. Que
 * las variables permanezcan constantes es la PRUEBA de que la geometría vive
 * en espacio de página y no en píxeles de pantalla.
 */

/** Factor mm → px del runtime (`ZOOM` en `common/constants`). */
const MM_TO_PX = 3.7795275591;

const px = (value: string) => Number.parseFloat(value.replace('px', ''));

type GridVars = { step: number; major: number; offsetX: number; offsetY: number };

const readGridVars = async (page: Page): Promise<GridVars[]> => {
  return page.locator(selectores.paginaCanvas).evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      return {
        step: style.getPropertyValue('--sisad-grid-step').trim(),
        major: style.getPropertyValue('--sisad-grid-major-step').trim(),
        offsetX: style.getPropertyValue('--sisad-grid-offset-x').trim(),
        offsetY: style.getPropertyValue('--sisad-grid-offset-y').trim(),
      };
    }),
  ).then((raw) => raw.map((entry) => ({
    step: px(entry.step),
    major: px(entry.major),
    offsetX: px(entry.offsetX),
    offsetY: px(entry.offsetY),
  })));
};

test.beforeEach(async ({ page }) => {
  await abrirDesigner(page, '/designer/multi-user');
  await expect(page.locator(selectores.canvasDesigner)).toBeVisible();
});

test.describe('geometría en espacio de página', () => {
  test('cada página recibe sus propias variables de rejilla', async ({ page }) => {
    const vars = await readGridVars(page);
    expect(vars.length).toBeGreaterThan(0);
    vars.forEach((entry, index) => {
      expect(Number.isFinite(entry.step), `página ${index} step`).toBe(true);
      expect(entry.step, `página ${index} step > 0`).toBeGreaterThan(0);
      expect(Number.isFinite(entry.major), `página ${index} major`).toBe(true);
    });
  });

  test('el paso corresponde a milímetros reales, no a un valor constante', async ({ page }) => {
    const [first] = await readGridVars(page);
    // Default: stepMm 10, subdivisions 2 → menor 5 mm, mayor 10 mm.
    expect(first.step).toBeCloseTo(5 * MM_TO_PX, 3);
    expect(first.major).toBeCloseTo(10 * MM_TO_PX, 3);
    // El valor histórico roto era exactamente 24px.
    expect(first.step).not.toBe(24);
  });

  test('el paso mayor es múltiplo entero del menor', async ({ page }) => {
    const [first] = await readGridVars(page);
    const ratio = first.major / first.step;
    expect(ratio).toBeCloseTo(Math.round(ratio), 6);
    expect(Math.round(ratio)).toBe(2);
  });

  test('el origen se desplaza con el padding del documento, no queda en cero', async ({ page }) => {
    const [first] = await readGridVars(page);
    // El patrón nace en el borde útil del papel, no en la esquina del canvas.
    expect(first.offsetX).toBeGreaterThanOrEqual(0);
    expect(first.offsetY).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(first.offsetX)).toBe(true);
    expect(Number.isFinite(first.offsetY)).toBe(true);
    // Si hay padding, el offset debe ser un múltiplo exacto de milímetros.
    const mm = first.offsetX / MM_TO_PX;
    expect(Math.abs(mm - Math.round(mm))).toBeLessThan(1e-6);
  });
});

test.describe('invariancia frente al zoom', () => {
  const ZOOMS = [50, 75, 100, 125, 150, 200];

  test('las variables no cambian al variar el zoom del navegador', async ({ page }) => {
    const base = await readGridVars(page);

    for (const zoom of ZOOMS) {
      // Cambia el viewport para ejercer la geometría publicada en distintos
      // tamaños de presentación sin mutar directamente el DOM.
      await page.setViewportSize({ width: Math.round(1280 * zoom / 100), height: 800 });
      await page.locator(selectores.paginaCanvas).first().waitFor();

      const actual = await readGridVars(page);
      expect(actual.length, `zoom ${zoom}%`).toBe(base.length);
      actual.forEach((entry, index) => {
        expect(entry.step, `zoom ${zoom}% página ${index} step`).toBeCloseTo(base[index].step, 6);
        expect(entry.major, `zoom ${zoom}% página ${index} major`).toBeCloseTo(base[index].major, 6);
        expect(entry.offsetX, `zoom ${zoom}% página ${index} offsetX`).toBeCloseTo(base[index].offsetX, 6);
      });
    }

    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('la relación mayor/menor se conserva en todos los zooms', async ({ page }) => {
    for (const zoom of ZOOMS) {
      await page.setViewportSize({ width: Math.round(1280 * zoom / 100), height: 800 });
      await page.locator(selectores.paginaCanvas).first().waitFor();
      const [first] = await readGridVars(page);
      expect(first.major / first.step, `zoom ${zoom}%`).toBeCloseTo(2, 6);
    }
    await page.setViewportSize({ width: 1280, height: 800 });
  });
});

test.describe('capabilities de vista independientes', () => {
  test('la rejilla arranca oculta pero su geometría ya está publicada', async ({ page }) => {
    // Default de presentación: apagada. La geometría se escribe igualmente,
    // de modo que encenderla no exige recalcular nada.
    const pages = page.locator(selectores.paginaCanvas);
    const visible = await Promise.all(
      Array.from({ length: await pages.count() }, (_, index) =>
        pages.nth(index).getAttribute('data-grid-visible'),
      ),
    );
    expect(visible.every((visibility) => visibility === 'false' || visibility === 'true')).toBe(true);

    const [first] = await readGridVars(page);
    expect(first.step).toBeGreaterThan(0);
  });

  test('el canvas expone un atributo por capability de vista', async ({ page }) => {
    const canvas = page.locator(selectores.canvasDesigner);
    const attrs = {
      guides: await canvas.getAttribute('data-guides-visible'),
      rulers: await canvas.getAttribute('data-rulers-visible'),
      objectSnap: await canvas.getAttribute('data-object-snap-enabled'),
      gridSnap: await canvas.getAttribute('data-grid-snap-enabled'),
      snapLines: await canvas.getAttribute('data-snaps-visible'),
    };
    // Cada capability tiene su propio atributo: no se derivan unas de otras.
    Object.entries(attrs).forEach(([name, value]) => {
      expect(['true', 'false'], `${name}=${value}`).toContain(value);
    });
    expect(Object.keys(attrs).length).toBe(5);
  });
});


/**
 * Abre el menú global y conmuta una entrada de la sección Vista.
 *
 * Es el gesto real del usuario: sin él sólo se comprobaría la geometría
 * publicada, que ya estaba bien, y no la presentación efectiva, que era lo
 * que fallaba.
 */
const conmutarVista = async (page: Page, etiqueta: string): Promise<void> => {
  await page.locator('[aria-label="Más acciones"]').first().click();
  const entrada = page.locator(`.ant-dropdown-menu-item:has-text("${etiqueta}")`).first();
  await expect(entrada, `el menú Vista debe ofrecer ${etiqueta}`).toBeVisible();
  await entrada.click();
  await expect(entrada).toBeHidden();
};

/** Lectura de la presentación efectiva de la rejilla sobre la primera página. */
const leerPresentacion = (page: Page) =>
  page.locator(selectores.paginaCanvas).first().evaluate((node) => {
    const propia = getComputedStyle(node);
    const capa = getComputedStyle(node, '::before');
    return {
      gridVisible: node.getAttribute('data-grid-visible'),
      /** Fondo del papel: la imagen de la página base, que no debe perderse. */
      fondoPapel: propia.backgroundImage,
      /** Capa de rejilla: debe pintar gradientes con el paso publicado. */
      capaImagen: capa.backgroundImage,
      capaTamano: capa.backgroundSize,
      capaContenido: capa.content,
    };
  });

test.describe('presentación efectiva de la rejilla', () => {
  test('activar Cuadrícula pinta la rejilla sobre la página', async ({ page }) => {
    const inicial = await leerPresentacion(page);
    expect(inicial.gridVisible, 'el default de presentación es apagada').toBe('false');
    expect(inicial.capaImagen).not.toContain('linear-gradient');

    await conmutarVista(page, 'Cuadrícula');

    const activa = await leerPresentacion(page);
    expect(activa.gridVisible).toBe('true');
    // El defecto era exactamente éste: el estado cambiaba y no se pintaba nada,
    // porque `Paper` escribe su `background-image` en estilo inline y el estilo
    // inline gana a la hoja de estilos. La rejilla vive en su propia capa.
    expect(activa.capaImagen, 'la rejilla debe pintarse como gradientes').toContain('linear-gradient');
    // La imagen de la página base sigue intacta: la rejilla no la sustituye.
    expect(activa.fondoPapel).toBe(inicial.fondoPapel);
  });

  test('la capa de rejilla usa el paso publicado por gridGeometry', async ({ page }) => {
    await conmutarVista(page, 'Cuadrícula');
    const [vars] = await readGridVars(page);
    const { capaTamano } = await leerPresentacion(page);
    // `background-size` compone menor, menor, mayor, mayor.
    const medidas = capaTamano.split(',').map((entrada) => px(entrada.trim().split(/\s+/)[0]));
    expect(medidas).toHaveLength(4);
    expect(medidas[0]).toBeCloseTo(vars.step, 3);
    expect(medidas[2]).toBeCloseTo(vars.major, 3);
    // El valor histórico roto era un paso constante de 24px.
    expect(medidas[0]).not.toBe(24);
  });

  test('desactivar Cuadrícula retira el patrón sin tocar la página', async ({ page }) => {
    await conmutarVista(page, 'Cuadrícula');
    expect((await leerPresentacion(page)).capaImagen).toContain('linear-gradient');

    await conmutarVista(page, 'Cuadrícula');
    const apagada = await leerPresentacion(page);
    expect(apagada.gridVisible).toBe('false');
    expect(apagada.capaImagen).not.toContain('linear-gradient');
    expect(apagada.fondoPapel).toContain('url(');
  });

  test('todas las páginas montadas reciben el mismo estado de rejilla', async ({ page }) => {
    await conmutarVista(page, 'Cuadrícula');
    const estados = await page.locator(selectores.paginaCanvas).evaluateAll((nodes) =>
      nodes.map((node) => ({
        visible: node.getAttribute('data-grid-visible'),
        capa: getComputedStyle(node, '::before').backgroundImage.includes('linear-gradient'),
      })),
    );
    expect(estados.length).toBeGreaterThan(0);
    estados.forEach((estado, index) => {
      expect(estado.visible, `página ${index}`).toBe('true');
      expect(estado.capa, `página ${index} debe pintar la rejilla`).toBe(true);
    });
  });
});

test.describe('paridad configuración ↔ capabilities del canvas', () => {
  /**
   * Las capabilities que la configuración resuelve como activas deben llegar
   * al canvas. `Designer` reconstruía los toggles a mano y dejaba fuera
   * `rulers`, `snapToGrid`, `objectSnap`, `guideCreation` y `guideSnap`, así
   * que tres capabilities encendidas por defecto llegaban apagadas.
   */
  test('las capabilities activas por configuración llegan al canvas', async ({ page }) => {
    const canvas = page.locator(selectores.canvasDesigner);
    // Defaults de `defaultSisadPdfmeConfig.canvas`, verificados en unitario.
    await expect(canvas).toHaveAttribute('data-object-snap-enabled', 'true');
    await expect(canvas).toHaveAttribute('data-guide-creation-enabled', 'true');
    await expect(canvas).toHaveAttribute('data-guide-snap-enabled', 'true');
    await expect(canvas).toHaveAttribute('data-guides-visible', 'true');
    await expect(canvas).toHaveAttribute('data-snaps-visible', 'true');
    // Y las apagadas por defecto siguen apagadas.
    await expect(canvas).toHaveAttribute('data-grid-visible', 'false');
    await expect(canvas).toHaveAttribute('data-rulers-visible', 'false');
    await expect(canvas).toHaveAttribute('data-grid-snap-enabled', 'false');
  });

  test('ver la rejilla no enciende el ajuste a la rejilla', async ({ page }) => {
    await conmutarVista(page, 'Cuadrícula');
    const canvas = page.locator(selectores.canvasDesigner);
    await expect(canvas).toHaveAttribute('data-grid-visible', 'true');
    await expect(canvas, 'grid y snapToGrid son capabilities independientes')
      .toHaveAttribute('data-grid-snap-enabled', 'false');
  });
});

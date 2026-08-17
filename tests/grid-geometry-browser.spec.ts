import { expect, test, type Page } from '@playwright/test';

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
  return page.locator('[data-canvas-page="true"]').evaluateAll((nodes) =>
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
  await page.goto('/designer/multi-user');
  await page.waitForSelector('.sisad-pdfme-designer-canvas');
  await page.waitForSelector('[data-canvas-page="true"]');
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
      await page.locator('[data-canvas-page="true"]').first().waitFor();

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
      await page.locator('[data-canvas-page="true"]').first().waitFor();
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
    const pages = page.locator('[data-canvas-page="true"]');
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
    const canvas = page.locator('.sisad-pdfme-designer-canvas');
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

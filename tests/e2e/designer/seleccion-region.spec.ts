import { expect, test, type Page } from '@playwright/test';
import { abrirDesigner, selectores } from '../../support/playwright';

/**
 * Selección por región: el área dibujada y el área que selecciona son la misma.
 *
 * El defecto original vivía en el espacio de coordenadas del marquee. Canvas
 * entregaba a Selecto el propio contenedor de scroll como `rootContainer`, y
 * en ese modo Selecto posiciona el rectángulo con `position: absolute` y una
 * traslación calculada en coordenadas de viewport. Un contenedor con scroll
 * resuelve `absolute` contra su contenido desplazado, así que el rectángulo se
 * dibujaba desplazado exactamente el `scrollTop` del canvas mientras el
 * hit-test —que usa `getBoundingClientRect`— seguía en viewport. Con el canvas
 * desplazado 300 px, el usuario veía el rectángulo 300 px por encima de donde
 * estaba arrastrando.
 *
 * El contrato que fija esta spec: marquee y hit-test comparten el espacio de
 * viewport, en cualquier zoom y con cualquier scroll.
 */

/** Desviación máxima admitida entre el rectángulo del puntero y el dibujado. */
const TOLERANCIA_PX = 4;

type Rect = { x: number; y: number; w: number; h: number };

const vigilarConsola = (page: Page) => {
  const criticos: string[] = [];
  page.on('console', (mensaje) => {
    if (/Maximum update depth exceeded/i.test(mensaje.text())) criticos.push(mensaje.text());
  });
  page.on('pageerror', (error) => criticos.push(`pageerror: ${error.message}`));
  return criticos;
};

const fijarZoom = async (page: Page, porcentaje: number): Promise<void> => {
  await page.locator('[data-testid="designer-zoom-select"]').first().click();
  const opcion = page.locator(`.ant-select-item-option:has-text("${porcentaje}%")`).first();
  await expect(opcion, `el selector debe ofrecer ${porcentaje}%`).toBeVisible();
  await opcion.click();
  await expect(page.locator('.ant-select-dropdown')).toBeHidden();
};

/** Desplaza el canvas como haría la rueda del ratón, y devuelve el scroll real. */
const desplazarCanvas = async (page: Page, left: number, top: number) =>
  page.locator(selectores.canvasDesigner).evaluate((root, destino) => {
    root.scrollLeft = destino.left;
    root.scrollTop = destino.top;
    return { left: root.scrollLeft, top: root.scrollTop };
  }, { left, top });

/**
 * Zona útil para arrastrar: intersección entre el papel y el área visible del
 * canvas. Arrastrar fuera del papel no inicia región —es el contrato— así que
 * partir de ahí mediría otra cosa.
 */
const zonaUtil = (page: Page) =>
  page.evaluate((sel) => {
    const root = document.querySelector(sel.canvas) as HTMLElement;
    const paper = document.querySelector(sel.pagina) as HTMLElement;
    const rootRect = root.getBoundingClientRect();
    const paperRect = paper.getBoundingClientRect();
    return {
      left: Math.max(rootRect.left, paperRect.left),
      top: Math.max(rootRect.top, paperRect.top),
      right: Math.min(rootRect.right, paperRect.right),
      bottom: Math.min(rootRect.bottom, paperRect.bottom),
    };
  }, { canvas: selectores.canvasDesigner, pagina: selectores.paginaCanvas });

/**
 * Busca una región cuyas DOS esquinas caigan sobre papel vacío.
 *
 * El contrato del canvas es que una región sólo nace sobre el papel y fuera de
 * un schema (`selectFromInside={false}` + `preventDragFromInside`). Empezar el
 * gesto encima de un campo arrastra ese campo, que es otra interacción: si el
 * test lo hiciera, mediría Moveable y no la selección por región. A zooms bajos
 * los campos se juntan, así que las esquinas se calculan en vez de fijarse.
 */
const regionConEsquinasVacias = async (
  page: Page,
  zona: { left: number; top: number; right: number; bottom: number },
): Promise<{ desde: { x: number; y: number }; hasta: { x: number; y: number } }> => {
  const region = await page.evaluate((area) => {
    const schemas = Array.from(
      document.querySelectorAll('[data-canvas-page="true"] [data-schema-id]'),
    ) as HTMLElement[];
    const rects = schemas.map((nodo) => nodo.getBoundingClientRect());
    const libre = (x: number, y: number) =>
      !rects.some((rect) => x >= rect.left - 2 && x <= rect.right + 2 && y >= rect.top - 2 && y <= rect.bottom + 2);

    const paso = 6;
    const buscar = (
      desdeX: number, hastaX: number,
      desdeY: number, hastaY: number,
    ): { x: number; y: number } | null => {
      const signoX = hastaX >= desdeX ? paso : -paso;
      const signoY = hastaY >= desdeY ? paso : -paso;
      for (let y = desdeY; signoY > 0 ? y <= hastaY : y >= hastaY; y += signoY) {
        for (let x = desdeX; signoX > 0 ? x <= hastaX : x >= hastaX; x += signoX) {
          if (libre(x, y)) return { x, y };
        }
      }
      return null;
    };

    const anchoUtil = area.right - area.left;
    const altoUtil = area.bottom - area.top;
    const inicio = buscar(area.left + 4, area.left + anchoUtil * 0.35, area.top + 4, area.top + altoUtil * 0.35);
    const fin = buscar(area.right - 4, area.left + anchoUtil * 0.55, area.bottom - 4, area.top + altoUtil * 0.55);
    return inicio && fin ? { desde: inicio, hasta: fin } : null;
  }, zona);

  expect(region, 'debe existir una región con ambas esquinas sobre papel vacío').not.toBeNull();
  return region as { desde: { x: number; y: number }; hasta: { x: number; y: number } };
};

/**
 * Arrastra una región y devuelve el rectángulo del puntero, el rectángulo
 * dibujado por Selecto y la selección resultante.
 */
const arrastrarRegion = async (
  page: Page,
  desde: { x: number; y: number },
  hasta: { x: number; y: number },
): Promise<{ puntero: Rect; marquee: Rect | null; seleccion: string[]; esperado: string[] }> => {
  await page.mouse.move(desde.x, desde.y);
  await page.mouse.down();
  await page.mouse.move(desde.x + 6, desde.y + 6, { steps: 3 });
  await page.mouse.move(hasta.x, hasta.y, { steps: 16 });

  const marquee = await page.evaluate(() => {
    const nodo = document.querySelector('.selecto-selection') as HTMLElement | null;
    if (!nodo) return null;
    const rect = nodo.getBoundingClientRect();
    return { x: rect.x, y: rect.y, w: rect.width, h: rect.height };
  });

  await page.mouse.up();

  const region = {
    x1: Math.min(desde.x, hasta.x),
    y1: Math.min(desde.y, hasta.y),
    x2: Math.max(desde.x, hasta.x),
    y2: Math.max(desde.y, hasta.y),
  };

  const { seleccion, esperado } = await page.evaluate((datos) => {
    const activos = Array.from(
      document.querySelectorAll('[data-schema-active="true"]'),
    ) as HTMLElement[];
    const todos = Array.from(
      document.querySelectorAll('[data-canvas-page="true"] [data-schema-id]'),
    ) as HTMLElement[];
    // Sólo los CONTENIDOS por completo en la región: los que la cruzan por el
    // borde dependen de un píxel y harían inestable la comparación sin probar
    // nada sobre el espacio de coordenadas, que es lo que aquí se mide.
    const contenidos = todos.filter((nodo) => {
      const rect = nodo.getBoundingClientRect();
      return (
        rect.left >= datos.x1 && rect.right <= datos.x2 &&
        rect.top >= datos.y1 && rect.bottom <= datos.y2
      );
    });
    return {
      seleccion: activos.map((nodo) => nodo.id).sort(),
      esperado: contenidos.map((nodo) => nodo.id).sort(),
    };
  }, region);

  return {
    puntero: { x: region.x1, y: region.y1, w: region.x2 - region.x1, h: region.y2 - region.y1 },
    marquee,
    seleccion,
    esperado,
  };
};

const esperarMarqueeAlineado = (marquee: Rect | null, puntero: Rect, contexto: string) => {
  expect(marquee, `${contexto}: debe dibujarse un rectángulo de selección`).not.toBeNull();
  if (!marquee) return;
  expect(Math.abs(marquee.x - puntero.x), `${contexto}: desvío en X`).toBeLessThanOrEqual(TOLERANCIA_PX);
  expect(Math.abs(marquee.y - puntero.y), `${contexto}: desvío en Y`).toBeLessThanOrEqual(TOLERANCIA_PX);
  expect(Math.abs(marquee.w - puntero.w), `${contexto}: desvío en ancho`).toBeLessThanOrEqual(TOLERANCIA_PX);
  expect(Math.abs(marquee.h - puntero.h), `${contexto}: desvío en alto`).toBeLessThanOrEqual(TOLERANCIA_PX);
};

test.beforeEach(async ({ page }) => {
  await abrirDesigner(page, '/designer/single-user');
  await expect(page.locator(selectores.canvasDesigner)).toBeVisible();
});

test.describe('paridad entre el área dibujada y el área seleccionada', () => {
  for (const zoom of [50, 75, 100, 125, 150, 200]) {
    test(`al ${zoom}% el rectángulo dibujado coincide con el arrastrado`, async ({ page }) => {
      const criticos = vigilarConsola(page);
      await fijarZoom(page, zoom);

      const zona = await zonaUtil(page);
      const { desde, hasta } = await regionConEsquinasVacias(page, zona);

      const { puntero, marquee, seleccion, esperado } = await arrastrarRegion(page, desde, hasta);
      esperarMarqueeAlineado(marquee, puntero, `zoom ${zoom}%`);
      expect(seleccion, `zoom ${zoom}%: la selección debe contener lo que la región cubre`)
        .toEqual(expect.arrayContaining(esperado));
      expect(criticos).toEqual([]);
    });
  }
});

test.describe('el scroll del canvas no desplaza el rectángulo', () => {
  for (const desplazamiento of [{ left: 0, top: 300 }, { left: 0, top: 600 }, { left: 150, top: 300 }]) {
    const etiqueta = `scroll(${desplazamiento.left}, ${desplazamiento.top})`;
    test(`${etiqueta} mantiene marquee y selección en el mismo espacio`, async ({ page }) => {
      const criticos = vigilarConsola(page);
      // Se necesita un zoom que haga desbordar el canvas para poder desplazarlo.
      await fijarZoom(page, 200);
      const real = await desplazarCanvas(page, desplazamiento.left, desplazamiento.top);
      expect(real.top, `${etiqueta}: el canvas debe poder desplazarse`).toBeGreaterThan(0);

      const zona = await zonaUtil(page);
      const { desde, hasta } = await regionConEsquinasVacias(page, zona);

      const { puntero, marquee, seleccion, esperado } = await arrastrarRegion(page, desde, hasta);
      esperarMarqueeAlineado(marquee, puntero, etiqueta);
      expect(seleccion, `${etiqueta}: la selección debe contener lo que la región cubre`)
        .toEqual(expect.arrayContaining(esperado));
      expect(criticos).toEqual([]);
    });
  }
});

test.describe('alcance de la región', () => {
  test('arrastrar en sentido inverso selecciona el mismo conjunto', async ({ page }) => {
    await fijarZoom(page, 100);
    const zona = await zonaUtil(page);
    const { desde: esquinaA, hasta: esquinaB } = await regionConEsquinasVacias(page, zona);

    const directo = await arrastrarRegion(page, esquinaA, esquinaB);
    esperarMarqueeAlineado(directo.marquee, directo.puntero, 'arrastre directo');

    // Vaciar la selección con un clic sobre papel vacío, como haría un usuario.
    await page.mouse.click(esquinaA.x, esquinaA.y);
    await expect(page.locator('[data-schema-active="true"]')).toHaveCount(0);

    const inverso = await arrastrarRegion(page, esquinaB, esquinaA);
    esperarMarqueeAlineado(inverso.marquee, inverso.puntero, 'arrastre inverso');

    expect(inverso.seleccion, 'el sentido del gesto no puede cambiar el resultado')
      .toEqual(directo.seleccion);
  });

  test('la región no captura opciones internas de un grupo como schemas', async ({ page }) => {
    await fijarZoom(page, 100);
    const zona = await zonaUtil(page);
    const { desde, hasta } = await regionConEsquinasVacias(page, zona);
    const { seleccion } = await arrastrarRegion(page, desde, hasta);
    // Cada id seleccionado tiene que ser un schema real del canvas.
    for (const id of seleccion) {
      const nodo = page.locator(`[data-schema-id="${id}"]`);
      await expect(nodo, `${id} debe ser un schema del canvas`).toHaveCount(1);
    }
    const opciones = await page.locator('[data-option-id][data-schema-active="true"]').count();
    expect(opciones, 'las opciones de un grupo no son schemas seleccionables').toBe(0);
  });
});

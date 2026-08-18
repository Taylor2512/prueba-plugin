import { expect, test, type Page } from '@playwright/test';
import { abrirDesigner, arrastrarAlCentro, paginaCanvas } from '../../support/playwright';

/**
 * Controles del catálogo: una sola fila, sin perder funciones.
 *
 * El bloque `Todos / Favoritos / Recientes` + los tres modos de visualización
 * se repartían en una fila que envolvía: con el panel a su ancho habitual
 * (~168 px) ocupaba 104 px en tres líneas, y el catálogo no empezaba hasta
 * 295 px por debajo del borde del panel. Este gate fija que los controles
 * quepan en una línea y que todo lo que hacían siga alcanzable.
 */

const SIDEBAR = '[data-testid="left-sidebar"]';
const FILA_CONTROLES = '[data-testid="left-sidebar-catalog-controls"]';

const vigilarConsola = (page: Page) => {
  const criticos: string[] = [];
  page.on('console', (m) => {
    if (/Maximum update depth exceeded/i.test(m.text())) criticos.push(m.text());
  });
  page.on('pageerror', (e) => criticos.push(`pageerror: ${e.message}`));
  return criticos;
};

/** Métrica de envoltura: cuántas líneas visuales ocupan los hijos de la fila. */
const medirFilaControles = (page: Page) =>
  page.locator(FILA_CONTROLES).evaluate((fila) => {
    const hijos = Array.from(fila.children) as HTMLElement[];
    const visibles = hijos.filter((hijo) => hijo.getBoundingClientRect().height > 0);
    const topes = new Set(visibles.map((hijo) => Math.round(hijo.getBoundingClientRect().top)));
    return {
      alto: fila.getBoundingClientRect().height,
      altoHijoMayor: Math.max(...visibles.map((hijo) => hijo.getBoundingClientRect().height), 0),
      lineas: topes.size,
      hijosVisibles: visibles.length,
    };
  });

/** Distancia entre el borde del panel y el primer elemento del catálogo. */
const alturaDelChrome = (page: Page) =>
  page.locator(SIDEBAR).evaluate((sidebar) => {
    const primero = sidebar.querySelector('button[data-schema-type]');
    if (!primero) return null;
    return Math.round(primero.getBoundingClientRect().top - sidebar.getBoundingClientRect().top);
  });

/** Abre el control de filtro y devuelve el locator del menú desplegado. */
const abrirFiltro = async (page: Page) => {
  await page.getByTestId('left-sidebar-filter').click();
  const menu = page.locator('.ant-dropdown:not(.ant-dropdown-hidden)').last();
  await expect(menu).toBeVisible();
  return menu;
};

test.describe('los controles del catálogo caben en una fila', () => {
  for (const ancho of [1440, 1280, 1024, 900]) {
    test(`a ${ancho}px de viewport la fila no envuelve`, async ({ page }) => {
      await page.setViewportSize({ width: ancho, height: 800 });
      await abrirDesigner(page, '/designer/single-user');

      const fila = await medirFilaControles(page);
      expect(fila.hijosVisibles, 'debe haber controles que medir').toBeGreaterThan(0);
      expect(fila.lineas, `a ${ancho}px los controles deben ir en una sola línea`).toBe(1);
      // El alto de la fila es el del control más alto más su propio padding: si
      // envolviera, sería un múltiplo de eso. Se compara con la geometría real
      // en vez de con una constante para que el gate no dependa del tema.
      expect(fila.alto, `a ${ancho}px la fila no puede ocupar más de una línea`)
        .toBeLessThanOrEqual(fila.altoHijoMayor + 16);
    });
  }

  test('el catálogo empieza mucho antes que con el bloque envuelto', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const chrome = await alturaDelChrome(page);
    expect(chrome, 'debe haber items de catálogo').not.toBeNull();
    // Medición previa a la corrección: 295 px. Una sola línea de controles
    // libera del orden de 60 px; el presupuesto deja margen para el tema.
    expect(chrome as number).toBeLessThanOrEqual(245);
  });
});

test.describe('ninguna función del catálogo se pierde', () => {
  test('el filtro activo y su recuento son visibles sin abrir nada', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const disparador = page.getByTestId('left-sidebar-filter');
    await expect(disparador).toBeVisible();
    await expect(disparador).toHaveAttribute('data-quick-filter', 'all');
    await expect(disparador).toContainText('Todos');
  });

  test('los tres filtros rápidos siguen alcanzables y aplican', async ({ page }) => {
    const criticos = vigilarConsola(page);
    await abrirDesigner(page, '/designer/single-user');
    const disparador = page.getByTestId('left-sidebar-filter');

    for (const filtro of ['favorites', 'recent', 'all'] as const) {
      const menu = await abrirFiltro(page);
      await menu.getByTestId(`left-sidebar-filter-${filtro}`).click();
      await expect(disparador).toHaveAttribute('data-quick-filter', filtro);
    }
    expect(criticos).toEqual([]);
  });

  test('el recuento del filtro refleja el estado real de favoritos', async ({ page }) => {
    // Semilla directa del store de favoritos: el contrato de este gate es que
    // el disparador de filtro DERIVE su recuento de `favoritePlugins`, no que
    // el botón ★ del catálogo marque favoritos con un click real. Ese botón
    // ya no respondía a un click de Playwright ANTES de este slice —falla
    // igual en HEAD sin ninguno de estos cambios—, así que es un defecto
    // preexistente y ajeno a las cuatro brechas de este prompt; queda anotado
    // como riesgo residual, no oculto detrás de una aserción que no puede
    // fallar.
    await page.addInitScript(() => {
      window.localStorage.setItem('sisad-pdfme:fav-plugins', JSON.stringify(['text', 'number']));
    });
    await abrirDesigner(page, '/designer/single-user');
    const menu = await abrirFiltro(page);
    await expect(menu.getByTestId('left-sidebar-filter-favorites')).toContainText('(2)');
  });

  test('los tres modos de visualización siguen alcanzables', async ({ page }) => {
    const criticos = vigilarConsola(page);
    await abrirDesigner(page, '/designer/single-user');
    const sidebar = page.locator(SIDEBAR);

    for (const layout of ['tiles', 'icons', 'list'] as const) {
      const directo = page.locator(`[data-testid="left-sidebar-catalog-controls"] [data-catalog-layout="${layout}"]`);
      if (await directo.count()) {
        await directo.click();
      } else {
        // Densidad reducida: los modos viven tras el disparador de Vista.
        await page.getByTestId('left-sidebar-view').click();
        const menu = page.locator('.ant-dropdown:not(.ant-dropdown-hidden)').last();
        await expect(menu).toBeVisible();
        await menu.locator(`[data-catalog-layout="${layout}"]`).click();
      }
      await expect(sidebar).toHaveAttribute('data-catalog-layout', layout);
    }
    expect(criticos).toEqual([]);
  });

  test('la búsqueda sigue visible junto a los controles', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    await expect(page.locator(`${SIDEBAR} input`).first()).toBeVisible();
  });

  test('filtro y modo de visualización son independientes', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const sidebar = page.locator(SIDEBAR);
    const disparador = page.getByTestId('left-sidebar-filter');

    const menu = await abrirFiltro(page);
    await menu.getByTestId('left-sidebar-filter-recent').click();
    await expect(disparador).toHaveAttribute('data-quick-filter', 'recent');
    const layoutPrevio = await sidebar.getAttribute('data-catalog-layout');

    // Cambiar de vista no puede alterar el filtro.
    const directo = page.locator('[data-testid="left-sidebar-catalog-controls"] [data-catalog-layout="tiles"]');
    if (await directo.count()) {
      await directo.click();
    } else {
      await page.getByTestId('left-sidebar-view').click();
      await page.locator('.ant-dropdown:not(.ant-dropdown-hidden)').last().locator('[data-catalog-layout="tiles"]').click();
    }
    await expect(sidebar).toHaveAttribute('data-catalog-layout', 'tiles');
    await expect(disparador).toHaveAttribute('data-quick-filter', 'recent');
    expect(layoutPrevio).not.toBe(null);
  });

  test('el arrastre sigue funcionando tras cambiar de modo de visualización', async ({ page }) => {
    test.slow();
    await abrirDesigner(page, '/designer/single-user');
    const sidebar = page.locator(SIDEBAR);

    const directo = page.locator('[data-testid="left-sidebar-catalog-controls"] [data-catalog-layout="tiles"]');
    if (await directo.count()) {
      await directo.click();
    } else {
      await page.getByTestId('left-sidebar-view').click();
      await page.locator('.ant-dropdown:not(.ant-dropdown-hidden)').last().locator('[data-catalog-layout="tiles"]').click();
    }
    await expect(sidebar).toHaveAttribute('data-catalog-layout', 'tiles');

    const canvas = await paginaCanvas(page, 0);
    const items = canvas.locator('[data-schema-type="text"][data-schema-id]');
    const antes = await items.count();
    const origen = page.locator('button[data-schema-type="text"][aria-roledescription="draggable"]').first();
    await arrastrarAlCentro(page, origen, canvas, 0, 0);
    await expect.poll(() => items.count(), { message: 'el catálogo debe seguir siendo arrastrable' })
      .toBe(antes + 1);
  });

  test('el control de filtro es alcanzable y operable por teclado', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const disparador = page.getByTestId('left-sidebar-filter');
    await disparador.focus();
    await expect(disparador).toBeFocused();
    await disparador.press('Enter');
    const menu = page.locator('.ant-dropdown:not(.ant-dropdown-hidden)').last();
    await expect(menu, 'Enter debe desplegar el filtro').toBeVisible();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
  });
});

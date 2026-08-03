/**
 * COREUX-013 — Layout, safe-area y contraste de la CtlBar.
 *
 * Fija el defecto corregido: `.sisad-pdfme-designer-stage` tenía padding con
 * `box-sizing: content-box` (Tailwind preflight está desactivado), así que con
 * `height: 100%` medía 16 px más que su contenedor y empujaba el cluster
 * inferior fuera del viewport en TODOS los tamaños.
 *
 * Medido antes del arreglo: bottom 848/1028/904 con viewport 844/1024/900.
 *
 * Ejecutar con el ejemplo levantado:
 *   npm run dev
 *   PLAYWRIGHT_BASE_URL=http://localhost:<puerto> \
 *     npx playwright test tests/playwright/coreux-toolbar.spec.ts
 */
import { expect, test, type Page } from '@playwright/test';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

const ROUTE = EXAMPLE_ROUTE_PATHS.designerSingleUser;

const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 720 },
  { name: '1920', width: 1920, height: 1080 },
];

async function gotoDesigner(page: Page) {
  await page.goto(ROUTE);
  // El montaje del runtime puede tardar más que el timeout por defecto de
  // expect (5 s); usar el suyo evita flakes que no son regresiones.
  await expect(page.locator('[data-sisad-pdfme-root]')).toBeVisible({ timeout: 20_000 });
  await expect
    .poll(async () => page.locator('.sisad-pdfme-designer-stage').count(), { timeout: 20_000 })
    .toBeGreaterThan(0);
}

test.describe('COREUX-013 · CtlBar dentro del viewport', () => {
  for (const viewport of VIEWPORTS) {
    test(`la toolbar es visible completa en ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await gotoDesigner(page);

      const metrics = await page.evaluate(() => {
        const clusters = [...document.querySelectorAll('[class*="control-bar-cluster"]')].map(
          (element) => {
            const box = element.getBoundingClientRect();
            return {
              top: Math.round(box.top),
              bottom: Math.round(box.bottom),
              left: Math.round(box.left),
              right: Math.round(box.right),
            };
          },
        );
        const stage = document.querySelector('.sisad-pdfme-designer-stage');
        const stageBox = stage?.getBoundingClientRect();
        return {
          clusters,
          stageBottom: stageBox ? Math.round(stageBox.bottom) : 0,
          stageBoxSizing: stage ? getComputedStyle(stage).boxSizing : '',
          innerHeight: window.innerHeight,
          innerWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          docClientWidth: document.documentElement.clientWidth,
        };
      });

      expect(metrics.clusters.length).toBeGreaterThan(0);

      // El stage no puede desbordar a su contenedor.
      expect(metrics.stageBoxSizing).toBe('border-box');
      expect(metrics.stageBottom).toBeLessThanOrEqual(metrics.innerHeight);

      // Ningún cluster puede quedar recortado por ningún borde.
      metrics.clusters.forEach((cluster) => {
        expect(cluster.bottom, 'cluster recortado por abajo').toBeLessThanOrEqual(
          metrics.innerHeight,
        );
        expect(cluster.top, 'cluster recortado por arriba').toBeGreaterThanOrEqual(0);
        expect(cluster.left, 'cluster recortado por la izquierda').toBeGreaterThanOrEqual(0);
        expect(cluster.right, 'cluster recortado por la derecha').toBeLessThanOrEqual(
          metrics.innerWidth,
        );
      });

      // Sin overflow horizontal de documento.
      expect(metrics.docScrollWidth).toBeLessThanOrEqual(metrics.docClientWidth);
    });
  }

  test('respeta prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1280, height: 720 });
    await gotoDesigner(page);

    const animated = await page.evaluate(() => {
      const clusters = [...document.querySelectorAll('[class*="control-bar-cluster"] *')];
      return clusters.filter((element) => {
        const duration = getComputedStyle(element).transitionDuration;
        return duration && duration !== '0s' && !duration.startsWith('0s');
      }).length;
    });

    expect(animated, 'hay transiciones activas con reduced-motion').toBe(0);
  });
});

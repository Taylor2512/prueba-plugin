/**
 * COREUX-001 — Baseline visual y responsive del Designer.
 *
 * Congela evidencia reproducible ANTES de tocar el core: capturas por viewport
 * y estado, más un volcado de medidas (`metrics.json`) que sirve de referencia
 * para separar regresiones del host de regresiones del core.
 *
 * No modifica código productivo. Las aserciones son estructurales, no de
 * píxel: comprueban invariantes que deben seguir siendo ciertas después del
 * refactor de eventos/efectos.
 *
 * Evidencia: `reports/core-ux/baseline/`.
 * Ejecutar con el ejemplo levantado:
 *   npm run dev
 *   PLAYWRIGHT_BASE_URL=http://localhost:5173 npx playwright test tests/playwright/coreux-visual-baseline.spec.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test, type Page } from '@playwright/test';

const ROUTE = '/examples/designer/single-user';
const CONFIG_PROFILE = 'designer-single-user';
const EVIDENCE_DIR = resolve(process.cwd(), 'reports/core-ux/baseline');

/** Los seis anchos que exige la matriz de aceptación de la task-card. */
const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1280', width: 1280, height: 720 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

type BaselineMetrics = Record<string, unknown>;

const collected: BaselineMetrics[] = [];

/** Espera a que el runtime tenga tamaño real antes de medir. */
async function gotoDesigner(page: Page) {
  await page.goto(ROUTE);
  await expect(page.locator('[data-sisad-pdfme-root]')).toBeVisible();
  await expect
    .poll(async () => (await page.locator('[data-sisad-pdfme-root]').boundingBox())?.width ?? 0, {
      timeout: 20_000,
    })
    .toBeGreaterThan(0);
  // El Canvas hace autoFit en un rAF posterior al montaje.
  await expect
    .poll(async () => page.locator('[data-paper-root="true"]').count(), { timeout: 20_000 })
    .toBeGreaterThan(0);
}

/**
 * Volcado de medidas del host y del core.
 *
 * `runtimeNodeId` marca el nodo interno que crea el adaptador de runtime: si
 * cambia entre dos lecturas, el runtime se remontó.
 */
async function readMetrics(page: Page) {
  return page.evaluate(() => {
    const rect = (selector: string) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        width: Math.round(box.width),
        height: Math.round(box.height),
        left: Math.round(box.left),
        top: Math.round(box.top),
      };
    };

    const host = document.querySelector('[data-sisad-pdfme-root]');
    const runtimeNode = host?.firstElementChild as HTMLElement | undefined;
    if (runtimeNode && !runtimeNode.dataset.baselineNodeId) {
      runtimeNode.dataset.baselineNodeId = String(Date.now());
    }
    const canvas = document.querySelector('.sisad-pdfme-designer-canvas');

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      host: rect('[data-sisad-pdfme-root]'),
      runtimeMode: runtimeNode?.dataset.runtimeMode ?? null,
      runtimeNodeId: runtimeNode?.dataset.baselineNodeId ?? null,
      designerRoot: rect('.sisad-pdfme-designer-root'),
      canvas: canvas
        ? {
            clientWidth: canvas.clientWidth,
            clientHeight: canvas.clientHeight,
            scrollWidth: canvas.scrollWidth,
            scrollHeight: canvas.scrollHeight,
            scrollLeft: Math.round(canvas.scrollLeft),
            scrollTop: Math.round(canvas.scrollTop),
          }
        : null,
      canvasHasHorizontalScroll: canvas ? canvas.scrollWidth > canvas.clientWidth + 1 : false,
      paper: rect('[data-paper-root="true"]'),
      leftSidebar: rect('[data-testid="left-sidebar"]'),
      zoom: document.querySelector('[data-testid="designer-zoom-select"]')?.textContent?.trim() ?? null,
      document: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
      },
      bodyMargin: getComputedStyle(document.body).margin,
    };
  });
}

async function captureState(page: Page, viewportName: string, state: string) {
  const metrics = await readMetrics(page);
  const screenshot = `coreux-baseline-${viewportName}-${state}.png`;
  await page.screenshot({ path: resolve(EVIDENCE_DIR, screenshot) });
  collected.push({ viewport: viewportName, state, configProfile: CONFIG_PROFILE, screenshot, ...metrics });
  return metrics;
}

test.beforeAll(() => {
  mkdirSync(EVIDENCE_DIR, { recursive: true });
});

test.afterAll(() => {
  writeFileSync(
    resolve(EVIDENCE_DIR, 'metrics.json'),
    `${JSON.stringify({ route: ROUTE, capturedAt: new Date().toISOString(), entries: collected }, null, 2)}\n`,
  );
});

test.describe('COREUX-001 · baseline visual del Designer', () => {
  for (const viewport of VIEWPORTS) {
    test(`captura y mide el baseline en ${viewport.name}px`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await gotoDesigner(page);

      const initial = await captureState(page, viewport.name, 'sidebars-abiertos');

      // Invariantes del host que el refactor de core no puede romper.
      expect(initial.bodyMargin).toBe('0px');
      expect(initial.document.scrollWidth).toBeLessThanOrEqual(initial.document.clientWidth);
      expect(initial.host?.width ?? 0).toBeGreaterThan(0);
      expect(initial.host?.height ?? 0).toBeGreaterThan(0);

      // El scroll horizontal del Canvas NO se afirma como invariante: en 390 y
      // 768 px la página A4 no cabe al 100 % y el autoFit no ajusta a ancho.
      // Es comportamiento actual del core y el baseline lo registra tal cual
      // (ver `10-VISUAL-BASELINE.md`, hallazgo BASE-01) en lugar de esconderlo
      // tras una aserción que hoy sería roja.
      expect(typeof initial.canvasHasHorizontalScroll).toBe('boolean');

      // Estado con ambos rails colapsados: el core gana superficie, pero no
      // puede alterar zoom ni remontar el runtime (ver IMG-02 de la auditoría).
      const collapseLeft = page.getByTestId('sidebar-collapse-left');
      const collapseRight = page.getByTestId('sidebar-collapse-right');
      const canCollapse =
        (await collapseLeft.isVisible().catch(() => false)) &&
        (await collapseRight.isVisible().catch(() => false));

      if (canCollapse) {
        await collapseLeft.click();
        await collapseRight.click();
        await page.waitForTimeout(400);
        const collapsed = await captureState(page, viewport.name, 'sidebars-colapsados');

        expect(collapsed.zoom).toBe(initial.zoom);
        expect(collapsed.runtimeNodeId).toBe(initial.runtimeNodeId);
        expect(collapsed.document.scrollWidth).toBeLessThanOrEqual(collapsed.document.clientWidth);
        // Colapsar libera ancho para el canvas, nunca lo reduce.
        expect(collapsed.canvas?.clientWidth ?? 0).toBeGreaterThanOrEqual(
          initial.canvas?.clientWidth ?? 0,
        );
      }
    });
  }
});

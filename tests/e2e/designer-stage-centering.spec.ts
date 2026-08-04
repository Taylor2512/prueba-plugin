/**
 * Contrato de centrado inmutable del workspace del Designer.
 *
 *     paperCenterX === workspaceCenterX   (±2 px)
 *
 * en las cuatro combinaciones de sidebars, y nunca
 *
 *     paperCenterX === centro del espacio restante entre sidebars
 *
 * Abrir, cerrar, expandir o colapsar un sidebar no puede mover el papel, el
 * paginador, los controles de zoom ni el Canvas, ni alterar zoom, scroll,
 * página, selección o la instancia del runtime.
 *
 * ESTADO ESPERADO: **roja**. Es la assertion geométrica que precede al parche de
 * VISUX-005/VISUX-007. `Designer/index.tsx` calcula hoy
 * `canvasWidth = size.width - leftSidebarWidth` y
 * `safeContentWidth = safeCanvasWidth - rightSidebarWidth`, y pasa el resultado
 * (`sizeExcSidebars`) al Canvas: los sidebars son entradas geométricas del
 * sistema de coordenadas, así que el centro se desplaza con ellos.
 *
 * Las mediciones de partida están en
 * `reports/visual-behavior/07-BASELINE-MEASUREMENTS.md` §1.1.
 */
import { expect, test, type Page } from '@playwright/test';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

const ROUTE = EXAMPLE_ROUTE_PATHS.designerMultiUser;

/**
 * Workspace geométrico: contenedor completo del Designer (`w-full`), del que el
 * stage es hermano del LeftSidebar. Es la referencia inmutable del contrato.
 */
const WORKSPACE = '.sisad-pdfme-designer-workspace';
/**
 * Stage: hermano del LeftSidebar dentro del workspace, por lo que hoy se encoge
 * cuando el panel izquierdo reserva espacio. Se mide, no se usa de referencia.
 */
const STAGE = '.sisad-pdfme-designer-stage';
const CANVAS = '.sisad-pdfme-designer-canvas';
const PAPER = '[data-paper-page], [data-canvas-page], .sisad-pdfme-ui-paper';
const LEFT_SIDEBAR = '[data-testid="left-sidebar"]';
const RIGHT_SIDEBAR = '.sisad-pdfme-designer-right-sidebar';
const RIGHT_RAIL_BTN = '.sisad-pdfme-designer-sidebar-rail-btn';
const PAGER = '[title="Página"]';
const ZOOM = '[data-testid="designer-zoom-select"]';
/**
 * Los clusters, no los controles sueltos: dentro de su pill un control puede
 * estar descentrado a propósito (el select de zoom vive a la derecha de undo,
 * redo y fit). Lo que el contrato exige centrado es el cluster.
 */
const PAGER_CLUSTER = '.sisad-pdfme-ui-control-bar-cluster--top-center';
const ZOOM_CLUSTER = '.sisad-pdfme-ui-control-bar-cluster--bottom-right';

/** Tolerancia del contrato de centrado. */
const CENTER_TOLERANCE = 2;

const VIEWPORTS = [
  { width: 1600, height: 1200 },
  { width: 1536, height: 1024 },
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
] as const;

const SIDEBAR_STATES = [
  { left: false, right: false },
  { left: true, right: false },
  { left: false, right: true },
  { left: true, right: true },
] as const;

const describeState = (state: { left: boolean; right: boolean }) =>
  `left=${state.left ? 'abierto' : 'cerrado'} right=${state.right ? 'abierto' : 'cerrado'}`;

async function gotoDesigner(page: Page) {
  await page.goto(ROUTE);
  await expect(page.locator(CANVAS)).toBeVisible();
  await expect
    .poll(async () => (await page.locator(CANVAS).boundingBox())?.width ?? 0, { timeout: 20_000 })
    .toBeGreaterThan(0);
  await expect(page.locator(PAPER).first()).toBeVisible();
  await page.waitForTimeout(400);
}

async function setLeftSidebar(page: Page, expanded: boolean) {
  const toggle = page
    .locator(LEFT_SIDEBAR)
    .getByRole('button', { name: /Cerrar catálogo de campos|Abrir catálogo de campos/i })
    .first();
  await expect(toggle).toBeVisible();
  if (((await toggle.getAttribute('aria-expanded')) === 'true') !== expanded) {
    await toggle.click();
  }
  await expect(page.locator(LEFT_SIDEBAR)).toHaveAttribute(
    'data-left-sidebar-expanded',
    expanded ? 'true' : 'false',
  );
  await page.waitForTimeout(300);
}

async function setRightSidebar(page: Page, expanded: boolean) {
  const sidebar = page.locator(RIGHT_SIDEBAR);
  if (((await sidebar.getAttribute('data-right-sidebar-expanded')) === 'true') !== expanded) {
    if (expanded) {
      // El rail acotado al panel derecho: el izquierdo usa la misma clase.
      await page.locator(RIGHT_SIDEBAR).locator(RIGHT_RAIL_BTN).first().click();
    } else {
      await page.getByRole('button', { name: /Ocultar panel derecho/i }).first().click();
    }
  }
  await expect(sidebar).toHaveAttribute(
    'data-right-sidebar-expanded',
    expanded ? 'true' : 'false',
  );
  await page.waitForTimeout(300);
}

/**
 * Marca el nodo del Canvas. Si el Designer se remonta al cambiar de layout, el
 * nodo se reemplaza y la marca desaparece: detector de remount que no necesita
 * instrumentar código de producción.
 */
async function stampCanvas(page: Page) {
  await page.evaluate((sel) => {
    document.querySelector(sel)?.setAttribute('data-centering-probe', 'stamped');
  }, CANVAS);
}

async function canvasIsStamped(page: Page) {
  return page.evaluate(
    (sel) => document.querySelector(sel)?.getAttribute('data-centering-probe') === 'stamped',
    CANVAS,
  );
}

type Geometry = {
  workspace: { x: number; width: number; center: number } | null;
  stage: { x: number; width: number; center: number } | null;
  canvas: { x: number; width: number } | null;
  paper: { x: number; width: number; center: number } | null;
  pagerCenter: number | null;
  zoomCenter: number | null;
  zoomValue: string | null;
  pageLabel: string | null;
  scrollLeft: number | null;
  scrollTop: number | null;
};

async function readGeometry(page: Page): Promise<Geometry> {
  return page.evaluate(
    ({ workspaceSel, stageSel, canvasSel, paperSel, pagerSel, zoomSel, pagerClusterSel, zoomClusterSel }) => {
      const box = (el: Element | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, width: r.width, center: r.x + r.width / 2 };
      };
      const centerOf = (sel: string) => box(document.querySelector(sel))?.center ?? null;

      const workspace = box(document.querySelector(workspaceSel));
      const stage = box(document.querySelector(stageSel));
      const canvasEl = document.querySelector(canvasSel);
      const canvas = box(canvasEl);
      const paper = box(document.querySelector(paperSel));

      /** El scroll owner del canvas puede ser el propio nodo o un hijo. */
      const scroller =
        canvasEl && canvasEl.scrollHeight > canvasEl.clientHeight
          ? canvasEl
          : (canvasEl?.querySelector('*') as HTMLElement | null) ?? null;

      return {
        workspace: workspace
          ? { x: workspace.x, width: workspace.width, center: workspace.center }
          : null,
        stage: stage ? { x: stage.x, width: stage.width, center: stage.center } : null,
        canvas: canvas ? { x: canvas.x, width: canvas.width } : null,
        paper: paper ? { x: paper.x, width: paper.width, center: paper.center } : null,
        pagerCenter: centerOf(pagerClusterSel),
        zoomCenter: centerOf(zoomClusterSel),
        zoomValue:
          (
            document.querySelector(`${zoomSel} .ant-select-selection-item`) as HTMLElement | null
          )?.innerText.trim() ?? null,
        pageLabel:
          (document.querySelector(pagerSel) as HTMLElement | null)?.innerText.trim() ?? null,
        scrollLeft: scroller ? Math.round(scroller.scrollLeft) : null,
        scrollTop: scroller ? Math.round(scroller.scrollTop) : null,
      };
    },
    {
      workspaceSel: WORKSPACE,
      stageSel: STAGE,
      canvasSel: CANVAS,
      paperSel: PAPER,
      pagerSel: PAGER,
      zoomSel: ZOOM,
      pagerClusterSel: PAGER_CLUSTER,
      zoomClusterSel: ZOOM_CLUSTER,
    },
  );
}

for (const viewport of VIEWPORTS) {
  test.describe(`centrado del stage @${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    test('el papel y los controles centrales no se mueven al cambiar los sidebars', async ({
      page,
    }) => {
      test.setTimeout(120_000);

      await gotoDesigner(page);

      // Estado de referencia: ambos sidebars cerrados.
      await setLeftSidebar(page, false);
      await setRightSidebar(page, false);
      await stampCanvas(page);
      const reference = await readGeometry(page);
      expect(reference.workspace, 'el workspace del Designer debe existir').not.toBeNull();
      expect(reference.stage, 'el stage del Designer debe existir').not.toBeNull();
      expect(reference.paper, 'el paper debe existir').not.toBeNull();

      const failures: string[] = [];
      const record = (condition: boolean, message: string) => {
        if (!condition) failures.push(message);
      };

      for (const state of SIDEBAR_STATES) {
        await setLeftSidebar(page, state.left);
        await setRightSidebar(page, state.right);

        const geometry = await readGeometry(page);
        const label = describeState(state);

        const workspace = geometry.workspace!;
        const stage = geometry.stage!;
        const paper = geometry.paper!;

        // Contrato principal: el papel se centra en el workspace completo, no en
        // el espacio restante entre sidebars.
        const centerDelta = Math.abs(paper.center - workspace.center);
        record(
          centerDelta <= CENTER_TOLERANCE,
          `[${label}] centro del papel ${paper.center.toFixed(1)} vs centro del workspace ` +
            `${workspace.center.toFixed(1)} → desviación ${centerDelta.toFixed(1)}px (máx ${CENTER_TOLERANCE})`,
        );

        // El workspace es la referencia: no puede encogerse con los sidebars.
        record(
          Math.abs(workspace.width - reference.workspace!.width) <= CENTER_TOLERANCE,
          `[${label}] workspace width ${workspace.width.toFixed(1)} ≠ referencia ${reference.workspace!.width.toFixed(1)}`,
        );
        record(
          Math.abs(stage.width - reference.stage!.width) <= CENTER_TOLERANCE,
          `[${label}] stage width ${stage.width.toFixed(1)} ≠ referencia ${reference.stage!.width.toFixed(1)}`,
        );

        // El Canvas no puede cambiar de caja.
        record(
          Math.abs(geometry.canvas!.x - reference.canvas!.x) <= CENTER_TOLERANCE,
          `[${label}] canvas x ${geometry.canvas!.x.toFixed(1)} ≠ referencia ${reference.canvas!.x.toFixed(1)}`,
        );
        record(
          Math.abs(geometry.canvas!.width - reference.canvas!.width) <= CENTER_TOLERANCE,
          `[${label}] canvas width ${geometry.canvas!.width.toFixed(1)} ≠ referencia ${reference.canvas!.width.toFixed(1)}`,
        );

        // El papel no puede desplazarse respecto a la referencia.
        record(
          Math.abs(paper.center - reference.paper!.center) <= CENTER_TOLERANCE,
          `[${label}] el papel se desplazó ${Math.abs(paper.center - reference.paper!.center).toFixed(1)}px respecto al estado de referencia`,
        );

        // Controles centrales.
        if (geometry.pagerCenter !== null) {
          record(
            Math.abs(geometry.pagerCenter - workspace.center) <= CENTER_TOLERANCE,
            `[${label}] paginador centrado en ${geometry.pagerCenter.toFixed(1)} vs workspace ${workspace.center.toFixed(1)}`,
          );
        }
        if (geometry.zoomCenter !== null) {
          record(
            Math.abs(geometry.zoomCenter - workspace.center) <= CENTER_TOLERANCE,
            `[${label}] controles de zoom centrados en ${geometry.zoomCenter.toFixed(1)} vs workspace ${workspace.center.toFixed(1)}`,
          );
        }

        // Estado preservado.
        record(
          geometry.zoomValue === reference.zoomValue,
          `[${label}] zoom ${geometry.zoomValue} ≠ referencia ${reference.zoomValue}`,
        );
        record(
          geometry.pageLabel === reference.pageLabel,
          `[${label}] página ${geometry.pageLabel} ≠ referencia ${reference.pageLabel}`,
        );
        record(
          geometry.scrollLeft === reference.scrollLeft,
          `[${label}] scrollLeft ${geometry.scrollLeft} ≠ referencia ${reference.scrollLeft}`,
        );
        record(
          geometry.scrollTop === reference.scrollTop,
          `[${label}] scrollTop ${geometry.scrollTop} ≠ referencia ${reference.scrollTop}`,
        );
        record(await canvasIsStamped(page), `[${label}] el Canvas se remontó al cambiar de layout`);
      }

      expect(
        failures,
        `Contrato de centrado incumplido @${viewport.width}x${viewport.height}:\n- ${failures.join('\n- ')}`,
      ).toEqual([]);
    });
  });
}

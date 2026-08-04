/**
 * VISUX-001 — Baseline visual reproducible del Designer.
 *
 * Congela los nueve estados de `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
 * (IMG-01..IMG-09) en cuatro anchos de viewport, y emite por cada combinación
 * estado×viewport:
 *
 * - un PNG en `reports/visual-behavior/evidence/baseline/<ancho>/`;
 * - un JSON de mediciones en el mismo directorio.
 *
 * Esta suite NO juzga el diseño: sólo mide y registra. Las únicas assertions
 * comprueban que el estado pedido se alcanzó de verdad, para que ninguna
 * captura quede etiquetada con un estado que el DOM no confirma. Los hallazgos
 * (tabs truncados, desplazamiento del paper, solapes) se leen después desde los
 * JSON; no se afirman aquí.
 *
 * Requiere un dev server: `npm run dev` y
 * `PLAYWRIGHT_BASE_URL=http://localhost:<puerto>`.
 */
import { expect, test, type Locator, type Page } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

/** Ruta única del baseline: es la que aparece en las nueve capturas de origen. */
const ROUTE = EXAMPLE_ROUTE_PATHS.designerMultiUser;

/**
 * Destino de la evidencia. `BASELINE_OUTPUT_DIR` permite capturar variantes
 * (por ejemplo antes y después de un parche) sin sobrescribir el baseline
 * vigente, que es lo único que hace comparable a un baseline.
 */
const OUTPUT_ROOT = path.resolve(
  process.cwd(),
  process.env.BASELINE_OUTPUT_DIR || 'reports/visual-behavior/evidence/baseline',
);

const VIEWPORTS = [
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
  { width: 1600, height: 1000 },
  { width: 1920, height: 1080 },
] as const;

const LEFT_SIDEBAR = '[data-testid="left-sidebar"]';
const RIGHT_SIDEBAR = '.sisad-pdfme-designer-right-sidebar';
const CANVAS = '.sisad-pdfme-designer-canvas';
const PAPER = '[data-paper-page], [data-canvas-page], .sisad-pdfme-ui-paper';
const RIGHT_RAIL_BTN = '.sisad-pdfme-designer-sidebar-rail-btn';
const SELECTION_TOOLBAR = '.sisad-pdfme-ui-selection-context-toolbar';

/** Ids estables emitidos por `RightSidebar.tsx` (TAB_ID_BY_MODE). */
const TAB_ID = {
  fields: 'sisad-pdfme-right-sidebar-tab-fields',
  detail: 'sisad-pdfme-right-sidebar-tab-detail',
  comments: 'sisad-pdfme-right-sidebar-tab-comments',
  docs: 'sisad-pdfme-right-sidebar-tab-docs',
} as const;

type PanelMode = keyof typeof TAB_ID;

/**
 * El modo del tab no siempre coincide con el valor publicado en
 * `data-panel-mode`: el tab `fields` publica `list`. Medido en 2026-08-04; se
 * documenta en el informe de baseline en vez de normalizarse aquí.
 */
const PUBLISHED_PANEL_MODE: Record<PanelMode, string> = {
  fields: 'list',
  detail: 'detail',
  comments: 'comments',
  docs: 'docs',
};

const leftToggle = (page: Page) =>
  page
    .locator(LEFT_SIDEBAR)
    .getByRole('button', { name: /Cerrar catálogo de campos|Abrir catálogo de campos/i })
    .first();

const rightToggle = (page: Page) =>
  page.getByRole('button', { name: /Ocultar panel derecho|Mostrar panel derecho/i }).first();

/** Espera a que el Canvas tenga tamaño real antes de medir cualquier cosa. */
async function gotoDesigner(page: Page) {
  await page.goto(ROUTE);
  await expect(page.locator(CANVAS)).toBeVisible();
  await expect
    .poll(async () => (await page.locator(CANVAS).boundingBox())?.width ?? 0, { timeout: 20_000 })
    .toBeGreaterThan(0);
  await expect(page.locator(PAPER).first()).toBeVisible();
  // Evita capturar el estado intermedio de las transiciones de entrada.
  await page.waitForTimeout(400);
}

async function setLeftSidebar(page: Page, expanded: boolean) {
  const toggle = leftToggle(page);
  await expect(toggle).toBeVisible();
  const current = (await toggle.getAttribute('aria-expanded')) === 'true';
  if (current !== expanded) {
    await toggle.click();
  }
  await expect(page.locator(LEFT_SIDEBAR)).toHaveAttribute(
    'data-left-sidebar-expanded',
    expanded ? 'true' : 'false',
  );
  await page.waitForTimeout(250);
}

async function setRightSidebar(page: Page, expanded: boolean) {
  const sidebar = page.locator(RIGHT_SIDEBAR);
  const currentlyExpanded = (await sidebar.getAttribute('data-right-sidebar-expanded')) === 'true';
  if (currentlyExpanded !== expanded) {
    if (expanded) {
      // Colapsado: el único punto de reapertura es el rail.
      await page.locator(RIGHT_RAIL_BTN).first().click();
    } else {
      await rightToggle(page).click();
    }
  }
  await expect(sidebar).toHaveAttribute(
    'data-right-sidebar-expanded',
    expanded ? 'true' : 'false',
  );
  await page.waitForTimeout(250);
}

async function openPanel(page: Page, mode: PanelMode) {
  const tab = page.locator(`#${TAB_ID[mode]}`);
  await expect(tab).toBeVisible();
  await expect(tab).toBeEnabled();
  await tab.click();
  await expect(page.locator(RIGHT_SIDEBAR)).toHaveAttribute(
    'data-panel-mode',
    PUBLISHED_PANEL_MODE[mode],
  );
  await page.waitForTimeout(250);
}

/** Selecciona en el Canvas el primer schema de un tipo dado. */
async function selectSchemaByType(page: Page, schemaType: string) {
  const node = page
    .locator(`.sisad-pdfme-ui-custom-selectable[data-schema-type="${schemaType}"]`)
    .first();
  await expect(node).toBeVisible();
  await node.click({ force: true });
  await expect(page.locator(SELECTION_TOOLBAR)).toBeVisible();
  await page.waitForTimeout(250);
  return node;
}

/**
 * Mediciones objetivas del estado. Todo lo que se registre aquí es geometría o
 * atributos del DOM: nada interpretado.
 */
async function measure(page: Page) {
  return page.evaluate(
    ({ leftSel, rightSel, canvasSel, paperSel, toolbarSel }) => {
      const rect = (el: Element | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          x: Math.round(r.x),
          y: Math.round(r.y),
          width: Math.round(r.width),
          height: Math.round(r.height),
          right: Math.round(r.right),
        };
      };

      const left = document.querySelector(leftSel);
      const right = document.querySelector(rightSel);
      const canvas = document.querySelector(canvasSel);
      const paper = document.querySelector(paperSel);
      const toolbar = document.querySelector(toolbarSel);

      const tablist = document.querySelector('[role="tablist"][aria-label="Panel derecho"]');
      const tablistRect = tablist?.getBoundingClientRect() ?? null;

      /**
       * Sólo los tabs del panel derecho: el LeftSidebar publica sus propios
       * `role="tab"` y contaminaría la medición.
       */
      const tabs = [...(tablist?.querySelectorAll('[role="tab"]') ?? [])].map((tab) => {
        const labelNode = tab.querySelector(
          '.sisad-pdfme-designer-right-sidebar-panel-switcher-btn-label',
        ) as HTMLElement | null;
        const tabRect = tab.getBoundingClientRect();
        /** Ancho del tab realmente dentro del área visible del tablist. */
        const visibleWidth = tablistRect
          ? Math.max(
              0,
              Math.min(tabRect.right, tablistRect.right) - Math.max(tabRect.left, tablistRect.left),
            )
          : null;
        return {
          id: tab.id,
          ariaLabel: tab.getAttribute('aria-label'),
          selected: tab.getAttribute('aria-selected') === 'true',
          disabled: (tab as HTMLButtonElement).disabled,
          visibleText: (tab as HTMLElement).innerText.trim(),
          width: Math.round(tabRect.width),
          visibleWidth: visibleWidth === null ? null : Math.round(visibleWidth),
          /**
           * Porción del tab visible sin desplazar el tablist. < 1 significa que
           * el tab está recortado por el borde del contenedor.
           */
          visibleRatio:
            visibleWidth === null || tabRect.width === 0
              ? null
              : Math.round((visibleWidth / tabRect.width) * 100) / 100,
          /** Etiqueta recortada por CSS (`truncate`), no por falta de texto. */
          labelClipped: labelNode ? labelNode.scrollWidth > labelNode.clientWidth + 1 : null,
        };
      });

      const paperRect = rect(paper);
      const rightRect = rect(right);

      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        leftSidebar: left
          ? {
              rect: rect(left),
              expanded: left.getAttribute('data-left-sidebar-expanded'),
              collapsed: left.getAttribute('data-sidebar-collapsed'),
            }
          : null,
        rightSidebar: right
          ? {
              rect: rightRect,
              expanded: right.getAttribute('data-right-sidebar-expanded'),
              collapsed: right.getAttribute('data-sidebar-collapsed'),
              panelMode: right.getAttribute('data-panel-mode'),
              presentation: right.getAttribute('data-sidebar-presentation'),
              density: right.getAttribute('data-right-sidebar-density'),
              detached: right.getAttribute('data-sidebar-detached'),
            }
          : null,
        canvas: rect(canvas),
        paper: paperRect,
        /**
         * Píxeles del paper cubiertos por el panel derecho. > 0 significa
         * solape real; no se juzga aquí si es aceptable.
         */
        paperOverlappedByRightSidebar:
          paperRect && rightRect ? Math.max(0, paperRect.right - rightRect.x) : null,
        tablist: tablist
          ? {
              rect: rect(tablist),
              scrollWidth: (tablist as HTMLElement).scrollWidth,
              clientWidth: (tablist as HTMLElement).clientWidth,
              overflowing: (tablist as HTMLElement).scrollWidth > (tablist as HTMLElement).clientWidth + 1,
            }
          : null,
        tabs,
        /**
         * Tabs del LeftSidebar (fuera del tablist del panel derecho): su
         * vocabulario visible cambia con el ancho disponible.
         */
        leftSidebarTabs: [...document.querySelectorAll('[role="tab"]')]
          .filter((tab) => !tablist?.contains(tab))
          .map((tab) => ({
            id: tab.id || null,
            visibleText: (tab as HTMLElement).innerText.replace(/\s+/g, ' ').trim(),
            width: Math.round(tab.getBoundingClientRect().width),
          })),
        /**
         * Valor del control «Nombre del campo» del DetailView. Cadena vacía
         * significa presente y sin valor; `null`, que el control no está.
         */
        detailFieldName: (() => {
          const labels = [...document.querySelectorAll('label, [class*="label"]')].filter((el) =>
            (el as HTMLElement).innerText?.includes('Nombre del campo'),
          );
          for (const label of labels) {
            const scope = label.closest('div, section, fieldset') ?? document;
            const input = scope.querySelector('input[type="text"], input:not([type])');
            if (input) return (input as HTMLInputElement).value;
          }
          return null;
        })(),
        selectionToolbar: toolbar
          ? {
              rect: rect(toolbar),
              selectionCount: toolbar.getAttribute('data-selection-count'),
              selectionKind: toolbar.getAttribute('data-selection-kind'),
            }
          : null,
        contextMenuOpen: Boolean(
          document.querySelector('[role="menu"][aria-label="Menú contextual del esquema"]'),
        ),
        detailHeader: (() => {
          const header = document.querySelector('[data-testid="detail-header-card"]');
          if (!header) return null;
          return {
            rect: rect(header),
            text: (header as HTMLElement).innerText.replace(/\s+/g, ' ').trim(),
          };
        })(),
        /** El zoom es un `Select` de antd: el valor vive en el texto del selector. */
        zoom:
          (
            document.querySelector(
              '[data-testid="designer-zoom-select"] .ant-select-selection-item',
            ) as HTMLElement | null
          )?.innerText.trim() ?? null,
        /** Indicador de página: `Button` con `title="Página"` en la CtlBar. */
        pageLabel:
          (document.querySelector('[title="Página"]') as HTMLElement | null)?.innerText
            .replace(/\s+/g, ' ')
            .trim() ?? null,
        fieldsCount:
          (
            document.querySelector('[data-testid="right-sidebar-fields-counter"]') as HTMLElement | null
          )?.innerText.trim() ?? null,
        reassignDisabled: (() => {
          const btn = document.querySelector(
            '[data-testid="right-sidebar-reassign"]',
          ) as HTMLButtonElement | null;
          return btn ? btn.disabled : null;
        })(),
        documentScrollsHorizontally:
          document.documentElement.scrollWidth > window.innerWidth + 1 ||
          document.body.scrollWidth > window.innerWidth + 1,
      };
    },
    {
      leftSel: LEFT_SIDEBAR,
      rightSel: RIGHT_SIDEBAR,
      canvasSel: CANVAS,
      paperSel: PAPER,
      toolbarSel: SELECTION_TOOLBAR,
    },
  );
}

type BaselineState = {
  id: string;
  img: string;
  title: string;
  /** Recorte extra del panel para paridad con capturas de origen recortadas. */
  panelCrop?: (page: Page) => Locator;
  setup: (page: Page) => Promise<void>;
};

const STATES: BaselineState[] = [
  {
    id: 'S01',
    img: 'IMG-01',
    title: 'ambos sidebars colapsados',
    async setup(page) {
      await setLeftSidebar(page, false);
      await setRightSidebar(page, false);
    },
  },
  {
    id: 'S02',
    img: 'IMG-02',
    title: 'RightSidebar en Campos (ListView) con LeftSidebar colapsado',
    panelCrop: (page) => page.locator(RIGHT_SIDEBAR),
    async setup(page) {
      await setLeftSidebar(page, false);
      await setRightSidebar(page, true);
      await openPanel(page, 'fields');
      await expect
        .poll(async () => page.getByTestId('right-sidebar-field-item').count())
        .toBeGreaterThan(0);
    },
  },
  {
    id: 'S03',
    img: 'IMG-03',
    title: 'LeftSidebar colapsado y RightSidebar abierto en Campos',
    async setup(page) {
      await setLeftSidebar(page, false);
      await setRightSidebar(page, true);
      await openPanel(page, 'fields');
    },
  },
  {
    id: 'S04',
    img: 'IMG-04',
    title: 'ambos sidebars expandidos, RightSidebar en Campos',
    async setup(page) {
      await setLeftSidebar(page, true);
      await setRightSidebar(page, true);
      await openPanel(page, 'fields');
    },
  },
  {
    id: 'S05',
    img: 'IMG-05',
    title: 'DetailView de signature con ambos sidebars expandidos',
    async setup(page) {
      await setLeftSidebar(page, true);
      await setRightSidebar(page, true);
      await selectSchemaByType(page, 'signature');
      await openPanel(page, 'detail');
      await expect(page.getByTestId('detail-view')).toBeVisible();
    },
  },
  {
    id: 'S06',
    img: 'IMG-06',
    title: 'CommentsRail con signature seleccionado',
    async setup(page) {
      await setLeftSidebar(page, true);
      await setRightSidebar(page, true);
      await selectSchemaByType(page, 'signature');
      await openPanel(page, 'comments');
    },
  },
  {
    id: 'S07',
    img: 'IMG-07',
    title: 'DocumentsRail (recorte del panel)',
    panelCrop: (page) => page.locator(RIGHT_SIDEBAR),
    async setup(page) {
      await setLeftSidebar(page, true);
      await setRightSidebar(page, true);
      await selectSchemaByType(page, 'signature');
      await openPanel(page, 'docs');
    },
  },
  {
    id: 'S08',
    img: 'IMG-08',
    title: 'DocumentsRail dentro del workspace',
    async setup(page) {
      await setLeftSidebar(page, true);
      await setRightSidebar(page, true);
      await selectSchemaByType(page, 'signature');
      await openPanel(page, 'docs');
    },
  },
  {
    id: 'S09',
    img: 'IMG-09',
    title: 'DetailView de multiVariableText con menú Más abierto',
    async setup(page) {
      await setLeftSidebar(page, true);
      await setRightSidebar(page, true);
      await selectSchemaByType(page, 'multiVariableText');
      await openPanel(page, 'detail');
      await page
        .locator(SELECTION_TOOLBAR)
        .getByRole('button', { name: 'Más acciones' })
        .click();
      await expect(
        page.getByRole('menu', { name: 'Menú contextual del esquema' }),
      ).toBeVisible();
      await page.waitForTimeout(250);
    },
  },
];

for (const viewport of VIEWPORTS) {
  test.describe(`baseline visual @${viewport.width}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const state of STATES) {
      test(`${state.id} (${state.img}) — ${state.title}`, async ({ page }) => {
        test.setTimeout(90_000);

        const outputDir = path.join(OUTPUT_ROOT, String(viewport.width));
        await mkdir(outputDir, { recursive: true });

        await gotoDesigner(page);

        /**
         * Estado con el que arranca la ruta, antes de tocar nada: sin esto no se
         * puede distinguir lo que trae el ejemplo de lo que hace la receta.
         */
        const initial = await page.evaluate(() => {
          const right = document.querySelector('.sisad-pdfme-designer-right-sidebar');
          const left = document.querySelector('[data-testid="left-sidebar"]');
          return {
            rightPanelMode: right?.getAttribute('data-panel-mode') ?? null,
            rightExpanded: right?.getAttribute('data-right-sidebar-expanded') ?? null,
            rightDensity: right?.getAttribute('data-right-sidebar-density') ?? null,
            leftExpanded: left?.getAttribute('data-left-sidebar-expanded') ?? null,
          };
        });

        await state.setup(page);

        const measurements = await measure(page);
        expect(measurements.viewport.width).toBe(viewport.width);

        await page.screenshot({
          path: path.join(outputDir, `${state.id}-viewport.png`),
          fullPage: false,
        });

        if (state.panelCrop) {
          await state.panelCrop(page).screenshot({
            path: path.join(outputDir, `${state.id}-panel.png`),
          });
        }

        await writeFile(
          path.join(outputDir, `${state.id}.json`),
          `${JSON.stringify(
            {
              state: state.id,
              sourceImage: state.img,
              title: state.title,
              route: ROUTE,
              capturedAt: new Date().toISOString(),
              initialState: initial,
              ...measurements,
            },
            null,
            2,
          )}\n`,
          'utf8',
        );
      });
    }
  });
}

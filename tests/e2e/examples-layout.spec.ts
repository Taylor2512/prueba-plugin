/**
 * Layout de las rutas de ejemplo.
 *
 * Mide geometría, no textos: todo se ancla en `data-testid` y
 * `data-example-*` estables, o en el atributo público
 * `[data-sisad-pdfme-root]`.
 *
 * Regla que protege esta suite: el host es dueño del viewport y el runtime es
 * dueño de su scroll interno.
 */
import { expect, test, type Page } from '@playwright/test';
import { EXAMPLE_ROUTE_PATHS } from '@/examples/routes/routeDefinitions.js';

const DESIGNER_SINGLE = EXAMPLE_ROUTE_PATHS.designerSingleUser;
const DESIGNER_MULTI = EXAMPLE_ROUTE_PATHS.designerMultiUser;
const RUNTIME_FORM = EXAMPLE_ROUTE_PATHS.runtimeForm;
const RUNTIME_VIEWER = EXAMPLE_ROUTE_PATHS.runtimeViewer;

const RUNTIME_ROOT = '[data-sisad-pdfme-root]';
const RUNTIME_VIEWPORT = '[data-testid="example-runtime-viewport"]';
const DESIGNER_PAPER = '[data-paper-page], [data-canvas-page], .sisad-pdfme-ui-paper';
const DESIGNER_CANVAS = '.sisad-pdfme-designer-canvas';
const DESIGNER_VIEWPORTS = [
  { name: 'tablet-768', width: 768, height: 1024, maxCenterDelta: 4 },
  { name: 'desktop-1280', width: 1280, height: 720, maxCenterDelta: 4 },
  { name: 'desktop-1440', width: 1440, height: 900, maxCenterDelta: 4 },
  { name: 'desktop-1600', width: 1600, height: 1200, maxCenterDelta: 4 },
  { name: 'desktop-1920', width: 1920, height: 1080, maxCenterDelta: 4 },
];

/** El runtime tarda en montar el Canvas; esperamos a que tenga tamaño real. */
async function gotoRuntimeRoute(page: Page, route: string) {
  await page.goto(route);
  await expect(page.locator(RUNTIME_ROOT)).toBeVisible();
  await expect
    .poll(async () => (await page.locator(RUNTIME_ROOT).boundingBox())?.width ?? 0, { timeout: 15_000 })
    .toBeGreaterThan(0);
}

/**
 * Marca el nodo interno que crea el adaptador de runtime.
 *
 * Si el runtime se remonta, ese nodo se reemplaza y la marca desaparece: es un
 * detector de remount que no necesita instrumentar el código de producción.
 */
async function stampRuntimeHost(page: Page) {
  await page.evaluate(() => {
    const host = document.querySelector('[data-sisad-pdfme-root]')?.firstElementChild;
    host?.setAttribute('data-remount-probe', 'stamped');
  });
}

async function runtimeHostIsStamped(page: Page) {
  return page.evaluate(
    () =>
      document
        .querySelector('[data-sisad-pdfme-root]')
        ?.firstElementChild?.getAttribute('data-remount-probe') === 'stamped',
  );
}

test.describe('baseline del documento', () => {
  test('el body no aporta margen ni scroll horizontal', async ({ page }) => {
    await gotoRuntimeRoute(page, DESIGNER_SINGLE);

    const baseline = await page.evaluate(() => {
      const style = getComputedStyle(document.body);
      return {
        margin: [style.marginTop, style.marginRight, style.marginBottom, style.marginLeft],
        scrollWidth: document.body.scrollWidth,
        clientWidth: document.body.clientWidth,
      };
    });

    expect(baseline.margin).toEqual(['0px', '0px', '0px', '0px']);
    expect(baseline.scrollWidth).toBeLessThanOrEqual(baseline.clientWidth);
  });
});

test.describe('rutas Designer', () => {
  test('el runtime usa el viewport y al menos el 90% del ancho útil', async ({ page }) => {
    await gotoRuntimeRoute(page, DESIGNER_SINGLE);

    const viewport = page.viewportSize();
    if (!viewport) throw new Error('viewport no disponible');

    const runtimeBox = await page.locator(RUNTIME_ROOT).boundingBox();
    const viewportBox = await page.locator(RUNTIME_VIEWPORT).boundingBox();
    const topbarBox = await page.locator('[data-testid="example-topbar"]').boundingBox();
    if (!runtimeBox || !viewportBox || !topbarBox) throw new Error('layout no medible');

    expect(runtimeBox.width).toBeGreaterThan(0);
    expect(runtimeBox.height).toBeGreaterThan(0);
    expect(runtimeBox.width).toBeGreaterThanOrEqual(viewport.width * 0.9);

    // El alto restante bajo la topbar, sin `vh` arbitrarios.
    expect(topbarBox.height).toBeLessThanOrEqual(64);
    expect(viewportBox.height).toBeGreaterThanOrEqual(viewport.height - topbarBox.height - 2);
  });

  test('la página no hace scroll mientras el Canvas sí', async ({ page }) => {
    await gotoRuntimeRoute(page, DESIGNER_SINGLE);

    const scroll = await page.evaluate(() => {
      const doc = document.documentElement;
      const scrollables = [...document.querySelectorAll('[data-sisad-pdfme-root] *')].filter((element) => {
        const overflow = getComputedStyle(element).overflowY;
        return (
          (overflow === 'auto' || overflow === 'scroll') && element.scrollHeight > element.clientHeight + 1
        );
      });
      return {
        pageScrolls: doc.scrollHeight > doc.clientHeight,
        runtimeScrollables: scrollables.length,
      };
    });

    expect(scroll.pageScrolls).toBe(false);
    expect(scroll.runtimeScrollables).toBeGreaterThan(0);
  });

  test('las sidebars nativas siguen visibles y no se duplican controles del runtime', async ({ page }) => {
    await gotoRuntimeRoute(page, DESIGNER_SINGLE);

    await expect(page.getByTestId('left-sidebar')).toBeVisible();
    await expect(page.getByTestId('sidebar-collapse-right')).toBeVisible();

    // Guardar y zoom pertenecen al runtime: el host no los reimplementa.
    await expect(page.getByTestId('designer-save')).toHaveCount(1);
    await expect(page.getByTestId('designer-zoom-select')).toHaveCount(1);
    await expect(page.locator('[data-example-topbar] [data-testid="designer-save"]')).toHaveCount(0);
  });

  test.describe('matriz responsive del collapse del sidebar izquierdo', () => {
    for (const viewport of DESIGNER_VIEWPORTS) {
      test(`mantiene el papel centrado en ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await gotoRuntimeRoute(page, DESIGNER_MULTI);

        const paper = page.locator(DESIGNER_PAPER).first();
        await expect(paper).toBeVisible();
        const canvas = page.locator(DESIGNER_CANVAS).first();
        await expect(canvas).toBeVisible();

        const sidebar = page.getByTestId('left-sidebar');
        await expect(sidebar).toBeVisible();
        const ensureSidebarExpanded = async () => {
          const collapsed = await sidebar.getAttribute('data-sidebar-collapsed');
          if (collapsed === 'true') {
            await page.getByTestId('sidebar-collapse-left').click();
            await expect.poll(async () => sidebar.getAttribute('data-sidebar-collapsed'), { timeout: 10_000 }).toBe('false');
          }
        };
        await ensureSidebarExpanded();

        const readCenters = async () => {
          const paperBox = await paper.boundingBox();
          const canvasBox = await canvas.boundingBox();
          if (!paperBox) throw new Error('paper no medible');
          if (!canvasBox) throw new Error('canvas no medible');
          return {
            paperCenterX: paperBox.x + paperBox.width / 2,
            canvasCenterX: canvasBox.x + canvasBox.width / 2,
          };
        };

        const before = await readCenters();
        expect(Math.abs(before.paperCenterX - before.canvasCenterX)).toBeLessThanOrEqual(viewport.maxCenterDelta);
        await page.getByTestId('sidebar-collapse-left').click();
        await expect
          .poll(async () => {
            const { paperCenterX, canvasCenterX } = await readCenters();
            return Math.abs(paperCenterX - canvasCenterX);
          }, { timeout: 10_000 })
          .toBeLessThanOrEqual(viewport.maxCenterDelta);
      });
    }
  });

  test('el drawer de información no consume espacio ni remonta el runtime', async ({ page }) => {
    await gotoRuntimeRoute(page, DESIGNER_SINGLE);
    await stampRuntimeHost(page);

    await expect(page.locator('[data-example-info-drawer]')).toHaveCount(0);
    const closedBox = await page.locator(RUNTIME_ROOT).boundingBox();

    await page.getByTestId('example-info-toggle').click();
    await expect(page.getByTestId('example-info-panel')).toBeVisible();
    const openBox = await page.locator(RUNTIME_ROOT).boundingBox();

    await page.getByRole('button', { name: 'Cerrar', exact: true }).click();
    await expect(page.locator('[data-example-info-drawer]')).toHaveCount(0);
    const reclosedBox = await page.locator(RUNTIME_ROOT).boundingBox();

    // Abierto se superpone: nunca reduce la caja del runtime.
    expect(openBox?.width).toBe(closedBox?.width);
    expect(reclosedBox?.width).toBe(closedBox?.width);
    expect(await runtimeHostIsStamped(page)).toBe(true);
  });

  test('ejecuta la API pública del controlador y recibe los eventos del componente', async ({ page }) => {
    // Cualquier método que la instancia no implemente avisa por consola; la
    // suite falla si el ejemplo vuelve a exponer una capacidad inexistente.
    const notImplemented: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'warning' && message.text().includes('not implemented')) {
        notImplemented.push(message.text());
      }
    });

    await gotoRuntimeRoute(page, DESIGNER_MULTI);
    await page.getByTestId('example-info-toggle').click();
    await expect(page.getByTestId('example-info-panel')).toBeVisible();

    const actions = [
      'read-template',
      'snapshot',
      'recipients',
      'rotate-recipient',
      'assign',
      'feature-state',
      'explain',
      'validate',
    ];

    for (const action of actions) {
      await page.getByTestId(`example-controller-${action}`).click();
      await expect(page.getByTestId('example-controller-result')).not.toHaveText('');
      await expect(page.getByTestId('example-controller-result')).not.toContainText('no está listo');
    }

    // Rotar recipient y asignar disparan callbacks reales del wrapper.
    await expect(page.locator('[data-testid="example-event-log"] li').first()).toBeVisible();
    expect(notImplemented).toEqual([]);
  });

  test('cambiar el recipient activo no remonta el runtime', async ({ page }) => {
    await gotoRuntimeRoute(page, DESIGNER_MULTI);
    await stampRuntimeHost(page);

    const recipientSelect = page.getByTestId('example-recipient-select');
    await expect(recipientSelect).toBeVisible();
    await recipientSelect.selectOption('bob');
    await expect(recipientSelect).toHaveValue('bob');

    expect(await runtimeHostIsStamped(page)).toBe(true);
  });
});

test.describe('rutas de runtime Form y Viewer', () => {
  test('Form usa el shell inmersivo y es editable', async ({ page }) => {
    await gotoRuntimeRoute(page, RUNTIME_FORM);

    const viewport = page.viewportSize();
    const runtimeBox = await page.locator(RUNTIME_ROOT).boundingBox();
    expect(runtimeBox?.width).toBeGreaterThanOrEqual((viewport?.width ?? 0) * 0.9);

    const editableCount = await page.evaluate(
      () =>
        document.querySelectorAll(
          '[data-sisad-pdfme-root] [contenteditable="true"], [data-sisad-pdfme-root] input:not([readonly]):not([disabled]), [data-sisad-pdfme-root] textarea:not([readonly])',
        ).length,
    );
    expect(editableCount).toBeGreaterThan(0);
  });

  test('Viewer usa el shell inmersivo y es de solo lectura', async ({ page }) => {
    await gotoRuntimeRoute(page, RUNTIME_VIEWER);

    const viewport = page.viewportSize();
    const runtimeBox = await page.locator(RUNTIME_ROOT).boundingBox();
    expect(runtimeBox?.width).toBeGreaterThanOrEqual((viewport?.width ?? 0) * 0.9);

    const editableCount = await page.evaluate(
      () =>
        document.querySelectorAll(
          '[data-sisad-pdfme-root] [contenteditable="true"], [data-sisad-pdfme-root] input:not([readonly]):not([disabled]), [data-sisad-pdfme-root] textarea:not([readonly])',
        ).length,
    );
    expect(editableCount).toBe(0);
  });

  test.describe('matriz responsive', () => {
    const VIEWPORTS = [
      { name: 'mobile-375', width: 375, height: 812 },
      { name: 'mobile-430', width: 430, height: 932 },
      { name: 'tablet-768', width: 768, height: 1024 },
      { name: 'laptop-1280', width: 1280, height: 720 },
      { name: 'desktop-1920', width: 1920, height: 1080 },
    ];

    for (const size of VIEWPORTS) {
      test(`sin overflow horizontal y con alto completo en ${size.name}`, async ({ page }) => {
        await page.setViewportSize({ width: size.width, height: size.height });
        await gotoRuntimeRoute(page, DESIGNER_SINGLE);

        const metrics = await page.evaluate(() => ({
          bodyScrollWidth: document.body.scrollWidth,
          bodyClientWidth: document.body.clientWidth,
          shellHeight: Math.round(
            document.querySelector('[data-example-shell="immersive"]')!.getBoundingClientRect().height,
          ),
          innerHeight: window.innerHeight,
        }));

        expect(metrics.bodyScrollWidth).toBeLessThanOrEqual(metrics.bodyClientWidth);
        expect(Math.abs(metrics.shellHeight - metrics.innerHeight)).toBeLessThanOrEqual(2);

        // El disparador de información conserva un target táctil usable.
        const toggleBox = await page.getByTestId('example-info-toggle').boundingBox();
        const minTarget = size.width < 768 ? 44 : 36;
        expect(toggleBox?.height ?? 0).toBeGreaterThanOrEqual(minTarget);
      });
    }
  });
});

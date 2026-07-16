import { test, expect } from '@playwright/test';

test.describe('canvas visual toggles', () => {
  test('shift-click keeps an existing canvas selection and exposes the multi-select toolbar', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    // Ambos schemas viven en la página 1: la selección múltiple es por página
    // (cambiar de página re-ancla la selección), así que el par debe compartirla.
    const first = page.locator('[data-schema-name="contract_name"]').first();
    const second = page.locator('[data-schema-name="contract_date"]').first();

    await expect(first).toBeVisible();
    await expect(second).toBeVisible();

    // Click por locator (auto-scroll): el segundo schema puede vivir en una
    // página inferior fuera del viewport inicial.
    await first.click({ position: { x: 8, y: 8 }, force: true });
    await expect(page.locator('.sisad-pdfme-designer-canvas')).toHaveAttribute('data-interaction-count', '1');

    await second.scrollIntoViewIfNeeded();
    await second.click({ position: { x: 8, y: 8 }, modifiers: ['Shift'], force: true });

    const canvas = page.locator('.sisad-pdfme-designer-canvas');
    const toolbar = page.locator('.sisad-pdfme-ui-selection-context-toolbar');

    await expect(canvas).toHaveAttribute('data-interaction-count', '2');
    await expect(toolbar).toBeVisible();
    await expect(toolbar).toHaveAttribute('data-selection-count', '2');
    // text + date comparten familia → 'multi' (el par original text+signature
    // de otra página daba 'mixed'; la selección múltiple es por página).
    await expect(toolbar).toHaveAttribute('data-selection-kind', 'multi');
  });

  test('guides and padding toggles remain synchronized with canvas data attributes', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const canvas = page.locator('.sisad-pdfme-designer-canvas').first();
    await expect(canvas).toBeVisible();

    const moreActions = page.locator('.sisad-pdfme-ui-control-bar [title="Más acciones"]').first();
    await expect(moreActions).toBeVisible();

    await moreActions.click();
    const guidesMenuItem = page.getByRole('menuitem', { name: /Ocultar guías|Mostrar guías/i }).first();
    const beforeGuides = await canvas.getAttribute('data-guides-visible');
    await guidesMenuItem.click();
    if (beforeGuides === 'true') {
      await expect(canvas).toHaveAttribute('data-guides-visible', 'false');
    } else {
      await expect(canvas).toHaveAttribute('data-guides-visible', 'true');
    }

    await moreActions.click();
    const paddingMenuItem = page.getByRole('menuitem', { name: /Ocultar padding|Mostrar padding/i }).first();
    const beforePadding = await canvas.getAttribute('data-padding-visible');
    await paddingMenuItem.click();
    if (beforePadding === 'true') {
      await expect(canvas).toHaveAttribute('data-padding-visible', 'false');
    } else {
      await expect(canvas).toHaveAttribute('data-padding-visible', 'true');
    }
  });

  test('dragging from catalog does not darken the full canvas', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const openCatalog = page.getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i }).first();
    await expect(openCatalog).toBeVisible();
    if ((await openCatalog.getAttribute('aria-expanded')) === 'false') {
      await openCatalog.click();
    }

    // Mismo flujo que drag-preview-and-canvas-scroll-regression (verde):
    // source por tipo y destino sobre un PAPER real (no el chrome del canvas,
    // donde +120,+120 cae sobre los pills del CtlBar).
    const source = page.locator('button[data-schema-type="text"]').first();
    await expect(source).toBeVisible();

    const paper = page.locator('.sisad-pdfme-paper-page').first();
    await paper.scrollIntoViewIfNeeded();
    await expect(paper).toBeVisible();

    const sourceBox = await source.boundingBox();
    const paperBox = await paper.boundingBox();
    expect(sourceBox).not.toBeNull();
    expect(paperBox).not.toBeNull();

    await page.mouse.move((sourceBox?.x || 0) + 12, (sourceBox?.y || 0) + 12);
    await page.mouse.down();
    await page.mouse.move((paperBox?.x || 0) + 80, (paperBox?.y || 0) + 120);

    // Sincroniza con el estado React del drag antes de inspeccionar atributos
    // (el evaluate inmediato corre antes de que el estado se propague).
    await expect(page.locator('.sisad-pdfme-schema-drag-preview')).toBeVisible();

    const probe = await page.evaluate(() => {
      const stage = document.querySelector('.sisad-pdfme-designer-stage') as HTMLElement | null;
      const controlBar = document.querySelector('.sisad-pdfme-ui-control-bar') as HTMLElement | null;
      const canvas = document.querySelector('.sisad-pdfme-designer-canvas') as HTMLElement | null;
      const canvasRect = canvas?.getBoundingClientRect();
      const firstPaper = document.querySelector('.sisad-pdfme-paper-page') as HTMLElement | null;
      const paperRect = firstPaper?.getBoundingClientRect();
      const masks = Array.from(document.querySelectorAll<HTMLElement>('.sisad-pdfme-designer-mask'))
        .filter((mask) =>
          getComputedStyle(mask).display !== 'none' &&
          getComputedStyle(mask).visibility !== 'hidden' &&
          Number(getComputedStyle(mask).opacity || '0') > 0,
        )
        .map((mask) => mask.getBoundingClientRect());
      // Cobertura sustancial, no contacto de borde: la máscara de páginas
      // vecinas se extiende -RULER_HEIGHT y roza el paper objetivo.
      const coversMostOf = (mask: DOMRect, target: DOMRect) => {
        const ix = Math.max(0, Math.min(mask.right, target.right) - Math.max(mask.left, target.left));
        const iy = Math.max(0, Math.min(mask.bottom, target.bottom) - Math.max(mask.top, target.top));
        const targetArea = Math.max(1, target.width * target.height);
        return (ix * iy) / targetArea >= 0.5;
      };
      return {
        schemaDragging: stage?.getAttribute('data-schema-dragging'),
        controlBarBackground: controlBar ? getComputedStyle(controlBar).backgroundColor : null,
        // La máscara es por-página (páginas NO activas). Lo prohibido es que
        // cubra todo el canvas o la página objetivo del drop.
        fullCanvasMasked: canvasRect
          ? masks.some((rect) => rect.width >= canvasRect.width * 0.9 && rect.height >= canvasRect.height * 0.9)
          : false,
        targetPageMasked: paperRect ? masks.some((rect) => coversMostOf(rect, paperRect)) : false,
      };
    });

    await page.mouse.up();

    expect(probe.schemaDragging).toBe('true');
    expect(probe.controlBarBackground).toBe('rgba(0, 0, 0, 0)');
    expect(probe.fullCanvasMasked).toBeFalsy();
    expect(probe.targetPageMasked).toBeFalsy();
  });
});

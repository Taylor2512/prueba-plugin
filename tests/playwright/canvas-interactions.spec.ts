import { test, expect } from '@playwright/test';

test.describe('canvas visual toggles', () => {
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
    const label = (await openCatalog.textContent()) || '';
    if (/Abrir catálogo/i.test(label)) {
      await openCatalog.click();
    }

    const source = page.getByRole('button', { name: /^Texto$/i }).first();
    await expect(source).toBeVisible();

    const canvas = page.locator('.sisad-pdfme-designer-canvas').first();
    await expect(canvas).toBeVisible();

    const sourceBox = await source.boundingBox();
    const canvasBox = await canvas.boundingBox();
    expect(sourceBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();

    await page.mouse.move((sourceBox?.x || 0) + 8, (sourceBox?.y || 0) + 8);
    await page.mouse.down();
    await page.mouse.move((canvasBox?.x || 0) + 120, (canvasBox?.y || 0) + 120);

    const probe = await page.evaluate(() => {
      const stage = document.querySelector('.sisad-pdfme-designer-stage') as HTMLElement | null;
      const controlBar = document.querySelector('.sisad-pdfme-ui-control-bar') as HTMLElement | null;
      const mask = document.querySelector('.sisad-pdfme-designer-mask') as HTMLElement | null;
      return {
        schemaDragging: stage?.getAttribute('data-schema-dragging'),
        controlBarBackground: controlBar ? getComputedStyle(controlBar).backgroundColor : null,
        maskVisible:
          mask &&
          getComputedStyle(mask).display !== 'none' &&
          getComputedStyle(mask).visibility !== 'hidden' &&
          Number(getComputedStyle(mask).opacity || '0') > 0,
      };
    });

    await page.mouse.up();

    expect(probe.schemaDragging).toBe('true');
    expect(probe.controlBarBackground).toBe('rgba(0, 0, 0, 0)');
    expect(probe.maskVisible).toBeFalsy();
  });
});

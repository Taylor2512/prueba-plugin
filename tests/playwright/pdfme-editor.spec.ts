import { test, expect } from '@playwright/test';

test.describe('pdfme editor canvas chrome', () => {
  test('renders distributed floating controls without reserving top bar space', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const controlBar = page.locator('.sisad-pdfme-ui-control-bar').first();
    await expect(controlBar).toBeVisible();

    const layout = await controlBar.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return {
        position: style.position,
        pointerEvents: style.pointerEvents,
      };
    });
    expect(layout.position).toBe('absolute');
    expect(layout.pointerEvents).toBe('none');

    const stage = page.locator('.sisad-pdfme-designer-stage').first();
    const canvas = page.locator('.sisad-pdfme-designer-canvas').first();
    const stageBox = await stage.boundingBox();
    const canvasBox = await canvas.boundingBox();
    expect(stageBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();
    expect(Math.abs((canvasBox?.y ?? 0) - (stageBox?.y ?? 0))).toBeLessThanOrEqual(2);

    await expect(page.locator('.sisad-pdfme-ui-control-bar-cluster--top-left').first()).toBeVisible();
    await expect(page.locator('.sisad-pdfme-ui-control-bar-cluster--top-center').first()).toBeVisible();
    await expect(page.locator('.sisad-pdfme-ui-control-bar-cluster--top-right').first()).toBeVisible();
    await expect(page.locator('.sisad-pdfme-ui-control-bar-cluster--bottom-right').first()).toBeVisible();
    await expect(page.locator('.sisad-pdfme-ui-control-bar [title="Guardar"]').first()).toBeVisible();
  });

  test('overflow menu toggles canvas grid visibility in sync with menu label', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const canvas = page.locator('.sisad-pdfme-designer-canvas').first();
    await expect(canvas).toBeVisible();

    const moreActions = page.locator('.sisad-pdfme-ui-control-bar [title="Más acciones"]').first();
    await expect(moreActions).toBeVisible();
    await moreActions.click();

    const gridMenuItem = page.getByRole('menuitem', { name: /Ocultar cuadrícula|Mostrar cuadrícula/i }).first();
    await expect(gridMenuItem).toBeVisible();

    const beforeAttr = await canvas.getAttribute('data-grid-visible');
    const beforeLabel = (await gridMenuItem.textContent()) || '';

    await gridMenuItem.click();

    if (beforeAttr === 'true') {
      await expect(canvas).toHaveAttribute('data-grid-visible', 'false');
      await expect
        .poll(async () =>
          canvas.evaluate((el) => {
            const style = getComputedStyle(el);
            return `${style.backgroundImage} | ${style.backgroundSize}`;
          }),
        )
        .not.toContain('24px');
    } else {
      await expect(canvas).toHaveAttribute('data-grid-visible', 'true');
      await expect
        .poll(async () =>
          canvas.evaluate((el) => {
            const style = getComputedStyle(el);
            return `${style.backgroundImage} | ${style.backgroundSize}`;
          }),
        )
        .toContain('24px');
    }

    await moreActions.click();
    const afterLabel = ((await page.getByRole('menuitem', { name: /Ocultar cuadrícula|Mostrar cuadrícula/i }).first().textContent()) || '').trim();
    expect(afterLabel).not.toBe(beforeLabel.trim());
  });
});

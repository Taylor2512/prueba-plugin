import { expect, test } from '@playwright/test';

test.describe('canvas overflow regression', () => {
  test('keeps the designer canvas scrollable and preserves page stack geometry', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const canvas = page.locator('.sisad-pdfme-designer-canvas').first();
    const stage = page.locator('.sisad-pdfme-designer-stage').first();
    const pages = page.locator('[data-paper-page="true"]');

    await expect(canvas).toBeVisible();
    await expect(stage).toBeVisible();
    await expect(pages.first()).toBeVisible();

    const pageCount = await pages.count();
    test.skip(pageCount < 2, 'multi-page fixture required for canvas overflow checks');

    const metrics = await canvas.evaluate((node) => {
      const style = window.getComputedStyle(node);
      return {
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        position: style.position,
        minHeight: style.minHeight,
        height: style.height,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
      };
    });

    expect(metrics.overflowX).toBe('auto');
    expect(metrics.overflowY).toBe('auto');
    expect(metrics.position).toBe('relative');
    expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);

    const stageBox = await stage.boundingBox();
    const canvasBox = await canvas.boundingBox();
    expect(stageBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();
    expect(Math.abs((canvasBox?.y ?? 0) - (stageBox?.y ?? 0))).toBeLessThanOrEqual(2);
    expect((canvasBox?.height ?? 0)).toBeGreaterThan(0);

    const pageRects = await pages.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, height: rect.height };
      }),
    );

    for (let index = 1; index < pageRects.length; index += 1) {
      expect(pageRects[index].top).toBeGreaterThan(pageRects[index - 1].top);
      expect(pageRects[index].top).toBeGreaterThan(pageRects[index - 1].bottom);
    }
  });
});

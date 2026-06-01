import { expect, test } from '@playwright/test';

const overlap = (a: { left: number; top: number; right: number; bottom: number }, b: { left: number; top: number; right: number; bottom: number }) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

test.describe('schema placement', () => {
  test('dropping same catalog field twice at the same point avoids overlap', async ({ page }) => {
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

    const targetPoint = {
      x: (canvasBox?.x || 0) + 180,
      y: (canvasBox?.y || 0) + 160,
    };

    const dragFromCatalog = async () => {
      await page.mouse.move((sourceBox?.x || 0) + 10, (sourceBox?.y || 0) + 10);
      await page.mouse.down();
      await page.mouse.move(targetPoint.x, targetPoint.y);
      await page.mouse.up();
    };

    const initialCount = await page.locator('.sisad-pdfme-ui-custom-selectable').count();

    await dragFromCatalog();
    await dragFromCatalog();

    await expect
      .poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable').count())
      .toBeGreaterThanOrEqual(initialCount + 2);

    const placed = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.sisad-pdfme-ui-custom-selectable')) as HTMLElement[];
      const recent = elements.slice(-2);
      return recent.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          id: element.id,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
        };
      });
    });

    expect(placed).toHaveLength(2);
    expect(overlap(placed[0], placed[1])).toBe(false);
  });
});

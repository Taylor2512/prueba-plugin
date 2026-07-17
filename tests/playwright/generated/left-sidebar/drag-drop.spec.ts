import { test, expect } from '@playwright/test';
import { canvas, leftSidebar, openDesigner } from '../fixtures/designer.fixture';

test.describe('LeftSidebar drag/drop', () => {
  test('arrastra Texto al Canvas con preview y commit', async ({ page }) => {
    await openDesigner(page);
    const sidebar = leftSidebar(page);
    const source = sidebar.getByText(/^Texto$/).last();
    const target = canvas(page);
    const before = await target.locator('[data-schema-id]').count();
    await source.dragTo(target, { targetPosition: { x: 300, y: 250 } });
    await expect.poll(() => target.locator('[data-schema-id]').count()).toBeGreaterThan(before);
  });

  test('drag no desplaza accidentalmente el catálogo', async ({ page }) => {
    await openDesigner(page);
    const sidebar = leftSidebar(page);
    const source = sidebar.getByText(/^Firma$/).last();
    test.skip(!(await source.count()), 'Firma no visible en catálogo');
    const scrollBefore = await sidebar.evaluate((node) => node.scrollTop);
    const sourceBox = await source.boundingBox();
    const canvasBox = await canvas(page).boundingBox();
    if (!sourceBox || !canvasBox) return;
    await page.mouse.move(sourceBox.x + 10, sourceBox.y + 10);
    await page.mouse.down();
    await page.mouse.move(canvasBox.x + 300, canvasBox.y + 250, { steps: 10 });
    await page.mouse.up();
    const scrollAfter = await sidebar.evaluate((node) => node.scrollTop);
    expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(8);
  });
});

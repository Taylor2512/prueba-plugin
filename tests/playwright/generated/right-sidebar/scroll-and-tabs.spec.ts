import { test, expect } from '@playwright/test';
import {
  countScrollableDescendants,
  openDesigner,
  openPanel,
  rightSidebar,
} from '../fixtures/designer.fixture';

test.describe('RightSidebar scroll y tabs', () => {
  for (const width of [390, 318, 256]) {
    test(`tabs no hacen wrap con ancho ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await openDesigner(page);
      const sidebar = rightSidebar(page);
      await sidebar.evaluate((node, value) => { (node as HTMLElement).style.width = `${value}px`; }, width);
      const tabs = sidebar.getByRole('tab');
      if (await tabs.count()) {
        const tops = await tabs.evaluateAll((nodes) => nodes.filter((node) => (node as HTMLElement).offsetParent).map((node) => Math.round(node.getBoundingClientRect().top)));
        expect(new Set(tops).size).toBe(1);
      }
    });
  }

  test('cada panel tiene como máximo un propietario scrollable activo', async ({ page }) => {
    await openDesigner(page);
    for (const panel of [/Campos/i, /Docs/i, /Comentarios/i]) {
      const control = page.getByRole('tab', { name: panel }).or(page.getByRole('button', { name: panel })).last();
      if (!(await control.count())) continue;
      await openPanel(page, panel);
      expect(await countScrollableDescendants(rightSidebar(page))).toBeLessThanOrEqual(1);
    }
  });

  test('Fields puede llegar al último campo sin mover el header', async ({ page }) => {
    await openDesigner(page);
    await openPanel(page, /Campos/i);
    const sidebar = rightSidebar(page);
    const header = sidebar.getByText(/^Campos$/).last();
    const before = await header.boundingBox();
    await sidebar.evaluate((root) => {
      const candidates = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[];
      const scroller = candidates.find((node) => /(auto|scroll)/.test(getComputedStyle(node).overflowY) && node.scrollHeight > node.clientHeight);
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    });
    const after = await header.boundingBox();
    if (before && after) expect(Math.abs(before.y - after.y)).toBeLessThan(2);
  });
});

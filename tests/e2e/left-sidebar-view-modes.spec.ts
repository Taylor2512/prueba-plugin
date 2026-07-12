import { expect, test } from '@playwright/test';

const openCatalog = async (page: import('@playwright/test').Page) => {
  const toggle = page.getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i }).first();
  await expect(toggle).toBeVisible();
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

const dragTileToCanvas = async (page: import('@playwright/test').Page, tileName: string) => {
  const tile = page.locator(`button[data-testid="left-sidebar-schema-tile"][data-schema-type="${tileName}"]`).first();
  await expect(tile).toBeVisible();
  const canvas = page.locator('.sisad-pdfme-designer-canvas').first();
  await expect(canvas).toBeVisible();

  const tileBox = await tile.boundingBox();
  const canvasBox = await canvas.boundingBox();
  expect(tileBox).not.toBeNull();
  expect(canvasBox).not.toBeNull();

  await page.mouse.move((tileBox?.x || 0) + 12, (tileBox?.y || 0) + 12);
  await page.mouse.down();
  await page.mouse.move((canvasBox?.x || 0) + 120, (canvasBox?.y || 0) + 120);

  await expect(page.locator('.sisad-pdfme-designer-stage')).toHaveAttribute('data-schema-dragging', 'true');
  await page.mouse.up();
  await expect(page.locator('.sisad-pdfme-designer-stage')).toHaveAttribute('data-schema-dragging', 'false');
};

test.describe('left sidebar view modes', () => {
  test('search, favorites, recent and drag stay consistent across view modes', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await openCatalog(page);

    const sidebar = page.getByTestId('left-sidebar').first();
    await expect(sidebar).toBeVisible();

    const search = sidebar.getByTestId('left-sidebar-search').first();
    await expect(search).toBeVisible();
    const tiles = sidebar.getByTestId('left-sidebar-schema-tile');
    const allCount = await tiles.count();
    expect(allCount).toBeGreaterThan(0);

    await test.step('search narrows and recovers', async () => {
      await search.fill('firma');
      await expect.poll(async () => tiles.count()).toBeLessThan(allCount);
      await search.fill('');
      await expect.poll(async () => tiles.count()).toBe(allCount);
    });

    await test.step('favorites and recent filters are available', async () => {
      await sidebar.getByTestId('left-sidebar-filter-favorites').click();
      await expect(sidebar).toContainText(/Favoritos/i);
      await sidebar.getByTestId('left-sidebar-filter-all').click();
      await sidebar.getByTestId('left-sidebar-filter-recent').click();
      await expect(sidebar).toContainText(/Recientes/i);
      await sidebar.getByTestId('left-sidebar-filter-all').click();
    });

    await test.step('view switcher exposes explicit layout buttons', async () => {
      const richView = sidebar.getByTestId('left-sidebar-view-rich');
      const compactView = sidebar.getByTestId('left-sidebar-view-compact');
      const miniView = sidebar.getByTestId('left-sidebar-view-mini');

      await expect(richView).toBeVisible();
      await expect(compactView).toBeVisible();
      await expect(miniView).toBeVisible();

      await richView.click();
      await expect(richView).toHaveAttribute('data-active', 'true');
      await expect(tiles.first()).toHaveAttribute('data-view-mode', 'rich');

      await compactView.click();
      await expect(compactView).toHaveAttribute('data-active', 'true');
      await expect(tiles.first()).toHaveAttribute('data-view-mode', 'compact');

      await miniView.click();
      await expect(miniView).toHaveAttribute('data-active', 'true');
      await expect(tiles.first()).toHaveAttribute('data-view-mode', 'mini');
    });

    await test.step('drag starts the same way in the visible layout', async () => {
      const mode = await tiles.first().getAttribute('data-view-mode');
      await dragTileToCanvas(page, 'text');
      if (mode) {
        await expect(tiles.first()).toHaveAttribute('data-view-mode', mode);
      }
    });
  });
});

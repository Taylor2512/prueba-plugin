import { expect, test, type Page } from '@playwright/test';

const openCatalog = async (page: Page) => {
  const toggle = page.getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i }).first();
  await expect(toggle).toBeVisible();
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

test.describe('left sidebar drag scroll guard', () => {
  test('wheel does not move the sidebar while a palette drag is active', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await openCatalog(page);

    const scrollContainer = page.locator('[data-left-sidebar-scroll="true"]').first();
    await expect(scrollContainer).toBeVisible();
    await scrollContainer.evaluate((element) => {
      element.scrollTop = 240;
    });
    const before = await scrollContainer.evaluate((element) => element.scrollTop);

    const tile = page.locator('button[data-testid="left-sidebar-schema-tile"][data-schema-type="text"]').first();
    await expect(tile).toBeVisible();
    const tileBox = await tile.boundingBox();
    const scrollBox = await scrollContainer.boundingBox();
    expect(tileBox).not.toBeNull();
    expect(scrollBox).not.toBeNull();

    await page.mouse.move((tileBox?.x || 0) + 12, (tileBox?.y || 0) + 12);
    await page.mouse.down();
    await expect(page.getByTestId('left-sidebar')).toHaveAttribute('data-sidebar-scroll-locked', 'true');
    await page.mouse.move((scrollBox?.x || 0) + 40, (scrollBox?.y || 0) + 80);
    await expect(page.locator('[data-sidebar-scroll-locked="true"]').first()).toBeVisible();
    await page.mouse.wheel(0, 420);

    await expect.poll(async () => scrollContainer.evaluate((element) => element.scrollTop)).toBe(before);
    await page.mouse.up();
  });
});

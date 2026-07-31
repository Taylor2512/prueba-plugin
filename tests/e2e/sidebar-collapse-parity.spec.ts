import { expect, test } from '@playwright/test';

const ROUTE = '/examples/designer/single-user';

const openCatalog = async (page: import('@playwright/test').Page) => {
  const toggle = page.getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i }).first();
  await expect(toggle).toBeVisible();
  if (await toggle.getAttribute('aria-expanded') === 'false') {
    await toggle.click();
  }
};

test.describe('sidebar collapse parity', () => {
  test('left and right sidebars keep a visible handle and a compact rail', async ({ page }) => {
    await page.goto(ROUTE);
    await openCatalog(page);

    const leftSidebar = page.getByTestId('left-sidebar').first();
    const leftToggle = leftSidebar.getByRole('button', { name: /Cerrar catálogo de campos|Abrir catálogo de campos/i }).first();
    const rightSidebar = page.locator('.sisad-pdfme-designer-right-sidebar').first();
    const rightToggle = page.getByRole('button', { name: /Ocultar panel derecho|Mostrar panel derecho/i }).first();

    await expect(leftToggle).toBeVisible();
    await expect(rightToggle).toBeVisible();
    await expect(leftToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(rightToggle).toHaveAttribute('aria-expanded', 'true');

    const leftToggleBox = await leftToggle.boundingBox();
    const leftSidebarBox = await leftSidebar.boundingBox();
    expect(leftToggleBox).not.toBeNull();
    expect(leftSidebarBox).not.toBeNull();
    expect((leftToggleBox?.x || 0)).toBeGreaterThanOrEqual((leftSidebarBox?.x || 0));

    await leftToggle.click();
    await expect(leftSidebar).toHaveAttribute('data-sidebar-collapsed', 'true');
    await expect(leftSidebar).toHaveAttribute('data-left-sidebar-expanded', 'false');
    await expect(leftToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(leftToggle).toBeVisible();
    const collapsedLeftSidebarBox = await leftSidebar.boundingBox();
    expect(collapsedLeftSidebarBox).not.toBeNull();
    expect((collapsedLeftSidebarBox?.width || 0)).toBeLessThan(96);
    await leftToggle.click();
    await expect(leftSidebar).toHaveAttribute('data-left-sidebar-expanded', 'true');

    await rightToggle.click();
    await expect(rightSidebar).toHaveAttribute('data-sidebar-collapsed', 'true');
    await expect(rightSidebar).toHaveAttribute('data-right-sidebar-expanded', 'false');
    await expect(page.locator('.sisad-pdfme-designer-right-sidebar-collapsed-rail')).toBeVisible();
    await expect(page.locator('.sisad-pdfme-designer-sidebar-rail-btn').first()).toBeVisible();

    const rightSidebarBox = await rightSidebar.boundingBox();
    expect(rightSidebarBox).not.toBeNull();
    expect((rightSidebarBox?.width || 0)).toBeLessThan(96);

    await page.locator('.sisad-pdfme-designer-sidebar-rail-btn').first().click();
    await expect(rightSidebar).toHaveAttribute('data-right-sidebar-expanded', 'true');

    await expect(page.locator('.sisad-pdfme-designer-canvas')).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1 || document.body.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBeFalsy();
  });
});

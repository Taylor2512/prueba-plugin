/**
 * TASK-UI-015 / TASK-QA-015 — rails colapsados: cada icono visible es
 * accionable (handler + aria + testid), expandir vuelve al panel correcto y
 * Guardar no se solapa con el rail derecho.
 */
import { expect, test } from '@playwright/test';

const boxesIntersect = (
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) => a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;

test.describe('sidebar rail collapse actions', () => {
  test('right rail keeps actionable icons and restores the requested panel', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const rightToggle = page.getByTestId('sidebar-collapse-right').first();
    await expect(rightToggle).toBeVisible();
    await expect(rightToggle).toHaveAttribute('aria-expanded', 'true');

    await rightToggle.click();
    const rightSidebar = page.locator('.sisad-pdfme-designer-right-sidebar').first();
    await expect(rightSidebar).toHaveAttribute('data-sidebar-collapsed', 'true');

    // Todo icono del rail es accionable: aria-label + testid + enabled.
    const railButtons = page.locator('.sisad-pdfme-designer-sidebar-rail-btn');
    const railCount = await railButtons.count();
    expect(railCount).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < railCount; i += 1) {
      const btn = railButtons.nth(i);
      await expect(btn).toBeVisible();
      await expect(btn).toBeEnabled();
      const aria = await btn.getAttribute('aria-label');
      const testId = await btn.getAttribute('data-testid');
      expect(aria, `rail button ${i} aria-label`).toBeTruthy();
      expect(testId, `rail button ${i} data-testid`).toMatch(/^sidebar-rail-right-/);
    }

    // Expandir desde el rail vuelve al panel elegido (Detalle).
    const detailRailBtn = page.getByTestId('sidebar-rail-right-detail');
    if (await detailRailBtn.count()) {
      await detailRailBtn.click();
      await expect(rightSidebar).toHaveAttribute('data-right-sidebar-expanded', 'true');
      await expect(page.getByRole('tab', { name: 'Abrir panel Detalle' })).toHaveAttribute('aria-selected', 'true');
    } else {
      await railButtons.first().click();
      await expect(rightSidebar).toHaveAttribute('data-right-sidebar-expanded', 'true');
    }
  });

  test('left catalog toggle works from its handle and Save never overlaps the right rail', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const leftToggle = page.getByTestId('sidebar-collapse-left').first();
    await expect(leftToggle).toBeVisible();
    const initiallyExpanded = (await leftToggle.getAttribute('aria-expanded')) === 'true';
    await leftToggle.click();
    await expect(leftToggle).toHaveAttribute('aria-expanded', initiallyExpanded ? 'false' : 'true');
    await leftToggle.click();
    await expect(leftToggle).toHaveAttribute('aria-expanded', initiallyExpanded ? 'true' : 'false');

    // Guardar (si el host lo provee) no se solapa con el rail derecho colapsado.
    await page.getByTestId('sidebar-collapse-right').first().click();
    const saveButton = page.getByTestId('designer-save').first();
    const rail = page.locator('.sisad-pdfme-designer-right-sidebar-collapsed-rail').first();
    if ((await saveButton.count()) && (await rail.count())) {
      const saveBox = await saveButton.boundingBox();
      const railBox = await rail.boundingBox();
      if (saveBox && railBox) {
        expect(boxesIntersect(saveBox, railBox)).toBe(false);
      }
    }

    // Sin overflow horizontal tras colapsos.
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBeFalsy();
  });
});

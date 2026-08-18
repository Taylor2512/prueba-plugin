import { expect, test } from '@playwright/test';
import { abrirDesigner } from '../../support/playwright';

/** QH-013/QH-014 — el candado de fila debe ser un toggle real de readOnly. */
test.describe('candado de solo lectura del RightSidebar', () => {
  test('activa y desactiva solo lectura sin desmontar la fila', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');

    const toggles = page.locator('[data-testid="right-sidebar-field-readonly-toggle"]');
    await expect(toggles.first()).toBeVisible();

    const toggle = toggles.first();
    const row = toggle.locator('xpath=ancestor::*[@data-testid="right-sidebar-field-item"]').first();
    await expect(row).toBeVisible();

    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveAttribute('data-readonly', 'true');
    await expect(row).toBeVisible();
    await expect(row).toHaveAttribute('data-readonly', 'true');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect(toggle).toHaveAttribute('data-readonly', 'false');
    await expect(row).toBeVisible();
  });

  test('el shortcut L alterna el bloqueo de posición, no readOnly', async ({ page }) => {
    await abrirDesigner(page, '/designer/single-user');
    const row = page.locator('[data-testid="right-sidebar-field-item"]').first();
    const hitTarget = row.locator('button[class*="list-view-item-hit-target"]');
    const toggle = row.locator('[data-testid="right-sidebar-field-readonly-toggle"]');
    await expect(hitTarget).toBeVisible();
    await hitTarget.click();
    await page.keyboard.press('l');
    // El shortcut de la captura es de posición; nunca debe activar readOnly.
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });
});


import { test, expect } from '@playwright/test';
import {
  abrirDesigner,
  selectores,
} from '../../support/playwright';

test.describe('Accesibilidad — catálogo, teclado y foco', () => {
  // @caso UC-34
  // @caso SID-003
  test('UC-34 — los schemas arrastrables tienen nombre accesible, rol y descripción de drag', async ({ page }) => {
    await abrirDesigner(page, '/designer/multi-user');
    const buttons = page.locator(selectores.catalogoArrastrable);
    await expect(buttons.first()).toBeVisible();
    const count = await buttons.count();
    expect(count).toBeGreaterThan(10);

    for (let i = 0; i < Math.min(count, 20); i += 1) {
      const button = buttons.nth(i);
      await expect.soft(button).toHaveAttribute('aria-roledescription', 'draggable');
      const label = (await button.getAttribute('aria-label')) || (await button.getAttribute('title')) || (await button.textContent());
      expect.soft(String(label || '').trim().length, `nombre accesible del item ${i}`).toBeGreaterThan(0);
    }
  });

  // @caso CMD-015
  // @caso UC-34
  test('CMD-015 — el foco por Tab alcanza controles del diseñador sin quedar atrapado', async ({ page }) => {
    await abrirDesigner(page, '/designer/multi-user');
    const first = page.locator(selectores.catalogoArrastrable).first();
    await expect(first).toBeVisible();
    await first.focus();
    await expect(first).toBeFocused();
    await first.press('Tab');
    const activeTag = await page.evaluate(() => document.activeElement?.tagName || '');
    expect(activeTag).not.toBe('BODY');
  });
});

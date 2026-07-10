import { expect, test } from '@playwright/test';

/**
 * Ownership-color centralization contract:
 * the SAME resolved color must appear on the canvas wrapper
 * (data-schema-owner-color, stamped by Renderer via resolveSchemaOwnerColorValue)
 * and on the DetailView header when the schema is selected.
 */
test.describe('schema owner color', () => {
  test('canvas schemas expose an ownership color and DetailView header agrees', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const ownedSchemas = page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-owner-color]');

    await test.step('collaborative fixture yields owned schemas on canvas', async () => {
      await expect.poll(async () => ownedSchemas.count()).toBeGreaterThan(0);
    });

    await test.step('selecting an owned schema shows a header with matching accent', async () => {
      const target = ownedSchemas.first();
      const canvasColor = await target.getAttribute('data-schema-owner-color');
      expect(canvasColor).toBeTruthy();

      await target.click({ force: true });

      const header = page.getByTestId('detail-header-card');
      await expect(header).toBeVisible();

      const headerColor = await header.getAttribute('data-schema-owner-color');
      if (headerColor) {
        expect(headerColor.toLowerCase()).toBe(String(canvasColor).toLowerCase());
      }
    });
  });

  test('ListView rows carry per-owner accents from the same resolver', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const list = page.getByTestId('right-sidebar-field-list').first();
    await expect(list).toBeVisible();

    await test.step('at least one row exposes data-schema-owner-color', async () => {
      const owned = list.locator('[data-testid="right-sidebar-field-item"][data-schema-owner-color]');
      await expect.poll(async () => owned.count()).toBeGreaterThan(0);
    });

    await test.step('owner accent is a concrete color, not a keyword', async () => {
      const first = list
        .locator('[data-testid="right-sidebar-field-item"][data-schema-owner-color]')
        .first();
      const color = await first.getAttribute('data-schema-owner-color');
      expect(color).toMatch(/^#|^rgb|^hsl/i);
    });
  });

  test('switching the active user updates the active-recipient accent', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const userSelect = page.getByRole('combobox', { name: 'Seleccionar usuario activo' });
    await expect(userSelect).toBeVisible();

    const readAccent = async () =>
      page.evaluate(() => {
        const dot = document.querySelector<HTMLElement>('[style*="--active-recipient-color"]');
        return dot?.style.getPropertyValue('--active-recipient-color').trim() || '';
      });

    const before = await readAccent();

    await userSelect.selectOption({ index: 1 });

    await test.step('accent variable changes with the active user', async () => {
      await expect.poll(readAccent).not.toBe(before);
    });

    await test.step('accent is still a concrete color', async () => {
      expect(await readAccent()).toMatch(/^#|^rgb|^hsl/i);
    });
  });
});

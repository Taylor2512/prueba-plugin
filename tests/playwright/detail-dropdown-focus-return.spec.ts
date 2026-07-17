import { expect, test } from '@playwright/test';

const ROUTE = '/lab/multi-document-routing';
const SCHEMA_NAME = 'routing-primary-showcase_attachment';

test.describe('detail dropdown focus return', () => {
  test('Escape closes the contextual menu and returns focus to the trigger', async ({ page }) => {
    await page.goto(ROUTE);

    const schema = page.locator(`.sisad-pdfme-ui-custom-selectable[data-schema-name="${SCHEMA_NAME}"]`).first();
    await expect(schema).toBeVisible();
    await schema.scrollIntoViewIfNeeded();
    await schema.click({ force: true });

    const toolbar = page.locator('.sisad-pdfme-ui-selection-context-toolbar');
    await expect(toolbar).toBeVisible();

    const moreButton = toolbar.getByRole('button', { name: 'Más acciones' });
    await moreButton.click();

    const menu = page.locator('.sisad-pdfme-ui-canvas-context-menu');
    await expect(menu).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(menu).toHaveCount(0);
    await expect.poll(async () =>
      {
        await page.bringToFront();
        await page.waitForFunction(() => document.hasFocus());
        return page.evaluate(
          () => {
            const activeElement = document.activeElement;
            if (!(activeElement instanceof HTMLElement)) return null;
            return activeElement.closest<HTMLElement>('[data-schema-name]')?.getAttribute('data-schema-name') ?? null;
          },
        );
      },
      { timeout: 15000 },
    ).toBe(SCHEMA_NAME);
    await expect(schema).toHaveAttribute('data-schema-active', 'true');
  });
});

import { expect, test } from '@playwright/test';

test.describe('detailview switches', () => {
  test('attachment file rules toggle with a single click', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_attachment"]').first().click({ force: true });

    const behaviorSection = page.locator('section[data-section="behavior"]');
    await expect(behaviorSection).toBeVisible();

    const switches = behaviorSection.getByRole('switch');
    await expect(switches).toHaveCount(4);

    for (let index = 0; index < 4; index += 1) {
      const switchLocator = switches.nth(index);
      const before = (await switchLocator.getAttribute('aria-checked')) || 'false';
      const expectedAfter = before === 'true' ? 'false' : 'true';

      await switchLocator.click();
      await expect(switchLocator).toHaveAttribute('aria-checked', expectedAfter);

      await switchLocator.click();
      await expect(switchLocator).toHaveAttribute('aria-checked', before);
    }
  });
});

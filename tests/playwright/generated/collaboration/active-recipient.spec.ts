import { test, expect } from '@playwright/test';
import { openDesigner } from '../fixtures/designer.fixture';

test.describe('Usuario activo y colaboración', () => {
  test('selector permanece visible en el shell', async ({ page }) => {
    await openDesigner(page);
    const selector = page.getByTestId('designer-active-recipient-select');
    const empty = page.getByTestId('designer-active-recipient-empty');
    expect((await selector.count()) + (await empty.count())).toBeGreaterThan(0);
  });

  test('cambiar usuario actualiza el valor controlado', async ({ page }) => {
    await openDesigner(page);
    const selector = page.getByTestId('designer-active-recipient-select');
    test.skip(!(await selector.count()), 'El ejemplo no habilita recipients');
    const options = await selector.locator('option').evaluateAll((nodes) => nodes.map((node) => (node as HTMLOptionElement).value).filter(Boolean));
    test.skip(options.length < 2, 'Solo existe un recipient');
    await selector.selectOption(options[1]);
    await expect(selector).toHaveValue(options[1]);
  });

  test('selector no desaparece al cambiar panel derecho', async ({ page }) => {
    await openDesigner(page);
    const selector = page.getByTestId('designer-active-recipient-select');
    test.skip(!(await selector.count()), 'El ejemplo no habilita recipients');
    for (const name of [/Campos/i, /Docs/i]) {
      const control = page.getByRole('tab', { name }).or(page.getByRole('button', { name })).last();
      if (await control.count()) await control.click();
      await expect(selector).toBeVisible();
    }
  });
});

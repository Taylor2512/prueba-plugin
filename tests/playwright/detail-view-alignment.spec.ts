import { expect, test } from '@playwright/test';

test.describe('detail-view alignment', () => {
  test('alignment buttons move x/y and disable distribution for single selection', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await page
      .locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]')
      .first()
      .click({ force: true });

    await expect(page.getByTestId('detail-header-card')).toBeVisible();

    // The layout section starts collapsed and the inspector re-mounts while a
    // schema stays selected (known churn), which resets the collapse state — so
    // every read re-expands the section if needed before touching the input.
    const layoutSection = page.getByTestId('detail-section-layout');
    const ensureExpanded = async () => {
      if ((await layoutSection.getAttribute('data-collapsed')) === 'true') {
        await page
          .getByRole('button', { name: 'Expandir sección Ubicación y tamaño' })
          .click({ timeout: 2000 })
          .catch(() => {});
      }
    };
    const readValue = async (selector: string) => {
      await ensureExpanded();
      try {
        return Number(await page.locator(selector).inputValue({ timeout: 1500 }));
      } catch {
        return Number.NaN;
      }
    };

    await expect.poll(() => readValue('input#position_x')).not.toBeNaN();
    const initialX = await readValue('input#position_x');
    const initialY = await readValue('input#position_y');

    await page.getByRole('button', { name: 'Alinear a la izquierda' }).click();
    await expect.poll(() => readValue('input#position_x')).not.toBe(initialX);

    await page.getByRole('button', { name: 'Alinear a la derecha' }).click();
    await expect.poll(() => readValue('input#position_x')).not.toBe(initialX);

    await page.getByRole('button', { name: 'Alinear arriba' }).click();
    await expect.poll(() => readValue('input#position_y')).not.toBe(initialY);

    await page.getByRole('button', { name: 'Alinear abajo' }).click();
    await expect.poll(() => readValue('input#position_y')).not.toBe(initialY);

    await expect(page.getByRole('button', { name: 'Distribuir verticalmente' })).toBeDisabled();
    await expect(page.getByRole('button', { name: 'Distribuir horizontalmente' })).toBeDisabled();
  });
});

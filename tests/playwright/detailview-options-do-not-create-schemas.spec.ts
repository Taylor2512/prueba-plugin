import { expect, test } from '@playwright/test';

/**
 * Adding/editing options in the inspector must mutate ONLY the selected schema:
 * never spawn a new schema on canvas, never change the schema's type.
 */
test.describe('DetailView · options editor does not create schemas', () => {
  test('adding an option to contract_stage keeps the canvas schema count and type', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const canvasSchemas = page.locator('.sisad-pdfme-ui-custom-selectable');
    await expect.poll(async () => canvasSchemas.count()).toBeGreaterThan(0);
    const initialCanvasCount = await canvasSchemas.count();

    await page
      .locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_stage"]')
      .first()
      .click({ force: true });

    const section = page.getByTestId('detail-options-section');
    await expect(section.first()).toBeVisible();

    const rows = section.getByTestId('option-row');
    const initialRows = await rows.count();
    expect(initialRows).toBeGreaterThanOrEqual(3);

    await test.step('add an option (retrying across inspector remounts)', async () => {
      await expect
        .poll(
          async () => {
            try {
              const input = section.getByTestId('option-new-input').first();
              await input.fill('En revisión QA', { timeout: 1200 });
              await input.press('Enter', { timeout: 1200 });
            } catch {
              /* inspector remounted mid-action — retry */
            }
            return rows.count();
          },
          { timeout: 20000 },
        )
        .toBeGreaterThan(initialRows);
    });

    await test.step('no new schema appeared on canvas', async () => {
      await expect.poll(async () => canvasSchemas.count()).toBe(initialCanvasCount);
    });

    await test.step('the selected schema is still a select', async () => {
      await expect(
        page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_stage"]').first(),
      ).toHaveAttribute('data-schema-type', 'select');
    });

    await test.step('cleanup: remove the added option', async () => {
      await expect
        .poll(
          async () => {
            try {
              const target = section
                .getByTestId('option-row')
                .filter({ has: page.getByTestId('option-label-input') })
                .last();
              await target.getByTestId('option-delete-button').click({ timeout: 1200 });
            } catch {
              /* remount — retry */
            }
            return rows.count();
          },
          { timeout: 20000 },
        )
        .toBe(initialRows);
    });
  });
});

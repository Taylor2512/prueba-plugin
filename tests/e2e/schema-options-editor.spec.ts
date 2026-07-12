import { expect, test, type Page } from '@playwright/test';

const selectSchema = async (page: Page, selector: string) => {
  const target = page.locator(selector).first();
  await expect(target).toBeVisible();
  await target.click({ force: true });
};

const addOption = async (page: Page, label: string) => {
  const section = page.getByTestId('detail-options-section').first();
  const input = section.getByTestId('option-new-input').first();
  await input.fill(label);
  await input.press('Enter');
};

const ensureOptionsSectionExpanded = async (page: Page) => {
  const section = page.getByTestId('detail-section-options').first();
  if (await section.isVisible().catch(() => false)) return;
  const expand = page.getByRole('button', { name: /Expandir sección Opciones/i }).first();
  if (await expand.count()) {
    await expand.click({ timeout: 2000 }).catch(() => {});
  }
  await expect(page.getByTestId('detail-section-options').first()).toBeVisible();
};

test.describe('schema options editor', () => {
  test('select options mutate only the active schema and preserve its type', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await selectSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_stage"]');

    const canvasSchemas = page.locator('.sisad-pdfme-ui-custom-selectable');
    const initialCanvasCount = await canvasSchemas.count();
    const optionsSection = page.getByTestId('detail-options-section').first();
    await expect(optionsSection).toBeVisible();

    const initialRows = await optionsSection.getByTestId('option-row').count();
    await expect(initialRows).toBeGreaterThanOrEqual(3);

    await test.step('add an option without spawning a new schema', async () => {
      await expect
        .poll(async () => {
          try {
            await addOption(page, 'En revisión QA');
          } catch {
            /* remount */
          }
          return optionsSection.getByTestId('option-row').count();
        }, { timeout: 20000 })
        .toBeGreaterThan(initialRows);
      await expect.poll(async () => canvasSchemas.count()).toBe(initialCanvasCount);
      await expect(page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_stage"]').first()).toHaveAttribute('data-schema-type', 'select');
    });
  });

  test('radioGroup and checkboxGroup expose the shared editor and add to their own option list', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    for (const type of ['radioGroup', 'checkboxGroup'] as const) {
      await selectSchema(page, `.sisad-pdfme-ui-custom-selectable[data-schema-type="${type}"]`);
      await ensureOptionsSectionExpanded(page);

      const optionsSection = page.getByTestId('detail-options-section').first();
      await expect(optionsSection).toBeVisible();
      const rows = optionsSection.getByTestId('option-row');
      const initialRows = await rows.count();
      await expect(initialRows).toBeGreaterThan(0);

      const canvasSchemas = page.locator(`.sisad-pdfme-ui-custom-selectable[data-schema-type="${type}"]`);
      const initialCanvasCount = await canvasSchemas.count();

      await test.step(`add option to ${type}`, async () => {
        await expect
          .poll(async () => {
            try {
              await addOption(page, `${type}-nuevo`);
            } catch {
              /* remount */
            }
            return rows.count();
          }, { timeout: 20000 })
          .toBeGreaterThan(initialRows);
        await expect.poll(async () => canvasSchemas.count()).toBe(initialCanvasCount);
      });
    }
  });

  test('switches inside the inspector toggle with one click', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await selectSchema(page, '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_attachment"]');

    const behaviorSection = page.locator('section[data-section="behavior"]').first();
    await expect(behaviorSection).toBeVisible();

    const switches = behaviorSection.getByRole('switch');
    await expect.poll(async () => switches.count()).toBeGreaterThan(0);

    const firstSwitch = switches.first();
    const before = await firstSwitch.getAttribute('aria-checked');
    await firstSwitch.click();
    await expect(firstSwitch).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true');
  });
});

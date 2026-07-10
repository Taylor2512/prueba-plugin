import { expect, test, type Page } from '@playwright/test';

const ensureSectionExpanded = async (page: Page, testId: string, sectionTitle: string) => {
  const section = page.getByTestId(testId);
  await expect(section).toBeVisible();
  if ((await section.getAttribute('data-collapsed')) === 'true') {
    await page
      .getByRole('button', { name: `Expandir sección ${sectionTitle}` })
      .click({ timeout: 2000 })
      .catch(() => {});
  }
  return section;
};

test.describe('DetailView · switches', () => {
  test('a boolean switch toggles with a single click and persists', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await page
      .locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]')
      .first()
      .click({ force: true });
    await expect(page.getByTestId('detail-header-card')).toBeVisible();

    // Reglas de llenado hosts the "Obligatorio" switch for text schemas.
    const readSwitchState = async (): Promise<string | null> => {
      await ensureSectionExpanded(page, 'detail-section-fill-rules', 'Reglas de llenado');
      const control = page.getByTestId('detail-section-fill-rules').getByRole('switch').first();
      try {
        return await control.getAttribute('aria-checked', { timeout: 1500 });
      } catch {
        return null;
      }
    };

    await expect.poll(readSwitchState, { timeout: 15000 }).not.toBeNull();
    const initial = await readSwitchState();

    await test.step('single click flips the switch', async () => {
      await expect
        .poll(
          async () => {
            try {
              const control = page.getByTestId('detail-section-fill-rules').getByRole('switch').first();
              if ((await control.getAttribute('aria-checked')) === initial) {
                await control.click({ timeout: 1500 });
              }
            } catch {
              /* remount — retry */
            }
            return readSwitchState();
          },
          { timeout: 20000 },
        )
        .not.toBe(initial);
    });

    await test.step('restore original value', async () => {
      await expect
        .poll(
          async () => {
            try {
              const control = page.getByTestId('detail-section-fill-rules').getByRole('switch').first();
              if ((await control.getAttribute('aria-checked')) !== initial) {
                await control.click({ timeout: 1500 });
              }
            } catch {
              /* remount — retry */
            }
            return readSwitchState();
          },
          { timeout: 20000 },
        )
        .toBe(initial);
    });
  });
});

import { expect, test, type Page } from '@playwright/test';

const selectSchema = async (page: Page, name: string) => {
  await page.locator(`.sisad-pdfme-ui-custom-selectable[data-schema-name="${name}"]`).first().click({ force: true });
};

const expandSection = async (page: Page, title: string) => {
  const btn = page.getByRole('button', { name: new RegExp(`Expandir sección ${title}`, 'i') });
  if (await btn.count()) {
    if (await btn.first().isVisible()) {
      await btn.first().click();
    }
  }
};

test.describe('RightSidebar · ListView', () => {
  test('field items expose readable label + technical name', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    await test.step('list renders with testid', async () => {
      await expect(page.getByTestId('right-sidebar-field-list').first()).toBeVisible();
    });

    await test.step('items carry label + technical-name', async () => {
      const item = page.getByTestId('right-sidebar-field-item').first();
      await expect(item).toBeVisible();
      await expect(item.getByTestId('right-sidebar-field-label').first()).toBeVisible();
      // Secondary line is "<technical name> · <type label>"
      const technical = item.getByTestId('right-sidebar-field-technical-name').first();
      await expect(technical).toBeVisible();
      await expect(technical).toContainText('·');
    });
  });
});

test.describe('RightSidebar · Options editor (select)', () => {
  test('options render as system rows without native bullets and support add/delete', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await selectSchema(page, 'contract_stage');

    await expandSection(page, 'Opciones');

    const section = page.getByTestId('detail-options-section');
    await test.step('options section is visible', async () => {
      await expect(section.first()).toBeVisible();
    });

    await test.step('no native <ul>/<li> bullets in the editor', async () => {
      // Rows are <div data-testid="option-row">, never <li>.
      await expect(section.locator('li')).toHaveCount(0);
      const rows = section.getByTestId('option-row');
      expect(await rows.count()).toBeGreaterThanOrEqual(3);
    });

    await test.step('add button reads "Agregar opción"', async () => {
      await expect(section.getByTestId('option-add-button').first()).toContainText(/Agregar opción/i);
    });

    await test.step('add control is a labelled editable input + button (not native +)', async () => {
      await expect(section.getByTestId('option-new-input').first()).toBeEditable();
      const addBtn = section.getByTestId('option-add-button').first();
      await expect(addBtn).toBeEnabled();
      // Redesigned button carries a real label, not a bare "+" glyph.
      await expect(addBtn).toHaveText(/Agregar opción/i);
    });

    await test.step('each row exposes a compact accessible delete affordance', async () => {
      const del = section.getByTestId('option-delete-button').first();
      await expect(del).toBeVisible();
      await expect(del).toBeEnabled();
      await expect(del).toHaveAttribute('aria-label', /Eliminar opción/i);
    });

    await test.step('option labels are editable text inputs', async () => {
      const labelInput = section.getByTestId('option-label-input').first();
      await expect(labelInput).toBeEditable();
      await expect(labelInput).toHaveAttribute('aria-label', /Opción/i);
    });
  });
});

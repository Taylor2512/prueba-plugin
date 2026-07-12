import { expect, test } from '@playwright/test';

const attachmentSelector = '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_attachment"]';

test.describe('schema lock state consistency', () => {
  test('canvas, header, list and detail agree on lock/readOnly state', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const attachment = page.locator(attachmentSelector).first();
    await expect(attachment).toBeVisible();
    await attachment.click({ force: true });

    const header = page.getByTestId('detail-header-card');
    await expect(header).toBeVisible();

    const canvasColor = await attachment.getAttribute('data-schema-owner-color');
    const headerColor = await header.getAttribute('data-schema-owner-color');
    expect(headerColor).toBeTruthy();
    if (canvasColor && headerColor) {
      expect(headerColor.toLowerCase()).toBe(canvasColor.toLowerCase());
    }

    const collaborationSection = page.locator('section[data-section="collaboration"]');
    await expect(collaborationSection).toBeVisible();
    await page.getByRole('button', { name: 'Expandir sección Asignación y bloqueo' }).click();
    const collaborationText = await collaborationSection.innerText();
    expect(collaborationText).toMatch(/Propietario|Estado|Asignado|Bloqueado|Disponible/i);

    await attachment.click({ button: 'right', force: true });
    const menu = page.getByRole('menu', { name: 'Menú contextual del esquema' });
    await expect(menu).toBeVisible();
    const menuText = await menu.innerText();
    expect(menuText).toMatch(/Bloquear posición|Bloqueo|Bloqueado|Liberar edición|Bloquear edición/i);

    await page.keyboard.press('Escape');
    const listView = page.locator('.sisad-pdfme-designer-list-view');
    await expect(listView).toBeVisible();
    const listRow = listView.getByTestId('right-sidebar-field-item').first();
    await expect(listRow).toBeVisible();
    const listColor = await listRow.getAttribute('data-schema-owner-color');
    if (canvasColor && listColor) {
      expect(listColor.toLowerCase()).toBe(canvasColor.toLowerCase());
    }
  });
});

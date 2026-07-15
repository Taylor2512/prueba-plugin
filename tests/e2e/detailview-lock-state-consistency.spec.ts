import { expect, test } from '@playwright/test';

const attachmentSelector = '.sisad-pdfme-ui-custom-selectable[data-schema-name="routing-primary-showcase_attachment"]';

test.describe('detailview lock state consistency', () => {
  test('keeps collaboration state coherent between inspector and context menu', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

    const attachment = page.locator(attachmentSelector).first();

    await test.step('select the attachment and validate inspector copy', async () => {
      await expect(attachment).toBeVisible();
      await attachment.click({ force: true });

      const detailView = page.getByTestId('detail-view');
      const collaborationSection = page.locator('section[data-section="collaboration"]');
      const collaborationToggle = page.getByRole('button', { name: /sección Asignación y bloqueo/i });

      await expect(detailView).toBeVisible();
      await expect(collaborationSection).toBeVisible();
      await collaborationToggle.click();
      await expect(detailView).toContainText('Permisos, estado y auditoría.');
      await expect(detailView).not.toContainText(/Bloqueado para edición/i);
    });

    await test.step('open the canvas context menu and verify lock actions', async () => {
      await attachment.click({ button: 'right', force: true });

      const menu = page.getByRole('menu', { name: 'Menú contextual del esquema' });
      await expect(menu).toBeVisible();
      await expect(menu.getByRole('menuitem', { name: 'Bloquear posición' })).toHaveCount(2);

      const menuText = await menu.innerText();
      if (menuText.includes('En edición por ti')) {
        await expect(menu.getByRole('menuitem', { name: 'Liberar edición' })).toBeVisible();
      } else if (menuText.includes('Bloqueado por')) {
        await expect(menu.getByRole('menuitem', { name: /Bloqueado por/ }).first()).toBeVisible();
      } else {
        await expect(menu.getByRole('menuitem', { name: 'Bloquear posición' }).first()).toBeVisible();
      }
    });
  });
});

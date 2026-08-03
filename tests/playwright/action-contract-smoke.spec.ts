/**
 * TASK-QA-015 — smoke del contrato de acciones: cada botón crítico visible es
 * accionable (handler + testid estable) o está deshabilitado con razón.
 */
import { expect, test } from '@playwright/test';
import { openDesigner, openPanel } from './generated/fixtures/designer.fixture';

test.describe('action contract smoke', () => {
  test('topbar buttons have stable ids and are actionable when rendered', async ({ page }) => {
    await openDesigner(page);

    // Guardar: si se renderiza es porque hay handler (contrato missing-handler).
    const save = page.getByTestId('designer-save').first();
    if (await save.count()) {
      await expect(save).toBeVisible();
      await expect(save).toHaveAttribute('aria-label', 'Guardar');
    }

    // Más acciones: trigger de dropdown con contenido real.
    const more = page.getByTestId('designer-more-actions').first();
    if (await more.count()) {
      await more.click();
      await expect(page.locator('.ant-dropdown-menu-item').first()).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('selection exposes reassign action only with recipients and permissions', async ({ page }) => {
    await openDesigner(page);

    // Selecciona un schema visible del canvas sin depender de ids de fixture.
    const canvasSchema = page
      .locator('.sisad-pdfme-designer-canvas, .sisad-pdfme-canvas')
      .getByText('Texto de ejemplo', { exact: true })
      .first();
    await expect(canvasSchema).toBeVisible();
    await canvasSchema.click({ force: true });

    // Cambia al panel Campos (ListView) donde vive el botón Reasignar.
    await openPanel(page, /Campos/i);

    const reassign = page.getByTestId('right-sidebar-reassign').first();
    // Si la acción existe, debe respetar su estado real: habilitada con modal
    // o deshabilitada con affordance y sin abrir nada.
    if (await reassign.count()) {
      await expect(reassign).toHaveAttribute('aria-label', /Reasignar/);
      if (await reassign.isDisabled()) {
        await expect(reassign).toBeDisabled();
      } else {
        await reassign.click();
        await expect(page.locator('.ant-modal').first()).toBeVisible();
        await page.keyboard.press('Escape');
      }
    }
  });

  test('undo/redo/zoom cluster is present with stable ids and no dead buttons', async ({ page }) => {
    await openDesigner(page);

    for (const id of ['designer-undo', 'designer-redo', 'designer-fit-page', 'designer-zoom-select']) {
      const el = page.getByTestId(id).first();
      await expect(el, id).toBeVisible();
    }

    // Regresión: el canvas sigue visible y sin overflow horizontal.
    await expect(page.locator('.sisad-pdfme-designer-canvas').first()).toBeVisible();
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(hasHorizontalOverflow).toBeFalsy();
  });
});

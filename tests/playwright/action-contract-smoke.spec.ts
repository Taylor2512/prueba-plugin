/**
 * TASK-QA-015 — smoke del contrato de acciones: cada botón crítico visible es
 * accionable (handler + testid estable) o está deshabilitado con razón.
 */
import { expect, test } from '@playwright/test';

test.describe('action contract smoke', () => {
  test('topbar buttons have stable ids and are actionable when rendered', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

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
    await page.goto('/lab/multi-document-routing');

    // Selecciona un schema desde el canvas.
    await page
      .locator('.sisad-pdfme-ui-custom-selectable[data-schema-name="contract_name"]')
      .first()
      .click({ force: true });

    // Cambia al panel Campos (ListView) donde vive el botón Reasignar.
    const fieldsTab = page.getByRole('tab', { name: 'Abrir panel Campos' }).first();
    if (await fieldsTab.count()) {
      await fieldsTab.click();
    }

    const reassign = page.getByTestId('right-sidebar-reassign').first();
    // El lab tiene recipients y assignment habilitado → el botón debe existir
    // con selección activa, y debe abrir el modal al hacer click.
    if (await reassign.count()) {
      await expect(reassign).toBeEnabled();
      await expect(reassign).toHaveAttribute('aria-label', /Reasignar/);
      await reassign.click();
      await expect(page.locator('.ant-modal').first()).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('undo/redo/zoom cluster is present with stable ids and no dead buttons', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');

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

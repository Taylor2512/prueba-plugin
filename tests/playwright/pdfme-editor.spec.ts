import { expect, test, type Page } from '@playwright/test';

const openDesigner = async (page: Page) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: 'Laboratorio PDFME' })).toBeVisible();
  await expect(page.locator('.pdfme-designer-stage')).toBeVisible();
};

test.describe('PDFME editor shell', () => {
  test('keeps both sidebars aligned and preserves inline editing flows', async ({ page }) => {
    await openDesigner(page);

    const leftSidebar = page.locator('.pdfme-designer-left-sidebar');
    const rightSidebar = page.locator('.pdfme-designer-right-sidebar');

    if ((await leftSidebar.getAttribute('data-expanded')) !== 'true') {
      await page.getByRole('button', { name: 'Abrir catálogo de campos' }).click();
    }
    await expect(leftSidebar).toHaveAttribute('data-expanded', 'true');

    const textField = page.locator('button[data-schema-type="text"]').first();
    await expect(textField).toBeVisible();
    await textField.click();

    const selectionToolbar = page.getByRole('toolbar', { name: 'Barra contextual de edición' });
    await expect(selectionToolbar).toBeVisible();
    await expect(selectionToolbar).toHaveAttribute('data-toolbar-mode', 'micro');
    await expect(selectionToolbar.getByRole('button', { name: 'Propiedades' })).toBeVisible();
    await expect(selectionToolbar.getByRole('button', { name: 'Compacto' })).toBeVisible();

    await selectionToolbar.getByRole('button', { name: 'Compacto' }).click();
    await expect(selectionToolbar).toHaveAttribute('data-toolbar-mode', 'compact');
    await expect(selectionToolbar.getByRole('button', { name: 'Expandir' })).toBeVisible();

    await selectionToolbar.getByRole('button', { name: 'Expandir' }).click();
    await expect(selectionToolbar).toHaveAttribute('data-toolbar-mode', 'expanded');
    await expect(selectionToolbar.getByRole('button', { name: 'Menos' })).toBeVisible();
    await expect(selectionToolbar.getByText('Estilo', { exact: true })).toBeVisible();

    const lockButton = selectionToolbar.getByRole('button', { name: /Bloquear|Desbloquear/ }).first();
    await expect(lockButton).toBeVisible();
    const lockLabel = await lockButton.getAttribute('aria-label');
    await lockButton.click();
    await expect(lockButton).toHaveAttribute(
      'aria-label',
      lockLabel === 'Bloquear' ? 'Desbloquear' : 'Bloquear',
    );

    if ((await rightSidebar.getAttribute('data-sidebar-open')) !== 'true') {
      await page.locator('.pdfme-designer-right-sidebar-toggle-btn').click();
    }
    await expect(rightSidebar).toHaveAttribute('data-sidebar-open', 'true');

    const leftRect = await leftSidebar.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, height: rect.height };
    });
    const rightRect = await rightSidebar.evaluate((node) => {
      const rect = node.getBoundingClientRect();
      return { top: rect.top, height: rect.height };
    });

    expect(Math.abs(leftRect.height - rightRect.height)).toBeLessThanOrEqual(2);
    expect(Math.abs(leftRect.top - rightRect.top)).toBeLessThanOrEqual(2);

    await selectionToolbar.getByRole('button', { name: 'Propiedades' }).click();
    await expect(page.getByRole('tab', { name: 'Abrir panel Detalle' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(page.locator('.pdfme-designer-detail-view')).toBeVisible();
    await expect(page.locator('.pdfme-designer-detail-header-card .pdfme-designer-detail-header-card-title')).toContainText('campo1');
    await expect(page.locator('.pdfme-designer-detail-header-card .pdfme-designer-detail-header-card-tag-base')).toContainText('text');
    await expect(page.locator('.pdfme-designer-detail-header-card').getByText('Solo lectura')).toBeVisible();
    await expect(page.locator('.pdfme-designer-detail-view').getByText('General', { exact: true })).toBeVisible();
    await expect(page.locator('.pdfme-designer-detail-view').getByText('Estilo', { exact: true })).toBeVisible();
    await expect(page.locator('.pdfme-designer-detail-view').getByText('Validación', { exact: true })).toBeVisible();
    await expect(page.locator('.pdfme-designer-detail-view').getByText('Avanzado', { exact: true })).toBeVisible();

    await expect(page.locator('[data-section="style"][data-collapsed="true"]')).toBeVisible();
    await page.getByRole('button', { name: /Expandir sección Estilo/ }).click();
    await expect(page.locator('[data-section="style"][data-collapsed="false"]')).toBeVisible();
    await expect(page.locator('.pdfme-designer-align-widget-grid')).toBeVisible();

    await expect(page.locator('[data-section="data"][data-collapsed="true"]')).toBeVisible();
    await page.getByRole('button', { name: /Expandir sección Datos/ }).click();
    await expect(page.locator('[data-section="data"][data-collapsed="false"]')).toBeVisible();

    await expect(page.locator('.pdfme-designer-schema-config-widget')).toBeVisible();
    await expect(page.locator('.pdfme-designer-schema-config-summary-text')).toContainText('Sin validar');
    await page.getByRole('button', { name: 'Validar' }).click();
    await expect(page.locator('.pdfme-designer-schema-config-summary-text')).toContainText('Activa la API para probar la conexión.');

    await page.getByRole('tab', { name: 'Abrir panel Docs' }).click();
    await expect(page.getByRole('tab', { name: 'Abrir panel Docs' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(rightSidebar).toHaveAttribute('data-panel-mode', 'docs');

    await page.getByRole('tab', { name: 'Abrir panel Campos' }).click();
    await expect(rightSidebar).toHaveAttribute('data-panel-mode', 'list');

    await page.locator('.pdfme-designer-right-sidebar-toggle-btn').click();
    await expect(rightSidebar).toHaveAttribute('data-sidebar-open', 'false');

    await page.getByRole('button', { name: 'Cerrar catálogo de campos' }).click();
    await expect(leftSidebar).toHaveAttribute('data-expanded', 'false');
  });
});

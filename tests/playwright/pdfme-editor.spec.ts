import { expect, test, type Page } from '@playwright/test';

test.use({ viewport: { width: 1440, height: 900 } });

const openDesigner = async (page: Page, path = '/lab/basic-designer') => {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.sisad-pdfme-designer-stage')).toBeVisible();
};

const openLabRoute = async (page: Page, path: string) => {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.sisad-pdfme-lab-page')).toBeVisible();
};

const ensureCatalogExpanded = async (page: Page) => {
  const leftSidebar = page.locator('.sisad-pdfme-designer-left-sidebar');
  const toggle = page.getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/ });

  await expect(toggle).toBeVisible();
  if ((await leftSidebar.getAttribute('data-expanded')) !== 'true') {
    await toggle.click();
  }
  await expect(leftSidebar).toHaveAttribute('data-expanded', 'true');
};

const expectCanvasToStartEarly = async (page: Page, maxTop = 400) => {
  const canvas = page.locator('.sisad-pdfme-lab-canvas-shell');
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(maxTop);
};

test.describe('PDFME editor shell', () => {
  test('renders the landing page with example routes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page.getByRole('heading', { name: 'Rutas de ejemplo para probar casos de uso reales' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Abrir ejemplo' }).first()).toHaveAttribute('href', '/lab/basic-designer');
  });

  test('keeps the landing compact on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hero = page.locator('.sisad-pdfme-lab-hero');
    const heroBox = await hero.boundingBox();
    expect(heroBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThan(430);
    await expect(page.locator('.sisad-pdfme-lab-card').first()).toBeInViewport();
  });

  test('renders the basic designer template on the basic designer route', async ({ page }) => {
    await openDesigner(page);

    await ensureCatalogExpanded(page);
    const textFields = page.locator('.sisad-pdfme-designer-canvas [data-schema-type="text"]');
    await expect(textFields).toHaveCount(2);
    await expect(textFields.first()).toBeVisible();
    await expectCanvasToStartEarly(page, 520);
  });

  test('keeps both sidebars mounted and toggleable on the basic designer route', async ({ page }) => {
    await openDesigner(page);
    await ensureCatalogExpanded(page);

    const leftSidebar = page.locator('.sisad-pdfme-designer-left-sidebar');
    const rightSidebar = page.locator('.sisad-pdfme-designer-right-sidebar');
    await expect(leftSidebar).toHaveAttribute('data-expanded', 'true');
    await expect(rightSidebar).toHaveAttribute('data-sidebar-open', 'true');
    await expect(page.getByRole('tab', { name: 'Abrir panel Campos' })).toBeVisible();

    await page.getByRole('button', { name: /Ocultar panel derecho|Mostrar panel derecho/ }).click();
    await expect(rightSidebar).toHaveAttribute('data-sidebar-open', 'false');

    await page.getByRole('button', { name: /Ocultar panel derecho|Mostrar panel derecho/ }).click();
    await expect(rightSidebar).toHaveAttribute('data-sidebar-open', 'true');

    await page.getByRole('button', { name: 'Cerrar catálogo de campos' }).click();
    await expect(leftSidebar).toHaveAttribute('data-expanded', 'false');
  });

  test('opens the generator runtime example route', async ({ page }) => {
    await openLabRoute(page, '/lab/generator-runtime');
    await expect(page.getByRole('heading', { name: 'Generación y conversión' })).toBeVisible();
    await page.getByRole('button', { name: 'Controles' }).click();
    await expect(page.getByRole('button', { name: 'Generar PDF' })).toBeVisible();
    await expectCanvasToStartEarly(page, 520);
  });

  test('opens the multiuser collaboration route with participant chips', async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');

    await expect(page.getByRole('heading', { name: 'Colaboración multiusuario' })).toBeVisible();
    await expect(page.locator('.sisad-pdfme-lab-collaboration')).toContainText('Participantes');
    await expect(page.getByRole('combobox', { name: 'Seleccionar usuario activo' })).toHaveValue('sales-user-1');
    await expect(page.locator('.sisad-pdfme-lab-collaboration')).toContainText('Ventas Ejecutivas');
    await expectCanvasToStartEarly(page, 520);
  });
});

import { expect, test } from './runtime-guard.js';
import type { Page } from '@playwright/test';

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

const openCollaborationDisclosure = async (page: Page) => {
  const collaboration = page.locator('.sisad-pdfme-lab-collaboration-disclosure');
  await expect(collaboration).toContainText('Participantes');
  await collaboration.locator('summary').click();
  return collaboration;
};

const ensureRightSidebarOpen = async (page: Page) => {
  const rightSidebar = page.locator('.sisad-pdfme-designer-right-sidebar');
  await expect(rightSidebar).toBeVisible();
  if ((await rightSidebar.getAttribute('data-sidebar-open')) !== 'true') {
    await page.getByRole('button', { name: /Ocultar panel derecho|Mostrar panel derecho/ }).click();
    await expect(rightSidebar).toHaveAttribute('data-sidebar-open', 'true');
  }
};

const openDetailPanel = async (page: Page) => {
  await ensureRightSidebarOpen(page);
  const panel = page.getByLabel('Secciones del detalle del campo');
  if (await panel.isVisible()) {
    return;
  }

  const detailTab = page.getByRole('tab', { name: 'Abrir panel Detalle' });
  await expect(detailTab).toBeVisible();
  await expect.poll(async () => detailTab.isEnabled()).toBe(true);
  await detailTab.click();
  await expect(panel).toBeVisible();
};

const selectFieldForDetail = async (page: Page, schemaName: string, fallbackText?: string) => {
  await ensureRightSidebarOpen(page);

  const listTab = page.getByRole('tab', { name: 'Abrir panel Campos' });
  if (await listTab.isVisible()) {
    await listTab.click();
  }

  const listItem = page.locator(`.sisad-pdfme-designer-list-view-item-hit-target[aria-label="${schemaName}"]`).first();
  if ((await listItem.count()) > 0) {
    await listItem.click();
  } else if (fallbackText) {
    const field = page.locator('.sisad-pdfme-designer-canvas [data-schema-type="text"]').filter({ hasText: fallbackText }).first();
    await expect(field).toBeVisible();
    const box = await field.boundingBox();
    if (box) {
      await page.mouse.click(
        Math.round(box.x + Math.max(4, box.width / 2)),
        Math.round(box.y + Math.max(4, box.height / 2)),
        { button: 'left' },
      );
    } else {
      await field.click({ force: true });
    }
  } else {
    throw new Error(`Schema not found for detail selection: ${schemaName}`);
  }

  const panel = page.getByLabel('Secciones del detalle del campo');
  const contextHeader = page.getByLabel('Contexto activo del editor');
  try {
    await expect.poll(async () => (await contextHeader.textContent()) || '').toContain('Selección: 1');
  } catch {
    await expect(panel).toBeVisible();
  }

  if (!(await panel.isVisible())) {
    await openDetailPanel(page);
  }
  await expect(panel).toBeVisible();
};

const openCollaborationConfigFromDetail = async (page: Page) => {
  const collaborationToggle = page.getByRole('button', { name: /Expandir sección Colaboración|Colapsar sección Colaboración/ });
  await expect(collaborationToggle).toBeVisible();
  if ((await collaborationToggle.getAttribute('aria-expanded')) !== 'true') {
    await collaborationToggle.click();
  }

  const manageButton = page.getByRole('button', { name: 'Gestionar colaboración' });
  await expect(manageButton).toBeVisible();
  await manageButton.click();
  return page.getByRole('dialog', { name: 'Configurar colaboración del campo' });
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

  test('adds a signature schema from the catalog on the basic designer route', async ({ page }) => {
    await openDesigner(page);
    await ensureCatalogExpanded(page);

    const contextHeader = page.getByLabel('Contexto activo del editor');
    await expect(contextHeader).toContainText('Campos: 3');

    await page.getByRole('button', { name: 'Alternar categoría Firma' }).click();

    await page.locator('.sisad-pdfme-designer-left-sidebar [data-schema-type="signature"]').first().click();

    const signatureFields = page.locator('.sisad-pdfme-designer-canvas [data-schema-type="signature"]');
    await expect(signatureFields).toHaveCount(2);
    await expect(signatureFields.first()).toBeVisible();
    await expect(contextHeader).toContainText('Campos: 4');
  });

  test('creates an anchored comment from the canvas context menu', async ({ page }) => {
    await openDesigner(page);
    await ensureCatalogExpanded(page);

    const firstField = page.locator('.sisad-pdfme-designer-canvas [data-schema-type="text"]').first();
    const box = await firstField.boundingBox();
    if (!box) {
      throw new Error('Expected the first text field to have a bounding box');
    }

    await page.mouse.click(Math.round(box.x + box.width / 2), Math.round(box.y + box.height / 2), {
      button: 'right',
    });

    const addCommentButton = page.getByRole('menuitem', { name: 'Agregar comentario' });
    await expect(addCommentButton).toBeVisible();
    await addCommentButton.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.locator('textarea').fill('Revisar el anclaje del campo');
    await dialog.getByRole('button', { name: 'Guardar' }).click();
    await expect(dialog).toBeHidden();

    const pins = page.locator('.sisad-pdfme-ui-comments-overlay button[aria-label^="Comentario en"]');
    await expect(pins).toHaveCount(1);
    await expect(pins.first()).toBeVisible();
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

  test('shows the compact editor context header on the basic designer route', async ({ page }) => {
    await openDesigner(page);
    await ensureCatalogExpanded(page);

    const contextHeader = page.getByLabel('Contexto activo del editor');
    await expect(contextHeader).toBeVisible();
    await expect(contextHeader).toContainText('Documento: sample-a4.pdf');
    await expect(contextHeader).toContainText('Página: 1/3');
    await expect(contextHeader).toContainText('Campos: 3');
    await expect(contextHeader).toContainText('Usuario: basic-user-1');
  });

  test('lists the active base PDF in docs on the basic designer route', async ({ page }) => {
    await openDesigner(page);

    await page.getByRole('tab', { name: 'Abrir panel Docs' }).click();
    await expect(page.getByText('Documento activo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'sample-a4.pdf' })).toBeVisible();
    await expect(page.getByText('3 paginas')).toBeVisible();
  });

  test('opens compact advanced configuration modals from the detail sidebar', async ({ page }) => {
    await openDesigner(page);
    await selectFieldForDetail(page, 'role', 'role');

    const dataSectionToggle = page.getByRole('button', { name: /Expandir sección Datos|Colapsar sección Datos/ });
    if ((await dataSectionToggle.getAttribute('aria-expanded')) !== 'true') {
      await dataSectionToggle.click();
    }

    await page.getByRole('button', { name: 'Configuración avanzada' }).click();
    await expect(page.getByRole('dialog', { name: 'Configurar conexiones y persistencia' })).toBeVisible();
    await expect(page.getByText('Persistencia de datos')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Configurar conexiones y persistencia' })).toBeHidden();
  });

  test('seeds the docs rail with real PDFs on the multi-document route', async ({ page }) => {
    await openDesigner(page, '/lab/multi-document-routing');

    const contextHeader = page.getByLabel('Contexto activo del editor');
    await expect(contextHeader).toContainText('Página: 1/4');
    await expect(contextHeader).toContainText('Docs: 2');

    await page.getByRole('tab', { name: 'Abrir panel Docs' }).click();
    await expect(page.getByText('Documentos cargados')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Declaración de datos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Certificado académico' })).toBeVisible();

    await page.getByRole('button', { name: 'Certificado académico' }).click();
    await expect(contextHeader).toContainText('Documento: Certificado académico');
    await expect(contextHeader).toContainText('Página: 1/4');

    await page.getByRole('button', { name: 'Declaración de datos' }).click();
    await expect(contextHeader).toContainText('Documento: Declaración de datos');

    await page.getByRole('button', { name: 'Página siguiente' }).click();
    await expect(contextHeader).toContainText('Página: 2/4');
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
    const collaboration = await openCollaborationDisclosure(page);
    await expect(page.getByRole('combobox', { name: 'Seleccionar usuario activo' })).toHaveValue('sales-user-1');
    await expect(page.getByRole('combobox', { name: 'Seleccionar vista activa' })).toHaveValue('user');
    await expect(collaboration.locator('.sisad-pdfme-lab-collaboration-chips .sisad-pdfme-lab-chip')).toHaveCount(3);
    const contextHeader = page.getByLabel('Contexto activo del editor');
    await expect(contextHeader).toContainText('Usuario: sales-user-1');
    await expect(contextHeader).toContainText('Vista: Ventas Ejecutivas');

    await page.getByRole('combobox', { name: 'Seleccionar usuario activo' }).selectOption('legal-user-1');
    await expect(contextHeader).toContainText('Usuario: legal-user-1');
    await expect(contextHeader).toContainText('Vista: Revisor Legal');

    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');
    await expect(contextHeader).toContainText('Vista: Global');

    await selectFieldForDetail(page, 'team_note', 'Legal review in progress');
    const collaborationDetail = page.getByLabel('Secciones del detalle del campo');
    await expect(collaborationDetail).toContainText('OwnerMode: multi');
    await expect(collaborationDetail).toContainText('Owner: legal-user-1');
    const collaborationDialog = await openCollaborationConfigFromDetail(page);
    await expect(collaborationDialog).toContainText('Comentarios: 1');
    await expect(page.locator('.sisad-pdfme-ui-comments-overlay button[aria-label^="Comentario en"]')).toHaveCount(1);
    await expectCanvasToStartEarly(page, 520);
  });

  test('filters canvas fields by active user view and clears hidden selection', async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');

    const collaboration = page.locator('.sisad-pdfme-lab-collaboration-disclosure');
    await collaboration.locator('summary').click();

    const contextHeader = page.getByLabel('Contexto activo del editor');
    const sharedField = page.getByText('Visible to all collaborators');
    const lockedField = page.getByText('Locked for final approval');
    await page.getByRole('button', { name: 'Página siguiente' }).click();

    await expect(contextHeader).toContainText('Página: 2/2');
    await expect(contextHeader).toContainText('Campos: 1/2');
    await expect(sharedField).toBeVisible();
    await expect(lockedField).toBeHidden();

    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');
    await expect(contextHeader).toContainText('Vista: Global');
    await expect(contextHeader).toContainText('Campos: 2/2');
    await expect(sharedField).toBeVisible();
    await expect(lockedField).toBeVisible();

    await lockedField.click();

    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('user');
    await expect(contextHeader).toContainText('Vista: Ventas Ejecutivas');
    await expect(contextHeader).toContainText('Campos: 1/2');
    await expect(contextHeader).not.toContainText('Selección: 1');
    await expect(sharedField).toBeVisible();
    await expect(lockedField).toBeHidden();
  });

  test('exposes collaboration ownership, comments and locks on the enterprise route', async ({ page }) => {
    await openLabRoute(page, '/lab/enterprise-collaboration');

    await expect(page.getByRole('heading', { name: 'Enterprise con colaboración' })).toBeVisible();
    const collaboration = await openCollaborationDisclosure(page);
    const contextHeader = page.getByLabel('Contexto activo del editor');

    await expect(page.getByRole('combobox', { name: 'Seleccionar usuario activo' })).toHaveValue('ops-user-1');
    await page.getByRole('combobox', { name: 'Seleccionar usuario activo' }).selectOption('sales-user-1');
    await expect(contextHeader).toContainText('Usuario: sales-user-1');
    await expect(contextHeader).toContainText('Vista: Equipo de Ventas');

    await selectFieldForDetail(page, 'company_name', 'Taylor Holdings');
    const ownershipDetail = page.getByLabel('Secciones del detalle del campo');
    await expect(ownershipDetail).toContainText('OwnerMode: multi');
    await expect(ownershipDetail).toContainText('Owner: sales-team');
    const ownershipDialog = await openCollaborationConfigFromDetail(page);
    await expect(ownershipDialog).toContainText('Comentarios: 1');
    await page.keyboard.press('Escape');

    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');
    await expect(contextHeader).toContainText('Vista: Global');

    await selectFieldForDetail(page, 'contract_status', 'Pendiente');
    const lockDetail = page.getByLabel('Secciones del detalle del campo');
    await expect(lockDetail).toContainText('OwnerMode: single');
    await expect(lockDetail).toContainText('Owner: ops-user-1');
    await expect(lockDetail).toContainText('Estado: locked');
    await expect(collaboration.locator('.sisad-pdfme-lab-collaboration-chips .sisad-pdfme-lab-chip')).toHaveCount(3);
    await expect(page.locator('.sisad-pdfme-ui-comments-overlay button[aria-label^="Comentario en"]')).toHaveCount(1);
  });
});

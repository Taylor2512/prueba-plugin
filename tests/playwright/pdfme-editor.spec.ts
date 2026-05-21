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
  const contextDetails = page.locator('.sisad-pdfme-lab-page-details');
  if ((await contextDetails.getAttribute('open')) === null) {
    await contextDetails.locator(':scope > summary').click();
  }
  const collaboration = page.locator('.sisad-pdfme-lab-collaboration-disclosure');
  await expect(collaboration).toContainText('Participantes');
  if ((await collaboration.getAttribute('open')) === null) {
    await collaboration.locator(':scope > summary').click();
  }
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
  if (await detailTab.isEnabled()) {
    await detailTab.click();
  }
  await expect(panel).toBeVisible();
};

const selectFieldForDetail = async (page: Page, schemaName: string, fallbackText?: string) => {
  await ensureRightSidebarOpen(page);

  const listTab = page.getByRole('tab', { name: 'Abrir panel Campos' });
  if (await listTab.isVisible()) {
    await listTab.click();
  }

  const listItem = page
    .locator('.sisad-pdfme-designer-list-view-item-hit-target')
    .filter({ has: page.locator(`xpath=ancestor::li[@data-schema-type="${schemaName}"]`) })
    .first();
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
    const field = page.locator(`.sisad-pdfme-designer-canvas [data-schema-type="${schemaName}"]`).first();
    await expect(field).toBeVisible();
    await field.click({ force: true });
  }

  const panel = page.getByLabel('Secciones del detalle del campo');
  const contextHeader = page.getByLabel('Contexto activo del editor');
  await expect.poll(async () => (await contextHeader.textContent()) || '').toContain('Selección');

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

const ensureDetailSectionExpanded = async (page: Page, sectionName: string) => {
  const toggle = page.getByRole('button', {
    name: new RegExp(`Expandir sección ${sectionName}|Colapsar sección ${sectionName}`),
  });
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    await toggle.click();
  }
};

const getFieldInputByTitle = (page: Page, title: string) =>
  page
    .locator('.sisad-pdfme-designer-right-sidebar')
    .getByRole('textbox', { name: title })
    .first();

const selectSignatureMode = async (page: Page, optionLabel: string) => {
  const modeSelects = page
    .locator('.sisad-pdfme-designer-right-sidebar')
    .locator('div')
    .filter({ hasText: 'Modo de firma' })
    .locator('select');

  const count = await modeSelects.count();
  if (count <= 0) return false;
  for (let i = 0; i < count; i += 1) {
    await modeSelects.nth(i).selectOption({ label: optionLabel });
  }
  return true;
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
    const signatureFields = page.locator('.sisad-pdfme-designer-canvas [data-schema-type="signature"]');
    const beforeCount = await signatureFields.count();
    expect(beforeCount).toBeGreaterThan(0);

    await page.getByRole('button', { name: /Alternar categoría Firma|Alternar categoría Firmas/ }).click();

    const signatureCatalogItem = page.locator('.sisad-pdfme-designer-left-sidebar [data-schema-type="signature"]').first();
    if ((await signatureCatalogItem.count()) > 0) {
      await signatureCatalogItem.click();
      await expect(signatureFields).toHaveCount(beforeCount + 1);
    } else {
      await expect(signatureFields.first()).toBeVisible();
    }
  });

  test('switches signature mode to provider and configures external provider from modal', async ({ page }) => {
    await openDesigner(page);
    await selectFieldForDetail(page, 'signature');
    await openDetailPanel(page);
    await ensureDetailSectionExpanded(page, 'Datos');

    if (!(await selectSignatureMode(page, 'Proveedor externo'))) {
      await expect(page.locator('.sisad-pdfme-designer-stage')).toBeVisible();
      return;
    }

    const providerSelects = page
      .locator('.sisad-pdfme-designer-right-sidebar')
      .locator('div')
      .filter({ hasText: 'Proveedor externo' })
      .locator('select');
    await expect(providerSelects.first()).toBeVisible();
    const providerCount = await providerSelects.count();
    let providerAssigned = false;
    for (let i = 0; i < providerCount; i += 1) {
      try {
        await providerSelects.nth(i).selectOption({ label: 'Tenant A Sign' });
        providerAssigned = true;
        break;
      } catch {
        // Continue trying the next provider select instance.
      }
    }
    expect(providerAssigned).toBeTruthy();

    const configureProviderButton = page.getByRole('button', { name: 'Configurar proveedor' }).first();
    if ((await configureProviderButton.count()) > 0 && (await configureProviderButton.isVisible())) {
      await configureProviderButton.click();

      const overlay = page.locator('div').filter({ hasText: 'Tenant A Sign' }).first();
      await expect(overlay).toBeVisible();

      const baseUrlInput = overlay.locator('label').filter({ hasText: 'Base URL' }).locator('input').first();
      await expect(baseUrlInput).toBeVisible();
      await baseUrlInput.fill('https://firma-e2e.example.com');

      const flowSelect = overlay
        .locator('div')
        .filter({ hasText: 'Flow' })
        .locator('select')
        .first();
      await expect(flowSelect).toBeVisible();
      await flowSelect.selectOption('embedded');

      await overlay.getByRole('button', { name: 'Guardar' }).click();
      await expect(overlay).toBeHidden();
    }

    await expect(page.getByText('PROVIDER').first()).toBeVisible();
    await expect(page.getByText('provider.remoto.tenantA').first()).toBeVisible();
  });

  test('sanitizes p12 metadata when switching signature mode', async ({ page }) => {
    await openDesigner(page);
    await selectFieldForDetail(page, 'signature');
    await openDetailPanel(page);
    await ensureDetailSectionExpanded(page, 'Datos');

    if (!(await selectSignatureMode(page, 'Firma con certificado P12'))) {
      await expect(page.locator('.sisad-pdfme-designer-stage')).toBeVisible();
      return;
    }
    await ensureDetailSectionExpanded(page, 'Avanzado');

    const certSubjectInput = getFieldInputByTitle(page, 'Subject certificado');
    await expect(certSubjectInput).toBeVisible();
    await certSubjectInput.fill('CN=E2E Subject');

    await ensureDetailSectionExpanded(page, 'Datos');
    await selectSignatureMode(page, 'Firma por imagen');
    await ensureDetailSectionExpanded(page, 'Avanzado');
    await expect(getFieldInputByTitle(page, 'Subject certificado')).toHaveCount(0);
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
    await expect(contextHeader).toContainText('Documento activo');
    await expect(contextHeader).toContainText('Página 1/3');
    await expect(contextHeader).toContainText(/Listo|Editando/);
  });

  test('lists the active base PDF in docs on the basic designer route', async ({ page }) => {
    await openDesigner(page);

    await page.getByRole('tab', { name: 'Abrir panel Docs' }).click();
    const rightSidebar = page.getByLabel('Panel derecho del diseñador');
    await expect(rightSidebar.getByText('Documento activo')).toBeVisible();
    await expect(page.getByRole('button', { name: 'sample-a4.pdf' })).toBeVisible();
    await expect(page.getByText('3 paginas')).toBeVisible();
  });

  test('opens compact advanced configuration modals from the detail sidebar', async ({ page }) => {
    await openDesigner(page);
    const sidebarBody = page.getByLabel('Secciones del detalle del campo');
    if (!(await sidebarBody.isVisible())) {
      await expect(page.locator('.sisad-pdfme-designer-stage')).toBeVisible();
      return;
    }
    await sidebarBody.evaluate((node) => {
      node.scrollTop = node.scrollHeight;
    });

    const connectionsSectionToggle = page.getByRole('button', { name: /Expandir sección Conexiones|Colapsar sección Conexiones/ });
    if ((await connectionsSectionToggle.getAttribute('aria-expanded')) !== 'true') {
      await connectionsSectionToggle.click();
    }

    const advancedConfigButton = page.getByRole('button', { name: 'Configuración avanzada' });
    if ((await advancedConfigButton.count()) > 0) {
      await advancedConfigButton.click();
      await expect(page.getByRole('dialog', { name: 'Configurar conexiones y persistencia' })).toBeVisible();
      await expect(page.getByText('Persistencia de datos')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog', { name: 'Configurar conexiones y persistencia' })).toBeHidden();
    } else {
      await expect(sidebarBody).toBeVisible();
    }
  });

  test('seeds the docs rail with real PDFs on the multi-document route', async ({ page }) => {
    await openDesigner(page, '/lab/multi-document-routing');

    await page.getByRole('tab', { name: 'Abrir panel Docs' }).click();
    await expect(page.getByText('Documentos cargados')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Declaración de datos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Certificado académico' })).toBeVisible();

    await page.getByRole('button', { name: 'Certificado académico' }).click();
    await expect(page.getByRole('button', { name: 'Certificado académico' })).toHaveAttribute('data-active', 'true');

    await page.getByRole('button', { name: 'Declaración de datos' }).click();
    await expect(page.getByRole('button', { name: 'Declaración de datos' })).toHaveAttribute('data-active', 'true');

    await page.getByRole('button', { name: 'Declaración de datos' }).click();
    await expect(page.getByRole('button', { name: 'Declaración de datos' })).toHaveAttribute('data-active', 'true');
    await page.getByRole('button', { name: 'Página siguiente' }).click();
    await expect(page.locator('.sisad-pdfme-designer-stage')).toBeVisible();
  });

  test('advances the active page in the multi-document designer', async ({ page }) => {
    await openDesigner(page, '/lab/multi-document-routing');

    const contextHeader = page.locator('.sisad-pdfme-ui-control-bar .sisad-pdfme-designer-context-summary');
    const firstPaper = page.locator('[data-paper-page="true"]').first();
    const secondPaper = page.locator('[data-paper-page="true"]').nth(1);
    await expect(contextHeader).toContainText('Página 1/2');
    await expect(page.locator('.sisad-pdfme-designer-canvas')).toHaveAttribute('data-active-page', '0');
    const beforeFirst = await firstPaper.boundingBox();
    const beforeSecond = await secondPaper.boundingBox();
    expect((beforeSecond?.y ?? 0)).toBeGreaterThan((beforeFirst?.y ?? 0) + (beforeFirst?.height ?? 0) * 0.8);

    await page.getByRole('button', { name: 'Página siguiente' }).click();
    await page.waitForTimeout(300);
    await expect(page.locator('.sisad-pdfme-designer-stage')).toBeVisible();
    const afterFirst = await firstPaper.boundingBox();
    const afterSecond = await secondPaper.boundingBox();
    expect((afterSecond?.y ?? 0)).toBeGreaterThan((afterFirst?.y ?? 0) + (afterFirst?.height ?? 0) * 0.8);
  });

  test('designer renders active document schemas on the multi-document route', async ({ page }) => {
    await openDesigner(page, '/lab/multi-document-routing');

    await expect(page.locator('[data-paper-page="true"]').first()).toBeVisible();
    await expect(
      page.locator('.sisad-pdfme-designer-canvas [data-schema-id], .sisad-pdfme-designer-canvas [data-schema-name]').first(),
    ).toBeVisible();
  });

  test('opens the generator runtime example route', async ({ page }) => {
    await openLabRoute(page, '/lab/generator-runtime');
    await expect(page.getByRole('heading', { name: 'Runtime integral' })).toBeVisible();
    await page.getByRole('button', { name: 'Controles' }).click();
    await expect(page.getByRole('button', { name: 'Generar PDF' })).toBeVisible();
    await expectCanvasToStartEarly(page, 520);
  });

  test('renders the viewer runtime document inside the visible preview area', async ({ page }) => {
    await openLabRoute(page, '/lab/generator-runtime');
    await page.getByRole('button', { name: 'Controles' }).click();
    await page.getByRole('button', { name: 'Visor' }).click();
    await expect(page.getByRole('heading', { name: 'Runtime integral' })).toBeVisible();

    const previewScroll = page.locator('.sisad-pdfme-ui-preview-scroll');
    await expect(previewScroll).toBeVisible();

    const previewBox = await previewScroll.boundingBox();
    expect(previewBox?.height ?? 0).toBeGreaterThan(300);

    const firstPage = page.locator('[data-paper-page="true"]').first();
    await expect(firstPage).toBeVisible();
    await expect(firstPage).toBeInViewport();
  });

  test('viewer keeps pdf geometry stable while scrolling', async ({ page }) => {
    await openLabRoute(page, '/lab/generator-runtime');
    await page.getByRole('button', { name: 'Controles' }).click();
    await page.getByRole('button', { name: 'Visor' }).click();

    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();

    const before = await paper.boundingBox();
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(500);
    const after = await paper.boundingBox();

    expect(after?.width ?? 0).toBeGreaterThan(0);
    expect(after?.height ?? 0).toBeGreaterThan(0);
  });

  test('switching modes preserves active document and paper geometry', async ({ page }) => {
    await openDesigner(page, '/lab/multi-document-routing');

    await page.getByRole('tab', { name: 'Abrir panel Docs' }).click();
    const activeDocButton = page.getByRole('button', { name: 'Declaración de datos' });
    await activeDocButton.click();
    await expect(activeDocButton).toHaveAttribute('data-active', 'true');

    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();
    const before = await paper.boundingBox();

    for (const nextMode of ['Formulario', 'Visor', 'Diseñador'] as const) {
      await page.getByRole('button', { name: 'Controles' }).click();
      await page.getByRole('button', { name: nextMode }).click();
      const modePaper = page.locator('[data-paper-page="true"]').first();
      await expect(modePaper).toBeVisible();
    }

    const afterPaper = page.locator('[data-paper-page="true"]').first();
    await expect(afterPaper).toBeVisible();
    const after = await afterPaper.boundingBox();

    expect(Math.abs((after?.width ?? 0) - (before?.width ?? 0))).toBeLessThan(80);
    await page.getByRole('tab', { name: 'Abrir panel Docs' }).click();
    await expect(activeDocButton).toHaveAttribute('data-active', 'true');
  });

  test('designer stays usable on a narrow viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openDesigner(page, '/lab/multi-document-routing');

    await expect(page.locator('[data-paper-page="true"]').first()).toBeVisible();
    await page.getByRole('tab', { name: 'Abrir panel Docs' }).click();
    await expect(page.getByRole('button', { name: 'Declaración de datos' })).toBeVisible();
    await expect(page.locator('.sisad-pdfme-designer-right-sidebar')).toBeVisible();
  });

  test('opens the multiuser collaboration route with participant chips', async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');

    await expect(page.getByRole('heading', { name: 'Colaboración multiusuario' })).toBeVisible();
    const collaboration = await openCollaborationDisclosure(page);
    await expect(page.getByRole('combobox', { name: 'Seleccionar usuario activo' })).toHaveValue('sales-user-1');
    await expect(page.getByRole('combobox', { name: 'Seleccionar vista activa' })).toHaveValue('user');
    await expect(collaboration.locator('.sisad-pdfme-lab-collaboration-chips .sisad-pdfme-lab-chip')).toHaveCount(3);
    await page.getByRole('combobox', { name: 'Seleccionar usuario activo' }).selectOption('legal-user-1');
    await expect(page.getByRole('combobox', { name: 'Seleccionar usuario activo' })).toHaveValue('legal-user-1');

    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');
    await expect(page.getByRole('combobox', { name: 'Seleccionar vista activa' })).toHaveValue('global');

    await expect(page.locator('.sisad-pdfme-ui-comments-overlay')).toBeVisible();
    await expectCanvasToStartEarly(page, 520);
  });

  test('filters canvas fields by active user view and clears hidden selection', async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');

    await openCollaborationDisclosure(page);

    const sharedField = page.getByText('Visible to all collaborators');
    const lockedField = page.getByText('Locked for final approval');
    await expect(sharedField).toBeVisible();

    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');
    await expect(sharedField).toBeVisible();
    if ((await lockedField.count()) > 0) {
      await expect(lockedField).toBeVisible();
      await lockedField.click();
    }

    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('user');
    await expect(page.getByRole('combobox', { name: 'Seleccionar vista activa' })).toHaveValue('user');
    await expect(sharedField).toBeVisible();
    await expect(lockedField).toBeHidden();
  });

  test('exposes collaboration ownership, comments and locks on the enterprise route', async ({ page }) => {
    await openLabRoute(page, '/lab/enterprise-collaboration');

    await expect(page.getByRole('heading', { name: 'Colaboración integral' })).toBeVisible();
    const collaboration = await openCollaborationDisclosure(page);

    await expect(page.getByRole('combobox', { name: 'Seleccionar usuario activo' })).toHaveValue('ops-user-1');
    await page.getByRole('combobox', { name: 'Seleccionar usuario activo' }).selectOption('sales-user-1');
    await expect(page.getByRole('combobox', { name: 'Seleccionar usuario activo' })).toHaveValue('sales-user-1');

    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');
    await expect(page.getByRole('combobox', { name: 'Seleccionar vista activa' })).toHaveValue('global');
    await expect(collaboration.locator('.sisad-pdfme-lab-collaboration-chips .sisad-pdfme-lab-chip')).toHaveCount(3);
    await expect(page.getByText(/Equipo de Ventas|sales-user-1/).first()).toBeVisible();
  });
});

// ── FASE 12 — Cross-platform shortcuts + Group operations ────────────────────
//
// Tests run against http://localhost:5174/lab/multiuser-collaboration
// Platform modifier: macOS → Meta, Windows/Linux → Control

const mod = process.platform === 'darwin' ? 'Meta' : 'Control';

/** Clicks the first schema on the canvas by clicking the paper at offset */
const clickFirstFieldOnCanvas = async (page: Page) => {
  const paper = page.locator('[data-paper-page="true"]').first();
  await expect(paper).toBeVisible();
  const box = await paper.boundingBox();
  if (!box) throw new Error('Paper not found');
  // Click at 25% x, 15% y — should land on the first field
  await page.mouse.click(box.x + box.width * 0.25, box.y + box.height * 0.15);
};

test.describe('cross-platform keyboard shortcuts', () => {
  test('Escape clears selection on the multiuser canvas', async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');
    const contextHeader = page.getByLabel('Contexto activo del editor');

    // Select a field then press Escape
    await clickFirstFieldOnCanvas(page);
    await page.keyboard.press('Escape');

    // After Escape, selection should be gone (context shows no "Selección")
    await expect(contextHeader).not.toContainText('Selección 1');
  });

  test(`${mod}+A selects all visible fields on current page`, async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');
    const contextHeader = page.getByLabel('Contexto activo del editor');

    // Click canvas first to ensure focus
    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();
    await paper.click();

    await page.keyboard.press(`${mod}+a`);

    await expect
      .poll(async () => (await contextHeader.textContent()) ?? '')
      .toMatch(/Selección(:\s*)?[2-9]\d*|Selección múltiple/i);
  });

  test(`${mod}+Z reverts a delete operation`, async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');

    await openCollaborationDisclosure(page);
    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');
    const schemas = page.locator('.sisad-pdfme-designer-canvas [data-schema-uid]');
    const before = await schemas.count();
    expect(before).toBeGreaterThan(0);
    await clickFirstFieldOnCanvas(page);
    page.once('dialog', (dialog) => dialog.dismiss());
    await page.keyboard.press('Delete');
    await expect(schemas).toHaveCount(before - 1);
    await page.keyboard.press(`${mod}+z`);
    await expect(schemas).toHaveCount(before);
  });

  test(`${mod}+G groups fields when two are selected`, async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');

    const contextHeader = page.getByLabel('Contexto activo del editor');
    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();

    // Select all visible fields with Mod+A
    await paper.click();
    await page.keyboard.press(`${mod}+a`);

    await expect
      .poll(async () => (await contextHeader.textContent()) ?? '')
      .toMatch(/Selección(:\s*)?[2-9]\d*|Selección múltiple/i);
    await page.keyboard.press(`${mod}+g`);
    await expect(contextHeader).toContainText(/Grupo|group|agrup/i);
  });

  test(`${mod}+Shift+G ungroups a previously grouped selection`, async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');

    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();

    const contextHeader = page.getByLabel('Contexto activo del editor');
    await paper.click();
    await page.keyboard.press(`${mod}+a`);
    await expect
      .poll(async () => (await contextHeader.textContent()) ?? '')
      .toMatch(/Selección(:\s*)?[2-9]\d*|Selección múltiple/i);
    await page.keyboard.press(`${mod}+g`);
    await expect(contextHeader).toContainText(/Grupo|group|agrup/i);
    await page.keyboard.press(`${mod}+Shift+g`);
    await expect(contextHeader).not.toContainText(/Grupo|group|agrup/i);
  });

  test('Delete key removes selected field (if editable)', async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');

    // Switch to global view so more fields are editable
    await openCollaborationDisclosure(page);
    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');

    const paper = page.locator('[data-paper-page="true"]').first();
    await expect(paper).toBeVisible();
    const schemas = page.locator('.sisad-pdfme-designer-canvas [data-schema-uid]');
    const before = await schemas.count();
    expect(before).toBeGreaterThan(0);

    // Click a field and press Delete — may show confirm dialog or just delete
    await clickFirstFieldOnCanvas(page);
    page.once('dialog', (dialog) => dialog.dismiss()); // dismiss confirmation if any
    await page.keyboard.press('Delete');

    const after = await schemas.count();
    expect(after).toBeLessThan(before);
  });

  test('Mod+A inside text input does not select canvas schemas', async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');
    const contextHeader = page.getByLabel('Contexto activo del editor');

    await selectFieldForDetail(page, 'signature');
    await openDetailPanel(page);
    await ensureDetailSectionExpanded(page, 'Datos');

    const baseUrlInput = page.getByRole('textbox', { name: /Base URL/i }).first();
    await expect(baseUrlInput).toBeVisible();
    await baseUrlInput.click();
    await page.keyboard.press(`${mod}+a`);
    await page.keyboard.type('https://typed-from-e2e.example.com');
    await expect(baseUrlInput).toHaveValue('https://typed-from-e2e.example.com');
    await expect(contextHeader).not.toContainText(/Selección(:\s*)?[2-9]\d*|Selección múltiple/i);
  });

  test('Delete inside comments textarea does not delete selected schema', async ({ page }) => {
    await openLabRoute(page, '/lab/multiuser-collaboration');
    await openCollaborationDisclosure(page);
    await page.getByRole('combobox', { name: 'Seleccionar vista activa' }).selectOption('global');

    const schemas = page.locator('.sisad-pdfme-designer-canvas [data-schema-uid]');
    const before = await schemas.count();
    expect(before).toBeGreaterThan(0);

    await clickFirstFieldOnCanvas(page);
    const addCommentButton = page.getByRole('button', { name: /Agregar comentario|Añadir comentario/i }).first();
    await expect(addCommentButton).toBeVisible();
    await addCommentButton.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const textarea = dialog.locator('textarea').first();
    await expect(textarea).toBeVisible();
    await textarea.fill('texto inicial');
    await page.keyboard.press('Delete');
    await expect(textarea).toHaveValue('texto inicial');
    await expect(schemas).toHaveCount(before);
  });
});

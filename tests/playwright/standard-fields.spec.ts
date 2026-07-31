import { expect, test } from '@playwright/test';

const openCatalog = async (page: import('@playwright/test').Page) => {
  const toggle = page
    .getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i })
    .first();
  await expect(toggle).toBeVisible();
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

const ensureCategoryOpen = async (page: import('@playwright/test').Page, category: string) => {
  const toggle = page.getByRole('button', { name: new RegExp(`^Alternar categoría ${category}$`, 'i') }).first();
  await expect(toggle).toBeVisible();
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    await toggle.click();
  }
};

test.describe('standard fields catalog', () => {
  test('exposes normalized labels for number and dropdown/select and renders the expected schema types', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR: ${err.message}`));

    await page.goto('/lab/multi-document-routing');
    await openCatalog(page);
    await ensureCategoryOpen(page, 'Texto');
    await ensureCategoryOpen(page, 'Selecciones');

    const selectionsGroup = page
      .locator('section')
      .filter({ has: page.getByRole('button', { name: /^Alternar categoría Selecciones$/i }) })
      .first();

    await expect(page.locator('[data-schema-type="number"]').first()).toBeVisible();
    await expect(page.locator('[data-schema-type="select"]').first()).toBeVisible();
    await expect(selectionsGroup.locator('button[data-schema-category="Selecciones"][data-schema-type]').first()).toBeVisible();

    const selectionButtons = selectionsGroup.locator('button[data-schema-category="Selecciones"][data-schema-type]');
    await expect(selectionButtons).toHaveCount(4);
    await expect(
      selectionsGroup.locator('button[data-schema-category="Selecciones"][data-schema-type="checkbox"]').first(),
    ).toHaveAttribute('data-schema-label', 'Casilla');
    await expect(
      selectionsGroup.locator('button[data-schema-category="Selecciones"][data-schema-type="checkboxGroup"]').first(),
    ).toHaveAttribute(
      'data-schema-label',
      'Grupo de Casillas',
    );
    await expect(
      selectionsGroup.locator('button[data-schema-category="Selecciones"][data-schema-type="radioGroup"]').first(),
    ).toHaveAttribute(
      'data-schema-label',
      'Opción',
    );
    await expect(
      selectionsGroup.locator('button[data-schema-category="Selecciones"][data-schema-type="select"]').first(),
    ).toHaveAttribute(
      'data-schema-label',
      'Lista Desplegable',
    );

    const uniqueTypeCount = await page.locator('button[data-schema-type][data-schema-kind="builtin"]').evaluateAll((nodes) => {
      const uniqueTypes = new Set<string>();
      nodes.forEach((node) => {
        const type = node.getAttribute('data-schema-type');
        if (type) uniqueTypes.add(type);
      });
      return uniqueTypes.size;
    });
    expect(uniqueTypeCount).toBe(28);

    await page.locator('[data-schema-type="number"]').first().dblclick();
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="number"]').count()).toBeGreaterThanOrEqual(1);

    await page.locator('[data-schema-type="select"]').first().dblclick();
    await expect.poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="select"]').count()).toBeGreaterThanOrEqual(1);

    expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  });
});

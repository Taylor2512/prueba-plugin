import { test } from '@playwright/test';

const openCatalog = async (page: any) => {
  const toggle = page
    .getByRole('button', { name: /Abrir catálogo de campos|Cerrar catálogo de campos/i })
    .first();
  await toggle.waitFor({ state: 'visible' });
  if (/Abrir catálogo/i.test((await toggle.textContent()) || '')) {
    await toggle.click();
  }
};

const ensureCategoryOpen = async (page: any, category: string) => {
  const toggle = page.getByRole('button', { name: new RegExp(`^Alternar categoría ${category}$`, 'i') }).first();
  await toggle.waitFor({ state: 'visible' });
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
    await toggle.click();
  }
};

const addCheckboxGroup = async (page: any) => {
  const canvasGroups = page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]');
  const catalogBtn = page.locator('button[data-schema-type="checkboxGroup"]').first();
  await catalogBtn.waitFor({ state: 'visible' });
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const before = await canvasGroups.count();
    await catalogBtn.dblclick();
    try {
      await expect.poll(async () => canvasGroups.count(), { timeout: 2500 });
      return;
    } catch {
      /* retry */
    }
  }
};

// Simple debug test: add a checkboxGroup and print presence of add-option button and HTML
test('debug add option presence', async ({ page }) => {
  await page.goto('/lab/multi-document-routing');
  await openCatalog(page);
  await ensureCategoryOpen(page, 'Selecciones');
  const catalogBtn = page.locator('button[data-schema-type="checkboxGroup"]').first();
  await catalogBtn.dblclick();
  await page.waitForTimeout(600);

  // Query for the add-option attribute
  const counts = await page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('[data-checkbox-group-add-option]'));
    const roots = Array.from(document.querySelectorAll('[data-checkbox-group-root]'));
    return {
      addOptionCount: nodes.length,
      rootCount: roots.length,
      firstAddHtml: nodes[0] ? nodes[0].outerHTML : null,
      firstRootHtml: roots[0] ? roots[0].outerHTML : null,
      bodyHtmlSnippet: document.body.innerHTML.slice(0, 3000),
    };
  });
  // Print to test runner output
  console.log(JSON.stringify(counts, null, 2));
});

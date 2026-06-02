import { expect, test } from '@playwright/test';

const overlap = (
  a: { left: number; top: number; right: number; bottom: number },
  b: { left: number; top: number; right: number; bottom: number },
) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

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

// Catalog click-to-add can miss a single activation in headless Chromium.
// Retry until at least one checkboxGroup is present on the canvas.
const addCheckboxGroup = async (page: import('@playwright/test').Page) => {
  const canvasGroups = page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]');
  const catalogBtn = page.locator('button[data-schema-type="checkboxGroup"]').first();
  await expect(catalogBtn).toBeVisible();
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const before = await canvasGroups.count();
    await catalogBtn.dblclick();
    try {
      await expect.poll(async () => canvasGroups.count(), { timeout: 2500 }).toBeGreaterThan(before);
      return;
    } catch {
      /* retry */
    }
  }
  await expect(canvasGroups).not.toHaveCount(0);
};

test.describe('checkboxGroup DocuSign-style behavior', () => {

  test('checkboxGroup is available in the catalog and renders a dashed group with options', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => consoleErrors.push(`PAGEERROR: ${err.message}`));

    await page.goto('/lab/multi-document-routing');
    await openCatalog(page);
    await ensureCategoryOpen(page, 'Selecciones');

    // Catalog exposes the checkbox group schema in the selection category
    await expect(page.locator('button[data-schema-type="checkboxGroup"]').first()).toBeVisible();

    // Add it to the canvas
    await addCheckboxGroup(page);

    // It renders as a checkboxGroup with its dashed group container + options
    await expect.poll(async () => page.locator('[data-checkbox-group-root]').count()).toBeGreaterThanOrEqual(1);
    await expect
      .poll(async () => page.locator('[data-checkbox-group-option]').count())
      .toBeGreaterThanOrEqual(2);

    // Group schema is registered with the correct type on the canvas
    await expect
      .poll(async () => page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]').count())
      .toBeGreaterThanOrEqual(1);

    // Stacked options do not visually overlap each other
    const rects = await page.evaluate(() => {
      const root = document.querySelector('[data-checkbox-group-root]');
      const els = Array.from(root?.querySelectorAll('[data-checkbox-group-option]') ?? []) as HTMLElement[];
      return els.map((el) => {
        const r = el.getBoundingClientRect();
        return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
      });
    });
    for (let i = 0; i < rects.length; i += 1) {
      for (let j = i + 1; j < rects.length; j += 1) {
        expect(overlap(rects[i], rects[j])).toBe(false);
      }
    }

    // No dark mask is shown over the canvas while adding the field
    await expect(page.locator('.sisad-pdfme-canvas-mask, .sisad-pdfme-designer-mask')).toHaveCount(0);
    expect(consoleErrors, consoleErrors.join('\n')).toHaveLength(0);
  });

  test('checkboxGroup exposes stable per-option ids and an add-option affordance', async ({ page }) => {
    await page.goto('/lab/multi-document-routing');
    await openCatalog(page);
    await ensureCategoryOpen(page, 'Selecciones');
    await addCheckboxGroup(page);

    await expect.poll(async () => page.locator('[data-checkbox-group-option]').count()).toBeGreaterThanOrEqual(2);

    // Each option carries a stable optionId attribute (snapshot/grouping contract)
    const optionIds = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-checkbox-group-option]')).map((el) =>
        el.getAttribute('data-checkbox-group-option'),
      );
    });
    expect(optionIds.length).toBeGreaterThanOrEqual(2);
    expect(new Set(optionIds).size).toBeGreaterThanOrEqual(2);
    expect(optionIds.every(Boolean)).toBe(true);

    // Selecting the group surfaces the DocuSign-style "+ Agregar opción"
    // affordance in the selection toolbar (rendered above Moveable, so it is
    // reachable — unlike the in-schema overlay). Clicking it appends one option.
    // Target the freshly added group (last) to stay robust to persisted state.
    const group = page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]').last();
    await group.click();

    const addOption = page.getByRole('button', { name: 'Agregar opción' }).first();
    await expect(addOption).toBeVisible();

    const optionsInGroup = () =>
      page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]').last().locator('[data-checkbox-group-option]');
    const before = await optionsInGroup().count();
    await addOption.click();
    await expect.poll(async () => optionsInGroup().count()).toBeGreaterThan(before);
  });
});

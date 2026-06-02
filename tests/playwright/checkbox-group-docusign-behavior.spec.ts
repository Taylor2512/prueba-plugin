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

// Click-to-add from the catalog is the stable path; pointer-based DnD activation
// is unreliable for these catalog items in headless Chromium.
const addFromCatalog = async (page: import('@playwright/test').Page, label: RegExp) => {
  await page.getByRole('button', { name: label }).first().dblclick();
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

    // Catalog exposes a friendly "Grupo de casillas" label (not the raw type)
    await expect(page.getByRole('button', { name: /^Grupo de casillas$/i }).first()).toBeVisible();

    // Add it to the canvas
    await addFromCatalog(page, /^Grupo de casillas$/i);

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
    await addFromCatalog(page, /^Grupo de casillas$/i);

    await expect.poll(async () => page.locator('[data-checkbox-group-root]').count()).toBeGreaterThanOrEqual(1);

    // Each option carries a stable optionId attribute (snapshot/grouping contract)
    const optionIds = await page.evaluate(() => {
      const root = document.querySelector('[data-checkbox-group-root]');
      return Array.from(root?.querySelectorAll('[data-checkbox-group-option]') ?? []).map((el) =>
        el.getAttribute('data-checkbox-group-option'),
      );
    });
    expect(optionIds.length).toBeGreaterThanOrEqual(2);
    expect(new Set(optionIds).size).toBe(optionIds.length); // all unique
    expect(optionIds.every(Boolean)).toBe(true);

    // The select-to-edit affordance for adding an option is present in the DOM
    // when the group is active. (Clicking it on-canvas is covered by unit tests:
    // tests/unit/checkboxGroup.schema.test.ts and checkboxConversion.test.ts —
    // Moveable's selection overlay sits above in-schema controls, so the canvas
    // click is exercised at the logic layer rather than through the overlay.)
    await page.locator('.sisad-pdfme-ui-custom-selectable[data-schema-type="checkboxGroup"]').first().click();
    await expect
      .poll(async () => page.locator('[data-checkbox-group-add-option]').count())
      .toBeGreaterThanOrEqual(1);
  });
});

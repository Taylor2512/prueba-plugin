/**
 * page-stack-layout.spec.ts
 *
 * Regression tests for vertical page-stack layout stability.
 * Guard against the CSS position-conflict bug where [data-canvas-page="true"]
 * overrode `position:absolute` to `position:relative`, causing cumulative
 * top-offset drift for multi-page documents. Also guards against schema
 * additions that alter inter-page gap.
 */
import { expect, test } from '@playwright/test';

const PAGE_URL = '/lab/multi-document-routing';

/** Returns the gap between the bottom of element[0] and the top of element[1]. */
async function measureInterPageGap(page: import('@playwright/test').Page): Promise<number | null> {
  return page.evaluate(() => {
    const els = [...document.querySelectorAll('[data-paper-page="true"]')];
    if (els.length < 2) return null;
    const a = els[0].getBoundingClientRect();
    const b = els[1].getBoundingClientRect();
    return b.top - a.bottom;
  });
}

/** Returns a snapshot of all paper-page bounding rects. */
async function snapshotPageRects(page: import('@playwright/test').Page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('[data-paper-page="true"]')].map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, height: r.height, left: r.left, width: r.width };
    }),
  );
}

/** Opens the schema catalog if needed. */
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
  const toggle = page
    .getByRole('button', { name: new RegExp(`^Alternar categoría ${category}$`, 'i') })
    .first();
  if (await toggle.isVisible()) {
    if ((await toggle.getAttribute('aria-expanded')) !== 'true') {
      await toggle.click();
    }
  }
};

/** Adds a schema by double-clicking its catalog button. Returns when the schema count increases. */
async function addSchemaByCatalogBtn(
  page: import('@playwright/test').Page,
  schemaType: string,
  selectorAttr = 'data-schema-type',
) {
  const existing = page.locator(`.sisad-pdfme-ui-custom-selectable[${selectorAttr}="${schemaType}"]`);
  const catalogBtn = page.locator(`button[${selectorAttr}="${schemaType}"]`).first();
  await expect(catalogBtn).toBeVisible();
  const before = await existing.count();
  await catalogBtn.dblclick();
  await expect
    .poll(async () => existing.count(), { timeout: 4000 })
    .toBeGreaterThan(before);
}

test.describe('page-stack layout stability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL);
    await expect(page.locator('[data-paper-page="true"]').first()).toBeVisible();
  });

  // ── Single-page sanity ────────────────────────────────────────────────────

  test('pages use position:absolute — top increases monotonically for multi-page', async ({ page }) => {
    const rects = await snapshotPageRects(page);
    if (rects.length < 2) {
      // Only 1 page — just verify the page is visible at a reasonable y position
      expect(rects[0].top).toBeGreaterThanOrEqual(0);
      return;
    }

    for (let i = 1; i < rects.length; i++) {
      expect(rects[i].top).toBeGreaterThan(rects[i - 1].top);
      expect(rects[i].top).toBeGreaterThan(rects[i - 1].bottom);
    }
  });

  test('inter-page gap is small and stable (< 80px) before adding any schema', async ({ page }) => {
    const gap = await measureInterPageGap(page);
    if (gap === null) {
      // Only 1 page — skip gap check
      return;
    }
    // Gap should be the PAGE_GAP (10px) scaled by whatever zoom, not 1000+px
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThan(80);
  });

  // ── Text schema add ───────────────────────────────────────────────────────

  test('adding a text schema does not change the inter-page gap', async ({ page }) => {
    const gapBefore = await measureInterPageGap(page);
    if (gapBefore === null) return; // 1-page doc, skip

    await openCatalog(page);
    await ensureCategoryOpen(page, 'Texto');
    await addSchemaByCatalogBtn(page, 'text');

    const gapAfter = await measureInterPageGap(page);
    expect(gapAfter).not.toBeNull();
    // Gap must not change by more than 24px (one schema-height at zoom)
    expect(Math.abs((gapAfter ?? 0) - gapBefore)).toBeLessThan(24);
  });

  // ── CheckboxGroup add ─────────────────────────────────────────────────────

  test('adding a checkboxGroup does not create phantom vertical gap', async ({ page }) => {
    const gapBefore = await measureInterPageGap(page);
    const rectsBefore = await snapshotPageRects(page);

    await openCatalog(page);
    await ensureCategoryOpen(page, 'Opciones');
    await addSchemaByCatalogBtn(page, 'checkboxGroup');

    const gapAfter = await measureInterPageGap(page);
    const rectsAfter = await snapshotPageRects(page);

    // Page count must not change
    expect(rectsAfter.length).toBe(rectsBefore.length);

    if (gapBefore !== null && gapAfter !== null) {
      expect(Math.abs(gapAfter - gapBefore)).toBeLessThan(24);
    }

    // Each page's height must be unchanged (schema doesn't expand page)
    for (let i = 0; i < rectsBefore.length; i++) {
      expect(Math.abs(rectsAfter[i].height - rectsBefore[i].height)).toBeLessThan(2);
    }
  });

  test('adding an option to a checkboxGroup does not expand the page stack gap', async ({ page }) => {
    await openCatalog(page);
    await ensureCategoryOpen(page, 'Opciones');
    await addSchemaByCatalogBtn(page, 'checkboxGroup');

    const gapBefore = await measureInterPageGap(page);
    const rectsBefore = await snapshotPageRects(page);

    // Trigger add-option via the schema's internal change — dispatch via JS to bypass
    // pointer-event interception from the parent schema selectable element.
    const triggered = await page.evaluate(() => {
      const btn = document.querySelector('[data-checkbox-group-add-option="true"]') as HTMLElement | null;
      if (!btn) return false;
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      return true;
    });

    if (triggered) {
      await page.waitForTimeout(400);

      const gapAfter = await measureInterPageGap(page);
      const rectsAfter = await snapshotPageRects(page);

      if (gapBefore !== null && gapAfter !== null) {
        expect(Math.abs(gapAfter - gapBefore)).toBeLessThan(24);
      }
      for (let i = 0; i < rectsBefore.length; i++) {
        const before = rectsBefore[i];
        const after = rectsAfter[i];
        if (before && after) {
          expect(Math.abs(after.height - before.height)).toBeLessThan(2);
        }
      }
    }
  });

  // ── Zoom stability ────────────────────────────────────────────────────────

  test('inter-page gap is proportional to zoom — gap stays small at 87% zoom', async ({ page }) => {
    // Find the zoom select and set to 87%
    const zoomSelect = page.locator('.sisad-pdfme-ui-zoom-select, [data-testid="zoom-select"]').first();
    if (!(await zoomSelect.isVisible({ timeout: 1000 }).catch(() => false))) {
      return; // zoom control not found, skip
    }

    await zoomSelect.click();
    const option87 = page.getByRole('option', { name: /87|0\.87/i }).first();
    if (await option87.isVisible({ timeout: 1000 }).catch(() => false)) {
      await option87.click();
      await page.waitForTimeout(400);
    }

    const gap = await measureInterPageGap(page);
    if (gap !== null) {
      expect(gap).toBeGreaterThanOrEqual(0);
      expect(gap).toBeLessThan(80);
    }
  });

  // ── Multi-page absolute position check ───────────────────────────────────

  test('second page top is close to first page bottom + small gap (< 80px)', async ({ page }) => {
    const rects = await snapshotPageRects(page);
    if (rects.length < 2) return;

    // The CSS position:absolute bug produced gaps of 1000+ px.
    // After fix, gap should be PAGE_GAP * scale (≈ 8–15px typically).
    const gap = rects[1].top - rects[0].bottom;
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThan(80);
  });

  test('after navigating to page 2, inter-page gap is still within bounds', async ({ page }) => {
    const rects = await snapshotPageRects(page);
    if (rects.length < 2) return;

    // Navigate to page 2 via the page selector
    const pageNextBtn = page.locator('.sisad-pdfme-ui-page-next').first();
    if (await pageNextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await pageNextBtn.click();
      await page.waitForTimeout(600);
    }

    // Gap between pages should remain small after navigation (no ghost gap from scroll)
    const gapAfterNav = await measureInterPageGap(page);
    if (gapAfterNav === null) return; // 1-page doc

    expect(gapAfterNav).toBeGreaterThanOrEqual(0);
    expect(gapAfterNav).toBeLessThan(80);
  });
});

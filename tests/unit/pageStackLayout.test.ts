/**
 * pageStackLayout.test.ts
 *
 * Unit tests for page-stack layout helpers.
 * Guards against regressions in getPagesScrollTopByIndex and the inter-page
 * gap constants used for scroll cursor detection.
 *
 * Background:
 * - getPagesScrollTopByIndex was broken: used `RULER_HEIGHT * scale` as a
 *   per-page gap instead of PAGE_GAP (10), and multiplied RULER_HEIGHT by
 *   scale twice. The fix uses the correct formula:
 *     (RULER_HEIGHT + sum_i(h_i * ZOOM + PAGE_GAP)) * scale
 *   where the sum excludes pages after `index`.
 * - hooks.ts used a hardcoded `12 * scale` gap instead of `PAGE_GAP * scale`.
 */
import { describe, expect, test } from 'vitest';
import { getPagesScrollTopByIndex } from '../../src/sisad-pdfme/ui/helper.js';
import { RULER_HEIGHT, PAGE_GAP } from '../../src/sisad-pdfme/ui/constants.js';
import { ZOOM } from '@sisad-pdfme/common';

const A4: { width: number; height: number } = { width: 210, height: 297 };
const A4_PX = A4.height * ZOOM; // unscaled px height of one A4 page

describe('getPagesScrollTopByIndex', () => {
  test('index 0 returns RULER_HEIGHT * scale (ruler at top only)', () => {
    const pages = [A4, A4];
    const scale = 1;
    const result = getPagesScrollTopByIndex(pages, 0, scale);
    // Page 0 starts at RULER_HEIGHT in the unscaled layer
    expect(result).toBeCloseTo(RULER_HEIGHT * scale, 1);
  });

  test('index 0 at scale=0.87 returns RULER_HEIGHT * 0.87', () => {
    const pages = [A4];
    const scale = 0.87;
    expect(getPagesScrollTopByIndex(pages, 0, scale)).toBeCloseTo(RULER_HEIGHT * scale, 1);
  });

  test('index 1 includes one page height plus PAGE_GAP between pages', () => {
    const pages = [A4, A4];
    const scale = 1;
    const result = getPagesScrollTopByIndex(pages, 1, scale);
    const expected = (RULER_HEIGHT + A4_PX + PAGE_GAP) * scale;
    expect(result).toBeCloseTo(expected, 1);
  });

  test('index 2 includes two page heights plus two PAGE_GAPs', () => {
    const pages = [A4, A4, A4];
    const scale = 1;
    const result = getPagesScrollTopByIndex(pages, 2, scale);
    const expected = (RULER_HEIGHT + (A4_PX + PAGE_GAP) * 2) * scale;
    expect(result).toBeCloseTo(expected, 1);
  });

  test('scale factor multiplies the full unscaled offset', () => {
    const pages = [A4, A4];
    const scale1 = getPagesScrollTopByIndex(pages, 1, 1);
    const scale2 = getPagesScrollTopByIndex(pages, 1, 2);
    expect(scale2).toBeCloseTo(scale1 * 2, 1);
  });

  test('inter-page distance is PAGE_GAP * scale, not RULER_HEIGHT * scale^2', () => {
    const pages = [A4, A4];
    const scale = 1;
    const top0 = getPagesScrollTopByIndex(pages, 0, scale);
    const top1 = getPagesScrollTopByIndex(pages, 1, scale);
    // Distance from page0 start to page1 start = page0Height + PAGE_GAP (all unscaled)
    const expectedDelta = (A4_PX + PAGE_GAP) * scale;
    expect(top1 - top0).toBeCloseTo(expectedDelta, 1);
  });

  test('does NOT use RULER_HEIGHT as a per-page gap (old bug)', () => {
    // The old formula added RULER_HEIGHT*scale per page, producing scale-squared
    // drift. Verify page-to-page delta matches PAGE_GAP, not RULER_HEIGHT.
    const pages = [A4, A4];
    const scale = 0.87;
    const top0 = getPagesScrollTopByIndex(pages, 0, scale);
    const top1 = getPagesScrollTopByIndex(pages, 1, scale);
    const delta = top1 - top0;
    const expectedDelta = (A4_PX + PAGE_GAP) * scale;
    const wrongDelta = (A4_PX + RULER_HEIGHT * scale) * scale; // old broken formula
    expect(Math.abs(delta - expectedDelta)).toBeLessThan(1);
    expect(Math.abs(delta - wrongDelta)).toBeGreaterThan(1); // ensure we're NOT using the old formula
  });

  test('empty slice (index 0) always equals RULER_HEIGHT * scale regardless of pages array', () => {
    const scales = [0.5, 0.87, 1.0, 1.5, 2.0];
    for (const scale of scales) {
      const result = getPagesScrollTopByIndex([A4, A4, A4], 0, scale);
      expect(result).toBeCloseTo(RULER_HEIGHT * scale, 1);
    }
  });
});

describe('PAGE_GAP constant', () => {
  test('PAGE_GAP is 10 (matches design spec)', () => {
    expect(PAGE_GAP).toBe(10);
  });

  test('RULER_HEIGHT is 22 (matches ruler component height)', () => {
    expect(RULER_HEIGHT).toBe(22);
  });

  test('PAGE_GAP != RULER_HEIGHT (they serve different roles)', () => {
    expect(PAGE_GAP).not.toBe(RULER_HEIGHT);
  });
});

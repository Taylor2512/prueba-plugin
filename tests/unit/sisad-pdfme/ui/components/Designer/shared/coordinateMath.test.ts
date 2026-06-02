import { describe, expect, it } from 'vitest';
import { rectToPointArea, resolveSelectionRegion } from '@/sisad-pdfme/ui/components/Designer/shared/coordinateMath.js';

describe('sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts', () => {
  it('converts DOM rects to point areas without changing the viewport coordinates', () => {
    expect(
      rectToPointArea({
        left: 10,
        top: 20,
        right: 30,
        bottom: 40,
        width: 20,
        height: 20,
      }),
    ).toEqual({
      pos1: [10, 20],
      pos2: [30, 20],
      pos3: [10, 40],
      pos4: [30, 40],
    });
  });

  it('resolves a selection region against page elements in viewport space', () => {
    const page1 = {
      getBoundingClientRect: () =>
        ({
          left: 100,
          top: 120,
          right: 300,
          bottom: 420,
          width: 200,
          height: 300,
        }) as DOMRect,
    } as HTMLElement;
    const page2 = {
      getBoundingClientRect: () =>
        ({
          left: 100,
          top: 460,
          right: 300,
          bottom: 760,
          width: 200,
          height: 300,
        }) as DOMRect,
    } as HTMLElement;

    const result = resolveSelectionRegion({
      startClientX: 140,
      startClientY: 160,
      endClientX: 260,
      endClientY: 340,
      pageElements: [page1, page2],
      zoom: 1,
    });

    expect(result.pageHits).toHaveLength(1);
    expect(result.pageHits[0].pageIndex).toBe(0);
    expect(result.pageHits[0].pageStartPoint).toEqual({ x: 40, y: 40 });
    expect(result.pageHits[0].pageEndPoint).toEqual({ x: 160, y: 220 });
  });
});

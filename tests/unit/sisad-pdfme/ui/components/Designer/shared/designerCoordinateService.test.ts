import { afterEach, describe, expect, it, vi } from 'vitest';
import { DesignerCoordinateService } from '@/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.js';

describe('sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps viewport rects unchanged for Selecto hit testing', () => {
    const service = new DesignerCoordinateService({
      getCanvasRoot: () =>
        ({
          getBoundingClientRect: () =>
            ({
              left: 50,
              top: 80,
              right: 450,
              bottom: 880,
              width: 400,
              height: 800,
            }) as DOMRect,
        }) as HTMLElement,
    });

    const rect = service.elementRectToViewportRect({
      getBoundingClientRect: () =>
        ({
          left: 120,
          top: 160,
          right: 260,
          bottom: 300,
          width: 140,
          height: 140,
        }) as DOMRect,
    } as HTMLElement);

    expect(rect).toEqual({
      pos1: [120, 160],
      pos2: [260, 160],
      pos3: [120, 300],
      pos4: [260, 300],
    });
  });

  it('keeps canvas-local conversion available for runtime geometry', () => {
    const getComputedStyleSpy = vi
      .spyOn(window, 'getComputedStyle')
      .mockReturnValue({ transform: 'matrix(2, 0, 0, 2, 0, 0)' } as CSSStyleDeclaration);

    const service = new DesignerCoordinateService({
      getCanvasRoot: () =>
        ({
          getBoundingClientRect: () =>
            ({
              left: 50,
              top: 80,
              right: 450,
              bottom: 880,
              width: 400,
              height: 800,
            }) as DOMRect,
        }) as HTMLElement,
    });

    const rect = service.elementRectToCanvasRect({
      getBoundingClientRect: () =>
        ({
          left: 130,
          top: 180,
          right: 230,
          bottom: 280,
          width: 100,
          height: 100,
        }) as DOMRect,
    } as HTMLElement);

    expect(getComputedStyleSpy).toHaveBeenCalled();
    expect(rect).toEqual({
      pos1: [40, 50],
      pos2: [90, 50],
      pos3: [40, 100],
      pos4: [90, 100],
    });
  });
});

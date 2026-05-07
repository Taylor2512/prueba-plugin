import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ZOOM } from '@sisad-pdfme/common';
import {
  DesignerCoordinateService,
  clientPointToPagePoint,
  getPageRectInViewport,
  pagePointToSchemaPoint,
  rectIntersects,
  resolveSelectionRegion,
} from '../../src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.js';

describe('DesignerCoordinateService', () => {
  let root: HTMLElement;
  let page: HTMLElement;
  let getComputedStyleSpy: ReturnType<typeof vi.spyOn>;

  const makeRect = (left: number, top: number, width: number, height: number) => ({
    left,
    top,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON: () => ({}),
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    root = document.createElement('div');
    page = document.createElement('div');
    document.body.appendChild(root);
    document.body.appendChild(page);

    Object.assign(root.style, { transform: 'scale(0.75)' });
    vi.spyOn(root, 'getBoundingClientRect').mockImplementation(() => makeRect(100, 50, 750, 1000) as DOMRect);
    vi.spyOn(page, 'getBoundingClientRect').mockImplementation(() => makeRect(100, 50, 750, 1000) as DOMRect);
    getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element: Element) => {
      if (element === root) {
        return { transform: 'scale(0.75)' } as unknown as CSSStyleDeclaration;
      }
      return { transform: 'none' } as unknown as CSSStyleDeclaration;
    });
  });

  afterEach(() => {
    getComputedStyleSpy.mockRestore();
    document.body.innerHTML = '';
  });

  it('converts viewport points to page-local points with transform scale', () => {
    const service = new DesignerCoordinateService({
      getZoom: () => 0.75,
      getCanvasRoot: () => root,
      getPageElement: () => page,
    });

    const pagePoint = service.viewportToPagePoint({ x: 250, y: 200 }, page);
    expect(pagePoint.x).toBeCloseTo(200, 5);
    expect(pagePoint.y).toBeCloseTo(200, 5);

    const schemaPoint = service.pagePointToSchemaPoint(pagePoint, 0);
    expect(schemaPoint.x).toBeCloseTo(200 / ZOOM, 5);
    expect(schemaPoint.y).toBeCloseTo(200 / ZOOM, 5);
  });

  it('clamps and normalizes rectangles', () => {
    const service = new DesignerCoordinateService({
      getZoom: () => 0.75,
      getCanvasRoot: () => root,
      getPageElement: () => page,
    });

    const rect = service.normalizeRect({ left: 20, top: 30, right: 10, bottom: 15, width: -10, height: -15 });
    expect(rect.left).toBe(10);
    expect(rect.top).toBe(15);
    expect(rect.width).toBe(10);
    expect(rect.height).toBe(15);

    const clamped = service.clampRectToPage(
      { left: -50, top: -20, right: 900, bottom: 1400, width: 950, height: 1420 },
      { width: 400, height: 600 },
    );
    expect(clamped.left).toBe(0);
    expect(clamped.top).toBe(0);
    expect(clamped.width).toBe(400);
    expect(clamped.height).toBe(600);
  });

  it('exposes shared helpers for page geometry and selection region hits', () => {
    const pageTwo = document.createElement('div');
    document.body.appendChild(pageTwo);

    vi.spyOn(pageTwo, 'getBoundingClientRect').mockImplementation(() => makeRect(100, 1080, 750, 1000) as DOMRect);

    const pageRect = getPageRectInViewport(page);
    const pagePoint = clientPointToPagePoint(250, 200, pageRect, 0.75);
    expect(pagePoint.x).toBeCloseTo(200, 5);
    expect(pagePoint.y).toBeCloseTo(200, 5);

    const schemaPoint = pagePointToSchemaPoint(pagePoint);
    expect(schemaPoint.x).toBeCloseTo(200 / ZOOM, 5);
    expect(schemaPoint.y).toBeCloseTo(200 / ZOOM, 5);

    expect(rectIntersects(pageRect, pageRect)).toBe(true);
    expect(rectIntersects(pageRect, { left: 900, top: 900, right: 950, bottom: 950, width: 50, height: 50 })).toBe(false);

    const selection = resolveSelectionRegion({
      startClientX: 120,
      startClientY: 80,
      endClientX: 180,
      endClientY: 240,
      pageElements: [page, pageTwo],
      zoom: 0.75,
    });

    expect(selection.pageHits).toHaveLength(1);
    expect(selection.pageHits[0]?.pageIndex).toBe(0);
    expect(selection.pageHits[0]?.pageStartPoint.x).toBeCloseTo((120 - 100) / 0.75, 5);
    expect(selection.pageHits[0]?.pageEndPoint.y).toBeCloseTo((240 - 50) / 0.75, 5);
  });
});

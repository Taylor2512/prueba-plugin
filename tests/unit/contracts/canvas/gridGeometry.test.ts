/**
 * Contrato de la geometría de rejilla (RTP-450).
 *
 * La propiedad que importa: un punto ajustado en mm y proyectado a píxeles
 * cae exactamente sobre una línea del renderer, a CUALQUIER zoom. Si eso no se
 * cumple, rejilla y snap son dos autoridades distintas otra vez.
 */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_GRID_STEP_MM,
  DEFAULT_GRID_SUBDIVISIONS,
  canvasPxToMm,
  createGridGeometry,
  gridCssVariables,
  gridLinesMm,
  gridRenderMetrics,
  mmToCanvasPx,
  snapPointToGrid,
  snapRectToGrid,
} from '../../../../src/sisad-pdfme/ui/components/Designer/Canvas/gridGeometry';

const A4 = { width: 210, height: 297 };
const LETTER = { width: 215.9, height: 279.4 };
const CUSTOM = { width: 100, height: 63.5 };
const ZOOM_LEVELS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const PAGES = [A4, LETTER, CUSTOM];

describe('createGridGeometry', () => {
  it('deriva el paso menor de las subdivisiones', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 2 });
    expect(geometry.minorStepMm).toBe(5);
    expect(geometry.stepMm).toBe(10);
  });

  it('rechaza pasos y subdivisiones inválidos con defaults', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 0, subdivisions: 0 });
    expect(geometry.stepMm).toBe(DEFAULT_GRID_STEP_MM);
    expect(geometry.subdivisions).toBe(DEFAULT_GRID_SUBDIVISIONS);

    const negative = createGridGeometry({ pageMm: A4, stepMm: -5, subdivisions: Number.NaN });
    expect(negative.stepMm).toBe(DEFAULT_GRID_STEP_MM);
    expect(negative.subdivisions).toBe(DEFAULT_GRID_SUBDIVISIONS);

    // Una subdivisión fraccionaria se redondea, nunca produce paso 0.
    expect(createGridGeometry({ pageMm: A4, subdivisions: 2.4 }).subdivisions).toBe(2);
    expect(createGridGeometry({ pageMm: A4, subdivisions: 0.2 }).subdivisions).toBe(1);
  });

  it('el origen por defecto es el borde del papel', () => {
    expect(createGridGeometry({ pageMm: A4 }).originMm).toEqual({ x: 0, y: 0 });
  });
});

describe('gridLinesMm', () => {
  it('recorta las líneas al papel', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 1 });
    const lines = gridLinesMm(geometry, 'x');
    expect(lines[0]).toBe(0);
    expect(lines[lines.length - 1]).toBe(210);
    expect(lines.every((line) => line >= 0 && line <= A4.width)).toBe(true);
  });

  it('respeta un origen desplazado por padding', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 1, originMm: { x: 3, y: 3 } });
    const lines = gridLinesMm(geometry, 'x');
    expect(lines[0]).toBe(3);
    expect(lines).not.toContain(0);
    expect(lines.every((line) => line <= A4.width)).toBe(true);
  });

  it('las líneas mayores son un subconjunto de las menores', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 2 });
    const minor = new Set(gridLinesMm(geometry, 'y', 'minor'));
    gridLinesMm(geometry, 'y', 'major').forEach((line) => expect(minor.has(line)).toBe(true));
  });

  it('una página sin tamaño no produce líneas', () => {
    expect(gridLinesMm(createGridGeometry({ pageMm: { width: 0, height: 0 } }), 'x')).toEqual([]);
  });
});

describe('snapPointToGrid', () => {
  const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 2 });

  it('captura al paso menor dentro del umbral', () => {
    const result = snapPointToGrid(geometry, { x: 14.6, y: 20.3 }, { thresholdMm: 1 });
    expect(result.point).toEqual({ x: 15, y: 20 });
    expect(result.snapped).toBe(true);
    expect(result.x.lineMm).toBe(15);
  });

  it('no toca la coordenada fuera del umbral', () => {
    const result = snapPointToGrid(geometry, { x: 12.5, y: 20 }, { thresholdMm: 1 });
    expect(result.x.snapped).toBe(false);
    expect(result.x.value).toBe(12.5);
    expect(result.y.snapped).toBe(true);
  });

  it('los ejes se capturan de forma independiente', () => {
    const result = snapPointToGrid(geometry, { x: 5.2, y: 12.5 }, { thresholdMm: 1 });
    expect(result.x.snapped).toBe(true);
    expect(result.y.snapped).toBe(false);
    expect(result.snapped).toBe(true);
  });

  it('puede capturar al paso mayor', () => {
    const result = snapPointToGrid(geometry, { x: 9.5, y: 9.5 }, { thresholdMm: 1, useMajorStep: true });
    expect(result.point).toEqual({ x: 10, y: 10 });
  });

  it('respeta el origen desplazado', () => {
    const shifted = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 1, originMm: { x: 3, y: 3 } });
    expect(snapPointToGrid(shifted, { x: 12.8, y: 3.4 }, { thresholdMm: 1 }).point).toEqual({ x: 13, y: 3 });
  });
});

describe('snapRectToGrid', () => {
  it('ajusta el origen y conserva el tamaño', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 2 });
    const { rect } = snapRectToGrid(geometry, { x: 14.7, y: 24.6, width: 33.3, height: 7.2 }, { thresholdMm: 1 });
    expect(rect).toEqual({ x: 15, y: 25, width: 33.3, height: 7.2 });
  });
});

describe('paridad renderer / snap', () => {
  it('un punto capturado cae sobre una línea del renderer a cualquier zoom', () => {
    PAGES.forEach((pageMm) => {
      const geometry = createGridGeometry({ pageMm, stepMm: 10, subdivisions: 2 });
      ZOOM_LEVELS.forEach((zoom) => {
        const metrics = gridRenderMetrics(geometry, zoom);
        const snapped = snapPointToGrid(geometry, { x: 14.6, y: 27.4 }, { thresholdMm: 1 });
        const px = mmToCanvasPx(snapped.point.x, zoom) - metrics.offsetXPx;
        const indexOnGrid = px / metrics.minorStepPx;
        expect(
          Math.abs(indexOnGrid - Math.round(indexOnGrid)),
          `page ${pageMm.width}x${pageMm.height} @ ${zoom}`,
        ).toBeLessThan(1e-9);
      });
    });
  });

  it('las coordenadas lógicas no dependen del zoom', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 2 });
    const reference = snapPointToGrid(geometry, { x: 14.6, y: 27.4 }, { thresholdMm: 1 }).point;
    ZOOM_LEVELS.forEach((zoom) => {
      const metrics = gridRenderMetrics(geometry, zoom);
      expect(canvasPxToMm(mmToCanvasPx(reference.x, zoom), zoom)).toBeCloseTo(reference.x, 9);
      expect(metrics.zoom).toBe(zoom);
    });
  });

  it('las métricas escalan linealmente con el zoom', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 2 });
    const base = gridRenderMetrics(geometry, 1);
    ZOOM_LEVELS.forEach((zoom) => {
      const metrics = gridRenderMetrics(geometry, zoom);
      expect(metrics.minorStepPx).toBeCloseTo(base.minorStepPx * zoom, 9);
      expect(metrics.majorStepPx).toBeCloseTo(base.majorStepPx * zoom, 9);
      expect(metrics.pagePx.width).toBeCloseTo(base.pagePx.width * zoom, 9);
    });
  });

  it('el paso mayor es múltiplo entero del menor en píxeles', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 2 });
    ZOOM_LEVELS.forEach((zoom) => {
      const metrics = gridRenderMetrics(geometry, zoom);
      expect(metrics.majorStepPx / metrics.minorStepPx).toBeCloseTo(geometry.subdivisions, 9);
    });
  });

  it('expone la geometría como variables CSS derivadas, no constantes', () => {
    const geometry = createGridGeometry({ pageMm: A4, stepMm: 10, subdivisions: 2 });
    const atOne = gridCssVariables(geometry, 1);
    const atTwo = gridCssVariables(geometry, 2);
    expect(atOne['--sisad-grid-step']).not.toBe(atTwo['--sisad-grid-step']);
    expect(Number.parseFloat(atTwo['--sisad-grid-step'])).toBeCloseTo(
      Number.parseFloat(atOne['--sisad-grid-step']) * 2,
      9,
    );
  });
});

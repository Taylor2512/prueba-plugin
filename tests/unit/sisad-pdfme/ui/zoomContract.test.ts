/**
 * COREUX-017 — Contrato de zoom y ajuste.
 *
 * Criterios: paridad controller/toolbar (una sola aritmética), porcentaje
 * siempre válido, y el ajuste conserva página/selección — aquí se cubre la
 * parte calculable; la preservación de página se verifica en el Designer.
 *
 * Cubre además BASE-01 del baseline: el ajuste no puede quedar topado por el
 * suelo del zoom manual.
 */
import { describe, expect, it } from 'vitest';
import {
  AUTO_FIT_WIDTH_BREAKPOINT,
  FIT_MIN_ZOOM,
  MANUAL_MIN_ZOOM,
  clampZoom,
  computeFitZoom,
  fitFitsWithinCanvas,
  formatZoomPercent,
  resolveAutoFitMode,
} from '@/sisad-pdfme/ui/components/Designer/shared/zoomContract';

/** A4 en unidades de template, con la conversión que usa el Designer. */
const A4 = { width: 210, height: 297 };
const UNIT_SCALE = 3.7795;

const input = (canvas: { width: number; height: number }, viewportWidth = 1440) => ({
  pageSize: A4,
  canvas,
  unitScale: UNIT_SCALE,
  baseScale: 1,
  maxZoom: 4,
  viewportWidth,
});

describe('BASE-01 · el ajuste cabe en viewports estrechos', () => {
  it('fit-page cabe a 390 px, donde antes quedaba topado', () => {
    // Canvas real medido en el baseline a 390 px de viewport.
    const narrow = input({ width: 198, height: 700 }, 390);
    const zoom = computeFitZoom('fit-page', narrow);

    expect(zoom).not.toBeNull();
    // Con el suelo manual (0.25) esto no cabría: la página mide ~794 px de ancho.
    expect(zoom!).toBeLessThan(MANUAL_MIN_ZOOM);
    expect(zoom!).toBeGreaterThanOrEqual(FIT_MIN_ZOOM);
    expect(fitFitsWithinCanvas('fit-page', narrow)).toBe(true);
  });

  it('fit-page cabe a 768 px', () => {
    const tablet = input({ width: 576, height: 900 }, 768);

    expect(fitFitsWithinCanvas('fit-page', tablet)).toBe(true);
  });

  it('sigue cabiendo en desktop', () => {
    [
      input({ width: 832, height: 700 }, 1024),
      input({ width: 1229, height: 844 }, 1440),
      input({ width: 1672, height: 1032 }, 1920),
    ].forEach((viewport) => {
      expect(fitFitsWithinCanvas('fit-page', viewport)).toBe(true);
    });
  });

  it('el zoom manual conserva su suelo más alto', () => {
    expect(clampZoom(0.01, 4, 'manual')).toBe(MANUAL_MIN_ZOOM);
    expect(clampZoom(0.01, 4, 'fit')).toBe(FIT_MIN_ZOOM);
  });
});

describe('modos de ajuste', () => {
  it('fit-width usa solo el ancho', () => {
    const zoom = computeFitZoom('fit-width', input({ width: 794, height: 100 }));

    expect(zoom).toBeCloseTo(1, 2);
  });

  it('fit-page toma la dimensión más restrictiva', () => {
    const wide = input({ width: 2000, height: 400 });

    // La altura manda: 400 px para una página de ~1122 px.
    expect(computeFitZoom('fit-page', wide)!).toBeLessThan(
      computeFitZoom('fit-width', wide)!,
    );
  });

  it('actual-size ignora el canvas', () => {
    expect(computeFitZoom('actual-size', input({ width: 100, height: 100 }))).toBe(1);
  });

  it('manual no calcula ajuste', () => {
    expect(computeFitZoom('manual', input({ width: 800, height: 800 }))).toBeNull();
  });

  it('respeta el techo de zoom', () => {
    const zoom = computeFitZoom('fit-width', { ...input({ width: 8000, height: 8000 }), maxZoom: 2 });

    expect(zoom).toBe(2);
  });
});

describe('modo auto', () => {
  it('prefiere ajustar a lo ancho por debajo del breakpoint', () => {
    expect(resolveAutoFitMode('auto', AUTO_FIT_WIDTH_BREAKPOINT)).toBe('fit-width');
    expect(resolveAutoFitMode('auto', AUTO_FIT_WIDTH_BREAKPOINT - 1)).toBe('fit-width');
  });

  it('ajusta a la página por encima', () => {
    expect(resolveAutoFitMode('auto', AUTO_FIT_WIDTH_BREAKPOINT + 1)).toBe('fit-page');
  });

  it('no toca los modos explícitos', () => {
    expect(resolveAutoFitMode('fit-page', 390)).toBe('fit-page');
    expect(resolveAutoFitMode('manual', 1920)).toBe('manual');
  });
});

describe('entradas inválidas', () => {
  it('devuelve null en vez de inventar un zoom', () => {
    const base = input({ width: 800, height: 800 });

    expect(computeFitZoom('fit-page', { ...base, pageSize: { width: 0, height: 0 } })).toBeNull();
    expect(computeFitZoom('fit-page', { ...base, canvas: { width: 0, height: 0 } })).toBeNull();
    expect(computeFitZoom('fit-page', { ...base, baseScale: 0 })).toBeNull();
    expect(computeFitZoom('fit-page', { ...base, unitScale: Number.NaN })).toBeNull();
  });
});

describe('porcentaje visible siempre válido', () => {
  it('formatea valores normales', () => {
    expect(formatZoomPercent(1)).toBe('100%');
    expect(formatZoomPercent(0.5)).toBe('50%');
    expect(formatZoomPercent(2.345)).toBe('235%');
  });

  it('nunca muestra NaN, negativo ni cero', () => {
    [Number.NaN, -1, 0, Number.POSITIVE_INFINITY].forEach((value) => {
      const text = formatZoomPercent(value as number);
      expect(text).toMatch(/^\d+%$/);
      expect(text).not.toBe('0%');
    });
  });
});

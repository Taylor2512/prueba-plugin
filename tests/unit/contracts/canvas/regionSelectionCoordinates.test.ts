/**
 * Espacios de coordenadas de la selección por región.
 *
 * El defecto que motiva este contrato: el rectángulo que Selecto DIBUJA y el
 * que usa para el HIT-TEST vivían en espacios distintos. El hit-test usa
 * `elementRectToViewportRect` (viewport puro); el dibujo se posicionaba dentro
 * del contenedor de scroll del canvas, cuyo espacio se desplaza con el scroll.
 * Mientras el canvas no estaba desplazado ambos coincidían por casualidad.
 *
 * Estos tests fijan que los dos espacios son DISTINTOS y por cuánto, para que
 * mezclarlos vuelva a ser un error detectable y no una coincidencia.
 */
import { describe, expect, it } from 'vitest';
import { DesignerCoordinateService } from '../../../../src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService';
import { normalizeRect } from '../../../../src/sisad-pdfme/ui/components/Designer/shared/coordinateMath';

type Caja = { left: number; top: number; width: number; height: number };

/** Nodo mínimo con la geometría que el servicio consulta. */
const nodoCon = (caja: Caja): HTMLElement => {
  const elemento = document.createElement('div');
  elemento.getBoundingClientRect = () =>
    ({
      left: caja.left,
      top: caja.top,
      right: caja.left + caja.width,
      bottom: caja.top + caja.height,
      width: caja.width,
      height: caja.height,
      x: caja.left,
      y: caja.top,
      toJSON: () => ({}),
    }) as DOMRect;
  return elemento;
};

const CANVAS: Caja = { left: 8, top: 56, width: 1264, height: 656 };

const servicioCon = (canvas: HTMLElement, zoom = 1) =>
  new DesignerCoordinateService({
    getZoom: () => zoom,
    getCanvasRoot: () => canvas,
    getPageElement: () => null,
  });

describe('espacios de coordenadas de la región', () => {
  it('el rect de viewport no depende del canvas', () => {
    const canvas = nodoCon(CANVAS);
    const servicio = servicioCon(canvas);
    const schema = nodoCon({ left: 208, top: 100, width: 194, height: 30 });

    const viewport = servicio.elementRectToViewportRect(schema);
    expect(viewport.pos1).toEqual([208, 100]);
    expect(viewport.pos4).toEqual([402, 130]);
  });

  it('el rect de canvas está desplazado por el origen del canvas', () => {
    const canvas = nodoCon(CANVAS);
    const servicio = servicioCon(canvas);
    const schema = nodoCon({ left: 208, top: 100, width: 194, height: 30 });

    const enCanvas = servicio.elementRectToCanvasRect(schema);
    // Exactamente el origen del canvas de diferencia: son espacios distintos y
    // usar uno donde se espera el otro desplaza el resultado por ese vector.
    expect(enCanvas.pos1).toEqual([208 - CANVAS.left, 100 - CANVAS.top]);
    expect(enCanvas.pos4).toEqual([402 - CANVAS.left, 130 - CANVAS.top]);
  });

  it('la conversión viewport→canvas es la inversa del origen del canvas', () => {
    const canvas = nodoCon(CANVAS);
    const servicio = servicioCon(canvas);
    expect(servicio.viewportToCanvasPoint({ x: 208, y: 100 })).toEqual({
      x: 208 - CANVAS.left,
      y: 100 - CANVAS.top,
    });
  });

  it('sin canvas raíz, viewport y canvas son el mismo espacio', () => {
    const servicio = new DesignerCoordinateService({ getZoom: () => 1, getCanvasRoot: () => null });
    const schema = nodoCon({ left: 208, top: 100, width: 194, height: 30 });
    expect(servicio.elementRectToCanvasRect(schema)).toEqual(servicio.elementRectToViewportRect(schema));
  });
});

describe('normalización de la región arrastrada', () => {
  it('un arrastre inverso produce el mismo rectángulo que uno directo', () => {
    const directo = normalizeRect({ left: 100, top: 80, right: 400, bottom: 300, width: 300, height: 220 });
    const inverso = normalizeRect({ left: 400, top: 300, right: 100, bottom: 80, width: -300, height: -220 });
    expect(inverso).toEqual(directo);
  });

  it('el rectángulo normalizado nunca tiene medidas negativas', () => {
    const rect = normalizeRect({ left: 400, top: 300, right: 100, bottom: 80, width: -300, height: -220 });
    expect(rect.width).toBeGreaterThanOrEqual(0);
    expect(rect.height).toBeGreaterThanOrEqual(0);
    expect(rect.left).toBeLessThanOrEqual(rect.right);
    expect(rect.top).toBeLessThanOrEqual(rect.bottom);
  });
});

describe('la región se acota a la página', () => {
  it('un rectángulo mayor que la página se recorta a la página', () => {
    const servicio = servicioCon(nodoCon(CANVAS));
    const acotado = servicio.clampRectToPage(
      { left: -50, top: -20, right: 500, bottom: 900, width: 550, height: 920 },
      { width: 210, height: 297 },
    );
    expect(acotado.left).toBe(0);
    expect(acotado.top).toBe(0);
    expect(acotado.width).toBe(210);
    expect(acotado.height).toBe(297);
  });
});

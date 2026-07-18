import { describe, it, expect, afterEach } from 'vitest';
import { useFloatingToolbarPosition } from '@/sisad-pdfme/ui/components/Designer/Canvas/overlays/useFloatingToolbarPosition';

describe('useFloatingToolbarPosition', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('returns selection bounds in canvas scroll coordinates, not an already floating toolbar position', () => {
    const canvas = document.createElement('div');
    canvas.className = 'sisad-pdfme-designer-canvas';
    Object.defineProperties(canvas, {
      scrollLeft: { value: 40, configurable: true },
      scrollTop: { value: 80, configurable: true },
    });
    canvas.getBoundingClientRect = () => ({
      left: 20,
      top: 30,
      right: 620,
      bottom: 430,
      width: 600,
      height: 400,
      x: 20,
      y: 30,
      toJSON: () => ({}),
    });

    const schema = document.createElement('button');
    schema.getBoundingClientRect = () => ({
      left: 120,
      top: 180,
      right: 220,
      bottom: 230,
      width: 100,
      height: 50,
      x: 120,
      y: 180,
      toJSON: () => ({}),
    });
    canvas.appendChild(schema);
    document.body.appendChild(canvas);

    expect(useFloatingToolbarPosition([schema], { width: 300, height: 200 })).toEqual({
      top: 230,
      left: 140,
      right: 240,
      bottom: 280,
      width: 100,
      height: 50,
    });
  });
});

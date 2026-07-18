import { describe, it, expect } from 'vitest';
import {
  FLOATING_SURFACE_EDGE_GAP,
  resolveCenteredFloatingSurfacePosition,
  resolveSelectionToolbarPosition,
} from '@/sisad-pdfme/ui/components/Designer/Canvas/overlays/floatingSurfaceGeometry';

describe('floatingSurfaceGeometry', () => {
  const viewport = { left: 100, top: 200, width: 500, height: 320 };
  const surface = { width: 120, height: 36 };

  it('places the selection toolbar 8px above the selected schema when there is room', () => {
    expect(resolveSelectionToolbarPosition(
      { left: 280, top: 280, right: 360, bottom: 320 },
      surface,
      viewport,
    )).toEqual({
      left: 260,
      top: 280 - surface.height - FLOATING_SURFACE_EDGE_GAP,
    });
  });

  it('flips the selection toolbar below the schema and clamps inside the canvas viewport', () => {
    expect(resolveSelectionToolbarPosition(
      { left: 90, top: 210, right: 140, bottom: 240 },
      surface,
      viewport,
    )).toEqual({
      left: viewport.left + FLOATING_SURFACE_EDGE_GAP,
      top: 240 + FLOATING_SURFACE_EDGE_GAP,
    });
  });

  it('clamps centered multi-selection surfaces to the visible stage', () => {
    expect(resolveCenteredFloatingSurfacePosition(
      { left: 570, top: 235, right: 620, bottom: 260 },
      surface,
      viewport,
    )).toEqual({
      left: viewport.left + viewport.width - surface.width - FLOATING_SURFACE_EDGE_GAP,
      top: 260 + FLOATING_SURFACE_EDGE_GAP,
    });
  });
});

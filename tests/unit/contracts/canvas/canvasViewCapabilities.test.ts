/**
 * Independencia de las capabilities de vista del canvas (RTP-455).
 *
 * El contrato de campaña las nombra explícitamente como independientes:
 * grid visibility, snap-to-grid, guides visibility, guide creation, guide
 * snap, object snap, rulers y snap lines. Dos de ellas estaban acopladas en
 * Canvas.tsx y este test lo impide de vuelta.
 */
import { describe, expect, it } from 'vitest';
import {
  CANVAS_VIEW_CAPABILITIES,
  canvasViewDataAttributes,
  resolveCanvasViewCapabilities,
  type CanvasViewCapability,
} from '../../../../src/sisad-pdfme/ui/components/Designer/Canvas/canvasViewCapabilities';
import { resolveSisadPdfmeConfig } from '../../../../src/sisad-pdfme/config/resolveSisadPdfmeConfig';

const allOn = CANVAS_VIEW_CAPABILITIES.reduce(
  (accumulator, capability) => ({ ...accumulator, [capability]: true }),
  {} as Record<CanvasViewCapability, boolean>,
);

describe('canvas view capabilities', () => {
  it('las reglas no dependen de las guías', () => {
    const snapshot = resolveCanvasViewCapabilities({
      toggles: { ...allOn, guides: false },
      visibility: {},
    });
    expect(snapshot.guides.active).toBe(false);
    expect(snapshot.rulers.active).toBe(true);
  });

  it('las guías no dependen de las reglas', () => {
    const snapshot = resolveCanvasViewCapabilities({
      toggles: { ...allOn, rulers: false },
      visibility: {},
    });
    expect(snapshot.rulers.active).toBe(false);
    expect(snapshot.guides.active).toBe(true);
  });

  it('ver la rejilla y ajustar a la rejilla son cosas distintas', () => {
    const soloVisible = resolveCanvasViewCapabilities({
      toggles: { ...allOn, snapToGrid: false },
    });
    expect(soloVisible.grid.active).toBe(true);
    expect(soloVisible.snapToGrid.active).toBe(false);

    const soloSnap = resolveCanvasViewCapabilities({
      toggles: { ...allOn, grid: false },
    });
    expect(soloSnap.grid.active).toBe(false);
    expect(soloSnap.snapToGrid.active).toBe(true);
  });

  it('ver las líneas de snap y que el snap actúe son cosas distintas', () => {
    const snapshot = resolveCanvasViewCapabilities({
      toggles: { ...allOn, snapLines: false },
    });
    expect(snapshot.snapLines.active).toBe(false);
    expect(snapshot.objectSnap.active).toBe(true);
  });

  it('apagar una capability no arrastra a ninguna otra', () => {
    CANVAS_VIEW_CAPABILITIES.forEach((target) => {
      const snapshot = resolveCanvasViewCapabilities({ toggles: { ...allOn, [target]: false } });
      CANVAS_VIEW_CAPABILITIES.forEach((other) => {
        expect(snapshot[other].active, `${target} apagó ${other}`).toBe(other !== target);
      });
    });
  });

  it('la visibilidad del host sólo puede apagar', () => {
    const snapshot = resolveCanvasViewCapabilities({
      toggles: { ...allOn },
      visibility: { grid: false },
    });
    expect(snapshot.grid.visible).toBe(false);
    expect(snapshot.grid.active).toBe(false);
    // Encender la visibilidad no enciende una capability deshabilitada.
    const forced = resolveCanvasViewCapabilities({
      toggles: { ...allOn, guides: false },
      visibility: { guides: true },
    });
    expect(forced.guides.active).toBe(false);
  });

  it('la sesión manda dentro de lo permitido', () => {
    const snapshot = resolveCanvasViewCapabilities({
      toggles: { ...allOn, grid: false },
      session: { grid: true },
    });
    expect(snapshot.grid.active).toBe(true);

    const bloqueada = resolveCanvasViewCapabilities({
      toggles: { ...allOn },
      visibility: { grid: false },
      session: { grid: true },
    });
    expect(bloqueada.grid.active).toBe(false);
  });

  it('un canvas deshabilitado apaga el estado efectivo de todas', () => {
    const snapshot = resolveCanvasViewCapabilities({ toggles: { ...allOn }, canvasEnabled: false });
    CANVAS_VIEW_CAPABILITIES.forEach((capability) => {
      expect(snapshot[capability].active, capability).toBe(false);
    });
  });

  it('expone un data-attribute distinto por capability', () => {
    const attributes = canvasViewDataAttributes(resolveCanvasViewCapabilities({ toggles: allOn }));
    expect(Object.keys(attributes)).toHaveLength(CANVAS_VIEW_CAPABILITIES.length);
    expect(new Set(Object.keys(attributes)).size).toBe(CANVAS_VIEW_CAPABILITIES.length);
  });
});

describe('propagación desde la configuración resuelta', () => {
  it('las ocho capabilities llegan al canvas desde config.canvas', () => {
    const resolved = resolveSisadPdfmeConfig({});
    const toggles = resolved.designerEngine.canvas?.featureToggles as
      | Record<string, unknown>
      | undefined;
    expect(toggles).toBeDefined();
    CANVAS_VIEW_CAPABILITIES.forEach((capability) => {
      expect(toggles, capability).toHaveProperty(capability);
    });
  });

  it('la rama canvas de la configuración declara TODAS las capabilities de vista', () => {
    const resolved = resolveSisadPdfmeConfig({});
    const canvas = resolved.config.canvas as Record<string, unknown>;
    // `Designer` deriva sus toggles de esta rama. Si a la configuración le
    // falta una capability, la reenvía como `undefined` y el canvas la
    // interpreta como apagada sin que nadie pueda encenderla.
    CANVAS_VIEW_CAPABILITIES.forEach((capability) => {
      expect(canvas, capability).toHaveProperty(capability);
      expect(typeof canvas[capability], `${capability} debe ser booleano`).toBe('boolean');
    });
  });

  it('el default histórico se conserva: rejilla apagada, object snap encendido', () => {
    const resolved = resolveSisadPdfmeConfig({});
    const snapshot = resolveCanvasViewCapabilities({
      toggles: resolved.designerEngine.canvas?.featureToggles,
      visibility: resolved.visibility.canvas,
    });
    expect(snapshot.grid.active).toBe(false);
    expect(snapshot.rulers.active).toBe(false);
    expect(snapshot.snapToGrid.active).toBe(false);
    expect(snapshot.objectSnap.active).toBe(true);
    expect(snapshot.guides.active).toBe(true);
    expect(snapshot.snapLines.active).toBe(true);
    // Apagadas pero alcanzables: el host las permite.
    expect(snapshot.grid.visible).toBe(true);
    expect(snapshot.rulers.visible).toBe(true);
  });
});

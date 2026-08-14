/**
 * Capabilities de vista del canvas, resueltas de forma independiente.
 *
 * ## Por qué existe
 *
 * Canvas.tsx resolvía estos estados inline, mezclando ramas que no son la
 * misma cosa. Dos errores concretos vivían ahí:
 *
 * - `data-rulers-visible` se calculaba con `feature.guides && …rulers`: las
 *   reglas estaban **atadas a las guías**, así que apagar las guías apagaba
 *   también las reglas aunque su propia configuración dijera lo contrario.
 * - `data-snaps-enabled` y `data-snaps-visible` eran la MISMA expresión, de
 *   modo que no se podía tener snap activo sin líneas visibles ni al revés.
 *
 * Además, `grid` y `rulers` no llegaban desde la configuración: el
 * `DesignerEngineBuilder` sólo propagaba `selecto`, `moveable`, `snapLines` y
 * `guides`, así que `featureToggles.grid` era siempre `undefined`.
 *
 * ## Contrato
 *
 * Las ocho capabilities son **independientes**. Ninguna se deriva de otra.
 * Cada una resuelve tres dimensiones distintas, que no son sinónimos:
 *
 * - `enabled`: default de PRESENTACIÓN declarado en `canvas.*` — ¿arranca
 *   encendida?
 * - `visible`: POLÍTICA del host (`visibility.canvas.*`), que sólo puede
 *   apagar; si es `false`, la capability no es alternable siquiera;
 * - `active`: estado EFECTIVO ahora mismo — `visible ? (sesión ?? enabled) : false`.
 *
 * Un default apagado no es una prohibición: `enabled: false` con
 * `visible: true` es exactamente «la rejilla arranca oculta pero el usuario
 * puede encenderla».
 */

export const CANVAS_VIEW_CAPABILITIES = [
  'grid',
  'snapToGrid',
  'guides',
  'guideCreation',
  'guideSnap',
  'objectSnap',
  'rulers',
  'snapLines',
] as const;

export type CanvasViewCapability = (typeof CANVAS_VIEW_CAPABILITIES)[number];

export type CanvasViewCapabilityState = {
  enabled: boolean;
  visible: boolean;
  active: boolean;
};

export type CanvasViewCapabilitySnapshot = Record<CanvasViewCapability, CanvasViewCapabilityState>;

/**
 * Rama de `visibility.canvas` que decide presencia.
 *
 * `guideCreation`, `guideSnap`, `snapToGrid` y `objectSnap` son
 * comportamiento, no superficie: no tienen entrada propia en `visibility` y
 * heredan la de la superficie que dibujan, cuando la hay.
 */
const VISIBILITY_KEY: Record<CanvasViewCapability, 'grid' | 'guides' | 'rulers' | 'snapLines' | null> = {
  grid: 'grid',
  snapToGrid: null,
  guides: 'guides',
  guideCreation: null,
  guideSnap: null,
  objectSnap: null,
  rulers: 'rulers',
  snapLines: 'snapLines',
};

export type CanvasViewCapabilityInput = {
  /** `canvas.*`: si la funcionalidad está habilitada. */
  toggles?: Partial<Record<CanvasViewCapability, boolean>>;
  /** `visibility.canvas.*`: si el host permite mostrarla. */
  visibility?: Partial<Record<'grid' | 'guides' | 'rulers' | 'snapLines', boolean>>;
  /** Estado de sesión del usuario. No es política. */
  session?: Partial<Record<CanvasViewCapability, boolean>>;
  /** Un canvas deshabilitado apaga el estado efectivo de todas. */
  canvasEnabled?: boolean;
};

export const resolveCanvasViewCapabilities = ({
  toggles = {},
  visibility = {},
  session = {},
  canvasEnabled = true,
}: CanvasViewCapabilityInput = {}): CanvasViewCapabilitySnapshot =>
  CANVAS_VIEW_CAPABILITIES.reduce((snapshot, capability) => {
    const visibilityKey = VISIBILITY_KEY[capability];
    const visible = visibilityKey ? visibility[visibilityKey] !== false : true;
    const enabled = toggles[capability] === true;
    const sessionValue = session[capability];
    // Precedencia: el host puede apagar pero nunca encender; dentro de lo
    // permitido manda la sesión y, en su defecto, el default de presentación.
    const active =
      canvasEnabled && visible
        ? typeof sessionValue === 'boolean'
          ? sessionValue
          : enabled
        : false;
    snapshot[capability] = { enabled, visible, active };
    return snapshot;
  }, {} as CanvasViewCapabilitySnapshot);

/** Atributos `data-*` que consume la hoja de estilos y los tests de UI. */
export const canvasViewDataAttributes = (
  snapshot: CanvasViewCapabilitySnapshot,
): Record<string, string> => ({
  'data-grid-visible': String(snapshot.grid.active),
  'data-grid-snap-enabled': String(snapshot.snapToGrid.active),
  'data-guides-visible': String(snapshot.guides.active),
  'data-guide-creation-enabled': String(snapshot.guideCreation.active),
  'data-guide-snap-enabled': String(snapshot.guideSnap.active),
  'data-object-snap-enabled': String(snapshot.objectSnap.active),
  'data-rulers-visible': String(snapshot.rulers.active),
  'data-snaps-visible': String(snapshot.snapLines.active),
});

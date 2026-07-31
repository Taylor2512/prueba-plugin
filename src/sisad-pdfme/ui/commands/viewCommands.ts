/**
 * Toggles de vista como comandos configurables.
 *
 * Los ajustes de vista (rejilla, guías, snap, reglas, padding) se leían de dos
 * ramas distintas de la configuración —`canvas.*` decide comportamiento y
 * `visibility.canvas.*` decide presencia— y cada superficie las combinaba a su
 * manera. De ahí que el menú pudiera mostrar «guías activas» mientras el canvas
 * no las pintaba.
 *
 * Aquí hay un único resolutor y un único comando.
 *
 * **Política de undo (documentada):** un cambio de vista **no** entra en el
 * historial. Deshacer debe revertir lo que el usuario hizo *al documento*; si
 * activar la rejilla ocupara una entrada, un Ctrl+Z tras dibujar desharía la
 * rejilla en vez del dibujo. Por eso los comandos se declaran
 * `meta.undoable: false`, que el CommandBus ya respeta desde COREUX-012.
 */
import type { Command } from '@sisad-pdfme/common';

export type ViewFeature = 'grid' | 'guides' | 'snapLines' | 'rulers' | 'padding';

export const VIEW_FEATURES: readonly ViewFeature[] = [
  'grid',
  'guides',
  'snapLines',
  'rulers',
  'padding',
];

export type ViewFeatureState = Record<ViewFeature, boolean>;

/** Fuentes de configuración que influyen en un toggle de vista. */
export type ViewFeatureSources = {
  /** `config.canvas.*`: si la funcionalidad está habilitada. */
  canvas?: Partial<Record<ViewFeature, boolean>>;
  /** `visibility.canvas.*`: si la superficie puede mostrarse. */
  visibility?: Partial<Record<ViewFeature, boolean>>;
  /** Estado local del usuario dentro de la sesión. */
  session?: Partial<Record<ViewFeature, boolean>>;
};

/**
 * Estado efectivo de cada toggle.
 *
 * Precedencia: `visibility` puede **apagar** pero nunca encender —ocultar una
 * superficie es una decisión del host—; dentro de lo visible manda la sesión
 * del usuario y, en su defecto, la configuración de canvas.
 */
export const resolveViewFeatureState = (sources: ViewFeatureSources = {}): ViewFeatureState => {
  const { canvas = {}, visibility = {}, session = {} } = sources;

  return VIEW_FEATURES.reduce((state, feature) => {
    const visible = visibility[feature] !== false;
    if (!visible) {
      state[feature] = false;
      return state;
    }
    const sessionValue = session[feature];
    state[feature] = typeof sessionValue === 'boolean' ? sessionValue : canvas[feature] !== false;
    return state;
  }, {} as ViewFeatureState);
};

/** ¿El host permite alternar esta funcionalidad? */
export const canToggleViewFeature = (
  feature: ViewFeature,
  sources: ViewFeatureSources = {},
): boolean => sources.visibility?.[feature] !== false;

/** Motivo por el que un toggle no puede alternarse. `null` si se puede. */
export const viewFeatureDisabledReason = (
  feature: ViewFeature,
  sources: ViewFeatureSources = {},
): 'hidden-by-config' | null =>
  canToggleViewFeature(feature, sources) ? null : 'hidden-by-config';

export type ViewToggleCommandArgs = {
  feature: ViewFeature;
  /** Estado efectivo actual, resuelto con `resolveViewFeatureState`. */
  current: boolean;
  /** Aplica el nuevo valor a la sesión. No debe reconstruir el engine. */
  apply: (feature: ViewFeature, next: boolean) => void;
  meta?: Record<string, unknown>;
};

/**
 * Comando de alternancia de vista.
 *
 * `undo` existe por contrato del CommandBus y restaura el valor previo, pero el
 * comando no entra en el historial: solo se ejecuta si alguien lo invoca
 * explícitamente.
 */
export const createViewToggleCommand = ({
  feature,
  current,
  apply,
  meta = {},
}: ViewToggleCommandArgs): Command =>
  ({
    id: `view.toggle.${feature}`,
    label: `Vista: ${feature}`,
    meta: { commandId: `view.toggle.${feature}`, source: 'canvas-toolbar', undoable: false, ...meta },
    execute: () => apply(feature, !current),
    undo: () => apply(feature, current),
    redo: () => apply(feature, !current),
  }) as Command;

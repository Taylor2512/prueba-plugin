/**
 * designerActionState — contrato único de estado para acciones del diseñador.
 *
 * Rol arquitectónico:
 * - `resolveDesignerActionState(actionId, context)` es la única puerta para
 *   decidir si un botón/menú se renderiza, se deshabilita y con qué razón.
 *   Compone el ActionRegistry (reglas por acción) con el contexto de la
 *   superficie (handler disponible, visibility config, permisos).
 * - Regla dura: un botón visible sin handler NO puede renderizarse
 *   (`hasHandler === false` → `visible: false`, razón `missing-handler`).
 * - Un botón deshabilitado siempre lleva `reason` para tooltip/menu.
 *
 * Los ids kebab-case de chrome (save, undo, reassignrecipient, …) son
 * canónicos para superficies; los  camelCase del registry se resuelven
 * vía alias para no duplicar definiciones.
 */
import {
  resolveActionDefinition,
  registerActions,
  type ActionContext,
  type SchemaActionDefinition,
} from './actionRegistry.js';

export type DesignerActionId = string;

/** Descriptor público de una acción de chrome/schema. */
export type DesignerActionDescriptor = Pick<
  SchemaActionDefinition,
  'id' | 'label' | 'section' | 'priority' | 'presentationMode'
>;

/**
 * Contexto de resolución. Extiende el contexto del registry con señales de la
 * superficie concreta (handler, overrides de config, razón de deshabilitado).
 */
export type DesignerActionContext = Partial<ActionContext> & {
  /** `false` cuando la superficie no tiene callback real para la acción. */
  hasHandler?: boolean;
  /** `false` cuando `visibility.actions[...]`/config apaga la acción. */
  visibleByConfig?: boolean;
  /** `false` cuando la config deshabilita la acción (p. ej. assignment.enabled). */
  enabledByConfig?: boolean;
  /** Razón explícita de deshabilitado para tooltip (gana sobre las derivadas). */
  disabledReason?: string | null;
};

export type DesignerActionState = {
  id: DesignerActionId;
  label: string;
  visible: boolean;
  enabled: boolean;
  /** null cuando la acción está habilitada. */
  reason:
    | 'missing-handler'
    | 'hidden-by-config'
    | 'hidden-by-rule'
    | 'disabled-by-config'
    | 'disabled-by-rule'
    | (string & {})
    | null;
};

const DEFAULT_CONTEXT: ActionContext = {
  activeSchemas: [],
  selectionCount: 0,
  canEditStructure: true,
};

/** Acciones de chrome del diseñador que no existían en el registry base. */
const CHROME_ACTIONS: SchemaActionDefinition[] = [
  { id: 'save', label: 'Guardar', section: 'document', priority: 'primary', presentationMode: 'inline' },
  { id: 'more', label: 'Más acciones', section: 'document', priority: 'secondary', presentationMode: 'inline' },
  { id: 'undo', label: 'Deshacer', section: 'history', priority: 'secondary', presentationMode: 'inline' },
  { id: 'redo', label: 'Rehacer', section: 'history', priority: 'secondary', presentationMode: 'inline' },
  { id: 'set-zoom', label: 'Zoom', section: 'view', priority: 'secondary', presentationMode: 'inline' },
  { id: 'toggle-left-sidebar', label: 'Alternar catálogo', section: 'view', priority: 'secondary', presentationMode: 'inline' },
  { id: 'toggle-right-sidebar', label: 'Alternar panel derecho', section: 'view', priority: 'secondary', presentationMode: 'inline' },
  { id: 'switch-right-panel-fields', label: 'Abrir panel Campos', section: 'view', priority: 'secondary', presentationMode: 'inline' },
  { id: 'switch-right-panel-detail', label: 'Abrir panel Detalle', section: 'view', priority: 'secondary', presentationMode: 'inline' },
  { id: 'switch-right-panel-comments', label: 'Abrir panel Comentarios', section: 'view', priority: 'secondary', presentationMode: 'inline' },
  { id: 'switch-right-panel-documents', label: 'Abrir panel Docs', section: 'view', priority: 'secondary', presentationMode: 'inline' },
  { id: 'select-schema', label: 'Seleccionar campo', section: 'selection', priority: 'secondary', presentationMode: 'hidden' },
  {
    id: 'reassignrecipient',
    label: 'Reasignar responsable',
    section: 'collaboration',
    priority: 'secondary',
    presentationMode: 'inline',
    isVisible: (ctx) => ctx.selectionCount > 0,
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  {
    id: 'unlock-position',
    label: 'Desbloquear posición',
    section: 'state',
    priority: 'secondary',
    presentationMode: 'contextMenu',
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  {
    id: 'release-edit',
    label: 'Liberar edición',
    section: 'collaboration',
    priority: 'secondary',
    presentationMode: 'contextMenu',
  },
];

registerActions(CHROME_ACTIONS);

/** Devuelve el descriptor registrado (resolviendo alias) o null. */
export const getDesignerActionDescriptor = (
  actionId: DesignerActionId,
): DesignerActionDescriptor | null => {
  const definition = resolveActionDefinition(actionId);
  if (!definition) return null;
  const { id, label, section, priority, presentationMode } = definition;
  return { id, label, section, priority, presentationMode };
};

/**
 * Resuelve el estado efectivo de una acción para una superficie concreta.
 * Orden de evaluación: handler → config visible → regla visible → config
 * enabled → regla enabled.
 */
export const resolveDesignerActionState = (
  actionId: DesignerActionId,
  context: DesignerActionContext = {},
): DesignerActionState => {
  const definition = resolveActionDefinition(actionId);
  const label = definition?.label ?? actionId;
  const registryContext: ActionContext = {
    ...DEFAULT_CONTEXT,
    ...context,
    activeSchemas: context.activeSchemas ?? [],
    selectionCount: context.selectionCount ?? 0,
    canEditStructure: context.canEditStructure ?? true,
  };

  const hidden = (reason: DesignerActionState['reason']): DesignerActionState => ({
    id: actionId,
    label,
    visible: false,
    enabled: false,
    reason,
  });

  if (context.hasHandler === false) return hidden('missing-handler');
  if (context.visibleByConfig === false) return hidden('hidden-by-config');
  if (definition?.isVisible && !definition.isVisible(registryContext)) {
    return hidden('hidden-by-rule');
  }

  if (context.enabledByConfig === false) {
    return {
      id: actionId,
      label,
      visible: true,
      enabled: false,
      reason: context.disabledReason ?? 'disabled-by-config',
    };
  }
  if (definition?.isEnabled && !definition.isEnabled(registryContext)) {
    return {
      id: actionId,
      label,
      visible: true,
      enabled: false,
      reason: context.disabledReason ?? 'disabled-by-rule',
    };
  }

  return { id: actionId, label, visible: true, enabled: true, reason: null };
};

/** Razones → texto de tooltip legible para superficies. */
export const describeDisabledReason = (reason: DesignerActionState['reason']): string => {
  switch (reason) {
    case 'missing-handler':
      return 'Acción no disponible';
    case 'hidden-by-config':
    case 'disabled-by-config':
      return 'Deshabilitado por configuración';
    case 'disabled-by-rule':
      return 'No disponible para la selección actual';
    default:
      return reason ? String(reason) : '';
  }
};

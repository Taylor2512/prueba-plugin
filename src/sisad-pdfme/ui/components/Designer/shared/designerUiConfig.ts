/**
 * designerUiConfig — mapa consolidado visibilidad + acción + permisos.
 *
 * Rol arquitectónico (TASK-RUNTIME-015):
 * - Un componente pregunta al mapa (`map.resolveAction('reassignrecipient')`),
 *   no recalcula reglas leyendo `options.visibility`/`options.assignment` por
 *   su cuenta.
 * - El mapa compone `visibilityConfig` (config declarativa) con
 *   `resolveDesignerActionState` (reglas por acción del ActionRegistry), de
 *   modo que ambos mundos comparten una sola puerta.
 * - Config  intacta: este módulo solo LEE las mismas options que ya
 *   viajan por OptionsContext.
 */
import type { ResolvedSisadPdfmeConfig, SisadPdfmeVisibilityConfig } from '../../../../config/SisadPdfmeConfig.js';
import { asRecord } from '../../../../shared/objectGuards.js';
import { resolveVisibilityConfig, resolveReassignVisibilityState } from './visibilityConfig.js';
import {
  resolveDesignerActionState,
  type DesignerActionContext,
  type DesignerActionState,
} from './designerActionState.js';

export type ResolvedDesignerUiMap = {
  visibility: SisadPdfmeVisibilityConfig | undefined;
  permissions: {
    canEditStructure: boolean;
  };
  features: {
    assignmentEnabled: boolean;
    reassignVisible: boolean;
    assignmentModalVisible: boolean;
    commentsPanelVisible: boolean;
    documentsPanelVisible: boolean;
    fieldsPanelVisible: boolean;
    detailPanelVisible: boolean;
  };
  /** Overrides de config por acción (visibleByConfig/enabledByConfig). */
  actions: Record<string, { visibleByConfig: boolean; enabledByConfig: boolean }>;
  /** Resuelve el estado final de una acción combinando config + registry. */
  resolveAction(actionId: string, context?: DesignerActionContext): DesignerActionState;
};

type ResolvedDesignerUiSource = Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>;

/** Mapea ids de acción → flags de `visibility.actions`/paneles. */
const actionVisibilityKey: Record<string, (visibility?: SisadPdfmeVisibilityConfig) => boolean> = {
  'reassignrecipient': (v) => v?.actions?.reassign !== false,
  'duplicate-schema': (v) => v?.actions?.duplicate !== false,
  duplicate: (v) => v?.actions?.duplicate !== false,
  'delete-schema': (v) => v?.actions?.delete !== false,
  delete: (v) => v?.actions?.delete !== false,
  'hide-schema': (v) => v?.actions?.hide !== false,
  'lock-position': (v) => v?.actions?.lock !== false,
  'unlock-position': (v) => v?.actions?.unlock !== false,
  copy: (v) => v?.actions?.copy !== false,
  paste: (v) => v?.actions?.paste !== false,
  'switch-right-panel-fields': (v) => v?.sidebars?.right?.panels?.fields !== false,
  'switch-right-panel-detail': (v) => v?.sidebars?.right?.panels?.detail !== false,
  'switch-right-panel-comments': (v) => v?.sidebars?.right?.panels?.comments !== false,
  'switch-right-panel-documents': (v) => v?.sidebars?.right?.panels?.documents !== false,
  'add-comment': (v) => v?.modals?.comments !== false,
};

export const buildDesignerUiMapFromResolvedConfig = (source: ResolvedDesignerUiSource): ResolvedDesignerUiMap => {
  const visibility = source.visibility;
  const canEditStructure = source.config.collaboration?.canEditStructure !== false;
  const assignmentEnabled = source.config.assignment?.enabled === true;
  const reassignVisible = visibility.actions?.reassign !== false && assignmentEnabled;
  const assignmentModalVisible = visibility.modals?.assignment !== false;

  const actions: ResolvedDesignerUiMap['actions'] = {};
  Object.entries(actionVisibilityKey).forEach(([actionId, isVisible]) => {
    actions[actionId] = {
      visibleByConfig:
        actionId === 'reassignrecipient'
          ? reassignVisible && assignmentModalVisible
          : isVisible(visibility),
      enabledByConfig: true,
    };
  });

  return {
    visibility,
    permissions: { canEditStructure },
    features: {
      assignmentEnabled,
      reassignVisible,
      assignmentModalVisible,
      commentsPanelVisible: visibility?.sidebars?.right?.panels?.comments !== false,
      documentsPanelVisible: visibility?.sidebars?.right?.panels?.documents !== false,
      fieldsPanelVisible: visibility?.sidebars?.right?.panels?.fields !== false,
      detailPanelVisible: visibility?.sidebars?.right?.panels?.detail !== false,
    },
    actions,
    resolveAction(actionId, context = {}) {
      const overrides = actions[actionId];
      return resolveDesignerActionState(actionId, {
        canEditStructure,
        ...context,
        ...(overrides
          ? {
              visibleByConfig: context.visibleByConfig ?? overrides.visibleByConfig,
              enabledByConfig: context.enabledByConfig ?? overrides.enabledByConfig,
            }
          : {}),
      });
    },
  };
};

export const buildDesignerUiMap = (options: unknown): ResolvedDesignerUiMap => {
  const visibility = resolveVisibilityConfig(options);
  const reassign = resolveReassignVisibilityState(options);
  const optionsRecord = asRecord(options);
  const collaboration = asRecord(optionsRecord?.collaboration);
  const canEditStructure = collaboration?.canEditStructure !== false;

  const actions: ResolvedDesignerUiMap['actions'] = {};
  Object.entries(actionVisibilityKey).forEach(([actionId, isVisible]) => {
    actions[actionId] = {
      // Reassign replica el comportamiento del toolbar: assignment.enabled=false
      // OCULTA la acción (no la deja visible-deshabilitada).
      visibleByConfig:
        actionId === 'reassignrecipient'
          ? reassign.reassignVisible && reassign.assignmentModalVisible
          : isVisible(visibility),
      enabledByConfig: true,
    };
  });

  return {
    visibility,
    permissions: { canEditStructure },
    features: {
      assignmentEnabled: reassign.assignmentEnabled,
      reassignVisible: reassign.reassignVisible,
      assignmentModalVisible: reassign.assignmentModalVisible,
      commentsPanelVisible: visibility?.sidebars?.right?.panels?.comments !== false,
      documentsPanelVisible: visibility?.sidebars?.right?.panels?.documents !== false,
      fieldsPanelVisible: visibility?.sidebars?.right?.panels?.fields !== false,
      detailPanelVisible: visibility?.sidebars?.right?.panels?.detail !== false,
    },
    actions,
    resolveAction(actionId, context = {}) {
      const overrides = actions[actionId];
      return resolveDesignerActionState(actionId, {
        canEditStructure,
        ...context,
        ...(overrides
          ? {
              visibleByConfig: context.visibleByConfig ?? overrides.visibleByConfig,
              enabledByConfig: context.enabledByConfig ?? overrides.enabledByConfig,
            }
          : {}),
      });
    },
  };
};

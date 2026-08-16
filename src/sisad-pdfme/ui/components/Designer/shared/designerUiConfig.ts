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
import type { ResolvedSisadPdfmeConfig, SisadPdfmeVisibilityConfig } from '@sisad-pdfme/config/SisadPdfmeConfig';
import { asRecord } from '@sisad-pdfme/shared/objectGuards';
import { resolveVisibilityConfig, resolveReassignVisibilityState } from '@sisad-pdfme/ui/components/Designer/shared/visibilityConfig';
import { configFromRuntimeOptions } from '@sisad-pdfme/config/configFromRuntimeOptions';
import { resolveSisadPdfmeConfig } from '@sisad-pdfme/config/resolveSisadPdfmeConfig';
import { resolveCapabilityState } from '@sisad-pdfme/config/capabilityGraph';
import { capabilitiesOfKind } from '@sisad-pdfme/config/capabilityInventory';
import {
  resolveDesignerActionState,
  type DesignerActionContext,
  type DesignerActionState,
} from '@sisad-pdfme/ui/components/Designer/shared/designerActionState';

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

/**
 * Alias camelCase del chrome → id canónico del registry de configuración.
 *
 * El Designer usa `duplicate`/`delete` en algunas superficies; la
 * configuración sólo conoce `duplicate-schema`/`delete-schema`. El alias evita
 * que existan dos definiciones de la misma acción.
 */
const CONFIG_ACTION_ALIAS: Record<string, string> = {
  duplicate: 'duplicate-schema',
  delete: 'delete-schema',
  lock: 'lock-position',
  unlock: 'unlock-position',
  hide: 'hide-schema',
  show: 'show-schema',
};

/**
 * Overrides de configuración por acción, derivados del CapabilityGraph.
 *
 * Antes existía aquí una tabla `actionVisibilityKey` que volvía a mapear cada
 * acción a su rama de `visibility.*`. Era una reescritura de los `sources` que
 * `actionConfigRegistry` ya declara, así que botón y controller podían
 * discrepar en cuanto una de las dos tablas se quedaba atrás: `align`,
 * `distribute`, `match-size` y `show-schema` existían en la configuración pero
 * NO en la tabla del Designer, y `readonly` no llegaba a ninguna acción del
 * chrome (RTP-460).
 *
 * Ahora hay una sola autoridad: la configuración resuelve la política y el
 * registry del Designer resuelve las reglas de superficie (handler presente,
 * reglas de selección).
 */
const deriveActionOverrides = (
  source: ResolvedDesignerUiSource,
  context: { readOnly: boolean; assignmentModalVisible: boolean },
): ResolvedDesignerUiMap['actions'] => {
  const actions: ResolvedDesignerUiMap['actions'] = {};

  const put = (designerId: string, configId: string) => {
    const capability = resolveCapabilityState(source, `action:${configId}`, {
      readOnly: context.readOnly,
      // La disponibilidad por selección/portapapeles la decide la superficie
      // en `resolveDesignerActionState`; aquí sólo se resuelve la POLÍTICA.
      selectionCount: 1,
      recipientCount: 1,
      hasClipboard: true,
    });
    actions[designerId] = {
      visibleByConfig:
        configId === 'reassignrecipient'
          ? capability.visible && context.assignmentModalVisible
          : capability.visible,
      enabledByConfig: capability.permitted && capability.enabled,
    };
  };

  capabilitiesOfKind('action').forEach((descriptor) => put(descriptor.id, descriptor.id));
  Object.entries(CONFIG_ACTION_ALIAS).forEach(([designerId, configId]) => put(designerId, configId));

  return actions;
};

const buildMap = (
  source: ResolvedDesignerUiSource,
  overrides: {
    canEditStructure: boolean;
    assignmentEnabled: boolean;
    reassignVisible: boolean;
    assignmentModalVisible: boolean;
    visibility: SisadPdfmeVisibilityConfig | undefined;
  },
): ResolvedDesignerUiMap => {
  const { visibility } = overrides;
  const actions = deriveActionOverrides(source, {
    readOnly: source.config.runtime?.readonly === true,
    assignmentModalVisible: overrides.assignmentModalVisible,
  });

  return {
    visibility,
    permissions: { canEditStructure: overrides.canEditStructure },
    features: {
      assignmentEnabled: overrides.assignmentEnabled,
      reassignVisible: overrides.reassignVisible,
      assignmentModalVisible: overrides.assignmentModalVisible,
      commentsPanelVisible: visibility?.sidebars?.right?.panels?.comments !== false,
      documentsPanelVisible: visibility?.sidebars?.right?.panels?.documents !== false,
      fieldsPanelVisible: visibility?.sidebars?.right?.panels?.fields !== false,
      detailPanelVisible: visibility?.sidebars?.right?.panels?.detail !== false,
    },
    actions,
    resolveAction(actionId, context = {}) {
      const actionOverrides = actions[actionId];
      return resolveDesignerActionState(actionId, {
        canEditStructure: overrides.canEditStructure,
        ...context,
        ...(actionOverrides
          ? {
              visibleByConfig: context.visibleByConfig ?? actionOverrides.visibleByConfig,
              enabledByConfig: context.enabledByConfig ?? actionOverrides.enabledByConfig,
            }
          : {}),
      });
    },
  };
};

export const buildDesignerUiMapFromResolvedConfig = (source: ResolvedDesignerUiSource): ResolvedDesignerUiMap => {
  const visibility = source.visibility;
  const assignmentEnabled = source.config.assignment?.enabled === true;
  return buildMap(source, {
    canEditStructure: source.config.collaboration?.canEditStructure !== false,
    assignmentEnabled,
    // `assignment.enabled=false` OCULTA la acción; no la deja visible-deshabilitada.
    reassignVisible: visibility.actions?.reassign !== false && assignmentEnabled,
    assignmentModalVisible: visibility.modals?.assignment !== false,
    visibility,
  });
};

export const buildDesignerUiMap = (options: unknown): ResolvedDesignerUiMap => {
  const visibility = resolveVisibilityConfig(options);
  const reassign = resolveReassignVisibilityState(options);
  const optionsRecord = asRecord(options);
  const collaboration = asRecord(optionsRecord?.collaboration);

  // Las opciones sueltas se resuelven a una
  // configuración completa para que ambos caminos deriven del MISMO grafo.
  const source = resolveSisadPdfmeConfig(configFromRuntimeOptions(options));

  return buildMap(source, {
    canEditStructure: collaboration?.canEditStructure !== false,
    assignmentEnabled: reassign.assignmentEnabled,
    reassignVisible: reassign.reassignVisible,
    assignmentModalVisible: reassign.assignmentModalVisible,
    visibility,
  });
};

import type { ResolvedSisadPdfmeConfig } from './SisadPdfmeConfig.js';
import type { SisadPdfmeFeatureState } from './featureRegistry.js';

export type ActionId =
  | 'reassign-recipient'
  | 'duplicate-schema'
  | 'delete-schema'
  | 'copy'
  | 'paste'
  | 'lock-position'
  | 'unlock-position'
  | 'hide-schema'
  | 'show-schema'
  | 'align'
  | 'distribute'
  | 'match-size'
  | 'switch-right-panel-fields'
  | 'switch-right-panel-detail'
  | 'switch-right-panel-comments'
  | 'switch-right-panel-documents'
  | 'add-comment';

export type ActionContext = {
  readOnly?: boolean;
  canEditStructure?: boolean;
  selectionCount?: number;
  recipientCount?: number;
  hasClipboard?: boolean;
};

export type SisadPdfmeActionState = SisadPdfmeFeatureState & {
  commandId?: string;
};

export type ActionDefinition = {
  id: ActionId;
  commandId: string;
  sources: string[];
  resolve: (
    config: Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>,
    context?: ActionContext,
  ) => SisadPdfmeActionState;
};

const createActionState = (
  id: ActionId,
  commandId: string,
  sources: string[],
  partial: Partial<SisadPdfmeActionState>,
): SisadPdfmeActionState => ({
  id,
  commandId,
  registered: true,
  supported: true,
  enabled: true,
  visible: true,
  permitted: true,
  available: true,
  active: false,
  executable: true,
  sources,
  ...partial,
});

const resolveSelectionAction = (
  id: ActionId,
  commandId: string,
  config: Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>,
  context: ActionContext | undefined,
  visibilityKey: keyof NonNullable<ResolvedSisadPdfmeConfig['visibility']['actions']>,
  reason: string,
) => {
  const readOnly = context?.readOnly === true || config.config.runtime.readonly === true;
  const selectionCount = context?.selectionCount ?? 0;
  const visible = config.visibility.actions?.[visibilityKey] !== false;
  const available = selectionCount > 0;
  return createActionState(id, commandId, [`visibility.actions.${String(visibilityKey)}`], {
    supported: visible,
    enabled: visible && !readOnly,
    visible,
    permitted: !readOnly,
    available,
    active: false,
    executable: visible && !readOnly && available,
    reason: visible ? (available ? undefined : reason) : 'hidden-by-config',
  });
};

export const actionConfigRegistry: Record<ActionId, ActionDefinition> = {
  'reassign-recipient': {
    id: 'reassign-recipient',
    commandId: 'reassignSchemaOwner',
    sources: ['assignment.enabled', 'visibility.actions.reassign'],
    resolve: (config, context) => {
      const enabled = config.config.assignment.enabled !== false;
      const visible = enabled && config.visibility.actions?.reassign !== false;
      const canEditStructure = context?.canEditStructure !== false && config.config.collaboration.canEditStructure !== false;
      const selectionCount = context?.selectionCount ?? 0;
      const recipientCount = context?.recipientCount ?? 0;
      const available = selectionCount > 0 && recipientCount > 0;
      return createActionState('reassign-recipient', 'reassignSchemaOwner', ['assignment.enabled', 'visibility.actions.reassign'], {
        supported: enabled,
        enabled: enabled && canEditStructure && available,
        visible,
        permitted: canEditStructure,
        available,
        active: visible,
        executable: enabled && visible && canEditStructure && available,
        reason: !enabled
          ? 'assignment-disabled'
          : !visible
            ? 'hidden-by-config'
            : !canEditStructure
              ? 'permission-denied'
              : !available
                ? 'assignment-unavailable'
                : undefined,
      });
    },
  },
  'duplicate-schema': {
    id: 'duplicate-schema',
    commandId: 'duplicateSchemas',
    sources: ['visibility.actions.duplicate'],
    resolve: (config, context) => resolveSelectionAction('duplicate-schema', 'duplicateSchemas', config, context, 'duplicate', 'no-selection'),
  },
  'delete-schema': {
    id: 'delete-schema',
    commandId: 'removeSchemas',
    sources: ['visibility.actions.delete'],
    resolve: (config, context) => resolveSelectionAction('delete-schema', 'removeSchemas', config, context, 'delete', 'no-selection'),
  },
  copy: {
    id: 'copy',
    commandId: 'copySchemas',
    sources: ['visibility.actions.copy'],
    resolve: (config, context) => resolveSelectionAction('copy', 'copySchemas', config, context, 'copy', 'no-selection'),
  },
  paste: {
    id: 'paste',
    commandId: 'pasteSchemas',
    sources: ['visibility.actions.paste'],
    resolve: (config, context) => {
      const readOnly = context?.readOnly === true || config.config.runtime.readonly === true;
      const visible = config.visibility.actions?.paste !== false;
      const available = context?.hasClipboard !== false;
      return createState('paste', 'pasteSchemas', ['visibility.actions.paste'], {
        supported: visible,
        enabled: visible && !readOnly && available,
        visible,
        permitted: !readOnly,
        available,
        active: false,
        executable: visible && !readOnly && available,
        reason: !visible ? 'hidden-by-config' : readOnly ? 'readonly' : !available ? 'clipboard-empty' : undefined,
      });
    },
  },
  'lock-position': {
    id: 'lock-position',
    commandId: 'lockSchemas',
    sources: ['visibility.actions.lock'],
    resolve: (config, context) => resolveSelectionAction('lock-position', 'lockSchemas', config, context, 'lock', 'no-selection'),
  },
  'unlock-position': {
    id: 'unlock-position',
    commandId: 'unlockSchemas',
    sources: ['visibility.actions.unlock'],
    resolve: (config, context) => resolveSelectionAction('unlock-position', 'unlockSchemas', config, context, 'unlock', 'no-selection'),
  },
  'hide-schema': {
    id: 'hide-schema',
    commandId: 'hideSchemas',
    sources: ['visibility.actions.hide'],
    resolve: (config, context) => resolveSelectionAction('hide-schema', 'hideSchemas', config, context, 'hide', 'no-selection'),
  },
  'show-schema': {
    id: 'show-schema',
    commandId: 'showSchemas',
    sources: ['visibility.actions.show'],
    resolve: (config, context) => resolveSelectionAction('show-schema', 'showSchemas', config, context, 'show', 'no-selection'),
  },
  align: {
    id: 'align',
    commandId: 'alignSchemas',
    sources: ['visibility.actions.align'],
    resolve: (config, context) => resolveSelectionAction('align', 'alignSchemas', config, context, 'align', 'no-selection'),
  },
  distribute: {
    id: 'distribute',
    commandId: 'distributeSchemas',
    sources: ['visibility.actions.distribute'],
    resolve: (config, context) => resolveSelectionAction('distribute', 'distributeSchemas', config, context, 'distribute', 'no-selection'),
  },
  'match-size': {
    id: 'match-size',
    commandId: 'matchSizeSchemas',
    sources: ['visibility.actions.matchSize'],
    resolve: (config, context) => resolveSelectionAction('match-size', 'matchSizeSchemas', config, context, 'matchSize', 'no-selection'),
  },
  'switch-right-panel-fields': {
    id: 'switch-right-panel-fields',
    commandId: 'showFieldsPanel',
    sources: ['visibility.sidebars.right.panels.fields'],
    resolve: (config) =>
      createActionState('switch-right-panel-fields', 'showFieldsPanel', ['visibility.sidebars.right.panels.fields'], {
        visible: config.visibility.sidebars?.right?.panels?.fields !== false,
        enabled: config.visibility.sidebars?.right?.panels?.fields !== false,
        available: config.visibility.sidebars?.right?.panels?.fields !== false,
        executable: config.visibility.sidebars?.right?.panels?.fields !== false,
      }),
  },
  'switch-right-panel-detail': {
    id: 'switch-right-panel-detail',
    commandId: 'showDetailPanel',
    sources: ['visibility.sidebars.right.panels.detail'],
    resolve: (config) =>
      createActionState('switch-right-panel-detail', 'showDetailPanel', ['visibility.sidebars.right.panels.detail'], {
        visible: config.visibility.sidebars?.right?.panels?.detail !== false,
        enabled: config.visibility.sidebars?.right?.panels?.detail !== false,
        available: config.visibility.sidebars?.right?.panels?.detail !== false,
        executable: config.visibility.sidebars?.right?.panels?.detail !== false,
      }),
  },
  'switch-right-panel-comments': {
    id: 'switch-right-panel-comments',
    commandId: 'showCommentsPanel',
    sources: ['visibility.sidebars.right.panels.comments'],
    resolve: (config) =>
      createActionState('switch-right-panel-comments', 'showCommentsPanel', ['visibility.sidebars.right.panels.comments'], {
        visible: config.visibility.sidebars?.right?.panels?.comments !== false,
        enabled: config.visibility.sidebars?.right?.panels?.comments !== false,
        available: config.visibility.sidebars?.right?.panels?.comments !== false,
        executable: config.visibility.sidebars?.right?.panels?.comments !== false,
      }),
  },
  'switch-right-panel-documents': {
    id: 'switch-right-panel-documents',
    commandId: 'showDocumentsPanel',
    sources: ['visibility.sidebars.right.panels.documents'],
    resolve: (config) =>
      createActionState('switch-right-panel-documents', 'showDocumentsPanel', ['visibility.sidebars.right.panels.documents'], {
        visible: config.visibility.sidebars?.right?.panels?.documents !== false,
        enabled: config.visibility.sidebars?.right?.panels?.documents !== false,
        available: config.visibility.sidebars?.right?.panels?.documents !== false,
        executable: config.visibility.sidebars?.right?.panels?.documents !== false,
      }),
  },
  'add-comment': {
    id: 'add-comment',
    commandId: 'createComment',
    sources: ['visibility.modals.comments'],
    resolve: (config, context) => {
      const readOnly = context?.readOnly === true || config.config.runtime.readonly === true;
      const visible = config.visibility.modals?.comments !== false;
      return createActionState('add-comment', 'createComment', ['visibility.modals.comments'], {
        supported: visible,
        enabled: visible && !readOnly,
        visible,
        permitted: !readOnly,
        available: true,
        active: false,
        executable: visible && !readOnly,
        reason: !visible ? 'hidden-by-config' : readOnly ? 'readonly' : undefined,
      });
    },
  },
};

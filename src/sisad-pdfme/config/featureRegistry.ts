import type { ResolvedSisadPdfmeConfig } from './SisadPdfmeConfig.js';

export type FeatureId =
  | 'runtime'
  | 'canvas'
  | 'sidebars'
  | 'inspector'
  | 'documents'
  | 'comments'
  | 'signatures'
  | 'assignment'
  | 'collaboration'
  | 'persistence';

export type FeatureContext = {
  readOnly?: boolean;
  canEditStructure?: boolean;
  selectionCount?: number;
  recipientCount?: number;
};

export type SisadPdfmeFeatureState = {
  id: string;
  registered: boolean;
  supported: boolean;
  enabled: boolean;
  visible: boolean;
  permitted: boolean;
  available: boolean;
  active: boolean;
  executable: boolean;
  reason?: string;
  sources?: string[];
};

export type FeatureDefinition = {
  id: FeatureId;
  sources: string[];
  resolve: (
    config: Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>,
    context?: FeatureContext,
  ) => SisadPdfmeFeatureState;
};

const createFeatureState = (
  id: FeatureId,
  sources: string[],
  partial: Partial<SisadPdfmeFeatureState>,
): SisadPdfmeFeatureState => ({
  id,
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

export const featureRegistry: Record<FeatureId, FeatureDefinition> = {
  runtime: {
    id: 'runtime',
    sources: ['runtime.mode', 'runtime.readonly'],
    resolve: (config) => {
      const readOnly = config.config.runtime.readonly === true;
      return createFeatureState('runtime', ['runtime.mode', 'runtime.readonly'], {
        active: !readOnly,
        permitted: true,
        available: true,
        executable: !readOnly,
        reason: readOnly ? 'runtime-readonly' : undefined,
      });
    },
  },
  canvas: {
    id: 'canvas',
    sources: ['canvas.enabled', 'visibility.canvas'],
    resolve: (config, context) => {
      const enabled = config.config.canvas.enabled !== false;
      const visible = config.visibility.canvas?.toolbar !== false || config.visibility.canvas?.contextMenu !== false;
      const readOnly = context?.readOnly === true || config.config.runtime.readonly === true;
      return createFeatureState('canvas', ['canvas.enabled', 'visibility.canvas'], {
        supported: enabled,
        enabled,
        visible,
        permitted: !readOnly,
        available: enabled,
        active: visible && enabled,
        executable: enabled && !readOnly,
        reason: !enabled ? 'canvas-disabled' : readOnly ? 'canvas-readonly' : undefined,
      });
    },
  },
  sidebars: {
    id: 'sidebars',
    sources: ['sidebars.left', 'sidebars.right', 'visibility.sidebars'],
    resolve: (config) => {
      const leftEnabled = config.config.sidebars?.left?.enabled !== false;
      const rightEnabled = config.config.sidebars?.right?.enabled !== false;
      const visible =
        config.visibility.sidebars?.left?.visible !== false ||
        config.visibility.sidebars?.right?.visible !== false;
      const enabled = leftEnabled || rightEnabled;
      return createFeatureState('sidebars', ['sidebars.left', 'sidebars.right', 'visibility.sidebars'], {
        supported: true,
        enabled,
        visible,
        permitted: true,
        available: enabled,
        active: visible,
        executable: enabled,
        reason: enabled ? undefined : 'sidebars-disabled',
      });
    },
  },
  inspector: {
    id: 'inspector',
    sources: ['visibility.inspector'],
    resolve: (config) => {
      const visible = config.visibility.inspector?.visible !== false;
      return createFeatureState('inspector', ['visibility.inspector'], {
        enabled: visible,
        visible,
        available: true,
        active: visible,
        executable: visible,
        reason: visible ? undefined : 'inspector-hidden',
      });
    },
  },
  documents: {
    id: 'documents',
    sources: ['documents.mode', 'visibility.sidebars.right.panels.documents'],
    resolve: (config) => {
      const visible = config.visibility.sidebars?.right?.panels?.documents !== false;
      const enabled = config.config.documents.mode !== undefined;
      return createFeatureState('documents', ['documents.mode', 'visibility.sidebars.right.panels.documents'], {
        supported: true,
        enabled,
        visible,
        permitted: true,
        available: true,
        active: visible,
        executable: enabled && visible,
        reason: visible ? undefined : 'documents-hidden',
      });
    },
  },
  comments: {
    id: 'comments',
    sources: ['visibility.modals.comments', 'visibility.sidebars.right.panels.comments'],
    resolve: (config) => {
      const visible =
        config.visibility.modals?.comments !== false ||
        config.visibility.sidebars?.right?.panels?.comments !== false;
      return createFeatureState('comments', ['visibility.modals.comments', 'visibility.sidebars.right.panels.comments'], {
        enabled: visible,
        visible,
        permitted: true,
        available: true,
        active: visible,
        executable: visible,
        reason: visible ? undefined : 'comments-hidden',
      });
    },
  },
  signatures: {
    id: 'signatures',
    sources: ['signatures.enabled'],
    resolve: (config, context) => {
      const enabled = config.config.signatures.enabled !== false;
      const readOnly = context?.readOnly === true || config.config.runtime.readonly === true;
      return createFeatureState('signatures', ['signatures.enabled'], {
        supported: enabled,
        enabled,
        visible: enabled,
        permitted: !readOnly,
        available: enabled,
        active: enabled && !readOnly,
        executable: enabled && !readOnly,
        reason: !enabled ? 'signatures-disabled' : readOnly ? 'signatures-readonly' : undefined,
      });
    },
  },
  assignment: {
    id: 'assignment',
    sources: ['assignment.enabled', 'visibility.actions.reassign', 'collaboration.canEditStructure'],
    resolve: (config, context) => {
      const enabled = config.config.assignment.enabled !== false;
      const visible = enabled && config.visibility.actions?.reassign !== false;
      const canEditStructure = context?.canEditStructure !== false && config.config.collaboration.canEditStructure !== false;
      const selectionCount = context?.selectionCount ?? 0;
      const recipientCount = context?.recipientCount ?? 0;
      const available = selectionCount > 0 && recipientCount > 0;
      return createFeatureState('assignment', ['assignment.enabled', 'visibility.actions.reassign', 'collaboration.canEditStructure'], {
        supported: enabled,
        enabled,
        visible,
        permitted: canEditStructure,
        available,
        active: visible,
        executable: enabled && visible && canEditStructure && available,
        reason: !enabled
          ? 'assignment-disabled'
          : !canEditStructure
            ? 'assignment-permission-denied'
            : !available
              ? 'assignment-unavailable'
              : undefined,
      });
    },
  },
  collaboration: {
    id: 'collaboration',
    sources: ['collaboration.enabled'],
    resolve: (config) => {
      const enabled = config.config.collaboration.enabled !== false;
      return createFeatureState('collaboration', ['collaboration.enabled'], {
        supported: true,
        enabled,
        visible: enabled,
        permitted: true,
        available: enabled,
        active: enabled,
        executable: enabled,
        reason: enabled ? undefined : 'collaboration-disabled',
      });
    },
  },
  persistence: {
    id: 'persistence',
    sources: ['persistence.mode', 'persistence.autosave'],
    resolve: (config) => {
      const enabled = config.config.persistence.mode !== 'none';
      return createFeatureState('persistence', ['persistence.mode', 'persistence.autosave'], {
        supported: true,
        enabled,
        visible: enabled || config.config.persistence.autosave === true,
        permitted: true,
        available: enabled,
        active: enabled,
        executable: enabled,
        reason: enabled ? undefined : 'persistence-disabled',
      });
    },
  },
};

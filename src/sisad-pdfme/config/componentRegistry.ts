import type { ResolvedSisadPdfmeConfig } from './SisadPdfmeConfig.js';
import type { SisadPdfmeFeatureState } from './featureRegistry.js';

export type ComponentId =
  | 'left-sidebar'
  | 'right-sidebar'
  | 'canvas-toolbar'
  | 'canvas-context-menu'
  | 'inspector'
  | 'comments-panel'
  | 'documents-panel'
  | 'fields-panel'
  | 'detail-panel'
  | 'assignment-dialog'
  | 'shortcut-help-panel';

export type ComponentContext = {
  readOnly?: boolean;
};

export type SisadPdfmeComponentState = SisadPdfmeFeatureState & {
  componentId?: string;
};

export type ComponentDefinition = {
  id: ComponentId;
  sources: string[];
  resolve: (
    config: Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>,
    context?: ComponentContext,
  ) => SisadPdfmeComponentState;
};

const createComponentState = (
  id: ComponentId,
  componentId: string,
  sources: string[],
  partial: Partial<SisadPdfmeComponentState>,
): SisadPdfmeComponentState => ({
  id,
  componentId,
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

const resolvePanelState = (
  id: ComponentId,
  componentId: string,
  config: Pick<ResolvedSisadPdfmeConfig, 'config' | 'visibility'>,
  visible: boolean,
  source: string,
) =>
  createComponentState(id, componentId, [source], {
    visible,
    enabled: visible,
    available: visible,
    active: visible,
    executable: visible,
    reason: visible ? undefined : 'hidden-by-config',
  });

export const componentRegistry: Record<ComponentId, ComponentDefinition> = {
  'left-sidebar': {
    id: 'left-sidebar',
    sources: ['sidebars.left.enabled', 'visibility.sidebars.left.visible'],
    resolve: (config) =>
      resolvePanelState(
        'left-sidebar',
        'LeftSidebar',
        config,
        config.config.sidebars?.left?.enabled !== false && config.visibility.sidebars?.left?.visible !== false,
        'sidebars.left.enabled',
      ),
  },
  'right-sidebar': {
    id: 'right-sidebar',
    sources: ['sidebars.right.enabled', 'visibility.sidebars.right.visible'],
    resolve: (config) =>
      resolvePanelState(
        'right-sidebar',
        'RightSidebar',
        config,
        config.config.sidebars?.right?.enabled !== false && config.visibility.sidebars?.right?.visible !== false,
        'sidebars.right.enabled',
      ),
  },
  'canvas-toolbar': {
    id: 'canvas-toolbar',
    sources: ['visibility.canvas.toolbar', 'canvas.enabled'],
    resolve: (config) =>
      resolvePanelState(
        'canvas-toolbar',
        'CanvasToolbar',
        config,
        config.config.canvas.enabled !== false && config.visibility.canvas?.toolbar !== false,
        'canvas.enabled',
      ),
  },
  'canvas-context-menu': {
    id: 'canvas-context-menu',
    sources: ['visibility.canvas.contextMenu', 'canvas.enabled'],
    resolve: (config) =>
      resolvePanelState(
        'canvas-context-menu',
        'CanvasContextMenu',
        config,
        config.config.canvas.enabled !== false && config.visibility.canvas?.contextMenu !== false,
        'canvas.enabled',
      ),
  },
  inspector: {
    id: 'inspector',
    sources: ['visibility.inspector.visible'],
    resolve: (config) =>
      resolvePanelState('inspector', 'DetailView', config, config.visibility.inspector?.visible !== false, 'visibility.inspector.visible'),
  },
  'comments-panel': {
    id: 'comments-panel',
    sources: ['visibility.sidebars.right.panels.comments'],
    resolve: (config) =>
      resolvePanelState(
        'comments-panel',
        'CommentsRail',
        config,
        config.visibility.sidebars?.right?.panels?.comments !== false,
        'visibility.sidebars.right.panels.comments',
      ),
  },
  'documents-panel': {
    id: 'documents-panel',
    sources: ['visibility.sidebars.right.panels.documents'],
    resolve: (config) =>
      resolvePanelState(
        'documents-panel',
        'DocumentsRail',
        config,
        config.visibility.sidebars?.right?.panels?.documents !== false,
        'visibility.sidebars.right.panels.documents',
      ),
  },
  'fields-panel': {
    id: 'fields-panel',
    sources: ['visibility.sidebars.right.panels.fields'],
    resolve: (config) =>
      resolvePanelState(
        'fields-panel',
        'FieldsPanel',
        config,
        config.visibility.sidebars?.right?.panels?.fields !== false,
        'visibility.sidebars.right.panels.fields',
      ),
  },
  'detail-panel': {
    id: 'detail-panel',
    sources: ['visibility.sidebars.right.panels.detail'],
    resolve: (config) =>
      resolvePanelState(
        'detail-panel',
        'DetailPanel',
        config,
        config.visibility.sidebars?.right?.panels?.detail !== false,
        'visibility.sidebars.right.panels.detail',
      ),
  },
  'assignment-dialog': {
    id: 'assignment-dialog',
    sources: ['visibility.modals.assignment'],
    resolve: (config) =>
      resolvePanelState('assignment-dialog', 'SchemaAssignmentDialog', config, config.visibility.modals?.assignment !== false, 'visibility.modals.assignment'),
  },
  'shortcut-help-panel': {
    id: 'shortcut-help-panel',
    sources: ['visibility.modals.shortcutHelp'],
    resolve: (config) =>
      resolvePanelState('shortcut-help-panel', 'ShortcutHelpPanel', config, config.visibility.modals?.shortcutHelp !== false, 'visibility.modals.shortcutHelp'),
  },
};

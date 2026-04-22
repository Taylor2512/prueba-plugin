export type SchemaInspectorSection =
  | 'general'
  | 'layout'
  | 'style'
  | 'data'
  | 'connections'
  | 'collaboration'
  | 'validation'
  | 'advanced'
  | 'comments';

export type PluginActionDefinition = {
  id: string;
  label: string;
  command:
    | 'addField'
    | 'editText'
    | 'renameVariable'
    | 'resizeField'
    | 'moveField'
    | 'duplicateField'
    | 'deleteField'
    | 'changeColor'
    | 'togglePersistence'
    | 'addComment'
    | 'resolveComment'
    | 'lockField'
    | 'unlockField';
  placement?: Array<'toolbar' | 'context-menu' | 'inspector' | 'comments-panel'>;
};

export type PluginStrategyDefinition = {
  id: string;
  type: 'validation' | 'upload' | 'prefill' | 'persistence' | 'comments' | 'locking';
  label: string;
};

export type PluginFamilyDefinition = {
  family: 'text' | 'mediaVisual' | 'boolean' | 'shapeBarcode' | 'table';
  visibleSections: SchemaInspectorSection[];
  propertyMap: Partial<Record<string, SchemaInspectorSection>>;
  supportedActions: PluginActionDefinition[];
  strategies: PluginStrategyDefinition[];
  supportsComments: boolean;
  supportsLocking: boolean;
  supportsPresence: boolean;
};

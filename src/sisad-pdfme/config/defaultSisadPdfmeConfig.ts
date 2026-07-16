import type { SisadPdfmeGlobalConfig, SisadPdfmeVisibilityConfig } from './SisadPdfmeConfig.js';

export const defaultSisadPdfmeVisibilityConfig: Required<SisadPdfmeVisibilityConfig> = {
  shell: {
    header: true,
    footer: false,
    statusBar: true,
    resultsPanel: false,
    debugPanel: false,
  },
  canvas: {
    toolbar: true,
    floatingToolbar: true,
    contextMenu: true,
    pageNavigator: true,
    zoomControls: true,
    grid: false,
    rulers: false,
    guides: true,
    snapLines: true,
    selectionBox: true,
    ownerBadges: true,
    requiredMarkers: true,
    lockBadges: true,
  },
  sidebars: {
    left: {
      visible: true,
      collapseButton: true,
      search: true,
      tabs: true,
      catalog: true,
      customFields: false,
      favorites: false,
      recent: false,
      recipients: false,
    },
    right: {
      visible: true,
      collapseButton: true,
      tabs: true,
      contextHeader: true,
      panels: {
        fields: true,
        detail: true,
        comments: false,
        documents: false,
      },
    },
  },
  actions: {
    reassign: true,
    rename: false,
    duplicate: true,
    delete: true,
    copy: true,
    paste: true,
    lock: true,
    unlock: true,
    hide: false,
    show: false,
    align: true,
    distribute: true,
    matchSize: true,
  },
  inspector: {
    visible: true,
    showEmptySections: false,
    showAdvanced: false,
    showTechnical: false,
    showCollaboration: true,
    showComments: false,
    sections: {},
    fields: {},
    fieldsBySchemaType: {},
  },
  schemas: {
    catalog: {},
    canvas: {},
    inspector: {},
    runtime: {},
  },
  modals: {
    assignment: true,
    schemaDropSetup: true,
    customField: false,
    comments: false,
    shortcutHelp: true,
  },
  runtime: {
    fieldChrome: true,
    readonlyChrome: true,
    ownerColor: true,
    recipientFilter: true,
  },
};

export const defaultSisadPdfmeConfig: Required<Pick<SisadPdfmeGlobalConfig, 'app' | 'runtime' | 'theme' | 'canvas' | 'sidebars' | 'schemas' | 'recipients' | 'collaboration' | 'assignment' | 'documents' | 'signatures' | 'persistence' | 'events' | 'debug'>> & {
  visibility: Required<SisadPdfmeVisibilityConfig>;
  ui: Required<NonNullable<SisadPdfmeGlobalConfig['ui']>> & {
    visibility: Required<SisadPdfmeVisibilityConfig>;
    classNames: Record<string, never>;
  };
} = {
  app: {
    locale: 'es',
  },
  runtime: {
    mode: 'designer',
    readonly: false,
    isolateDomEvents: true,
    preserveSelectionOnModalClose: true,
  },
  theme: {
    cssEntry: 'sisad-pdfme.css',
    strategy: 'tailwind',
    density: 'comfortable',
    classNamePrefix: 'sisad-pdfme',
    tokens: {},
  },
  canvas: {
    enabled: true,
    selecto: true,
    moveable: true,
    snapLines: true,
    guides: true,
    emptyClickClearsSelection: true,
    multiSelect: true,
    platformSelection: 'auto',
    suspendWhenModalOpen: true,
    resetInteractionOnModalClose: true,
  },
  sidebars: {
    left: {
      enabled: true,
      defaultOpen: true,
      catalogLayout: 'list',
      allowCustomFields: false,
    },
    right: {
      enabled: true,
      defaultPanel: 'fields',
      panels: ['fields', 'detail', 'comments', 'documents'],
      density: 'comfortable',
      showCollapsedButton: false,
    },
  },
  schemas: {
    enabledTypes: [],
    autoAttachIdentity: true,
    validateUniqueNames: true,
    defaultOwnerStrategy: 'active-recipient',
    plugins: [],
  },
  recipients: {
    enabled: true,
    activeRecipientId: null,
    allowUnassigned: true,
    allowShared: true,
    allowMultipleOwners: false,
    defaultOwnerStrategy: 'active-recipient',
    colorStrategy: 'recipient',
    missingRecipientBehavior: 'keep-id',
  },
  collaboration: {
    enabled: false,
    activeRecipientId: null,
    isGlobalView: false,
    canEditStructure: true,
    ownerColorStrategy: 'recipient',
  },
  assignment: {
    // Activo por defecto: el botón Reasignar del ListView exige `enabled === true`
    // (criterio de cierre TASK-ARCH-001 / circuito TASK-PDFME-003).
    enabled: true,
    allowSingle: true,
    allowBulk: true,
    preserveLockState: true,
    showCurrentRecipient: true,
    searchable: true,
    closeOnCancel: true,
    closeOnConfirm: true,
  },
  documents: {
    mode: 'single',
    preserveDocumentSchemaRouting: true,
    activeDocumentStrategy: 'internal',
  },
  signatures: {
    enabled: true,
    defaultMode: 'draw',
    providers: [],
  },
  persistence: {
    mode: 'none',
    autosave: false,
    serializeSnapshot: true,
  },
  events: {},
  debug: {
    enabled: false,
    showTechnicalInspector: false,
    logEvents: false,
  },
  visibility: defaultSisadPdfmeVisibilityConfig,
  ui: {
    visualPreset: 'classic-designer',
    layoutPreset: 'three-panel',
    density: 'comfortable',
    gap: '0.5rem',
    padding: '0.5rem',
    baseWidth: '100%',
    baseHeight: '100%',
    sidebars: {
      left: {
        defaultOpen: true,
        catalogLayout: 'list',
      },
      right: {
        defaultOpen: true,
        defaultPanel: 'fields',
      },
    },
    visibility: defaultSisadPdfmeVisibilityConfig,
    classNames: {
      leftSidebar: {},
      rightSidebar: {},
    },
  },
};

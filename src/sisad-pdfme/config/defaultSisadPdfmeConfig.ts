import type {
  SisadPdfmeGlobalConfig,
  SisadPdfmeUiClassNamesConfig,
  SisadPdfmeVisibilityConfig,
} from '@sisad-pdfme/config/SisadPdfmeConfig';

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
    // `visibility.*` es política del host: sólo puede apagar. Que la rejilla y
    // las reglas empiecen ocultas es un default de PRESENTACIÓN y vive en
    // `canvas.grid` / `canvas.rulers`. Mantenerlo aquí dejaba sus toggles
    // permanentemente inalcanzables (RTP-440).
    grid: true,
    rulers: true,
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
      customFields: true,
      favorites: true,
      recent: true,
      recipients: true,
    },
    right: {
      visible: true,
      collapseButton: true,
      tabs: true,
      contextHeader: true,
      panels: {
        fields: true,
        detail: true,
        comments: true,
        documents: true,
      },
    },
  },
  actions: {
    reassign: true,
    rename: true,
    duplicate: true,
    delete: true,
    copy: true,
    paste: true,
    lock: true,
    unlock: true,
    hide: true,
    show: true,
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
    showComments: true,
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
    customField: true,
    comments: true,
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
    classNames: Required<SisadPdfmeUiClassNamesConfig>;
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
    // Defaults de presentación: la superficie existe y es alternable, pero
    // arranca apagada. El estado efectivo sigue siendo el histórico.
    grid: false,
    rulers: false,
    // Capabilities de ajuste, independientes entre sí. `objectSnap` arranca
    // encendido porque es el comportamiento histórico del canvas; el ajuste a
    // rejilla arranca apagado, como la propia rejilla.
    snapToGrid: false,
    objectSnap: true,
    guideCreation: true,
    guideSnap: true,
    gridStepMm: 10,
    gridSubdivisions: 2,
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
      allowCustomFields: true,
    },
    right: {
      enabled: true,
      defaultOpen: true,
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
    defaultOwnerStrategy: 'activerecipient',
    plugins: [],
  },
  recipients: {
    enabled: true,
    activeRecipientId: null,
    allowUnassigned: true,
    allowShared: true,
    allowMultipleOwners: false,
    defaultOwnerStrategy: 'activerecipient',
    colorStrategy: 'recipient',
    missingRecipientBehavior: 'keep-id',
  },
  collaboration: {
    enabled: true,
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
    mode: 'local',
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

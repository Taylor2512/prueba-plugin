import type React from 'react';
import type { DesignerEngine } from '../ui/designerEngine.js';
import type { DesignerRuntimeEventHub } from '../ui/components/Designer/shared/designerExtensions.js';
import type {
  SisadPdfmeRecipient,
  SisadPdfmeRecipientRegistry,
  SisadPdfmeRecipientsConfig,
} from '../recipients/recipientTypes.js';

;

type SisadPdfmeDocument = {
  id: string;
  label: string;
  /** Alias del label para consumidores legacy (UploadedPdfDocument.name). */
  name?: string;
  pageCount?: number;
  basePdf?: unknown;
  /**
   * Template del documento (páginas + schemas). El Designer lo necesita para
   * enrutar schemas por documento; el adapter DEBE preservarlo si el host lo
   * entrega (TASK-LAB-026: perderlo deja el canvas en `empty_page`).
   */
  template?: unknown;
  metadata?: Record<string, unknown>;
};

export type SisadPdfmeController = {
  getTemplate(): unknown;
  setTemplate(template: unknown): void;
  getSnapshot(): unknown;
  restoreSnapshot(snapshot: unknown): void;
  getSelectedSchemaIds(): string[];
  selectSchemas(ids: string[], mode?: 'replace' | 'add' | 'toggle'): void;
  clearSelection(): void;
  addSchema(type: string, options?: Record<string, unknown>): string;
  updateSchema(schemaId: string, patch: Record<string, unknown>): void;
  removeSchemas(schemaIds: string[]): void;
  duplicateSchemas(schemaIds: string[]): void;
  getRecipients(): SisadPdfmeRecipient[];
  setRecipients(recipients: SisadPdfmeRecipient[]): void;
  getRecipientById(recipientId: string): SisadPdfmeRecipient | null;
  getActiveRecipient(): SisadPdfmeRecipient | null;
  assignSchemasToRecipient(schemaIds: string[], recipientId: string): void;
  setActiveRecipient(recipientId: string | null): void;
  setActiveDocument(documentId: string): void;
  setZoom(zoom: number): void;
  validate(): Promise<unknown>;
  save(): Promise<void>;
};

export type SisadPdfmeRecipientsAdapter<THostUser = unknown> = {
  toRecipient(input: THostUser): SisadPdfmeRecipient;
  toRecipients(input: THostUser[]): SisadPdfmeRecipient[];
};

export type SisadPdfmeDocumentsAdapter<THostDocument = unknown> = {
  toDocument(input: THostDocument): SisadPdfmeDocument;
  toDocuments(input: THostDocument[]): SisadPdfmeDocument[];
};

export type SisadPdfmePersistenceAdapter<TSnapshot = unknown> = {
  serializeSnapshot(snapshot: TSnapshot): string;
  deserializeSnapshot(value: string): TSnapshot | null;
  load?(key: string): Promise<TSnapshot | null> | TSnapshot | null;
  save?(key: string, snapshot: TSnapshot): Promise<void> | void;
  clear?(key: string): Promise<void> | void;
};

export type SisadPdfmeSignatureProvider = {
  key: string;
  label: string;
  description?: string;
  capabilities?: Record<string, boolean>;
  metadata?: Record<string, unknown>;
};

export type SisadPdfmeSignatureProviderAdapter<TInput = unknown> = {
  toProvider(input: TInput): SisadPdfmeSignatureProvider;
  toProviders(input: TInput[]): SisadPdfmeSignatureProvider[];
};

export type SisadPdfmeEventName =
  | 'onReady'
  | 'onChange'
  | 'onSave'
  | 'onError'
  | 'onSelectionChange'
  | 'onRecipientsChange'
  | 'onActiveRecipientChange'
  | 'onAssignmentChange'
  | 'onDocumentChange'
  | 'onSignatureRequest';

type SisadPdfmeEventHandlers = Partial<
  Record<
    SisadPdfmeEventName,
    | 'host'
    | false
    | ((payload: Record<string, unknown>) => void)
  >
>;

export type SisadPdfmeVisibilityConfig = {
  shell?: {
    header?: boolean;
    footer?: boolean;
    statusBar?: boolean;
    resultsPanel?: boolean;
    debugPanel?: boolean;
  };
  canvas?: {
    toolbar?: boolean;
    floatingToolbar?: boolean;
    contextMenu?: boolean;
    pageNavigator?: boolean;
    zoomControls?: boolean;
    grid?: boolean;
    rulers?: boolean;
    guides?: boolean;
    snapLines?: boolean;
    selectionBox?: boolean;
    ownerBadges?: boolean;
    requiredMarkers?: boolean;
    lockBadges?: boolean;
  };
  sidebars?: {
    left?: {
      visible?: boolean;
      collapseButton?: boolean;
      search?: boolean;
      tabs?: boolean;
      catalog?: boolean;
      customFields?: boolean;
      favorites?: boolean;
      recent?: boolean;
      recipients?: boolean;
    };
    right?: {
      visible?: boolean;
      collapseButton?: boolean;
      tabs?: boolean;
      contextHeader?: boolean;
      panels?: {
        fields?: boolean;
        detail?: boolean;
        comments?: boolean;
        documents?: boolean;
      };
    };
  };
  actions?: {
    reassign?: boolean;
    rename?: boolean;
    duplicate?: boolean;
    delete?: boolean;
    copy?: boolean;
    paste?: boolean;
    lock?: boolean;
    unlock?: boolean;
    hide?: boolean;
    show?: boolean;
    align?: boolean;
    distribute?: boolean;
    matchSize?: boolean;
  };
  inspector?: {
    visible?: boolean;
    showEmptySections?: boolean;
    showAdvanced?: boolean;
    showTechnical?: boolean;
    showCollaboration?: boolean;
    showComments?: boolean;
    sections?: Partial<Record<
      | 'identity'
      | 'options'
      | 'validation'
      | 'behavior'
      | 'box'
      | 'appearance'
      | 'help'
      | 'dataBindings'
      | 'collaboration'
      | 'comments'
      | 'advanced',
      boolean
    >>;
    fields?: Record<string, boolean>;
    fieldsBySchemaType?: Record<string, Record<string, boolean>>;
  };
  schemas?: {
    catalog?: Record<string, boolean>;
    canvas?: Record<string, boolean>;
    inspector?: Record<string, boolean>;
    runtime?: Record<string, boolean>;
  };
  modals?: {
    assignment?: boolean;
    schemaDropSetup?: boolean;
    customField?: boolean;
    comments?: boolean;
    shortcutHelp?: boolean;
  };
  runtime?: {
    fieldChrome?: boolean;
    readonlyChrome?: boolean;
    ownerColor?: boolean;
    recipientFilter?: boolean;
  };
};

export type SisadPdfmeUiClassNamesConfig = {
  leftSidebar?: {
    container?: string;
    content?: string;
    searchInput?: string;
  };
  rightSidebar?: {
    root?: string;
    content?: string;
    listView?: string;
    detailView?: string;
  };
};

export type SisadPdfmeUiConfig = {
  visualPreset?: 'classic-designer' | string;
  layoutPreset?: 'three-panel' | 'canvas-first' | string;
  density?: 'comfortable' | 'compact' | 'minimal';
  gap?: number | string;
  padding?: number | string;
  baseWidth?: number | string;
  baseHeight?: number | string;
  sidebars?: {
    left?: {
      defaultOpen?: boolean;
      catalogLayout?: 'list' | 'tiles' | 'icons';
    };
    right?: {
      defaultOpen?: boolean;
      defaultPanel?: 'fields' | 'detail' | 'comments' | 'documents';
    };
  };
  visibility?: SisadPdfmeVisibilityConfig;
  classNames?: SisadPdfmeUiClassNamesConfig;
};

export type SisadPdfmeGlobalConfig = {
  app?: {
    id?: string;
    name?: string;
    locale?: string;
    environment?: 'development' | 'test' | 'production' | string;
  };
  runtime?: {
    mode?: 'designer' | 'form' | 'viewer';
    readonly?: boolean;
    isolateDomEvents?: boolean;
    preserveSelectionOnModalClose?: boolean;
  };
  theme?: {
    cssEntry?: string;
    strategy?: 'tailwind' | string;
    density?: 'comfortable' | 'compact' | 'minimal';
    classNamePrefix?: string;
    tokens?: Record<string, string | number>;
  };
  canvas?: {
    enabled?: boolean;
    selecto?: boolean;
    moveable?: boolean;
    snapLines?: boolean;
    guides?: boolean;
    emptyClickClearsSelection?: boolean;
    multiSelect?: boolean;
    platformSelection?: 'auto' | 'mac' | 'windows' | 'linux';
    suspendWhenModalOpen?: boolean;
    resetInteractionOnModalClose?: boolean;
  };
  sidebars?: {
    left?: {
      enabled?: boolean;
      defaultOpen?: boolean;
      catalogLayout?: 'list' | 'tiles' | 'icons';
      allowCustomFields?: boolean;
    };
    right?: {
      enabled?: boolean;
      defaultPanel?: 'fields' | 'detail' | 'comments' | 'documents';
      panels?: Array<'fields' | 'detail' | 'comments' | 'documents'>;
      density?: 'comfortable' | 'compact' | 'minimal';
      showCollapsedButton?: boolean;
    };
  };
  schemas?: {
    enabledTypes?: string[];
    autoAttachIdentity?: boolean;
    validateUniqueNames?: boolean;
    defaultOwnerStrategy?: 'none' | 'active-recipient' | 'first-recipient';
    plugins?: unknown[];
  };
  recipients?: SisadPdfmeRecipientsConfig;
  collaboration?: {
    enabled?: boolean;
    activeRecipientId?: string | null;
    isGlobalView?: boolean;
    canEditStructure?: boolean;
    ownerColorStrategy?: 'recipient' | 'schema' | 'theme';
  };
  assignment?: {
    enabled?: boolean;
    allowSingle?: boolean;
    allowBulk?: boolean;
    preserveLockState?: boolean;
    showCurrentRecipient?: boolean;
    searchable?: boolean;
    closeOnCancel?: boolean;
    closeOnConfirm?: boolean;
  };
  documents?: {
    mode?: 'single' | 'multi';
    preserveDocumentSchemaRouting?: boolean;
    activeDocumentStrategy?: 'internal' | 'host';
  };
  signatures?: {
    enabled?: boolean;
    defaultMode?: 'draw' | 'image' | 'p12' | 'provider';
    providers?: SisadPdfmeSignatureProvider[];
  };
  persistence?: {
    mode?: 'none' | 'local' | 'host';
    autosave?: boolean;
    serializeSnapshot?: boolean;
  };
  events?: SisadPdfmeEventHandlers;
  debug?: {
    enabled?: boolean;
    showTechnicalInspector?: boolean;
    logEvents?: boolean;
  };
  visibility?: SisadPdfmeVisibilityConfig;
  ui?: SisadPdfmeUiConfig;
};

export type ResolvedSisadPdfmeConfig = {
  raw: SisadPdfmeGlobalConfig;
  config: Required<Pick<SisadPdfmeGlobalConfig, 'app' | 'runtime' | 'theme' | 'canvas' | 'sidebars' | 'schemas' | 'recipients' | 'collaboration' | 'assignment' | 'documents' | 'signatures' | 'persistence' | 'events' | 'debug'>> & {
    visibility: Required<SisadPdfmeVisibilityConfig>;
    ui: Required<SisadPdfmeUiConfig> & {
      visibility: Required<SisadPdfmeVisibilityConfig>;
      classNames: Required<SisadPdfmeUiClassNamesConfig>;
    };
  };
  visibility: Required<SisadPdfmeVisibilityConfig>;
  runtimeOptions: Record<string, unknown>;
  designerEngine: DesignerEngine;
  adapters: {
    recipients: SisadPdfmeRecipientsAdapter<unknown>;
    documents: SisadPdfmeDocumentsAdapter<unknown>;
    persistence: SisadPdfmePersistenceAdapter<unknown>;
    signatures: SisadPdfmeSignatureProviderAdapter<unknown>;
  };
  eventHub: DesignerRuntimeEventHub;
};

export type SisadPdfmeProviderValue = {
  config: ResolvedSisadPdfmeConfig;
  /** Registry compartido de recipients; fuente única para wrappers hijos. */
  recipientRegistry: SisadPdfmeRecipientRegistry;
};

export type SisadPdfmeProviderProps = {
  children: React.ReactNode;
  config: SisadPdfmeGlobalConfig | ResolvedSisadPdfmeConfig;
};

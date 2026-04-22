import type { SchemaForUI, SchemaCommentReply, Size, ChangeSchemas, BasePdf } from '@sisad-pdfme/common';
import type { SchemaDesignerConfig } from './designerEngine';
import type { EffectiveCollaborationContext } from './collaborationContext';
import type { DesignerDocumentItem } from './components/Designer/RightSidebar/DocumentsRail';
import type { InteractionPhase } from './components/Designer/shared/interactionState';

export type DesignerSidebarPresentation = 'docked' | 'overlay' | 'auto';

export type SidebarProps = {
  height: number;
  hoveringSchemaId: string | null;
  onChangeHoveringSchemaId: (id: string | null) => void;
  size: Size;
  pageSize: Size;
  basePdf: BasePdf;
  activeElements: HTMLElement[];
  schemas: SchemaForUI[];
  schemasList: SchemaForUI[][];
  onSortEnd: (sortedSchemas: SchemaForUI[]) => void;
  onEdit: (id: string) => void;
  onEditEnd: () => void;
  changeSchemas: ChangeSchemas;
  deselectSchema: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  collaborationContext?: EffectiveCollaborationContext;
};

export type DesignerComponentBridge = {
  runtime: DesignerRuntimeApi;
    view: {
      pageCursor: number;
      totalPages: number;
      zoomLevel: number;
      collaborationStatus?: 'idle' | 'connecting' | 'open' | 'closed' | 'error';
      collaborationPresenceCount?: number;
      collaborationHistoryCount?: number;
      viewportMode: 'manual' | 'fit-width' | 'fit-page' | 'actual-size' | 'auto';
      sidebarOpen: boolean;
      isSchemaDragging: boolean;
      isDraggingOverCanvas: boolean;
      activeSchemaIds: string[];
      hoveringSchemaId: string | null;
      interactionPhase: InteractionPhase;
      interactionCount: number;
      isDragging: boolean;
      isResizing: boolean;
      isRotating: boolean;
    };
  };

export type DesignerDocumentsBridge = {
  items: DesignerDocumentItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd?: () => void;
  onUploadPdf?: () => void;
  title?: string;
  emptyTitle?: string;
};

export type DesignerCommentItem = {
  id: string;
  text: string;
  authorName?: string | null;
  authorColor?: string | null;
  schemaUid?: string;
  fieldId?: string | null;
  fileId?: string | null;
  pageNumber?: number;
  resolved?: boolean;
  timestamp?: number;
  createdAt?: number;
  replies?: SchemaCommentReply[];
};

export type DesignerCommentsBridge = {
  items: DesignerCommentItem[];
  onAdd?: () => void;
  title?: string;
  emptyTitle?: string;
  activeCommentId?: string | null;
};

export type DesignerRuntimeApi = {
  undo: () => void;
  redo: () => void;
  setZoom: (zoom: number) => void;
  getZoom: () => number;
  fitToWidth: (page?: number) => void;
  fitToPage: (page?: number) => void;
  fitToDevice: (page?: number) => void;
  setViewportMode: (mode: 'manual' | 'fit-width' | 'fit-page' | 'actual-size' | 'auto') => void;
  getViewportMode: () => 'manual' | 'fit-width' | 'fit-page' | 'actual-size' | 'auto';
  getCanvasMetrics: () => {
    viewportWidth: number;
    viewportHeight: number;
    usableWidth: number;
    usableHeight: number;
    pageWidth: number;
    pageHeight: number;
    scale: number;
    zoom: number;
    currentPage: number;
    totalPages: number;
    sidebarOpen: boolean;
  };
  setPage: (page: number) => void;
  getPage: () => number;
  nextPage: () => void;
  prevPage: () => void;
  centerPage: (page?: number) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  focusField: (fieldName: string) => void;
  highlightField: (fieldName: string) => void;
  addSchema: (schema: SchemaForUI) => void;
  addSchemaByType: (schemaType: string) => void;
  duplicatePage?: () => void;
  setCanvasFeatureToggle?: (key: 'selecto' | 'snapLines' | 'guides' | 'padding' | 'mask' | 'moveable' | 'deleteButton', value: boolean) => void;
  getCanvasFeatureToggles?: () => {
    selecto?: boolean;
    snapLines?: boolean;
    guides?: boolean;
    padding?: boolean;
    mask?: boolean;
    moveable?: boolean;
    deleteButton?: boolean;
  };
  getSchemaConfig: (
    schemaIdOrName: string,
    matcher?: 'id' | 'name' | 'identity' | 'prefill-source',
  ) => SchemaDesignerConfig | null;
  setSchemaConfig: (
    schemaIdOrName: string,
    patch: Partial<SchemaDesignerConfig>,
    matcher?: 'id' | 'name' | 'identity' | 'prefill-source',
  ) => boolean;
  applyExternalPrefill: (
    payload: Record<string, unknown>,
    matcher?: 'name' | 'id' | 'identity' | 'prefill-source',
  ) => number;
};

/**
 * Tipos públicos del runtime UI y bridges del Designer.
 *
 * Rol arquitectónico:
 * - Define contratos para sidebars, documentos, comentarios, runtime bridge y API imperativa.
 * - Permite que hosts externos integren Designer sin depender de componentes internos.
 * - Declara la superficie pública de operaciones como zoom, páginas, sidebar, canvas toggles,
 *   focus/highlight, addSchema, schema config y prefill externo.
 *
 * Regla:
 * - Este archivo es contrato público: cambiar nombres/firmas puede romper integraciones.
 * - Preferir extender con campos opcionales antes que romper tipos existentes.
 */

import type { SchemaForUI, SchemaCommentReply, Size, ChangeSchemas, BasePdf } from '@sisad-pdfme/common';
import type { SchemaDesignerConfig } from '@sisad-pdfme/ui/designerEngine';
import type { EffectiveCollaborationContext } from '@sisad-pdfme/ui/collaborationContext';
import type { DesignerDocumentItem } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail';
import type { InteractionPhase } from '@sisad-pdfme/ui/components/Designer/shared/interactionState';
import type { DesignerRuntimeExtensions } from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';

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
  sidebarOpenControlled?: boolean;
  setSidebarOpen: (sidebarOpen: boolean) => void;
  collaborationContext?: EffectiveCollaborationContext;
  extensions?: DesignerRuntimeExtensions;
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
  onDelete?: (id: string) => void;
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
  getSelectedSchemaIds?: () => string[];
  selectSchemas?: (ids: string[], mode?: 'replace' | 'add' | 'toggle') => void;
  clearSelection?: () => void;
  addSchema: (schema: SchemaForUI) => void;
  addSchemaByType: (schemaType: string) => void;
  duplicatePage?: () => void;
  removeSchemas?: (schemaIds: string[]) => void;
  duplicateSchemas?: (schemaIds: string[]) => void;
  setActiveDocument?: (documentId: string) => void;
  validate?: () => Promise<unknown>;
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

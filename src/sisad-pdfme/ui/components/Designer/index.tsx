import React, { useRef, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  cloneDeep,
  ZOOM,
  Template,
  findSchemaByUid,
  createSchemaComment,
  createSchemaCommentAnchor,
  filterCommentsByFileAndPage,
  removeTopLevelComment,
  Schema,
  SchemaForUI,
  ChangeSchemas,
  DesignerProps,
  Size,
  isBlankPdf,
  upsertTopLevelComment,
  upsertById,
  type SchemaCommentReply,
} from '@sisad-pdfme/common';
import { ensureAnchorId, ensureComment } from '@sisad-pdfme/common/collaboration';
import { message } from 'antd';

import { generateSchemaUid } from '@sisad-pdfme/shared/schemaDesignerMeta';
import { DndContext } from '@dnd-kit/core';
import { pdf2size } from '@sisad-pdfme/converter';
import PluginIcon from '@sisad-pdfme/ui/components/Designer/PluginIcon';
import RightSidebarDefault from '@sisad-pdfme/ui/components/Designer/RightSidebar/RightSidebar';
import LeftSidebarDefault from '@sisad-pdfme/ui/components/Designer/LeftSidebar';
import Canvas from '@sisad-pdfme/ui/components/Designer/Canvas/Canvas';
import type { CanvasFeatureToggles } from '@sisad-pdfme/ui/components/Designer/Canvas/Canvas';
import { createSelectionCommands } from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import {
  resolveActiveSchemasFromElements,
  resolveSchemaIdentityFromElement,
} from '@sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver';
import {
  copySchemasToClipboard,
  cutSchemasToClipboard,
  duplicateSchemas as duplicateSchemasFromClipboard,
  pasteSchemasFromClipboard,
  type SchemaClipboardPayload,
} from '@sisad-pdfme/ui/components/Designer/shared/schemaClipboard';
import type { InteractionState } from '@sisad-pdfme/ui/components/Designer/shared/interactionState';
import {
  RULER_HEIGHT,
  RIGHT_SIDEBAR_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  DESIGNER_CLASSNAME,
  SELECTABLE_CLASSNAME,
} from '@sisad-pdfme/ui/constants';
import {
  resolveDesignerSchemaAccessState,
  canRunSchemaCommand,
  type SchemaAccessContext,
} from '@sisad-pdfme/ui/components/Designer/shared/accessPolicy';
import { I18nContext, OptionsContext, PluginsRegistry } from '@sisad-pdfme/ui/contexts';
import {
  schemasList2template,
  uuid,
  round,
  template2SchemasList,
  getPagesScrollTopByIndex,
  applySchemaChanges as _changeSchemas,
  useMaxZoom,
} from '@sisad-pdfme/ui/helper';
import { useUIPreProcessor, useScrollPageCursor, useInitEvents } from '@sisad-pdfme/ui/hooks';
import usePaperRefRegistry from '@sisad-pdfme/ui/components/shared/usePaperRefRegistry';
import Root from '@sisad-pdfme/ui/components/Root';
import ErrorScreen from '@sisad-pdfme/ui/components/ErrorScreen';
import CtlBar, { type SaveStatus } from '@sisad-pdfme/ui/components/CtlBar';
import CommentDialog from '@sisad-pdfme/ui/components/Designer/Comments/CommentDialog';
import { applyCollaborationEvent, diffCollaborationEvents, useCollaborationSync } from '@sisad-pdfme/ui/collaboration';
import type { DesignerDocumentItem } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail';
import type { DesignerRuntimeApi, DesignerSidebarPresentation, DesignerCommentItem } from '@sisad-pdfme/ui/types';
import type { SchemaComment, SchemaCommentAnchor } from '@sisad-pdfme/ui/designerEngine';
import { useSisadPdfmeConfig } from '@sisad-pdfme/react/useSisadPdfmeConfig';
import { validateTemplate } from '@sisad-pdfme/shared/templateValidator';
import {
  extractClientPoint,
} from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/pointerGeometry';
import {
  resolveSmartDropPosition,
} from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/smartPlacement';
import SchemaDragPreview from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDragPreview';
import SchemaDropCommitFlash from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropCommitFlash';
import SchemaDropPlaceholder from '@sisad-pdfme/ui/components/Designer/Canvas/overlays/SchemaDropPlaceholder';
import { installPassiveTouchListenerGuard } from '@sisad-pdfme/ui/components/Designer/shared/passiveTouchListeners';
import { normalizeSignatureSchema, type SignatureSchema } from '@sisad-pdfme/schemas/signature/types';

type CatalogLayout = 'list' | 'tiles' | 'icons';

type DesignerOptionsBridge = {
  uploadedDocuments?: unknown;
  activeDocumentId?: unknown;
  catalogLayout?: CatalogLayout;
  hiddenCatalogTypes?: unknown;
  onCatalogLayoutChange?: ((layout: CatalogLayout) => void) | null;
  rightSidebarViewMode?: 'auto' | 'fields' | 'detail' | 'docs' | 'comments';
  onRightSidebarViewModeChange?: ((mode: 'auto' | 'fields' | 'detail' | 'docs' | 'comments') => void) | null;
  onUploadedDocumentsChange?: ((documents: UploadedPdfDocument[], activeDocumentId: string | null) => void) | null;
};
import {
  lockDesignerSidebarScroll,
  unlockDesignerSidebarScroll,
} from '@sisad-pdfme/ui/components/Designer/shared/interactionGuards';
import { isInspectorInteractiveTarget } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards';
import { filterSchemasByCollisionScope } from '@sisad-pdfme/ui/components/Designer/shared/schemaCollision';
import { resolvePointerDropTarget } from '@sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline';

installPassiveTouchListenerGuard();

import { buildEffectiveCollaborationContext, filterSchemasForCollaborationView } from '@sisad-pdfme/ui/collaborationContext';
import { applyRecipientPrefill, resolveSchemaPrefillRecipient } from '@sisad-pdfme/ui/recipientPrefill';
import type { RightSidebarContextHeader, RightSidebarContextHeaderContext } from '@sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader';
import { asRecord } from '@sisad-pdfme/shared/objectGuards';
import {
  resolveDesignerEngine,
  attachSchemaIdentity,
  applySchemaCreationHook,
  applySchemaCollaborativeDefaults,
  createSchemaCreationContext,
  getSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
} from '@sisad-pdfme/ui/designerEngine';
import { CommandBus } from '@sisad-pdfme/ui/commands/commandBus';
import {
  buildTopLevelCommentEntry,
  createCommentCommandEvent,
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
} from '@sisad-pdfme/commands';
import { emitDesignerRuntimeEvent } from '@sisad-pdfme/ui/components/Designer/shared/designerExtensions';
import { configFromRuntimeOptions } from '@sisad-pdfme/config/configFromRuntimeOptions';
import { computeFitZoom, type ViewportFitMode } from '@sisad-pdfme/ui/components/Designer/shared/zoomContract';
const DESIGNER_THEME_STYLE_ID = DESIGNER_CLASSNAME + 'theme-base';

const stableHashSchemas = (schemas: Schema[][]) => {
  try {
    return JSON.stringify(schemas);
  } catch {
    return `schemas:${schemas.length}`;
  }
};

const normalizeSchemaIds = (ids: string[]) =>
  [...new Set(ids.map((id) => String(id || '').trim()).filter(Boolean))];

const schemaMatchesAnyId = (schema: SchemaForUI, ids: Set<string>) => {
  const schemaUid = String((schema as { schemaUid?: string }).schemaUid || '').trim();
  return ids.has(schema.id) || (schemaUid ? ids.has(schemaUid) : false);
};

const isValidRealBasePdf = (basePdf: Template['basePdf']) =>
  basePdf != null && !isBlankPdf(basePdf);

type RightSidebarContextHeaderRendererDeps = {
  activeDocumentId: string | null;
  uploadedDocuments: UploadedPdfDocument[];
  fallbackBaseDocumentItem: DesignerDocumentItem | null;
  pageCursor: number;
  pageItemsLength: number;
  activeElementsLength: number;
};

const renderRightSidebarContextHeader = (
  _ctx: RightSidebarContextHeaderContext,
  _deps: RightSidebarContextHeaderRendererDeps,
): React.ReactNode => {
  return null;
};

const DESIGNER_THEME_CSS = `
.sisad-pdfme-designer-root {
  --sisad-pdfme-radius: 10px;
  --sisad-pdfme-radius-sm: 8px;
  --sisad-pdfme-border: rgba(148, 163, 184, 0.28);
  --sisad-pdfme-border-strong: rgba(100, 116, 139, 0.38);
  --sisad-pdfme-surface: #ffffff;
  --sisad-pdfme-surface-alt: #f8fafc;
  --sisad-pdfme-surface-soft: #f1f5f9;
  --sisad-pdfme-text: #1e293b;
  --sisad-pdfme-text-muted: #64748b;
  --sisad-pdfme-accent: #6d28d9;
  --sisad-pdfme-accent-soft: rgba(109, 40, 217, 0.14);
  --sisad-pdfme-info-soft: rgba(37, 99, 235, 0.08);
  --sisad-pdfme-danger: #b91c1c;
  --sisad-pdfme-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.08);
  --sisad-pdfme-shadow-md: 0 10px 20px rgba(15, 23, 42, 0.12);
}

.sisad-pdfme-designer-root[data-sisad-pdfme-theme="graphite"] {
  --sisad-pdfme-border: rgba(148, 163, 184, 0.34);
  --sisad-pdfme-surface: #f9fbff;
  --sisad-pdfme-surface-alt: #f1f5f9;
  --sisad-pdfme-surface-soft: #e9eef7;
  --sisad-pdfme-accent: #4f46e5;
  --sisad-pdfme-accent-soft: rgba(79, 70, 229, 0.14);
}

.sisad-pdfme-designer-root[data-sisad-pdfme-theme="night"] {
  --sisad-pdfme-border: rgba(148, 163, 184, 0.32);
  --sisad-pdfme-border-strong: rgba(148, 163, 184, 0.48);
  --sisad-pdfme-surface: #1f2937;
  --sisad-pdfme-surface-alt: #111827;
  --sisad-pdfme-surface-soft: #0f172a;
  --sisad-pdfme-text: #f8fafc;
  --sisad-pdfme-text-muted: #cbd5e1;
  --sisad-pdfme-accent: #8b5cf6;
  --sisad-pdfme-accent-soft: rgba(139, 92, 246, 0.2);
}

`;

const ensureDesignerThemeStyles = () => {
  if (typeof document === 'undefined') return;
  if (document.getElementById(DESIGNER_THEME_STYLE_ID)) return;
  const styleNode = document.createElement('style');
  styleNode.id = DESIGNER_THEME_STYLE_ID;
  styleNode.textContent = DESIGNER_THEME_CSS;
  document.head.appendChild(styleNode);
};

type ViewportMode = 'manual' | 'fit-width' | 'fit-page' | 'actual-size' | 'auto';
type UploadedPdfDocument = {
  id: string;
  name: string;
  template: Template;
  pageCount: number;
  updatedAt?: number;
};

const toDesignerCommentReplies = (value: unknown): SchemaCommentReply[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((reply) => asRecord(reply))
    .filter((reply): reply is Record<string, unknown> => Boolean(reply))
    .map((reply) => ({
      id: String(reply.id || reply.commentId || '').trim(),
      text: String(reply.text || reply.content || '').trim(),
      authorId: typeof reply.authorId === 'string' ? reply.authorId : undefined,
      authorName: typeof reply.authorName === 'string' ? reply.authorName : undefined,
      authorColor: typeof reply.authorColor === 'string' ? reply.authorColor : null,
      timestamp: typeof reply.timestamp === 'number' ? reply.timestamp : undefined,
      createdAt: typeof reply.createdAt === 'number' ? reply.createdAt : undefined,
      resolved: typeof reply.resolved === 'boolean' ? reply.resolved : undefined,
    }));
};

type TemplateChangeContext = {
  documentId?: string | null;
  fileId?: string | null;
  pageCount?: number;
  source?: string;
  updatedAt?: number;
};

type SchemaDragSession = {
  pointer: { x: number; y: number };
  dropPointMm: { x: number; y: number } | null;
  pageIndex: number;
  isOverCanvas: boolean;
  isOverPage: boolean;
  dropValid: boolean;
  schema: Schema;
  type: string;
  label: string;
  ownerColor?: string | null;
  sizePreview: { width: number; height: number };
};

type SchemaCommentMetadata = SchemaForUI & {
  commentsCount?: number;
  comments?: Array<{ id: string; [key: string]: unknown }>;
  commentAnchors?: Array<{ id: string; [key: string]: unknown }>;
};

type SchemaDragSourceData = {
  schema?: Schema;
  type?: string;
};

type SchemaDragActiveLike =
  | {
      data?: {
        current?: SchemaDragSourceData | Schema | null;
      };
    }
  | null
  | undefined;

type CreateCommentEventDetail =
  | {
      coordinateSpace: 'client';
      clientX: number;
      clientY: number;
      pageIndex?: number;
      pageNumber?: number;
      schemaUid?: string;
      fileId?: string | null;
      targetIds?: string[];
    }
  | {
      coordinateSpace: 'page-mm';
      xMm: number;
      yMm: number;
      pageIndex: number;
      pageNumber: number;
      schemaUid?: string;
      fileId?: string | null;
      targetIds?: string[];
    }
  | {
      x?: number;
      y?: number;
      page?: number;
      pageIndex?: number;
      pageNumber?: number;
      schemaUid?: string;
      fileId?: string | null;
      targetIds?: string[];
    };

type CommentAnchorDraft = {
  xMm: number;
  yMm: number;
  pageIndex: number;
  pageNumber: number;
  fileId: string | null;
  schemaUid?: string;
};

type TopLevelCommentEntry = Parameters<typeof upsertTopLevelComment>[1];

const normalizeTemplateSchemaPages = (
  sourceTemplate: Template,
  targetPageCount: number,
): Template => {
  const safePageCount = Math.max(1, Number(targetPageCount) || sourceTemplate?.schemas?.length || 1);
  const currentSchemas = Array.isArray(sourceTemplate?.schemas) ? sourceTemplate.schemas : [[]];
  const nextSchemas = currentSchemas.slice(0, safePageCount).map((page) => (Array.isArray(page) ? page : []));
  while (nextSchemas.length < safePageCount) {
    nextSchemas.push([]);
  }
  return {
    ...sourceTemplate,
    schemas: nextSchemas.map((page) =>
      page.map((schema) => {
        const commentSchema = schema as SchemaCommentMetadata;
        return {
          ...schema,
          commentsCount: typeof commentSchema.commentsCount === 'number' ? commentSchema.commentsCount : 0,
          comments: Array.isArray(commentSchema.comments) ? commentSchema.comments : [],
          commentAnchors: Array.isArray(commentSchema.commentAnchors) ? commentSchema.commentAnchors : [],
        };
      }),
    ),
  };
};

const PAGE_COMMENT_SCHEMA_PREFIX = '__page-comment__:';

const buildTopLevelCommentSchemaId = (fileId?: string | null, pageNumber?: number) =>
  `${PAGE_COMMENT_SCHEMA_PREFIX}${String(fileId || 'document')}:${Number(pageNumber) || 1}`;

const isTopLevelCommentSchemaId = (schemaId?: string) =>
  typeof schemaId === 'string' && schemaId.startsWith(PAGE_COMMENT_SCHEMA_PREFIX);

const applyTopLevelCommentEventToTemplate = (
  template: Template,
  event: Parameters<typeof applyCollaborationEvent>[1],
): Template => {
  if (!('type' in event) || !event.type.startsWith('comment.')) return template;
  if (!('schemaId' in event) || !isTopLevelCommentSchemaId(event.schemaId)) return template;

  const nextTemplate = { ...template } as Template;

  if (event.type === 'comment.deleted') {
    return removeTopLevelComment(nextTemplate, event.commentId);
  }

  const commentEvent = event as Extract<Parameters<typeof applyCollaborationEvent>[1], { type: 'comment.created' | 'comment.updated' }>;
  const anchor = ensureAnchorId(commentEvent.anchor || commentEvent.comment?.anchor || undefined) as TopLevelCommentEntry['anchor'];
  const comment = ensureComment(commentEvent.comment || commentEvent) as TopLevelCommentEntry['comment'];
  const topLevelEntry: TopLevelCommentEntry = {
    id: comment.id,
    anchor,
    comment,
  };
  return upsertTopLevelComment(nextTemplate, topLevelEntry);
};

const getBasePdfDisplayName = (basePdf: Template['basePdf']): string | null => {
  if (typeof basePdf !== 'string') return null;
  const source = basePdf.trim();
  if (!source) return null;

  try {
    const [withoutQuery] = source.split(/[?#]/);
    const segments = withoutQuery.split('/').filter(Boolean);
    const lastSegment = segments.length > 0 ? segments[segments.length - 1] : withoutQuery;
    return decodeURIComponent(lastSegment) || source;
  } catch {
    return source;
  }
};

const normalizeViewportMode = (mode: unknown): ViewportMode => {
  if (
    mode === 'fit-width' ||
    mode === 'fit-page' ||
    mode === 'actual-size' ||
    mode === 'auto' ||
    mode === 'manual'
  ) {
    return mode;
  }
  return 'manual';
};

const cloneSchemasListShallow = (schemasList: SchemaForUI[][]) => schemasList.slice();

const replacePageSchemas = (
  schemasList: SchemaForUI[][],
  pageIndex: number,
  nextPageSchemas: SchemaForUI[],
) => {
  const next = cloneSchemasListShallow(schemasList);
  next[pageIndex] = nextPageSchemas;
  return next;
};

const insertPageSchemas = (schemasList: SchemaForUI[][], pageIndex: number, pageSchemas: SchemaForUI[] = []) => {
  const next = cloneSchemasListShallow(schemasList);
  next.splice(pageIndex, 0, pageSchemas);
  return next;
};

const removePageSchemas = (schemasList: SchemaForUI[][], pageIndex: number) => {
  const next = cloneSchemasListShallow(schemasList);
  next.splice(pageIndex, 1);
  return next;
};

const isValidZoom = (zoom: unknown): zoom is number =>
  typeof zoom === 'number' && Number.isFinite(zoom);

const resolveSidebarPresentation = (
  requested: unknown,
  viewportWidth: number,
  responsiveBreakpoint: number,
): DesignerSidebarPresentation => {
  if (requested === 'overlay' || requested === 'docked') return requested;
  return viewportWidth <= responsiveBreakpoint ? 'overlay' : 'docked';
};

const DetachedHost = ({
  baseClass,
  detachedClassName = '',
  children,
}: {
  baseClass: string;
  detachedClassName?: string;
  children: React.ReactNode;
}) => (
  <div
    className={[`${DESIGNER_CLASSNAME}${baseClass}`, `${DESIGNER_CLASSNAME}${baseClass}-detached`, detachedClassName]
      .filter(Boolean)
      .join(' ')}
  >
    {children}
  </div>
);

/**
 * Resuelve los IDs de los schemas que han cambiado entre dos snapshots.
 */
function resolveChangedSchemaUids(before: SchemaForUI[], after: SchemaForUI[]): string[] {
  const changed = new Set<string>();
  const beforeMap = new Map((before || []).map((s) => [s.id, s]));
  const afterMap = new Map((after || []).map((s) => [s.id, s]));

  for (const s of after) {
    const prev = beforeMap.get(s.id);
    if (!prev || JSON.stringify(prev) !== JSON.stringify(s)) {
      changed.add(s.id);
    }
  }
  for (const s of before) {
    if (!afterMap.has(s.id)) {
      changed.add(s.id);
    }
  }
  return Array.from(changed);
}

const TemplateEditor = ({
  template,
  size,
  onSaveTemplate,
  onChangeTemplate,
  onPageCursorChange,
  onApiReady,
  catalogLayout,
  onCatalogLayoutChange,
}: Omit<DesignerProps, 'domContainer'> & {
  size: Size;
  onSaveTemplate: (t: Template) => void;
  onChangeTemplate: (t: Template, context?: TemplateChangeContext) => void;
  onApiReady?: (api: DesignerRuntimeApi | null) => void;
  catalogLayout?: 'list' | 'tiles' | 'icons';
  onCatalogLayoutChange?: (layout: 'list' | 'tiles' | 'icons') => void;
} & {
  onChangeTemplate: (t: Template, context?: TemplateChangeContext) => void;
  onPageCursorChange: (newPageCursor: number, totalPages: number) => void; // NOSONAR
}) => { // NOSONAR
  const commandBusRef = useRef(new CommandBus());
  const canvasRef = useRef<HTMLDivElement>(null);
  const { paperRefs, registerPaperRef } = usePaperRefRegistry();
  const pdfUploadInputRef = useRef<HTMLInputElement>(null);
  const internalTemplateSyncRef = useRef(false);
  const pendingCollaborativeTemplateRef = useRef<Template | null>(null);
  const previousCollaborativeSchemasRef = useRef<SchemaForUI[][] | null>(null);
  const applyingRemoteCollaborationRef = useRef(false);
  const lockedSelectionSchemaIdsRef = useRef<string[]>([]);
  const documentSchemasCacheRef = useRef<Map<string, SchemaForUI[][]>>(new Map());
  const schemasListRef = useRef<SchemaForUI[][]>([]);
  const activeBasePdfRef = useRef(template.basePdf);
  const visibleTemplateRef = useRef<Template>(template);
  const uploadedDocumentsRef = useRef<UploadedPdfDocument[]>([]);
  const lastCommittedSchemasHashRef = useRef<string>('');
  const lastPersistedDocumentBasePdfRef = useRef<Template['basePdf']>(template.basePdf);
  const canvasDocumentIdRef = useRef<string | null>(null);
  const schemaClipboardRef = useRef<SchemaClipboardPayload | null>(null);
  const pendingCanvasDocumentIdRef = useRef<string | null>(null);
  const loadDocumentRequestRef = useRef(0);
  // Last valid pointer over a page (mm), used as the rigid-group paste anchor.
  const lastCanvasPointerRef = useRef<{
    pageIndex: number;
    pageNumber: number;
    pointMm: { x: number; y: number };
    clientX: number;
    clientY: number;
    timestamp: number;
  } | null>(null);
  // Schema ids waiting to be re-selected once they render after a paste/duplicate.
  const pendingSelectionIdsRef = useRef<string[] | null>(null);

  const resolveStableDocumentBasePdf = useCallback((documentId: string | null) => {
    const documentTemplate = uploadedDocumentsRef.current.find((doc) => doc.id === documentId)?.template || null;
    const documentBasePdf = documentTemplate?.basePdf;
    if (isValidRealBasePdf(documentBasePdf)) return documentBasePdf;

    const visibleBasePdf = visibleTemplateRef.current?.basePdf;
    if (isValidRealBasePdf(visibleBasePdf)) return visibleBasePdf;

    const persistedBasePdf = lastPersistedDocumentBasePdfRef.current;
    if (isValidRealBasePdf(persistedBasePdf)) return persistedBasePdf;

    const refBasePdf = activeBasePdfRef.current;
    if (isValidRealBasePdf(refBasePdf)) return refBasePdf;

    return documentBasePdf || visibleBasePdf || refBasePdf;
  }, []);

  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  // `options` es transporte de runtime, no configuración: entregarlo entero al
  // ConfigService rompía el montaje al clonarlo (ver configFromRuntimeOptions).
  const configFromOptions = useMemo(() => configFromRuntimeOptions(options), [options]);
  const resolvedConfig = useSisadPdfmeConfig(configFromOptions);
  const designerEngine = useMemo(
    () => resolveDesignerEngine(options as Record<string, unknown>),
    [options],
  );
  const designerEvents = designerEngine.extensions?.events;
  const emitDesignerEvent = useCallback(
    (event: Parameters<typeof emitDesignerRuntimeEvent>[1]) => {
      emitDesignerRuntimeEvent(designerEvents, event);
    },
    [designerEvents],
  );
  const LeftSidebar = designerEngine.renderers?.leftSidebar || LeftSidebarDefault;
  const RightSidebar = designerEngine.renderers?.rightSidebar || RightSidebarDefault;
  const leftSidebarEngine = designerEngine.sidebars?.left;
  const rightSidebarEngine = designerEngine.sidebars?.right;
  const maxZoom = useMaxZoom();
  const leftSidebarVariant = options.leftSidebarVariant === 'panel' ? 'panel' : 'compact';
  const leftSidebarVisible = options.leftSidebarVisible !== false;
  const leftSidebarShowItemMeta = options.leftSidebarShowItemMeta !== false;
  const leftSidebarShowItemDescription = options.leftSidebarShowItemDescription !== false;
  const leftSidebarShowTechnicalLabels = options.leftSidebarShowTechnicalLabels !== false;
  const leftSidebarShowCatalogViewSwitcher = options.leftSidebarShowCatalogViewSwitcher !== false;
  const leftSidebarUseLayout = Boolean(options.leftSidebarUseLayout);
  const leftSidebarSearchable = options.leftSidebarSearchable !== false;
  const leftSidebarDetached = options.leftSidebarDetached === true;
  const leftSidebarReserveSpace = options.leftSidebarReserveSpace === true;
  const leftSidebarContainerSelector =
    typeof options.leftSidebarContainerSelector === 'string' ? options.leftSidebarContainerSelector : '';
  const leftSidebarDetachedClassName =
    typeof options.leftSidebarDetachedClassName === 'string' ? options.leftSidebarDetachedClassName : '';
  const rightSidebarDetached = options.rightSidebarDetached === true;
  const rightSidebarReserveSpace = options.rightSidebarReserveSpace === true;
  const rightSidebarUseLayout = Boolean(options.rightSidebarUseLayout);
  const rightSidebarContainerSelector =
    typeof options.rightSidebarContainerSelector === 'string' ? options.rightSidebarContainerSelector : '';
  const rightSidebarDetachedClassName =
    typeof options.rightSidebarDetachedClassName === 'string' ? options.rightSidebarDetachedClassName : '';
  /**
   * `options` es un objeto zod `passthrough`, así que las claves no declaradas
   * llegan tipadas como `unknown`. Estas medidas admiten número (px) o cadena
   * CSS; cualquier otra cosa se descarta.
   */
  const toCssLength = (value: unknown): string | undefined => {
    if (typeof value === 'number') return `${value}px`;
    if (typeof value === 'string') return value;
    return undefined;
  };
  const workspaceGap = toCssLength(options.gap);
  const canvasPadding = toCssLength(options.padding);

  const density = typeof options.density === 'string' ? options.density : 'comfortable';
  const layoutPreset =
    typeof options.layoutPreset === 'string' ? options.layoutPreset : 'three-panel';
  const parsedRightSidebarWidth = Number(options.rightSidebarWidth);
  const rightSidebarWidthRaw =
    Number.isFinite(parsedRightSidebarWidth) && parsedRightSidebarWidth > 0
      ? parsedRightSidebarWidth
      : density === 'compact' ? 280 : density === 'minimal' ? 240 : RIGHT_SIDEBAR_WIDTH;
  const viewportWidth =
    Number.isFinite(size.width) && size.width > 0
      ? size.width
      : typeof window !== 'undefined'
        ? window.innerWidth
        : 1280;
  const leftSidebarResponsiveBreakpoint = Number(
    leftSidebarEngine?.responsiveBreakpoint ?? (options as Record<string, unknown>).leftSidebarResponsiveBreakpoint ?? 1080,
  );
  const rightSidebarResponsiveBreakpoint = Number(
    rightSidebarEngine?.responsiveBreakpoint ?? (options as Record<string, unknown>).rightSidebarResponsiveBreakpoint ?? 1080,
  );
  const leftSidebarPresentation = resolveSidebarPresentation(
    leftSidebarEngine?.presentation ?? (options as Record<string, unknown>).leftSidebarPresentation ?? 'auto',
    viewportWidth,
    Number.isFinite(leftSidebarResponsiveBreakpoint) ? leftSidebarResponsiveBreakpoint : 1080,
  );
  const rightSidebarPresentation = resolveSidebarPresentation(
    rightSidebarEngine?.presentation ?? (options as Record<string, unknown>).rightSidebarPresentation ?? 'auto',
    viewportWidth,
    Number.isFinite(rightSidebarResponsiveBreakpoint) ? rightSidebarResponsiveBreakpoint : 1080,
  );
  const responsiveRightSidebarWidthRaw = Math.max(
    220,
    Math.min(rightSidebarWidthRaw, Math.floor(viewportWidth * (viewportWidth <= 768 ? 0.86 : 0.42))),
  );
  const compactRightSidebarWidthRaw = Math.max(
    240,
    Math.min(Math.floor(viewportWidth * 0.175), 276),
  );
  const effectiveRightSidebarWidthRaw =
    leftSidebarVariant === 'compact'
      ? compactRightSidebarWidthRaw
      : responsiveRightSidebarWidthRaw;
  // Canvas-first baseline: sidebars overlay the stage unless reserveSpace is explicitly enabled.
  const shouldReserveRightSidebarSpace =
    rightSidebarReserveSpace === true && rightSidebarPresentation === 'docked';
  const rightSidebarWidth = shouldReserveRightSidebarSpace ? effectiveRightSidebarWidthRaw : 0;
  const parsedLeftSidebarWidth = Number(options.leftSidebarWidth);
  const defaultSidebarWidth = leftSidebarVariant === 'panel'
    ? (density === 'compact' ? 200 : density === 'minimal' ? 180 : 240)
    : LEFT_SIDEBAR_WIDTH;
  const leftSidebarWidthRawBase =
    leftSidebarVisible && Number.isFinite(parsedLeftSidebarWidth) && parsedLeftSidebarWidth > 0
      ? parsedLeftSidebarWidth
      : leftSidebarVisible
        ? defaultSidebarWidth
        : 0;
  const leftSidebarUsesExpandedLayout = leftSidebarVariant === 'panel' || leftSidebarUseLayout;
  const leftSidebarMinWidth = leftSidebarUsesExpandedLayout ? (density === 'compact' ? 180 : density === 'minimal' ? 160 : 220) : 42;
  const leftSidebarViewportLimit = Math.max(
    leftSidebarMinWidth,
    Math.floor(viewportWidth * (viewportWidth <= 768 ? 0.86 : leftSidebarUsesExpandedLayout ? 0.34 : 0.12)),
  );
  const responsiveLeftSidebarWidthRaw = Math.max(
    leftSidebarMinWidth,
    Math.min(leftSidebarWidthRawBase, leftSidebarViewportLimit),
  );
  const [leftSidebarLiveWidth, setLeftSidebarLiveWidth] = useState(
    leftSidebarVisible && leftSidebarPresentation === 'docked' ? responsiveLeftSidebarWidthRaw : 0,
  );
  const leftSidebarExpandedWidthRef = useRef(
    leftSidebarVisible && leftSidebarPresentation === 'docked' ? responsiveLeftSidebarWidthRaw : 0,
  );
  const shouldReserveLeftSidebarSpace =
    leftSidebarVisible &&
    leftSidebarReserveSpace === true &&
    leftSidebarPresentation === 'docked';
  const leftSidebarWidth = shouldReserveLeftSidebarSpace ? leftSidebarLiveWidth : 0;
  useEffect(() => {
    if (!shouldReserveLeftSidebarSpace) return;
    if (leftSidebarLiveWidth > 96) {
      leftSidebarExpandedWidthRef.current = leftSidebarLiveWidth;
    }
  }, [leftSidebarLiveWidth, shouldReserveLeftSidebarSpace]);
  // The stage already reserves the sidebar column; adding a paper translation
  // here creates a visible drift when the sidebar collapses. Keep the paper
  // anchored to the stage viewport and let the grid recompute the free space.
  const leftSidebarContentOffsetX = 0;

  const [hoveringSchemaId, setHoveringSchemaId] = useState<string | null>(null);
  const [activeElements, setActiveElements] = useState<HTMLElement[]>([]);
  const activeElementIds = useMemo(
    () => {
      const ids: string[] = [];
      const seen = new Set<string>();
      for (const element of activeElements) {
        if (!element) continue;
        const identity = resolveSchemaIdentityFromElement(element);
        const candidates = [identity.schemaId, identity.schemaUid].filter(Boolean) as string[];
        for (const id of candidates) {
          if (seen.has(id)) continue;
          seen.add(id);
          ids.push(id);
        }
      }
      return ids;
    },
    [activeElements],
  );
  const [interactionState, setInteractionState] = useState<InteractionState>({
    phase: 'idle',
    selectionCount: 0,
    hasSelection: false,
    isHovering: false,
    isDragging: false,
    isResizing: false,
    isRotating: false,
  });
  const handleInteractionStateChange = useCallback((next: InteractionState) => {
    setInteractionState((prev) => {
      if (
        prev.phase === next.phase &&
        prev.selectionCount === next.selectionCount &&
        prev.hasSelection === next.hasSelection &&
        prev.isHovering === next.isHovering &&
        prev.isDragging === next.isDragging &&
        prev.isResizing === next.isResizing &&
        prev.isRotating === next.isRotating
      ) {
        return prev;
      }
      return next;
    });
  }, []);
  const [visibleTemplate, setVisibleTemplate] = useState<Template>(() => template);
  const [schemasList, setSchemasList] = useState<SchemaForUI[][]>([[]] as SchemaForUI[][]);
  const [pageCursor, setPageCursor] = useState(0);
  const pageCursorRef = useRef(0);
  const [zoomLevel, setZoomLevel] = useState(options.zoomLevel ?? 1);
  const [sidebarOpen, setSidebarOpen] = useState(options.sidebarOpen ?? true);
  const [viewportMode, setViewportMode] = useState<ViewportMode>(() =>
    normalizeViewportMode(options.viewportMode ?? options.initialViewportMode),
  );
  const [canvasFeatureOverrides, setCanvasFeatureOverrides] = useState<Partial<CanvasFeatureToggles>>({});
  const canvasFeatureToggles = useMemo<CanvasFeatureToggles>(
    () => ({
      selecto:
        canvasFeatureOverrides.selecto ??
        resolvedConfig.config.canvas.selecto ??
        designerEngine.canvas?.featureToggles?.selecto ??
        true,
      snapLines:
        canvasFeatureOverrides.snapLines ??
        resolvedConfig.config.canvas.snapLines ??
        designerEngine.canvas?.featureToggles?.snapLines ??
        true,
      grid: canvasFeatureOverrides.grid ?? designerEngine.canvas?.featureToggles?.grid ?? true,
      guides:
        canvasFeatureOverrides.guides ??
        resolvedConfig.config.canvas.guides ??
        designerEngine.canvas?.featureToggles?.guides ??
        true,
      padding: canvasFeatureOverrides.padding ?? designerEngine.canvas?.featureToggles?.padding ?? true,
      mask: canvasFeatureOverrides.mask ?? designerEngine.canvas?.featureToggles?.mask ?? true,
      moveable:
        canvasFeatureOverrides.moveable ??
        resolvedConfig.config.canvas.moveable ??
        designerEngine.canvas?.featureToggles?.moveable ??
        true,
      deleteButton: canvasFeatureOverrides.deleteButton ?? designerEngine.canvas?.featureToggles?.deleteButton ?? true,
    }),
    [
      canvasFeatureOverrides.deleteButton,
      canvasFeatureOverrides.grid,
      canvasFeatureOverrides.guides,
      canvasFeatureOverrides.mask,
      canvasFeatureOverrides.moveable,
      canvasFeatureOverrides.padding,
      canvasFeatureOverrides.selecto,
      canvasFeatureOverrides.snapLines,
      resolvedConfig.config.canvas.guides,
      resolvedConfig.config.canvas.moveable,
      resolvedConfig.config.canvas.selecto,
      resolvedConfig.config.canvas.snapLines,
      designerEngine.canvas?.featureToggles?.deleteButton,
      designerEngine.canvas?.featureToggles?.grid,
      designerEngine.canvas?.featureToggles?.guides,
      designerEngine.canvas?.featureToggles?.mask,
      designerEngine.canvas?.featureToggles?.moveable,
      designerEngine.canvas?.featureToggles?.padding,
      designerEngine.canvas?.featureToggles?.selecto,
      designerEngine.canvas?.featureToggles?.snapLines,
    ],
  );
  const [isSchemaDragging, setIsSchemaDragging] = useState(false);
  const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState(false);
  const [isDraggingOverPage, setIsDraggingOverPage] = useState(false);
  const [dropValid, setDropValid] = useState(false);
  const [activeDragData, setActiveDragData] = useState<SchemaDragSession | null>(null);
  const activeDragDataRef = useRef<SchemaDragSession | null>(null);
  const schemaDragStartPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastDragPointerRef = useRef<{ x: number; y: number } | null>(null);
  const designerRootRef = useRef<HTMLDivElement | null>(null);
  const sidebarScrollLockRef = useRef<ReturnType<typeof lockDesignerSidebarScroll> | null>(null);
  const [dropCommitFlash, setDropCommitFlash] = useState<{
    pageIndex: number;
    point: { x: number; y: number };
    ownerColor?: string | null;
    iconType: string;
  } | null>(null);
  const dropCommitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isIdle, setIsIdle] = useState<boolean | undefined>(undefined);
  // Estado de persistencia global para la topbar. Deriva del callback de guardado
  // existente (no crea otra fuente de estado del template): `idle` inicial,
  // `dirty` en cada edición local, `saving`/`saved`/`error` alrededor de onSave.
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  const areActiveElementsEqual = useCallback((left: HTMLElement[], right: HTMLElement[]) => {
    return left.length === right.length && left.every((element, index) => element?.id === right[index]?.id);
  }, []);

  useEffect(() => {
    pageCursorRef.current = pageCursor;
  }, [pageCursor]);
  const optionsBridge = options as DesignerOptionsBridge;
  const uploadedDocumentsOption = optionsBridge.uploadedDocuments;
  const activeDocumentIdOption = optionsBridge.activeDocumentId;
  const catalogLayoutOption = catalogLayout ?? optionsBridge.catalogLayout ?? 'list';
  const onCatalogLayoutChangeOption = onCatalogLayoutChange ?? optionsBridge.onCatalogLayoutChange ?? null;
  const rightSidebarViewModeOption = optionsBridge.rightSidebarViewMode;
  const onRightSidebarViewModeChangeOption = optionsBridge.onRightSidebarViewModeChange;
  const uploadedDocumentsSeed = useMemo<UploadedPdfDocument[]>(
    () => (Array.isArray(uploadedDocumentsOption) ? (uploadedDocumentsOption as UploadedPdfDocument[]) : []),
    [uploadedDocumentsOption],
  );
  const initialActiveDocumentId = useMemo<string | null>(() => {
    const optionActiveId = typeof activeDocumentIdOption === 'string'
      ? String(activeDocumentIdOption)
      : null;
    if (optionActiveId) return optionActiveId;
    return uploadedDocumentsSeed[0]?.id || null;
  }, [activeDocumentIdOption, uploadedDocumentsSeed]);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedPdfDocument[]>(
    () => uploadedDocumentsSeed.map((doc) => ({ ...doc })),
  );
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(
    () => initialActiveDocumentId,
  );
  const collaborationContext = useMemo(
    () => buildEffectiveCollaborationContext(designerEngine.collaboration, activeDocumentId || null),
    [activeDocumentId, designerEngine.collaboration],
  );
  const [rightSidebarViewMode, setRightSidebarViewMode] = useState<'auto' | 'fields' | 'detail' | 'docs' | 'comments'>('auto');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openPropertiesPanel = useCallback(() => {
    setSidebarOpen(true);
    setRightSidebarViewMode('detail');
  }, []);
  const openCommentsPanel = useCallback((commentId?: string | null) => {
    setSidebarOpen(true);
    setRightSidebarViewMode('comments');
    setActiveCommentId(commentId || null);
  }, []);

  useEffect(() => {
    setUploadedDocuments((prev) => {
      const previousById = new Map(prev.map((doc) => [doc.id, doc]));
      const next = uploadedDocumentsSeed.map((doc) => {
        const previous = previousById.get(doc.id);
        if (!previous) return { ...doc };
        const previousUpdatedAt = Number(previous.updatedAt || 0);
        const incomingUpdatedAt = Number(doc.updatedAt || 0);
        if (previousUpdatedAt > incomingUpdatedAt) {
          return {
            ...doc,
            template: previous.template,
            pageCount: previous.pageCount,
            updatedAt: previous.updatedAt,
          };
        }
        return {
          ...previous,
          ...doc,
          template: doc.template || previous.template,
          pageCount: Math.max(1, Number(doc.pageCount || previous.pageCount || 1)),
          updatedAt: incomingUpdatedAt || previousUpdatedAt || undefined,
        };
      });
      if (
        prev.length === next.length &&
        prev.every((doc, index) =>
          doc.id === next[index]?.id &&
          doc.name === next[index]?.name &&
          doc.pageCount === next[index]?.pageCount &&
          doc.template === next[index]?.template &&
          doc.updatedAt === next[index]?.updatedAt
        )
      ) {
        return prev;
      }
      return next;
    });
  }, [uploadedDocumentsSeed]);

  useEffect(() => {
    const optionActiveId = typeof activeDocumentIdOption === 'string'
      ? String(activeDocumentIdOption)
      : null;
    if (!optionActiveId) return;
    setActiveDocumentId(optionActiveId);
  }, [activeDocumentIdOption]);

  useEffect(() => {
    const handler = optionsBridge.onUploadedDocumentsChange;
    if (typeof handler !== 'function') return;
    handler(
      uploadedDocuments.map((doc) => ({ ...doc })),
      activeDocumentId || null,
    );
  }, [activeDocumentId, optionsBridge, uploadedDocuments]);

  useEffect(() => {
    if (
      rightSidebarViewModeOption !== 'auto' &&
      rightSidebarViewModeOption !== 'fields' &&
      rightSidebarViewModeOption !== 'detail' &&
      rightSidebarViewModeOption !== 'docs' &&
      rightSidebarViewModeOption !== 'comments'
    ) {
      return;
    }
    setRightSidebarViewMode(rightSidebarViewModeOption);
  }, [rightSidebarViewModeOption]);

  useEffect(() => {
    if (typeof onRightSidebarViewModeChangeOption !== 'function') return;
    onRightSidebarViewModeChangeOption(rightSidebarViewMode);
  }, [onRightSidebarViewModeChangeOption, rightSidebarViewMode]);

  useEffect(() => {
    setActiveDocumentId((prev) =>
      uploadedDocumentsSeed.some((doc) => doc.id === prev)
        ? prev
        : initialActiveDocumentId,
    );
  }, [initialActiveDocumentId, uploadedDocumentsSeed]);

  // Wix-inspired idle detection: after 4s of no interaction, mark UI as idle to reduce chrome
  useEffect(() => {
    const IDLE_DELAY = 4000;
    const resetIdle = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIsIdle(true), IDLE_DELAY);
    };
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'];
    events.forEach((e) => document.addEventListener(e, resetIdle, { passive: true }));
    resetIdle();
    return () => {
      events.forEach((e) => document.removeEventListener(e, resetIdle));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Register CommandBus guard for Access Control
  useEffect(() => {
    const bus = commandBusRef.current;
    if (!bus) return;

    const accessGuard = (command: Parameters<CommandBus['check']>[0]) => {
      // 1. Identify schemas targetted by command
      const meta = command.meta;
      const targetUids = Array.isArray(meta?.schemaUids)
        ? meta.schemaUids.filter((schemaUid): schemaUid is string => typeof schemaUid === 'string' && schemaUid.trim().length > 0)
        : typeof meta?.schemaUid === 'string' && meta.schemaUid.trim().length > 0
          ? [meta.schemaUid]
          : [];

      if (targetUids.length === 0) return true;

      // 2. Resolve access state for targets
      const accessCtx: SchemaAccessContext = {
        activeActorId: collaborationContext.actorId || undefined,
        collaborationContext: {
          isCollaborative: true,
          userId: collaborationContext.actorId || 'local',
          canEditStructure: collaborationContext.canEditStructure,
        },
        canEditStructure: collaborationContext.canEditStructure,
      };

      for (const uid of targetUids) {
        // Buscamos el schema en la lista actual (referencia reactiva)
        const schema = schemasList.flat().find((s) => s.id === uid);
        if (!schema) continue;

        const accessState = resolveDesignerSchemaAccessState(schema, accessCtx);
        if (!canRunSchemaCommand(command.id, accessState)) {
          console.warn(`[CommandBus] Access denied for command "${command.id}" on schema ${uid}`);
          return false;
        }
      }

      return true;
    };

    return bus.addGuard(accessGuard);
  }, [collaborationContext, schemasList]);

  useEffect(() => {
    ensureDesignerThemeStyles();
  }, []);

  const activeBasePdf = visibleTemplate.basePdf;

  useEffect(() => {
    schemasListRef.current = schemasList;
  }, [schemasList]);

  useEffect(() => {
    activeBasePdfRef.current = activeBasePdf;
  }, [activeBasePdf]);

  useEffect(() => {
    visibleTemplateRef.current = visibleTemplate;
  }, [visibleTemplate]);

  useEffect(() => {
    uploadedDocumentsRef.current = uploadedDocuments;
  }, [uploadedDocuments]);
  const currentPageSchemas = useMemo(
    () => schemasList[pageCursor] || [],
    [pageCursor, schemasList],
  );
  const visibleSchemasList = useMemo(
    () => schemasList.map((pageSchemas) => filterSchemasForCollaborationView(pageSchemas, collaborationContext)),
    [collaborationContext, schemasList],
  );
  const visiblePageSchemas = useMemo(
    () => visibleSchemasList[pageCursor] || [],
    [pageCursor, visibleSchemasList],
  );
  const visiblePageSchemaIdSet = useMemo(
    () => new Set(visiblePageSchemas.map((schema) => schema.id)),
    [visiblePageSchemas],
  );
  // Global (all pages) id set so re-anchoring never drops a selection that
  // lives on a page other than pageCursor (multi-page regression guard).
  const visibleSchemaIdSet = useMemo(
    () => new Set(visibleSchemasList.flat().map((schema) => schema.id)),
    [visibleSchemasList],
  );

  useEffect(() => {
    if (!activeElements.length) return;

    const selector = (id: string) =>
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? `[data-schema-id="${CSS.escape(id)}"]`
        : `[data-schema-id="${id.replace(/"/g, '\\"')}"]`;

    const findFreshElement = (element: HTMLElement): HTMLElement | null => {
      // Re-anchor against the element's OWN page paper, not pageCursor's, so a
      // selection on page 2+ survives re-renders. Fall back to scanning every
      // visible paper before giving up.
      const parsedPageIndex = Number(element.dataset.pageIndex);
      const ownPaper =
        Number.isInteger(parsedPageIndex) && parsedPageIndex >= 0
          ? paperRefs.current[parsedPageIndex]
          : null;
      const sel = selector(resolveSchemaIdentityFromElement(element).schemaId || element.id);
      const fromOwnPaper = ownPaper?.querySelector<HTMLElement>(sel) || null;
      if (fromOwnPaper) return fromOwnPaper;
      for (const paper of paperRefs.current) {
        const candidate = paper?.querySelector<HTMLElement>(sel) || null;
        if (candidate) return candidate;
      }
      return null;
    };

    const nextActive: HTMLElement[] = [];
    for (const element of activeElements) {
      const nextElement = findFreshElement(element);
      if (!nextElement) continue;
      if (!nextElement.classList.contains(SELECTABLE_CLASSNAME)) continue;
      if (!visibleSchemaIdSet.has(nextElement.id)) continue;
      nextActive.push(nextElement);
    }

    const hasChanged =
      nextActive.length !== activeElements.length ||
      nextActive.some((element, index) => element !== activeElements[index]);

    if (!hasChanged) return;
    setActiveElements(nextActive);

    if (nextActive.length === 0) {
      setHoveringSchemaId(null);
    }
  }, [activeElements, paperRefs, schemasList, visibleSchemaIdSet]);

  // Follow the selection's page: when the active schema(s) live on a single
  // page other than pageCursor, move the cursor there so Moveable (rendered
  // only on the cursor page) and page-scoped resolvers target the right page.
  useEffect(() => {
    if (!activeElements.length) return;
    const pageIndexes = new Set<number>();
    for (const element of activeElements) {
      const parsed = Number(element?.dataset.pageIndex);
      if (Number.isInteger(parsed) && parsed >= 0) pageIndexes.add(parsed);
    }
    if (pageIndexes.size !== 1) return;
    const [selectionPage] = [...pageIndexes];
    if (selectionPage === pageCursor) return;
    setPageCursor(selectionPage);
    pageCursorRef.current = selectionPage;
  }, [activeElements, pageCursor]);

  useEffect(() => {
    if (!hoveringSchemaId) return;
    if (visiblePageSchemaIdSet.has(hoveringSchemaId)) return;
    setHoveringSchemaId(null);
  }, [hoveringSchemaId, visiblePageSchemaIdSet]);

  const pushTemplateUpdate = useCallback(
    (nextTemplate: Template, context: TemplateChangeContext = {}) => {
      setVisibleTemplate(nextTemplate);
      visibleTemplateRef.current = nextTemplate;
      internalTemplateSyncRef.current = true;
      // Toda edición/notificación de cambio pasa por aquí: marca cambios sin
      // guardar sin pisar un guardado en curso (que resolverá a saved/error).
      setSaveStatus((prev) => (prev === 'saving' ? prev : 'dirty'));
      const documentId = context.documentId || activeDocumentId || canvasDocumentIdRef.current || null;
      onChangeTemplate(nextTemplate, {
        ...context,
        documentId,
        fileId: context.fileId || documentId,
        pageCount: context.pageCount || Math.max(1, nextTemplate.schemas?.length || 1),
        updatedAt: context.updatedAt || Date.now(),
      });
    },
    [activeDocumentId, onChangeTemplate],
  );
  // Guardar global: envuelve el callback de persistencia del host para exponer
  // los estados Guardando/Guardado/Error. Soporta callbacks síncronos y los que
  // devuelven una promesa; no introduce otra fuente de verdad del template.
  const handleSaveTemplate = useCallback(() => {
    setSaveStatus('saving');
    try {
      const result = (onSaveTemplate as (t: Template) => unknown)(visibleTemplateRef.current);
      if (result && typeof (result as { then?: unknown }).then === 'function') {
        (result as Promise<unknown>).then(
          () => setSaveStatus('saved'),
          () => setSaveStatus('error'),
        );
      } else {
        setSaveStatus('saved');
      }
    } catch {
      setSaveStatus('error');
    }
  }, [onSaveTemplate]);
  const handleCollaborationEvent = useCallback(
    (event: Parameters<typeof applyCollaborationEvent>[1]) => {
      if (isTopLevelCommentSchemaId('schemaId' in event ? event.schemaId : undefined)) {
        const nextTemplate = applyTopLevelCommentEventToTemplate(visibleTemplate, event);
        pushTemplateUpdate(nextTemplate);
        return;
      }

      setSchemasList((prev) => {
        const next = applyCollaborationEvent(prev, event);
        if (next !== prev) {
          applyingRemoteCollaborationRef.current = true;
          pendingCollaborativeTemplateRef.current = schemasList2template(next, activeBasePdf);
        }
        return next;
      });
    },
    [activeBasePdf, pushTemplateUpdate, visibleTemplate],
  );
  const collaborationSync = useCollaborationSync({
    enabled: Boolean(designerEngine.collaboration?.enabled),
    url: designerEngine.collaboration?.url,
    protocols: designerEngine.collaboration?.protocols,
    sessionId: designerEngine.collaboration?.sessionId || activeDocumentId || 'local',
    provider: designerEngine.collaboration?.provider,
    actorId: collaborationContext.actorId || designerEngine.collaboration?.actorId,
    actorColor: collaborationContext.actorColor || designerEngine.collaboration?.actorColor,
    users: collaborationContext.recipientOptions || designerEngine.collaboration?.users,
    reconnectMs: designerEngine.collaboration?.reconnectMs,
    onEvent: handleCollaborationEvent,
  });
  const applyCollaborationLocalChange = collaborationSync.applyLocalChange;
  const setCollaborationPresence = collaborationSync.setPresence;
  const collaborationHistoryLength = collaborationSync.history.length;

  useEffect(() => {
    if (!designerEngine.collaboration?.enabled) {
      previousCollaborativeSchemasRef.current = cloneDeep(schemasList);
      return;
    }
    if (!previousCollaborativeSchemasRef.current) {
      previousCollaborativeSchemasRef.current = cloneDeep(schemasList);
      if (collaborationHistoryLength === 0) {
        const seedEvents = diffCollaborationEvents([], schemasList, {
          actorId: collaborationContext.actorId || designerEngine.collaboration?.actorId,
          sessionId: designerEngine.collaboration?.sessionId || activeDocumentId || 'local',
          timestamp: Date.now(),
        });
        seedEvents.forEach((event) => applyCollaborationLocalChange(event));
      }
      return;
    }
    if (applyingRemoteCollaborationRef.current) {
      applyingRemoteCollaborationRef.current = false;
      previousCollaborativeSchemasRef.current = cloneDeep(schemasList);
      return;
    }

    const events = diffCollaborationEvents(previousCollaborativeSchemasRef.current, schemasList, {
      actorId: collaborationContext.actorId || designerEngine.collaboration?.actorId,
      sessionId: designerEngine.collaboration?.sessionId || activeDocumentId || 'local',
      timestamp: Date.now(),
    });
    if (events.length > 0) {
      events.forEach((event) => applyCollaborationLocalChange(event));
    }
    previousCollaborativeSchemasRef.current = cloneDeep(schemasList);
  }, [
    activeDocumentId,
    applyCollaborationLocalChange,
    collaborationHistoryLength,
    collaborationContext.actorId,
    designerEngine.collaboration?.actorId,
    designerEngine.collaboration?.enabled,
    designerEngine.collaboration?.sessionId,
    schemasList,
  ]);

  useEffect(() => {
    if (!designerEngine.collaboration?.enabled) return;
    setCollaborationPresence({
      userId: collaborationContext.actorId || designerEngine.collaboration?.actorId || 'local',
      name:
        collaborationContext.activeRecipient?.name ||
        collaborationContext.ownerRecipientName ||
        collaborationContext.actorId ||
        'local',
      color:
        collaborationContext.userColor ||
        collaborationContext.ownerColor ||
        designerEngine.collaboration?.actorColor ||
        null,
      activeDocumentId,
      activePage: pageCursor,
      activeSchemaIds: activeElementIds,
      interactionPhase: interactionState.phase,
    });
  }, [
    activeDocumentId,
    activeElementIds,
    collaborationContext.activeRecipient?.name,
    collaborationContext.actorId,
    collaborationContext.ownerColor,
    collaborationContext.ownerRecipientName,
    collaborationContext.userColor,
    designerEngine.collaboration?.actorColor,
    designerEngine.collaboration?.actorId,
    designerEngine.collaboration?.enabled,
    interactionState.phase,
    pageCursor,
    setCollaborationPresence,
  ]);

  const { backgrounds, pageSizes, scale, error } = useUIPreProcessor({
    template: visibleTemplate,
    size,
    zoomLevel,
    maxZoom,
  });

  // Comment dialog state and handlers
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const pendingAnchorRef = useRef<null | CommentAnchorDraft>(null);

  const normalizeCommentPageIndex = useCallback(
    (pageIndex?: number | null, pageNumber?: number | null, Page?: number | null) => {
      if (Number.isInteger(pageIndex) && (pageIndex as number) >= 0) return Math.trunc(pageIndex as number);
      if (Number.isInteger(pageNumber) && (pageNumber as number) > 0) return Math.trunc((pageNumber as number) - 1);
      if (Number.isInteger(Page) && (Page as number) >= 0) return Math.trunc(Page as number);
      return pageCursor;
    },
    [pageCursor],
  );

  const resolveCommentAnchorFromEvent = useCallback(
    (detail: CreateCommentEventDetail): CommentAnchorDraft | null => {
      const schemaUid = String(detail.schemaUid || '').trim() || (Array.isArray(detail.targetIds) ? String(detail.targetIds[0] || '').trim() : '');
      const fileId = typeof detail.fileId === 'string' && detail.fileId.trim()
        ? detail.fileId.trim()
        : activeDocumentId || null;

      const resolveFromPageMm = (xMmInput: number, yMmInput: number) => {
        const pageIndex = normalizeCommentPageIndex(
          'pageIndex' in detail ? detail.pageIndex : undefined,
          'pageNumber' in detail ? detail.pageNumber : undefined,
          'page' in detail ? detail.page : undefined,
        );
        const pageSize = pageSizes[pageIndex] || pageSizes[pageCursor] || null;
        const xMm = pageSize ? Math.min(Math.max(0, Number(xMmInput) || 0), Number(pageSize.width) || 0) : Math.max(0, Number(xMmInput) || 0);
        const yMm = pageSize ? Math.min(Math.max(0, Number(yMmInput) || 0), Number(pageSize.height) || 0) : Math.max(0, Number(yMmInput) || 0);
        const pageNumber = pageIndex >= 0 ? pageIndex + 1 : Number.isInteger(detail.pageNumber) ? Math.trunc(detail.pageNumber as number) : pageCursor + 1;
        return {
          xMm: Math.round(xMm * 100) / 100,
          yMm: Math.round(yMm * 100) / 100,
          pageIndex,
          pageNumber,
          fileId,
          schemaUid: schemaUid || undefined,
        } satisfies CommentAnchorDraft;
      };

      const isPageMmDetail =
        ('coordinateSpace' in detail && detail.coordinateSpace === 'page-mm') ||
        ('xMm' in detail && 'yMm' in detail);
      if (isPageMmDetail) {
        const pageMmDetail = detail as {
          xMm?: number;
          yMm?: number;
          x?: number;
          y?: number;
        };
        const xMm =
          typeof pageMmDetail.xMm === 'number'
            ? pageMmDetail.xMm
            : typeof pageMmDetail.x === 'number'
              ? pageMmDetail.x
              : 0;
        const yMm =
          typeof pageMmDetail.yMm === 'number'
            ? pageMmDetail.yMm
            : typeof pageMmDetail.y === 'number'
              ? pageMmDetail.y
              : 0;
        return resolveFromPageMm(xMm, yMm);
      }

      const clientX =
        'clientX' in detail && Number.isFinite(detail.clientX)
          ? detail.clientX
          : 'x' in detail && Number.isFinite(detail.x)
            ? detail.x
            : null;
      const clientY =
        'clientY' in detail && Number.isFinite(detail.clientY)
          ? detail.clientY
          : 'y' in detail && Number.isFinite(detail.y)
            ? detail.y
            : null;

      if (clientX == null || clientY == null) return null;

      const target = resolvePointerDropTarget({
        clientX,
        clientY,
        paperRefs,
        pageSizes,
        scale,
        activeDocumentId,
        canvasElement: canvasRef.current,
        pageCursor,
        preferredPageIndex: normalizeCommentPageIndex(
          'pageIndex' in detail ? detail.pageIndex : undefined,
          'pageNumber' in detail ? detail.pageNumber : undefined,
          'page' in detail ? detail.page : undefined,
        ),
      });

      if (!target.dropValid || !target.schemaPointMm || target.pageIndex < 0) {
        return null;
      }

      return {
        xMm: Math.round(target.schemaPointMm.x * 100) / 100,
        yMm: Math.round(target.schemaPointMm.y * 100) / 100,
        pageIndex: target.pageIndex,
        pageNumber: target.pageNumber,
        fileId,
        schemaUid: schemaUid || undefined,
      };
    },
    [activeDocumentId, canvasRef, normalizeCommentPageIndex, pageCursor, paperRefs, pageSizes, scale],
  );

  const parsedMinCanvasHeight = Number((options as Record<string, unknown>).minCanvasHeight);
  const minCanvasHeight =
    Number.isFinite(parsedMinCanvasHeight) && parsedMinCanvasHeight > 0 ? parsedMinCanvasHeight : 420;
  const safeCanvasHeight = Number.isFinite(size.height)
    ? Math.max(minCanvasHeight, size.height)
    : minCanvasHeight;
  /**
   * Workspace geométrico: el stage completo, siempre.
   *
   * `size` mide el contenedor del host, no el hueco entre paneles, así que este
   * ancho no depende de los sidebars. Es la única entrada válida para centrar el
   * papel, calcular zoom y fit, y posicionar los controles centrales.
   *
   * Contrato: `paperCenterX === workspaceCenterX`. Restar aquí el ancho de un
   * sidebar convierte un panel auxiliar en entrada del sistema de coordenadas y
   * mueve el documento al abrirlo; ver
   * `tests/e2e/designer-stage-centering.spec.ts`.
   */
  const workspaceSize = {
    width: Number.isFinite(size.width) ? Math.max(0, size.width) : 0,
    height: safeCanvasHeight,
  };
  /**
   * Espacio que ocupan los paneles en los bordes. Sirve **sólo** para apartar
   * controles periféricos (Guardar, Más) y evitar que queden debajo de un panel.
   * Nunca para dimensionar el Canvas ni para centrar nada.
   */
  const chromeInsets = {
    left: leftSidebarWidth,
    right: rightSidebarWidth,
  };
  const usableCanvasWidth = Math.max(1, workspaceSize.width - 24);
  const usableCanvasHeight = Math.max(1, workspaceSize.height - RULER_HEIGHT * ZOOM - 24);

  const onEdit = useCallback((targets: HTMLElement[]) => {
    const nextTargets = targets.filter(Boolean);
    setActiveElements((prev) => (areActiveElementsEqual(prev, nextTargets) ? prev : nextTargets));
    setHoveringSchemaId(null);
  }, [areActiveElementsEqual]);

  const onEditEnd = useCallback(() => {
    setActiveElements((prev) => (prev.length === 0 ? prev : []));
    setHoveringSchemaId(null);
  }, []);

  // Excepción a preserve-manual-memoization: igual que arriba, el compilador
  // infiere `paperRefs.current`; la ref es estable y no debe ser dependencia.
  const scrollPageIntoView = useCallback(
     
    (pageIndex: number) => {
      const paper = paperRefs.current[pageIndex];
      if (paper && typeof paper.scrollIntoView === 'function') {
        paper.scrollIntoView({ block: 'start', inline: 'nearest' });
        return true;
      }

      if (canvasRef.current) {
        canvasRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, pageIndex, scale);
        return true;
      }

      return false;
    },
    [paperRefs, pageSizes, scale],
  );

  const setPageCursorWithScroll = useCallback(
    (targetPageOrUpdater: number | ((currentPage: number) => number)) => {
      if (pageSizes.length === 0) return;

      const targetPage =
        typeof targetPageOrUpdater === 'function'
          ? targetPageOrUpdater(pageCursor)
          : targetPageOrUpdater;
      const safePage = Math.max(0, Math.min(targetPage, pageSizes.length - 1));
      setPageCursor(safePage);
      scrollPageIntoView(safePage);
      onPageCursorChange(safePage, pageSizes.length);
      onEditEnd();
    },
    [onEditEnd, onPageCursorChange, pageCursor, pageSizes.length, scrollPageIntoView],
  );

  const openCommentDialog = useCallback(
    (detail: CreateCommentEventDetail) => {
      try {
        const pendingAnchor = resolveCommentAnchorFromEvent(detail);
        if (!pendingAnchor) return;
        pendingAnchorRef.current = pendingAnchor;
        setPageCursor(pendingAnchor.pageIndex);
        scrollPageIntoView(pendingAnchor.pageIndex);
        onPageCursorChange(pendingAnchor.pageIndex, pageSizes.length);
        onEditEnd();
        openCommentsPanel();
        setCommentDialogOpen(true);
      } catch (err) {
        console.error('openCommentDialog failed', err);
      }
    },
    [onEditEnd, onPageCursorChange, openCommentsPanel, pageSizes.length, resolveCommentAnchorFromEvent, scrollPageIntoView],
  );

  useScrollPageCursor({
    ref: canvasRef,
    paperRefs,
    pageSizes,
    scale,
    pageCursor,
    disabled: isSchemaDragging,
    onChangePageCursor: (p) => {
      setPageCursor(p);
      onPageCursorChange(p, pageSizes.length);
      onEditEnd();
    },
  });

  const commitSchemas = useCallback(
    (newSchemas: SchemaForUI[], targetPageIndex = pageCursor) => {
      const beforeSchemas = cloneDeep(schemasListRef.current[targetPageIndex] || []);
      const afterSchemas = cloneDeep(newSchemas);
      const eventType =
        beforeSchemas.length < afterSchemas.length
          ? 'schema.created'
          : beforeSchemas.length > afterSchemas.length
            ? 'schema.deleted'
            : 'schema.updated';
      void commandBusRef.current.execute(
        createPageSnapshotCommand({
          id: eventType,
          label: eventType,
          pageIndex: targetPageIndex,
          beforeSchemas,
          afterSchemas,
          schemaEvents: [{ type: eventType, pageIndex: targetPageIndex }],
          meta: {
            schemaUids: resolveChangedSchemaUids(beforeSchemas, afterSchemas),
          },
          applyPageSchemas: (targetPageIndex, nextPageSchemas) => {
            const nextSchemasList = replacePageSchemas(schemasListRef.current, targetPageIndex, nextPageSchemas);
            schemasListRef.current = nextSchemasList;
            setSchemasList(nextSchemasList);
            const stableBasePdf = resolveStableDocumentBasePdf(activeDocumentId || canvasDocumentIdRef.current || null);
            pushTemplateUpdate(schemasList2template(nextSchemasList, stableBasePdf));
          },
        }),
      );
    },
    [activeDocumentId, canvasDocumentIdRef, pageCursor, pushTemplateUpdate, resolveStableDocumentBasePdf],
  );

  /**
   * Mantiene los campos autorrellenables alineados con su destinatario.
   *
   * Cubre lo que el autorrelleno en creación no puede: que el usuario vuelva al
   * paso 1 y corrija un nombre o un correo, o que reasigne el campo a otro
   * destinatario. No pasa por `commitSchemas` a propósito — esto no es una
   * acción del usuario y no debe ocupar una entrada de deshacer.
   *
   * `applyRecipientPrefill` devuelve el mismo objeto cuando no hay cambio, así
   * que el efecto se estabiliza en la primera pasada y no realimenta.
   */
  useEffect(() => {
    const currentSchemasList = schemasListRef.current;
    if (!currentSchemasList.length) return;

    let changed = false;
    const nextSchemasList = currentSchemasList.map((pageSchemas) => {
      let pageChanged = false;
      const nextPageSchemas = pageSchemas.map((schema) => {
        const nextSchema = applyRecipientPrefill(
          schema,
          resolveSchemaPrefillRecipient(
            schema,
            collaborationContext.recipientOptions,
            collaborationContext.activeRecipient,
          ),
        );
        if (nextSchema !== schema) pageChanged = true;
        return nextSchema;
      });
      if (!pageChanged) return pageSchemas;
      changed = true;
      return nextPageSchemas;
    });

    if (!changed) return;

    schemasListRef.current = nextSchemasList;
    setSchemasList(nextSchemasList);
    const stableBasePdf = resolveStableDocumentBasePdf(
      activeDocumentId || canvasDocumentIdRef.current || null,
    );
    pushTemplateUpdate(schemasList2template(nextSchemasList, stableBasePdf));
  }, [
    activeDocumentId,
    collaborationContext.activeRecipient,
    collaborationContext.recipientOptions,
    pushTemplateUpdate,
    resolveStableDocumentBasePdf,
    schemasList,
  ]);

  const removeSchemas = useCallback(
    (ids: string[]) => {
      const normalizedIds = new Set(normalizeSchemaIds(ids));
      if (!normalizedIds.size) return;

      // Access Control Guard - Blocks deletion of locked schemas
      const schemaUids = Array.from(normalizedIds);
      if (commandBusRef.current) {
        const removeSchemasCommand: Parameters<CommandBus['check']>[0] = {
          id: 'removeSchemas',
          label: 'Remove Schemas',
          meta: { schemaUids },
        };
        const isAllowed = commandBusRef.current.check(removeSchemasCommand);
        if (!isAllowed) return;
      }

      const activeElement = activeElements.find((element) =>
        normalizedIds.has(String(element.dataset.schemaId || element.dataset.schemaUid || element.id || '').trim()),
      );
      const activePageIndex = Number(activeElement?.dataset.pageIndex);
      const resolvedPageIndex =
        Number.isInteger(activePageIndex) && activePageIndex >= 0
          ? activePageIndex
          : schemasListRef.current.findIndex((pageSchemas) =>
              (pageSchemas || []).some((schema) => schemaMatchesAnyId(schema, normalizedIds)),
            );

      const targetPageIndex = resolvedPageIndex >= 0 ? resolvedPageIndex : pageCursor;
      const pageSchemas = schemasListRef.current[targetPageIndex] || [];
      commitSchemas(pageSchemas.filter((schema) => !schemaMatchesAnyId(schema, normalizedIds)), targetPageIndex);
      onEditEnd();
    },
    [activeElements, commitSchemas, onEditEnd, pageCursor],
  );

  // ── Resolve the real schema objects for the current active elements ──────
  const resolveActiveSchemasGlobal = useCallback(
    (): SchemaForUI[] => resolveActiveSchemasFromElements(schemasListRef.current, activeElements),
    [activeElements],
  );

  const resolveSelectionPageIndex = useCallback(() => {
    for (const el of activeElements) {
      const pi = Number(el?.dataset.pageIndex);
      if (Number.isInteger(pi) && pi >= 0) return pi;
    }
    return pageCursor;
  }, [activeElements, pageCursor]);

  const handleCopySelection = useCallback(() => {
    const schemas = resolveActiveSchemasGlobal();
    if (!schemas.length) return;
    schemaClipboardRef.current = copySchemasToClipboard(schemas, resolveSelectionPageIndex());
  }, [resolveActiveSchemasGlobal, resolveSelectionPageIndex]);

  const handlePasteSelection = useCallback(() => {
    const clipboard = schemaClipboardRef.current;
    if (!clipboard?.items.length) return;
    const list = schemasListRef.current;

    // Prefer the last valid pointer over a page as the paste anchor; only use it
    // when it targets a real page. Otherwise fall back to the active selection's
    // page (or pageCursor). resolvePointerDropTarget, not event.target, drives this.
    const pointer = lastCanvasPointerRef.current;
    let targetPageIndex = pageCursor;
    let targetAnchor: { x: number; y: number } | undefined;
    if (pointer && list[pointer.pageIndex]) {
      targetPageIndex = pointer.pageIndex;
      targetAnchor = { x: pointer.pointMm.x, y: pointer.pointMm.y };
    } else {
      for (const el of activeElements) {
        const pi = Number(el?.dataset.pageIndex);
        if (Number.isInteger(pi) && pi >= 0) { targetPageIndex = pi; break; }
      }
    }

    const pageSchemas = list[targetPageIndex] || [];
    const pasted = pasteSchemasFromClipboard(clipboard, {
      pageIndex: targetPageIndex,
      pageSize: pageSizes[targetPageIndex],
      fileId: activeDocumentId || null,
      existingSchemas: pageSchemas,
      collaborationContext: {
        fileId: collaborationContext.fileId || null,
        actorId: collaborationContext.actorId || null,
        ownerRecipientId: collaborationContext.ownerRecipientId || null,
        ownerRecipientIds: collaborationContext.ownerRecipientIds,
        ownerRecipientName: collaborationContext.ownerRecipientName || null,
        ownerColor: collaborationContext.ownerColor || null,
        userColor: collaborationContext.userColor || null,
      },
      pageCount: list.length,
      targetAnchor,
    });
    if (!pasted.length) return;
    // Select the pasted group once it renders; clears the previous selection.
    pendingSelectionIdsRef.current = pasted.map((schema) => schema.id);
    commitSchemas([...pageSchemas, ...pasted], targetPageIndex);
  }, [activeDocumentId, activeElements, collaborationContext, commitSchemas, pageCursor, pageSizes]);

  const handleCutSelection = useCallback(() => {
    const schemas = resolveActiveSchemasGlobal();
    if (!schemas.length) return;
    schemaClipboardRef.current = cutSchemasToClipboard(schemas, resolveSelectionPageIndex());
    removeSchemas(schemas.map((s) => s.id));
  }, [removeSchemas, resolveActiveSchemasGlobal, resolveSelectionPageIndex]);

  const changeSchemas: ChangeSchemas = useCallback(
    (objs) => {
      // Access Control Guard - Blocks property updates on locked schemas
      const schemaUids = objs.map((o) => o.schemaId).filter(Boolean) as string[];
      if (schemaUids.length > 0 && commandBusRef.current) {
        const changeSchemasCommand: Parameters<CommandBus['check']>[0] = {
          id: 'changeSchemas',
          label: 'Change Schemas',
          meta: { schemaUids },
        };
        const isAllowed = commandBusRef.current.check(changeSchemasCommand);
        if (!isAllowed) return;
      }

      const stableBasePdf = resolveStableDocumentBasePdf(activeDocumentId || canvasDocumentIdRef.current || null);
      emitDesignerEvent({
        type: 'designer.schema.change',
        source: 'canvas',
        component: 'Canvas',
        pageIndex: pageCursor,
        schemaIds: objs.reduce<string[]>((ids, obj) => {
          if (obj.schemaId) ids.push(obj.schemaId);
          return ids;
        }, []),
        patch: objs.reduce<Record<string, unknown>>((acc, obj) => {
          acc[String(obj.schemaId)] = { key: obj.key, value: obj.value };
          return acc;
        }, {}),
        details: { changeCount: objs.length },
      });

      // Route each change to the page that actually owns its schema (resolved by
      // unique schemaId), so edits like addGroupOption on page 2+ never depend on
      // pageCursor and never touch a same-name schema on another page.
      const list = schemasListRef.current;
      const resolvePageIndexForSchemaId = (schemaId: string): number => {
        const idx = list.findIndex((pageSchemas) =>
          (pageSchemas || []).some((schema) => schema.id === schemaId),
        );
        return idx >= 0 ? idx : pageCursor;
      };

      const objsByPage = new Map<number, typeof objs>();
      for (const obj of objs) {
        const pageIndex = obj.schemaId ? resolvePageIndexForSchemaId(obj.schemaId) : pageCursor;
        const bucket = objsByPage.get(pageIndex);
        if (bucket) bucket.push(obj);
        else objsByPage.set(pageIndex, [obj]);
      }

      for (const [pageIndex, pageObjs] of objsByPage) {
        _changeSchemas({
          objs: pageObjs,
          schemas: list[pageIndex] || [],
          basePdf: stableBasePdf,
          pluginsRegistry,
          pageSize: pageSizes[pageIndex] || pageSizes[pageCursor],
          commitSchemas: (next) => commitSchemas(next as SchemaForUI[], pageIndex),
        });
      }
    },
    [
      activeDocumentId,
      commitSchemas,
      emitDesignerEvent,
      pageCursor,
      pageSizes,
      pluginsRegistry,
      resolveStableDocumentBasePdf,
    ],
  );

  const currentPageSize = useMemo(
    () => pageSizes[pageCursor] ?? { width: 0, height: 0 },
    [pageCursor, pageSizes],
  );
  const requestInlineEdit = useCallback((request: { schemaId: string; target: 'content' | 'name' }) => {
    (canvasRef.current as (HTMLDivElement & {
      openInlineEdit?: (inlineEditRequest: { schemaId: string; target: 'content' | 'name' }) => void;
    }) | null)?.openInlineEdit?.(request);
  }, []);
  const selectSchemasByIds = useCallback(
    (
      ids: string[],
      options?: {
        mode?: 'replace' | 'toggle' | 'add';
      },
    ) => {
      const normalizedIds = [...new Set(ids.map((id) => String(id || '').trim()).filter(Boolean))];
      const mode = options?.mode || 'replace';

      const resolveElementBySchemaIdentity = (schemaIdentity: string) => {
        const schema = schemasListRef.current
          .flat()
          .find(
            (item) =>
              item.id === schemaIdentity ||
              String((item as { schemaUid?: string }).schemaUid || '').trim() === schemaIdentity,
          );
        const resolvedSchemaId = String(
          (schema as { schemaUid?: string } | undefined)?.schemaUid || schema?.id || schemaIdentity,
        ).trim();
        if (!resolvedSchemaId) return null;

        const selector =
          typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
            ? `[data-schema-id="${CSS.escape(resolvedSchemaId)}"]`
            : `[data-schema-id="${resolvedSchemaId.replace(/"/g, '\\"')}"]`;
        return document.querySelector<HTMLElement>(selector);
      };

      const nextElements = normalizedIds
        .map((id) => resolveElementBySchemaIdentity(id))
        .filter((element): element is HTMLElement => Boolean(element));

      if (mode === 'replace') {
        setActiveElements((prev) => (areActiveElementsEqual(prev, nextElements) ? prev : nextElements));
        setHoveringSchemaId(null);
        return;
      }

      if (mode === 'add') {
        setActiveElements((prev) => {
          const keyed = new Map<string, HTMLElement>();
          prev.forEach((element) => {
            const identity = resolveSchemaIdentityFromElement(element);
            const key = String(identity.schemaUid || identity.schemaId || element.id || '').trim();
            if (key) keyed.set(key, element);
          });

          nextElements.forEach((element) => {
            const identity = resolveSchemaIdentityFromElement(element);
            const key = String(identity.schemaUid || identity.schemaId || element.id || '').trim();
            if (!key) return;
            keyed.set(key, element);
          });

          const merged = [...keyed.values()];
          return areActiveElementsEqual(prev, merged) ? prev : merged;
        });
        setHoveringSchemaId(null);
        return;
      }

      setActiveElements((prev) => {
        const keyed = new Map<string, HTMLElement>();
        prev.forEach((element) => {
          const identity = resolveSchemaIdentityFromElement(element);
          const key = String(identity.schemaUid || identity.schemaId || element.id || '').trim();
          if (key) keyed.set(key, element);
        });

        nextElements.forEach((element) => {
          const identity = resolveSchemaIdentityFromElement(element);
          const key = String(identity.schemaUid || identity.schemaId || element.id || '').trim();
          if (!key) return;

          if (keyed.has(key)) {
            keyed.delete(key);
          } else {
            keyed.set(key, element);
          }
        });

        const merged = [...keyed.values()];
        return areActiveElementsEqual(prev, merged) ? prev : merged;
      });
      setHoveringSchemaId(null);
    },
    [areActiveElementsEqual],
  );
  const selectionCommands = useMemo(
    () =>
      // Excepción a react-hooks/refs: los comandos guardan la ref y solo leen
      // `.current` al ejecutarse desde un handler, nunca durante el render.
      
      createSelectionCommands({
        activeElements,
        schemasList,
        pageCursor,
        pageSize: currentPageSize,
        changeSchemas,
        commitSchemas,
        removeSchemas,
        onOpenProperties: openPropertiesPanel,
        requestInlineEdit,
        collaborationContext,
        onCopySelection: handleCopySelection,
        onPasteSelection: handlePasteSelection,
        onCutSelection: handleCutSelection,
        onClearSelection: () => setActiveElements([]),
        onSelectSchemasByIds: selectSchemasByIds,
        executeCommand: (command) => {
          void commandBusRef.current.execute(command);
        },
      }),
    [
      activeElements,
      schemasList,
      pageCursor,
      currentPageSize,
      changeSchemas,
      commitSchemas,
      removeSchemas,
      openPropertiesPanel,
      requestInlineEdit,
      collaborationContext,
      commandBusRef,
      handleCopySelection,
      handlePasteSelection,
      handleCutSelection,
      selectSchemasByIds,
    ],
  );

  // Excepción a react-hooks/refs: `commandBusRef` se crea en el primer render y
  // nunca se reasigna; el hook solo despacha comandos desde efectos y handlers.
  
  useInitEvents({
    pageCursor,
    pageSizes,
    activeElements,
    template: visibleTemplate,
    schemasList,
    visibleSchemasList,
    changeSchemas,
    
    commandBus: commandBusRef.current,
    onEdit,
    onEditEnd,
    selectionCommands,
    collaborationContext,
    onZoomIn: () => {
      setViewportMode('manual');
      setZoomLevel((prev) => Math.min(maxZoom, Number((prev + 0.1).toFixed(2))));
    },
    onZoomOut: () => {
      setViewportMode('manual');
      setZoomLevel((prev) => Math.max(0.25, Number((prev - 0.1).toFixed(2))));
    },
    onZoom100: () => {
      setViewportMode('actual-size');
      setZoomLevel(1);
    },
    onFitPage: () => setViewportMode('fit-page'),
    onFitWidth: () => setViewportMode('fit-width'),
    onPreviousPage: () => {
      const nextPage = Math.max(0, pageCursor - 1);
      if (nextPage === pageCursor) return;
      setPageCursorWithScroll(nextPage);
    },
    onNextPage: () => {
      const nextPage = Math.min(Math.max(0, pageSizes.length - 1), pageCursor + 1);
      if (nextPage === pageCursor) return;
      setPageCursorWithScroll(nextPage);
    },
  });

  const materializeLoadedSchemasOwnership = useCallback(
    (pages: SchemaForUI[][]): SchemaForUI[][] => {
      const fallbackOwnerId =
        String(collaborationContext.ownerRecipientId || collaborationContext.activeRecipientId || collaborationContext.actorId || '').trim() ||
        null;
      const fallbackOwnerName =
        String(collaborationContext.ownerRecipientName || collaborationContext.activeRecipient?.name || '').trim() || null;

      if (!fallbackOwnerId && !fallbackOwnerName) return pages;

      return pages.map((pageSchemas) =>
        pageSchemas.map((schema) => {
          const normalizedSchema =
            schema.type === 'signature' || schema.type === 'initials'
              ? (normalizeSignatureSchema(schema as SignatureSchema) as SchemaForUI)
              : schema;
          const existingOwnerId =
            String((normalizedSchema as SchemaForUI & { ownerRecipientId?: string | null }).ownerRecipientId || '').trim() ||
            String(
              Array.isArray((normalizedSchema as SchemaForUI & { ownerRecipientIds?: string[] | string | null }).ownerRecipientIds)
                ? (normalizedSchema as SchemaForUI & { ownerRecipientIds?: string[] | string | null }).ownerRecipientIds?.[0] || ''
                : (normalizedSchema as SchemaForUI & { ownerRecipientIds?: string[] | string | null }).ownerRecipientIds || '',
            ).trim();
          const recipientId = String((normalizedSchema as SchemaForUI & { recipientId?: string | null }).recipientId || '').trim();
          const existingOwnerTone =
            String((normalizedSchema as SchemaForUI & { ownerColor?: string | null }).ownerColor || '').trim() ||
            String((normalizedSchema as SchemaForUI & { userColor?: string | null }).userColor || '').trim() ||
            String((normalizedSchema as SchemaForUI & { recipientColor?: string | null }).recipientColor || '').trim() ||
            String((normalizedSchema as SchemaForUI & { __designer?: { ownerColor?: string | null; recipientColor?: string | null; collaboration?: { recipientColor?: string | null } } }).__designer?.collaboration?.recipientColor || '').trim() ||
            String((normalizedSchema as SchemaForUI & { __designer?: { ownerColor?: string | null; recipientColor?: string | null; collaboration?: { recipientColor?: string | null } } }).__designer?.ownerColor || '').trim() ||
            String((normalizedSchema as SchemaForUI & { __designer?: { ownerColor?: string | null; recipientColor?: string | null; collaboration?: { recipientColor?: string | null } } }).__designer?.recipientColor || '').trim();
          const nextOwnerRecipientId = recipientId || fallbackOwnerId;
          if (!nextOwnerRecipientId) return normalizedSchema;
          const resolvedOwnerColor =
            existingOwnerTone ||
            collaborationContext.recipientColorMap.get(nextOwnerRecipientId) ||
            collaborationContext.ownerColor ||
            collaborationContext.userColor ||
            null;

          return {
            ...normalizedSchema,
            ownerRecipientId: existingOwnerId || nextOwnerRecipientId,
            ownerRecipientIds: [existingOwnerId || nextOwnerRecipientId],
            ownerRecipientName: fallbackOwnerName || undefined,
            recipientId: recipientId || nextOwnerRecipientId,
            ...(resolvedOwnerColor
              ? {
                  ownerColor: resolvedOwnerColor,
                  userColor: resolvedOwnerColor,
                  recipientColor: resolvedOwnerColor,
                }
              : {}),
          } as SchemaForUI;
        }),
      );
    },
    [
      collaborationContext.actorId,
      collaborationContext.activeRecipient?.name,
      collaborationContext.activeRecipientId,
      collaborationContext.ownerRecipientId,
      collaborationContext.ownerRecipientName,
      collaborationContext.ownerColor,
      collaborationContext.recipientColorMap,
      collaborationContext.userColor,
    ],
  );

  const updateTemplate = useCallback(
    async (newTemplate: Template) => {
      setVisibleTemplate(newTemplate);
      visibleTemplateRef.current = newTemplate;
      const sl = await template2SchemasList(newTemplate);
      const nextSchemas = materializeLoadedSchemasOwnership(sl);
      setSchemasList(nextSchemas);
      schemasListRef.current = nextSchemas;
      setPageCursor((prev) => {
        if (nextSchemas.length <= 0) return 0;
        return Math.max(0, Math.min(prev, nextSchemas.length - 1));
      });
      if (pageCursorRef.current >= nextSchemas.length && canvasRef.current?.scroll) {
        canvasRef.current.scroll({ top: 0, behavior: 'smooth' });
      }
    },
    [materializeLoadedSchemasOwnership],
  );

  useEffect(() => {
    const handler = (ev: Event) => {
      const detail = (((ev as CustomEvent<CreateCommentEventDetail>).detail || {}) as CreateCommentEventDetail);
      openCommentDialog(detail);
    };
    globalThis.addEventListener('sisad-pdfme:create-comment', handler as EventListener);
    globalThis.addEventListener('sisad-pdfme:create-comment-request', handler as EventListener);
    return () => {
      globalThis.removeEventListener('sisad-pdfme:create-comment', handler as EventListener);
      globalThis.removeEventListener('sisad-pdfme:create-comment-request', handler as EventListener);
    };
  }, [openCommentDialog]);

  useEffect(() => {
    const handleCommentPinClick = (event: Event) => {
      const detail = (event as CustomEvent<{ anchorId?: string; commentId?: string }>).detail || {};
      let commentId: string | null = null;
      if (typeof detail.anchorId === 'string' && detail.anchorId.trim()) {
        commentId = detail.anchorId.trim();
      } else if (typeof detail.commentId === 'string' && detail.commentId.trim()) {
        commentId = detail.commentId.trim();
      }
      if (commentId) {
        const allComments = filterCommentsByFileAndPage(visibleTemplate, activeDocumentId || null);
        const matched = allComments.find((entry) => String(entry.comment?.id || entry.anchor?.id || '').trim() === commentId);
        const targetPageNumber = Number(matched?.pageNumber || matched?.anchor?.pageNumber || 0);
        if (Number.isInteger(targetPageNumber) && targetPageNumber > 0) {
          setPageCursorWithScroll(targetPageNumber - 1);
        }
      }
      openCommentsPanel(commentId);
    };

    globalThis.addEventListener('sisad-pdfme:pin-clicked', handleCommentPinClick as EventListener);
    return () => {
      globalThis.removeEventListener('sisad-pdfme:pin-clicked', handleCommentPinClick as EventListener);
    };
  }, [activeDocumentId, openCommentsPanel, setPageCursorWithScroll, visibleTemplate]);

  // Excepción a preserve-manual-memoization: el compilador infiere
  // `designerEngine.collaboration` entero, mientras que las dependencias
  // declaradas apuntan a los campos concretos que sí se usan. Ampliarlas
  // recrearía el callback en cada cambio de sesión de colaboración.
  const handleSaveComment = useCallback(
     
    (text: string) => {
      const pendingAnchor = pendingAnchorRef.current;
      if (!pendingAnchor) return;
      try {
        const resolvedSchemaUid = pendingAnchor.schemaUid || undefined;

        const anchor = {
          x: pendingAnchor.xMm,
          y: pendingAnchor.yMm,
          fileId: pendingAnchor.fileId || activeDocumentId || null,
          pageNumber: pendingAnchor.pageIndex + 1,
          schemaUid: resolvedSchemaUid,
        } satisfies Parameters<typeof createSchemaCommentAnchor>[0];

        // Author = the recipient who creates the comment (dropdown "Activo"),
        // so the pin carries that recipient's identity + color, not the session
        // actor. Falls back to actor/userColor when no active recipient.
        const identity = {
          authorId:
            collaborationContext.activeRecipient?.id || collaborationContext.actorId || undefined,
          authorName: collaborationContext.activeRecipient?.name || collaborationContext.ownerRecipientName || undefined,
          authorColor:
            collaborationContext.activeRecipient?.color || collaborationContext.userColor || undefined,
        } as Parameters<typeof createSchemaComment>[1];

        const createdAnchor = createSchemaCommentAnchor(anchor, identity) as SchemaCommentAnchor;
        const createdComment = createSchemaComment(text, {
          ...identity,
          timestamp: Date.now(),
        }, {
          id: createdAnchor.id,
          anchor: cloneDeep(createdAnchor) as SchemaCommentAnchor,
        }) as SchemaComment;

        const beforeTemplate = cloneDeep(visibleTemplate) as Template;

        if (resolvedSchemaUid) {
          const nextTemplate = cloneDeep(visibleTemplate) as Template;
          const target =
            findSchemaByUid(nextTemplate, resolvedSchemaUid) ||
            (() => {
              const pages = nextTemplate.schemas || [];
              for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
                const index = (pages[pageIndex] || []).findIndex((schema) => schema.id === resolvedSchemaUid);
                if (index >= 0) {
                  return {
                    pageIndex,
                    index,
                    schema: pages[pageIndex][index] as SchemaForUI,
                  };
                }
              }
              return null;
            })();
          if (target?.schema) {
            const nextSchema = cloneDeep(target.schema) as SchemaForUI & {
              comments?: SchemaComment[];
              commentAnchors?: SchemaCommentAnchor[];
              commentsCount?: number;
            };
            nextSchema.comments = upsertById(nextSchema.comments || [], createdComment);
            nextSchema.commentAnchors = upsertById(nextSchema.commentAnchors || [], createdAnchor);
            nextSchema.commentsCount = (Number(nextSchema.commentsCount) || 0) + 1;
            nextTemplate.schemas[target.pageIndex][target.index] = nextSchema;
            void commandBusRef.current.execute(
              createTemplateSnapshotCommand({
                id: 'addComment',
                label: 'addComment',
                beforeTemplate,
                afterTemplate: nextTemplate,
                events: [createCommentCommandEvent('comment.created', createdComment.id, anchor.fileId)],
                applyTemplate: updateTemplate,
              }),
            );
          } else {
            const nextTopLevel = upsertTopLevelComment(
              cloneDeep(visibleTemplate) as Template,
              buildTopLevelCommentEntry({
                id: createdComment.id,
                anchor: createdAnchor as unknown as TopLevelCommentEntry['anchor'],
                comment: createdComment as unknown as TopLevelCommentEntry['comment'],
              }),
            );

            void commandBusRef.current.execute(
              createTemplateSnapshotCommand({
                id: 'addComment',
                label: 'addComment',
                beforeTemplate,
                afterTemplate: nextTopLevel,
                events: [createCommentCommandEvent('comment.created', createdComment.id, anchor.fileId)],
                applyTemplate: updateTemplate,
              }),
            );

            if (designerEngine.collaboration?.enabled) {
              applyCollaborationLocalChange({
                type: 'comment.created',
                schemaId: buildTopLevelCommentSchemaId(anchor.fileId, anchor.pageNumber),
                comment: createdComment,
                anchor: createdAnchor,
                pageIndex: pendingAnchor.pageIndex,
                actorId: collaborationContext.actorId || designerEngine.collaboration?.actorId,
                sessionId: designerEngine.collaboration?.sessionId || activeDocumentId || 'local',
                timestamp: Date.now(),
              });
            }
          }
        }
        setActiveCommentId(createdComment.id);
        setPageCursorWithScroll(pendingAnchor.pageIndex);
        openCommentsPanel(createdComment.id);
      } catch (err) {
        console.error('Failed to save comment', err);
      } finally {
        setCommentDialogOpen(false);
        pendingAnchorRef.current = null;
      }
    },
    [
      activeDocumentId,
      applyCollaborationLocalChange,
      collaborationContext,
      designerEngine.collaboration?.actorId,
      designerEngine.collaboration?.enabled,
      designerEngine.collaboration?.sessionId,
      visibleTemplate,
      updateTemplate,
      openCommentsPanel,
      setPageCursorWithScroll,
    ],
  );

  const handleAddSidebarComment = useCallback(() => {
    const activeSchema = currentPageSchemas.find((schema) => schema.id === activeElements[0]?.id);
    const pageSize = pageSizes[pageCursor];
    openCommentDialog({
      coordinateSpace: 'page-mm',
      xMm: Number(pageSize?.width || 0) / 2,
      yMm: Number(pageSize?.height || 0) / 2,
      pageIndex: pageCursor,
      pageNumber: pageCursor + 1,
      fileId: activeDocumentId || null,
      schemaUid: activeSchema?.schemaUid || activeSchema?.id,
      targetIds: activeSchema ? [activeSchema.id] : [],
    });
  }, [activeDocumentId, activeElements, currentPageSchemas, openCommentDialog, pageCursor, pageSizes]);

  const commentItems = useMemo(() => {
    const items: DesignerCommentItem[] = [];
    for (const entry of filterCommentsByFileAndPage(visibleTemplate, activeDocumentId || null, pageCursor + 1)) {
      const id = String(entry.comment?.id || entry.anchor?.id || '');
      const text = String(entry.comment?.text || entry.comment?.content || '');
      if (!id || !text) continue;
      items.push({
        id,
        text,
        authorName: entry.comment?.authorName || null,
        authorColor: entry.comment?.authorColor || null,
        schemaUid: entry.schemaUid || entry.anchor?.schemaUid,
        fileId: entry.fileId || null,
        pageNumber: entry.pageNumber,
        resolved: Boolean(entry.anchor?.resolved ?? entry.comment?.resolved),
        timestamp: Number(entry.comment?.timestamp || entry.comment?.createdAt || 0) || undefined,
        replies: toDesignerCommentReplies(entry.comment?.replies),
      });
    }
    return items.sort((left, right) => (right.timestamp || 0) - (left.timestamp || 0));
  }, [activeDocumentId, pageCursor, visibleTemplate]);

  const commentsBridge = useMemo(
    () => ({
      items: commentItems,
      onAdd: handleAddSidebarComment,
      title: 'Comentarios',
      emptyTitle: 'Sin comentarios en esta página.',
      activeCommentId,
    }),
    [activeCommentId, commentItems, handleAddSidebarComment],
  );

  const loadDocumentIntoCanvas = useCallback(
    async (document: UploadedPdfDocument, targetPageIndex = 0) => {
      if (!document?.id) return;
      loadDocumentRequestRef.current += 1;
      const requestId = loadDocumentRequestRef.current;
      pendingCanvasDocumentIdRef.current = document.id;
      commandBusRef.current.clear();
      const normalizedTemplate = normalizeTemplateSchemaPages(document.template, document.pageCount);

      const cachedSchemas = documentSchemasCacheRef.current.get(document.id);
      let nextSchemas = cachedSchemas;
      if (!nextSchemas) {
        try {
          nextSchemas = await template2SchemasList(normalizedTemplate);
        } catch (error) {
          console.error(
            '[@sisad-pdfme/ui] Failed to preprocess the document basePdf, using template schemas as fallback.',
            error,
          );
          const fallbackSchemas = cloneDeep(normalizedTemplate.schemas || [[]]) as SchemaForUI[][];
          nextSchemas = fallbackSchemas.map((pageSchemas) =>
            (pageSchemas || []).map((schema) => ({
              ...schema,
              id: schema.id || uuid(),
            })),
          );
        }
      }
      nextSchemas = materializeLoadedSchemasOwnership(nextSchemas);
      if (requestId !== loadDocumentRequestRef.current) {
        if (pendingCanvasDocumentIdRef.current === document.id) {
          pendingCanvasDocumentIdRef.current = null;
        }
        return;
      }
      const nextSchemasHash = stableHashSchemas(nextSchemas);
      documentSchemasCacheRef.current.set(document.id, nextSchemas);
      canvasDocumentIdRef.current = document.id;
      pendingCanvasDocumentIdRef.current = null;

      setVisibleTemplate(normalizedTemplate);
      visibleTemplateRef.current = normalizedTemplate;
      activeBasePdfRef.current = normalizedTemplate.basePdf;
      lastCommittedSchemasHashRef.current = nextSchemasHash;
      lastPersistedDocumentBasePdfRef.current = normalizedTemplate.basePdf;
      setSchemasList(nextSchemas);
      const safePageCursor = Math.max(0, Math.min(targetPageIndex, Math.max(0, nextSchemas.length - 1)));
      setPageCursor(safePageCursor);
      onPageCursorChange(safePageCursor, nextSchemas.length);
    },
    [materializeLoadedSchemasOwnership, onPageCursorChange],
  );

  const persistActiveDocumentSnapshot = useCallback(
    (source = 'document-snapshot') => {
      const documentId = activeDocumentId || canvasDocumentIdRef.current;
      if (!documentId || canvasDocumentIdRef.current !== documentId) return null;

      const nextSchemas = schemasListRef.current.map((page) => page.slice());
      const pageCount = Math.max(1, pageSizes.length || nextSchemas.length || visibleTemplate.schemas.length || 1);
      const updatedAt = Date.now();
      const nextSchemasHash = stableHashSchemas(nextSchemas);
      const stableBasePdf = resolveStableDocumentBasePdf(documentId);
      const nextTemplate = normalizeTemplateSchemaPages(
        schemasList2template(nextSchemas, stableBasePdf),
        pageCount,
      );
      const currentDocument = uploadedDocumentsRef.current.find((doc) => doc.id === documentId) || null;
      const currentTemplate = currentDocument?.template || null;
      const currentTemplateHash = stableHashSchemas(currentTemplate?.schemas || []);
      const currentTemplateBasePdf = currentTemplate?.basePdf;
      if (
        lastCommittedSchemasHashRef.current === nextSchemasHash &&
        lastPersistedDocumentBasePdfRef.current === nextTemplate.basePdf &&
        currentDocument &&
        currentDocument.pageCount === pageCount &&
        currentTemplateHash === nextSchemasHash &&
        currentTemplateBasePdf === nextTemplate.basePdf
      ) {
        return nextTemplate;
      }
      if (
        currentDocument &&
        currentTemplateHash === nextSchemasHash &&
        currentTemplateBasePdf === nextTemplate.basePdf &&
        currentDocument.pageCount === pageCount
      ) {
        lastCommittedSchemasHashRef.current = nextSchemasHash;
        lastPersistedDocumentBasePdfRef.current = nextTemplate.basePdf;
        return nextTemplate;
      }

      documentSchemasCacheRef.current.set(documentId, nextSchemas);
      let didUpdate = false;
      setUploadedDocuments((prev) => {
        const idx = prev.findIndex((doc) => doc.id === documentId);
        if (idx < 0) return prev;
        const next = [...prev];
        const currentTemplate = next[idx]?.template;
        const currentBasePdf = currentTemplate?.basePdf;
        const currentSchemasHash = stableHashSchemas(currentTemplate?.schemas || []);
        if (
          currentSchemasHash === nextSchemasHash &&
          currentBasePdf === nextTemplate.basePdf &&
          next[idx].pageCount === pageCount
        ) {
          lastCommittedSchemasHashRef.current = nextSchemasHash;
          lastPersistedDocumentBasePdfRef.current = nextTemplate.basePdf;
          return prev;
        }
        didUpdate = true;
        next[idx] = {
          ...next[idx],
          template: nextTemplate,
          pageCount,
          updatedAt,
        };
        lastCommittedSchemasHashRef.current = nextSchemasHash;
        lastPersistedDocumentBasePdfRef.current = nextTemplate.basePdf;
        return next;
      });
      if (!didUpdate) return nextTemplate;
      pushTemplateUpdate(nextTemplate, {
        documentId,
        fileId: documentId,
        pageCount,
        source,
        updatedAt,
      });
      return nextTemplate;
    },
    [
      activeDocumentId,
      pageSizes.length,
      pushTemplateUpdate,
      resolveStableDocumentBasePdf,
      visibleTemplate.schemas.length,
    ],
  );

  const addSchema = useCallback(
    (defaultSchema: Schema, targetPageIndex = pageCursor, preservePosition = false) => {
      const [paddingTop, paddingRight, paddingBottom, paddingLeft] = isBlankPdf(activeBasePdf)
        ? activeBasePdf.padding
        : [0, 0, 0, 0];
      const basePageSize =
        pageSizes[targetPageIndex] || pageSizes[pageCursor] || { width: 210, height: 297 };

      const newSchemaName = (prefix: string) => {
        let index = schemasList.reduce((acc, page) => acc + page.length, 1);
        let newName = prefix + index;
        while (schemasList.some((page) => page.find((s) => s.name === newName))) {
          index++;
          newName = prefix + index;
        }
        return newName;
      };
      const ensureMiddleValue = (min: number, value: number, max: number) =>
        Math.min(Math.max(min, value), max);

      const rawWidth = Number(defaultSchema.width);
      const rawHeight = Number(defaultSchema.height);
      const minHeightByType = defaultSchema.type === 'line' ? 0.5 : 4;
      const minWidth = 4;
      const maxWidth = Math.max(minWidth, basePageSize.width - paddingLeft - paddingRight);
      const maxHeight = Math.max(minHeightByType, basePageSize.height - paddingTop - paddingBottom);
      const safeWidth = round(
        Math.min(maxWidth, Number.isFinite(rawWidth) && rawWidth > 0 ? rawWidth : 45),
        2,
      );
      const safeHeight = round(
        Math.min(maxHeight, Number.isFinite(rawHeight) && rawHeight > 0 ? rawHeight : 10),
        2,
      );

      let s = {
        id: uuid(),
        readOnly: false, // Default for new schemas
        ...defaultSchema,
        width: safeWidth,
        height: safeHeight,
        name: newSchemaName(i18n('field')),
        position: {
          x: ensureMiddleValue(
            paddingLeft,
            Number(defaultSchema.position?.x) || 0,
            basePageSize.width - paddingRight - safeWidth,
          ),
          y: ensureMiddleValue(
            paddingTop,
            Number(defaultSchema.position?.y) || 0,
            basePageSize.height - paddingBottom - safeHeight,
          ),
        },
        required: defaultSchema.readOnly
          ? false
          : options.requiredByDefault || defaultSchema.required || false,
      } as SchemaForUI;

      // Force schemaUid to match id for new schemas if not provided
      if (!s.schemaUid) {
        s.schemaUid = s.id;
      }

      if (!preservePosition && Number(defaultSchema.position?.y) === 0) {
        const paper = paperRefs.current[targetPageIndex] || paperRefs.current[pageCursor];
        const rectTop = paper ? paper.getBoundingClientRect().top : 0;
        s.position.y = rectTop > 0 ? paddingTop : basePageSize.height / 2;
      }

      const creationContext = createSchemaCreationContext({
        fileId: activeDocumentId || null,
        pageIndex: targetPageIndex,
        pageNumber: targetPageIndex + 1,
        totalPages: schemasList.length,
        timestamp: Date.now(),
        collaboration: {
          actorId: collaborationContext.actorId,
          ownerRecipientId: collaborationContext.ownerRecipientId,
          ownerRecipientIds: collaborationContext.ownerRecipientIds,
          ownerRecipientName: collaborationContext.ownerRecipientName,
          ownerColor: collaborationContext.ownerColor,
          userColor: collaborationContext.userColor,
        },
      });
      s = applySchemaCreationHook(s, creationContext, designerEngine);
      s = attachSchemaIdentity(s, creationContext, designerEngine);
      s = applySchemaCollaborativeDefaults(s, creationContext, designerEngine);
      // Autorrelleno: después de los defaults colaborativos, que son los que
      // fijan `ownerRecipientId`. Antes de esa línea el campo aún no sabe de
      // quién es y resolvería siempre contra el destinatario activo.
      s = applyRecipientPrefill(
        s,
        resolveSchemaPrefillRecipient(
          s,
          collaborationContext.recipientOptions,
          collaborationContext.activeRecipient,
        ),
      );

      const fallbackOwnerIds = Array.isArray((s as SchemaForUI & { ownerRecipientIds?: string[] }).ownerRecipientIds)
        ? ((s as SchemaForUI & { ownerRecipientIds?: string[] }).ownerRecipientIds as string[])
        : [];
      const fallbackFileId = activeDocumentId || null;
      const pageCount = Math.max(1, pageSizes.length || schemasList.length || 1);
      const candidatePages = [
        targetPageIndex,
        ...Array.from({ length: pageCount }, (_, idx) => idx).filter((idx) => idx !== targetPageIndex),
      ];

      let resolvedPlacement:
        | {
            pageIndex: number;
            pageSize: { width: number; height: number };
            width: number;
            height: number;
            position: { x: number; y: number };
          }
        | null = null;

      for (const candidatePageIndex of candidatePages) {
        const candidatePageSize = pageSizes[candidatePageIndex] || basePageSize;
        const pageMaxWidth = Math.max(minWidth, candidatePageSize.width - paddingLeft - paddingRight);
        const pageMaxHeight = Math.max(minHeightByType, candidatePageSize.height - paddingTop - paddingBottom);
        const candidateWidth = round(Math.min(pageMaxWidth, Number(s.width || safeWidth)), 2);
        const candidateHeight = round(Math.min(pageMaxHeight, Number(s.height || safeHeight)), 2);

        const defaultCandidatePosition = {
          x: round(Math.max(0, (candidatePageSize.width - candidateWidth) / 2), 2),
          y: round(Math.max(0, (candidatePageSize.height - candidateHeight) / 2), 2),
        };
        const preferredCandidatePosition =
          candidatePageIndex === targetPageIndex
            ? s.position
            : defaultCandidatePosition;

        const scopedReference = {
          ...s,
          width: candidateWidth,
          height: candidateHeight,
          pageNumber: candidatePageIndex + 1,
          fileId: fallbackFileId,
        } as SchemaForUI;
        const collisionScopedSchemas = filterSchemasByCollisionScope(
          schemasList[candidatePageIndex] || [],
          scopedReference,
          {
            fileId: fallbackFileId,
            pageNumber: candidatePageIndex + 1,
            ownerRecipientId: scopedReference.ownerRecipientId || null,
            ownerRecipientIds: fallbackOwnerIds,
          },
        );

        const freePosition = resolveSmartDropPosition({
          candidate: preferredCandidatePosition,
          pageSize: candidatePageSize,
          schemaSize: {
            width: candidateWidth,
            height: candidateHeight,
          },
          existingSchemas: collisionScopedSchemas,
          stepMm: 4,
          maxAttempts: 14,
        });

        if (!freePosition) continue;

        resolvedPlacement = {
          pageIndex: candidatePageIndex,
          pageSize: candidatePageSize,
          width: candidateWidth,
          height: candidateHeight,
          position: freePosition,
        };
        break;
      }

      if (!resolvedPlacement) {
        emitDesignerEvent({
          type: 'designer.schema.add.blocked',
          source: 'sidebar',
          component: 'Designer',
          pageIndex: targetPageIndex,
          schemaIds: [s.id],
          details: {
            reason: 'no-space-available',
            schemaType: s.type,
            ownerRecipientId: s.ownerRecipientId || null,
            fileId: fallbackFileId,
            pageCount,
          },
        });
        return;
      }

      s = {
        ...s,
        width: resolvedPlacement.width,
        height: resolvedPlacement.height,
        position: resolvedPlacement.position,
        pageNumber: resolvedPlacement.pageIndex + 1,
      } as SchemaForUI;

      const pageSchemas = schemasList[resolvedPlacement.pageIndex] || [];
      commitSchemas(pageSchemas.concat(s), resolvedPlacement.pageIndex);
      setTimeout(() => {
        const element = document.getElementById(s.id);
        if (!element) return;
        onEdit([element]);
      });
    },
    [
      activeBasePdf,
      activeDocumentId,
      collaborationContext,
      commitSchemas,
      emitDesignerEvent,
      designerEngine,
      i18n,
      onEdit,
      pageCursor,
      pageSizes,
      options,
      paperRefs,
      schemasList,
    ],
  );

  const addSchemaAtCenter = useCallback(
    (defaultSchema: Schema, targetPageIndex = pageCursor) => {
      const pageSize = pageSizes[targetPageIndex] || pageSizes[pageCursor];
      if (!pageSize) return;
      const schemaWidth = Number(defaultSchema?.width);
      const schemaHeight = Number(defaultSchema?.height);
      const safeWidth = Number.isFinite(schemaWidth) && schemaWidth > 0 ? schemaWidth : 45;
      const safeHeight = Number.isFinite(schemaHeight) && schemaHeight > 0 ? schemaHeight : 10;
      const centered = {
        ...defaultSchema,
        width: safeWidth,
        height: safeHeight,
        position: {
          x: round(Math.max(0, (pageSize.width - safeWidth) / 2), 2),
          y: round(Math.max(0, (pageSize.height - safeHeight) / 2), 2),
        },
      } as Schema;
      addSchema(centered, targetPageIndex, true);
    },
    [addSchema, pageCursor, pageSizes],
  );

  const addSchemaByType = useCallback(
    (schemaType: string) => {
      const normalizedType = String(schemaType || '').trim();
      if (!normalizedType) return;

      const found = pluginsRegistry
        .entries()
        .find(([, plugin]) => plugin?.propPanel?.defaultSchema?.type === normalizedType);

      if (!found) return;

      // Plugins may declare a minimal `defaultSchema`. Normalize required
      // fields before adding so SchemaForUI invariants (e.g., `id`) hold.
      const rawDefault = found[1].propPanel.defaultSchema as Partial<Schema>;
      const defaultSchema: Schema = {
        ...rawDefault,
        id: rawDefault.id || generateSchemaUid(),
        name: rawDefault.name || '',
        position: rawDefault.position || { x: 0, y: 0 },
        width: rawDefault.width || 45,
        height: rawDefault.height || 10,
        type: rawDefault.type || normalizedType,
      } as Schema;
      addSchemaAtCenter(defaultSchema);
    },
    [addSchemaAtCenter, pluginsRegistry],
  );

  const onSortEnd = (sortedSchemas: SchemaForUI[]) => {
    commitSchemas(sortedSchemas);
  };

  const resolveTargetPageIndex = useCallback(
    (page?: number) => {
      if (schemasList.length <= 0) return 0;
      if (typeof page !== 'number' || !Number.isFinite(page)) {
        return Math.max(0, Math.min(pageCursor, schemasList.length - 1));
      }
      const normalized = Math.round(page) - 1;
      return Math.max(0, Math.min(normalized, schemasList.length - 1));
    },
    [pageCursor, schemasList.length],
  );

  const getBaseScale = useCallback(() => {
    if (!Number.isFinite(scale) || scale <= 0) return 1;
    if (!Number.isFinite(zoomLevel) || zoomLevel <= 0) return scale;
    const computed = scale / zoomLevel;
    return Number.isFinite(computed) && computed > 0 ? computed : 1;
  }, [scale, zoomLevel]);

  const computeZoomForMode = useCallback(
    (mode: ViewportMode, page?: number) => {
      const targetPage = resolveTargetPageIndex(page);
      const pageSize = pageSizes[targetPage];
      if (!pageSize || !Number.isFinite(pageSize.width) || !Number.isFinite(pageSize.height)) {
        return null;
      }

      // La aritmética vive en `zoomContract` para que toolbar, controller y
      // atajos compartan exactamente el mismo cálculo y sea comprobable sin
      // montar el Designer.
      return computeFitZoom(mode as ViewportFitMode, {
        pageSize,
        canvas: { width: usableCanvasWidth, height: usableCanvasHeight },
        unitScale: ZOOM,
        baseScale: getBaseScale(),
        maxZoom,
        viewportWidth,
      });
    },
    [getBaseScale, maxZoom, pageSizes, resolveTargetPageIndex, usableCanvasHeight, usableCanvasWidth, viewportWidth],
  );

  const applyViewportMode = useCallback(
    (mode: ViewportMode, page?: number) => {
      const normalizedMode = normalizeViewportMode(mode);
      setViewportMode(normalizedMode);
      emitDesignerEvent({
        type: 'designer.action.viewport-mode.set',
        source: 'designer',
        component: 'Designer',
        value: normalizedMode,
        pageIndex: typeof page === 'number' ? Math.max(0, Math.round(page) - 1) : undefined,
      });

      const targetPage = resolveTargetPageIndex(page);
      if (targetPage !== pageCursor) {
        setPageCursorWithScroll(targetPage);
      }

      if (normalizedMode === 'manual') return;

      const nextZoom = computeZoomForMode(normalizedMode, targetPage + 1);
      if (!isValidZoom(nextZoom)) return;

      setZoomLevel((prev) => {
        return Math.abs(prev - nextZoom) <= 0.005 ? prev : nextZoom;
      });
    },
    [computeZoomForMode, emitDesignerEvent, pageCursor, resolveTargetPageIndex, setPageCursorWithScroll],
  );

  const setZoomExternal = useCallback(
    (zoom: number) => {
      setViewportMode('manual');
      const nextZoom = Math.max(0.25, Math.min(maxZoom, zoom));
      setZoomLevel(nextZoom);
      emitDesignerEvent({
        type: 'designer.action.zoom.set',
        source: 'designer',
        component: 'Designer',
        value: nextZoom,
      });
    },
    [emitDesignerEvent, maxZoom],
  );

  // Update component state only when _options_ changes
  useEffect(() => {
    if (typeof options.zoomLevel === 'number' && options.zoomLevel !== zoomLevel) {
      setZoomLevel(options.zoomLevel);
    }
    if (options.sidebarOpenControlled === true && typeof options.sidebarOpen === 'boolean' && options.sidebarOpen !== sidebarOpen) {
      setSidebarOpen(options.sidebarOpen);
    }
    const modeFromOptions = normalizeViewportMode(options.viewportMode);
    if (options.viewportMode !== undefined && modeFromOptions !== viewportMode) {
      applyViewportMode(modeFromOptions);
    }
  }, [applyViewportMode, options, sidebarOpen, viewportMode, zoomLevel]);

  const getCanvasMetrics = useCallback(() => {
    const page = pageSizes[pageCursor];
    return {
      viewportWidth: workspaceSize.width,
      viewportHeight: workspaceSize.height,
      usableWidth: usableCanvasWidth,
      usableHeight: usableCanvasHeight,
      pageWidth: page?.width ?? 0,
      pageHeight: page?.height ?? 0,
      scale,
      zoom: zoomLevel,
      currentPage: pageCursor + 1,
      totalPages: schemasList.length,
      sidebarOpen,
    };
  }, [pageCursor, pageSizes, scale, schemasList.length, sidebarOpen, workspaceSize.height, workspaceSize.width, usableCanvasHeight, usableCanvasWidth, zoomLevel]);

  useEffect(() => {
    if (viewportMode === 'manual') return;
    const nextZoom = computeZoomForMode(viewportMode, pageCursor + 1);
    if (!isValidZoom(nextZoom)) return;
    setZoomLevel((prev) => {
      return Math.abs(prev - nextZoom) <= 0.005 ? prev : nextZoom;
    });
  }, [computeZoomForMode, pageCursor, workspaceSize.height, workspaceSize.width, viewportMode]);

  const undoExternal = useCallback(() => {
    void commandBusRef.current.undo();
    onEditEnd();
  }, [onEditEnd]);

  const redoExternal = useCallback(() => {
    void commandBusRef.current.redo();
    onEditEnd();
  }, [onEditEnd]);

  const exportTemplateExternal = useCallback(() => {
    const exportPayload = JSON.stringify(visibleTemplate, null, 2);
    const safeName = String(getBasePdfDisplayName(visibleTemplate.basePdf) || 'sisad-pdfme-template')
      .replace(/[\\/:*?"<>|]+/g, '_')
      .trim() || 'sisad-pdfme-template';
    const blob = new Blob([exportPayload], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${safeName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
    emitDesignerEvent({
      type: 'designer.action.export.template',
      source: 'designer',
      component: 'Designer',
      details: { fileName: `${safeName}.json` },
    });
  }, [emitDesignerEvent, visibleTemplate]);

  const focusFieldExternal = useCallback(
    (fieldName: string) => {
      if (!fieldName) return;
      let target: { pageIndex: number; schemaId: string } | null = null;

      for (let pageIndex = 0; pageIndex < schemasList.length; pageIndex++) {
        const schema = schemasList[pageIndex].find((item) => item.name === fieldName);
        if (schema) {
          target = { pageIndex, schemaId: schema.id };
          break;
        }
      }

      if (!target) return;

      setPageCursorWithScroll(target.pageIndex);
      setTimeout(() => {
        const element = document.getElementById(target!.schemaId);
        if (!element) return;
        setHoveringSchemaId(target!.schemaId);
        onEdit([element]);
        element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }, 0);
    },
    [onEdit, schemasList, setPageCursorWithScroll],
  );

  type SchemaMatcher = 'id' | 'name' | 'identity' | 'prefill-source';

  const findSchemaLocation = useCallback(
    (schemaIdOrName: string, matcher: SchemaMatcher = 'id') => {
      const target = String(schemaIdOrName || '').trim();
      if (!target) return null;

      for (let pageIndex = 0; pageIndex < schemasList.length; pageIndex++) {
        const schemaIndex = schemasList[pageIndex].findIndex((schema) => {
          if (matcher === 'id') return schema.id === target;
          if (matcher === 'name') return schema.name === target;
          const cfg = getSchemaDesignerConfig(schema, designerEngine);
          if (matcher === 'identity') return cfg?.identity?.key === target;
          return cfg?.prefill?.sourceKey === target;
        });
        if (schemaIndex >= 0) return { pageIndex, schemaIndex };
      }
      return null;
    },
    [designerEngine, schemasList],
  );

  useEffect(() => {
    if (!designerEngine.collaboration?.enabled) {
      lockedSelectionSchemaIdsRef.current = [];
      return;
    }

    const nextLockedIds = activeElements.reduce<string[]>((ids, element) => {
      if (element) ids.push(element.id);
      return ids;
    }, []);
    const previousLockedIds = lockedSelectionSchemaIdsRef.current;
    const releasedIds = previousLockedIds.filter((schemaId) => !nextLockedIds.includes(schemaId));
    const acquiredIds = nextLockedIds.filter((schemaId) => !previousLockedIds.includes(schemaId));

    releasedIds.forEach((schemaId) => {
      const location = findSchemaLocation(schemaId, 'id');
      collaborationSync.releaseLock(schemaId, location?.pageIndex);
      handleCollaborationEvent({
        type: 'unlock',
        schemaId,
        pageIndex: location?.pageIndex,
        actorId: collaborationContext.actorId || designerEngine.collaboration?.actorId,
        sessionId: designerEngine.collaboration?.sessionId || activeDocumentId || 'local',
        timestamp: Date.now(),
      });
      // Emit schema.unlocked through the CommandBus so observers can react.
      void commandBusRef.current.execute({
        id: `schema.unlocked:${schemaId}`,
        label: 'Unlock field',
        execute: ({ emit }) => {
          emit({ type: 'schema.unlocked', schemaId, pageIndex: location?.pageIndex });
        },
        undo: ({ emit }) => {
          emit({ type: 'schema.locked', schemaId, pageIndex: location?.pageIndex });
        },
      });
    });

    acquiredIds.forEach((schemaId) => {
      const location = findSchemaLocation(schemaId, 'id');
      const lock = {
        lockedBy: collaborationContext.actorId || designerEngine.collaboration?.actorId || 'local',
        lockedAt: Date.now(),
        reason: 'Active designer selection',
        sessionId: designerEngine.collaboration?.sessionId || activeDocumentId || 'local',
      };
      collaborationSync.acquireLock(schemaId, lock, location?.pageIndex);
      handleCollaborationEvent({
        type: 'lock',
        schemaId,
        lock,
        state: 'locked',
        pageIndex: location?.pageIndex,
        actorId: collaborationContext.actorId || designerEngine.collaboration?.actorId,
        sessionId: designerEngine.collaboration?.sessionId || activeDocumentId || 'local',
        timestamp: Date.now(),
      });
      // Emit schema.locked through the CommandBus so observers can react.
      void commandBusRef.current.execute({
        id: `schema.locked:${schemaId}`,
        label: 'Lock field',
        execute: ({ emit }) => {
          emit({ type: 'schema.locked', schemaId, pageIndex: location?.pageIndex });
        },
        undo: ({ emit }) => {
          emit({ type: 'schema.unlocked', schemaId, pageIndex: location?.pageIndex });
        },
      });
    });

    lockedSelectionSchemaIdsRef.current = nextLockedIds;
  }, [
    activeDocumentId,
    activeElements,
    collaborationContext.actorId,
    collaborationSync,
    designerEngine.collaboration?.actorId,
    designerEngine.collaboration?.enabled,
    designerEngine.collaboration?.sessionId,
    findSchemaLocation,
    handleCollaborationEvent,
  ]);

  useEffect(() => {
    emitDesignerEvent({
      type: 'designer.selection.changed',
      source: 'canvas',
      component: 'Canvas',
      schemaIds: activeElementIds,
      details: { count: activeElementIds.length },
    });
  }, [activeElementIds, emitDesignerEvent]);

  useEffect(() => {
    emitDesignerEvent({
      type: 'designer.view.page.changed',
      source: 'designer',
      component: 'Designer',
      pageIndex: pageCursor,
      details: { totalPages: schemasList.length },
    });
  }, [emitDesignerEvent, pageCursor, schemasList.length]);

  useEffect(() => {
    emitDesignerEvent({
      type: 'designer.view.zoom.changed',
      source: 'designer',
      component: 'Designer',
      value: zoomLevel,
      details: { viewportMode, sidebarOpen },
    });
  }, [emitDesignerEvent, sidebarOpen, viewportMode, zoomLevel]);

  useEffect(() => {
    emitDesignerEvent({
      type: 'designer.view.sidebar.changed',
      source: 'designer',
      component: 'Designer',
      value: sidebarOpen,
    });
  }, [emitDesignerEvent, sidebarOpen]);

  useEffect(() => {
    emitDesignerEvent({
      type: 'designer.view.viewport-mode.changed',
      source: 'designer',
      component: 'Designer',
      value: viewportMode,
    });
  }, [emitDesignerEvent, viewportMode]);

  useEffect(() => {
    emitDesignerEvent({
      type: 'designer.selection.hover.changed',
      source: 'sidebar',
      component: 'Sidebar',
      schemaId: hoveringSchemaId,
      value: hoveringSchemaId,
    });
  }, [emitDesignerEvent, hoveringSchemaId]);

  useEffect(() => {
    emitDesignerEvent({
      type: 'designer.component.interaction.changed',
      source: 'designer',
      component: 'Designer',
      schemaIds: activeElementIds,
      details: { ...interactionState },
    });
  }, [activeElementIds, emitDesignerEvent, interactionState]);

  const applyExternalPrefill = useCallback(
    (payload: Record<string, unknown>, matcher: SchemaMatcher = 'name') => {
      if (!payload || typeof payload !== 'object') return 0;
      const entries = Object.entries(payload);
      if (entries.length === 0) return 0;

      const nextSchemasList = cloneSchemasListShallow(schemasList);
      let touched = 0;

      nextSchemasList.forEach((page) => {
        page.forEach((schema) => {
          const cfg = getSchemaDesignerConfig(schema, designerEngine);
          const lookupKey =
            matcher === 'id'
              ? schema.id
              : matcher === 'name'
                ? schema.name
                : matcher === 'identity'
                  ? cfg?.identity?.key
                  : cfg?.prefill?.sourceKey;
          if (!lookupKey) return;
          if (!Object.prototype.hasOwnProperty.call(payload, lookupKey)) return;
          const value = payload[lookupKey];
          if (value === undefined || value === null) return;
          const nextValue = String(value);
          if (schema.content === nextValue) return;
          schema.content = nextValue;
          touched++;
        });
      });

      if (touched > 0) {
        setSchemasList(nextSchemasList);
        pushTemplateUpdate(schemasList2template(nextSchemasList, activeBasePdf));
      }

      return touched;
    },
    [activeBasePdf, designerEngine, pushTemplateUpdate, schemasList],
  );

  const updatePage = useCallback((sl: SchemaForUI[][], newPageCursor: number) => {
    setSchemasList(sl);
    setPageCursor(newPageCursor);
    const newTemplate = schemasList2template(sl, activeBasePdf);
    pushTemplateUpdate(newTemplate);

    onPageCursorChange(newPageCursor, sl.length);

    setTimeout(() => {
      scrollPageIntoView(newPageCursor);
    }, 0);
  }, [activeBasePdf, onPageCursorChange, pushTemplateUpdate, scrollPageIntoView]);

  const handleDuplicatePageAfter = useCallback(() => {
    const duplicatedPageSchemas = cloneDeep(currentPageSchemas).map((schema) =>
      applySchemaCollaborativeDefaults(
        schema,
        createSchemaCreationContext({
          fileId: activeDocumentId || null,
          pageIndex: pageCursor + 1,
          pageNumber: pageCursor + 2,
          totalPages: schemasList.length + 1,
          timestamp: Date.now(),
          collaboration: {
            actorId: collaborationContext.actorId,
            ownerRecipientId: collaborationContext.ownerRecipientId,
            ownerRecipientIds: collaborationContext.ownerRecipientIds,
            ownerRecipientName: collaborationContext.ownerRecipientName,
            ownerColor: collaborationContext.ownerColor,
            userColor: collaborationContext.userColor,
          },
        }),
        designerEngine,
      ),
    );
    duplicatedPageSchemas.forEach((schema) => {
      schema.state = 'draft';
      schema.lock = undefined;
    });
    const nextSchemasList = insertPageSchemas(schemasList, pageCursor + 1, duplicatedPageSchemas);
    updatePage(nextSchemasList, pageCursor + 1);
  }, [
    activeDocumentId,
    collaborationContext,
    currentPageSchemas,
    designerEngine,
    pageCursor,
    schemasList,
    updatePage,
  ]);

  const emitActiveDocumentChange = useCallback(
    (document: UploadedPdfDocument | null) => {
      const handler = (options as Record<string, unknown>).onActiveDocumentChange;
      if (typeof handler === 'function') {
        handler(document?.id || null, document);
      }
    },
    [options],
  );

  const runtimeApi: DesignerRuntimeApi = useMemo(
    () => ({
      undo: undoExternal,
      redo: redoExternal,
      setZoom: setZoomExternal,
      getZoom: () => zoomLevel,
      fitToWidth: (page?: number) => applyViewportMode('fit-width', page),
      fitToPage: (page?: number) => applyViewportMode('fit-page', page),
      fitToDevice: (page?: number) => applyViewportMode('auto', page),
      setViewportMode: (mode: ViewportMode) => applyViewportMode(mode),
      getViewportMode: () => viewportMode,
      getCanvasMetrics,
      setPage: (page: number) => setPageCursorWithScroll(Math.max(0, page - 1)),
      getPage: () => pageCursor + 1,
      nextPage: () => setPageCursorWithScroll((currentPage) => currentPage + 1),
      prevPage: () => setPageCursorWithScroll((currentPage) => currentPage - 1),
      centerPage: (page?: number) => {
        const targetPage = resolveTargetPageIndex(page);
        setPageCursorWithScroll(targetPage);
      },
      setSidebarOpen: (open: boolean) => {
        setSidebarOpen(Boolean(open));
        emitDesignerEvent({
          type: 'designer.action.sidebar.set',
          source: 'designer',
          component: 'Designer',
          value: Boolean(open),
        });
      },
      toggleSidebar: () => {
        setSidebarOpen((prev) => !prev);
        emitDesignerEvent({
          type: 'designer.action.sidebar.toggle',
          source: 'designer',
          component: 'Designer',
        });
      },
      focusField: focusFieldExternal,
      highlightField: focusFieldExternal,
      getSelectedSchemaIds: () =>
        [...new Set(resolveActiveSchemasGlobal().map((schema) => String(schema.id || '').trim()).filter(Boolean))],
      selectSchemas: (ids: string[], mode = 'replace') => {
        selectSchemasByIds(ids, { mode });
      },
      clearSelection: () => {
        pendingSelectionIdsRef.current = null;
        setActiveElements([]);
        setHoveringSchemaId(null);
        onEditEnd();
      },
      addSchema: (schema: Schema) => {
        const schemaId = schema?.id ? String(schema.id) : null;
        emitDesignerEvent({
          type: 'designer.action.schema.add',
          source: 'designer',
          component: 'Designer',
          schemaId,
          details: { schemaType: schema?.type, schemaName: schema?.name },
        });
        addSchemaAtCenter(cloneDeep(schema));
      },
      addSchemaByType: (schemaType: string) => {
        emitDesignerEvent({
          type: 'designer.action.schema.add-by-type',
          source: 'designer',
          component: 'Designer',
          value: schemaType,
        });
        addSchemaByType(schemaType);
      },
      removeSchemas: (schemaIds: string[]) => {
        removeSchemas(schemaIds);
      },
      duplicateSchemas: (schemaIds: string[]) => {
        const normalizedIds = normalizeSchemaIds(schemaIds);
        if (!normalizedIds.length) return;
        const idSet = new Set(normalizedIds);
        let targetPageIndex = pageCursor;
        for (let index = 0; index < schemasList.length; index++) {
          if ((schemasList[index] || []).some((schema) => schemaMatchesAnyId(schema, idSet))) {
            targetPageIndex = index;
            break;
          }
        }
        const pageSchemas = schemasList[targetPageIndex] || [];
        const selectedSchemas = pageSchemas.filter((schema) => schemaMatchesAnyId(schema, idSet));
        if (!selectedSchemas.length) return;
        const clones = duplicateSchemasFromClipboard(selectedSchemas, {
          pageIndex: targetPageIndex,
          pageSize: pageSizes[targetPageIndex],
          pageCount: schemasList.length,
          fileId: activeDocumentId || null,
          collaborationContext: {
            fileId: collaborationContext.fileId || null,
            actorId: collaborationContext.actorId || null,
            ownerRecipientId: collaborationContext.ownerRecipientId || null,
            ownerRecipientIds: collaborationContext.ownerRecipientIds,
            ownerRecipientName: collaborationContext.ownerRecipientName || null,
            ownerColor: collaborationContext.ownerColor || null,
            userColor: collaborationContext.userColor || null,
          },
          existingSchemas: pageSchemas,
        });
        if (!clones.length) return;
        pendingSelectionIdsRef.current = clones.map((schema) => schema.id);
        commitSchemas([...pageSchemas, ...clones], targetPageIndex);
      },
      duplicatePage: () => {
        emitDesignerEvent({
          type: 'designer.action.page.duplicate',
          source: 'designer',
          component: 'Designer',
          pageIndex: pageCursor,
        });
        handleDuplicatePageAfter();
      },
      setActiveDocument: (documentId: string) => {
        const targetDocumentId = String(documentId || '').trim();
        if (!targetDocumentId || targetDocumentId === activeDocumentId) return;
        const targetDoc = uploadedDocumentsRef.current.find((doc) => doc.id === targetDocumentId);
        if (!targetDoc) return;
        onEditEnd();
        persistActiveDocumentSnapshot('runtime.setActiveDocument');
        setActiveDocumentId(targetDoc.id);
        emitActiveDocumentChange(targetDoc);
        void loadDocumentIntoCanvas(targetDoc, 0);
      },
      validate: () =>
        Promise.resolve(
          validateTemplate({
            schemasByPage: schemasList,
            pageSizes: pageSizes.map((size) => ({ width: size.width, height: size.height })),
            recipients: collaborationContext.recipientOptions.map((recipient) => ({
              id: recipient.id,
              name: recipient.name,
            })),
          }),
        ),
      setCanvasFeatureToggle: (key: keyof CanvasFeatureToggles, value: boolean) => {
        setCanvasFeatureOverrides((prev) => ({ ...prev, [key]: Boolean(value) }));
        emitDesignerEvent({
          type: 'designer.action.canvas-feature-toggle',
          source: 'designer',
          component: 'Designer',
          value: Boolean(value),
          details: { key },
        });
      },
      getCanvasFeatureToggles: () => ({ ...canvasFeatureToggles }),
      getSchemaConfig: (schemaIdOrName, matcher = 'id') => {
        const location = findSchemaLocation(schemaIdOrName, matcher);
        if (!location) return null;
        const schema = schemasList[location.pageIndex]?.[location.schemaIndex];
        if (!schema) return null;
        return getSchemaDesignerConfig(schema, designerEngine) || null;
      },
      setSchemaConfig: (schemaIdOrName, patch, matcher = 'id') => {
        const location = findSchemaLocation(schemaIdOrName, matcher);
        if (!location) return false;
        const target = schemasList[location.pageIndex]?.[location.schemaIndex];
        if (!target) return false;

        const next = cloneSchemasListShallow(schemasList);
        next[location.pageIndex] = next[location.pageIndex].slice();
        next[location.pageIndex][location.schemaIndex] = mergeSchemaDesignerConfig(
          target,
          patch || {},
          designerEngine,
        );
        setSchemasList(next);
        pushTemplateUpdate(schemasList2template(next, activeBasePdf));
        emitDesignerEvent({
          type: 'designer.action.schema.config-set',
          source: 'designer',
          component: 'Designer',
          schemaId: target.id,
          patch: patch as Record<string, unknown>,
          details: { matcher },
        });
        return true;
      },
      applyExternalPrefill: (payload, matcher = 'name') => {
        const result = applyExternalPrefill(payload, matcher);
        emitDesignerEvent({
          type: 'designer.action.prefill.apply',
          source: 'runtime',
          component: 'Designer',
          value: payload,
          details: { matcher, affectedCount: result },
        });
        return result;
      },
    }),
    [
      applyExternalPrefill,
      addSchemaAtCenter,
      addSchemaByType,
      canvasFeatureToggles,
      collaborationContext.actorId,
      collaborationContext.fileId,
      collaborationContext.ownerColor,
      collaborationContext.ownerRecipientId,
      collaborationContext.ownerRecipientIds,
      collaborationContext.ownerRecipientName,
      collaborationContext.recipientOptions,
      collaborationContext.userColor,
      activeDocumentId,
      commitSchemas,
      emitDesignerEvent,
      emitActiveDocumentChange,
      handleDuplicatePageAfter,
      applyViewportMode,
      loadDocumentIntoCanvas,
      designerEngine,
      findSchemaLocation,
      focusFieldExternal,
      getCanvasMetrics,
      activeBasePdf,
      onEditEnd,
      pageCursor,
      pageSizes,
      pendingSelectionIdsRef,
      persistActiveDocumentSnapshot,
      redoExternal,
      removeSchemas,
      resolveTargetPageIndex,
      resolveActiveSchemasGlobal,
      pushTemplateUpdate,
      schemasList,
      selectSchemasByIds,
      setActiveDocumentId,
      setActiveElements,
      setHoveringSchemaId,
      viewportMode,
      setPageCursorWithScroll,
      setSchemasList,
      setZoomExternal,
      undoExternal,
      uploadedDocumentsRef,
      zoomLevel,
    ],
  );

  useEffect(() => {
    onApiReady?.(runtimeApi);
    return () => onApiReady?.(null);
  }, [onApiReady, runtimeApi]);

  const componentBridge = useMemo(
    () => ({
      runtime: runtimeApi,
      view: {
        pageCursor,
        totalPages: schemasList.length,
        zoomLevel,
        collaborationStatus: collaborationSync.status,
        collaborationPresenceCount: collaborationSync.presence.length,
        collaborationHistoryCount: collaborationSync.history.length,
        viewportMode,
        sidebarOpen,
        isSchemaDragging,
        isDraggingOverCanvas,
        activeSchemaIds: activeElementIds,
        hoveringSchemaId,
        interactionPhase: interactionState.phase,
        interactionCount: interactionState.selectionCount,
        isDragging: interactionState.isDragging,
        isResizing: interactionState.isResizing,
        isRotating: interactionState.isRotating,
      },
    }),
    [
      activeElementIds,
      interactionState.isDragging,
      interactionState.isResizing,
      interactionState.isRotating,
      interactionState.phase,
      interactionState.selectionCount,
      hoveringSchemaId,
      isDraggingOverCanvas,
      isSchemaDragging,
      pageCursor,
      runtimeApi,
      schemasList.length,
      sidebarOpen,
      viewportMode,
      zoomLevel,
      collaborationSync.history.length,
      collaborationSync.presence.length,
      collaborationSync.status,
    ],
  );

  const onChangeHoveringSchemaId = (id: string | null) => {
    setHoveringSchemaId(id);
    emitDesignerEvent({
      type: 'designer.hover.changed',
      source: 'sidebar',
      component: 'Sidebar',
      schemaId: id,
      value: id,
    });
  };

  const isSchemaDragActive = (active: SchemaDragActiveLike) => {
    const data = (active?.data?.current || {}) as SchemaDragSourceData;
    return Boolean(data?.schema && data?.type);
  };

  const resetSchemaDragState = useCallback(() => {
    unlockDesignerSidebarScroll(sidebarScrollLockRef.current);
    sidebarScrollLockRef.current = null;
    schemaDragStartPointRef.current = null;
    lastDragPointerRef.current = null;
    activeDragDataRef.current = null;
    setIsSchemaDragging(false);
    setIsDraggingOverCanvas(false);
    setIsDraggingOverPage(false);
    setDropValid(false);
    setActiveDragData(null);
  }, []);

  const syncSchemaDragState = useCallback((next: SchemaDragSession | null) => {
    activeDragDataRef.current = next;
    setActiveDragData(next);
    setIsDraggingOverCanvas(Boolean(next?.isOverCanvas));
    setIsDraggingOverPage(Boolean(next?.isOverPage));
    setDropValid(Boolean(next?.dropValid));
  }, []);

  const releaseSidebarScrollLock = useCallback(() => {
    unlockDesignerSidebarScroll(sidebarScrollLockRef.current);
    sidebarScrollLockRef.current = null;
  }, []);

  const applySidebarScrollLock = useCallback(() => {
    if (sidebarScrollLockRef.current) return;
    sidebarScrollLockRef.current = lockDesignerSidebarScroll(designerRootRef.current);
  }, []);

  useEffect(() => {
    const root = designerRootRef.current;
    if (root) {
      root.dataset.schemaDragging = isSchemaDragging ? 'true' : 'false';
      root.dataset.sidebarScrollLocked = isSchemaDragging ? 'true' : 'false';
    }
    if (isSchemaDragging) {
      applySidebarScrollLock();
    } else {
      releaseSidebarScrollLock();
    }

    return () => {
      if (!isSchemaDragging) {
        releaseSidebarScrollLock();
      }
    };
  }, [applySidebarScrollLock, isSchemaDragging, releaseSidebarScrollLock]);

  useEffect(() => {
    if (!isSchemaDragging) return;

    const updatePointer = (event: Event | null | undefined) => {
      const point = extractClientPoint(event);
      if (point) {
        lastDragPointerRef.current = point;
      }
    };

    const handlePointerMove = (event: Event) => updatePointer(event);

    window.addEventListener('pointermove', handlePointerMove, true);
    window.addEventListener('mousemove', handlePointerMove, true);
    window.addEventListener('touchmove', handlePointerMove, true);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove, true);
      window.removeEventListener('mousemove', handlePointerMove, true);
      window.removeEventListener('touchmove', handlePointerMove, true);
    };
  }, [isSchemaDragging]);

  useEffect(
    () => () => {
      if (dropCommitTimerRef.current) clearTimeout(dropCommitTimerRef.current);
    },
    [],
  );

  // Track the last pointerdown that lands over a page, in page-local mm. Used as
  // the anchor for rigid-group paste. Clicks outside any page clear the anchor so
  // paste falls back to a fixed offset instead of pasting off the PDF.
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const handleCanvasPointerDown = (event: PointerEvent) => {
      const target = resolvePointerDropTarget({
        clientX: event.clientX,
        clientY: event.clientY,
        paperRefs: paperRefs.current,
        pageSizes,
        scale,
        activeDocumentId,
        canvasElement: canvasRef.current,
        pageCursor,
      });
      if (target.isOverPage && target.schemaPointMm && target.pageIndex >= 0) {
        lastCanvasPointerRef.current = {
          pageIndex: target.pageIndex,
          pageNumber: target.pageNumber,
          pointMm: { x: target.schemaPointMm.x, y: target.schemaPointMm.y },
          clientX: event.clientX,
          clientY: event.clientY,
          timestamp: Date.now(),
        };
      } else {
        lastCanvasPointerRef.current = null;
      }
    };
    canvasEl.addEventListener('pointerdown', handleCanvasPointerDown, true);
    return () => canvasEl.removeEventListener('pointerdown', handleCanvasPointerDown, true);
  }, [activeDocumentId, pageCursor, pageSizes, paperRefs, scale]);

  // After a paste/duplicate commit, re-select the newly created schemas once they
  // render (keyed on schemasList so it runs post-render — no timers involved).
  useEffect(() => {
    const ids = pendingSelectionIdsRef.current;
    if (!ids || !ids.length) return;
    const selector = (id: string) =>
      typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
        ? `[data-schema-id="${CSS.escape(id)}"]`
        : `[data-schema-id="${id.replace(/"/g, '\\"')}"]`;
    const elements: HTMLElement[] = [];
    for (const id of ids) {
      let element: HTMLElement | null = null;
      for (const paper of paperRefs.current) {
        element = paper?.querySelector<HTMLElement>(selector(id)) || null;
        if (element) break;
      }
      if (element && element.classList.contains(SELECTABLE_CLASSNAME)) elements.push(element);
    }
    if (elements.length === ids.length) {
      pendingSelectionIdsRef.current = null;
      setActiveElements(elements);
      setHoveringSchemaId(null);
    }
  }, [schemasList, paperRefs]);

  const resolveSchemaDragSession = useCallback(
    (active: SchemaDragActiveLike, pointer: { x: number; y: number }) => {
      const data = (active?.data?.current || {}) as SchemaDragSourceData;
      const schema = cloneDeep(data.schema || (active?.data?.current as Schema | undefined));
      if (!schema) return null;

      const startPoint = schemaDragStartPointRef.current;
      const projectedPoint =
        lastDragPointerRef.current &&
        (!startPoint ||
          lastDragPointerRef.current.x !== startPoint.x ||
          lastDragPointerRef.current.y !== startPoint.y)
          ? lastDragPointerRef.current
          : pointer;
      const resolvedTarget = resolvePointerDropTarget({
        clientX: projectedPoint.x,
        clientY: projectedPoint.y,
        paperRefs: paperRefs.current,
        pageSizes,
        scale,
        activeDocumentId,
        canvasElement: canvasRef.current,
        pageCursor,
        preferredPageIndex: activeDragDataRef.current?.pageIndex ?? null,
      });
      const schemaWidthMm = Number(schema.width || 45);
      const schemaHeightMm = Number(schema.height || 10);
      const sizePreview = {
        width: Math.max(120, Math.min(180, Math.round(schemaWidthMm * ZOOM * scale))),
        height: Math.max(72, Math.min(180, Math.round(schemaHeightMm * ZOOM * scale))),
      };
      const ownerColor = (schema as SchemaForUI & { ownerColor?: string | null }).ownerColor || collaborationContext.ownerColor || designerEngine.collaboration?.actorColor || undefined;
      const resolvedPageIndex = Math.max(0, resolvedTarget.pageIndex);
      const pageSize = pageSizes[resolvedPageIndex] || pageSizes[pageCursor] || { width: 0, height: 0 };
      const candidatePoint = resolvedTarget.schemaPointMm
        ? { x: resolvedTarget.schemaPointMm.x, y: resolvedTarget.schemaPointMm.y }
        : null;
      const collisionScopedSchemas = candidatePoint
        ? filterSchemasByCollisionScope(schemasList[resolvedPageIndex] || [], schema as SchemaForUI, {
            ownerRecipientId: collaborationContext.ownerRecipientId,
            ownerRecipientIds: collaborationContext.ownerRecipientIds,
            fileId: activeDocumentId || null,
            pageNumber: resolvedPageIndex + 1,
          })
        : [];
      const dropPointMm =
        candidatePoint && resolvedTarget.paperRect
          ? resolveSmartDropPosition({
              candidate: candidatePoint,
              pageSize,
              schemaSize: {
                width: schemaWidthMm,
                height: schemaHeightMm,
              },
              existingSchemas: collisionScopedSchemas,
            })
          : candidatePoint;

      const preview: SchemaDragSession = {
        pointer: projectedPoint,
        dropPointMm,
        pageIndex: resolvedTarget.pageIndex,
        isOverCanvas: resolvedTarget.isOverCanvas,
        isOverPage: resolvedTarget.isOverPage,
        dropValid: resolvedTarget.dropValid,
        schema,
        type: data.type || schema.type || 'schema',
        label: schema.name || data.type || schema.type || 'Campo',
        ownerColor,
        sizePreview,
      };

      return {
        preview,
        target: resolvedTarget,
      };
    },
    [
      activeDocumentId,
      collaborationContext.ownerColor,
      collaborationContext.ownerRecipientId,
      collaborationContext.ownerRecipientIds,
      designerEngine.collaboration?.actorColor,
      pageCursor,
      pageSizes,
      paperRefs,
      scale,
      schemasList,
    ],
  );

  function handleRemovePage() {
    if (pageCursor === 0) return;
    // Excepción a: la confirmación es síncrona y su resultado corta el
    // flujo antes de mutar `schemasList`. `Modal.confirm` de antd es asíncrono y
    // obligaría a reestructurar el borrado de página en callbacks.
    
    if (!window.confirm(i18n('removePageConfirm'))) return;

    const nextSchemasList = removePageSchemas(schemasList, pageCursor);
    updatePage(nextSchemasList, pageCursor - 1);
  }

  function handleAddPageAfter() {
    const nextSchemasList = insertPageSchemas(schemasList, pageCursor + 1, []);
    updatePage(nextSchemasList, pageCursor + 1);
  }

  const handleToggleCanvasFeature = useCallback((key: keyof CanvasFeatureToggles) => {
    setCanvasFeatureOverrides((prev) => {
      const currentValue = prev[key] ?? designerEngine.canvas?.featureToggles?.[key] ?? true;
      return {
        ...prev,
        [key]: !currentValue,
      };
    });
  }, [designerEngine.canvas?.featureToggles]);

  const handleUploadPdfClick = useCallback(() => {
    pdfUploadInputRef.current?.click();
  }, []);

  const handlePdfUploadChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const files = Array.from(input.files || []);
      if (files.length === 0) {
        input.value = '';
        return;
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;

        const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
        if (!isPdf) {
          message.error(`Selecciona un archivo PDF valido: ${file.name}`);
          continue;
        }

        try {
          const buffer = await file.arrayBuffer();
          const pdfPages = await pdf2size(buffer.slice(0));
          const targetPageCount = Math.max(1, pdfPages.length || 1);
          const normalizedSchemas = Array.from({ length: targetPageCount }, () => [] as SchemaForUI[]);
          const uploadedBasePdf = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                resolve(reader.result);
                return;
              }
              reject(new Error('Invalid PDF data'));
            };
            reader.onerror = () => reject(reader.error || new Error('Failed to read PDF file'));
            reader.readAsDataURL(file);
          });
          const nextTemplate = normalizeTemplateSchemaPages(
            schemasList2template(normalizedSchemas, uploadedBasePdf),
            targetPageCount,
          );
          const safePageCursor = Math.max(0, Math.min(pageCursor, targetPageCount - 1));
          const newDocumentId = uuid();
          const docName = file.name?.trim() || `Documento ${uploadedDocuments.length + 1}`;
          const updatedAt = Date.now();

      setUploadedDocuments((prev) =>
        prev.concat({
          id: newDocumentId,
          name: docName,
          template: nextTemplate,
              pageCount: targetPageCount,
              updatedAt,
            }),
          );
          documentSchemasCacheRef.current.set(newDocumentId, normalizedSchemas);

          if (i === 0) {
            persistActiveDocumentSnapshot('document-upload');
          setActiveDocumentId(newDocumentId);
            emitActiveDocumentChange({
              id: newDocumentId,
              name: docName,
              template: nextTemplate,
              pageCount: targetPageCount,
              updatedAt,
            });
            setVisibleTemplate(nextTemplate);
            setSchemasList(materializeLoadedSchemasOwnership(normalizedSchemas));
            pushTemplateUpdate(nextTemplate, {
              documentId: newDocumentId,
              fileId: newDocumentId,
              pageCount: targetPageCount,
              source: 'document-upload',
              updatedAt,
            });
            setPageCursor(safePageCursor);
            onPageCursorChange(safePageCursor, normalizedSchemas.length);
            onEditEnd();
          }
        } catch (uploadError) {
          console.error('Failed to load uploaded PDF', uploadError);
          message.error('No se pudo cargar el PDF.');
        }
      }

      input.value = '';
    },
    [
      emitActiveDocumentChange,
      materializeLoadedSchemasOwnership,
      persistActiveDocumentSnapshot,
      pushTemplateUpdate,
      onEditEnd,
      onPageCursorChange,
      pageCursor,
      uploadedDocuments.length,
    ],
  );

  const handleDeleteDocument = useCallback(
    (documentId: string) => {
      setUploadedDocuments((prev) => {
        if (prev.length <= 1) return prev;
        const next = prev.filter((doc) => doc.id !== documentId);
        const deletingActive = documentId === activeDocumentId;
        if (deletingActive && next.length > 0) {
          const fallback = next[0];
          setActiveDocumentId(fallback.id);
          emitActiveDocumentChange(fallback);
          loadDocumentIntoCanvas(fallback, 0).catch(() => null);
        }
        documentSchemasCacheRef.current.delete(documentId);
        return next;
      });
    },
    [activeDocumentId, emitActiveDocumentChange, loadDocumentIntoCanvas],
  );

  useEffect(() => {
    if (isBlankPdf(activeBasePdf)) return;
    const targetPageCount = pageSizes.length;
    if (!Number.isFinite(targetPageCount) || targetPageCount <= 0) return;
    if (schemasList.length === targetPageCount) return;

    const normalizedSchemas = schemasList.map((page) => page.slice());
    if (normalizedSchemas.length > targetPageCount) {
      normalizedSchemas.length = targetPageCount;
    }
    while (normalizedSchemas.length < targetPageCount) {
      normalizedSchemas.push([]);
    }

    setSchemasList(materializeLoadedSchemasOwnership(normalizedSchemas));
    setPageCursor((prev) => Math.max(0, Math.min(prev, targetPageCount - 1)));
  }, [activeBasePdf, materializeLoadedSchemasOwnership, pageSizes.length, schemasList]);

  useEffect(() => {
    if (!activeDocumentId) return;
    if (canvasDocumentIdRef.current !== activeDocumentId) return;
    const nextSchemas = schemasList.map((page) => page.slice());
    const nextSchemasHash = stableHashSchemas(nextSchemas);
    const nextBasePdf = resolveStableDocumentBasePdf(activeDocumentId);
    const pageCount = Math.max(1, pageSizes.length || visibleTemplate.schemas.length || 1);
    const currentDocument = uploadedDocumentsRef.current.find((doc) => doc.id === activeDocumentId) || null;
    if (!currentDocument) return;

    if (
      lastCommittedSchemasHashRef.current === nextSchemasHash &&
      lastPersistedDocumentBasePdfRef.current === nextBasePdf &&
      currentDocument.pageCount === pageCount
    ) {
      return;
    }

    const currentTemplate = currentDocument.template || null;
    const currentSchemasHash = stableHashSchemas(currentTemplate?.schemas || []);
    const currentBasePdf = currentTemplate?.basePdf;
    if (currentSchemasHash === nextSchemasHash && currentBasePdf === nextBasePdf && currentDocument.pageCount === pageCount) {
      lastCommittedSchemasHashRef.current = nextSchemasHash;
      lastPersistedDocumentBasePdfRef.current = nextBasePdf;
      return;
    }

    const safeBasePdf = isValidRealBasePdf(visibleTemplateRef.current?.basePdf)
      ? visibleTemplateRef.current.basePdf
      : nextBasePdf;
    const safeTemplate = {
      ...visibleTemplateRef.current,
      basePdf: safeBasePdf,
    };

    documentSchemasCacheRef.current.set(activeDocumentId, nextSchemas);
    lastCommittedSchemasHashRef.current = nextSchemasHash;
    lastPersistedDocumentBasePdfRef.current = safeBasePdf;

    setUploadedDocuments((prev) => {
      const idx = prev.findIndex((doc) => doc.id === activeDocumentId);
      if (idx < 0) return prev;
      const current = prev[idx];
      const currentTemplateSchemasHash = stableHashSchemas(current.template?.schemas || []);
      const currentTemplateBasePdf = current.template?.basePdf;
      if (
        currentTemplateSchemasHash === nextSchemasHash &&
        currentTemplateBasePdf === safeBasePdf &&
        current.pageCount === pageCount
      ) {
        return prev;
      }
      const next = [...prev];
      next[idx] = {
        ...current,
        template: safeTemplate,
        pageCount,
        updatedAt: Date.now(),
      };
      return next;
    });
  }, [activeDocumentId, pageSizes.length, resolveStableDocumentBasePdf, schemasList, visibleTemplate]);

  useEffect(() => {
    if (!activeDocumentId) {
      canvasDocumentIdRef.current = null;
      pendingCanvasDocumentIdRef.current = null;
      return;
    }

    if (canvasDocumentIdRef.current === activeDocumentId) return;
    if (pendingCanvasDocumentIdRef.current === activeDocumentId) return;

    const targetDoc = uploadedDocuments.find((doc) => doc.id === activeDocumentId);
    if (!targetDoc) return;
    void loadDocumentIntoCanvas(targetDoc, 0);
  }, [activeDocumentId, uploadedDocuments, loadDocumentIntoCanvas]);

  useEffect(() => {
    if (internalTemplateSyncRef.current) {
      internalTemplateSyncRef.current = false;
      return;
    }
    if (activeDocumentId && uploadedDocuments.length > 0) return;
    const normalizedIncomingTemplate = normalizeTemplateSchemaPages(
      template,
      Math.max(1, pageSizes.length || template.schemas.length || 1),
    );
    setVisibleTemplate(normalizedIncomingTemplate);
    void updateTemplate(normalizedIncomingTemplate);
  }, [activeDocumentId, pageSizes.length, template, updateTemplate, uploadedDocuments.length]);

  useEffect(() => {
    const nextTemplate = pendingCollaborativeTemplateRef.current;
    if (!nextTemplate) return;
    pendingCollaborativeTemplateRef.current = null;
    pushTemplateUpdate(nextTemplate);
  }, [pushTemplateUpdate, schemasList]);

  const pageManipulation = isBlankPdf(activeBasePdf)
    ? { addPageAfter: handleAddPageAfter, removePage: handleRemovePage }
    : {};
  const pageItems = useMemo<DesignerDocumentItem[]>(() => {
    if (uploadedDocuments.length > 0) {
      return uploadedDocuments.flatMap((doc, docIndex) => {
        const pageTotal = Math.max(1, doc.pageCount || 1);
        return Array.from({ length: pageTotal }).map((_, pageIndex) => ({
          id: `${doc.id}::page-${pageIndex + 1}`,
          name: `${doc.name} · Pagina ${pageIndex + 1}`,
          pageLabel: `${docIndex + 1}.${pageIndex + 1}`,
          selected: doc.id === activeDocumentId && pageIndex === pageCursor,
        }));
      });
    }

    return pageSizes.map((pageSize, index) => ({
      id: `page-${index + 1}`,
      name: `Pagina ${index + 1}`,
      pageLabel: `${index + 1}`,
      previewSrc: backgrounds[index] || null,
      selected: index === pageCursor,
      meta:
        Number.isFinite(pageSize?.width) && Number.isFinite(pageSize?.height)
          ? `${round(pageSize.width, 1)} x ${round(pageSize.height, 1)} mm`
          : undefined,
    }));
  }, [activeDocumentId, backgrounds, pageCursor, pageSizes, uploadedDocuments]);
  const uploadedDocumentItems = useMemo<DesignerDocumentItem[]>(
    () =>
      uploadedDocuments.map((doc, index) => ({
        id: doc.id,
        name: doc.name || `Documento ${index + 1}`,
        pageLabel: `${index + 1}`,
        selected: doc.id === activeDocumentId,
        meta: `${doc.pageCount} página${doc.pageCount === 1 ? '' : 's'}`,
      })),
    [activeDocumentId, uploadedDocuments],
  );
  const fallbackBaseDocumentItem = useMemo<DesignerDocumentItem | null>(() => {
    if (uploadedDocuments.length > 0 || isBlankPdf(activeBasePdf)) return null;

    const fallbackName = getBasePdfDisplayName(activeBasePdf) || 'Documento activo';
    const fallbackPageCount = Math.max(1, pageSizes.length || schemasList.length || 1);

    return {
      id: '__active-base-pdf__',
      name: fallbackName,
      pageLabel: '1',
      selected: true,
      meta: `${fallbackPageCount} pagina${fallbackPageCount === 1 ? '' : 's'}`,
    };
  }, [activeBasePdf, pageSizes.length, schemasList.length, uploadedDocuments.length]);
  const documentItems = useMemo<DesignerDocumentItem[]>(
    () => (uploadedDocumentItems.length > 0 ? uploadedDocumentItems : fallbackBaseDocumentItem ? [fallbackBaseDocumentItem] : []),
    [fallbackBaseDocumentItem, uploadedDocumentItems],
  );
  const rightSidebarContextHeader = useMemo<RightSidebarContextHeader>(() => {
    return (ctx: RightSidebarContextHeaderContext) =>
      renderRightSidebarContextHeader(ctx, {
        activeDocumentId,
        uploadedDocuments,
        fallbackBaseDocumentItem,
        pageCursor,
        pageItemsLength: pageItems.length,
        activeElementsLength: activeElements.length,
      });
  }, [
    activeDocumentId,
    activeElements.length,
    pageCursor,
    pageItems.length,
    fallbackBaseDocumentItem,
    uploadedDocuments,
  ]);
  if (error) {
    // Pass the error directly to ErrorScreen
    return <ErrorScreen size={size} error={error} />;
  }
  const {
    className: leftSidebarEngineClassName,
    extensions: leftSidebarEngineExtensions,
    ...leftSidebarEngineProps
  } = leftSidebarEngine || {};
  const {
    className: rightSidebarEngineClassName,
    extensions: rightSidebarEngineExtensions,
    ...rightSidebarEngineProps
  } = rightSidebarEngine || {};
  const leftSidebarResolvedProps = Object.assign({}, leftSidebarEngineProps, {
    extensions: designerEngine.extensions || leftSidebarEngineExtensions,
  });
  const rightSidebarResolvedProps = Object.assign({}, rightSidebarEngineProps, {
    extensions: designerEngine.extensions || rightSidebarEngineExtensions,
  });

  const leftSidebarNode = leftSidebarVisible ? (
    <LeftSidebar
      scale={scale}
      basePdf={activeBasePdf}
      activeRecipientColor={
        designerEngine.extensions?.resolveRecipientColor?.(collaborationContext.activeRecipient || null) ||
        (typeof options.activeRecipientColor === 'string' && options.activeRecipientColor.trim()
          ? options.activeRecipientColor.trim()
          : null) ||
        collaborationContext.userColor ||
        collaborationContext.ownerColor ||
        collaborationContext.activeRecipient?.color ||
        null
      }
      variant={leftSidebarVariant}
      useLayoutFrame={leftSidebarUseLayout}
      showSearch={leftSidebarSearchable}
      showItemMeta={leftSidebarShowItemMeta}
      showItemDescription={leftSidebarShowItemDescription}
      showTechnicalLabels={leftSidebarShowTechnicalLabels}
      showCatalogViewSwitcher={leftSidebarShowCatalogViewSwitcher}
      detached={leftSidebarDetached}
      presentation={leftSidebarPresentation}
      responsiveBreakpoint={Number.isFinite(leftSidebarResponsiveBreakpoint) ? leftSidebarResponsiveBreakpoint : 1080}
      viewportWidth={viewportWidth}
      catalogLayout={catalogLayoutOption}
      onCatalogLayoutChange={onCatalogLayoutChangeOption}
      onWidthChange={setLeftSidebarLiveWidth}
      className={
        [
          typeof options.leftSidebarClassName === 'string' ? options.leftSidebarClassName : '',
          typeof leftSidebarEngineClassName === 'string' ? leftSidebarEngineClassName : '',
        ]
          .filter(Boolean)
          .join(' ') || undefined
      }
      onSchemaClick={(schema) => {
        addSchemaAtCenter(cloneDeep(schema));
      }}
      bridge={componentBridge}
      {...leftSidebarResolvedProps}
    />
  ) : null;

  const detachedSidebarNode =
    leftSidebarVisible && leftSidebarDetached && leftSidebarNode ? (
      <DetachedHost baseClass="left-sidebar-host" detachedClassName={leftSidebarDetachedClassName}>
        {leftSidebarNode}
      </DetachedHost>
    ) : null;
  const leftSidebarContainer =
    leftSidebarContainerSelector && typeof document !== 'undefined'
      ? document.querySelector(leftSidebarContainerSelector)
      : null;
  const detachedSidebarRendered =
    leftSidebarDetached && detachedSidebarNode
      ? leftSidebarContainer
        ? createPortal(detachedSidebarNode, leftSidebarContainer)
        : detachedSidebarNode
      : null;
  const rightSidebarDomId = DESIGNER_CLASSNAME + 'right-sidebar-panel';

  const rightSidebarNode = (
    <RightSidebar
      rootId={rightSidebarDomId}
      hoveringSchemaId={hoveringSchemaId}
      onChangeHoveringSchemaId={onChangeHoveringSchemaId}
      /*
       * Excepción a react-hooks/refs: la barra lateral necesita la altura real
       * del canvas. En el primer render vale 0 y se recalcula tras el commit,
       * que es el comportamiento que ya asume el layout.
       */
      height={canvasRef.current ? canvasRef.current.clientHeight : 0}
      size={size}
      pageSize={pageSizes[pageCursor] ?? { width: 0, height: 0 }}
      basePdf={activeBasePdf}
      activeElements={activeElements}
      schemasList={schemasList}
      schemas={schemasList[pageCursor] ?? []}
      changeSchemas={changeSchemas}
      onSortEnd={onSortEnd}
      onEdit={(id) => {
        const normalizedId = String(id || '').trim();
        const schema = schemasListRef.current
          .flat()
          .find((item) => item.id === normalizedId || String((item as { schemaUid?: string }).schemaUid || '').trim() === normalizedId);
        const resolvedSchemaId = String((schema as { schemaUid?: string } | undefined)?.schemaUid || schema?.id || normalizedId).trim();
        const selector =
          typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
            ? `[data-schema-id="${CSS.escape(resolvedSchemaId)}"]`
            : `[data-schema-id="${resolvedSchemaId.replace(/"/g, '\\"')}"]`;
        const editingElem = document.querySelector<HTMLElement>(selector);
        if (editingElem) {
          onEdit([editingElem]);
          return;
        }

        const fallbackElement = activeElements.find((element) => {
          const identity = resolveSchemaIdentityFromElement(element);
          return [identity.schemaId, identity.schemaUid, element.id].some((candidate) => String(candidate || '').trim() === normalizedId);
        });
        if (fallbackElement) {
          onEdit([fallbackElement]);
        }
      }}
      onEditEnd={onEditEnd}
      deselectSchema={onEditEnd}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      collaborationContext={collaborationContext}
      extensions={designerEngine.extensions}
      width={effectiveRightSidebarWidthRaw}
      detached={rightSidebarDetached}
      presentation={rightSidebarPresentation}
      responsiveBreakpoint={Number.isFinite(rightSidebarResponsiveBreakpoint) ? rightSidebarResponsiveBreakpoint : 1080}
      viewportWidth={viewportWidth}
      {...rightSidebarResolvedProps}
      useLayoutFrame={rightSidebarUseLayout}
      documents={
        documentItems.length > 0
          ? {
              items: documentItems,
              selectedId: activeDocumentId || fallbackBaseDocumentItem?.id || null,
              onSelect:
                uploadedDocumentItems.length > 0
                  ? async (id) => {
                      const targetDoc = uploadedDocuments.find((doc) => doc.id === id);
                      if (!targetDoc) return;
                      if (targetDoc.id === activeDocumentId) return;
                      onEditEnd();
                      persistActiveDocumentSnapshot('document-switch');
                      setActiveDocumentId(targetDoc.id);
                      emitActiveDocumentChange(targetDoc);
                      await loadDocumentIntoCanvas(targetDoc, 0);
                    }
                  : undefined,
              onUploadPdf: handleUploadPdfClick,
              onDelete: uploadedDocumentItems.length > 1 ? handleDeleteDocument : undefined,
              title: uploadedDocumentItems.length > 0 ? 'Documentos cargados' : 'Documento activo',
              emptyTitle: 'Todavía no hay documentos cargados. Sube un PDF para empezar.',
            }
          : undefined
      }
      pages={{
        items: pageItems,
        selectedId: pageItems.find((item) => item.selected)?.id || null,
        onSelect: async (id) => {
          if (id.includes('::page-')) {
            const [docId, pageRef] = id.split('::page-');
            const targetPageIndex = Math.max(0, Number(pageRef) - 1);
            const targetDoc = uploadedDocuments.find((doc) => doc.id === docId);
            if (!targetDoc) return;

            if (docId !== activeDocumentId) {
              onEditEnd();
              persistActiveDocumentSnapshot('page-document-switch');
              setActiveDocumentId(docId);
              emitActiveDocumentChange(targetDoc);
              await loadDocumentIntoCanvas(targetDoc, targetPageIndex);
              return;
            }

            setPageCursorWithScroll(targetPageIndex);
            return;
          }

          const pageIndex = pageItems.findIndex((item) => item.id === id);
          if (pageIndex >= 0) setPageCursorWithScroll(pageIndex);
        },
        onAdd: pageManipulation.addPageAfter,
        onUploadPdf: handleUploadPdfClick,
        title: 'Páginas',
        emptyTitle: 'Este documento aún no tiene páginas.',
      }}
      comments={commentsBridge}
      showDocumentsRail={pageItems.length > 0 || documentItems.length > 0}
      autoFocusDetail={true}
      viewMode={rightSidebarViewMode}
      onViewModeChange={(mode) => setRightSidebarViewMode(mode)}
      contextHeader={rightSidebarContextHeader}
      selectionCommands={selectionCommands}
      className={
        [
          typeof options.rightSidebarClassName === 'string' ? options.rightSidebarClassName : '',
          typeof rightSidebarEngineClassName === 'string' ? rightSidebarEngineClassName : '',
        ]
          .filter(Boolean)
          .join(' ') || undefined
      }
      bridge={componentBridge}
    />
  );
  const activeDragPageIndex = activeDragData?.pageIndex ?? pageCursor;
  const activeDragPaper = activeDragData ? paperRefs.current[activeDragPageIndex] || paperRefs.current[pageCursor] || null : null;
  const activeDragPaperRect = activeDragPaper ? activeDragPaper.getBoundingClientRect() : null;
  const activeDragSchemaSize = activeDragData
    ? {
        width: Math.max(1, Number(activeDragData.schema.width || 45)),
        height: Math.max(1, Number(activeDragData.schema.height || 10)),
      }
    : { width: 0, height: 0 };
  const activeDragPlugin = activeDragData ? pluginsRegistry.findByType(activeDragData.type) : null;
  const activeDragPlaceholderPoint = activeDragData?.dropPointMm || null;
  const dragOverlayPortal =
    activeDragData && typeof document !== 'undefined' ? (
      createPortal(
        <>
          {activeDragPaperRect && activeDragPlaceholderPoint ? (
            <SchemaDropPlaceholder
              label={activeDragData.label}
              xMm={activeDragPlaceholderPoint.x}
              yMm={activeDragPlaceholderPoint.y}
              widthMm={activeDragSchemaSize.width}
              heightMm={activeDragSchemaSize.height}
              zoom={scale}
              ownerColor={activeDragData.ownerColor || undefined}
              valid={activeDragData.dropValid}
              paperRect={{ left: activeDragPaperRect.left, top: activeDragPaperRect.top }}
            />
          ) : null}
          <SchemaDragPreview
            schemaType={activeDragData.type}
            icon={activeDragPlugin ? <PluginIcon plugin={activeDragPlugin} label={activeDragData.label} size={20} /> : null}
            pointer={activeDragData.pointer}
            ownerColor={activeDragData.ownerColor || undefined}
            isOverCanvas={activeDragData.isOverCanvas}
            isOverPage={activeDragData.isOverPage}
          />
        </>,
        document.body,
      )
    ) : null;
  const dropCommitFlashPortal =
    dropCommitFlash && typeof document !== 'undefined' ? (
      createPortal(
        <SchemaDropCommitFlash
          paperRect={paperRefs.current[dropCommitFlash.pageIndex] ? paperRefs.current[dropCommitFlash.pageIndex].getBoundingClientRect() : null}
          xMm={dropCommitFlash.point.x}
          yMm={dropCommitFlash.point.y}
          zoom={scale}
          ownerColor={dropCommitFlash.ownerColor || undefined}
          icon={
            (() => {
              const plugin = pluginsRegistry.findByType(dropCommitFlash.iconType);
              return plugin ? <PluginIcon plugin={plugin} label={dropCommitFlash.iconType} size={14} /> : null;
            })()
          }
        />,
        document.body,
      )
    ) : null;
  const detachedRightSidebarNode =
    rightSidebarDetached && rightSidebarNode ? (
      <DetachedHost baseClass="right-sidebar-host" detachedClassName={rightSidebarDetachedClassName}>
        {rightSidebarNode}
      </DetachedHost>
    ) : null;
  const rightSidebarContainer =
    rightSidebarContainerSelector && typeof document !== 'undefined'
      ? document.querySelector(rightSidebarContainerSelector)
      : null;
  const detachedRightSidebarRendered =
    rightSidebarDetached && detachedRightSidebarNode
      ? rightSidebarContainer
        ? createPortal(detachedRightSidebarNode, rightSidebarContainer)
        : detachedRightSidebarNode
      : null;

  return (
    <Root ref={designerRootRef} size={size} scale={scale}>
      <input
        ref={pdfUploadInputRef}
        id="sisad-pdfme-pdf-upload"
        type="file"
        accept="application/pdf,.pdf"
        multiple
        aria-label="Subir archivo PDF"
        style={{ display: 'none' }}
        onChange={handlePdfUploadChange}
      />
      {dragOverlayPortal}
      {dropCommitFlashPortal}
      <DndContext
        autoScroll={false}
        onDragStart={(event) => {
          if (isInspectorInteractiveTarget((event as { activatorEvent?: Event | null }).activatorEvent?.target || null)) {
            resetSchemaDragState();
            return;
          }
          if (!isSchemaDragActive(event?.active)) return;
          onEditEnd();
          setIsSchemaDragging(true);
          applySidebarScrollLock();
          const startPoint = extractClientPoint(event.activatorEvent as Event | null | undefined);
          schemaDragStartPointRef.current = startPoint;
          lastDragPointerRef.current = startPoint;
          if (!startPoint) {
            resetSchemaDragState();
            setIsSchemaDragging(true);
            return;
          }
          const resolved = resolveSchemaDragSession(event.active, startPoint);
          if (!resolved) {
            resetSchemaDragState();
            setIsSchemaDragging(true);
            return;
          }
          syncSchemaDragState(resolved.preview);
        }}
        onDragMove={(event) => {
          if (!isSchemaDragActive(event?.active)) {
            resetSchemaDragState();
            return;
          }
          if (!event.active) {
            resetSchemaDragState();
            return;
          }
          const startPoint = schemaDragStartPointRef.current;
          if (!startPoint) {
            resetSchemaDragState();
            return;
          }
          const latestPointer = lastDragPointerRef.current;
          const pointer = {
            x: latestPointer?.x ?? (startPoint.x + (event.delta?.x || 0)),
            y: latestPointer?.y ?? (startPoint.y + (event.delta?.y || 0)),
          };
          const resolved = resolveSchemaDragSession(event.active, pointer);
          if (!resolved) {
            resetSchemaDragState();
            return;
          }
          syncSchemaDragState(resolved.preview);
        }}
        onDragCancel={() => {
          resetSchemaDragState();
        }}
        onDragEnd={(event) => {
          if (isInspectorInteractiveTarget((event as { activatorEvent?: Event | null }).activatorEvent?.target || null)) {
            resetSchemaDragState();
            return;
          }
          if (!isSchemaDragActive(event?.active)) {
            resetSchemaDragState();
            return;
          }
          // Triggered after a schema is dragged & dropped from the left sidebar.
          if (!event.active) return;
          const active = event.active;
          const payload = (active.data.current || {}) as { schema?: Schema };
          const draggedSchema = cloneDeep(payload.schema || (active.data.current as Schema));
          if (!draggedSchema) return;
          const session = activeDragDataRef.current || activeDragData;
          if (!session?.dropValid || !session.dropPointMm) {
            resetSchemaDragState();
            return;
          }

          const pageIndex = Math.max(0, session.pageIndex);
          const pageSize = pageSizes[pageIndex] || pageSizes[pageCursor] || { width: 0, height: 0 };
          const existingSchemas = schemasList[pageIndex] || [];
          const schemaWidth = Number(draggedSchema.width || 45);
          const schemaHeight = Number(draggedSchema.height || 10);
          const schemaSize = { width: schemaWidth, height: schemaHeight };
          const collisionScopedSchemas = filterSchemasByCollisionScope(existingSchemas, draggedSchema as SchemaForUI, {
            ownerRecipientId: collaborationContext.ownerRecipientId,
            ownerRecipientIds: collaborationContext.ownerRecipientIds,
            fileId: activeDocumentId || null,
            pageNumber: pageIndex + 1,
          });
          const position = resolveSmartDropPosition({
            candidate: session.dropPointMm,
            pageSize,
            schemaSize,
            existingSchemas: collisionScopedSchemas,
          });
          const targetSchema = { ...draggedSchema, position };
          if (dropCommitTimerRef.current) clearTimeout(dropCommitTimerRef.current);
          setDropCommitFlash({
            pageIndex,
            point: position,
            ownerColor: session.ownerColor || collaborationContext.ownerColor || designerEngine.collaboration?.actorColor || null,
            iconType: session.type || draggedSchema.type || 'schema',
          });
          dropCommitTimerRef.current = setTimeout(() => {
            setDropCommitFlash(null);
          }, 180);
          if (pageIndex !== pageCursor) {
            setPageCursor(pageIndex);
          }
          addSchema(targetSchema, pageIndex, true);
          resetSchemaDragState();
        }}
      >
        <div
          className={`${DESIGNER_CLASSNAME}workspace box-border relative flex flex-auto flex-row items-stretch min-w-0 min-h-0 w-full`}
          style={workspaceGap !== undefined ? { gap: workspaceGap } : undefined}>
          {!leftSidebarDetached ? leftSidebarNode : null}
          <div
            // Sin `pr-` por el panel derecho: reservar espacio aquí encogería el
            // stage y movería el centro del papel al abrir el panel. Los paneles
            // son overlays; el stage ocupa siempre el workspace completo.
            // `flex-col` + `overflow-hidden` son obligatorios: el stage apila
            // CtlBar y canvas en columna y confina el scroll al canvas. Sin
            // ellos el chrome se coloca en fila y el papel deja de centrarse.
            className={`${DESIGNER_CLASSNAME}stage relative box-border flex flex-auto flex-col h-full w-full min-w-0 min-h-0 overflow-hidden`}
            // Insets publicados, no aplicados: describen cuánto ocupan los
            // paneles en los bordes para quien deba apartar chrome periférico.
            // El stage no los descuenta de su propia caja.
            data-chrome-inset-left={String(chromeInsets.left)}
            data-chrome-inset-right={String(chromeInsets.right)}
            data-left-sidebar={leftSidebarVisible ? 'visible' : 'hidden'}
            data-left-sidebar-mode={shouldReserveLeftSidebarSpace ? 'docked' : 'overlay'}
            data-left-sidebar-variant={leftSidebarVariant}
            data-left-sidebar-detached={leftSidebarDetached ? 'true' : 'false'}
            data-left-sidebar-layout={leftSidebarUseLayout ? 'frame' : 'default'}
            data-right-sidebar-detached={rightSidebarDetached ? 'true' : 'false'}
            data-layout-preset={layoutPreset}
            data-density={density}
            data-sidebar-open={sidebarOpen ? 'true' : 'false'}
            data-is-dragging={isSchemaDragging ? 'true' : 'false'}
            data-schema-dragging={isSchemaDragging ? 'true' : 'false'}
            data-schema-over-canvas={isDraggingOverCanvas ? 'true' : 'false'}
            data-schema-over-page={isDraggingOverPage ? 'true' : 'false'}
            data-drop-valid={dropValid ? 'true' : 'false'}
            data-is-idle={isIdle ? 'true' : 'false'}
            data-interaction-phase={interactionState.phase}
            data-interaction-count={String(interactionState.selectionCount)}
            data-interaction-dragging={interactionState.isDragging ? 'true' : 'false'}
            data-interaction-resizing={interactionState.isResizing ? 'true' : 'false'}
            data-interaction-rotating={interactionState.isRotating ? 'true' : 'false'}
            data-ui-state={
              interactionState.isDragging
                ? 'dragging'
                : interactionState.isResizing
                  ? 'resizing'
                  : interactionState.isRotating
                    ? 'rotating'
                    : interactionState.phase
            }
            style={{
              ...(canvasPadding !== undefined ? { padding: canvasPadding } : {}),
              // El ancho REAL del sidebar derecho se resuelve en JS (densidad/
              // viewport). Publicarlo en la var mantiene consistentes el padding
              // del canvas y el offset del CtlBar (evita que los botones queden
              // debajo del sidebar cuando el token estático difiere).
              ['--sisad-pdfme-rs-width' as string]: `${effectiveRightSidebarWidthRaw}px`,
            }}>
          <CtlBar
            size={workspaceSize}
            pageCursor={pageCursor}
            pageNum={pageSizes.length}
            setPageCursor={setPageCursorWithScroll}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            setZoom={setZoomExternal}
            interactionPhase={interactionState.phase}
            addPageAfter={handleAddPageAfter}
            duplicatePageAfter={handleDuplicatePageAfter}
            removePage={pageManipulation.removePage}
            onUndo={undoExternal}
            onRedo={redoExternal}
            onFitWidth={() => applyViewportMode('fit-width')}
            onFitPage={() => applyViewportMode('fit-page')}
            onOpenShortcuts={() => window.dispatchEvent(new CustomEvent('sisad-pdfme:shortcut-open-panel'))}
            documentStatus={isIdle ? 'Listo' : 'Editando'}
            onSave={handleSaveTemplate}
            saveStatus={saveStatus}
            onExport={exportTemplateExternal}
            sidebarOpen={sidebarOpen}
            featureToggles={{
              grid: canvasFeatureToggles.grid,
              guides: canvasFeatureToggles.guides,
              snapLines: canvasFeatureToggles.snapLines,
              padding: canvasFeatureToggles.padding,
            }}
            onToggleFeature={handleToggleCanvasFeature}
            selectionCount={activeElements.length}
            isGroupedSelection={(() => {
              if (activeElements.length < 2) return false;
              const activeIds = new Set(activeElements.map((el) => el.id));
              const pageSchemas = schemasList[pageCursor] || [];
              const active = pageSchemas.filter((s) => activeIds.has(s.id));
              if (active.length < 2) return false;
              const groupIds = active.map(
                (s) => ((s as { __designer?: { group?: { groupId?: string } } }).__designer?.group?.groupId),
              );
              return groupIds.every((g) => g != null && g === groupIds[0]);
            })()}
          />
          {!rightSidebarDetached ? rightSidebarNode : null}

          <Canvas
            ref={canvasRef}
            paperRefs={paperRefs}
            registerPaperRef={registerPaperRef}
            basePdf={activeBasePdf}
            hoveringSchemaId={hoveringSchemaId}
            onChangeHoveringSchemaId={onChangeHoveringSchemaId}
            height={size.height - RULER_HEIGHT * ZOOM}
            pageCursor={pageCursor}
            scale={scale}
            size={workspaceSize}
            pageSizes={pageSizes}
            backgrounds={backgrounds}
            activeElements={activeElements}
            schemasList={schemasList}
            renderedSchemasList={visibleSchemasList}
            topLevelComments={
              ((visibleTemplate as unknown as {
                pdfComments?: Array<{ anchor?: Record<string, unknown>; comment?: Record<string, unknown> }>;
              }).pdfComments) || []
            }
            activeDocumentId={activeDocumentId}
            changeSchemas={changeSchemas}
            sidebarOpen={sidebarOpen}
            sidebarWidth={rightSidebarWidth}
            preserveSidebarSpace={shouldReserveRightSidebarSpace}
            contentOffsetX={leftSidebarContentOffsetX}
            onEdit={onEdit}
            featureToggles={canvasFeatureToggles}
            styleOverrides={designerEngine.canvas?.styleOverrides}
          classNames={designerEngine.canvas?.classNames}
            useDefaultStyles={designerEngine.canvas?.useDefaultStyles ?? true}
            components={designerEngine.canvas?.components}
            bridge={componentBridge}
            externalSchemaDragActive={isSchemaDragging}
            canvasActions={{
              addPageAfter: pageManipulation.addPageAfter,
              uploadPdf: handleUploadPdfClick,
          }}
            selectionCommands={selectionCommands}
            collaborationContext={{
              actorId: collaborationContext.actorId,
              activeRecipientId: collaborationContext.activeRecipientId,
              activeRecipient: collaborationContext.activeRecipient,
              recipientNameMap: collaborationContext.recipientNameMap,
              canEditStructure: collaborationContext.canEditStructure,
            }}
            onInteractionStateChange={handleInteractionStateChange}
          />
          <CommentDialog
            open={commentDialogOpen}
            initialText={''}
            onClose={() => {
              setCommentDialogOpen(false);
              pendingAnchorRef.current = null;
            }}
            onSave={handleSaveComment}
          />
          </div>
        </div>
        {detachedSidebarRendered}
        {detachedRightSidebarRendered}
      </DndContext>
    </Root>
  );
};

export default TemplateEditor;

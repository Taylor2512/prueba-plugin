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
  removeById,
  removeTopLevelComment,
  Schema,
  SchemaForUI,
  ChangeSchemas,
  DesignerProps,
  Size,
  isBlankPdf,
  px2mm,
  upsertTopLevelComment,
  upsertById,
} from '@sisad-pdfme/common';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { pdf2size } from '@sisad-pdfme/converter';
import Renderer from '../Renderer.js';
import PluginIcon from './PluginIcon.js';
import RightSidebarDefault from './RightSidebar/RightSidebar.js';
import LeftSidebarDefault from './LeftSidebar.js';
import Canvas from './Canvas/Canvas.js';
import type { CanvasFeatureToggles } from './Canvas/Canvas.js';
import { createSelectionCommands } from './shared/selectionCommands.js';
import type { InteractionState } from './shared/interactionState.js';
import { Plus } from 'lucide-react';
import {
  RULER_HEIGHT,
  RIGHT_SIDEBAR_WIDTH,
  LEFT_SIDEBAR_WIDTH,
  DESIGNER_CLASSNAME,
  SELECTABLE_CLASSNAME,
} from '../../constants.js';
import { I18nContext, OptionsContext, PluginsRegistry } from '../../contexts.js';
import {
  schemasList2template,
  uuid,
  round,
  template2SchemasList,
  getPagesScrollTopByIndex,
  changeSchemas as _changeSchemas,
  useMaxZoom,
} from '../../helper.js';
import { useUIPreProcessor, useScrollPageCursor, useInitEvents } from '../../hooks.js';
import Root from '../Root.js';
import ErrorScreen from '../ErrorScreen.js';
import CtlBar from '../CtlBar.js';
import CommentDialog from './Comments/CommentDialog.js';
import { applyCollaborationEvent, diffCollaborationEvents, useCollaborationSync } from '../../collaboration.js';
import type { DesignerDocumentItem } from './RightSidebar/DocumentsRail.js';
import type { DesignerRuntimeApi, DesignerSidebarPresentation } from '../../types.js';
import { resolveSchemaTone } from './shared/schemaTone.js';
import { buildCollaboratorChipStyle } from '../../../../features/pdfcomponent/domain/collaborationAppearance.js';
import { buildEffectiveCollaborationContext, filterSchemasForCollaborationView } from '../../collaborationContext.js';
import type { RightSidebarContextHeader, RightSidebarContextHeaderContext } from './RightSidebar/contextHeader.js';
import {
  resolveDesignerEngine,
  attachSchemaIdentity,
  applySchemaCreationHook,
  applySchemaCollaborativeDefaults,
  createSchemaCreationContext,
  getSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
} from '../../designerEngine.js';
import { CommandBus } from '../../commands/commandBus.js';
import {
  buildTopLevelCommentEntry,
  createCommentCommandEvent,
  createPageSnapshotCommand,
  createTemplateSnapshotCommand,
} from '../../commands/designerCommands.js';
const DESIGNER_THEME_STYLE_ID = DESIGNER_CLASSNAME + 'theme-base';

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

/**
 * When the canvas scales there is a displacement of the starting position of the dragged schema.
 * It moves left or right from the top-left corner of the drag icon depending on the scale.
 * This function calculates the adjustment needed to compensate for this displacement.
 */
const scaleDragPosAdjustment = (adjustment: number, scale: number): number => {
  if (scale > 1) return adjustment * (scale - 1);
  if (scale < 1) return adjustment * -(1 - scale);
  return 0;
};

type ViewportMode = 'manual' | 'fit-width' | 'fit-page' | 'actual-size' | 'auto';
type UploadedPdfDocument = {
  id: string;
  name: string;
  template: Template;
  pageCount: number;
};

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
      page.map((schema) => ({
        ...schema,
        commentsCount: typeof (schema as any).commentsCount === 'number' ? (schema as any).commentsCount : 0,
        comments: Array.isArray((schema as any).comments) ? (schema as any).comments : [],
        commentAnchors: Array.isArray((schema as any).commentAnchors) ? (schema as any).commentAnchors : [],
      })),
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

  const nextTemplate = cloneDeep(template) as Template;

  if (event.type === 'comment.deleted') {
    return removeTopLevelComment(nextTemplate, event.commentId);
  }

  const commentEvent = event as Extract<Parameters<typeof applyCollaborationEvent>[1], { type: 'comment.created' | 'comment.updated' }>;
  const anchor = cloneDeep(commentEvent.anchor || commentEvent.comment.anchor || undefined);
  const comment = cloneDeep(commentEvent.comment);
  return upsertTopLevelComment(nextTemplate, {
    id: comment.id,
    anchor,
    comment,
  } as any);
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

const TemplateEditor = ({
  template,
  size,
  onSaveTemplate,
  onChangeTemplate,
  onPageCursorChange,
  onApiReady,
}: Omit<DesignerProps, 'domContainer'> & {
  size: Size;
  onSaveTemplate: (t: Template) => void;
  onChangeTemplate: (t: Template) => void;
  onApiReady?: (api: DesignerRuntimeApi | null) => void;
} & {
  onChangeTemplate: (t: Template) => void;
  onPageCursorChange: (newPageCursor: number, totalPages: number) => void; // NOSONAR
}) => { // NOSONAR
  const past = useRef<SchemaForUI[][]>([]);
  const future = useRef<SchemaForUI[][]>([]);
  const commandBusRef = useRef(new CommandBus());
  const canvasRef = useRef<HTMLDivElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);
  const pdfUploadInputRef = useRef<HTMLInputElement>(null);
  const internalTemplateSyncRef = useRef(false);
  const pendingCollaborativeTemplateRef = useRef<Template | null>(null);
  const previousCollaborativeSchemasRef = useRef<SchemaForUI[][] | null>(null);
  const applyingRemoteCollaborationRef = useRef(false);
  const lockedSelectionSchemaIdsRef = useRef<string[]>([]);
  const documentSchemasCacheRef = useRef<Map<string, SchemaForUI[][]>>(new Map());
  const schemasListRef = useRef<SchemaForUI[][]>([]);
  const activeBasePdfRef = useRef(template.basePdf);

  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const designerEngineOptions = (options as Record<string, unknown>).designerEngine;
  const designerEngine = useMemo(
    () => resolveDesignerEngine(options as Record<string, unknown>),
    [designerEngineOptions],
  );
  const LeftSidebar = designerEngine.renderers?.leftSidebar || LeftSidebarDefault;
  const RightSidebar = designerEngine.renderers?.rightSidebar || RightSidebarDefault;
  const leftSidebarEngine = designerEngine.sidebars?.left;
  const rightSidebarEngine = designerEngine.sidebars?.right;
  const maxZoom = useMaxZoom();
  const leftSidebarVariant = options.leftSidebarVariant === 'panel' ? 'panel' : 'compact';
  const leftSidebarVisible = options.leftSidebarVisible !== false;
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
  const parsedRightSidebarWidth = Number(options.rightSidebarWidth);
  const rightSidebarWidthRaw =
    Number.isFinite(parsedRightSidebarWidth) && parsedRightSidebarWidth > 0
      ? parsedRightSidebarWidth
      : RIGHT_SIDEBAR_WIDTH;
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
  // Canvas-first baseline: sidebars overlay the stage unless reserveSpace is explicitly enabled.
  const shouldReserveRightSidebarSpace =
    rightSidebarReserveSpace === true && rightSidebarPresentation === 'docked';
  const rightSidebarWidth = shouldReserveRightSidebarSpace ? responsiveRightSidebarWidthRaw : 0;
  const parsedLeftSidebarWidth = Number(options.leftSidebarWidth);
  const defaultSidebarWidth = leftSidebarVariant === 'panel' ? 240 : LEFT_SIDEBAR_WIDTH;
  const leftSidebarWidthRawBase =
    leftSidebarVisible && Number.isFinite(parsedLeftSidebarWidth) && parsedLeftSidebarWidth > 0
      ? parsedLeftSidebarWidth
      : leftSidebarVisible
        ? defaultSidebarWidth
        : 0;
  const leftSidebarUsesExpandedLayout = leftSidebarVariant === 'panel' || leftSidebarUseLayout;
  const leftSidebarMinWidth = leftSidebarUsesExpandedLayout ? 220 : 42;
  const leftSidebarViewportLimit = Math.max(
    leftSidebarMinWidth,
    Math.floor(viewportWidth * (viewportWidth <= 768 ? 0.86 : leftSidebarUsesExpandedLayout ? 0.34 : 0.12)),
  );
  const responsiveLeftSidebarWidthRaw = Math.max(
    leftSidebarMinWidth,
    Math.min(leftSidebarWidthRawBase, leftSidebarViewportLimit),
  );
  const shouldReserveLeftSidebarSpace =
    leftSidebarVisible &&
    leftSidebarReserveSpace === true &&
    leftSidebarPresentation === 'docked';
  const leftSidebarWidth = shouldReserveLeftSidebarSpace ? responsiveLeftSidebarWidthRaw : 0;

  const [hoveringSchemaId, setHoveringSchemaId] = useState<string | null>(null);
  const [activeElements, setActiveElements] = useState<HTMLElement[]>([]);
  const activeElementIds = useMemo(
    () => activeElements.map((element) => element.id),
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
    setInteractionState(next);
  }, []);
  const [visibleTemplate, setVisibleTemplate] = useState<Template>(() => template);
  const [schemasList, setSchemasList] = useState<SchemaForUI[][]>([[]] as SchemaForUI[][]);
  const [pageCursor, setPageCursor] = useState(0);
  const pageCursorRef = useRef(0);
  const [zoomLevel, setZoomLevel] = useState(options.zoomLevel ?? 1);
  const [sidebarOpen, setSidebarOpen] = useState(options.sidebarOpen ?? true);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('manual');
  const [canvasFeatureOverrides, setCanvasFeatureOverrides] = useState<Partial<CanvasFeatureToggles>>({});
  const canvasFeatureToggles = useMemo<CanvasFeatureToggles>(
    () => ({
      selecto: canvasFeatureOverrides.selecto ?? designerEngine.canvas?.featureToggles?.selecto ?? true,
      snapLines: canvasFeatureOverrides.snapLines ?? designerEngine.canvas?.featureToggles?.snapLines ?? true,
      guides: canvasFeatureOverrides.guides ?? designerEngine.canvas?.featureToggles?.guides ?? true,
      padding: canvasFeatureOverrides.padding ?? designerEngine.canvas?.featureToggles?.padding ?? true,
      mask: canvasFeatureOverrides.mask ?? designerEngine.canvas?.featureToggles?.mask ?? true,
      moveable: canvasFeatureOverrides.moveable ?? designerEngine.canvas?.featureToggles?.moveable ?? true,
      deleteButton: canvasFeatureOverrides.deleteButton ?? designerEngine.canvas?.featureToggles?.deleteButton ?? true,
    }),
    [
      canvasFeatureOverrides.deleteButton,
      canvasFeatureOverrides.guides,
      canvasFeatureOverrides.mask,
      canvasFeatureOverrides.moveable,
      canvasFeatureOverrides.padding,
      canvasFeatureOverrides.selecto,
      canvasFeatureOverrides.snapLines,
      designerEngine.canvas?.featureToggles?.deleteButton,
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
  const [activeDragData, setActiveDragData] = useState<{ schema: Schema; type: string } | null>(null);
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    pageCursorRef.current = pageCursor;
  }, [pageCursor]);
  const uploadedDocumentsOption = (options as Record<string, unknown>).uploadedDocuments;
  const activeDocumentIdOption = (options as Record<string, unknown>).activeDocumentId;
  const uploadedDocumentsSeed = useMemo<UploadedPdfDocument[]>(
    () => (Array.isArray(uploadedDocumentsOption) ? (uploadedDocumentsOption as UploadedPdfDocument[]) : []),
    [uploadedDocumentsOption],
  );
  const uploadedDocumentsSeedSignature = useMemo(
    () =>
      uploadedDocumentsSeed
        .map((doc) => `${doc.id}:${doc.name}:${doc.pageCount}`)
        .join("|"),
    [uploadedDocumentsSeed],
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
      const next = uploadedDocumentsSeed.map((doc) => ({ ...doc }));
      if (
        prev.length === next.length &&
        prev.every((doc, index) =>
          doc.id === next[index]?.id &&
          doc.name === next[index]?.name &&
          doc.pageCount === next[index]?.pageCount &&
          doc.template === next[index]?.template
        )
      ) {
        return prev;
      }
      return next;
    });
  }, [uploadedDocumentsSeedSignature]);

  useEffect(() => {
    const optionActiveId = typeof activeDocumentIdOption === 'string'
      ? String(activeDocumentIdOption)
      : null;
    if (!optionActiveId) return;
    setActiveDocumentId(optionActiveId);
  }, [activeDocumentIdOption]);

  useEffect(() => {
    setActiveDocumentId((prev) =>
      uploadedDocumentsSeed.some((doc) => doc.id === prev)
        ? prev
        : initialActiveDocumentId,
    );
  }, [initialActiveDocumentId, uploadedDocumentsSeedSignature]);

  // Wix-inspired idle detection: after 4s of no interaction, mark UI as idle to reduce chrome
  useEffect(() => {
    const IDLE_DELAY = 4000;
    const resetIdle = () => {
      setIsIdle(false);
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

  useEffect(() => {
    if (!activeElements.length) return;

    const activePaper = paperRefs.current[pageCursor];
    if (!activePaper) return;

    const nextActive = activeElements
      .map((element) => document.getElementById(element.id))
      .filter((element): element is HTMLElement => Boolean(element))
      .filter((element) => {
        if (!element.classList.contains(SELECTABLE_CLASSNAME)) return false;
        if (!visiblePageSchemaIdSet.has(element.id)) return false;
        return element === activePaper || activePaper.contains(element);
      });

    const hasChanged =
      nextActive.length !== activeElements.length ||
      nextActive.some((element, index) => element !== activeElements[index]);

    if (!hasChanged) return;
    setActiveElements(nextActive);

    if (nextActive.length === 0) {
      setHoveringSchemaId(null);
    }
  }, [activeElements, pageCursor, schemasList, visiblePageSchemaIdSet]);

  useEffect(() => {
    if (!hoveringSchemaId) return;
    if (visiblePageSchemaIdSet.has(hoveringSchemaId)) return;
    setHoveringSchemaId(null);
  }, [hoveringSchemaId, visiblePageSchemaIdSet]);

  const pushTemplateUpdate = useCallback(
    (nextTemplate: Template) => {
      setVisibleTemplate(nextTemplate);
      internalTemplateSyncRef.current = true;
      onChangeTemplate(nextTemplate);
    },
    [onChangeTemplate],
  );
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
    actorId: designerEngine.collaboration?.actorId,
    actorColor: designerEngine.collaboration?.actorColor,
    users: designerEngine.collaboration?.users,
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
  const [pendingAnchor, setPendingAnchor] = useState<null | {
    xMm: number;
    yMm: number;
    pageIndex: number;
    fileId?: string | null;
    schemaUid?: string;
  }>(null);

  const openCommentDialog = useCallback(
    (xClient: number, yClient: number, pageIndex: number, schemaUid?: string, fileId?: string | null) => {
    try {
      const paper = paperRefs.current[pageIndex] || paperRefs.current[pageCursor];
      if (!paper) return;
      const rect = paper.getBoundingClientRect();
      const pxX = Number(xClient) - rect.left;
      const pxY = Number(yClient) - rect.top;
      const pixelPerMm = (ZOOM as number) * (scale || 1);
      const xMm = Math.max(0, pxX / pixelPerMm);
      const yMm = Math.max(0, pxY / pixelPerMm);
      const boundedX = Math.max(0, Math.min(pageSizes[pageIndex]?.width || 0, xMm));
      const boundedY = Math.max(0, Math.min(pageSizes[pageIndex]?.height || 0, yMm));
      setPendingAnchor({
        xMm: Math.round(boundedX * 100) / 100,
        yMm: Math.round(boundedY * 100) / 100,
        pageIndex,
        fileId: fileId || activeDocumentId || null,
        schemaUid,
      });
      openCommentsPanel();
      setCommentDialogOpen(true);
    } catch (err) {
      console.error('openCommentDialog failed', err);
    }
    },
    [activeDocumentId, openCommentsPanel, pageCursor, paperRefs, pageSizes, scale],
  );

  const canvasWidth = size.width - leftSidebarWidth;
  const safeCanvasWidth = Number.isFinite(canvasWidth) ? Math.max(0, canvasWidth) : 0;
  const parsedMinCanvasHeight = Number((options as Record<string, unknown>).minCanvasHeight);
  const minCanvasHeight =
    Number.isFinite(parsedMinCanvasHeight) && parsedMinCanvasHeight > 0 ? parsedMinCanvasHeight : 420;
  const safeCanvasHeight = Number.isFinite(size.height)
    ? Math.max(minCanvasHeight, size.height)
    : minCanvasHeight;
  const safeContentWidth = Number.isFinite(safeCanvasWidth - rightSidebarWidth)
    ? Math.max(0, safeCanvasWidth - rightSidebarWidth)
    : 0;
  const sizeExcSidebars = {
    width: sidebarOpen ? safeContentWidth : safeCanvasWidth,
    height: safeCanvasHeight,
  };
  const usableCanvasWidth = Math.max(1, sizeExcSidebars.width - 24);
  const usableCanvasHeight = Math.max(1, sizeExcSidebars.height - RULER_HEIGHT * ZOOM - 24);

  const onEdit = (targets: HTMLElement[]) => {
    setActiveElements(targets);
    setHoveringSchemaId(null);
  };

  const onEditEnd = () => {
    setActiveElements([]);
    setHoveringSchemaId(null);
  };

  // Update component state only when _options_ changes
  useEffect(() => {
    if (typeof options.zoomLevel === 'number' && options.zoomLevel !== zoomLevel) {
      setZoomLevel(options.zoomLevel);
    }
    if (typeof options.sidebarOpen === 'boolean' && options.sidebarOpen !== sidebarOpen) {
      setSidebarOpen(options.sidebarOpen);
    }
    const modeFromOptions = normalizeViewportMode(options.viewportMode ?? options.initialViewportMode);
    if (modeFromOptions !== 'manual' && modeFromOptions !== viewportMode) {
      applyViewportMode(modeFromOptions);
    }
  }, [options]);

  useScrollPageCursor({
    ref: canvasRef,
    pageSizes,
    scale,
    pageCursor,
    onChangePageCursor: (p) => {
      setPageCursor(p);
      onPageCursorChange(p, schemasList.length);
      onEditEnd();
    },
  });

  const commitSchemas = useCallback(
    (newSchemas: SchemaForUI[]) => {
      const beforeSchemas = cloneDeep(schemasListRef.current[pageCursor] || []);
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
          pageIndex: pageCursor,
          beforeSchemas,
          afterSchemas,
          schemaEvents: [{ type: eventType, pageIndex: pageCursor }],
          applyPageSchemas: (targetPageIndex, nextPageSchemas) => {
            const nextSchemasList = replacePageSchemas(schemasListRef.current, targetPageIndex, nextPageSchemas);
            schemasListRef.current = nextSchemasList;
            setSchemasList(nextSchemasList);
            pushTemplateUpdate(schemasList2template(nextSchemasList, activeBasePdfRef.current));
          },
        }),
      );
    },
    [pageCursor, pushTemplateUpdate],
  );

  const removeSchemas = useCallback(
    (ids: string[]) => {
      commitSchemas(currentPageSchemas.filter((schema) => !ids.includes(schema.id)));
      onEditEnd();
    },
    [commitSchemas, currentPageSchemas, onEditEnd],
  );

  const changeSchemas: ChangeSchemas = useCallback(
    (objs) => {
      _changeSchemas({
        objs,
        schemas: currentPageSchemas,
        basePdf: activeBasePdf,
        pluginsRegistry,
        pageSize: pageSizes[pageCursor],
        commitSchemas,
      });
    },
    [activeBasePdf, commitSchemas, currentPageSchemas, pageCursor, pageSizes, pluginsRegistry],
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
  const selectionCommands = useMemo(
    () =>
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
    ],
  );

  useInitEvents({
    pageCursor,
    pageSizes,
    activeElements,
    template: visibleTemplate,
    schemasList,
    visibleSchemasList,
    changeSchemas,
    commitSchemas,
    removeSchemas,
    onSaveTemplate,
    past,
    future,
    commandBus: commandBusRef.current,
    setSchemasList,
    onEdit,
    onEditEnd,
    selectionCommands,
    collaborationContext,
  });

  const updateTemplate = useCallback(async (newTemplate: Template) => {
    setVisibleTemplate(newTemplate);
    const sl = await template2SchemasList(newTemplate);
    setSchemasList(sl);
    schemasListRef.current = sl;
    setPageCursor((prev) => {
      if (sl.length <= 0) return 0;
      return Math.max(0, Math.min(prev, sl.length - 1));
    });
    if (pageCursorRef.current >= sl.length && canvasRef.current?.scroll) {
      canvasRef.current.scroll({ top: 0, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const handler = (ev: any) => {
      const detail = ev?.detail || {};
      const page = typeof detail.page === 'number' ? detail.page : pageCursor;
      const x = detail.x;
      const y = detail.y;
      const schemaUid = Array.isArray(detail.targetIds) && detail.targetIds.length > 0 ? detail.targetIds[0] : detail.schemaUid;
      const fileId = typeof detail.fileId === 'string' ? detail.fileId : null;
      if (typeof x === 'number' && typeof y === 'number') {
        openCommentDialog(x, y, page, schemaUid, fileId);
      }
    };
    globalThis.addEventListener('sisad-pdfme:create-comment', handler as EventListener);
    globalThis.addEventListener('sisad-pdfme:create-comment-request', handler as EventListener);
    return () => {
      globalThis.removeEventListener('sisad-pdfme:create-comment', handler as EventListener);
      globalThis.removeEventListener('sisad-pdfme:create-comment-request', handler as EventListener);
    };
  }, [openCommentDialog, pageCursor]);

  useEffect(() => {
    const handleCommentPinClick = (event: Event) => {
      const detail = (event as CustomEvent<{ anchorId?: string; commentId?: string }>).detail || {};
      let commentId: string | null = null;
      if (typeof detail.anchorId === 'string' && detail.anchorId.trim()) {
        commentId = detail.anchorId.trim();
      } else if (typeof detail.commentId === 'string' && detail.commentId.trim()) {
        commentId = detail.commentId.trim();
      }
      openCommentsPanel(commentId);
    };

    globalThis.addEventListener('sisad-pdfme:pin-clicked', handleCommentPinClick as EventListener);
    return () => {
      globalThis.removeEventListener('sisad-pdfme:pin-clicked', handleCommentPinClick as EventListener);
    };
  }, [openCommentsPanel]);

  const handleSaveComment = useCallback(
    (text: string) => {
      if (!pendingAnchor) return;
      try {
        const pageSchemas = schemasList[pendingAnchor.pageIndex] || [];
        const fallbackSchema = pageSchemas
          .slice()
          .reverse()
          .find((schema) => {
            const x = Number(schema.position?.x);
            const y = Number(schema.position?.y);
            const width = Number(schema.width);
            const height = Number(schema.height);
            if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) {
              return false;
            }
            return (
              pendingAnchor.xMm >= x
              && pendingAnchor.xMm <= x + width
              && pendingAnchor.yMm >= y
              && pendingAnchor.yMm <= y + height
            );
          });
        const resolvedSchemaUid = fallbackSchema?.schemaUid || fallbackSchema?.id || pendingAnchor.schemaUid;

        const anchor = {
          x: pendingAnchor.xMm,
          y: pendingAnchor.yMm,
          fileId: pendingAnchor.fileId || activeDocumentId || null,
          pageNumber: pendingAnchor.pageIndex + 1,
          schemaUid: resolvedSchemaUid,
        } as any;

        const identity = {
          authorId: collaborationContext.actorId || undefined,
          authorName: collaborationContext.activeRecipient?.name || collaborationContext.ownerRecipientName || undefined,
          authorColor: collaborationContext.userColor || undefined,
        } as any;

        const createdAnchor = createSchemaCommentAnchor(anchor, {
          authorId: identity.authorId,
          authorName: identity.authorName,
          authorColor: identity.authorColor,
        } as any);
        const createdComment = createSchemaComment(text, {
          authorId: identity.authorId,
          authorName: identity.authorName,
          authorColor: identity.authorColor,
          timestamp: Date.now(),
        } as any, {
          id: createdAnchor.id,
          anchor: cloneDeep(createdAnchor),
        });

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
              comments?: Array<{ id: string; anchor?: Record<string, unknown>; [key: string]: unknown }>;
              commentAnchors?: Array<{ id: string; [key: string]: unknown }>;
              commentsCount?: number;
            };
            nextSchema.comments = upsertById(nextSchema.comments || [], createdComment as any);
            nextSchema.commentAnchors = upsertById(nextSchema.commentAnchors || [], createdAnchor as any);
            nextSchema.commentsCount = (Number(nextSchema.commentsCount) || 0) + 1;
            nextTemplate.schemas[target.pageIndex][target.index] = nextSchema as any;
          }
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
          const nextTemplate = upsertTopLevelComment(
            cloneDeep(visibleTemplate) as Template,
            buildTopLevelCommentEntry({
              id: createdComment.id,
              anchor: createdAnchor as any,
              comment: createdComment as any,
            }),
          );

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
        setActiveCommentId(createdComment.id);
        openCommentsPanel(createdComment.id);
      } catch (err) {
        console.error('Failed to save comment', err);
      } finally {
        setCommentDialogOpen(false);
        setPendingAnchor(null);
      }
    },
    [
      pendingAnchor,
      activeDocumentId,
      applyCollaborationLocalChange,
      collaborationContext,
      designerEngine.collaboration?.actorId,
      designerEngine.collaboration?.enabled,
      designerEngine.collaboration?.sessionId,
      visibleTemplate,
      updateTemplate,
      schemasList,
      openCommentsPanel,
    ],
  );

  const handleAddSidebarComment = useCallback(() => {
    const paper = paperRefs.current[pageCursor];
    if (!paper) return;

    const rect = paper.getBoundingClientRect();
    const activeSchema = currentPageSchemas.find((schema) => schema.id === activeElements[0]?.id);
    openCommentDialog(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      pageCursor,
      activeSchema?.schemaUid || activeSchema?.id,
      activeDocumentId || null,
    );
  }, [activeDocumentId, activeElements, currentPageSchemas, openCommentDialog, pageCursor]);

  const commentItems = useMemo(() => {
    return filterCommentsByFileAndPage(visibleTemplate, activeDocumentId || null, pageCursor + 1)
      .map((entry) => ({
        id: String(entry.comment?.id || entry.anchor?.id || ''),
        text: String(entry.comment?.text || entry.comment?.content || ''),
        authorName: entry.comment?.authorName || null,
        authorColor: entry.comment?.authorColor || null,
        schemaUid: entry.schemaUid || entry.anchor?.schemaUid,
        fileId: entry.fileId || null,
        pageNumber: entry.pageNumber,
        resolved: Boolean(entry.anchor?.resolved ?? entry.comment?.resolved),
        timestamp: Number(entry.comment?.timestamp || entry.comment?.createdAt || 0) || undefined,
        replies: Array.isArray(entry.comment?.replies) ? entry.comment.replies : [],
      }))
      .filter((item) => item.id && item.text)
      .sort((left, right) => (right.timestamp || 0) - (left.timestamp || 0));
  }, [activeDocumentId, pageCursor, visibleTemplate]);

  const commentsBridge = useMemo(
    () => ({
      items: commentItems,
      onAdd: handleAddSidebarComment,
      title: 'Comentarios de la página',
      emptyTitle: 'No hay comentarios en la página actual.',
      activeCommentId,
    }),
    [activeCommentId, commentItems, handleAddSidebarComment],
  );

  const loadDocumentIntoCanvas = useCallback(
    async (document: UploadedPdfDocument, targetPageIndex = 0) => {
      if (!document?.id) return;
      commandBusRef.current.clear();
      const normalizedTemplate = normalizeTemplateSchemaPages(document.template, document.pageCount);

      const cachedSchemas = documentSchemasCacheRef.current.get(document.id);
      const nextSchemas = cachedSchemas || (await template2SchemasList(normalizedTemplate));
      documentSchemasCacheRef.current.set(document.id, nextSchemas);

      setVisibleTemplate(normalizedTemplate);
      setSchemasList(nextSchemas);
      const safePageCursor = Math.max(0, Math.min(targetPageIndex, Math.max(0, nextSchemas.length - 1)));
      setPageCursor(safePageCursor);
      onPageCursorChange(safePageCursor, nextSchemas.length);
    },
    [onPageCursorChange],
  );

  const addSchema = (defaultSchema: Schema) => {
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = isBlankPdf(activeBasePdf)
      ? activeBasePdf.padding
      : [0, 0, 0, 0];
    const pageSize = pageSizes[pageCursor];

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
    const maxWidth = Math.max(minWidth, pageSize.width - paddingLeft - paddingRight);
    const maxHeight = Math.max(minHeightByType, pageSize.height - paddingTop - paddingBottom);
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
      ...defaultSchema,
      width: safeWidth,
      height: safeHeight,
      name: newSchemaName(i18n('field')),
      position: {
        x: ensureMiddleValue(
          paddingLeft,
          defaultSchema.position.x,
          pageSize.width - paddingRight - safeWidth,
        ),
        y: ensureMiddleValue(
          paddingTop,
          defaultSchema.position.y,
          pageSize.height - paddingBottom - safeHeight,
        ),
      },
      required: defaultSchema.readOnly
        ? false
        : options.requiredByDefault || defaultSchema.required || false,
    } as SchemaForUI;

    if (defaultSchema.position.y === 0) {
      const paper = paperRefs.current[pageCursor];
      const rectTop = paper ? paper.getBoundingClientRect().top : 0;
      s.position.y = rectTop > 0 ? paddingTop : pageSizes[pageCursor].height / 2;
    }

    const creationContext = createSchemaCreationContext({
      fileId: activeDocumentId || null,
      pageIndex: pageCursor,
      pageNumber: pageCursor + 1,
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

    commitSchemas(currentPageSchemas.concat(s));
    setTimeout(() => {
      const element = document.getElementById(s.id);
      if (!element) return;
      onEdit([element]);
    });
  };

  const addSchemaAtCenter = useCallback(
    (defaultSchema: Schema) => {
      const pageSize = pageSizes[pageCursor];
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
      addSchema(centered);
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

      const defaultSchema = cloneDeep(found[1].propPanel.defaultSchema);
      addSchemaAtCenter(defaultSchema);
    },
    [addSchemaAtCenter, pluginsRegistry],
  );

  const onSortEnd = (sortedSchemas: SchemaForUI[]) => {
    commitSchemas(sortedSchemas);
  };

  const setPageCursorWithScroll = useCallback(
    (targetPageOrUpdater: number | ((currentPage: number) => number)) => {
      if (!canvasRef.current || schemasList.length === 0) return;

      const targetPage =
        typeof targetPageOrUpdater === 'function'
          ? targetPageOrUpdater(pageCursor)
          : targetPageOrUpdater;
      const safePage = Math.max(0, Math.min(targetPage, schemasList.length - 1));
      canvasRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, safePage, scale);
      setPageCursor(safePage);
      onPageCursorChange(safePage, schemasList.length);
      onEditEnd();
    },
    [onEditEnd, onPageCursorChange, pageSizes, scale, schemasList.length],
  );

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

      const pageWidthPx = Math.max(1, pageSize.width * ZOOM);
      const pageHeightPx = Math.max(1, pageSize.height * ZOOM);
      const widthScale = usableCanvasWidth / pageWidthPx;
      const heightScale = usableCanvasHeight / pageHeightPx;

      const resolvedMode: Exclude<ViewportMode, 'auto'> =
        mode === 'auto' ? (viewportWidth <= 980 ? 'fit-width' : 'fit-page') : mode;

      let targetScale = getBaseScale();
      if (resolvedMode === 'fit-width') {
        targetScale = widthScale;
      } else if (resolvedMode === 'fit-page') {
        targetScale = Math.min(widthScale, heightScale);
      } else if (resolvedMode === 'actual-size') {
        targetScale = 1;
      }

      if (!Number.isFinite(targetScale) || targetScale <= 0) return null;

      const baseScale = getBaseScale();
      const zoom = targetScale / Math.max(0.0001, baseScale);
      const safeZoom = Math.max(0.25, Math.min(maxZoom, zoom));
      return Number.isFinite(safeZoom) ? safeZoom : null;
    },
    [getBaseScale, maxZoom, pageSizes, resolveTargetPageIndex, usableCanvasHeight, usableCanvasWidth, viewportWidth],
  );

  const applyViewportMode = useCallback(
    (mode: ViewportMode, page?: number) => {
      const normalizedMode = normalizeViewportMode(mode);
      setViewportMode(normalizedMode);

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
    [computeZoomForMode, pageCursor, resolveTargetPageIndex, setPageCursorWithScroll],
  );

  const setZoomExternal = useCallback(
    (zoom: number) => {
      setViewportMode('manual');
      const nextZoom = Math.max(0.25, Math.min(maxZoom, zoom));
      setZoomLevel(nextZoom);
    },
    [maxZoom],
  );

  const getCanvasMetrics = useCallback(() => {
    const page = pageSizes[pageCursor];
    return {
      viewportWidth: sizeExcSidebars.width,
      viewportHeight: sizeExcSidebars.height,
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
  }, [pageCursor, pageSizes, scale, schemasList.length, sidebarOpen, sizeExcSidebars.height, sizeExcSidebars.width, usableCanvasHeight, usableCanvasWidth, zoomLevel]);

  useEffect(() => {
    if (viewportMode === 'manual') return;
    const nextZoom = computeZoomForMode(viewportMode, pageCursor + 1);
    if (!isValidZoom(nextZoom)) return;
    setZoomLevel((prev) => {
      return Math.abs(prev - nextZoom) <= 0.005 ? prev : nextZoom;
    });
  }, [computeZoomForMode, pageCursor, sizeExcSidebars.height, sizeExcSidebars.width, viewportMode]);

  const undoExternal = useCallback(() => {
    void commandBusRef.current.undo();
    onEditEnd();
  }, [onEditEnd]);

  const redoExternal = useCallback(() => {
    void commandBusRef.current.redo();
    onEditEnd();
  }, [onEditEnd]);

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

    const nextLockedIds = activeElements.map((element) => element.id).filter(Boolean);
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
      setSidebarOpen: (open: boolean) => setSidebarOpen(Boolean(open)),
      toggleSidebar: () => setSidebarOpen((prev) => !prev),
      focusField: focusFieldExternal,
      highlightField: focusFieldExternal,
      addSchema: (schema: Schema) => addSchemaAtCenter(cloneDeep(schema)),
      addSchemaByType,
      duplicatePage: handleDuplicatePageAfter,
      setCanvasFeatureToggle: (key: keyof CanvasFeatureToggles, value: boolean) => {
      setCanvasFeatureOverrides((prev) => ({ ...prev, [key]: Boolean(value) }));
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
        return true;
      },
      applyExternalPrefill,
    }),
    [
      applyExternalPrefill,
      addSchemaAtCenter,
      addSchemaByType,
      canvasFeatureToggles,
      handleDuplicatePageAfter,
      applyViewportMode,
      designerEngine,
      findSchemaLocation,
      focusFieldExternal,
      getCanvasMetrics,
      activeBasePdf,
      pageCursor,
      redoExternal,
      resolveTargetPageIndex,
      schemasList,
      viewportMode,
      setPageCursorWithScroll,
      setSchemasList,
      setZoomExternal,
      undoExternal,
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
  };

  const isSchemaDragActive = (active: { data?: { current?: unknown } } | null | undefined) => {
    const data = (active?.data?.current || {}) as { schema?: Schema; type?: string };
    return Boolean(data?.schema && data?.type);
  };

  const updatePage = (sl: SchemaForUI[][], newPageCursor: number) => {
    setSchemasList(sl);
    setPageCursor(newPageCursor);
    const newTemplate = schemasList2template(sl, activeBasePdf);
    pushTemplateUpdate(newTemplate);

    // Notify page change with updated total pages
    onPageCursorChange(newPageCursor, sl.length);

    // Use setTimeout to update scroll position after render
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, newPageCursor, scale);
      }
    }, 0);
  };

  function handleRemovePage() {
    if (pageCursor === 0) return;
    if (!window.confirm(i18n('removePageConfirm'))) return;

    const nextSchemasList = removePageSchemas(schemasList, pageCursor);
    updatePage(nextSchemasList, pageCursor - 1);
  }

  function handleAddPageAfter() {
    const nextSchemasList = insertPageSchemas(schemasList, pageCursor + 1, []);
    updatePage(nextSchemasList, pageCursor + 1);
  }

  function handleDuplicatePageAfter() {
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
  }

  const handleToggleCanvasFeature = useCallback((key: keyof CanvasFeatureToggles) => {
    setCanvasFeatureOverrides((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const emitActiveDocumentChange = useCallback(
    (document: UploadedPdfDocument | null) => {
      const handler = (options as Record<string, unknown>).onActiveDocumentChange;
      if (typeof handler === 'function') {
        handler(document?.id || null, document);
      }
    },
    [options],
  );

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
          window.alert(`Selecciona un archivo PDF valido: ${file.name}`);
          continue;
        }

        try {
          const buffer = await file.arrayBuffer();
          const pdfPages = await pdf2size(buffer.slice(0));
          const targetPageCount = Math.max(1, pdfPages.length || 1);
          const normalizedSchemas = schemasList.map((page) => page.slice());
          if (normalizedSchemas.length > targetPageCount) {
            normalizedSchemas.length = targetPageCount;
          }
          while (normalizedSchemas.length < targetPageCount) {
            normalizedSchemas.push([]);
          }
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

          setUploadedDocuments((prev) =>
            prev.concat({
              id: newDocumentId,
              name: docName,
              template: nextTemplate,
              pageCount: targetPageCount,
            }),
          );
          documentSchemasCacheRef.current.set(newDocumentId, normalizedSchemas);

          if (i === 0) {
            setActiveDocumentId(newDocumentId);
            emitActiveDocumentChange({
              id: newDocumentId,
              name: docName,
              template: nextTemplate,
              pageCount: targetPageCount,
            });
            setVisibleTemplate(nextTemplate);
            setSchemasList(normalizedSchemas);
            pushTemplateUpdate(nextTemplate);
            setPageCursor(safePageCursor);
            onPageCursorChange(safePageCursor, normalizedSchemas.length);
            onEditEnd();
          }
        } catch (uploadError) {
          console.error('Failed to load uploaded PDF', uploadError);
          window.alert('No se pudo cargar el PDF.');
        }
      }

      input.value = '';
    },
    [
      emitActiveDocumentChange,
      pushTemplateUpdate,
      onEditEnd,
      onPageCursorChange,
      pageCursor,
      schemasList,
      uploadedDocuments.length,
    ],
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

    setSchemasList(normalizedSchemas);
    setPageCursor((prev) => Math.max(0, Math.min(prev, targetPageCount - 1)));
  }, [activeBasePdf, pageSizes.length, schemasList]);

  useEffect(() => {
    if (!activeDocumentId) return;
    documentSchemasCacheRef.current.set(activeDocumentId, schemasList);
    setUploadedDocuments((prev) => {
      const idx = prev.findIndex((doc) => doc.id === activeDocumentId);
      if (idx < 0) return prev;
      const current = prev[idx];
      if (current.template === visibleTemplate && current.pageCount === pageSizes.length) return prev;
      const next = [...prev];
      next[idx] = {
        ...current,
        template: visibleTemplate,
        pageCount: Math.max(1, pageSizes.length || visibleTemplate.schemas.length || 1),
      };
      return next;
    });
  }, [activeDocumentId, pageSizes.length, schemasList, visibleTemplate]);

  useEffect(() => {
    if (internalTemplateSyncRef.current) {
      internalTemplateSyncRef.current = false;
      return;
    }
    const normalizedIncomingTemplate = normalizeTemplateSchemaPages(
      template,
      Math.max(1, pageSizes.length || template.schemas.length || 1),
    );
    setVisibleTemplate(normalizedIncomingTemplate);
    void updateTemplate(normalizedIncomingTemplate);
  }, [template, updateTemplate]);

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
        meta: `${doc.pageCount} pagina${doc.pageCount === 1 ? '' : 's'}`,
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
    function RightSidebarContextHeaderRenderer(ctx: RightSidebarContextHeaderContext) {
      // Only show the top context strip when the right sidebar is in 'fields' (list/bulk) mode
      if (!ctx || (ctx.mode !== 'list' && ctx.mode !== 'bulk')) return null;

      const activeDocument = uploadedDocuments.find((doc) => doc.id === activeDocumentId) || null;
      const activeDocumentLabel =
        activeDocument?.name ||
        activeDocument?.id ||
        fallbackBaseDocumentItem?.name ||
        activeDocumentId ||
        'Documento local';
      const actorId = designerEngine.collaboration?.actorId || '';
      const actorColor = collaborationContext.userColor || collaborationContext.ownerColor || designerEngine.collaboration?.actorColor || '';
      const actorStyle = buildCollaboratorChipStyle(actorColor, true);
      const recipientStyle = buildCollaboratorChipStyle(collaborationContext.activeRecipient?.color || actorColor, false);

      return (
        <div className={DESIGNER_CLASSNAME + 'detail-view-context-strip'} aria-label="Contexto activo del editor">
          <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
            Documento: {activeDocumentLabel}
          </span>
          {uploadedDocuments.length > 1 ? (
            <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
              Docs: {uploadedDocuments.length}
            </span>
          ) : null}
          {pageItems.length > 0 ? (
            <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
              Página: {pageCursor + 1}/{pageItems.length}
            </span>
          ) : null}
          <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
            Campos: {visiblePageSchemas.length}/{currentPageSchemas.length}
          </span>
          {activeElements.length > 0 ? (
            <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
              Selección: {activeElements.length}
            </span>
          ) : null}
          <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
            Presencia: {isIdle ? 'pausa' : 'activa'}
          </span>
          <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
            Colaboradores: {Math.max(1, collaborationSync.presence.length)}
          </span>
          {collaborationSync.history.length > 0 ? (
            <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'}>
              Historial: {collaborationSync.history.length}
            </span>
          ) : null}
          <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'} style={recipientStyle}>
            Vista: {collaborationContext.isGlobalView ? 'Global' : collaborationContext.activeRecipient?.name || 'Sin destinatario'}
          </span>
          <span className={DESIGNER_CLASSNAME + 'detail-view-context-chip'} style={actorStyle}>
            Usuario: {actorId || 'local'}
          </span>
        </div>
      );
    }

    return RightSidebarContextHeaderRenderer;
  }, [
    activeDocumentId,
    activeElements.length,
    collaborationContext,
    collaborationSync.history.length,
    collaborationSync.presence.length,
    currentPageSchemas,
    designerEngine.collaboration?.actorColor,
    designerEngine.collaboration?.actorId,
    isIdle,
    pageCursor,
    pageItems.length,
    fallbackBaseDocumentItem?.name,
    uploadedDocuments,
  ]);
  if (error) {
    // Pass the error directly to ErrorScreen
    return <ErrorScreen size={size} error={error} />;
  }
  const { className: leftSidebarEngineClassName, ...leftSidebarEngineProps } = leftSidebarEngine || {};
  const { className: rightSidebarEngineClassName, ...rightSidebarEngineProps } = rightSidebarEngine || {};

  const leftSidebarNode = leftSidebarVisible ? (
    <LeftSidebar
      scale={scale}
      basePdf={activeBasePdf}
      variant={leftSidebarVariant}
      useLayoutFrame={leftSidebarUseLayout}
      showSearch={leftSidebarSearchable}
      detached={leftSidebarDetached}
      presentation={leftSidebarPresentation}
      responsiveBreakpoint={Number.isFinite(leftSidebarResponsiveBreakpoint) ? leftSidebarResponsiveBreakpoint : 1080}
      viewportWidth={viewportWidth}
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
      {...leftSidebarEngineProps}
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
        const editingElem = document.getElementById(id);
        if (editingElem) {
          onEdit([editingElem]);
        }
      }}
      onEditEnd={onEditEnd}
      deselectSchema={onEditEnd}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      collaborationContext={collaborationContext}
      width={responsiveRightSidebarWidthRaw}
      detached={rightSidebarDetached}
      presentation={rightSidebarPresentation}
      responsiveBreakpoint={Number.isFinite(rightSidebarResponsiveBreakpoint) ? rightSidebarResponsiveBreakpoint : 1080}
      viewportWidth={viewportWidth}
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
                      setActiveDocumentId(targetDoc.id);
                      emitActiveDocumentChange(targetDoc);
                      await loadDocumentIntoCanvas(targetDoc, 0);
                    }
                  : undefined,
              onUploadPdf: handleUploadPdfClick,
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
        title: 'Páginas del documento',
        emptyTitle: 'Este documento aún no tiene páginas. Agrega una página para empezar.',
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
      {...rightSidebarEngineProps}
    />
  );
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
    <Root size={size} scale={scale}>
      <input
        ref={pdfUploadInputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        style={{ display: 'none' }}
        onChange={handlePdfUploadChange}
      />
      <DndContext
        onDragStart={(event) => {
          if (!isSchemaDragActive(event?.active)) return;
          onEditEnd();
          setIsSchemaDragging(true);
          setIsDraggingOverCanvas(false);
          setActiveDragData(event.active.data.current as { schema: Schema; type: string });
        }}
        onDragMove={(event) => {
          if (!isSchemaDragActive(event?.active)) {
            setIsDraggingOverCanvas(false);
            return;
          }
          if (!event.active) {
            setIsDraggingOverCanvas(false);
            return;
          }
          const pageNode = paperRefs.current[pageCursor];
          if (!pageNode) {
            setIsDraggingOverCanvas(false);
            return;
          }
          const pageRect = pageNode.getBoundingClientRect();
          const translated = event.active.rect.current.translated || event.active.rect.current.initial;
          if (!translated) {
            setIsDraggingOverCanvas(false);
            return;
          }

          const pointerX = translated.left + (translated.width || Math.max(0, translated.right - translated.left)) / 2;
          const pointerY = translated.top + (translated.height || Math.max(0, translated.bottom - translated.top)) / 2;

          const isOverCanvas =
            pointerX >= pageRect.left &&
            pointerX <= pageRect.right &&
            pointerY >= pageRect.top &&
            pointerY <= pageRect.bottom;

          setIsDraggingOverCanvas((prev) => (prev === isOverCanvas ? prev : isOverCanvas));
        }}
        onDragCancel={() => {
          setIsSchemaDragging(false);
          setIsDraggingOverCanvas(false);
          setActiveDragData(null);
        }}
        onDragEnd={(event) => {
          setIsSchemaDragging(false);
          setIsDraggingOverCanvas(false);
          if (!isSchemaDragActive(event?.active)) return;
          // Triggered after a schema is dragged & dropped from the left sidebar.
          if (!event.active) return;
          const active = event.active;
          const payload = (active.data.current || {}) as { schema?: Schema };
          const draggedSchema = cloneDeep(payload.schema || (active.data.current as Schema));
          if (!draggedSchema) return;

          const pageNode = paperRefs.current[pageCursor];
          if (!pageNode) {
            addSchemaAtCenter(draggedSchema);
            return;
          }
          const pageRect = pageNode.getBoundingClientRect();

          const dragStartLeft = active.rect.current.initial?.left || 0;
          const dragStartTop = active.rect.current.initial?.top || 0;

          const translated = active.rect.current.translated || active.rect.current.initial;
          if (!translated) {
            addSchemaAtCenter(draggedSchema);
            return;
          }

          const canvasLeftOffsetFromPageCorner = pageRect.left - dragStartLeft + scaleDragPosAdjustment(20, scale);
          const canvasTopOffsetFromPageCorner = pageRect.top - dragStartTop;

          const moveY = Number.isFinite(event.delta.y)
            ? (event.delta.y - canvasTopOffsetFromPageCorner) / scale
            : (translated.top - pageRect.top) / scale;
          const moveX = Number.isFinite(event.delta.x)
            ? (event.delta.x - canvasLeftOffsetFromPageCorner) / scale
            : (translated.left - pageRect.left) / scale;

          const position = {
            x: round(px2mm(Math.max(0, moveX)), 2),
            y: round(px2mm(Math.max(0, moveY)), 2),
          };

          addSchema({ ...draggedSchema, position });
          setActiveDragData(null);
        }}
      >
        {!leftSidebarDetached ? leftSidebarNode : null}
        {detachedSidebarRendered}
        {detachedRightSidebarRendered}

        <div
          className={`${DESIGNER_CLASSNAME}stage`}
          data-left-sidebar={leftSidebarVisible ? 'visible' : 'hidden'}
          data-left-sidebar-mode={shouldReserveLeftSidebarSpace ? 'docked' : 'overlay'}
          data-left-sidebar-variant={leftSidebarVariant}
          data-left-sidebar-detached={leftSidebarDetached ? 'true' : 'false'}
          data-left-sidebar-layout={leftSidebarUseLayout ? 'frame' : 'default'}
          data-right-sidebar-detached={rightSidebarDetached ? 'true' : 'false'}
          data-sidebar-open={sidebarOpen ? 'true' : 'false'}
          data-is-dragging={isSchemaDragging ? 'true' : 'false'}
          data-schema-dragging={isSchemaDragging ? 'true' : 'false'}
          data-schema-over-canvas={isDraggingOverCanvas ? 'true' : 'false'}
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
          }>
          <CtlBar
            size={sizeExcSidebars}
            pageCursor={pageCursor}
            pageNum={schemasList.length}
            setPageCursor={setPageCursorWithScroll}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            setZoom={setZoomExternal}
            addPageAfter={handleAddPageAfter}
            duplicatePageAfter={handleDuplicatePageAfter}
            removePage={pageManipulation.removePage}
            onUndo={undoExternal}
            onRedo={redoExternal}
            onFitWidth={() => applyViewportMode('fit-width')}
            onFitPage={() => applyViewportMode('fit-page')}
            onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
            sidebarOpen={sidebarOpen}
            documentStatus={isIdle ? 'Listo' : 'Editando'}
            onSave={() => onSaveTemplate(visibleTemplate)}
            featureToggles={{
              guides: canvasFeatureToggles.guides,
              snapLines: canvasFeatureToggles.snapLines,
              padding: canvasFeatureToggles.padding,
            }}
            onToggleFeature={handleToggleCanvasFeature}
          />



          {!rightSidebarDetached ? rightSidebarNode : null}

          <Canvas
            ref={canvasRef}
            paperRefs={paperRefs}
            basePdf={activeBasePdf}
            hoveringSchemaId={hoveringSchemaId}
            onChangeHoveringSchemaId={onChangeHoveringSchemaId}
            height={size.height - RULER_HEIGHT * ZOOM}
            pageCursor={pageCursor}
            scale={scale}
            size={sizeExcSidebars}
            pageSizes={pageSizes}
            backgrounds={backgrounds}
            activeElements={activeElements}
            schemasList={schemasList}
            renderedSchemasList={visibleSchemasList}
            topLevelComments={
              ((visibleTemplate as unknown as {
                pdfComments?: Array<{ anchor?: Record<string, unknown>; comment?: Record<string, unknown> }>;
                __commentAnchors?: Array<{ anchor?: Record<string, unknown>; comment?: Record<string, unknown> }>;
              }).pdfComments) ||
              ((visibleTemplate as unknown as {
                pdfComments?: Array<{ anchor?: Record<string, unknown>; comment?: Record<string, unknown> }>;
                __commentAnchors?: Array<{ anchor?: Record<string, unknown>; comment?: Record<string, unknown> }>;
              }).__commentAnchors) ||
              []
            }
            activeDocumentId={activeDocumentId}
            changeSchemas={changeSchemas}
            sidebarOpen={sidebarOpen}
            sidebarWidth={rightSidebarWidth}
            preserveSidebarSpace={shouldReserveRightSidebarSpace}
            onEdit={onEdit}
            featureToggles={canvasFeatureToggles}
            styleOverrides={designerEngine.canvas?.styleOverrides}
          classNames={designerEngine.canvas?.classNames}
          useDefaultStyles={designerEngine.canvas?.useDefaultStyles ?? true}
          components={designerEngine.canvas?.components}
          bridge={componentBridge}
          canvasActions={{
            addPageAfter: pageManipulation.addPageAfter,
            uploadPdf: handleUploadPdfClick,
          }}
          selectionCommands={selectionCommands}
          onInteractionStateChange={handleInteractionStateChange}
          />
        <CommentDialog
          open={commentDialogOpen}
          initialText={''}
          onClose={() => {
            setCommentDialogOpen(false);
            setPendingAnchor(null);
          }}
          onSave={handleSaveComment}
        />
        </div>
        <DragOverlay zIndex={1000} className={DESIGNER_CLASSNAME + "dragoverlay-auto"}>
          {activeDragData ? (
            <div
              className={DESIGNER_CLASSNAME + "drag-preview-root"}
            >
              {isDraggingOverCanvas ? (
                /* MODO LIENZO: Muestra el recuadro del esquema con el + arriba al centro */
                (<div className={DESIGNER_CLASSNAME + "drag-preview-canvas"}>
                  <Renderer
                    schema={{
                      ...cloneDeep(activeDragData.schema),
                      id: 'drag-overlay',
                      position: { x: 0, y: 0 }
                    } as SchemaForUI}
                    basePdf={activeBasePdf}
                    value={activeDragData.schema.content || ''}
                    mode={'viewer'}
                    outline={`2px solid ${resolveSchemaTone(
                      activeDragData.schema as SchemaForUI,
                      typeof options.theme?.colorPrimary === 'string' ? options.theme.colorPrimary : '#1677ff',
                    )}`}
                    scale={scale}
                    selectable={false}
                  />
                  {/* Plus Icon at Top Center */}
                  <div
                    className={DESIGNER_CLASSNAME + "drag-preview-plus-badge"}
                  >
                    <Plus size={16} strokeWidth={3} />
                  </div>
                </div>)
              ) : (
                /* MODO ICONO: Muestra el icono del plugin con un badge */
                (<div
                  className={DESIGNER_CLASSNAME + "drag-preview-icon"}
                >
                  {pluginsRegistry.findByType(activeDragData.type) ? (
                    <PluginIcon
                      plugin={pluginsRegistry.findByType(activeDragData.type)!}
                      label={activeDragData.type}
                      size={32}
                    />
                  ) : null}
                  <div
                    className={DESIGNER_CLASSNAME + "drag-preview-plus-badge"}
                  >
                    <Plus size={14} strokeWidth={3} />
                  </div>
                </div>)
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </Root>
  );
};

export default TemplateEditor;

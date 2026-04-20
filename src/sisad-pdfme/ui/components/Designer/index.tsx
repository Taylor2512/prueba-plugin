import React, { useRef, useState, useContext, useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  cloneDeep,
  ZOOM,
  Template,
  Schema,
  SchemaForUI,
  ChangeSchemas,
  DesignerProps,
  Size,
  isBlankPdf,
  px2mm,
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
import type { DesignerDocumentItem } from './RightSidebar/DocumentsRail.js';
import type { DesignerRuntimeApi, DesignerSidebarPresentation } from '../../types.js';
import { resolveSchemaTone } from './shared/schemaTone.js';
import {
  resolveDesignerEngine,
  attachSchemaIdentity,
  applySchemaCreationHook,
  getSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
} from '../../designerEngine.js';
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
    schemas: nextSchemas,
  };
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
  onPageCursorChange: (newPageCursor: number, totalPages: number) => void;
}) => {
  const past = useRef<SchemaForUI[][]>([]);
  const future = useRef<SchemaForUI[][]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const paperRefs = useRef<HTMLDivElement[]>([]);
  const pdfUploadInputRef = useRef<HTMLInputElement>(null);
  const internalTemplateSyncRef = useRef(false);
  const documentSchemasCacheRef = useRef<Map<string, SchemaForUI[][]>>(new Map());

  const i18n = useContext(I18nContext);
  const pluginsRegistry = useContext(PluginsRegistry);
  const options = useContext(OptionsContext);
  const designerEngine = useMemo(() => resolveDesignerEngine(options as Record<string, unknown>), [options]);
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
  const [rightSidebarViewMode, setRightSidebarViewMode] = useState<'auto' | 'fields' | 'detail' | 'docs'>('auto');
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openPropertiesPanel = useCallback(() => {
    setSidebarOpen(true);
    setRightSidebarViewMode('detail');
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

  useEffect(() => {
    if (!activeElements.length) return;

    const activePaper = paperRefs.current[pageCursor];
    if (!activePaper) return;

    const nextActive = activeElements
      .map((element) => document.getElementById(element.id))
      .filter((element): element is HTMLElement => Boolean(element))
      .filter((element) => {
        if (!element.classList.contains(SELECTABLE_CLASSNAME)) return false;
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
  }, [activeElements, pageCursor, schemasList]);

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
  const pushTemplateUpdate = useCallback(
    (nextTemplate: Template) => {
      setVisibleTemplate(nextTemplate);
      internalTemplateSyncRef.current = true;
      onChangeTemplate(nextTemplate);
    },
    [onChangeTemplate],
  );

  const { backgrounds, pageSizes, scale, error } = useUIPreProcessor({
    template: visibleTemplate,
    size,
    zoomLevel,
    maxZoom,
  });

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
      future.current = [];
      past.current.push(cloneDeep(schemasList[pageCursor]));
      const _schemasList = cloneDeep(schemasList);
      _schemasList[pageCursor] = newSchemas;
      setSchemasList(_schemasList);
      pushTemplateUpdate(schemasList2template(_schemasList, activeBasePdf));
    },
    [activeBasePdf, pageCursor, pushTemplateUpdate, schemasList],
  );

  const removeSchemas = useCallback(
    (ids: string[]) => {
      commitSchemas(schemasList[pageCursor].filter((schema) => !ids.includes(schema.id)));
      onEditEnd();
    },
    [schemasList, pageCursor, commitSchemas],
  );

  const changeSchemas: ChangeSchemas = useCallback(
    (objs) => {
      _changeSchemas({
        objs,
        schemas: schemasList[pageCursor],
        basePdf: activeBasePdf,
        pluginsRegistry,
        pageSize: pageSizes[pageCursor],
        commitSchemas,
      });
    },
    [activeBasePdf, commitSchemas, pageCursor, pageSizes, pluginsRegistry, schemasList],
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
    ],
  );

  useInitEvents({
    pageCursor,
    pageSizes,
    activeElements,
    template: visibleTemplate,
    schemasList,
    changeSchemas,
    commitSchemas,
    removeSchemas,
    onSaveTemplate,
    past,
    future,
    setSchemasList,
    onEdit,
    onEditEnd,
    selectionCommands,
  });

  const updateTemplate = useCallback(async (newTemplate: Template) => {
    setVisibleTemplate(newTemplate);
    const sl = await template2SchemasList(newTemplate);
    setSchemasList(sl);
    setPageCursor((prev) => {
      if (sl.length <= 0) return 0;
      return Math.max(0, Math.min(prev, sl.length - 1));
    });
    if (pageCursor >= sl.length && canvasRef.current?.scroll) {
      canvasRef.current.scroll({ top: 0, behavior: 'smooth' });
    }
  }, [pageCursor]);

  const loadDocumentIntoCanvas = useCallback(
    async (document: UploadedPdfDocument, targetPageIndex = 0) => {
      if (!document?.id) return;
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

    const creationContext = {
      fileId: activeDocumentId || null,
      pageIndex: pageCursor,
      pageNumber: pageCursor + 1,
      totalPages: schemasList.length,
      timestamp: Date.now(),
    };
    s = applySchemaCreationHook(s, creationContext, designerEngine);
    s = attachSchemaIdentity(s, creationContext, designerEngine);

    commitSchemas(schemasList[pageCursor].concat(s));
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
    if (past.current.length <= 0) return;
    future.current.push(cloneDeep(schemasList[pageCursor]));
    const updatedSchemas = cloneDeep(schemasList);
    updatedSchemas[pageCursor] = past.current.pop()!;
    setSchemasList(updatedSchemas);
    pushTemplateUpdate(schemasList2template(updatedSchemas, activeBasePdf));
    onEditEnd();
  }, [activeBasePdf, onEditEnd, pageCursor, pushTemplateUpdate, schemasList]);

  const redoExternal = useCallback(() => {
    if (future.current.length <= 0) return;
    past.current.push(cloneDeep(schemasList[pageCursor]));
    const updatedSchemas = cloneDeep(schemasList);
    updatedSchemas[pageCursor] = future.current.pop()!;
    setSchemasList(updatedSchemas);
    pushTemplateUpdate(schemasList2template(updatedSchemas, activeBasePdf));
    onEditEnd();
  }, [activeBasePdf, onEditEnd, pageCursor, pushTemplateUpdate, schemasList]);

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

  const applyExternalPrefill = useCallback(
    (payload: Record<string, unknown>, matcher: SchemaMatcher = 'name') => {
      if (!payload || typeof payload !== 'object') return 0;
      const entries = Object.entries(payload);
      if (entries.length === 0) return 0;

      const nextSchemasList = cloneDeep(schemasList);
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

        const next = cloneDeep(schemasList);
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
        viewportMode,
        sidebarOpen,
        isSchemaDragging,
        isDraggingOverCanvas,
        activeSchemaIds: activeElements.map((element) => element.id),
        hoveringSchemaId,
        interactionPhase: interactionState.phase,
        interactionCount: interactionState.selectionCount,
        isDragging: interactionState.isDragging,
        isResizing: interactionState.isResizing,
        isRotating: interactionState.isRotating,
      },
    }),
    [
      activeElements,
      hoveringSchemaId,
      isDraggingOverCanvas,
      isSchemaDragging,
      pageCursor,
      runtimeApi,
      schemasList.length,
      sidebarOpen,
      viewportMode,
      zoomLevel,
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

    const _schemasList = cloneDeep(schemasList);
    _schemasList.splice(pageCursor, 1);
    updatePage(_schemasList, pageCursor - 1);
  }

  function handleAddPageAfter() {
    const _schemasList = cloneDeep(schemasList);
    _schemasList.splice(pageCursor + 1, 0, []);
    updatePage(_schemasList, pageCursor + 1);
  }

  function handleDuplicatePageAfter() {
    const _schemasList = cloneDeep(schemasList);
    _schemasList.splice(pageCursor + 1, 0, cloneDeep(_schemasList[pageCursor] || []));
    updatePage(_schemasList, pageCursor + 1);
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
      const file = input.files?.[0];
      if (!file) {
        input.value = '';
        return;
      }

      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
      if (!isPdf) {
        window.alert('Selecciona un archivo PDF valido.');
        input.value = '';
        return;
      }

      try {
        const buffer = await file.arrayBuffer();
        const pdfPages = await pdf2size(buffer.slice(0));
        const targetPageCount = Math.max(1, pdfPages.length || 1);
        const normalizedSchemas = cloneDeep(schemasList);
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
        setActiveDocumentId(newDocumentId);
        documentSchemasCacheRef.current.set(newDocumentId, normalizedSchemas);
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
      } catch (uploadError) {
        console.error('Failed to load uploaded PDF', uploadError);
        window.alert('No se pudo cargar el PDF.');
      } finally {
        input.value = '';
      }
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

    const normalizedSchemas = cloneDeep(schemasList);
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
      width={responsiveRightSidebarWidthRaw}
      detached={rightSidebarDetached}
      presentation={rightSidebarPresentation}
      responsiveBreakpoint={Number.isFinite(rightSidebarResponsiveBreakpoint) ? rightSidebarResponsiveBreakpoint : 1080}
      viewportWidth={viewportWidth}
      useLayoutFrame={rightSidebarUseLayout}
      documents={{
        items: uploadedDocumentItems,
        selectedId: activeDocumentId,
        onSelect: async (id) => {
          const targetDoc = uploadedDocuments.find((doc) => doc.id === id);
          if (!targetDoc) return;
          if (targetDoc.id === activeDocumentId) return;
          onEditEnd();
          setActiveDocumentId(targetDoc.id);
          emitActiveDocumentChange(targetDoc);
          await loadDocumentIntoCanvas(targetDoc, 0);
        },
        onUploadPdf: handleUploadPdfClick,
        title: 'Documentos cargados',
        emptyTitle: 'Todavía no hay documentos cargados. Sube un PDF para empezar.',
      }}
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
      showDocumentsRail={pageItems.length > 0 || uploadedDocumentItems.length > 0}
      autoFocusDetail={true}
      viewMode={rightSidebarViewMode}
      onViewModeChange={(mode) => setRightSidebarViewMode(mode)}
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

          setIsDraggingOverCanvas(isOverCanvas);
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

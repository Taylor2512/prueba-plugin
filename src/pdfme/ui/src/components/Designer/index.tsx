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
} from '@pdfme/common';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import Renderer from '../Renderer.js';
import PluginIcon from './PluginIcon.js';
import RightSidebarDefault from './RightSidebar/index.js';
import LeftSidebarDefault from './LeftSidebar.js';
import Canvas from './Canvas/index.js';
import { Trash2, Plus } from 'lucide-react';
import { RULER_HEIGHT, RIGHT_SIDEBAR_WIDTH, LEFT_SIDEBAR_WIDTH, DESIGNER_CLASSNAME } from '../../constants.js';
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
.pdfme-designer-root {
  --pdfme-radius: 10px;
  --pdfme-radius-sm: 8px;
  --pdfme-border: rgba(148, 163, 184, 0.28);
  --pdfme-border-strong: rgba(100, 116, 139, 0.38);
  --pdfme-surface: #ffffff;
  --pdfme-surface-alt: #f8fafc;
  --pdfme-surface-soft: #f1f5f9;
  --pdfme-text: #1e293b;
  --pdfme-text-muted: #64748b;
  --pdfme-accent: #6d28d9;
  --pdfme-accent-soft: rgba(109, 40, 217, 0.14);
  --pdfme-info-soft: rgba(37, 99, 235, 0.08);
  --pdfme-danger: #b91c1c;
  --pdfme-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.08);
  --pdfme-shadow-md: 0 10px 20px rgba(15, 23, 42, 0.12);
}

.pdfme-designer-root[data-pdfme-theme="graphite"] {
  --pdfme-border: rgba(148, 163, 184, 0.34);
  --pdfme-surface: #f9fbff;
  --pdfme-surface-alt: #f1f5f9;
  --pdfme-surface-soft: #e9eef7;
  --pdfme-accent: #4f46e5;
  --pdfme-accent-soft: rgba(79, 70, 229, 0.14);
}

.pdfme-designer-root[data-pdfme-theme="night"] {
  --pdfme-border: rgba(148, 163, 184, 0.32);
  --pdfme-border-strong: rgba(148, 163, 184, 0.48);
  --pdfme-surface: #1f2937;
  --pdfme-surface-alt: #111827;
  --pdfme-surface-soft: #0f172a;
  --pdfme-text: #f8fafc;
  --pdfme-text-muted: #cbd5e1;
  --pdfme-accent: #8b5cf6;
  --pdfme-accent-soft: rgba(139, 92, 246, 0.2);
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
  const [schemasList, setSchemasList] = useState<SchemaForUI[][]>([[]] as SchemaForUI[][]);
  const [pageCursor, setPageCursor] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(options.zoomLevel ?? 1);
  const [sidebarOpen, setSidebarOpen] = useState(options.sidebarOpen ?? true);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('manual');
  const [isSchemaDragging, setIsSchemaDragging] = useState(false);
  const [isDraggingOverCanvas, setIsDraggingOverCanvas] = useState(false);
  const [activeDragData, setActiveDragData] = useState<{ schema: Schema; type: string } | null>(null);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const { backgrounds, pageSizes, scale, error, refresh } = useUIPreProcessor({
    template,
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
      onChangeTemplate(schemasList2template(_schemasList, template.basePdf));
    },
    [template, schemasList, pageCursor, onChangeTemplate],
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
        basePdf: template.basePdf,
        pluginsRegistry,
        pageSize: pageSizes[pageCursor],
        commitSchemas,
      });
    },
    [commitSchemas, pageCursor, schemasList, pluginsRegistry, pageSizes, template.basePdf],
  );

  useInitEvents({
    pageCursor,
    pageSizes,
    activeElements,
    template,
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
  });

  const updateTemplate = useCallback(async (newTemplate: Template) => {
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

  const addSchema = (defaultSchema: Schema) => {
    const [paddingTop, paddingRight, paddingBottom, paddingLeft] = isBlankPdf(template.basePdf)
      ? template.basePdf.padding
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

    let s = {
      id: uuid(),
      ...defaultSchema,
      name: newSchemaName(i18n('field')),
      position: {
        x: ensureMiddleValue(
          paddingLeft,
          defaultSchema.position.x,
          pageSize.width - paddingRight - defaultSchema.width,
        ),
        y: ensureMiddleValue(
          paddingTop,
          defaultSchema.position.y,
          pageSize.height - paddingBottom - defaultSchema.height,
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
      pageIndex: pageCursor,
      totalPages: schemasList.length,
      timestamp: Date.now(),
    };
    s = attachSchemaIdentity(s, creationContext, designerEngine);
    s = applySchemaCreationHook(s, creationContext, designerEngine);

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
      const schemaWidth = Number(defaultSchema?.width) || 45;
      const schemaHeight = Number(defaultSchema?.height) || 10;
      const centered = {
        ...defaultSchema,
        position: {
          x: round(Math.max(0, (pageSize.width - schemaWidth) / 2), 2),
          y: round(Math.max(0, (pageSize.height - schemaHeight) / 2), 2),
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
    (targetPage: number) => {
      if (!canvasRef.current || schemasList.length === 0) return;

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
    onChangeTemplate(schemasList2template(updatedSchemas, template.basePdf));
    onEditEnd();
  }, [onChangeTemplate, onEditEnd, pageCursor, schemasList, template.basePdf]);

  const redoExternal = useCallback(() => {
    if (future.current.length <= 0) return;
    past.current.push(cloneDeep(schemasList[pageCursor]));
    const updatedSchemas = cloneDeep(schemasList);
    updatedSchemas[pageCursor] = future.current.pop()!;
    setSchemasList(updatedSchemas);
    onChangeTemplate(schemasList2template(updatedSchemas, template.basePdf));
    onEditEnd();
  }, [onChangeTemplate, onEditEnd, pageCursor, schemasList, template.basePdf]);

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
        onChangeTemplate(schemasList2template(nextSchemasList, template.basePdf));
      }

      return touched;
    },
    [designerEngine, onChangeTemplate, schemasList, template.basePdf],
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
      nextPage: () => setPageCursorWithScroll(pageCursor + 1),
      prevPage: () => setPageCursorWithScroll(pageCursor - 1),
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
        onChangeTemplate(schemasList2template(next, template.basePdf));
        return true;
      },
      applyExternalPrefill,
    }),
    [
      applyExternalPrefill,
      addSchemaAtCenter,
      addSchemaByType,
      applyViewportMode,
      designerEngine,
      findSchemaLocation,
      focusFieldExternal,
      getCanvasMetrics,
      onChangeTemplate,
      pageCursor,
      redoExternal,
      resolveTargetPageIndex,
      schemasList,
      viewportMode,
      setPageCursorWithScroll,
      template.basePdf,
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

  const updatePage = async (sl: SchemaForUI[][], newPageCursor: number) => {
    setPageCursor(newPageCursor);
    const newTemplate = schemasList2template(sl, template.basePdf);
    onChangeTemplate(newTemplate);
    await updateTemplate(newTemplate);
    void refresh(newTemplate);

    // Notify page change with updated total pages
    onPageCursorChange(newPageCursor, sl.length);

    // Use setTimeout to update scroll position after render
    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.scrollTop = getPagesScrollTopByIndex(pageSizes, newPageCursor, scale);
      }
    }, 0);
  };

  const handleRemovePage = () => {
    if (pageCursor === 0) return;
    if (!window.confirm(i18n('removePageConfirm'))) return;

    const _schemasList = cloneDeep(schemasList);
    _schemasList.splice(pageCursor, 1);
    void updatePage(_schemasList, pageCursor - 1);
  };

  const handleAddPageAfter = () => {
    const _schemasList = cloneDeep(schemasList);
    _schemasList.splice(pageCursor + 1, 0, []);
    void updatePage(_schemasList, pageCursor + 1);
  };

  useEffect(() => {
    void updateTemplate(template);
  }, [template, updateTemplate]);

  if (error) {
    // Pass the error directly to ErrorScreen
    return <ErrorScreen size={size} error={error} />;
  }
  const pageManipulation = isBlankPdf(template.basePdf)
    ? { addPageAfter: handleAddPageAfter, removePage: handleRemovePage }
    : {};
  const stageSelectionState = activeElements.length > 0 ? 'selected' : hoveringSchemaId ? 'hover' : 'idle';
  const stageSelectionCount = activeElements.length > 1 ? 'multiple' : activeElements.length === 1 ? 'single' : 'none';
  const documentItems = useMemo<DesignerDocumentItem[]>(
    () =>
      pageSizes.map((pageSize, index) => ({
        id: `page-${index + 1}`,
        name: `Documento ${index + 1}`,
        pageLabel: `${index + 1}`,
        previewSrc: backgrounds[index] || null,
        selected: index === pageCursor,
        meta:
          Number.isFinite(pageSize?.width) && Number.isFinite(pageSize?.height)
            ? `${round(pageSize.width, 1)} x ${round(pageSize.height, 1)} mm`
            : undefined,
      })),
    [backgrounds, pageCursor, pageSizes],
  );
  const { className: leftSidebarEngineClassName, ...leftSidebarEngineProps } = leftSidebarEngine || {};
  const { className: rightSidebarEngineClassName, ...rightSidebarEngineProps } = rightSidebarEngine || {};

  const leftSidebarNode = leftSidebarVisible ? (
    <LeftSidebar
      scale={scale}
      basePdf={template.basePdf}
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
  const rightSidebarNode = (
    <RightSidebar
      hoveringSchemaId={hoveringSchemaId}
      onChangeHoveringSchemaId={onChangeHoveringSchemaId}
      height={canvasRef.current ? canvasRef.current.clientHeight : 0}
      size={size}
      pageSize={pageSizes[pageCursor] ?? { width: 0, height: 0 }}
      basePdf={template.basePdf}
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
        items: documentItems,
        selectedId: documentItems[pageCursor]?.id || null,
        onSelect: (id) => {
          const pageIndex = documentItems.findIndex((item) => item.id === id);
          if (pageIndex >= 0) setPageCursorWithScroll(pageIndex);
        },
        onAdd: pageManipulation.addPageAfter,
      }}
      showDocumentsRail={documentItems.length > 0}
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
          data-left-sidebar-variant={leftSidebarVariant}
          data-left-sidebar-detached={leftSidebarDetached ? 'true' : 'false'}
          data-left-sidebar-layout={leftSidebarUseLayout ? 'frame' : 'default'}
          data-right-sidebar-detached={rightSidebarDetached ? 'true' : 'false'}
          data-sidebar-open={sidebarOpen ? 'true' : 'false'}
          data-selection-state={stageSelectionState}
          data-selection-count={stageSelectionCount}
          data-is-dragging={isSchemaDragging ? 'true' : 'false'}
          data-schema-dragging={isSchemaDragging ? 'true' : 'false'}
          data-schema-over-canvas={isDraggingOverCanvas ? 'true' : 'false'}
          data-is-idle={isIdle ? 'true' : 'false'}
          data-ui-state={
            isSchemaDragging ? 'dragging'
              : activeElements.length > 0 ? 'editing'
                : hoveringSchemaId ? 'hovering'
                  : 'idle'
          }>
          <CtlBar
            size={sizeExcSidebars}
            pageCursor={pageCursor}
            pageNum={schemasList.length}
            setPageCursor={setPageCursorWithScroll}
            zoomLevel={zoomLevel}
            setZoomLevel={setZoomLevel}
            {...pageManipulation}
          />

          {!rightSidebarDetached ? rightSidebarNode : null}

          <Canvas
            ref={canvasRef}
            paperRefs={paperRefs}
            basePdf={template.basePdf}
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
            removeSchemas={removeSchemas}
            sidebarOpen={sidebarOpen}
            sidebarWidth={rightSidebarWidth}
            preserveSidebarSpace={shouldReserveRightSidebarSpace}
            onEdit={onEdit}
            featureToggles={designerEngine.canvas?.featureToggles}
            styleOverrides={designerEngine.canvas?.styleOverrides}
            classNames={designerEngine.canvas?.classNames}
            useDefaultStyles={designerEngine.canvas?.useDefaultStyles ?? true}
            components={designerEngine.canvas?.components}
            bridge={componentBridge}
          />
        </div>
        <DragOverlay zIndex={1000} className={DESIGNER_CLASSNAME + "dragoverlay-auto"}>
          {activeDragData ? (
            <div
              className={DESIGNER_CLASSNAME + "div-auto"}
            >
              {isDraggingOverCanvas ? (
                /* MODO LIENZO: Muestra el recuadro del esquema con el + arriba al centro */
                (<div className={DESIGNER_CLASSNAME + "div-auto"}>
                  <Renderer
                    schema={{
                      ...cloneDeep(activeDragData.schema),
                      id: 'drag-overlay',
                      position: { x: 0, y: 0 }
                    } as SchemaForUI}
                    basePdf={template.basePdf}
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
                    className={DESIGNER_CLASSNAME + "div-auto"}
                  >
                    <Plus size={16} strokeWidth={3} />
                  </div>
                </div>)
              ) : (
                /* MODO ICONO: Muestra el icono del plugin con un badge */
                (<div
                  className={DESIGNER_CLASSNAME + "div-auto"}
                >
                  {pluginsRegistry.findByType(activeDragData.type) ? (
                    <PluginIcon
                      plugin={pluginsRegistry.findByType(activeDragData.type)!}
                      label={activeDragData.type}
                      size={32}
                    />
                  ) : null}
                  <div
                    className={DESIGNER_CLASSNAME + "div-auto"}
                  >
                    <Plus size={14} strokeWidth={3} />
                  </div>
                </div>)
              )}
            </div>
          ) : null}
        </DragOverlay>
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes ccf-drag-pulse {
            0% { transform: scale(${scale / zoomLevel}) rotate(-2deg); }
            50% { transform: scale(${(scale / zoomLevel) * 1.1}) rotate(2deg); }
            100% { transform: scale(${scale / zoomLevel}) rotate(-2deg); }
          }
          @keyframes ccf-drag-float {
            0% { transform: scale(${scale / zoomLevel}) translateY(0px); }
            50% { transform: scale(${scale / zoomLevel}) translateY(-8px); }
            100% { transform: scale(${scale / zoomLevel}) translateY(0px); }
          }
        `}} />
      </DndContext>
    </Root>
  );
};

export default TemplateEditor;

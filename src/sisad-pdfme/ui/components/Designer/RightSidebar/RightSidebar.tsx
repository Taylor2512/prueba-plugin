import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  SidebarProps,
  DesignerComponentBridge,
  DesignerCommentsBridge,
  DesignerDocumentsBridge,
  DesignerSidebarPresentation,
} from '@sisad-pdfme/ui/types';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import ListView from '@sisad-pdfme/ui/components/Designer/RightSidebar/ListView/ListView';
import DetailView from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView';
import { SidebarFrame } from '@sisad-pdfme/ui/components/Designer/RightSidebar/layout';
import DocumentsRail, { DocumentsRailProps } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail';
import CommentsRail, { CommentsRailProps } from '@sisad-pdfme/ui/components/Designer/RightSidebar/CommentsRail';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { SidebarRail, type SidebarRailItem } from '@sisad-pdfme/ui/components/Designer/shared/SidebarRail';
import { SidebarCollapseHandle } from '@sisad-pdfme/ui/components/Designer/shared/SidebarCollapseHandle';
import type { SelectionCommandSet } from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import { useResponsiveDensity } from '@sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity';
import { Layers, SlidersHorizontal, FileText, MessageSquareText } from 'lucide-react';
import {
  resolveRightSidebarContextHeader,
  type RightSidebarContextHeader,
} from '@sisad-pdfme/ui/components/Designer/RightSidebar/contextHeader';
import { resolveSchemaIdentityFromElement } from '@sisad-pdfme/ui/components/Designer/shared/selectionIdentityResolver';
import { useDesignerUiConfig } from '@sisad-pdfme/ui/components/Designer/shared/useDesignerUiConfig';

/**
 * Props extendidas del sidebar derecho del diseñador.
 *
 * Este componente orquesta las vistas de campos, detalle, documentos y
 * comentarios. También controla presentación responsive, tabs internas,
 * customización de slots y configuración de rails auxiliares.
 */
export type RightSidebarProps = SidebarProps & {
  /** Ancho deseado del sidebar cuando el host lo usa como panel acoplado. */
  width?: number;

  /** Indica si el sidebar se renderiza desacoplado del layout principal. */
  detached?: boolean;

  /** Presentación forzada o automática del sidebar. */
  presentation?: DesignerSidebarPresentation;

  /** Breakpoint para alternar entre presentación docked/overlay. */
  responsiveBreakpoint?: number;

  /** Ancho de viewport inyectado por el host; si falta, se usa `window.innerWidth`. */
  viewportWidth?: number;

  /** Envuelve el contenido con `SidebarFrame` adicional para layouts compuestos. */
  useLayoutFrame?: boolean;

  /** Clase adicional del root. */
  className?: string;

  /** ID del aside raíz. */
  rootId?: string;

  /** Controla aplicación de estilos por defecto. */
  useDefaultStyles?: boolean;

  /** Indica si el canvas debe preservar espacio para el sidebar. */
  preserveCanvasSpace?: boolean;

  /** Modo de rail documental cuando comparte espacio con el contenido. */
  documentsRailMode?: 'split' | 'stacked' | 'auto';

  /** Clases por subregión. */
  classNames?: {
    root?: string;
    content?: string;
    listView?: string;
    detailView?: string;
  };

  /** Overrides de estilo por subregión. */
  styleOverrides?: {
    root?: React.CSSProperties;
    content?: React.CSSProperties;
    documentsRail?: React.CSSProperties;
    listView?: React.CSSProperties;
    detailView?: React.CSSProperties;
  };

  /** Bridge imperativo del diseñador. */
  bridge?: DesignerComponentBridge;

  /** Bridge para documentos multi-archivo. */
  documents?: DesignerDocumentsBridge;

  /** Bridge alternativo/alias para páginas. */
  pages?: DesignerDocumentsBridge;

  /** Bridge de comentarios. */
  comments?: DesignerCommentsBridge;

  /** Controla si se muestra rail/tab de documentos. */
  showDocumentsRail?: boolean;

  /** Vista solicitada por el host o `auto` para control interno. */
  viewMode?: 'auto' | 'fields' | 'detail' | 'docs' | 'comments';

  /** Cuando hay un único schema seleccionado, enfoca automáticamente detalle. */
  autoFocusDetail?: boolean;

  /** Muestra tabs internas de documentos/comentarios/campos. */
  showDocumentsAsTab?: boolean;

/** Modo de acceso documental reservado para integración con hosts. */
  documentsAccessMode?: 'always' | 'tab';

  /** Notifica cambios de vista efectivos al host. */
  onViewModeChange?: (_mode: 'fields' | 'detail' | 'docs' | 'comments') => void;

  /** Header contextual adicional, estático o derivado del modo activo. */
  contextHeader?: RightSidebarContextHeader;

  /** Comandos de selección disponibles para ListView/DetailView. */
  selectionCommands?: SelectionCommandSet;

  /** Overrides de etiquetas/iconos por modo. */
  modeMetaOverrides?: Partial<Record<'fields' | 'detail' | 'docs' | 'comments', Partial<SidebarModeMeta>>>;

  /** Componentes reemplazables para adaptar el sidebar desde el host. */
  components?: {
    listView?: typeof ListView;
    detailView?: typeof DetailView;
    documentsRail?: React.ComponentType<DocumentsRailProps>;
    commentsView?: React.ComponentType<CommentsRailProps>;
  };
};

/**
 * Normaliza una clase del host para convertirla en clase custom del runtime.
 *
 * @param value Clase declarada por el host.
 * @returns Clase prefijada con `DESIGNER_CLASSNAME` o string vacío.
 */
const toDesignerCustomClassName = (value?: string) => {
  if (typeof value !== 'string') return '';
  const normalized = value.trim();
  if (!normalized) return '';
  return `${DESIGNER_CLASSNAME}custom-${normalized}`;
};

type SidebarModeMeta = {
  /** Etiqueta completa mostrada en modo cómodo. */
  fullLabel: string;

  /** Etiqueta compacta mostrada en modo reducido. */
  compactLabel: string;

  /** Ícono visible en tab. */
  icon: React.ReactNode;

  /** Tooltip/título del tab. */
  title: string;

  /** Etiqueta accesible del tab. */
  ariaLabel: string;
};

/** IDs estables de paneles para relaciones tab/tabpanel. */
const PANEL_ID_BY_MODE: Record<'fields' | 'detail' | 'docs' | 'comments', string> = {
  fields: 'sisad-pdfme-right-sidebar-panel-fields',
  detail: 'sisad-pdfme-right-sidebar-panel-detail',
  comments: 'sisad-pdfme-right-sidebar-panel-comments',
  docs: 'sisad-pdfme-right-sidebar-panel-docs',
};

/** IDs estables de tabs para accesibilidad. */
const TAB_ID_BY_MODE: Record<'fields' | 'detail' | 'docs' | 'comments', string> = {
  fields: 'sisad-pdfme-right-sidebar-tab-fields',
  detail: 'sisad-pdfme-right-sidebar-tab-detail',
  comments: 'sisad-pdfme-right-sidebar-tab-comments',
  docs: 'sisad-pdfme-right-sidebar-tab-docs',
};

/** Metadata visual por modo del sidebar. */
const sidebarModeMeta: Record<'fields' | 'detail' | 'docs' | 'comments', SidebarModeMeta> = {
  fields: {
    fullLabel: 'Campos',
    compactLabel: 'Campos',
    icon: <Layers size={14} />,
    title: 'Ver campos',
    ariaLabel: 'Abrir panel Campos',
  },
  detail: {
    fullLabel: 'Detalle',
    compactLabel: 'Detalle',
    icon: <SlidersHorizontal size={14} />,
    title: 'Ver detalle',
    ariaLabel: 'Abrir panel Detalle',
  },
  docs: {
    fullLabel: 'Documentos',
    compactLabel: 'Docs',
    icon: <FileText size={14} />,
    title: 'Ver documentos',
    ariaLabel: 'Abrir panel Documentos',
  },
  comments: {
    fullLabel: 'Comentarios',
    compactLabel: 'Com.',
    icon: <MessageSquareText size={14} />,
    title: 'Ver comentarios',
    ariaLabel: 'Abrir panel Comentarios',
  },
};

/**
 * Sidebar derecho principal del diseñador.
 *
 * Responsabilidades:
 *
 * - resolver selección activa desde `activeElements`;
 * - alternar entre lista, detalle, documentos y comentarios;
 * - decidir presentación docked/overlay según viewport;
 * - renderizar tabs accesibles cuando aplica;
 * - inyectar componentes reemplazables;
 * - coordinar rail de documentos con contenido principal;
 * - notificar cambios de vista al host.
 *
 * Restricciones:
 *
 * - no debe mutar schemas directamente;
 * - no debe manipular DOM del canvas;
 * - no debe conocer reglas internas de Moveable/Selecto;
 * - debe delegar acciones de edición a ListView, DetailView o comandos.
 */
const Sidebar = (props: RightSidebarProps) => {
  const { sidebarOpen, activeElements, schemas } = props;
  const { autoFocusDetail, onViewModeChange } = props;
  const designerUiConfig = useDesignerUiConfig();
  const visibility = designerUiConfig.visibility;
  const rightSidebarVisibility = visibility?.sidebars?.right;
  const rightSidebarPanelsVisibility = rightSidebarVisibility?.panels;
  const sidebarVisible = rightSidebarVisibility?.visible !== false;
  const detached = Boolean(props.detached);
  const sidebarRootRef = useRef<HTMLElement | null>(null);
  const { mode: sidebarDensityMode } = useResponsiveDensity(sidebarRootRef, {
    comfortable: 390,
    compact: 318,
    minimal: 256,
  });
  const sidebarIsCollapsed = !sidebarOpen;
  const useLayoutFrame = Boolean(props.useLayoutFrame);
  const viewportWidth =
    props.viewportWidth && Number.isFinite(props.viewportWidth)
      ? props.viewportWidth
      : typeof window !== 'undefined'
        ? window.innerWidth
        : 1280;
  const responsiveBreakpoint = Math.max(640, props.responsiveBreakpoint ?? 1080);
  const responsiveRootStyle = useMemo<React.CSSProperties>(() => {
    if (viewportWidth <= 48 * 16) {
      return {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 20,
        width: sidebarOpen ? '16rem' : '0',
        maxWidth: sidebarOpen ? '16rem' : '0',
        overflow: sidebarOpen ? 'visible' : 'hidden',
        borderRadius: 0,
        transition: 'width 0.22s var(--wix-ease-out)',
      };
    }

    if (viewportWidth <= 64 * 16) {
      return {
        width: 'min(20rem, calc(100vw - 2rem))',
      };
    }

    if (viewportWidth <= 80 * 16) {
      return {
        width: 'clamp(18rem, 24vw, 22.5rem)',
      };
    }

    return {};
  }, [sidebarOpen, viewportWidth]);
  const DocumentsRailComponent = props.components?.documentsRail || DocumentsRail;
  const CommentsViewComponent = props.components?.commentsView || CommentsRail;
  const ListViewComponent = props.components?.listView || ListView;
  const DetailViewComponent = props.components?.detailView || DetailView;

  /** Selección activa derivada de elementos DOM seleccionados. */
  const { activeSchemas, activeSchemaIds } = useMemo(() => {
    const idSet = new Set<string>();
    const ids: string[] = [];
    for (const element of activeElements) {
      if (!element) continue;
      const identity = resolveSchemaIdentityFromElement(element);
      const candidates = [identity.schemaId, identity.schemaUid].filter(Boolean) as string[];
      for (const id of candidates) {
        if (idSet.has(id)) continue;
        idSet.add(id);
        ids.push(id);
      }
    }
    return {
      activeSchemas: schemas.filter((s) =>
        idSet.has(s.id) ||
        idSet.has((s as { schemaUid?: string }).schemaUid || '') ||
        idSet.has(s.name || ''),
      ),
      activeSchemaIds: ids,
    };
  }, [activeElements, schemas]);

  const activeSchemaCount = activeSchemas.length;
  const requestedViewMode = props.viewMode || 'auto';
  const showDocumentsRail =
    props.showDocumentsRail !== false &&
    (Boolean(props.pages) || Boolean(props.documents)) &&
    rightSidebarPanelsVisibility?.documents !== false;
  const showCommentsRail = Boolean(props.comments) && rightSidebarPanelsVisibility?.comments !== false;
  const showTabs = rightSidebarVisibility?.tabs !== false;
  const showContextHeader = rightSidebarVisibility?.contextHeader !== false;
  const showCollapseButton = rightSidebarVisibility?.collapseButton !== false;

  /** Presentación responsive final del sidebar. */
  const actualPresentation = useMemo<'overlay' | 'docked'>(() => {
    if (props.presentation === 'overlay') return 'overlay';
    if (props.presentation === 'docked') return 'docked';
    return viewportWidth <= responsiveBreakpoint ? 'overlay' : 'docked';
  }, [props.presentation, responsiveBreakpoint, viewportWidth]);

  /** Decide si el rail documental comparte fila o se apila arriba del contenido. */
  const documentsRailMode = useMemo<'split' | 'stacked'>(() => {
    if ((props.documentsRailMode || 'auto') === 'split') return 'split';
    if (props.documentsRailMode === 'stacked') return 'stacked';
    return viewportWidth <= responsiveBreakpoint + 140 ? 'stacked' : 'split';
  }, [props.documentsRailMode, responsiveBreakpoint, viewportWidth]);

  const visibleModes = useMemo(() => (['fields', 'detail', 'comments', 'docs'] as const).filter((mode) => {
    if (mode === 'docs') return showDocumentsRail;
    if (mode === 'comments') return showCommentsRail;
    if (mode === 'fields') return rightSidebarPanelsVisibility?.fields !== false;
    if (mode === 'detail') return rightSidebarPanelsVisibility?.detail !== false;
    return true;
  }), [rightSidebarPanelsVisibility, showCommentsRail, showDocumentsRail]);
  const hasVisibleModes = visibleModes.length > 0;
  const fallbackViewMode = visibleModes[0] || 'fields';
  const selectionSignature = activeSchemaIds.join('|');
  const [internalViewIntent, setInternalViewIntent] = useState<{
    mode: 'fields' | 'detail' | 'docs' | 'comments';
    selectionSignature: string;
  }>({ mode: 'fields', selectionSignature: '' });
  const selectionDefaultMode =
    autoFocusDetail && activeSchemaCount === 1 && visibleModes.includes('detail')
      ? 'detail'
      : fallbackViewMode;
  const internalViewMode =
    !autoFocusDetail || internalViewIntent.selectionSignature === selectionSignature
      ? internalViewIntent.mode
      : selectionDefaultMode;
  const resolvedViewMode: 'fields' | 'detail' | 'docs' | 'comments' = useMemo(() => {
    const requested = requestedViewMode !== 'auto' ? requestedViewMode : internalViewMode;
    return visibleModes.includes(requested) ? requested : fallbackViewMode;
  }, [fallbackViewMode, internalViewMode, requestedViewMode, visibleModes]);
  const pagesBridge = props.pages || props.documents;
  const docsBridge = props.documents;
  const panelIdByMode = PANEL_ID_BY_MODE;
  const tabIdByMode = TAB_ID_BY_MODE;

  /** Metadata visual final por modo, con overrides opcionales del host. */
  const effectiveSidebarModeMeta = useMemo(() => {
    const overrides = props.modeMetaOverrides || {};
    return {
      fields: { ...sidebarModeMeta.fields, ...(overrides.fields || {}) },
      detail: { ...sidebarModeMeta.detail, ...(overrides.detail || {}) },
      docs: { ...sidebarModeMeta.docs, ...(overrides.docs || {}) },
      comments: { ...sidebarModeMeta.comments, ...(overrides.comments || {}) },
    } as Record<'fields' | 'detail' | 'docs' | 'comments', SidebarModeMeta>;
  }, [props.modeMetaOverrides]);

  const resolveTabLabel = useCallback(
    (modeMeta: SidebarModeMeta) =>
      sidebarDensityMode === 'comfortable'
        ? modeMeta.fullLabel
        : sidebarDensityMode === 'compact'
          ? modeMeta.compactLabel
          : '',
    [sidebarDensityMode],
  );

  const lastSelectionRef = useRef<{
    signature: string | null;
    mode: 'fields' | 'detail' | 'docs' | 'comments';
  }>({ signature: null, mode: 'fields' });

  /**
   * Enfoca el panel de detalle en cuanto cambia la selección a un único schema.
   *
   * Se notifica siempre al host (aunque `viewMode` esté controlado) para que un
   * host que refleja `onViewModeChange` en su estado siga mostrando el detalle
   * inmediatamente después de seleccionar en el canvas.
   */
  useEffect(() => {
    const previous = lastSelectionRef.current;
    if (previous.signature === selectionSignature) {
      previous.mode = resolvedViewMode;
      return;
    }

    const nextMode =
      autoFocusDetail && activeSchemaCount === 1 && visibleModes.includes('detail')
        ? 'detail'
        : resolvedViewMode === 'detail'
          ? fallbackViewMode
          : resolvedViewMode;
    lastSelectionRef.current = { signature: selectionSignature, mode: nextMode };

    if (autoFocusDetail && previous.mode !== nextMode) onViewModeChange?.(nextMode);
  }, [
    activeSchemaCount,
    autoFocusDetail,
    fallbackViewMode,
    onViewModeChange,
    resolvedViewMode,
    selectionSignature,
    visibleModes,
  ]);

  if (!sidebarVisible || !hasVisibleModes) return null;

  /** Modo semántico final del panel renderizado. */
  const resolvedPanelMode: 'list' | 'detail' | 'bulk' | 'docs' | 'comments' =
    resolvedViewMode === 'docs'
      ? 'docs'
      : resolvedViewMode === 'comments'
        ? 'comments'
      : activeSchemaCount > 1
        ? 'bulk'
        : activeSchemaCount === 1 && resolvedViewMode === 'detail'
          ? 'detail'
          : 'list';

  const shouldRenderDocumentsRail =
    resolvedViewMode === 'docs' && Boolean(docsBridge || pagesBridge);
  const contextHeaderNode = showContextHeader
    ? resolveRightSidebarContextHeader(props.contextHeader, {
        mode: resolvedPanelMode,
        activeCount: activeSchemaCount,
      })
    : null;

  const documentsRailClassName = mergeClassNames(
    documentsRailMode === 'stacked' && 'max-h-[40vh] min-h-0',
    documentsRailMode === 'split' && 'min-h-0',
  );

  const railDensity = documentsRailMode === 'stacked' ? 'compact' : 'default';
  const railItems = (docsBridge?.items || pagesBridge?.items) ?? [];

  /** Contrato compartido por las dos composiciones del rail documental. */
  const documentsRailProps: DocumentsRailProps = {
    items: railItems,
    selectedId: (docsBridge?.selectedId ?? pagesBridge?.selectedId) ?? null,
    onSelect: docsBridge?.onSelect ?? pagesBridge?.onSelect,
    onAdd: docsBridge?.onAdd ?? pagesBridge?.onAdd,
    onUploadPdf: docsBridge?.onUploadPdf ?? pagesBridge?.onUploadPdf,
    onDelete: docsBridge?.onDelete ?? pagesBridge?.onDelete,
    title: docsBridge?.title ?? pagesBridge?.title,
    emptyTitle: docsBridge?.emptyTitle ?? pagesBridge?.emptyTitle,
    style: props.styleOverrides?.documentsRail,
    useDefaultStyles: props.useDefaultStyles,
    density: railDensity,
    className: mergeClassNames(`${DESIGNER_CLASSNAME}documentsrailcomponent-auto`, documentsRailClassName),
  };

  const documentsRailNode = shouldRenderDocumentsRail ? (
    <DocumentsRailComponent {...documentsRailProps} />
  ) : null;

  const handleModeChange = (mode: 'fields' | 'detail' | 'docs' | 'comments') => {
    if (!visibleModes.includes(mode)) return;
    if (requestedViewMode === 'auto') {
      setInternalViewIntent({ mode, selectionSignature });
    }
    props.setSidebarOpen?.(true);
    onViewModeChange?.(mode);
  };

  /** Navegación por teclado entre tabs del panel derecho. */
  const handlePanelSwitcherKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (requestedViewMode !== 'auto') return;

    const currentIndex = visibleModes.indexOf(resolvedViewMode);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % visibleModes.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + visibleModes.length) % visibleModes.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = visibleModes.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextMode = visibleModes[nextIndex];
    handleModeChange(nextMode);
  };

  const collapsedRailItems: SidebarRailItem[] = visibleModes
    .map((mode) => {
      const modeMeta = effectiveSidebarModeMeta[mode];
      return {
        key: mode,
        icon: modeMeta.icon,
        label: modeMeta.compactLabel,
        ariaLabel: modeMeta.ariaLabel,
        active: resolvedViewMode === mode,
        onClick: () => handleModeChange(mode),
      };
    });

  const collapsedRailNode = (
    <SidebarRail
      side="right"
      items={collapsedRailItems}
      density={sidebarDensityMode === 'minimal' ? 'minimal' : sidebarDensityMode === 'compact' ? 'compact' : 'comfortable'}
      className={`${DESIGNER_CLASSNAME}right-sidebar-collapsed-rail`}
    />
  );

  const listViewNode = (
    <ListViewComponent
      {...props}
      activeSchemaIds={activeSchemaIds}
      className={mergeClassNames(toDesignerCustomClassName(props.classNames?.listView))}
      useDefaultStyles={props.useDefaultStyles}
    />
  );
  const commentsNode = (
    <CommentsViewComponent
      items={props.comments?.items ?? []}
      onAdd={props.comments?.onAdd}
      title={props.comments?.title}
      emptyTitle={props.comments?.emptyTitle}
      activeCommentId={props.comments?.activeCommentId}
    />
  );

  const docsNode = (docsBridge || pagesBridge) ? (
    <DocumentsRailComponent {...documentsRailProps} />
  ) : null;

  const detailNode = activeSchemaCount > 0 ? (
      <div
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}detail-view-host`,
          `${DESIGNER_CLASSNAME}custom-detailView`,
          'flex min-h-0 flex-1 flex-col overflow-hidden transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none',
          toDesignerCustomClassName(props.classNames?.detailView),
        )}>
      <DetailViewComponent
        {...props}
        activeSchema={activeSchemas[activeSchemas.length - 1]}
        activeElements={activeElements}
        selectionCommands={props.selectionCommands}
      />
    </div>
  ) : null;

  /** Pila de paneles: solo el modo resuelto queda visible. */
  const contentNode = (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-panel-stack', 'min-h-0 flex flex-1 flex-col overflow-hidden')}>
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'right-sidebar-panel-slot-fields',
          resolvedPanelMode === 'list' || resolvedPanelMode === 'bulk'
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
            : 'hidden',
        )}
      >
        {listViewNode}
      </div>
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'right-sidebar-panel-slot-detail',
          resolvedPanelMode === 'detail'
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
            : 'hidden',
        )}
      >
        {detailNode}
      </div>
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'right-sidebar-panel-slot-comments',
          resolvedPanelMode === 'comments'
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
            : 'hidden',
        )}
      >
        {commentsNode}
      </div>
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'right-sidebar-panel-slot-docs',
          resolvedPanelMode === 'docs'
            ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
            : 'hidden',
        )}
      >
        {docsNode}
      </div>
    </div>
  );

  return (
    <aside
      ref={sidebarRootRef}
      id={props.rootId}
      aria-label="Panel derecho del diseñador"
      aria-hidden="false"
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'right-sidebar',
        'absolute right-[0.75rem] top-0 bottom-0 z-[70] flex h-full min-h-0 w-[var(--sisad-pdfme-rs-width)] min-w-0 flex-col rounded-[1rem_0_0_1rem] border-l border-slate-200/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] shadow-[-0.75rem_0_2rem_rgba(15,23,42,0.06)]',
        'transition-[transform,opacity] duration-200 ease-out',
        sidebarOpen
          ? 'opacity-100 translate-x-0 pointer-events-auto motion-reduce:transition-none motion-reduce:duration-[1ms]'
          : 'transition-[transform,opacity] duration-150 opacity-0 translate-x-[calc(100%+var(--sisad-pdfme-rs-gap))] pointer-events-none motion-reduce:transition-none motion-reduce:duration-[1ms]',
        detached ? DESIGNER_CLASSNAME + 'right-sidebar-detached' : '',
        props.classNames?.root,
        props.className,
      )}
      style={
        sidebarIsCollapsed
            ? {
              ...(props.styleOverrides?.root || {}),
              ...(viewportWidth <= 48 * 16 ? responsiveRootStyle : {}),
              width: viewportWidth <= 48 * 16 ? '0' : '2.25rem',
              maxWidth: viewportWidth <= 48 * 16 ? '0' : '2.25rem',
              transform: 'translateX(0)',
              opacity: 1,
              pointerEvents: 'auto',
              transition: 'transform 180ms ease, opacity 150ms ease',
            }
          : {
              ...(props.styleOverrides?.root || {}),
              ...responsiveRootStyle,
            }
      }
      data-sidebar-detached={detached ? 'true' : 'false'}
      data-right-sidebar-density={sidebarDensityMode}
      data-sidebar-presentation={actualPresentation}
      data-sidebar-open={sidebarOpen ? 'true' : 'false'}
      data-sidebar-collapsed={sidebarIsCollapsed ? 'true' : 'false'}
      data-right-sidebar-expanded={sidebarOpen ? 'true' : 'false'}
      data-panel-mode={resolvedPanelMode}
      data-sidebar-mode={resolvedPanelMode}>
      {sidebarIsCollapsed ? (showTabs ? collapsedRailNode : null) : null}
      {!sidebarIsCollapsed ? (
        <div
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'right-sidebar-content',
            DESIGNER_CLASSNAME + 'sidebar-surface',
            'relative flex min-h-0 flex-1 flex-col gap-[0.25rem] overflow-hidden rounded-[0.95rem] border border-slate-200/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] p-[0.3rem_0.3rem_0.35rem] shadow-[0_10px_22px_rgba(15,23,42,0.05)] backdrop-blur-[14px] max-[820px]:p-[0.35rem]',
            props.classNames?.content,
          )}
          data-sidebar-open={sidebarOpen ? 'true' : 'false'}
          data-sidebar-collapsed={sidebarIsCollapsed ? 'true' : 'false'}
          data-docs-mode={documentsRailMode}
          data-panel-mode={resolvedPanelMode}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 right-0 top-0 z-[1] h-[2px] bg-[linear-gradient(90deg,transparent_0%,var(--color-primary-20)_30%,var(--color-primary-30)_50%,var(--color-primary-20)_70%,transparent_100%)] opacity-80"
          />
          {showTabs || contextHeaderNode ? (
            <div className={mergeClassNames(
              `${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-wrap`,
              'flex min-w-0 shrink-0 items-center justify-between gap-1 overflow-hidden rounded-[0.75rem] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.84))] px-1 py-1 shadow-[0_2px_8px_rgba(15,23,42,0.04)]',
              sidebarDensityMode === 'comfortable' ? 'px-1.5' : 'px-1'
            )}>
              {showTabs ? (
                <div
                  className={mergeClassNames(
                    `${DESIGNER_CLASSNAME}right-sidebar-panel-switcher`,
                    'flex min-w-0 flex-1 flex-nowrap items-center overflow-x-auto overflow-y-hidden rounded-[0.9rem] border border-slate-200/80 bg-white/90 p-0.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] [scrollbar-gutter:stable]',
                    sidebarDensityMode === 'comfortable' ? 'gap-0.5' :
                      sidebarDensityMode === 'compact' ? 'gap-[0.12rem]' : 'gap-[0.12rem]'
                  )}
                  role="tablist"
                  tabIndex={0}
                  aria-label="Panel derecho"
                  aria-orientation="horizontal"
                  onKeyDown={handlePanelSwitcherKeyDown}
                >
                  {visibleModes.map((mode) => {
                    const disabled = mode === 'detail' && activeSchemaCount !== 1;
                    const isActive = resolvedViewMode === mode;
                    const modeMeta = effectiveSidebarModeMeta[mode];
                    return (
                      <button
                        key={`rs-mode-${mode}`}
                        type="button"
                        disabled={disabled}
                        className={mergeClassNames(
                          `${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn`,
                          'inline-flex items-center gap-1 rounded-full border border-transparent bg-transparent font-semibold text-slate-500 transition-[background-color,color,box-shadow,transform,border-color] duration-150',
                          'hover:border-slate-200 hover:bg-slate-50 hover:text-sky-700 hover:shadow-sm',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50 focus-visible:ring-offset-1 focus-visible:ring-offset-white',
                          'disabled:cursor-not-allowed disabled:opacity-45',
                          'data-[active=true]:border-sky-200 data-[active=true]:bg-white data-[active=true]:text-sky-700 data-[active=true]:shadow-[0_2px_6px_rgba(14,165,233,0.10)] data-[active=true]:ring-1 data-[active=true]:ring-sky-100',
                          'shrink-0 whitespace-nowrap',
                          sidebarDensityMode === 'comfortable' ? 'min-h-6 px-2 py-[0.15rem] text-[10.5px]' :
                            sidebarDensityMode === 'compact' ? 'min-h-6 px-1.5 py-[0.12rem] text-[10px]' :
                              'min-h-6 px-1 py-[0.1rem] text-[9.5px]'
                        )}
                        role="tab"
                        data-active={isActive ? 'true' : 'false'}
                        aria-selected={isActive ? 'true' : 'false'}
                        aria-controls={panelIdByMode[mode]}
                        id={tabIdByMode[mode]}
                        aria-label={modeMeta.ariaLabel}
                        title={modeMeta.fullLabel}
                        onClick={() => handleModeChange(mode)}
                      >
                        <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-content inline-flex items-center gap-1`}>
                          <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-icon inline-flex items-center justify-center text-current`}>{modeMeta.icon}</span>
                          {sidebarDensityMode === 'minimal' ? null : (
                            <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-label truncate leading-none`}>
                              {resolveTabLabel(modeMeta)}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <div className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-extra flex shrink-0 items-center gap-2 pl-1`}>
                {contextHeaderNode}
                {showCollapseButton ? (
                  <div className="ml-1 flex items-center border-l border-slate-200/60 pl-2">
                    <SidebarCollapseHandle
                      side="right"
                      expanded={true}
                      onToggle={() => props.setSidebarOpen?.(false)}
                      presentation={actualPresentation}
                      density="minimal"
                      size="sm"
                      labelExpanded="Ocultar panel derecho"
                      labelCollapsed="Mostrar panel derecho"
                      className="!static !m-0 !translate-x-0"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
          {useLayoutFrame ? (
            <SidebarFrame
              className={`${DESIGNER_CLASSNAME}right-sidebar-frame`}
              role="tabpanel"
              aria-labelledby={showTabs ? tabIdByMode[resolvedPanelMode] : undefined}
              aria-label={showTabs ? undefined : effectiveSidebarModeMeta[resolvedPanelMode].title}
              id={panelIdByMode[resolvedPanelMode]}
            >
              <div className={`${DESIGNER_CLASSNAME}right-sidebar-layout-grid grid min-h-0 flex-1 gap-1.5`}>
                {resolvedPanelMode !== 'docs' ? documentsRailNode : null}
                {contentNode}
              </div>
            </SidebarFrame>
          ) : (
            <>
              {resolvedPanelMode !== 'docs' ? documentsRailNode : null}
              {contentNode}
            </>
          )}
        </div>
      ) : null}
    </aside>
  );
};

export default React.memo(Sidebar);

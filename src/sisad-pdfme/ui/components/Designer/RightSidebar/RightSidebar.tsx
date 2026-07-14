import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import type {
  SidebarProps,
  DesignerComponentBridge,
  DesignerCommentsBridge,
  DesignerDocumentsBridge,
  DesignerSidebarPresentation,
} from '../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import ListView from './ListView/ListView.js';
import DetailView from './DetailView/DetailView.js';
import { SidebarFrame } from './layout.js';
import DocumentsRail, { DocumentsRailProps } from './DocumentsRail.js';
import CommentsRail, { CommentsRailProps } from './CommentsRail.js';
import { mergeClassNames } from '../shared/className.js';
import { asRecord } from '../shared/objectGuards.js';
import { SidebarRail, type SidebarRailItem } from '../shared/SidebarRail.js';
import { SidebarCollapseHandle } from '../shared/SidebarCollapseHandle.js';
import type { SelectionCommandSet } from '../shared/selectionCommands.js';
import { useResponsiveDensity } from '../shared/useResponsiveDensity.js';
import { Layers, SlidersHorizontal, FileText, MessageSquareText } from 'lucide-react';
import { OptionsContext } from '../../../contexts.js';
import {
  resolveRightSidebarContextHeader,
  type RightSidebarContextHeader,
} from './contextHeader.js';

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

  /** Modo de acceso documental reservado para compatibilidad con hosts. */
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
  /** Etiqueta corta mostrada en tab. */
  shortLabel: string;

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
    shortLabel: 'Campos',
    icon: <Layers size={14} />,
    title: 'Ver campos',
    ariaLabel: 'Abrir panel Campos',
  },
  detail: {
    shortLabel: 'Detalle',
    icon: <SlidersHorizontal size={14} />,
    title: 'Ver detalle',
    ariaLabel: 'Abrir panel Detalle',
  },
  docs: {
    shortLabel: 'Docs',
    icon: <FileText size={14} />,
    title: 'Ver documentos',
    ariaLabel: 'Abrir panel Docs',
  },
  comments: {
    shortLabel: 'Comentarios',
    icon: <MessageSquareText size={14} />,
    title: 'Ver comentarios',
    ariaLabel: 'Abrir panel Comentarios',
  },
};

/** Orden de navegación por teclado entre tabs del sidebar. */
const sidebarModes = ['fields', 'detail', 'comments', 'docs'] as const;

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
  const options = useContext(OptionsContext);
  const optionsRecord = asRecord(options);
  const visibility = asRecord(optionsRecord?.visibility);
  const rightSidebarVisibility = asRecord(asRecord(visibility?.sidebars)?.right);
  const rightSidebarPanelsVisibility = asRecord(rightSidebarVisibility?.panels);
  if (rightSidebarVisibility?.visible === false) return null;
  const detached = Boolean(props.detached);
  const sidebarRootRef = useRef<HTMLElement | null>(null);
  const { mode: sidebarDensityMode } = useResponsiveDensity(sidebarRootRef, {
    comfortable: 390,
    compact: 318,
    mini: 256,
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
  const DocumentsRailComponent = props.components?.documentsRail || DocumentsRail;
  const CommentsViewComponent = props.components?.commentsView || CommentsRail;
  const ListViewComponent = props.components?.listView || ListView;
  const DetailViewComponent = props.components?.detailView || DetailView;

  /** Selección activa derivada de elementos DOM seleccionados. */
  const { activeSchemas, activeSchemaIds } = useMemo(() => {
    const idSet = new Set<string>();
    const ids: string[] = [];
    for (const element of activeElements) {
      if (element) { idSet.add(element.id); ids.push(element.id); }
    }
    return {
      activeSchemas: schemas.filter((s) => idSet.has(s.id)),
      activeSchemaIds: ids,
    };
  }, [activeElements, schemas]);

  const activeSchemaCount = activeSchemas.length;
  const [internalViewMode, setInternalViewMode] = useState<'fields' | 'detail' | 'docs' | 'comments'>('fields');
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
  const fallbackViewMode = visibleModes[0] || 'fields';
  if (visibleModes.length === 0) return null;
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

  /** Sincroniza auto-focus de detalle cuando el modo solicitado es `auto`. */
  useEffect(() => {
    if (requestedViewMode !== 'auto') return;

    if (!visibleModes.includes(internalViewMode)) {
      setInternalViewMode(fallbackViewMode);
      onViewModeChange?.(fallbackViewMode);
      return;
    }

    if (activeSchemaCount === 1 && autoFocusDetail && internalViewMode !== 'detail' && visibleModes.includes('detail')) {
      setInternalViewMode('detail');
      onViewModeChange?.('detail');
      return;
    }

    if (activeSchemaCount !== 1 && internalViewMode === 'detail') {
      setInternalViewMode(fallbackViewMode);
      onViewModeChange?.(fallbackViewMode);
    }

    if (!showCommentsRail && internalViewMode === 'comments') {
      setInternalViewMode(fallbackViewMode);
      onViewModeChange?.(fallbackViewMode);
    }
  }, [requestedViewMode, activeSchemaCount, autoFocusDetail, fallbackViewMode, internalViewMode, onViewModeChange, showCommentsRail, visibleModes]);

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
    documentsRailMode === 'stacked' && 'max-h-[40vh] min-h-0 overflow-y-auto',
    documentsRailMode === 'split' && 'min-h-0',
  );

  const railDensity = documentsRailMode === 'stacked' ? 'compact' : 'default';
  const railItems = (docsBridge?.items || pagesBridge?.items) ?? [];

  const documentsRailNode = shouldRenderDocumentsRail ? (
    <DocumentsRailComponent
      items={pagesBridge?.items ?? []}
      selectedId={pagesBridge?.selectedId ?? null}
      onSelect={pagesBridge?.onSelect}
      onAdd={pagesBridge?.onAdd}
      onUploadPdf={pagesBridge?.onUploadPdf}
      onDelete={pagesBridge?.onDelete}
      title={pagesBridge?.title}
      emptyTitle={pagesBridge?.emptyTitle}
      style={props.styleOverrides?.documentsRail}
      useDefaultStyles={props.useDefaultStyles}
      density={railDensity}
    className={mergeClassNames(`${DESIGNER_CLASSNAME}documentsrailcomponent-auto`, documentsRailClassName)}
    />
  ) : null;

  const handleModeChange = (mode: 'fields' | 'detail' | 'docs' | 'comments') => {
    if (!visibleModes.includes(mode)) return;
    if (requestedViewMode === 'auto') {
      setInternalViewMode(mode);
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
        label: modeMeta.shortLabel,
        ariaLabel: modeMeta.ariaLabel,
        active: resolvedViewMode === mode,
        onClick: () => handleModeChange(mode),
      };
    });

  const collapsedRailNode = (
    <SidebarRail
      side="right"
      items={collapsedRailItems}
      density={sidebarDensityMode === 'mini' ? 'mini' : sidebarDensityMode === 'compact' ? 'compact' : 'comfortable'}
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

  /** Nodo principal renderizado según el modo efectivo. */
  const contentNode = resolvedPanelMode === 'comments' ? (
    <CommentsViewComponent
      items={props.comments?.items ?? []}
      onAdd={props.comments?.onAdd}
      title={props.comments?.title}
      emptyTitle={props.comments?.emptyTitle}
      activeCommentId={props.comments?.activeCommentId}
    />
  ) : resolvedPanelMode === 'docs' ? (
    (docsBridge || pagesBridge) ? (
      <DocumentsRailComponent
        items={railItems}
        selectedId={(docsBridge?.selectedId ?? pagesBridge?.selectedId) ?? null}
        onSelect={docsBridge?.onSelect ?? pagesBridge?.onSelect}
        onAdd={docsBridge?.onAdd ?? pagesBridge?.onAdd}
        onUploadPdf={docsBridge?.onUploadPdf ?? pagesBridge?.onUploadPdf}
        onDelete={docsBridge?.onDelete ?? pagesBridge?.onDelete}
        title={docsBridge?.title ?? pagesBridge?.title}
        emptyTitle={docsBridge?.emptyTitle ?? pagesBridge?.emptyTitle}
        style={props.styleOverrides?.documentsRail}
        useDefaultStyles={props.useDefaultStyles}
        density={railDensity}
        className={mergeClassNames(`${DESIGNER_CLASSNAME}documentsrailcomponent-auto`, documentsRailClassName)}
      />
    ) : listViewNode
  ) : resolvedPanelMode === 'detail' && activeSchemaCount > 0 ? (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}detail-view-host`,
        `${DESIGNER_CLASSNAME}custom-detailView`,
        'flex min-h-0 flex-1 flex-col overflow-hidden',
        toDesignerCustomClassName(props.classNames?.detailView),
      )}>
      <DetailViewComponent
        {...props}
        activeSchema={activeSchemas[activeSchemas.length - 1]}
        activeElements={activeElements}
        selectionCommands={props.selectionCommands}
      />
    </div>
  ) : listViewNode;

  return (
    <aside
      ref={sidebarRootRef}
      id={props.rootId}
      aria-label="Panel derecho del diseñador"
      aria-hidden="false"
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'right-sidebar',
        'flex h-full min-h-0 flex-col',
        detached ? DESIGNER_CLASSNAME + 'right-sidebar-detached' : '',
        props.classNames?.root,
        props.className,
      )}
      style={
        sidebarIsCollapsed
            ? {
              ...(props.styleOverrides?.root || {}),
              width: '2.25rem',
              maxWidth: '2.25rem',
              transform: 'translateX(0)',
              opacity: 1,
              pointerEvents: 'auto',
            }
          : props.styleOverrides?.root
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
            'flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-sm',
            props.classNames?.content,
          )}
          data-sidebar-open={sidebarOpen ? 'true' : 'false'}
          data-sidebar-collapsed={sidebarIsCollapsed ? 'true' : 'false'}
          data-docs-mode={documentsRailMode}
          data-panel-mode={resolvedPanelMode}>
          {showTabs || contextHeaderNode ? (
            <div className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-wrap flex shrink-0 items-center justify-between gap-1 border-b border-slate-200/70 px-1.5 py-1`}>
              {showTabs ? (
                <div
                  className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher flex flex-wrap items-center gap-0.5`}
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
                        className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn inline-flex min-h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-600 shadow-sm transition hover:border-sky-200 hover:text-sky-700`}
                        role="tab"
                        data-active={isActive ? 'true' : 'false'}
                        aria-selected={isActive ? 'true' : 'false'}
                        aria-controls={panelIdByMode[mode]}
                        id={tabIdByMode[mode]}
                        aria-label={modeMeta.ariaLabel}
                        onClick={() => handleModeChange(mode)}
                      >
                        <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-content inline-flex items-center gap-1.5`}>
                          <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-icon`}>{modeMeta.icon}</span>
                          {sidebarDensityMode === 'comfortable' ? (
                            <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-label`}>{modeMeta.shortLabel}</span>
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              <div className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-extra flex items-center gap-2`}>
                {contextHeaderNode}
                {showCollapseButton ? (
                  <div className="ml-1 flex items-center border-l border-slate-200/60 pl-2">
                    <SidebarCollapseHandle
                      side="right"
                      expanded={true}
                      onToggle={() => props.setSidebarOpen?.(false)}
                      presentation={actualPresentation}
                      density="mini"
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

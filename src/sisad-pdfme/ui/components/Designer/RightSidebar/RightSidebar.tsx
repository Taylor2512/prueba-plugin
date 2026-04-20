import React, { useEffect, useMemo, useState } from 'react';
import type {
  SidebarProps,
  DesignerComponentBridge,
  DesignerDocumentsBridge,
  DesignerSidebarPresentation,
} from '../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import ListView from './ListView/ListView.js';
import DetailView from './DetailView/DetailView.js';
import { SidebarFrame } from './layout.js';
import DocumentsRail, { DocumentsRailProps } from './DocumentsRail.js';
import { mergeClassNames } from '../shared/className.js';
import type { SelectionCommandSet } from '../shared/selectionCommands.js';
import { Layers, SlidersHorizontal, FileText } from 'lucide-react';

export type RightSidebarProps = SidebarProps & {
  width?: number;
  detached?: boolean;
  presentation?: DesignerSidebarPresentation;
  responsiveBreakpoint?: number;
  viewportWidth?: number;
  useLayoutFrame?: boolean;
  className?: string;
  rootId?: string;
  useDefaultStyles?: boolean;
  preserveCanvasSpace?: boolean;
  documentsRailMode?: 'split' | 'stacked' | 'auto';
  classNames?: {
    root?: string;
    content?: string;
    listView?: string;
    detailView?: string;
  };
  styleOverrides?: {
    root?: React.CSSProperties;
    content?: React.CSSProperties;
    documentsRail?: React.CSSProperties;
    listView?: React.CSSProperties;
    detailView?: React.CSSProperties;
  };
  bridge?: DesignerComponentBridge;
  documents?: DesignerDocumentsBridge;
  pages?: DesignerDocumentsBridge;
  showDocumentsRail?: boolean;
  viewMode?: 'auto' | 'fields' | 'detail' | 'docs';
  autoFocusDetail?: boolean;
  showDocumentsAsTab?: boolean;
  documentsAccessMode?: 'always' | 'tab';
  onViewModeChange?: (_mode: 'fields' | 'detail' | 'docs') => void;
  contextHeader?: React.ReactNode | ((_ctx: { mode: 'list' | 'detail' | 'bulk' | 'docs'; activeCount: number }) => React.ReactNode);
  selectionCommands?: SelectionCommandSet;
  components?: {
    listView?: typeof ListView;
    detailView?: typeof DetailView;
    documentsRail?: React.ComponentType<DocumentsRailProps>;
  };
};

const toDesignerCustomClassName = (value?: string) => {
  if (typeof value !== 'string') return '';
  const normalized = value.trim();
  if (!normalized) return '';
  return `${DESIGNER_CLASSNAME}custom-${normalized}`;
};

type SidebarModeMeta = {
  shortLabel: string;
  icon: React.ReactNode;
  title: string;
  ariaLabel: string;
};

const sidebarModeMeta: Record<'fields' | 'detail' | 'docs', SidebarModeMeta> = {
  fields: {
    shortLabel: 'Campos',
    icon: <Layers size={14} />,
    title: 'Campos del documento',
    ariaLabel: 'Abrir panel Campos',
  },
  detail: {
    shortLabel: 'Detalle',
    icon: <SlidersHorizontal size={14} />,
    title: 'Detalle del campo seleccionado',
    ariaLabel: 'Abrir panel Detalle',
  },
  docs: {
    shortLabel: 'Docs',
    icon: <FileText size={14} />,
    title: 'Documentos y páginas',
    ariaLabel: 'Abrir panel Docs',
  },
};

const sidebarModes = ['fields', 'detail', 'docs'] as const;

const Sidebar = (props: RightSidebarProps) => {
  const { sidebarOpen, activeElements, schemas } = props;
  const detached = Boolean(props.detached);
  const useLayoutFrame = Boolean(props.useLayoutFrame);
  const viewportWidth =
    props.viewportWidth && Number.isFinite(props.viewportWidth)
      ? props.viewportWidth
      : typeof window !== 'undefined'
        ? window.innerWidth
        : 1280;
  const responsiveBreakpoint = Math.max(640, props.responsiveBreakpoint ?? 1080);
  const DocumentsRailComponent = props.components?.documentsRail || DocumentsRail;
  const ListViewComponent = props.components?.listView || ListView;
  const DetailViewComponent = props.components?.detailView || DetailView;
  const activeSchemas = useMemo(
    () => schemas.filter((s) => activeElements.map((ae) => ae.id).includes(s.id)),
    [schemas, activeElements],
  );
  const activeSchemaIds = useMemo(() => activeElements.map((ae) => ae.id), [activeElements]);
  const getActiveSchemas = () => activeSchemas;
  const getLastActiveSchema = () => {
    const activeSchemas = getActiveSchemas();
    return activeSchemas[activeSchemas.length - 1];
  };
  const hasActiveSchema = activeSchemas.length > 0;
  const activeSchemaCount = activeSchemas.length;
  const [internalViewMode, setInternalViewMode] = useState<'fields' | 'detail' | 'docs'>('fields');
  const requestedViewMode = props.viewMode || 'auto';
  const showDocumentsRail = props.showDocumentsRail !== false && (Boolean(props.pages) || Boolean(props.documents));
  const actualPresentation = useMemo<DesignerSidebarPresentation>(() => {
    if (props.presentation === 'overlay') return 'overlay';
    if (props.presentation === 'docked') return 'docked';
    return viewportWidth <= responsiveBreakpoint ? 'overlay' : 'docked';
  }, [props.presentation, responsiveBreakpoint, viewportWidth]);
  const documentsRailMode = useMemo<'split' | 'stacked'>(() => {
    if ((props.documentsRailMode || 'auto') === 'split') return 'split';
    if (props.documentsRailMode === 'stacked') return 'stacked';
    return viewportWidth <= responsiveBreakpoint + 140 ? 'stacked' : 'split';
  }, [props.documentsRailMode, responsiveBreakpoint, viewportWidth]);
  const resolvedViewMode: 'fields' | 'detail' | 'docs' =
    requestedViewMode !== 'auto' ? requestedViewMode : internalViewMode;
  const pagesBridge = props.pages || props.documents;
  const docsBridge = props.documents;
  const panelIdByMode: Record<'fields' | 'detail' | 'docs', string> = {
    fields: 'sisad-pdfme-right-sidebar-panel-fields',
    detail: 'sisad-pdfme-right-sidebar-panel-detail',
    docs: 'sisad-pdfme-right-sidebar-panel-docs',
  };
  const tabIdByMode: Record<'fields' | 'detail' | 'docs', string> = {
    fields: 'sisad-pdfme-right-sidebar-tab-fields',
    detail: 'sisad-pdfme-right-sidebar-tab-detail',
    docs: 'sisad-pdfme-right-sidebar-tab-docs',
  };

  useEffect(() => {
    if (requestedViewMode !== 'auto') return;

    if (activeSchemaCount === 1 && props.autoFocusDetail && internalViewMode !== 'detail') {
      setInternalViewMode('detail');
      props.onViewModeChange?.('detail');
      return;
    }

    if (activeSchemaCount !== 1 && internalViewMode === 'detail') {
      setInternalViewMode('fields');
      props.onViewModeChange?.('fields');
    }
  }, [requestedViewMode, activeSchemaCount, props.autoFocusDetail, internalViewMode, props]);

  const resolvedPanelMode: 'list' | 'detail' | 'bulk' | 'docs' =
    resolvedViewMode === 'docs'
      ? 'docs'
      : activeSchemaCount > 1
        ? 'bulk'
        : activeSchemaCount === 1 && resolvedViewMode === 'detail'
          ? 'detail'
          : 'list';

  const shouldRenderDocumentsRail =
    resolvedViewMode === 'docs' && Boolean(docsBridge || pagesBridge);

  const documentsRailStyle: React.CSSProperties | undefined = showDocumentsRail
    ? {
      ...props.styleOverrides?.documentsRail,
      ...(documentsRailMode === 'stacked'
        ? { maxHeight: '40vh', minHeight: 0, overflowY: 'auto' }
        : { minHeight: 0 }),
    }
    : undefined;

  const handlePanelSwitcherKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (requestedViewMode !== 'auto') return;

    const currentIndex = sidebarModes.indexOf(resolvedViewMode);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % sidebarModes.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + sidebarModes.length) % sidebarModes.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = sidebarModes.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    const nextMode = sidebarModes[nextIndex];
    setInternalViewMode(nextMode);
    props.onViewModeChange?.(nextMode);
  };

  const contentNode = resolvedPanelMode === 'docs' ? (
    docsBridge || pagesBridge ? (
      <DocumentsRailComponent
        items={(docsBridge?.items || pagesBridge?.items) || []}
        selectedId={(docsBridge?.selectedId || pagesBridge?.selectedId) || null}
        onSelect={docsBridge?.onSelect || pagesBridge?.onSelect}
        onAdd={docsBridge?.onAdd || pagesBridge?.onAdd}
        onUploadPdf={docsBridge?.onUploadPdf || pagesBridge?.onUploadPdf}
        title={docsBridge?.title || pagesBridge?.title}
        emptyTitle={docsBridge?.emptyTitle || pagesBridge?.emptyTitle}
        style={documentsRailStyle}
        useDefaultStyles={props.useDefaultStyles}
        density={documentsRailMode === 'stacked' ? 'compact' : 'default'}
        className={DESIGNER_CLASSNAME + "documentsrailcomponent-auto"}
      />
    ) : (
      <ListViewComponent
        {...props}
        activeSchemaIds={activeSchemaIds}
        className={mergeClassNames(toDesignerCustomClassName(props.classNames?.listView))}
        useDefaultStyles={props.useDefaultStyles} />
    )
  ) : resolvedPanelMode === 'detail' && hasActiveSchema ? (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'detail-view-host',
        DESIGNER_CLASSNAME + 'custom-detailView',
        toDesignerCustomClassName(props.classNames?.detailView),
      )}>
      <DetailViewComponent
        {...props}
        activeSchema={getLastActiveSchema()}
        selectionCommands={props.selectionCommands}
      />
    </div>
  ) : (
    <ListViewComponent
      {...props}
      activeSchemaIds={activeSchemaIds}
      className={mergeClassNames(toDesignerCustomClassName(props.classNames?.listView))}
      useDefaultStyles={props.useDefaultStyles} />
  );

  return (
    <aside
      id={props.rootId}
      aria-label="Panel derecho del diseñador"
      aria-hidden={sidebarOpen ? 'false' : 'true'}
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'right-sidebar',
        detached ? DESIGNER_CLASSNAME + 'right-sidebar-detached' : '',
        props.classNames?.root,
        props.className,
      )}
      data-sidebar-detached={detached ? 'true' : 'false'}
      data-sidebar-presentation={actualPresentation}
      data-sidebar-open={sidebarOpen ? 'true' : 'false'}
      data-panel-mode={resolvedPanelMode}
      data-sidebar-mode={resolvedPanelMode}>
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'right-sidebar-content',
          DESIGNER_CLASSNAME + 'sidebar-surface',
          props.classNames?.content,
        )}
        data-sidebar-open={sidebarOpen ? 'true' : 'false'}
        data-docs-mode={documentsRailMode}
        data-panel-mode={resolvedPanelMode}>
        {props.showDocumentsAsTab !== false ? (
          <div className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher-wrap'}>
            <div
              className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher'}
              role="tablist"
              tabIndex={0}
              aria-label="Panel derecho"
              aria-orientation="horizontal"
              onKeyDown={handlePanelSwitcherKeyDown}
            >
              {(['fields', 'detail', 'docs'] as const).map((mode) => {
                if (mode === 'docs' && !showDocumentsRail) return null;
                const disabled = mode === 'detail' && activeSchemaCount !== 1;
                const isActive = resolvedViewMode === mode;
                const modeMeta = sidebarModeMeta[mode];
                return (
                  <button
                    key={`rs-mode-${mode}`}
                    type="button"
                    disabled={disabled}
                    className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher-btn'}
                    role="tab"
                    data-active={isActive ? 'true' : 'false'}
                    aria-selected={isActive ? 'true' : 'false'}
                    aria-controls={panelIdByMode[mode]}
                    id={tabIdByMode[mode]}
                    title={modeMeta.title}
                    aria-label={modeMeta.ariaLabel}
                    onClick={() => {
                      if (requestedViewMode === 'auto') setInternalViewMode(mode);
                      props.onViewModeChange?.(mode);
                    }}
                  >
                    <span className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher-btn-content'}>
                      <span className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher-btn-icon'}>{modeMeta.icon}</span>
                      <span className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher-btn-label'}>{modeMeta.shortLabel}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            {typeof props.contextHeader === 'function'
              ? props.contextHeader({ mode: resolvedPanelMode, activeCount: activeSchemaCount })
              : props.contextHeader || null}
          </div>
        ) : null}
        {useLayoutFrame ? (
          <SidebarFrame
            className={DESIGNER_CLASSNAME + 'right-sidebar-frame'}
            role="tabpanel"
            aria-labelledby={tabIdByMode[resolvedPanelMode]}
            id={panelIdByMode[resolvedPanelMode]}
          >
            <div className={DESIGNER_CLASSNAME + 'right-sidebar-layout-grid'}>
              {shouldRenderDocumentsRail && resolvedPanelMode !== 'docs' ? (
                <DocumentsRailComponent
                  items={pagesBridge?.items || []}
                  selectedId={pagesBridge?.selectedId || null}
                  onSelect={pagesBridge?.onSelect}
                  onAdd={pagesBridge?.onAdd}
                  onUploadPdf={pagesBridge?.onUploadPdf}
                  title={pagesBridge?.title}
                  emptyTitle={pagesBridge?.emptyTitle}
                  style={documentsRailStyle}
                  useDefaultStyles={props.useDefaultStyles}
                  density={documentsRailMode === 'stacked' ? 'compact' : 'default'}
                  className={DESIGNER_CLASSNAME + "documentsrailcomponent-auto"}
                />
              ) : null}
              {contentNode}
            </div>
          </SidebarFrame>
        ) : (
          <>
            {shouldRenderDocumentsRail && resolvedPanelMode !== 'docs' ? (
              <DocumentsRailComponent
                items={pagesBridge?.items || []}
                selectedId={pagesBridge?.selectedId || null}
                onSelect={pagesBridge?.onSelect}
                onAdd={pagesBridge?.onAdd}
                onUploadPdf={pagesBridge?.onUploadPdf}
                title={pagesBridge?.title}
                emptyTitle={pagesBridge?.emptyTitle}
                style={documentsRailStyle}
                useDefaultStyles={props.useDefaultStyles}
                density={documentsRailMode === 'stacked' ? 'compact' : 'default'}
                className={DESIGNER_CLASSNAME + "documentsrailcomponent-auto"}
              />
            ) : null}
            {contentNode}
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

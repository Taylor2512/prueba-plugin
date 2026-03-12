import React, { useEffect, useMemo, useState } from 'react';
import type {
  SidebarProps,
  DesignerComponentBridge,
  DesignerDocumentsBridge,
  DesignerSidebarPresentation,
} from '../../../types.js';
import { RIGHT_SIDEBAR_WIDTH, DESIGNER_CLASSNAME } from '../../../constants.js';
import ListView from './ListView/index.js';
import DetailView from './DetailView/index.js';
import { SidebarFrame } from './layout.js';
import DocumentsRail, { DocumentsRailProps } from './DocumentsRail.js';
import { mergeClassNames } from '../shared/className.js';

export type RightSidebarProps = SidebarProps & {
  width?: number;
  detached?: boolean;
  presentation?: DesignerSidebarPresentation;
  responsiveBreakpoint?: number;
  viewportWidth?: number;
  useLayoutFrame?: boolean;
  className?: string;
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
  showDocumentsRail?: boolean;
  viewMode?: 'auto' | 'fields' | 'detail' | 'docs';
  autoFocusDetail?: boolean;
  showDocumentsAsTab?: boolean;
  documentsAccessMode?: 'always' | 'tab';
  onViewModeChange?: (mode: 'fields' | 'detail' | 'docs') => void;
  contextHeader?: React.ReactNode | ((ctx: { mode: 'list' | 'detail' | 'bulk' | 'docs'; activeCount: number }) => React.ReactNode);
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

const Sidebar = (props: RightSidebarProps) => {
  const { sidebarOpen, setSidebarOpen, activeElements, schemas } = props;
  const width = props.width ?? RIGHT_SIDEBAR_WIDTH;
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
  const getActiveSchemas = () => activeSchemas;
  const getLastActiveSchema = () => {
    const activeSchemas = getActiveSchemas();
    return activeSchemas[activeSchemas.length - 1];
  };
  const hasActiveSchema = activeSchemas.length > 0;
  const activeSchemaCount = activeSchemas.length;
  const [internalViewMode, setInternalViewMode] = useState<'fields' | 'detail' | 'docs'>('fields');
  const requestedViewMode = props.viewMode || 'auto';
  const showDocumentsRail = props.showDocumentsRail !== false && Boolean(props.documents);
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

  useEffect(() => {
    if (requestedViewMode !== 'auto') return;
    if (activeSchemaCount === 1 && props.autoFocusDetail && internalViewMode === 'fields') {
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
    showDocumentsRail && (props.documentsAccessMode !== 'tab' || resolvedViewMode === 'docs');

  const contentColumns =
    resolvedPanelMode === 'docs'
      ? 'minmax(0, 1fr)'
      : shouldRenderDocumentsRail && documentsRailMode === 'split'
        ? 'minmax(0, 0.94fr) minmax(13rem, 1.08fr)'
        : 'minmax(0, 1fr)';
  const rightSidebarBaseWidth = Math.max(240, Math.min(width, viewportWidth - 12));
  const overlayStyle: React.CSSProperties =
    actualPresentation === 'overlay' && !detached
      ? {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 5,
        width: rightSidebarBaseWidth,
        maxWidth: 'min(100%, calc(100vw - 12px))',
        pointerEvents: sidebarOpen ? 'auto' : 'none',
        opacity: sidebarOpen ? 1 : 0,
        transform: `translateX(${sidebarOpen ? '0' : '16px'})`,
        transition: 'opacity 160ms ease, transform 180ms ease',
      }
      : {};

  const documentsRailStyle: React.CSSProperties | undefined = showDocumentsRail
    ? {
      ...props.styleOverrides?.documentsRail,
      ...(documentsRailMode === 'stacked'
        ? { maxHeight: '40vh', minHeight: 0, overflowY: 'auto' }
        : { minHeight: 0 }),
    }
    : undefined;

  const contentNode = resolvedPanelMode === 'docs' ? (
    shouldRenderDocumentsRail ? (
      <DocumentsRailComponent
        items={props.documents?.items || []}
        selectedId={props.documents?.selectedId || null}
        onSelect={props.documents?.onSelect}
        onAdd={props.documents?.onAdd}
        useDefaultStyles={props.useDefaultStyles}
        density={documentsRailMode === 'stacked' ? 'compact' : 'default'}
        className={DESIGNER_CLASSNAME + "documentsrailcomponent-auto"}
      />
    ) : (
      <ListViewComponent
        {...props}
        className={mergeClassNames(toDesignerCustomClassName(props.classNames?.listView))}
        useDefaultStyles={props.useDefaultStyles} />
    )
  ) : resolvedPanelMode === 'detail' && hasActiveSchema ? (
    <div
      className={mergeClassNames(toDesignerCustomClassName(props.classNames?.detailView))}>
      <DetailViewComponent {...props} activeSchema={getLastActiveSchema()} />
    </div>
  ) : (
    <ListViewComponent
      {...props}
      className={mergeClassNames(toDesignerCustomClassName(props.classNames?.listView))}
      useDefaultStyles={props.useDefaultStyles} />
  );

  return (
    <div
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
        className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-content', props.classNames?.content)}
        data-sidebar-open={sidebarOpen ? 'true' : 'false'}
        data-docs-mode={documentsRailMode}
        data-panel-mode={resolvedPanelMode}>
        {props.showDocumentsAsTab !== false ? (
          <div className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher-wrap'}>
            <div className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher'}>
              {(['fields', 'detail', 'docs'] as const).map((mode) => {
                if (mode === 'docs' && !showDocumentsRail) return null;
                const disabled = mode === 'detail' && activeSchemaCount !== 1;
                const isActive = resolvedViewMode === mode;
                return (
                  <button
                    key={`rs-mode-${mode}`}
                    type="button"
                    disabled={disabled}
                    className={DESIGNER_CLASSNAME + 'right-sidebar-panel-switcher-btn'}
                    data-active={isActive ? 'true' : 'false'}
                    onClick={() => {
                      if (requestedViewMode === 'auto') setInternalViewMode(mode);
                      props.onViewModeChange?.(mode);
                    }}
                  >
                    {mode === 'fields' ? 'Campos' : mode === 'detail' ? 'Detalle' : 'Docs'}
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
          <SidebarFrame className={DESIGNER_CLASSNAME + 'right-sidebar-frame'}>
            <div className={DESIGNER_CLASSNAME + 'right-sidebar-layout-grid'}>
              {shouldRenderDocumentsRail && resolvedPanelMode !== 'docs' ? (
                <DocumentsRailComponent
                  items={props.documents?.items || []}
                  selectedId={props.documents?.selectedId || null}
                  onSelect={props.documents?.onSelect}
                  onAdd={props.documents?.onAdd}
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
                items={props.documents?.items || []}
                selectedId={props.documents?.selectedId || null}
                onSelect={props.documents?.onSelect}
                onAdd={props.documents?.onAdd}
                useDefaultStyles={props.useDefaultStyles}
                density={documentsRailMode === 'stacked' ? 'compact' : 'default'}
                className={DESIGNER_CLASSNAME + "documentsrailcomponent-auto"}
              />
            ) : null}
            {contentNode}
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

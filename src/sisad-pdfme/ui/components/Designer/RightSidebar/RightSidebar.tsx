import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import type { SelectionCommandSet } from '../shared/selectionCommands.js';
import { useResponsiveDensity } from '../shared/useResponsiveDensity.js';
import { Layers, SlidersHorizontal, FileText, MessageSquareText } from 'lucide-react';
import {
  resolveRightSidebarContextHeader,
  type RightSidebarContextHeader,
} from './contextHeader.js';

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
  comments?: DesignerCommentsBridge;
  showDocumentsRail?: boolean;
  viewMode?: 'auto' | 'fields' | 'detail' | 'docs' | 'comments';
  autoFocusDetail?: boolean;
  showDocumentsAsTab?: boolean;
  documentsAccessMode?: 'always' | 'tab';
  onViewModeChange?: (_mode: 'fields' | 'detail' | 'docs' | 'comments') => void;
  contextHeader?: RightSidebarContextHeader;
  selectionCommands?: SelectionCommandSet;
  modeMetaOverrides?: Partial<Record<'fields' | 'detail' | 'docs' | 'comments', Partial<SidebarModeMeta>>>;
  components?: {
    listView?: typeof ListView;
    detailView?: typeof DetailView;
    documentsRail?: React.ComponentType<DocumentsRailProps>;
    commentsView?: React.ComponentType<CommentsRailProps>;
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

// Static — never changes, no reason to recreate inside render
const PANEL_ID_BY_MODE: Record<'fields' | 'detail' | 'docs' | 'comments', string> = {
  fields: 'sisad-pdfme-right-sidebar-panel-fields',
  detail: 'sisad-pdfme-right-sidebar-panel-detail',
  comments: 'sisad-pdfme-right-sidebar-panel-comments',
  docs: 'sisad-pdfme-right-sidebar-panel-docs',
};

const TAB_ID_BY_MODE: Record<'fields' | 'detail' | 'docs' | 'comments', string> = {
  fields: 'sisad-pdfme-right-sidebar-tab-fields',
  detail: 'sisad-pdfme-right-sidebar-tab-detail',
  comments: 'sisad-pdfme-right-sidebar-tab-comments',
  docs: 'sisad-pdfme-right-sidebar-tab-docs',
};

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

const sidebarModes = ['fields', 'detail', 'comments', 'docs'] as const;

const Sidebar = (props: RightSidebarProps) => {
  const { sidebarOpen, activeElements, schemas } = props;
  const { autoFocusDetail, onViewModeChange } = props;
  const detached = Boolean(props.detached);
  const sidebarRootRef = useRef<HTMLElement | null>(null);
  const { mode: sidebarDensityMode } = useResponsiveDensity(sidebarRootRef, {
    comfortable: 390,
    compact: 318,
    mini: 256,
  });
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
  const showDocumentsRail = props.showDocumentsRail !== false && (Boolean(props.pages) || Boolean(props.documents));
  const showCommentsRail = Boolean(props.comments);
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
  const resolvedViewMode: 'fields' | 'detail' | 'docs' | 'comments' =
    requestedViewMode !== 'auto' ? requestedViewMode : internalViewMode;
  const pagesBridge = props.pages || props.documents;
  const docsBridge = props.documents;
  const panelIdByMode = PANEL_ID_BY_MODE;
  const tabIdByMode = TAB_ID_BY_MODE;
  const effectiveSidebarModeMeta = useMemo(() => {
    const overrides = props.modeMetaOverrides || {};
    return {
      fields: { ...sidebarModeMeta.fields, ...(overrides.fields || {}) },
      detail: { ...sidebarModeMeta.detail, ...(overrides.detail || {}) },
      docs: { ...sidebarModeMeta.docs, ...(overrides.docs || {}) },
      comments: { ...sidebarModeMeta.comments, ...(overrides.comments || {}) },
    } as Record<'fields' | 'detail' | 'docs' | 'comments', SidebarModeMeta>;
  }, [props.modeMetaOverrides]);

  useEffect(() => {
    if (requestedViewMode !== 'auto') return;

    if (activeSchemaCount === 1 && autoFocusDetail && internalViewMode !== 'detail') {
      setInternalViewMode('detail');
      onViewModeChange?.('detail');
      return;
    }

    if (activeSchemaCount !== 1 && internalViewMode === 'detail') {
      setInternalViewMode('fields');
      onViewModeChange?.('fields');
    }

    if (!showCommentsRail && internalViewMode === 'comments') {
      setInternalViewMode('fields');
      onViewModeChange?.('fields');
    }
  }, [requestedViewMode, activeSchemaCount, autoFocusDetail, internalViewMode, onViewModeChange, showCommentsRail]);

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
  const contextHeaderNode = resolveRightSidebarContextHeader(props.contextHeader, {
    mode: resolvedPanelMode,
    activeCount: activeSchemaCount,
  });

  const documentsRailStyle: React.CSSProperties | undefined = showDocumentsRail
    ? {
      ...props.styleOverrides?.documentsRail,
      ...(documentsRailMode === 'stacked'
        ? { maxHeight: '40vh', minHeight: 0, overflowY: 'auto' }
        : { minHeight: 0 }),
    }
    : undefined;

  const railDensity = documentsRailMode === 'stacked' ? 'compact' : 'default';
  const railItems = (docsBridge?.items || pagesBridge?.items) ?? [];

  const documentsRailNode = shouldRenderDocumentsRail ? (
    <DocumentsRailComponent
      items={pagesBridge?.items ?? []}
      selectedId={pagesBridge?.selectedId ?? null}
      onSelect={pagesBridge?.onSelect}
      onAdd={pagesBridge?.onAdd}
      onUploadPdf={pagesBridge?.onUploadPdf}
      title={pagesBridge?.title}
      emptyTitle={pagesBridge?.emptyTitle}
      style={documentsRailStyle}
      useDefaultStyles={props.useDefaultStyles}
      density={railDensity}
      className={`${DESIGNER_CLASSNAME}documentsrailcomponent-auto`}
    />
  ) : null;

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
    onViewModeChange?.(nextMode);
  };

  const listViewNode = (
    <ListViewComponent
      {...props}
      activeSchemaIds={activeSchemaIds}
      className={mergeClassNames(toDesignerCustomClassName(props.classNames?.listView))}
      useDefaultStyles={props.useDefaultStyles}
    />
  );

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
        title={docsBridge?.title ?? pagesBridge?.title}
        emptyTitle={docsBridge?.emptyTitle ?? pagesBridge?.emptyTitle}
        style={documentsRailStyle}
        useDefaultStyles={props.useDefaultStyles}
        density={railDensity}
        className={`${DESIGNER_CLASSNAME}documentsrailcomponent-auto`}
      />
    ) : listViewNode
  ) : resolvedPanelMode === 'detail' && activeSchemaCount > 0 ? (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}detail-view-host`,
        `${DESIGNER_CLASSNAME}custom-detailView`,
        toDesignerCustomClassName(props.classNames?.detailView),
      )}>
      <DetailViewComponent
        {...props}
        activeSchema={activeSchemas[activeSchemas.length - 1]}
        selectionCommands={props.selectionCommands}
      />
    </div>
  ) : listViewNode;

  return (
    <aside
      ref={sidebarRootRef}
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
      data-right-sidebar-density={sidebarDensityMode}
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
        {props.showDocumentsAsTab !== false || contextHeaderNode ? (
          <div className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-wrap`}>
            {props.showDocumentsAsTab !== false ? (
              <div
                className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher`}
                role="tablist"
                tabIndex={0}
                aria-label="Panel derecho"
                aria-orientation="horizontal"
                onKeyDown={handlePanelSwitcherKeyDown}
              >
                {(['fields', 'detail', 'comments', 'docs'] as const).map((mode) => {
                  if (mode === 'docs' && !showDocumentsRail) return null;
                  if (mode === 'comments' && !showCommentsRail) return null;
                  const disabled = mode === 'detail' && activeSchemaCount !== 1;
                  const isActive = resolvedViewMode === mode;
                  const modeMeta = effectiveSidebarModeMeta[mode];
                  return (
                    <button
                      key={`rs-mode-${mode}`}
                      type="button"
                      disabled={disabled}
                      className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn`}
                      role="tab"
                      data-active={isActive ? 'true' : 'false'}
                      aria-selected={isActive ? 'true' : 'false'}
                      aria-controls={panelIdByMode[mode]}
                      id={tabIdByMode[mode]}
                      title={modeMeta.title}
                      aria-label={modeMeta.ariaLabel}
                      onClick={() => {
                        if (requestedViewMode === 'auto') setInternalViewMode(mode);
                        onViewModeChange?.(mode);
                      }}
                    >
                      <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-content`}>
                        <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-icon`}>{modeMeta.icon}</span>
                        <span className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-btn-label`}>{modeMeta.shortLabel}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
            <div className={`${DESIGNER_CLASSNAME}right-sidebar-panel-switcher-extra`}>
              {contextHeaderNode}
            </div>
          </div>
        ) : null}
        {useLayoutFrame ? (
          <SidebarFrame
            className={`${DESIGNER_CLASSNAME}right-sidebar-frame`}
            role="tabpanel"
            aria-labelledby={props.showDocumentsAsTab !== false ? tabIdByMode[resolvedPanelMode] : undefined}
            aria-label={props.showDocumentsAsTab !== false ? undefined : effectiveSidebarModeMeta[resolvedPanelMode].title}
            id={panelIdByMode[resolvedPanelMode]}
          >
            <div className={`${DESIGNER_CLASSNAME}right-sidebar-layout-grid`}>
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
    </aside>
  );
};

export default React.memo(Sidebar);

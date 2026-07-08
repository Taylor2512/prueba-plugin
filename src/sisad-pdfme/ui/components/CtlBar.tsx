import React, { useContext } from 'react';
import { Size } from '@sisad-pdfme/common';
// Import icons from lucide-react
// Note: In tests, these will be mocked by the mock file in __mocks__/lucide-react.js
import {
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Undo2,
  Redo2,
  Maximize2,
  Save,
} from 'lucide-react';

import type { MenuProps } from 'antd';
import { Button, Dropdown, Select } from 'antd';
import { I18nContext, OptionsContext } from '../contexts.js';
import { useMaxZoom } from '../helper.js';
import { UI_CLASSNAME } from '../constants.js';

type ToolbarDensity = 'comfortable' | 'compact' | 'minimal';

type ZoomProps = {
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  iconColor?: string;
  density?: ToolbarDensity;
};

const Zoom = ({ zoomLevel, setZoomLevel, iconColor, density = 'comfortable' }: ZoomProps) => {
  const zoomStep = 0.25;
  const maxZoom = useMaxZoom();
  const minZoom = 0.25;
  const presets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

  const nextZoomOut = zoomLevel - zoomStep;
  const nextZoomIn = zoomLevel + zoomStep;
  const showStepButtons = density === 'comfortable';

  return (
    <div className={UI_CLASSNAME + 'zoom'}>
      {showStepButtons ? (
        <Button
          className={UI_CLASSNAME + 'zoom-out'}
          type="text"
          title="Reducir zoom"
          disabled={minZoom >= nextZoomOut}
          onClick={() => setZoomLevel(nextZoomOut)}
          icon={<Minus size={14} color={iconColor} />}
        />
      ) : null}
      <Select
        size="small"
        value={Number(zoomLevel.toFixed(2))}
        options={presets
          .filter((preset) => preset >= minZoom && preset <= maxZoom)
          .map((preset) => ({
            value: Number(preset.toFixed(2)),
            label: `${Math.round(preset * 100)}%`,
          }))}
        onChange={(value) => setZoomLevel(Number(value))}
        styles={{ popup: { root: { minWidth: 80 } } }}
        className={UI_CLASSNAME + 'zoom-select'}
      />
      {showStepButtons ? (
        <Button
          className={UI_CLASSNAME + 'zoom-in'}
          type="text"
          title="Aumentar zoom"
          disabled={maxZoom < nextZoomIn}
          onClick={() => setZoomLevel(nextZoomIn)}
          icon={<Plus size={14} color={iconColor} />}
        />
      ) : null}
    </div>
  );
};

type CtlBarProps = {
  size: Size;
  pageCursor: number;
  pageNum: number;
  setPageCursor: (page: number | ((currentPage: number) => number)) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  setZoom?: (zoom: number) => void;
  addPageAfter?: () => void;
  duplicatePageAfter?: () => void;
  removePage?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onFitWidth?: () => void;
  onFitPage?: () => void;
  onOpenShortcuts?: () => void;
  documentTitle?: string;
  documentStatus?: string;
  onSave?: () => void;
  onExport?: () => void;
  featureToggles?: {
    grid?: boolean;
    guides?: boolean;
    snapLines?: boolean;
    padding?: boolean;
  };
  onToggleFeature?: (key: 'grid' | 'guides' | 'snapLines' | 'padding') => void;
  selectionCount?: number;
  isGroupedSelection?: boolean;
  /**
   * Optional explicit visibility override. If provided, takes precedence over OptionsContext flags.
   * When undefined, visibility is resolved from OptionsContext.hideControlBar or OptionsContext.uxMode === 'runtime'.
   */
  visible?: boolean;
};

const CtlBar = (props: CtlBarProps) => {
  const i18n = useContext(I18nContext);
  const options = useContext(OptionsContext) as Record<string, unknown> | undefined;

  const {
    size,
    pageCursor,
    pageNum,
    setPageCursor,
    zoomLevel,
    setZoomLevel,
    setZoom,
    addPageAfter,
    duplicatePageAfter,
    removePage,
    onUndo,
    onRedo,
    onFitWidth,
    onFitPage,
    onOpenShortcuts,
    documentTitle,
    documentStatus,
    onSave,
    onExport,
    featureToggles,
    onToggleFeature,
    selectionCount,
    isGroupedSelection,
    visible,
  } = props;

  // Resolve visibility: explicit prop visible takes precedence. When undefined,
  // consult OptionsContext: support options.hideControlBar (boolean) and
  // options.uxMode === 'runtime' to hide by default in runtime scenarios.
  const visibleFromOptions = (() => {
    if (!options) return true;
    if (options.hideControlBar === true) return false;
    if (String(options.uxMode || '').toLowerCase() === 'runtime') return false;
    return true;
  })();

  const shouldRender = typeof visible === 'boolean' ? Boolean(visible) : Boolean(visibleFromOptions);
  if (!shouldRender) return null;

  const zoomChangeHandler = setZoom ?? setZoomLevel;
  const toolbarDensity: ToolbarDensity =
    size.width >= 1200 ? 'comfortable' : size.width >= 900 ? 'compact' : 'minimal';
  const showPageNavButtons = pageNum > 1 && toolbarDensity === 'comfortable';
  const showZoomStepper = toolbarDensity === 'comfortable';
  const showSaveText = toolbarDensity === 'comfortable';
  const showFitAction = toolbarDensity === 'comfortable';
  const statusTone = (documentStatus || '').toLowerCase().includes('edit') ? 'editing' : 'idle';
  const pageLabel = `Pág ${pageCursor + 1}/${Math.max(1, pageNum)}`;
  const summaryLabel = `Doc · ${pageLabel}${selectionCount && selectionCount > 0 ? ` · Sel ${selectionCount}` : ''}${isGroupedSelection ? ' · Grupo' : ''}`;

  const pageMenuItems: MenuProps['items'] = Array.from({ length: Math.max(1, pageNum) }).map((_, index) => ({
    key: `page-${index + 1}`,
    label: `Página ${index + 1}`,
  }));

  const handlePageMenuClick: NonNullable<MenuProps['onClick']> = ({ key }) => {
    const pageFromKey = Number(String(key).replace('page-', ''));
    if (Number.isFinite(pageFromKey) && pageFromKey > 0) {
      setPageCursor(pageFromKey - 1);
    }
  };

  const moreMenuItems: MenuProps['items'] = [];
  if (!showFitAction && onFitWidth) {
    moreMenuItems.push({ key: 'fit-width', label: 'Ajustar ancho' });
  }
  if (!showFitAction && onFitPage) {
    moreMenuItems.push({ key: 'fit-page', label: 'Ajustar página' });
  }
  if (onOpenShortcuts) {
    moreMenuItems.push({ key: 'shortcuts', label: 'Atajos' });
  }
  if (!showZoomStepper) {
    moreMenuItems.push({ key: 'zoom-in', label: 'Aumentar zoom' });
    moreMenuItems.push({ key: 'zoom-out', label: 'Reducir zoom' });
  }
  if (!showPageNavButtons && pageNum > 1) {
    moreMenuItems.push({ key: 'prev-page', label: 'Página anterior' });
    moreMenuItems.push({ key: 'next-page', label: 'Página siguiente' });
  }
  if (onToggleFeature) {
    moreMenuItems.push({ key: 'toggle-grid', label: featureToggles?.grid ? 'Ocultar cuadrícula' : 'Mostrar cuadrícula' });
    moreMenuItems.push({ key: 'toggle-guides', label: featureToggles?.guides ? 'Ocultar guías' : 'Mostrar guías' });
    moreMenuItems.push({ key: 'toggle-snap-lines', label: featureToggles?.snapLines ? 'Ocultar snaps' : 'Mostrar snaps' });
    moreMenuItems.push({ key: 'toggle-padding', label: featureToggles?.padding ? 'Ocultar padding' : 'Mostrar padding' });
  }
  if (addPageAfter) {
    moreMenuItems.push({ key: 'add-page', label: i18n('addPageAfter') });
  }
  if (duplicatePageAfter) {
    moreMenuItems.push({ key: 'duplicate-page', label: 'Duplicar página' });
  }
  if (removePage && pageNum > 1 && pageCursor !== 0) {
    moreMenuItems.push({ key: 'remove-page', label: i18n('removePage') });
  }
  if (onExport) {
    moreMenuItems.push({ key: 'export-pdf', label: 'Exportar' });
  }

  const handleMoreMenuClick: NonNullable<MenuProps['onClick']> = ({ key }) => {
    if (key === 'fit-width') onFitWidth?.();
    if (key === 'fit-page') onFitPage?.();
    if (key === 'shortcuts') onOpenShortcuts?.();
    if (key === 'zoom-in') zoomChangeHandler(zoomLevel + 0.25);
    if (key === 'zoom-out') zoomChangeHandler(zoomLevel - 0.25);
    if (key === 'prev-page') setPageCursor((currentPage) => Math.max(0, currentPage - 1));
    if (key === 'next-page') setPageCursor((currentPage) => Math.min(pageNum - 1, currentPage + 1));
    if (key === 'toggle-grid') onToggleFeature?.('grid');
    if (key === 'toggle-guides') onToggleFeature?.('guides');
    if (key === 'toggle-snap-lines') onToggleFeature?.('snapLines');
    if (key === 'toggle-padding') onToggleFeature?.('padding');
    if (key === 'add-page') addPageAfter?.();
    if (key === 'duplicate-page') duplicatePageAfter?.();
    if (key === 'remove-page') removePage?.();
    if (key === 'export-pdf') onExport?.();
  };

  return (
    <div className={UI_CLASSNAME + 'control-bar'} data-density={toolbarDensity} data-layout="canvas-chrome">
      <div className={UI_CLASSNAME + 'control-bar-cluster ' + UI_CLASSNAME + 'control-bar-cluster--top-left'}>
        <div className={UI_CLASSNAME + 'control-bar-summary rounded-full border border-slate-200/70 bg-white/95 px-3 py-2 shadow-sm'}>
          <span
            className={UI_CLASSNAME + 'control-bar-status-dot'}
            data-status={statusTone}
            title={documentStatus || 'Estado'}
            aria-label={documentStatus || 'Estado'}
          />
          <span title={typeof documentTitle === 'string' ? documentTitle.trim() : undefined}>{summaryLabel}</span>
        </div>
      </div>

      <div className={UI_CLASSNAME + 'control-bar-cluster ' + UI_CLASSNAME + 'control-bar-cluster--top-center'}>
        <div className={UI_CLASSNAME + 'control-bar-pill rounded-full border border-slate-200/70 bg-white/95 px-2 py-1 shadow-sm'}>
          {showPageNavButtons ? (
            <Button
              className={UI_CLASSNAME + 'control-bar-icon-btn'}
              type="text"
              disabled={pageCursor <= 0}
              onClick={() => setPageCursor((currentPage) => Math.max(0, currentPage - 1))}
              icon={<ChevronLeft size={16} />}
              title="Página anterior"
            />
          ) : null}
          <Dropdown menu={{ items: pageMenuItems, onClick: handlePageMenuClick }} placement="bottom" trigger={['click']}>
            <Button className={UI_CLASSNAME + 'control-bar-text-btn'} type="text" title="Página">
              {pageLabel}
            </Button>
          </Dropdown>
          {showPageNavButtons ? (
            <Button
              className={UI_CLASSNAME + 'control-bar-icon-btn'}
              type="text"
              disabled={pageCursor + 1 >= pageNum}
              onClick={() => setPageCursor((currentPage) => Math.min(pageNum - 1, currentPage + 1))}
              icon={<ChevronRight size={16} />}
              title="Página siguiente"
            />
          ) : null}
        </div>
      </div>

      <div className={UI_CLASSNAME + 'control-bar-cluster ' + UI_CLASSNAME + 'control-bar-cluster--top-right'}>
        <div className={UI_CLASSNAME + 'control-bar-pill rounded-full border border-slate-200/70 bg-white/95 px-2 py-1 shadow-sm'}>
          <Button
            className={UI_CLASSNAME + 'control-bar-text-btn'}
            type="text"
            onClick={onSave}
            disabled={!onSave}
            icon={<Save size={14} />}
            title="Guardar"
          >
            {showSaveText ? 'Guardar' : null}
          </Button>
          <Dropdown menu={{ items: moreMenuItems, onClick: handleMoreMenuClick }} placement="bottomRight" trigger={['click']}>
            <Button className={UI_CLASSNAME + 'control-bar-icon-btn'} type="text" title="Más acciones" icon={<Ellipsis size={16} />} />
          </Dropdown>
        </div>
      </div>

      <div className={UI_CLASSNAME + 'control-bar-cluster ' + UI_CLASSNAME + 'control-bar-cluster--bottom-right'}>
        <div className={UI_CLASSNAME + 'control-bar-pill rounded-full border border-slate-200/70 bg-white/95 px-2 py-1 shadow-sm'}>
          <Button
            className={UI_CLASSNAME + 'control-bar-icon-btn'}
            type="text"
            onClick={onUndo}
            disabled={!onUndo}
            icon={<Undo2 size={16} />}
            title="Deshacer"
          />
          <Button
            className={UI_CLASSNAME + 'control-bar-icon-btn'}
            type="text"
            onClick={onRedo}
            disabled={!onRedo}
            icon={<Redo2 size={16} />}
            title="Rehacer"
          />
          {showFitAction ? (
            <Button
              className={UI_CLASSNAME + 'control-bar-icon-btn'}
              type="text"
              title="Ajustar página"
              onClick={onFitPage}
              disabled={!onFitPage}
              icon={<Maximize2 size={15} />}
            />
          ) : null}
          {showZoomStepper ? (
            <Zoom zoomLevel={zoomLevel} setZoomLevel={zoomChangeHandler} density={toolbarDensity} />
          ) : (
            <Select
              size="small"
              value={Number(zoomLevel.toFixed(2))}
              options={[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3].map((preset) => ({
                value: Number(preset.toFixed(2)),
                label: `${Math.round(preset * 100)}%`,
              }))}
              onChange={(value) => setZoomLevel(Number(value))}
              className={UI_CLASSNAME + 'zoom-select'}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CtlBar;

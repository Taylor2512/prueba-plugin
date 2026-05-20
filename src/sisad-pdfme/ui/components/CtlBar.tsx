import React, { useContext, useMemo } from 'react';
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
  Grid2x2,
  Ruler,
  Magnet,
  Save,
} from 'lucide-react';

import type { MenuProps } from 'antd';
import { Button, Dropdown, Select } from 'antd';
import { I18nContext } from '../contexts.js';
import { useMaxZoom } from '../helper.js';
import { UI_CLASSNAME } from '../constants.js';
import DesignerContextSummary from './Designer/shared/DesignerContextSummary.js';

type ZoomProps = {
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  iconColor?: string;
};

const Zoom = ({ zoomLevel, setZoomLevel, iconColor }: ZoomProps) => {
  const zoomStep = 0.25;
  const maxZoom = useMaxZoom();
  const minZoom = 0.25;
  const presets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

  const nextZoomOut = zoomLevel - zoomStep;
  const nextZoomIn = zoomLevel + zoomStep;

  return (
    <div className={UI_CLASSNAME + 'zoom'}>
      <Button
        className={UI_CLASSNAME + 'zoom-out'}
        type="text"
        title="Reducir zoom"
        disabled={minZoom >= nextZoomOut}
        onClick={() => setZoomLevel(nextZoomOut)}
        icon={<Minus size={14} color={iconColor} />}
      />
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
      <Button
        className={UI_CLASSNAME + 'zoom-in'}
        type="text"
        title="Aumentar zoom"
        disabled={maxZoom < nextZoomIn}
        onClick={() => setZoomLevel(nextZoomIn)}
        icon={<Plus size={14} color={iconColor} />}
      />
    </div>
  );
};

type ContextMenuProps = {
  items: MenuProps['items'];
  iconColor?: string;
};

const ContextMenu = ({ items, iconColor }: ContextMenuProps) => (
  <Dropdown menu={{ items }} placement="top" arrow trigger={['click']}>
    <Button className={UI_CLASSNAME + 'context-menu'} type="text" title="Más acciones">
      <Ellipsis size={16} color={iconColor} />
    </Button>
  </Dropdown>
);

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
    guides?: boolean;
    snapLines?: boolean;
    padding?: boolean;
  };
  onToggleFeature?: (key: 'guides' | 'snapLines' | 'padding') => void;
};

const CtlBar = (props: CtlBarProps) => {
  const i18n = useContext(I18nContext);

  const {
    size: _size,
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
  } = props;
  void _size;
  const zoomChangeHandler = setZoom ?? setZoomLevel;

  const moreMenuItems: MenuProps['items'] = useMemo(() => {
    const items: MenuProps['items'] = [];
    if (addPageAfter) {
      items.push({
        key: 'add-page',
        label: (
          <button type="button" className={UI_CLASSNAME + 'control-bar-menu-item'} onClick={addPageAfter}>
            {i18n('addPageAfter')}
          </button>
        ),
      });
    }
    if (duplicatePageAfter) {
      items.push({
        key: 'duplicate-page',
        label: (
          <button type="button" className={UI_CLASSNAME + 'control-bar-menu-item'} onClick={duplicatePageAfter}>
            Duplicar página
          </button>
        ),
      });
    }
    if (removePage && pageNum > 1 && pageCursor !== 0) {
      items.push({
        key: 'remove-page',
        label: (
          <button type="button" className={UI_CLASSNAME + 'control-bar-menu-item'} onClick={removePage}>
            {i18n('removePage')}
          </button>
        ),
      });
    }
    if (onExport) {
      items.push({
        key: 'export-pdf',
        label: (
          <button type="button" className={UI_CLASSNAME + 'control-bar-menu-item'} onClick={onExport}>
            Exportar
          </button>
        ),
      });
    }
    return items;
  }, [addPageAfter, duplicatePageAfter, i18n, onExport, pageCursor, pageNum, removePage]);

  const viewOptionsItems: MenuProps['items'] = useMemo(
    () => [
      onFitWidth
        ? {
            key: 'fit-width',
            label: (
              <button type="button" className={UI_CLASSNAME + 'control-bar-menu-item'} onClick={onFitWidth}>
                Ajustar ancho
              </button>
            ),
          }
        : null,
      onFitPage
        ? {
            key: 'fit-page',
            label: (
              <button type="button" className={UI_CLASSNAME + 'control-bar-menu-item'} onClick={onFitPage}>
                Ajustar página
              </button>
            ),
          }
        : null,
      onOpenShortcuts
        ? {
            key: 'shortcuts',
            label: (
              <button type="button" className={UI_CLASSNAME + 'control-bar-menu-item'} onClick={onOpenShortcuts}>
                Atajos
              </button>
            ),
          }
        : null,
      onToggleFeature
        ? {
            key: 'guides',
            label: (
              <button
                type="button"
                className={UI_CLASSNAME + 'control-bar-menu-item'}
                onClick={() => onToggleFeature('guides')}
              >
                {featureToggles?.guides ? 'Ocultar guías' : 'Mostrar guías'}
              </button>
            ),
          }
        : null,
      onToggleFeature
        ? {
            key: 'snap-lines',
            label: (
              <button
                type="button"
                className={UI_CLASSNAME + 'control-bar-menu-item'}
                onClick={() => onToggleFeature('snapLines')}
              >
                {featureToggles?.snapLines ? 'Ocultar snaps' : 'Mostrar snaps'}
              </button>
            ),
          }
        : null,
      onToggleFeature
        ? {
            key: 'padding',
            label: (
              <button
                type="button"
                className={UI_CLASSNAME + 'control-bar-menu-item'}
                onClick={() => onToggleFeature('padding')}
              >
                {featureToggles?.padding ? 'Ocultar padding' : 'Mostrar padding'}
              </button>
            ),
          }
        : null,
    ].filter(Boolean),
    [featureToggles?.guides, featureToggles?.padding, featureToggles?.snapLines, onFitPage, onFitWidth, onOpenShortcuts, onToggleFeature],
  );

  const pageOptions = useMemo(
    () => {
      const options: Array<{ value: number; label: string }> = [];
      for (let index = 0; index < Math.max(1, pageNum); index += 1) {
        options.push({
          value: index + 1,
          label: `Página ${index + 1}`,
        });
      }
      return options;
    },
    [pageNum],
  );

  return (
    <div className={UI_CLASSNAME + 'control-bar'}>
      <div className={UI_CLASSNAME + 'control-bar-context'}>
        <DesignerContextSummary
          documentName={documentTitle?.trim() || 'Documento activo'}
          pageIndex={pageCursor}
          pageCount={pageNum}
          status={documentStatus}
          density="compact"
          placement="toolbar"
        />
      </div>

      <div className={UI_CLASSNAME + 'control-bar-actions'}>
        <div className={UI_CLASSNAME + 'control-bar-group'}>
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
        </div>

        {pageNum > 1 ? (
          <div className={UI_CLASSNAME + 'control-bar-group'}>
            <Button
              className={UI_CLASSNAME + 'control-bar-icon-btn'}
              type="text"
              disabled={pageCursor <= 0}
              onClick={() => setPageCursor((currentPage) => Math.max(0, currentPage - 1))}
              icon={<ChevronLeft size={16} />}
              title="Página anterior"
            />
            <Select
              size="small"
              value={pageCursor + 1}
              options={pageOptions}
              onChange={(value) => setPageCursor(Math.max(0, Number(value) - 1))}
              className={UI_CLASSNAME + 'control-bar-page-select'}
            />
            <Button
              className={UI_CLASSNAME + 'control-bar-icon-btn'}
              type="text"
              disabled={pageCursor + 1 >= pageNum}
              onClick={() => setPageCursor((currentPage) => Math.min(pageNum - 1, currentPage + 1))}
              icon={<ChevronRight size={16} />}
              title="Página siguiente"
            />
          </div>
        ) : null}

        <div className={UI_CLASSNAME + 'control-bar-group'}>
          <Dropdown menu={{ items: viewOptionsItems }} placement="bottomRight" trigger={['click']}>
            <Button className={UI_CLASSNAME + 'control-bar-icon-btn'} type="text" title="Vista" icon={<Maximize2 size={15} />} />
          </Dropdown>
        </div>

        <Zoom zoomLevel={zoomLevel} setZoomLevel={zoomChangeHandler} />

        <div className={UI_CLASSNAME + 'control-bar-group'}>
          <Button
            className={UI_CLASSNAME + 'control-bar-icon-btn'}
            type="text"
            onClick={() => onToggleFeature?.('guides')}
            disabled={!onToggleFeature}
            icon={<Ruler size={16} />}
            aria-pressed={featureToggles?.guides ? 'true' : 'false'}
            data-active={featureToggles?.guides ? 'true' : 'false'}
            title={featureToggles?.guides ? 'Ocultar guías' : 'Mostrar guías'}
          />
          <Button
            className={UI_CLASSNAME + 'control-bar-icon-btn'}
            type="text"
            onClick={() => onToggleFeature?.('snapLines')}
            disabled={!onToggleFeature}
            icon={<Magnet size={16} />}
            aria-pressed={featureToggles?.snapLines ? 'true' : 'false'}
            data-active={featureToggles?.snapLines ? 'true' : 'false'}
            title={featureToggles?.snapLines ? 'Ocultar snaps' : 'Mostrar snaps'}
          />
          <Button
            className={UI_CLASSNAME + 'control-bar-icon-btn'}
            type="text"
            onClick={() => onToggleFeature?.('padding')}
            disabled={!onToggleFeature}
            icon={<Grid2x2 size={16} />}
            aria-pressed={featureToggles?.padding ? 'true' : 'false'}
            data-active={featureToggles?.padding ? 'true' : 'false'}
            title={featureToggles?.padding ? 'Ocultar padding' : 'Mostrar padding'}
          />
        </div>

        <div className={UI_CLASSNAME + 'control-bar-group'}>
          <Button
            className={UI_CLASSNAME + 'control-bar-text-btn'}
            type="text"
            onClick={onSave}
            disabled={!onSave}
            icon={<Save size={14} />}
          >
            Guardar
          </Button>
          {moreMenuItems.length > 0 ? <ContextMenu items={moreMenuItems} /> : null}
        </div>
      </div>
    </div>
  );
};

export default CtlBar;

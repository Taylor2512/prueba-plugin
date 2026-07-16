/**
 * Barra superior/flotante de control para Preview/Form/Viewer.
 *
 * Agrupa navegación de páginas, zoom, guardar/exportar, undo/redo, ajustes de
 * vista y menú de acciones secundarias. La visibilidad puede controlarse desde
 * props o desde OptionsContext para soportar experiencias runtime sin chrome.
 */
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
import { mergeClassNames } from './Designer/shared/className.js';
import {
  describeDisabledReason,
  resolveDesignerActionState,
} from './Designer/shared/designerActionState.js';

/**
 * Densidad visual de la barra de control.
 *
 * Controla cuántos botones se muestran directamente y cuáles se envían al menú
 * de más acciones en anchos reducidos.
 */
type ToolbarDensity = 'comfortable' | 'compact' | 'minimal';

/**
 * Contrato de zoom (TASK-UI-016): la UI siempre muestra porcentaje; el estado
 * interno usa decimal. `formatZoomPercent(0.9) === '90%'`;
 * `parseZoomPercent('125%') === 1.25`.
 */
export const formatZoomPercent = (zoom: number): string =>
  `${Math.round((Number(zoom) || 0) * 100)}%`;

export const parseZoomPercent = (value: string | number): number => {
  const numeric = Number(String(value).replace('%', '').trim());
  if (!Number.isFinite(numeric) || numeric <= 0) return 1;
  return numeric / 100;
};

/**
 * Opciones del select de zoom: presets dentro de límites + el valor actual si
 * no coincide con ningún preset, para que el trigger nunca muestre decimales.
 */
export const buildZoomSelectOptions = (
  zoomLevel: number,
  presets: number[],
  minZoom: number,
  maxZoom: number,
): Array<{ value: number; label: string }> => {
  const current = Number(zoomLevel.toFixed(2));
  const values = presets.filter((preset) => preset >= minZoom && preset <= maxZoom);
  if (!values.includes(current)) values.push(current);
  return values
    .sort((a, b) => a - b)
    .map((preset) => ({ value: Number(preset.toFixed(2)), label: formatZoomPercent(preset) }));
};

/**
 * Props del selector de zoom embebido en la barra de control.
 */
type ZoomProps = {
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  iconColor?: string;
  density?: ToolbarDensity;
};

/**
 * Control compacto de zoom.
 *
 * Expone presets de escala y, en modo comfortable, botones de incremento y
 * decremento respetando los límites de zoom calculados por useMaxZoom.
 */
const Zoom = ({ zoomLevel, setZoomLevel, iconColor, density = 'comfortable' }: ZoomProps) => {
  const zoomStep = 0.25;
  const maxZoom = useMaxZoom();
  const minZoom = 0.25;
  const presets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];
  const zoomButtonClassName =
    mergeClassNames(
      UI_CLASSNAME + 'zoom-button',
      'inline-flex h-5 w-5 min-w-5 items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-[var(--text-secondary)] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-20)] hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-08)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50',
    );
  const zoomSelectClassName = mergeClassNames(
    UI_CLASSNAME + 'zoom-select',
    'min-w-[3.625rem] text-[0.6875rem] [&_.ant-select-selector]:min-w-[3.625rem] [&_.ant-select-selector]:rounded-[0.375rem] [&_.ant-select-selector]:border-[var(--border-soft)] [&_.ant-select-selector]:bg-[var(--color-gray-100)]',
    density === 'minimal' && '[&_.ant-select-selector]:min-w-[3.5rem] [&_.ant-select-selector]:max-w-[3.5rem]',
  );

  const nextZoomOut = zoomLevel - zoomStep;
  const nextZoomIn = zoomLevel + zoomStep;
  const showStepButtons = density === 'comfortable';

  return (
    <div className={mergeClassNames(UI_CLASSNAME + 'zoom', 'inline-flex items-center gap-[0.1rem] rounded-[0.45rem] border border-[var(--border-soft)] bg-[var(--color-gray-100)] p-[0.1rem_0.2rem]')}>
      {showStepButtons ? (
        <Button
          className={zoomButtonClassName + ' ' + UI_CLASSNAME + 'zoom-out'}
          type="text"
          title="Reducir zoom"
          aria-label="Reducir zoom"
          data-testid="designer-zoom-out"
          disabled={minZoom >= nextZoomOut}
          onClick={() => setZoomLevel(nextZoomOut)}
          icon={<Minus size={14} color={iconColor} />}
        />
      ) : null}
        <Select
          size="small"
          value={Number(zoomLevel.toFixed(2))}
          options={buildZoomSelectOptions(zoomLevel, presets, minZoom, maxZoom)}
          onChange={(value) => setZoomLevel(Number(value))}
          styles={{ popup: { root: { minWidth: 80 } } }}
          className={zoomSelectClassName}
          data-testid="designer-zoom-select"
          aria-label="Nivel de zoom"
        />
      {showStepButtons ? (
        <Button
          className={zoomButtonClassName + ' ' + UI_CLASSNAME + 'zoom-in'}
          type="text"
          title="Aumentar zoom"
          aria-label="Aumentar zoom"
          data-testid="designer-zoom-in"
          disabled={maxZoom < nextZoomIn}
          onClick={() => setZoomLevel(nextZoomIn)}
          icon={<Plus size={14} color={iconColor} />}
        />
      ) : null}
    </div>
  );
};

/**
 * Props de la barra de control runtime.
 *
 * Reúne navegación de página, zoom, acciones de documento, feature toggles y
 * datos de estado para construir una barra adaptable por ancho.
 */
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
  interactionPhase?: string;
  /**
   * Optional explicit visibility override. If provided, takes precedence over OptionsContext flags.
   * When undefined, visibility is resolved from OptionsContext.hideControlBar or OptionsContext.uxMode === 'runtime'.
   */
  visible?: boolean;
};

/**
 * Barra de control principal para Preview/Form/Viewer.
 *
 * Decide visibilidad desde props u OptionsContext y adapta su layout según el
 * ancho disponible. No modifica templates directamente; delega todo a callbacks.
 */
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
    interactionPhase,
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
  // Contrato de acciones (TASK-ACTIONS-002): sin handler no se renderiza;
  // deshabilitado siempre con razón para el tooltip.
  const saveAction = resolveDesignerActionState('save', { hasHandler: typeof onSave === 'function' });
  const undoAction = resolveDesignerActionState('undo', { hasHandler: typeof onUndo === 'function' });
  const redoAction = resolveDesignerActionState('redo', { hasHandler: typeof onRedo === 'function' });
  const fitPageAction = resolveDesignerActionState('fit-to-page', { hasHandler: typeof onFitPage === 'function' });
  
  const densityOption = String((options as any)?.density || '').toLowerCase();
  // Densidad explícita del preset gana SIEMPRE (incluida 'comfortable').
  // El fallback por ancho usa el área real del canvas (ya descontados los
  // sidebars reservados del preset three-panel), por eso los umbrales son
  // menores que el viewport clásico: 1000/720 en lugar de 1200/900.
  const toolbarDensity: ToolbarDensity =
    densityOption === 'comfortable' || densityOption === 'compact' || densityOption === 'minimal'
      ? (densityOption as ToolbarDensity)
      : size.width >= 1000
        ? 'comfortable'
        : size.width >= 720
          ? 'compact'
          : 'minimal';

  const showPageNavButtons = pageNum > 1 && toolbarDensity === 'comfortable';
  const showZoomStepper = toolbarDensity === 'comfortable';
  const showSaveText = toolbarDensity === 'comfortable';
  const showFitAction = toolbarDensity === 'comfortable';
  const statusTone = (documentStatus || '').toLowerCase().includes('edit') ? 'editing' : 'idle';
  const pageLabel = `Pág ${pageCursor + 1}/${Math.max(1, pageNum)}`;
  const summaryLabel = `Doc · ${pageLabel}${selectionCount && selectionCount > 0 ? ` · Sel ${selectionCount}` : ''}${isGroupedSelection ? ' · Grupo' : ''}`;
  const isActiveInteractionPhase =
    interactionPhase === 'selected-single' || interactionPhase === 'selected-multi';

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
    <div className={mergeClassNames(
      UI_CLASSNAME + 'control-bar',
      'absolute inset-0 z-[var(--sisad-pdfme-chrome-z,_45)] pointer-events-none bg-transparent max-[48rem]:p-[0.25rem_0.5rem]',
      isActiveInteractionPhase && '[box-shadow:0_0_0_1px_var(--color-primary-20),0_2px_0.5rem_var(--color-primary-12)]',
    )} data-density={toolbarDensity} data-layout="canvas-chrome">
      <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-cluster', 'absolute left-[0.5rem] top-[0.5rem] inline-flex items-center gap-[0.1875rem] pointer-events-auto')}>
        <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-summary', 'inline-flex items-center gap-[0.125rem] min-h-[1.75rem] rounded-[0.625rem] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,_var(--color-white-98),_var(--color-gray-50-90))] px-[0.3rem] py-[0.1rem] text-[0.625rem] font-semibold tracking-[0.005em] whitespace-nowrap [box-shadow:var(--shadow-gray-10)] [backdrop-filter:blur(0.625rem)] text-[var(--text-secondary)]')}>
          <span
            className={mergeClassNames(UI_CLASSNAME + 'control-bar-status-dot', 'h-[0.42rem] w-[0.42rem] rounded-full bg-[var(--color-success)] [box-shadow:0_0_0_2px_var(--color-white-92)]')}
            data-status={statusTone}
            title={documentStatus || 'Estado'}
            aria-label={documentStatus || 'Estado'}
          />
          <span title={typeof documentTitle === 'string' ? documentTitle.trim() : undefined}>{summaryLabel}</span>
        </div>
      </div>

      <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-cluster', 'absolute left-1/2 top-[0.5rem] inline-flex -translate-x-1/2 items-center gap-[0.1875rem] pointer-events-auto')}>
        <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-pill', 'inline-flex items-center gap-[0.125rem] min-h-[1.75rem] rounded-[0.625rem] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,_var(--color-white-98),_var(--color-gray-50-90))] px-[0.3rem] py-[0.1rem] [box-shadow:var(--shadow-gray-10)] [backdrop-filter:blur(0.625rem)]')}>
          {showPageNavButtons ? (
            <Button
              className={mergeClassNames(UI_CLASSNAME + 'control-bar-icon-btn', 'inline-flex h-[1.5rem] min-h-[1.5rem] min-w-[1.5rem] w-[1.5rem] items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-[var(--text-secondary)] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-20)] hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-08)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50')}
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
              className={mergeClassNames(UI_CLASSNAME + 'control-bar-icon-btn', 'inline-flex h-[1.5rem] min-h-[1.5rem] min-w-[1.5rem] w-[1.5rem] items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-[var(--text-secondary)] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-20)] hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-08)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50')}
              type="text"
              disabled={pageCursor + 1 >= pageNum}
              onClick={() => setPageCursor((currentPage) => Math.min(pageNum - 1, currentPage + 1))}
              icon={<ChevronRight size={16} />}
              title="Página siguiente"
            />
          ) : null}
        </div>
      </div>

      <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-cluster', 'absolute right-[0.5rem] top-[0.5rem] inline-flex items-center gap-[0.1875rem] pointer-events-auto')}>
        <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-pill', 'inline-flex items-center gap-[0.125rem] min-h-[1.75rem] rounded-[0.625rem] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,_var(--color-white-98),_var(--color-gray-50-90))] px-[0.3rem] py-[0.1rem] [box-shadow:var(--shadow-gray-10)] [backdrop-filter:blur(0.625rem)]')}>
          {saveAction.visible ? (
            <Button
              className={mergeClassNames(UI_CLASSNAME + 'control-bar-text-btn', 'inline-flex h-[1.5rem] items-center rounded-md border border-transparent bg-transparent px-[0.325rem] text-[0.6875rem] text-[var(--text-secondary)] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-20)] hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-08)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50')}
              type="text"
              onClick={onSave}
              disabled={!saveAction.enabled}
              icon={<Save size={14} />}
              title={saveAction.enabled ? 'Guardar' : describeDisabledReason(saveAction.reason)}
              aria-label="Guardar"
              data-testid="designer-save"
            >
              {showSaveText ? 'Guardar' : null}
            </Button>
          ) : null}
          {moreMenuItems.length > 0 ? (
            <Dropdown menu={{ items: moreMenuItems, onClick: handleMoreMenuClick }} placement="bottomRight" trigger={['click']}>
              <Button
                className={mergeClassNames(UI_CLASSNAME + 'control-bar-icon-btn', 'inline-flex h-[1.5rem] min-h-[1.5rem] min-w-[1.5rem] w-[1.5rem] items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-[var(--text-secondary)] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-20)] hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-08)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50')}
                type="text"
                title="Más acciones"
                aria-label="Más acciones"
                data-testid="designer-more-actions"
                icon={<Ellipsis size={16} />}
              />
            </Dropdown>
          ) : null}
        </div>
      </div>

      <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-cluster', 'absolute bottom-[0.75rem] left-1/2 inline-flex -translate-x-1/2 items-center gap-[0.1875rem] pointer-events-auto')}>
        <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-pill', 'inline-flex items-center gap-[0.125rem] min-h-[1.75rem] rounded-[0.625rem] border border-[var(--border-subtle)] bg-[linear-gradient(180deg,_var(--color-white-98),_var(--color-gray-50-90))] px-[0.3rem] py-[0.1rem] [box-shadow:var(--shadow-gray-10)] [backdrop-filter:blur(0.625rem)]')}>
          {undoAction.visible ? (
            <Button
              className={mergeClassNames(UI_CLASSNAME + 'control-bar-icon-btn', 'inline-flex h-[1.5rem] min-h-[1.5rem] min-w-[1.5rem] w-[1.5rem] items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-[var(--text-secondary)] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-20)] hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-08)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50')}
              type="text"
              onClick={onUndo}
              disabled={!undoAction.enabled}
              icon={<Undo2 size={16} />}
              title="Deshacer"
              aria-label="Deshacer"
              data-testid="designer-undo"
            />
          ) : null}
          {redoAction.visible ? (
            <Button
              className={mergeClassNames(UI_CLASSNAME + 'control-bar-icon-btn', 'inline-flex h-[1.5rem] min-h-[1.5rem] min-w-[1.5rem] w-[1.5rem] items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-[var(--text-secondary)] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-20)] hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-08)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50')}
              type="text"
              onClick={onRedo}
              disabled={!redoAction.enabled}
              icon={<Redo2 size={16} />}
              title="Rehacer"
              aria-label="Rehacer"
              data-testid="designer-redo"
            />
          ) : null}
          {showFitAction && fitPageAction.visible ? (
            <Button
              className={mergeClassNames(UI_CLASSNAME + 'control-bar-icon-btn', 'inline-flex h-[1.5rem] min-h-[1.5rem] min-w-[1.5rem] w-[1.5rem] items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-[var(--text-secondary)] transition-[background-color,color,border-color,transform] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-20)] hover:border-[var(--color-primary-30)] hover:bg-[var(--color-primary-08)] hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50')}
              type="text"
              title="Ajustar página"
              aria-label="Ajustar página"
              data-testid="designer-fit-page"
              onClick={onFitPage}
              disabled={!fitPageAction.enabled}
              icon={<Maximize2 size={15} />}
            />
          ) : null}
          {showZoomStepper ? (
            <Zoom zoomLevel={zoomLevel} setZoomLevel={zoomChangeHandler} density={toolbarDensity} />
          ) : (
            <Select
              size="small"
              value={Number(zoomLevel.toFixed(2))}
              options={buildZoomSelectOptions(zoomLevel, [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3], 0.25, 3)}
              onChange={(value) => setZoomLevel(Number(value))}
              className={mergeClassNames(
                UI_CLASSNAME + 'zoom-select',
                'min-w-[3.625rem] text-[0.6875rem] [&_.ant-select-selector]:min-w-[3.625rem] [&_.ant-select-selector]:rounded-[0.375rem] [&_.ant-select-selector]:border-[var(--border-soft)] [&_.ant-select-selector]:bg-[var(--color-gray-100)]',
                toolbarDensity === 'minimal' && '[&_.ant-select-selector]:min-w-[3.5rem] [&_.ant-select-selector]:max-w-[3.5rem]',
              )}
              data-testid="designer-zoom-select"
              aria-label="Nivel de zoom"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CtlBar;

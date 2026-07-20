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
  Check,
  LoaderCircle,
  CircleAlert,
} from 'lucide-react';

import type { MenuProps } from 'antd';
import { Button, Dropdown, Select } from 'antd';
import { I18nContext, OptionsContext } from '../contexts.js';
import { useMaxZoom } from '../helper.js';
import { UI_CLASSNAME } from '../constants.js';
import { mergeClassNames } from './Designer/shared/className.js';
import {
  resolveDesignerActionState,
  describeDisabledReason,
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
 * Estado de persistencia global del diseñador.
 *
 * `idle` es el estado inicial neutro (aún no hubo edición ni guardado) y no
 * pinta indicador; el resto mapea a las etiquetas visibles del contrato de
 * Guardar global. La fuente de verdad del template sigue siendo el host: este
 * estado solo describe la relación entre lo mostrado y lo último persistido.
 */
export type SaveStatus = 'idle' | 'saved' | 'dirty' | 'saving' | 'error';

/**
 * Presentación derivada del estado de guardado.
 *
 * `label` vacío indica que no debe renderizarse indicador (estado `idle`).
 */
export type SaveStatusPresentation = {
  label: string;
  tone: 'neutral' | 'positive' | 'pending' | 'warning' | 'danger';
  live: 'polite' | 'assertive' | 'off';
};

/**
 * Traduce un `SaveStatus` a etiqueta accesible, tono visual y cortesía de la
 * live-region. Función pura (sin React) para poder testearla en unitarios.
 */
export const resolveSaveStatusPresentation = (
  status: SaveStatus | undefined,
): SaveStatusPresentation => {
  switch (status) {
    case 'saving':
      return { label: 'Guardando…', tone: 'pending', live: 'polite' };
    case 'saved':
      return { label: 'Guardado', tone: 'positive', live: 'polite' };
    case 'error':
      return { label: 'Error al guardar', tone: 'danger', live: 'assertive' };
    case 'dirty':
      return { label: 'Cambios sin guardar', tone: 'warning', live: 'polite' };
    default:
      return { label: '', tone: 'neutral', live: 'off' };
  }
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
  /** Estado de persistencia global mostrado junto a Guardar. */
  saveStatus?: SaveStatus;
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
  /** When true, the canvas reserves space for the right sidebar chrome. */
  sidebarOpen?: boolean;
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
    onSave,
    saveStatus,
    onExport,
    featureToggles,
    onToggleFeature,
    interactionPhase,
    selectionCount,
    isGroupedSelection,
    visible,
    sidebarOpen,
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

  // Estado de guardado global: derivado del contrato de persistencia del host.
  // El indicador es informativo; Guardar sigue disponible salvo mientras se
  // está guardando (evita dobles envíos).
  const savePresentation = resolveSaveStatusPresentation(saveStatus);
  const isSaving = saveStatus === 'saving';
  const saveStatusToneClassName =
    savePresentation.tone === 'positive'
      ? 'text-[#166534]'
      : savePresentation.tone === 'pending'
        ? 'text-amber-600'
        : savePresentation.tone === 'warning'
          ? 'text-[#92400E]'
          : savePresentation.tone === 'danger'
            ? 'text-red-600'
            : 'text-[var(--text-secondary)]';
  const saveStatusIcon =
    saveStatus === 'saving' ? (
      <LoaderCircle size={12} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
    ) : saveStatus === 'saved' ? (
      <Check size={12} aria-hidden="true" />
    ) : saveStatus === 'error' ? (
      <CircleAlert size={12} aria-hidden="true" />
    ) : saveStatus === 'dirty' ? (
      <span className="inline-block h-[6px] w-[6px] flex-none rounded-full bg-[#D97706]" aria-hidden="true" />
    ) : null;

  const densityOption = String(
    options && typeof options === 'object' ? ((options as { density?: unknown }).density ?? '') : '',
  ).toLowerCase();
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
  const showSaveButtonText = toolbarDensity === 'comfortable';
  const showSaveStatusText = toolbarDensity === 'comfortable' && !sidebarOpen;
  const showFitAction = toolbarDensity === 'comfortable';
  const pageLabel = `Pág ${pageCursor + 1}/${Math.max(1, pageNum)}`;
  // Resumen de selección integrado en el navegador central (única fuente de la
  // página actual): "1 seleccionado" / "N seleccionados" / "Grupo · N".
  const selectionSummary = (() => {
    const count = typeof selectionCount === 'number' ? selectionCount : 0;
    if (count <= 0) return '';
    if (isGroupedSelection) return `Grupo · ${count}`;
    return count === 1 ? '1 seleccionado' : `${count} seleccionados`;
  })();
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

  // Menú global agrupado: las acciones se organizan por dominio y los toggles
  // muestran su estado mediante un check sin mezclarlo con un verbo contrario.
  const renderToggleLabel = (text: string, checked: boolean) => (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex w-[0.85rem] justify-center text-emerald-600" aria-hidden="true">
        {checked ? <Check size={13} /> : null}
      </span>
      <span>{text}</span>
    </span>
  );

  const viewMenuChildren: NonNullable<MenuProps['items']> = [];
  if (onToggleFeature) {
    viewMenuChildren.push({ key: 'toggle-grid', label: renderToggleLabel('Cuadrícula', Boolean(featureToggles?.grid)) });
    viewMenuChildren.push({ key: 'toggle-guides', label: renderToggleLabel('Guías', Boolean(featureToggles?.guides)) });
    viewMenuChildren.push({ key: 'toggle-snap-lines', label: renderToggleLabel('Ajuste magnético', Boolean(featureToggles?.snapLines)) });
    viewMenuChildren.push({ key: 'toggle-padding', label: renderToggleLabel('Padding', Boolean(featureToggles?.padding)) });
  }
  if (!showFitAction && onFitWidth) viewMenuChildren.push({ key: 'fit-width', label: 'Ajustar ancho' });
  if (!showFitAction && onFitPage) viewMenuChildren.push({ key: 'fit-page', label: 'Ajustar página' });
  if (!showZoomStepper) {
    viewMenuChildren.push({ key: 'zoom-in', label: 'Aumentar zoom' });
    viewMenuChildren.push({ key: 'zoom-out', label: 'Reducir zoom' });
  }

  const pageMenuChildren: NonNullable<MenuProps['items']> = [];
  if (!showPageNavButtons && pageNum > 1) {
    pageMenuChildren.push({ key: 'prev-page', label: 'Página anterior' });
    pageMenuChildren.push({ key: 'next-page', label: 'Página siguiente' });
  }
  if (addPageAfter) pageMenuChildren.push({ key: 'add-page', label: i18n('addPageAfter') });
  if (duplicatePageAfter) pageMenuChildren.push({ key: 'duplicate-page', label: 'Duplicar página' });
  if (removePage && pageNum > 1 && pageCursor !== 0) pageMenuChildren.push({ key: 'remove-page', label: i18n('removePage') });

  const documentMenuChildren: NonNullable<MenuProps['items']> = [];
  if (onExport) documentMenuChildren.push({ key: 'export-pdf', label: 'Exportar' });

  const moreMenuItems: MenuProps['items'] = [];
  if (viewMenuChildren.length > 0) {
    moreMenuItems.push({ key: 'group-view', type: 'group', label: 'Vista', children: viewMenuChildren });
  }
  if (pageMenuChildren.length > 0) {
    if (moreMenuItems.length > 0) moreMenuItems.push({ type: 'divider' });
    moreMenuItems.push({ key: 'group-page', type: 'group', label: 'Página', children: pageMenuChildren });
  }
  if (documentMenuChildren.length > 0) {
    if (moreMenuItems.length > 0) moreMenuItems.push({ type: 'divider' });
    moreMenuItems.push({ key: 'group-document', type: 'group', label: 'Documento', children: documentMenuChildren });
  }
  if (onOpenShortcuts) {
    if (moreMenuItems.length > 0) moreMenuItems.push({ type: 'divider' });
    moreMenuItems.push({
      key: 'group-help',
      type: 'group',
      label: 'Ayuda',
      children: [{ key: 'shortcuts', label: 'Atajos' }],
    });
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
    <div
      className={mergeClassNames(
        UI_CLASSNAME + 'control-bar',
        'absolute inset-y-0 left-0 z-[var(--sisad-pdfme-chrome-z,_45)] pointer-events-none bg-transparent max-[48rem]:p-[0.25rem_0.5rem]',
        sidebarOpen
          ? 'right-[calc(var(--sisad-pdfme-rs-width)_+_0.875rem)]'
          : 'right-[calc(var(--sisad-pdfme-ls-rail-width)_+_0.5rem)]',
        isActiveInteractionPhase &&
          '[box-shadow:0_0_0_1px_var(--color-primary-20),0_2px_0.5rem_var(--color-primary-12)]',
      )} data-density={toolbarDensity} data-layout="canvas-chrome">
      

      <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-cluster', UI_CLASSNAME + 'control-bar-cluster--top-center', 'absolute left-1/2 top-[0.5rem] inline-flex -translate-x-1/2 items-center gap-[0.1875rem] pointer-events-auto')}>
        <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-pill', 'inline-flex h-10 items-center gap-1 rounded-[10px] border border-slate-200 bg-white p-1 shadow-[0_4px_14px_rgba(15,23,42,0.08)]')}>
          {showPageNavButtons ? (
            <Button
              className={mergeClassNames(UI_CLASSNAME + 'control-bar-icon-btn', 'inline-flex h-8 min-h-8 w-8 min-w-8 items-center justify-center rounded-lg border border-transparent bg-transparent p-0 text-slate-700 transition-[background-color,color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50')}
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
          {selectionSummary ? (
            <span
              className={mergeClassNames(
                UI_CLASSNAME + 'control-bar-selection-summary',
                'inline-flex items-center gap-1 whitespace-nowrap px-1 text-[11px] font-medium text-[var(--text-secondary)]',
              )}
              data-selection-count={selectionCount}
            >
              <span aria-hidden="true">·</span>
              <span>{selectionSummary}</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-cluster', UI_CLASSNAME + 'control-bar-cluster--top-right', 'absolute right-[0.5rem] top-[0.5rem] inline-flex items-center gap-1 pointer-events-auto')}>
        <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-pill', 'inline-flex h-9 items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm')}>
          {saveAction.visible ? (
            <Button
              className={mergeClassNames(UI_CLASSNAME + 'control-bar-text-btn', 'inline-flex h-[30px] items-center rounded-md border border-transparent bg-transparent px-2 text-[12px] font-semibold text-slate-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50')}
              type="text"
              onClick={onSave}
              disabled={!saveAction.enabled || isSaving}
              icon={<Save size={14} />}
              title={saveAction.enabled ? 'Guardar' : describeDisabledReason(saveAction.reason)}
              aria-label="Guardar"
              data-testid="designer-save"
            >
              {showSaveButtonText ? 'Guardar' : null}
            </Button>
          ) : null}
          {savePresentation.label ? (
            <span
              className={mergeClassNames(
                UI_CLASSNAME + 'control-bar-save-status',
                'inline-flex h-[30px] min-w-4 items-center justify-center gap-1 whitespace-nowrap rounded-md px-1 text-[11px] font-medium',
                saveStatusToneClassName,
              )}
              role="status"
              aria-live={savePresentation.live}
              aria-label={savePresentation.label}
              title={savePresentation.label}
              data-testid="designer-save-status"
              data-save-status={saveStatus}
            >
              {saveStatusIcon}
              {showSaveStatusText ? <span>{savePresentation.label}</span> : null}
            </span>
          ) : null}
          {moreMenuItems.length > 0 ? (
            <Dropdown menu={{ items: moreMenuItems, onClick: handleMoreMenuClick, className: "w-[216px] max-h-[min(60vh,360px)] overflow-y-auto rounded-lg border border-slate-200 p-1 shadow-[0_12px_28px_rgba(15,23,42,0.14)] [&_.ant-dropdown-menu-item]:min-h-[30px] [&_.ant-dropdown-menu-item]:rounded-md [&_.ant-dropdown-menu-item]:px-2 [&_.ant-dropdown-menu-item]:py-1 [&_.ant-dropdown-menu-item]:text-[12px] [&_.ant-dropdown-menu-item]:text-slate-700 [&_.ant-dropdown-menu-title-content]:text-[12px] [&_.ant-dropdown-menu-item-group-title]:px-2 [&_.ant-dropdown-menu-item-group-title]:pb-0.5 [&_.ant-dropdown-menu-item-group-title]:pt-1.5 [&_.ant-dropdown-menu-item-group-title]:text-[10px] [&_.ant-dropdown-menu-item-group-title]:font-semibold [&_.ant-dropdown-menu-item-group-title]:uppercase [&_.ant-dropdown-menu-item-group-title]:tracking-[0.08em] [&_.ant-dropdown-menu-item-group-title]:text-slate-400 [&_.ant-dropdown-menu-item-group-list]:m-0 [&_.ant-dropdown-menu-item-group-list]:p-0 [&_.ant-dropdown-menu-item-divider]:my-1" }} placement="bottomRight" trigger={['click']} getPopupContainer={() => document.body}>
              <Button
                className={mergeClassNames(UI_CLASSNAME + 'control-bar-icon-btn', 'inline-flex h-[30px] min-h-[30px] w-[30px] min-w-[30px] items-center justify-center rounded-md border border-transparent bg-transparent p-0 text-slate-600 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50')}
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

      <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-cluster', UI_CLASSNAME + 'control-bar-cluster--bottom-right', 'absolute bottom-[0.75rem] left-1/2 inline-flex -translate-x-1/2 items-center gap-[0.1875rem] pointer-events-auto')}>
        <div className={mergeClassNames(UI_CLASSNAME + 'control-bar-pill', 'inline-flex h-10 items-center gap-1 rounded-[10px] border border-slate-200 bg-white p-1 shadow-[0_4px_14px_rgba(15,23,42,0.08)]')}>
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

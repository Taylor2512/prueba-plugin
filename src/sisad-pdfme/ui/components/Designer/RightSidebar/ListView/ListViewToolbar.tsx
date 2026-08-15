/**
 * Toolbar for the right sidebar schema list.
 *
 * It contains the list header, count badges, search input, optional schema type
 * filter, clear filter action, mass rename action and optional bulk recipient
 * assignment action for collaborative workflows.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Layers, Search, Users, MoreHorizontal, PencilLine, Eraser } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { SidebarSurfaceHeader } from '@sisad-pdfme/ui/components/Designer/RightSidebar/shared/SidebarSurfacePrimitives';
import type { EffectiveCollaborationContext } from '@sisad-pdfme/ui/collaborationContext';
import type { SelectionCommandSet } from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { stopDesignerControlEvent } from '@sisad-pdfme/ui/components/Designer/shared/interactionExclusions';
import { useDesignerUiConfig } from '@sisad-pdfme/ui/components/Designer/shared/useDesignerUiConfig';
import { resolveReassignActionState } from '@sisad-pdfme/ui/components/Designer/RightSidebar/ListView/reassignActionState';
import TypeFilterSelect from '@sisad-pdfme/ui/components/Designer/RightSidebar/ListView/TypeFilterSelect';


/**
 * Generic select option used by the type filter.
 */
type Option = { value: string; label: string };

const resolveAriaLabel = (value: React.ReactNode | undefined, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback;

const normalizeOptionLabel = (label: React.ReactNode, fallback: string) =>
  typeof label === 'string' && label.trim() ? label : fallback;


/**
 * Props for the ListView toolbar.
 *
 * The toolbar is controlled by ListView and only emits user intents through
 * callbacks. It does not mutate schemas directly.
 */
type Props = {
  densityMode?: 'compact' | 'comfortable' | 'minimal';
  searchQuery: string;
  typeFilter: string;
  schemaTypes: Option[];
  filteredCount: number;
  totalCount: number;
  selectedCount?: number;
  hasActiveSearch: boolean;
  hasSchemas: boolean;
  onChangeSearch: (_value: string) => void;
  onChangeType: (_value: string) => void;
  onStartBulk: () => void;
  onClearFilters: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  bulkActionLabel?: React.ReactNode;
  bulkRecipientLabel?: React.ReactNode;
  searchPlaceholder?: string;
  clearLabel?: React.ReactNode;
  showBulkAction?: boolean;
  showBulkRecipientAction?: boolean;
  assignableRecipientCount?: number;
  bulkRecipientDisabled?: boolean;
  onBulkAssignRecipient?: () => void;
  collaborationContext?: Pick<EffectiveCollaborationContext, 'activeRecipient' | 'canEditStructure'> | null;
  selectionCommands?: SelectionCommandSet;
  useDefaultStyles?: boolean;
};


/**
 * Header and filter controls for the field list.
 *
 * Shows count badges, search box, type filter, filter reset, bulk rename and
 * collaboration assignment actions.
 */
const ListViewToolbar = ({
  densityMode = 'compact',
  searchQuery,
  typeFilter,
  schemaTypes,
  filteredCount,
  totalCount,
  selectedCount = 0,
  hasActiveSearch,
  hasSchemas,
  onChangeSearch,
  onChangeType,
  onStartBulk,
  onClearFilters,
  title = 'Campos',
  subtitle,
  bulkActionLabel = 'Renombrar',
  bulkRecipientLabel,
  searchPlaceholder = 'Buscar campo o nombre',
  clearLabel = 'Limpiar',
  useDefaultStyles,
  showBulkAction = true,
  showBulkRecipientAction = false,
  assignableRecipientCount = 0,
  bulkRecipientDisabled = false,
  onBulkAssignRecipient,
  collaborationContext,
}: Props) => {
  const designerUiConfig = useDesignerUiConfig();
  const { assignmentEnabled, reassignVisible, assignmentModalVisible } = designerUiConfig.features;
  const reassignActionState = resolveReassignActionState({
    assignmentEnabled,
    reassignVisible,
    assignmentModalVisible,
    selectedCount,
    assignableRecipientCount,
    hasHandler: typeof onBulkAssignRecipient === 'function',
    hasAssignableRecipients: showBulkRecipientAction,
    bulkRecipientDisabled,
    collaborationContext,
  });
  // Contador único y semántico: sin filtro "N campos"; con filtro "F de N"
  // (cubre "0 de N" sin coincidencias). Reemplaza el duplicado previo de badge
  // `F/N` + subtítulo "F visibles".
  const fieldCounterLabel = hasActiveSearch
    ? `${filteredCount} de ${totalCount}`
    : totalCount === 1
      ? '1 campo'
      : `${totalCount} campos`;
  // Etiqueta contextual del renombrado según la selección; un `bulkActionLabel`
  // explícito distinto del default la sobrescribe.
  const renameActionLabel =
    typeof bulkActionLabel === 'string' && bulkActionLabel.trim() && bulkActionLabel !== 'Renombrar'
      ? bulkActionLabel
      : selectedCount === 1
        ? 'Renombrar campo'
        : selectedCount > 1
          ? `Renombrar ${selectedCount} campos`
          : 'Renombrar campos';
  const isDense = useDefaultStyles !== false;
  const isCompactDensity = densityMode !== 'comfortable';
  const isMinimalDensity = densityMode === 'minimal';
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const optionMap = useMemo(() => {
    const map = new Map<string, string>();
    schemaTypes.forEach((option) => {
      map.set(option.value, normalizeOptionLabel(option.label, option.value));
    });
    return map;
  }, [schemaTypes]);

  useEffect(() => {
    if (!isMoreMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (moreMenuRef.current?.contains(target)) return;
      setIsMoreMenuOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMoreMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMoreMenuOpen]);

  return (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'list-view-toolbar',
        'flex min-w-0 flex-col',
        isDense && 'w-full gap-2',
      )}
    >
      <SidebarSurfaceHeader
        compact={isCompactDensity}
        leading={<Layers size={14} className={DESIGNER_CLASSNAME + 'layers-auto'} />}
        title={title}
        subtitle={subtitle}
        meta={
          <>
            <span data-testid="right-sidebar-fields-counter" className="text-slate-500">
              {fieldCounterLabel}
            </span>
            {selectedCount > 0 ? (
              <span
                title={`${selectedCount} seleccionados`}
                data-testid="right-sidebar-fields-selection-count"
                className="inline-flex items-center gap-0.5 rounded-full border border-sky-200 bg-sky-50 px-1.5 py-[0.0625rem] font-semibold text-sky-700"
              >
                <Users size={10} />
                {selectedCount}
              </span>
            ) : null}
          </>
        }
        trailing={
          showBulkAction && hasSchemas ? (
            <div className={mergeClassNames(
              DESIGNER_CLASSNAME + 'list-view-toolbar-actions',
              'flex items-center justify-end',
              isCompactDensity ? 'gap-1.5' : 'gap-2',
              isDense && 'shrink-0',
            )}>
              {reassignActionState.showButton ? (
                <button
                  type="button"
                  disabled={reassignActionState.buttonDisabled}
                  title={reassignActionState.buttonTitle}
                  onPointerDownCapture={stopDesignerControlEvent}
                  onMouseDownCapture={stopDesignerControlEvent}
                  onDoubleClickCapture={stopDesignerControlEvent}
                  onClick={(event) => {
                    stopDesignerControlEvent(event);
                    onBulkAssignRecipient?.();
                  }}
                  data-testid="right-sidebar-reassign"
                  data-designer-control="true"
                  data-interaction-exclusion="true"
                  aria-label={resolveAriaLabel(bulkRecipientLabel, 'Reasignar responsable')}
                  className={mergeClassNames(
                    DESIGNER_CLASSNAME + 'bulk-assignrecipient',
                    'inline-flex appearance-none items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2 text-xs font-semibold text-sky-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-sky-300 hover:bg-sky-100/80 disabled:cursor-not-allowed disabled:opacity-45',
                    isMinimalDensity ? 'h-7' : 'h-8',
                  )}
                >
                  <Users size={14} />
                  <span className="hidden lg:inline">Reasignar</span>
                </button>
              ) : null}
              <div ref={moreMenuRef} className="relative">
                <button
                  type="button"
                  title="Más acciones"
                  data-testid="right-sidebar-more"
                  aria-label="Más acciones"
                  aria-expanded={isMoreMenuOpen}
                  aria-haspopup="menu"
                  onPointerDownCapture={stopDesignerControlEvent}
                  onMouseDownCapture={stopDesignerControlEvent}
                  onClick={(event) => {
                    stopDesignerControlEvent(event);
                    setIsMoreMenuOpen((prev) => !prev);
                  }}
                  className={mergeClassNames(
                    DESIGNER_CLASSNAME + 'bulk-update',
                    'inline-flex appearance-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-slate-300 hover:bg-slate-50',
                    isMinimalDensity ? 'h-7 w-7' : 'h-8 w-8',
                  )}
                >
                  <MoreHorizontal size={14} />
                </button>
                {isMoreMenuOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 z-30 mt-1.5 min-w-[12rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                  >
                    {reassignActionState.showSelectionHint ? (
                      <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500" role="note">
                        <Users size={14} className="text-slate-400" />
                        <span data-testid="right-sidebar-reassign-hint">
                          {reassignActionState.selectionHintLabel || 'Selecciona uno o más campos'}
                        </span>
                      </div>
                    ) : reassignActionState.buttonDisabled && reassignActionState.disabledReasonLabel ? (
                      <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500" role="note">
                        <Users size={14} className="text-slate-400" />
                        <span data-testid="right-sidebar-reassign-hint">
                          {reassignActionState.disabledReasonLabel}
                        </span>
                      </div>
                    ) : null}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={(event) => {
                        stopDesignerControlEvent(event);
                        setIsMoreMenuOpen(false);
                        onStartBulk();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <PencilLine size={14} className="text-slate-500" />
                      <span data-testid="right-sidebar-more-rename">{renameActionLabel}</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null
        }
        className="py-1"
      />
      <div className={mergeClassNames(
        DESIGNER_CLASSNAME + 'list-view-toolbar-controls',
        'flex flex-col',
        isDense && 'gap-2',
      )}>
        <label
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'input-auto',
            'flex min-w-0 items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2 text-sm shadow-[0_1px_2px_rgba(15,23,42,0.03)] focus-within:border-sky-200 focus-within:ring-2 focus-within:ring-sky-100',
            isDense ? 'h-8' : 'h-9',
          )}
        >
          <Search size={12} className={mergeClassNames(DESIGNER_CLASSNAME + 'search-auto', 'shrink-0 text-slate-400')} />
          <input
            id="right-sidebar-fields-search"
            name="right-sidebar-fields-search"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            className="h-full w-full min-w-0 border-0 bg-transparent text-[0.72rem] text-slate-700 outline-none placeholder:text-slate-400"
          />
          {searchQuery ? (
            <button
              type="button"
              aria-label="Limpiar búsqueda"
              onClick={() => onChangeSearch('')}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              ×
            </button>
          ) : null}
        </label>
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-toolbar-row', 'flex flex-wrap items-center gap-2')}>
          {schemaTypes.length > 2 ? (
            <TypeFilterSelect
              id="right-sidebar-fields-type-filter"
              value={typeFilter}
              onChange={onChangeType}
              densityMode={densityMode}
              options={schemaTypes.map((option) => ({
                value: option.value,
                label: optionMap.get(option.value) || option.value,
              }))}
            />
          ) : null}
          {hasActiveSearch ? (
            <button
              type="button"
              title={resolveAriaLabel(clearLabel, 'Limpiar filtros')}
              onClick={onClearFilters}
              aria-label={resolveAriaLabel(clearLabel, 'Limpiar filtros')}
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'list-view-clear-filters',
                'inline-flex appearance-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-slate-300 hover:bg-slate-50',
                isMinimalDensity ? 'h-7 w-7' : 'h-8 w-8',
              )}
            >
              <Eraser size={14} />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListViewToolbar;

/**
 * Toolbar for the right sidebar schema list.
 *
 * It contains the list header, count badges, search input, optional schema type
 * filter, clear filter action, mass rename action and optional bulk recipient
 * assignment action for collaborative workflows.
 */
import React, { useContext } from 'react';
import { Button, Dropdown, Input, Select, Tooltip } from 'antd';
import { Layers, Search, Users, MoreHorizontal, PencilLine, Eraser } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { SidebarSurfaceHeader } from '../shared/SidebarSurfacePrimitives.js';
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import { mergeClassNames } from '../../shared/className.js';
import { stopDesignerControlEvent } from '../../shared/interactionExclusions.js';
import { OptionsContext } from '../../../../contexts.js';
import { resolveReassignVisibilityState } from '../../shared/visibilityConfig.js';
import { resolveReassignActionState } from './reassignActionState.js';


/**
 * Generic select option used by the type filter.
 */
type Option = { value: string; label: string };

const resolveAriaLabel = (value: React.ReactNode | undefined, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback;


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
  bulkRecipientDisabled = false,
  onBulkAssignRecipient,
  collaborationContext,
}: Props) => {
  const options = useContext(OptionsContext);
  const { assignmentEnabled, reassignVisible, assignmentModalVisible } = resolveReassignVisibilityState(options);
  const reassignActionState = resolveReassignActionState({
    assignmentEnabled,
    reassignVisible,
    assignmentModalVisible,
    selectedCount,
    hasHandler: typeof onBulkAssignRecipient === 'function',
    hasAssignableRecipients: showBulkRecipientAction,
    bulkRecipientDisabled,
    collaborationContext,
  });
  const resolvedSubtitle = subtitle ?? (() => {
    if (!hasActiveSearch) return null;
    if (filteredCount === 0) return 'Sin coincidencias';
    return `${filteredCount} visibles`;
  })();
  const isDense = useDefaultStyles !== false;
  const isCompactDensity = densityMode !== 'comfortable';
  const isMinimalDensity = densityMode === 'minimal';

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
        subtitle={resolvedSubtitle || undefined}
        badges={[
          { label: `${filteredCount}/${totalCount}`, color: 'default' },
          ...(selectedCount > 0
            ? [{
                label: (
                  <span className="inline-flex items-center gap-1">
                    <Users size={10} />
                    <span>{selectedCount}</span>
                  </span>
                ),
                color: 'processing' as const,
                tooltip: `${selectedCount} seleccionados`,
              }]
            : []),
        ]}
        trailing={
          showBulkAction && hasSchemas ? (
            <div className={mergeClassNames(
              DESIGNER_CLASSNAME + 'list-view-toolbar-actions',
              'flex items-center',
              isCompactDensity ? 'gap-1.5' : 'gap-2',
              isDense && 'shrink-0',
            )}>
              {reassignActionState.showButton ? (
                <Tooltip title="Reasignar responsable" placement="top">
                  <Button
                    type="text"
                    size="small"
                    disabled={reassignActionState.buttonDisabled}
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
                      DESIGNER_CLASSNAME + 'bulk-assign-recipient',
                      'inline-flex appearance-none items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2 text-xs font-semibold text-sky-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)]',
                      isMinimalDensity ? 'h-7' : 'h-8',
                    )}
                  >
                    <Users size={14} />
                    <span className="hidden lg:inline">Reasignar</span>
                  </Button>
                </Tooltip>
              ) : null}
              <Dropdown
                trigger={['click']}
                placement="bottomRight"
                menu={{
                  items: [
                    ...(reassignActionState.showSelectionHint
                      ? [{
                          key: 'reassign-hint',
                          label: (
                            <span data-testid="right-sidebar-reassign-hint">
                              {reassignActionState.selectionHintLabel || 'Selecciona campos'}
                            </span>
                          ),
                          disabled: true,
                          icon: <Users size={14} />,
                        }]
                      : []),
                    {
                      key: 'rename',
                      label: <span data-testid="right-sidebar-more-rename">{bulkActionLabel || 'Renombrar campos'}</span>,
                      icon: <PencilLine size={14} />,
                    },
                  ],
                  onClick: ({ key }) => {
                    if (key === 'rename') {
                      onStartBulk();
                    }
                  },
                }}
              >
                <Tooltip title={bulkActionLabel || 'Más acciones'} placement="top">
                  <Button
                    type="text"
                    size="small"
                    data-testid="right-sidebar-more"
                    aria-label={resolveAriaLabel(bulkActionLabel, 'Más acciones')}
                    className={mergeClassNames(
                      DESIGNER_CLASSNAME + 'bulk-update',
                      'inline-flex appearance-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
                      isMinimalDensity ? 'h-7 w-7' : 'h-8 w-8',
                    )}
                  >
                    <MoreHorizontal size={14} />
                  </Button>
                </Tooltip>
              </Dropdown>
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
        <Input
          id="right-sidebar-fields-search"
          name="right-sidebar-fields-search"
          size="small"
          allowClear
          placeholder={searchPlaceholder}
          prefix={<Search size={12} className={DESIGNER_CLASSNAME + 'search-auto'} />}
          value={searchQuery}
          onChange={(e) => onChangeSearch(e.target.value)}
          className={mergeClassNames(
            DESIGNER_CLASSNAME + 'input-auto',
            'min-w-0 rounded-xl border border-slate-200/80 bg-white text-sm shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
            isDense ? 'h-8' : 'h-9',
          )}
        />
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-toolbar-row', 'flex items-center gap-2')}>
          {schemaTypes.length > 2 ? (
            <Select<string, Option>
              id="right-sidebar-fields-type-filter"
              size="small"
              value={typeFilter}
              onChange={onChangeType}
              options={schemaTypes}
              popupMatchSelectWidth={false}
              className={mergeClassNames(
                DESIGNER_CLASSNAME + 'select-auto',
                'min-w-0 rounded-xl border-slate-200 bg-white [&_.ant-select-selector]:min-h-[2rem] [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:bg-white [&_.ant-select-selector]:text-[0.6875rem] [&_.ant-select-selector]:shadow-none',
                isMinimalDensity ? 'h-7' : 'h-8',
              )}
            />
          ) : null}
          {hasActiveSearch ? (
            <Tooltip title={clearLabel || 'Limpiar filtros'} placement="top">
              <Button
                type="text"
                size="small"
                onClick={onClearFilters}
                aria-label={resolveAriaLabel(clearLabel, 'Limpiar filtros')}
                className={mergeClassNames(
                  DESIGNER_CLASSNAME + 'list-view-clear-filters',
                  'inline-flex appearance-none items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)]',
                  isMinimalDensity ? 'h-7 w-7' : 'h-8 w-8',
                )}
              >
                <Eraser size={14} />
              </Button>
            </Tooltip>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListViewToolbar;

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
import { asRecord } from '../../shared/objectGuards.js';
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
  const optionsRecord = asRecord(options);
  const visibility = asRecord(optionsRecord?.visibility);
  const actionsVisibility = asRecord(visibility?.actions);
  const modalsVisibility = asRecord(visibility?.modals);
  const assignmentEnabled = asRecord(optionsRecord?.assignment)?.enabled === true;
  const reassignVisible = actionsVisibility?.reassign !== false && assignmentEnabled;
  const reassignActionState = resolveReassignActionState({
    assignmentEnabled,
    reassignVisible,
    assignmentModalVisible: modalsVisibility?.assignment !== false,
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

  return (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'list-view-toolbar',
        'flex min-w-0 flex-col',
        isDense && 'w-full gap-2',
      )}
    >
      <SidebarSurfaceHeader
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
              'flex items-center gap-2',
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
                      'inline-flex h-8 items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2 text-xs font-semibold text-sky-700 shadow-sm',
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
                      'inline-flex h-8 w-8 items-center justify-center rounded-full border-slate-200 text-slate-700 shadow-sm',
                    )}
                  >
                    <MoreHorizontal size={14} />
                  </Button>
                </Tooltip>
              </Dropdown>
            </div>
          ) : null
        }
        compact
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
            'min-w-0 rounded-xl border-slate-200 bg-white text-sm shadow-sm',
            isDense && 'h-8',
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
              className={mergeClassNames(DESIGNER_CLASSNAME + 'select-auto', 'min-w-0 rounded-xl')}
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
                  'inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-600',
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

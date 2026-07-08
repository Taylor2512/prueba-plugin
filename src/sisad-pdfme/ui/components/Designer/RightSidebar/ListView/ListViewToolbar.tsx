import React from 'react';
import { Button, Input, Select } from 'antd';
import { Layers, Search } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { SidebarSurfaceHeader } from '../shared/SidebarSurfacePrimitives.js';
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import { mergeClassNames } from '../../shared/className.js';

type Option = { value: string; label: string };

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
  const resolvedSubtitle = subtitle ?? (() => {
    if (!hasActiveSearch) return null;
    if (filteredCount === 0) return 'Sin coincidencias';
    return `${filteredCount} visibles`;
  })();
  const isDense = useDefaultStyles !== false;

  const densityStyles =
    useDefaultStyles === false
      ? {
        container: {} as React.CSSProperties,
        header: {} as React.CSSProperties,
        titleWrap: {} as React.CSSProperties,
        title: {} as React.CSSProperties,
        counter: {} as React.CSSProperties,
        subtitle: {} as React.CSSProperties,
        searchWrap: {} as React.CSSProperties,
        input: {} as React.CSSProperties,
        empty: {} as React.CSSProperties,
        actions: {} as React.CSSProperties,
      }
      : {
          container: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minWidth: 0,
            width: '100%',
          } as const,
          header: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 8,
            minWidth: 0,
            width: '100%',
          } as const,
          titleWrap: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 2,
            minWidth: 0,
            flex: 1,
          } as const,
          title: {
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          } as const,
          counter: {
            flexShrink: 0,
            fontSize: 9.5,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            borderRadius: 999,
            padding: '0 7px',
            lineHeight: '18px',
          } as const,
          subtitle: {
            fontSize: 11,
            lineHeight: 1.3,
            maxWidth: '100%',
          } as const,
          searchWrap: {
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 0,
          } as const,
          input: { borderRadius: 10, fontSize: 12, height: 30, minWidth: 0 } as const,
          empty: { fontSize: 11, textAlign: 'left', padding: '0' } as const,
          actions: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            flexShrink: 0,
          } as const,
      };

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
          ...(selectedCount > 0 ? [{ label: `${selectedCount} seleccionados`, color: 'processing' as const }] : []),
        ]}
        trailing={
          showBulkAction && hasSchemas ? (
            <div className={mergeClassNames(
              DESIGNER_CLASSNAME + 'list-view-toolbar-actions',
              'flex items-center gap-2',
              isDense && 'shrink-0',
            )}>
              {showBulkRecipientAction && collaborationContext?.activeRecipient && collaborationContext.canEditStructure !== false ? (
                <Button
                  type="text"
                  size="small"
                  disabled={bulkRecipientDisabled}
                  onClick={onBulkAssignRecipient}
                  className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-assign-recipient', 'rounded-full border-slate-200 text-slate-700 shadow-sm')}>
                  {bulkRecipientLabel || `Asignar a ${collaborationContext.activeRecipient.name}`}
                </Button>
              ) : null}
              <Button
                type="text"
                size="small"
                onClick={onStartBulk}
                className={mergeClassNames(DESIGNER_CLASSNAME + 'bulk-update', 'rounded-full border-slate-200 text-slate-700 shadow-sm')}>
                {bulkActionLabel}
              </Button>
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
            <Select
              size="small"
              value={typeFilter}
              onChange={onChangeType}
              options={schemaTypes}
              popupMatchSelectWidth={false}
              className={mergeClassNames(DESIGNER_CLASSNAME + 'select-auto', 'min-w-0 rounded-xl')}
            />
          ) : null}
          {hasActiveSearch ? (
            <Button
              type="text"
              size="small"
              onClick={onClearFilters}
              className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-clear-filters', 'rounded-xl px-2 text-slate-600')}>
              {clearLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListViewToolbar;

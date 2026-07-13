/**
 * Right sidebar list view for all schemas/fields in the current document page.
 *
 * The view provides:
 * - searchable and filterable schema list;
 * - sortable field order through dnd-kit;
 * - multi-selection awareness from the canvas/selection runtime;
 * - bulk field-name editing;
 * - optional recipient assignment for selected fields;
 * - runtime event emission for analytics/integration hooks.
 *
 * The component intentionally delegates rendering of rows and drag behavior to
 * `SelectableSortableContainer` so ListView remains focused on filtering,
 * toolbar state, bulk actions and sidebar layout.
 */
import React, { useContext, useState, useMemo, useCallback, useRef } from 'react';
import type { SidebarProps } from '../../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { I18nContext } from '../../../../contexts.js';
import { Input } from 'antd';
import SelectableSortableContainer from './SelectableSortableContainer.js';
import { SidebarBody, SidebarFooter, SidebarFrame, SidebarHeader } from '../layout.js';
import { mergeClassNames } from '../../shared/className.js';
import { SidebarEmptyState } from '../../shared/SidebarEmptyState.js';
import ListViewToolbar from './ListViewToolbar.js';
import ListViewFooter from './ListViewFooter.js';
import { filterSchemasForCollaborationView } from '../../../../collaborationContext.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import { emitDesignerRuntimeEvent } from '../../shared/designerExtensions.js';
import { useResponsiveDensity } from '../../shared/useResponsiveDensity.js';
import { getSchemaTypeLabel } from '../../shared/designerLabels.js';
import { resolveSchemaInteractionState } from '../../shared/schemaInteractionState.js';

const { TextArea } = Input;


/**
 * Main field-list sidebar view.
 *
 * Responsibilities:
 * - apply collaboration visibility filters;
 * - maintain search/type filters;
 * - orchestrate bulk rename mode;
 * - delegate sorting/selection to `SelectableSortableContainer`;
 * - expose bulk recipient assignment when collaboration state allows it.
 */
const ListView = (
  props: Pick<
    SidebarProps,
    | 'schemas'
    | 'onSortEnd'
    | 'onEdit'
    | 'hoveringSchemaId'
    | 'onChangeHoveringSchemaId'
    | 'changeSchemas'
    | 'collaborationContext'
    | 'extensions'
  > & {
    activeSchemaIds: string[];
    className?: string;
    useDefaultStyles?: boolean;
    selectionCommands?: SelectionCommandSet;
  },
) => {
  const {
    schemas,
    onSortEnd,
    onEdit,
    hoveringSchemaId,
    onChangeHoveringSchemaId,
    changeSchemas,
    activeSchemaIds,
    collaborationContext,
    selectionCommands,
  } = props;
  const i18n = useContext(I18nContext);
  const runtimeEvents = props.extensions?.events;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { mode: densityMode, width: panelWidth } = useResponsiveDensity(rootRef, {
    comfortable: 430,
    compact: 332,
    mini: 252,
  });
  const [isBulkUpdateFieldNamesMode, setIsBulkUpdateFieldNamesMode] = useState(false);
  const [fieldNamesValue, setFieldNamesValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const viewSchemas = useMemo(
    () => filterSchemasForCollaborationView(schemas, collaborationContext),
    [collaborationContext, schemas],
  );


  /**
   * Normalizes searchable scalar values for case-insensitive filtering.
   */
  const normalizeText = (value: unknown) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim().toLowerCase();
    }

    return '';
  };

  /**
   * Collects unique schema types for the toolbar filter dropdown.
   */
  const schemaTypes = useMemo(() => {
    const types = Array.from(new Set(viewSchemas.map((s) => s.type)));
    return [
      { value: 'all', label: 'Todos los tipos' },
      ...types.map((t) => ({ value: t, label: getSchemaTypeLabel(t) })),
    ];
  }, [viewSchemas]);

  /**
   * Applies text search and type filtering to the collaboration-visible schemas.
   */
  const filteredSchemas = useMemo(() => {
    return viewSchemas.filter((s) => {
      const query = normalizeText(searchQuery);
      const matchesSearch =
        query.length === 0 ||
        [s.name, s.type, s.id].some((value) => normalizeText(value).includes(query));
      const matchesType = typeFilter === 'all' || normalizeText(s.type) === normalizeText(typeFilter);
      return matchesSearch && matchesType;
    });
  }, [viewSchemas, searchQuery, typeFilter]);

  const activeRecipient = collaborationContext?.activeRecipient || null;
  const selectedSchemas = useMemo(
    () => viewSchemas.filter((schema) => activeSchemaIds.includes(schema.id)),
    [activeSchemaIds, viewSchemas],
  );
  const hasSelectableRecipient = Boolean(activeRecipient?.id) && collaborationContext?.canEditStructure !== false;
  const hasLockedSelection = selectedSchemas.some((schema) => {
    const interactionState = resolveSchemaInteractionState(schema, { collaborationContext });
    return interactionState.isLocked || interactionState.isReadOnly;
  });

  const emitRuntimeEvent = useCallback(
    (event: Parameters<typeof emitDesignerRuntimeEvent>[1]) => {
      emitDesignerRuntimeEvent(runtimeEvents, event);
    },
    [runtimeEvents],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      emitRuntimeEvent({
        type: 'sidebar.list.search.changed',
        source: 'toolbar',
        component: 'ListViewToolbar',
        value,
        details: { activeSchemas: viewSchemas.length, filteredSchemas: filteredSchemas.length },
      });
    },
    [emitRuntimeEvent, filteredSchemas.length, viewSchemas.length],
  );

  const handleTypeChange = useCallback(
    (value: string) => {
      setTypeFilter(value);
      emitRuntimeEvent({
        type: 'sidebar.list.filter.changed',
        source: 'toolbar',
        component: 'ListViewToolbar',
        value,
        details: { searchQuery },
      });
    },
    [emitRuntimeEvent, searchQuery],
  );

  const startBulk = useCallback(() => {
    setFieldNamesValue(viewSchemas.map((s) => s.name).join('\n'));
    setIsBulkUpdateFieldNamesMode(true);
  }, [viewSchemas]);

  const handleStartBulk = useCallback(() => {
    emitRuntimeEvent({
      type: 'sidebar.list.bulk.start',
      source: 'toolbar',
      component: 'ListView',
      details: { schemaCount: viewSchemas.length },
    });
    startBulk();
  }, [emitRuntimeEvent, startBulk, viewSchemas.length]);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setTypeFilter('all');
    emitRuntimeEvent({
      type: 'sidebar.list.filter.cleared',
      source: 'toolbar',
      component: 'ListViewToolbar',
    });
  }, [emitRuntimeEvent]);


  /**
   * Assigns the currently active recipient to all selected schemas.
   *
   * Uses the selection command when available; otherwise falls back to writing
   * the collaboration metadata directly through `changeSchemas`.
   */
  const handleBulkAssignRecipient = () => {
    if (!hasSelectableRecipient || selectedSchemas.length === 0 || hasLockedSelection) return;
    const nextRecipient = activeRecipient;
    if (!nextRecipient?.id) return;

    emitRuntimeEvent({
      type: 'sidebar.list.bulk.assign-recipient',
      source: 'toolbar',
      component: 'ListView',
      schemaIds: selectedSchemas.map((schema) => schema.id),
      details: { recipientId: nextRecipient.id, recipientName: nextRecipient.name || nextRecipient.tag || nextRecipient.id },
    });

    if (selectionCommands?.assignRecipient) {
      selectionCommands.assignRecipient({
        id: nextRecipient.id,
        name: nextRecipient.name || nextRecipient.tag || nextRecipient.id,
        color: nextRecipient.color || null,
      });
      return;
    }

    const nextOwnerColor = nextRecipient.color || null;
    changeSchemas(
      selectedSchemas.flatMap((schema) => [
        { schemaId: schema.id, key: 'ownerRecipientId', value: nextRecipient.id },
        { schemaId: schema.id, key: 'ownerRecipientIds', value: [nextRecipient.id] },
        { schemaId: schema.id, key: 'recipientId', value: nextRecipient.id },
        { schemaId: schema.id, key: 'ownerRecipientName', value: nextRecipient.name || nextRecipient.tag || nextRecipient.id },
        { schemaId: schema.id, key: 'ownerColor', value: nextOwnerColor },
        { schemaId: schema.id, key: 'userColor', value: nextOwnerColor },
        {
          schemaId: schema.id,
          key: 'ownerMode',
          value: 'single',
        },
      ]),
    );
  };


  /**
   * Commits one field name per line to the filtered collaboration-visible list.
   *
   * The operation is intentionally all-or-nothing by line count so names are not
   * accidentally shifted across fields.
   */
  const commitBulk = () => {
    const names = fieldNamesValue.split('\n');
    if (names.length === viewSchemas.length) {
      emitRuntimeEvent({
        type: 'sidebar.list.bulk.commit-names',
        source: 'toolbar',
        component: 'ListView',
        details: { schemaCount: viewSchemas.length },
      });
      changeSchemas(
        names.map((value, index) => ({
          key: 'name',
          value,
          schemaId: viewSchemas[index].id,
        })),
      );
      setIsBulkUpdateFieldNamesMode(false);
      return;
    }

    alert(i18n('errorBulkUpdateFieldName'));
  };

  const hasActiveSearch = searchQuery !== '' || typeFilter !== 'all';
  const showToolbar = !isBulkUpdateFieldNamesMode;
  const showEmptyState = !isBulkUpdateFieldNamesMode && filteredSchemas.length === 0;
  const showList = !isBulkUpdateFieldNamesMode && filteredSchemas.length > 0;

  return (
    <SidebarFrame className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view', 'flex h-full min-h-0 flex-col', props.className)}>
      <div
        ref={rootRef}
        className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-density-wrap', 'flex min-h-0 flex-1 flex-col')}
        data-list-density={densityMode}
        style={{ '--list-view-panel-width': `${panelWidth}px` } as React.CSSProperties}
      >
      {showToolbar ? (
      <SidebarHeader stacked>
        <ListViewToolbar
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          schemaTypes={schemaTypes}
          filteredCount={filteredSchemas.length}
          totalCount={viewSchemas.length}
          selectedCount={activeSchemaIds.length}
          hasActiveSearch={hasActiveSearch}
          hasSchemas={viewSchemas.length > 0}
          onChangeSearch={handleSearchChange}
          onChangeType={handleTypeChange}
          onStartBulk={handleStartBulk}
          onClearFilters={handleClearFilters}
          collaborationContext={collaborationContext}
          selectionCommands={selectionCommands}
          showBulkRecipientAction={selectedSchemas.length > 0}
          bulkRecipientDisabled={hasLockedSelection || !hasSelectableRecipient}
          onBulkAssignRecipient={handleBulkAssignRecipient}
          bulkRecipientLabel={
            selectedSchemas.length > 1 && activeRecipient
              ? `Asignar ${selectedSchemas.length} campos a ${activeRecipient.name}`
              : activeRecipient
                ? `Asignar a ${activeRecipient.name}`
                : 'Asignar destinatario'
          }
          useDefaultStyles={props.useDefaultStyles}
        />
      </SidebarHeader>
      ) : null}
      <SidebarBody tabIndex={0} aria-label="Lista de campos del documento">
        {isBulkUpdateFieldNamesMode ? (
          <TextArea
            wrap="off"
            value={fieldNamesValue}
            onChange={(e) => {
              setFieldNamesValue(e.target.value);
              emitRuntimeEvent({
                type: 'sidebar.list.bulk.text.changed',
                source: 'toolbar',
                component: 'ListView',
                value: e.target.value,
                details: { lineCount: e.target.value.split('\n').length },
              });
            }}
            className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view-bulk-textarea', 'min-h-[11rem] rounded-xl border-slate-200 bg-white shadow-sm')}
          />
        ) : null}
        {showList ? (
          <SelectableSortableContainer
            allSchemas={schemas}
            visibleSchemas={filteredSchemas}
            hoveringSchemaId={hoveringSchemaId}
            onChangeHoveringSchemaId={onChangeHoveringSchemaId}
            onSortEnd={onSortEnd}
            onEdit={onEdit}
            activeSchemaIds={activeSchemaIds}
            collaborationContext={collaborationContext}
            selectionCommands={selectionCommands}
          />
        ) : null}
        {showEmptyState ? (
          <SidebarEmptyState
            title="No hay campos que coincidan"
            description="Limpia la búsqueda, cambia el tipo o vuelve a la vista general del catálogo."
            density={densityMode}
            actionLabel={hasActiveSearch ? "Limpiar filtros" : undefined}
            onAction={hasActiveSearch ? handleClearFilters : undefined}
          />
        ) : null}
      </SidebarBody>
      {isBulkUpdateFieldNamesMode ? (
        <SidebarFooter>
          <ListViewFooter
            bulkMode={isBulkUpdateFieldNamesMode}
            hasSchemas={viewSchemas.length > 0}
            onCommit={commitBulk}
            onCancel={() => setIsBulkUpdateFieldNamesMode(false)}
            onStartBulk={startBulk}
            labels={{
              bulkUpdateFieldName: i18n('bulkUpdateFieldName'),
              commitBulkUpdateFieldName: i18n('commitBulkUpdateFieldName'),
              cancel: i18n('cancel'),
            }}
          />
        </SidebarFooter>
      ) : null}
      </div>
    </SidebarFrame>
  );
};

export default ListView;

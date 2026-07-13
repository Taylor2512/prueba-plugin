/**
 * Right sidebar list view for all schemas/fields in the current document page.
 *
 * The view provides:
 * - searchable and filterable schema list;
 * - sortable field order through dnd-kit;
 * - multi-selection awareness from the canvas/selection runtime;
 * - bulk field-name editing;
 * - optional recipient reassignment for selected fields;
 * - runtime event emission for analytics/integration hooks.
 *
 * The component intentionally delegates rendering of rows and drag behavior to
 * `SelectableSortableContainer` and the reassignment UI to
 * `SchemaAssignmentDialog`, so ListView remains focused on filtering, toolbar
 * state, bulk actions and sidebar layout.
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
import SchemaAssignmentDialog from '../shared/SchemaAssignmentDialog.js';
import { filterSchemasForCollaborationView } from '../../../../collaborationContext.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import { emitDesignerRuntimeEvent } from '../../shared/designerExtensions.js';
import { useResponsiveDensity } from '../../shared/useResponsiveDensity.js';
import { getSchemaTypeLabel } from '../../shared/designerLabels.js';
import { resolveSchemaInteractionState } from '../../shared/schemaInteractionState.js';
import { buildAssignSchemaOwnerOps, resolveSelectionOwner } from '../../shared/schemaAssignmentService.js';

const { TextArea } = Input;


/**
 * Main field-list sidebar view.
 *
 * Responsibilities:
 * - apply collaboration visibility filters;
 * - maintain search/type filters;
 * - orchestrate bulk rename mode;
 * - delegate sorting/selection to `SelectableSortableContainer`;
 * - expose recipient reassignment through `SchemaAssignmentDialog`.
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
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const viewSchemas = useMemo(
    () => filterSchemasForCollaborationView(schemas, collaborationContext),
    [collaborationContext, schemas],
  );
  const recipientOptions = useMemo(() => collaborationContext?.recipientOptions || [], [collaborationContext]);


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

  const selectedSchemas = useMemo(
    () => viewSchemas.filter((schema) => activeSchemaIds.includes(schema.id)),
    [activeSchemaIds, viewSchemas],
  );
  const hasSelectableRecipient = recipientOptions.length > 0 && collaborationContext?.canEditStructure !== false;
  const hasLockedSelection = selectedSchemas.some((schema) => {
    const interactionState = resolveSchemaInteractionState(schema, { collaborationContext });
    return interactionState.isLocked || interactionState.isReadOnly;
  });
  const canAssignSelected = hasSelectableRecipient && selectedSchemas.length > 0 && !hasLockedSelection;
  const selectionOwner = useMemo(() => resolveSelectionOwner(selectedSchemas), [selectedSchemas]);

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

  /**
   * Opens rename from the "Más" menu.
   *
   * With a single selected field, prefers inline/DetailView rename so users are
   * not forced into the bulk textarea; otherwise opens compact bulk rename.
   */
  const handleStartBulk = useCallback(() => {
    if (selectedSchemas.length === 1 && selectionCommands?.requestInlineEdit) {
      selectionCommands.requestInlineEdit({ schemaId: selectedSchemas[0].id, target: 'name' });
      emitRuntimeEvent({
        type: 'sidebar.list.rename.inline',
        source: 'toolbar',
        component: 'ListView',
        schemaIds: [selectedSchemas[0].id],
      });
      return;
    }
    emitRuntimeEvent({
      type: 'sidebar.list.bulk.start',
      source: 'toolbar',
      component: 'ListView',
      details: { schemaCount: viewSchemas.length },
    });
    startBulk();
  }, [emitRuntimeEvent, selectedSchemas, selectionCommands, startBulk, viewSchemas.length]);

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
   * Opens the "Reasignar responsable" dialog for the current selection.
   */
  const openAssignmentDialog = useCallback(() => {
    if (!canAssignSelected) return;
    setIsAssignmentDialogOpen(true);
  }, [canAssignSelected]);


  /**
   * Reassigns the chosen recipient to every selected schema.
   *
   * Prefers the command-bus-backed selection command (reversible, matches the
   * canvas selection); otherwise applies the shared owner patch through
   * `changeSchemas`. Neither path touches lock/readOnly state.
   */
  const handleConfirmAssignment = useCallback(
    (recipientId: string) => {
      const nextRecipientId = String(recipientId || '').trim();
      if (!nextRecipientId || selectedSchemas.length === 0 || hasLockedSelection) return;

      const nextRecipient = recipientOptions.find((recipient) => recipient.id === nextRecipientId);
      if (!nextRecipient) return;

      const recipient = {
        id: nextRecipient.id,
        name: nextRecipient.name || nextRecipient.tag || nextRecipient.id,
        color: nextRecipient.color || null,
      };

      emitRuntimeEvent({
        type: 'sidebar.list.bulk.assign-recipient',
        source: 'toolbar',
        component: 'ListView',
        schemaIds: selectedSchemas.map((schema) => schema.id),
        details: { recipientId: recipient.id, recipientName: recipient.name },
      });

      if (selectionCommands?.assignRecipient) {
        selectionCommands.assignRecipient(recipient);
      } else {
        changeSchemas(
          buildAssignSchemaOwnerOps(selectedSchemas, selectedSchemas.map((schema) => schema.id), recipient),
        );
      }

      setIsAssignmentDialogOpen(false);
    },
    [changeSchemas, emitRuntimeEvent, hasLockedSelection, recipientOptions, selectionCommands, selectedSchemas],
  );


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
          bulkRecipientDisabled={!canAssignSelected}
          onBulkAssignRecipient={openAssignmentDialog}
          bulkRecipientLabel={
            selectedSchemas.length > 1
              ? `Reasignar ${selectedSchemas.length} campos`
              : 'Reasignar responsable'
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
      <SchemaAssignmentDialog
        open={isAssignmentDialogOpen}
        selectedSchemas={selectedSchemas}
        recipients={recipientOptions}
        currentRecipientId={selectionOwner.recipientId}
        currentOwnerMixed={selectionOwner.mixed}
        onClose={() => setIsAssignmentDialogOpen(false)}
        onConfirm={handleConfirmAssignment}
      />
      </div>
    </SidebarFrame>
  );
};

export default ListView;

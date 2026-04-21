import React, { useContext, useState, useMemo } from 'react';
import type { SidebarProps } from '../../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { I18nContext } from '../../../../contexts.js';
import { Button, Input, Typography } from 'antd';
import SelectableSortableContainer from './SelectableSortableContainer.js';
import { SidebarBody, SidebarFooter, SidebarFrame, SidebarHeader } from '../layout.js';
import { mergeClassNames } from '../../shared/className.js';
import ListViewToolbar from './ListViewToolbar.js';
import ListViewFooter from './ListViewFooter.js';
import { filterSchemasForCollaborationView } from '../../../../collaborationContext.js';

const { TextArea } = Input;
const { Text } = Typography;

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
  > & {
    activeSchemaIds: string[];
    className?: string;
    useDefaultStyles?: boolean;
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
  } = props;
  const i18n = useContext(I18nContext);
  const [isBulkUpdateFieldNamesMode, setIsBulkUpdateFieldNamesMode] = useState(false);
  const [fieldNamesValue, setFieldNamesValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const viewSchemas = useMemo(
    () => filterSchemasForCollaborationView(schemas, collaborationContext),
    [collaborationContext, schemas],
  );

  const normalizeText = (value: unknown) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim().toLowerCase();
    }

    return '';
  };

  // Collect unique schema types for the filter dropdown
  const schemaTypes = useMemo(() => {
    const types = Array.from(new Set(viewSchemas.map((s) => s.type)));
    return [
      { value: 'all', label: 'Todos los tipos' },
      ...types.map((t) => ({ value: t, label: t })),
    ];
  }, [viewSchemas]);

  // Filter schemas by search query and type
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

  const commitBulk = () => {
    const names = fieldNamesValue.split('\n');
    if (names.length === viewSchemas.length) {
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

  const startBulk = () => {
    setFieldNamesValue(viewSchemas.map((s) => s.name).join('\n'));
    setIsBulkUpdateFieldNamesMode(true);
  };

  const hasActiveSearch = searchQuery !== '' || typeFilter !== 'all';
  const showToolbar = !isBulkUpdateFieldNamesMode;
  const showEmptyState = !isBulkUpdateFieldNamesMode && filteredSchemas.length === 0;
  const showList = !isBulkUpdateFieldNamesMode && filteredSchemas.length > 0;

  return (
    <SidebarFrame
      className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view', props.className)}>
      {showToolbar ? (
      <SidebarHeader>
        <ListViewToolbar
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          schemaTypes={schemaTypes}
          filteredCount={filteredSchemas.length}
          totalCount={viewSchemas.length}
          hasActiveSearch={hasActiveSearch}
          hasSchemas={viewSchemas.length > 0}
          onChangeSearch={setSearchQuery}
          onChangeType={setTypeFilter}
          onStartBulk={startBulk}
          onClearFilters={() => {
            setSearchQuery('');
            setTypeFilter('all');
          }}
          useDefaultStyles={props.useDefaultStyles}
        />
      </SidebarHeader>
      ) : null}
      <SidebarBody tabIndex={0} aria-label="Lista de campos del documento">
        {isBulkUpdateFieldNamesMode ? (
          <TextArea
            wrap="off"
            value={fieldNamesValue}
            onChange={(e) => setFieldNamesValue(e.target.value)}
            className={DESIGNER_CLASSNAME + 'list-view-bulk-textarea'}
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
          />
        ) : null}
        {showEmptyState ? (
          <div className={DESIGNER_CLASSNAME + 'list-view-empty'}>
            <Text strong className={DESIGNER_CLASSNAME + 'list-view-empty-title'}>
              No hay campos que coincidan
            </Text>
            <Text type="secondary" className={DESIGNER_CLASSNAME + 'list-view-empty-hint'}>
              Limpia la búsqueda, cambia el tipo o vuelve a la vista general del catálogo.
            </Text>
            {hasActiveSearch ? (
              <Button
                size="small"
                type="default"
                onClick={() => {
                  setSearchQuery('');
                  setTypeFilter('all');
                }}
                className={DESIGNER_CLASSNAME + 'list-view-empty-action'}>
                Limpiar filtros
              </Button>
            ) : null}
          </div>
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
    </SidebarFrame>
  );
};

export default ListView;

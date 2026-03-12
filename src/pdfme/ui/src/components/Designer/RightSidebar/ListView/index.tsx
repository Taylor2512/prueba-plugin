import React, { useContext, useState, useMemo } from 'react';
import type { SidebarProps } from '../../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { I18nContext } from '../../../../contexts.js';
import { Input } from 'antd';
import SelectableSortableContainer from './SelectableSortableContainer.js';
import { SidebarBody, SidebarFooter, SidebarFrame, SidebarHeader } from '../layout.js';
import { mergeClassNames } from '../../shared/className.js';
import ListViewToolbar from './ListViewToolbar.js';
import ListViewFooter from './ListViewFooter.js';

const { TextArea } = Input;

const ListView = (
  props: Pick<
    SidebarProps,
    | 'schemas'
    | 'onSortEnd'
    | 'onEdit'
    | 'hoveringSchemaId'
    | 'onChangeHoveringSchemaId'
    | 'changeSchemas'
  > & {
    className?: string;
    style?: React.CSSProperties;
    useDefaultStyles?: boolean;
  },
) => {
  const { schemas, onSortEnd, onEdit, hoveringSchemaId, onChangeHoveringSchemaId, changeSchemas } =
    props;
  const i18n = useContext(I18nContext);
  const [isBulkUpdateFieldNamesMode, setIsBulkUpdateFieldNamesMode] = useState(false);
  const [fieldNamesValue, setFieldNamesValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Collect unique schema types for the filter dropdown
  const schemaTypes = useMemo(() => {
    const types = Array.from(new Set(schemas.map((s) => s.type)));
    return [
      { value: 'all', label: 'Todos los tipos' },
      ...types.map((t) => ({ value: t, label: t })),
    ];
  }, [schemas]);

  // Filter schemas by search query and type
  const filteredSchemas = useMemo(() => {
    return schemas.filter((s) => {
      const matchesSearch = !searchQuery || s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || s.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [schemas, searchQuery, typeFilter]);

  const commitBulk = () => {
    const names = fieldNamesValue.split('\n');
    if (names.length !== schemas.length) {
      alert(i18n('errorBulkUpdateFieldName'));
    } else {
      changeSchemas(
        names.map((value, index) => ({
          key: 'name',
          value,
          schemaId: schemas[index].id,
        })),
      );
      setIsBulkUpdateFieldNamesMode(false);
    }
  };

  const startBulk = () => {
    setFieldNamesValue(schemas.map((s) => s.name).join('\n'));
    setIsBulkUpdateFieldNamesMode(true);
  };

  const hasActiveSearch = searchQuery !== '' || typeFilter !== 'all';

  return (
    <SidebarFrame
      className={mergeClassNames(DESIGNER_CLASSNAME + 'list-view', props.className)}>
      {!isBulkUpdateFieldNamesMode ? (
        <SidebarHeader>
          <ListViewToolbar
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            schemaTypes={schemaTypes}
            filteredCount={filteredSchemas.length}
            totalCount={schemas.length}
            hasActiveSearch={hasActiveSearch}
            onChangeSearch={setSearchQuery}
            onChangeType={setTypeFilter}
            useDefaultStyles={props.useDefaultStyles}
          />
        </SidebarHeader>
      ) : null}
      <SidebarBody>
        {isBulkUpdateFieldNamesMode ? (
          <TextArea
            wrap="off"
            value={fieldNamesValue}
            onChange={(e) => setFieldNamesValue(e.target.value)}
            className={DESIGNER_CLASSNAME + 'list-view-bulk-textarea'}
          />
        ) : (
          <SelectableSortableContainer
            schemas={filteredSchemas}
            hoveringSchemaId={hoveringSchemaId}
            onChangeHoveringSchemaId={onChangeHoveringSchemaId}
            onSortEnd={onSortEnd}
            onEdit={onEdit}
          />
        )}
      </SidebarBody>
      <SidebarFooter>
        <ListViewFooter
          bulkMode={isBulkUpdateFieldNamesMode}
          hasSchemas={schemas.length > 0}
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
    </SidebarFrame>
  );
};

export default ListView;

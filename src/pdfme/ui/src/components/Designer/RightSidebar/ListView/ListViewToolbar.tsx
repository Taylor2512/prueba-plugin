import React from 'react';
import { Button, Input, Select, Typography } from 'antd';
import { Layers, Search } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

const { Text } = Typography;

type Option = { value: string; label: string };

type Props = {
  searchQuery: string;
  typeFilter: string;
  schemaTypes: Option[];
  filteredCount: number;
  totalCount: number;
  hasActiveSearch: boolean;
  hasSchemas: boolean;
  onChangeSearch: (_value: string) => void;
  onChangeType: (_value: string) => void;
  onStartBulk: () => void;
  onClearFilters: () => void;
  useDefaultStyles?: boolean;
};

const ListViewToolbar = ({
  searchQuery,
  typeFilter,
  schemaTypes,
  filteredCount,
  totalCount,
  hasActiveSearch,
  hasSchemas,
  onChangeSearch,
  onChangeType,
  onStartBulk,
  onClearFilters,
  useDefaultStyles,
}: Props) => {
  const subtitle = (() => {
    if (!hasActiveSearch) {
      return 'Gestiona nombres, orden y visibilidad';
    }

    if (filteredCount === 0) {
      return 'Sin coincidencias. Ajusta filtros o limpia la búsqueda.';
    }

    return `Mostrando ${filteredCount} coincidencias`;
  })();

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
            gap: 10,
            minWidth: 0,
            width: '100%',
          } as const,
          header: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 10,
            minWidth: 0,
            width: '100%',
          } as const,
          titleWrap: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 3,
            minWidth: 0,
            flex: 1,
          } as const,
          title: {
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
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
            lineHeight: 1.35,
            maxWidth: '100%',
          } as const,
          searchWrap: {
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            minWidth: 0,
          } as const,
          input: { borderRadius: 10, fontSize: 12, height: 32, minWidth: 0 } as const,
          empty: { fontSize: 11, textAlign: 'left', padding: '0' } as const,
          actions: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            flexShrink: 0,
          } as const,
      };

  return (
    <div className={DESIGNER_CLASSNAME + 'list-view-toolbar'} style={densityStyles.container}>
      <div className={DESIGNER_CLASSNAME + 'sidebar-header'} style={densityStyles.header}>
        <div className={DESIGNER_CLASSNAME + 'sidebar-header-content'} style={densityStyles.titleWrap}>
          <div className={DESIGNER_CLASSNAME + 'sidebar-header-title'} style={densityStyles.title}>
            <Layers size={14} className={DESIGNER_CLASSNAME + 'layers-auto'} />
            <Text strong className={DESIGNER_CLASSNAME + 'list-view-title'}>
              Campos del documento
            </Text>
            <Text
              type="secondary"
              className={DESIGNER_CLASSNAME + 'list-view-counter'}
              style={densityStyles.counter}>
              {filteredCount}/{totalCount}
            </Text>
          </div>
          <Text type="secondary" className={DESIGNER_CLASSNAME + 'list-view-subtitle'} style={densityStyles.subtitle}>
            {subtitle}
          </Text>
        </div>
        {hasSchemas ? (
          <Button
            type="text"
            size="small"
            onClick={onStartBulk}
            className={DESIGNER_CLASSNAME + 'bulk-update'}>
            Renombrar
          </Button>
        ) : null}
      </div>
      <div className={DESIGNER_CLASSNAME + 'list-view-toolbar-controls'} style={densityStyles.searchWrap}>
        <Input
          size="small"
          allowClear
          placeholder="Buscar campo, tipo o categoría"
          prefix={<Search size={12} className={DESIGNER_CLASSNAME + 'search-auto'} />}
          value={searchQuery}
          onChange={(e) => onChangeSearch(e.target.value)}
          className={DESIGNER_CLASSNAME + 'input-auto'}
          style={densityStyles.input}
        />
        <div className={DESIGNER_CLASSNAME + 'list-view-toolbar-row'}>
          {schemaTypes.length > 2 ? (
            <Select
              size="small"
              value={typeFilter}
              onChange={onChangeType}
              options={schemaTypes}
              popupMatchSelectWidth={false}
              className={DESIGNER_CLASSNAME + 'select-auto'}
            />
          ) : null}
          {hasActiveSearch ? (
            <Button
              type="text"
              size="small"
              onClick={onClearFilters}
              className={DESIGNER_CLASSNAME + 'list-view-clear-filters'}>
              Limpiar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListViewToolbar;

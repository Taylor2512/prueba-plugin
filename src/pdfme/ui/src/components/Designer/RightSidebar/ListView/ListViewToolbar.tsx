import React from 'react';
import { Input, Select, Typography } from 'antd';
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
  onChangeSearch: (value: string) => void;
  onChangeType: (value: string) => void;
  useDefaultStyles?: boolean;
};

const ListViewToolbar = ({
  searchQuery,
  typeFilter,
  schemaTypes,
  filteredCount,
  totalCount,
  hasActiveSearch,
  onChangeSearch,
  onChangeType,
  useDefaultStyles,
}: Props) => {
  const densityStyles =
    useDefaultStyles === false
      ? {
          container: {} as React.CSSProperties,
          header: {} as React.CSSProperties,
          titleWrap: {} as React.CSSProperties,
          title: {} as React.CSSProperties,
          counter: {} as React.CSSProperties,
          searchWrap: {} as React.CSSProperties,
          input: {} as React.CSSProperties,
          empty: {} as React.CSSProperties,
        }
      : {
          container: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 0,
            width: '100%',
          } as const,
          header: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
            width: '100%',
          } as const,
          titleWrap: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minWidth: 0,
            flex: 1,
          } as const,
          title: {
            flex: 1,
            minWidth: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          } as const,
          counter: {
            flexShrink: 0,
            fontSize: 10,
            border: '1px solid rgba(15,23,42,0.1)',
            borderRadius: 999,
            padding: '0 6px',
            lineHeight: '18px',
          } as const,
          searchWrap: {
            padding: '6px 10px 4px',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minWidth: 0,
          } as const,
          input: { borderRadius: 7, fontSize: 12, height: 30, minWidth: 0 } as const,
          empty: { fontSize: 11, textAlign: 'center', padding: '7px 0' } as const,
        };

  return (
    <div className={DESIGNER_CLASSNAME + "div-auto"}>
      <div className={DESIGNER_CLASSNAME + 'sidebar-header'}>
        <div className={DESIGNER_CLASSNAME + "div-auto"}>
          <div className={DESIGNER_CLASSNAME + "div-auto"}>
            <Layers size={15} className={DESIGNER_CLASSNAME + "layers-auto"} />
            <Text strong className={DESIGNER_CLASSNAME + 'list-view-title'}>
              Lista de campos
            </Text>
          </div>
          <Text type="secondary" className={DESIGNER_CLASSNAME + "text-auto"}>
            {filteredCount}/{totalCount}
          </Text>
        </div>
      </div>
      <div className={DESIGNER_CLASSNAME + "div-auto"}>
        <Input
          size="small"
          allowClear
          placeholder="Buscar campo..."
          prefix={<Search size={12} className={DESIGNER_CLASSNAME + "search-auto"} />}
          value={searchQuery}
          onChange={(e) => onChangeSearch(e.target.value)}
          className={DESIGNER_CLASSNAME + "input-auto"}
        />
        {schemaTypes.length > 2 ? (
          <Select
            size="small"
            value={typeFilter}
            onChange={onChangeType}
            options={schemaTypes}
            popupMatchSelectWidth={false}
            className={DESIGNER_CLASSNAME + "select-auto"}
          />
        ) : null}
        {hasActiveSearch && filteredCount === 0 ? (
          <Text type="secondary" className={DESIGNER_CLASSNAME + "text-auto"}>
            Sin resultados
          </Text>
        ) : null}
        {hasActiveSearch && filteredCount > 0 ? (
          <Text type="secondary" className={DESIGNER_CLASSNAME + "text-auto"}>
            Mostrando {filteredCount} coincidencias
          </Text>
        ) : null}
      </div>
    </div>
  );
};

export default ListViewToolbar;

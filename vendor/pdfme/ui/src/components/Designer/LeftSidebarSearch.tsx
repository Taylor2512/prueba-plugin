import React from 'react';
import { Input } from 'antd';
import { Search } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeUniqueClassNames } from './shared/className.js';

type LeftSidebarSearchProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  useDefaultStyles?: boolean;
};

const LeftSidebarSearch = ({
  value,
  onChange,
  className,
  useDefaultStyles = true,
}: LeftSidebarSearchProps) => (
  <Input
    size="small"
    allowClear
    placeholder="Buscar schema, tipo o categoria..."
    prefix={<Search size={14} />}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    data-use-default-style={useDefaultStyles ? 'true' : 'false'}
    className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-search`, className || '')}
  />
);

export default LeftSidebarSearch;

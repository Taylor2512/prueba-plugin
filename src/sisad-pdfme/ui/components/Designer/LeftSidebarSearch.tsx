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
    placeholder="Buscar campo"
    prefix={<Search size={13} />}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    data-testid="left-sidebar-search"
    data-use-default-style={useDefaultStyles ? 'true' : 'false'}
    className={mergeUniqueClassNames(
      `${DESIGNER_CLASSNAME}left-sidebar-search`,
      'rounded-xl border-slate-200 bg-white text-[0.75rem] shadow-sm [&_.ant-input-affix-wrapper]:h-8 [&_.ant-input-affix-wrapper]:px-3 [&_.ant-input-affix-wrapper]:rounded-xl',
      className || '',
    )}
  />
);

export default LeftSidebarSearch;

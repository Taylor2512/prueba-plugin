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
  density?: 'comfortable' | 'compact' | 'mini';
};

const LeftSidebarSearch = ({
  value,
  onChange,
  className,
  useDefaultStyles = true,
  density = 'comfortable'
}: LeftSidebarSearchProps) => (
  <Input
    size="small"
    allowClear
    placeholder={density === 'mini' ? 'Buscar...' : 'Buscar campo...'}
    prefix={<Search size={density === 'mini' ? 10 : 12} className="text-slate-400" />}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    data-testid="left-sidebar-search"
    data-use-default-style={useDefaultStyles ? 'true' : 'false'}
    className={mergeUniqueClassNames(
      `${DESIGNER_CLASSNAME}left-sidebar-search`,
      'w-full rounded-full border border-slate-200/70 bg-slate-50/70 px-2.5 shadow-sm transition-colors duration-150 hover:bg-white focus-within:border-sky-200 focus-within:bg-white focus-within:shadow-[0_0_0_1px_rgba(186,230,253,0.75)]',
      density === 'mini' ? 'h-7 text-[10px]' : 'h-8 text-[0.72rem]',
      density === 'mini' ? '[&_.ant-input]:text-[10px]' : '[&_.ant-input]:text-[0.72rem]',
      '[&_.ant-input-affix-wrapper-focused]:shadow-none',
      className || '',
    )}
  />
);

export default LeftSidebarSearch;

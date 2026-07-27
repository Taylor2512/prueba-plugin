import React from 'react';
import { Input } from 'antd';
import { Search } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../constants.ts';
import { mergeUniqueClassNames } from './shared/className.js';

type LeftSidebarSearchProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  useDefaultStyles?: boolean;
  density?: 'comfortable' | 'compact' | 'minimal';
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
    placeholder={density === 'minimal' ? 'Buscar...' : 'Buscar campo...'}
    prefix={<Search size={density === 'minimal' ? 10 : 12} className="text-slate-400" />}
    value={value}
    onChange={(event) => onChange(event.target.value)}
    data-testid="left-sidebar-search"
    data-use-default-style={useDefaultStyles ? 'true' : 'false'}
    className={mergeUniqueClassNames(
      `${DESIGNER_CLASSNAME}left-sidebar-search`,
      'w-full rounded-lg border border-slate-200 bg-white px-2 shadow-none transition-[border-color,box-shadow] duration-150 hover:border-slate-300 focus-within:border-blue-400 focus-within:shadow-[0_0_0_2px_rgba(37,99,235,0.20)]',
      density === 'minimal' ? 'h-7 text-[10px]' : 'h-[34px] text-[0.7rem]',
      density === 'minimal' ? '[&_.ant-input]:text-[10px]' : '[&_.ant-input]:text-[0.7rem]',
      '[&_.ant-input-affix-wrapper-focused]:shadow-none',
      '[&_.ant-input-affix-wrapper]:border-0 [&_.ant-input-affix-wrapper]:bg-transparent [&_.ant-input]:bg-transparent',
      className || '',
    )}
  />
);

export default LeftSidebarSearch;

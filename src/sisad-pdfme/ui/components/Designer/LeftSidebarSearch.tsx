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
      density === 'mini' ? 'h-6.5 text-[10px]' : 'h-7.5 text-[0.72rem]',
      'rounded-lg border-slate-200/60 bg-slate-50/30 transition-all hover:bg-white focus:bg-white px-2',
      density === 'mini' ? '[&_.ant-input]:text-[10px]' : '[&_.ant-input]:text-[0.72rem]',
      '[&_.ant-input-affix-wrapper-focused]:shadow-[0_0_0_2px_rgba(56,189,248,0.1)]',
      className || '',
    )}
  />
);

export default LeftSidebarSearch;

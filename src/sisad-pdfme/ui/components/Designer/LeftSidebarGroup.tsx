import React from 'react';
import { Empty } from 'antd';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeUniqueClassNames } from './shared/className.js';

type LeftSidebarGroupItem = React.ReactNode;

type LeftSidebarGroupProps = {
  category: string;
  items: LeftSidebarGroupItem[];
  count?: number;
  viewMode?: 'compact' | 'rich';
  collapsed?: boolean;
  collapsible?: boolean;
  onToggle?: () => void;
};

export const LeftSidebarGroup = ({
  category,
  items,
  count,
  viewMode = 'rich',
  collapsed = true,
  collapsible = true,
  onToggle,
}: LeftSidebarGroupProps) => {
  const titleContent = (
    <>
      <span
        className={`${DESIGNER_CLASSNAME}left-sidebar-group-title-label text-[11px] font-bold uppercase tracking-[0.12em]`}
      >
        {category}
      </span>
      <span
        className={`${DESIGNER_CLASSNAME}left-sidebar-group-title-count inline-flex min-h-5 items-center rounded-full border border-slate-200 bg-slate-50 px-2 text-[11px] font-semibold text-slate-600`}
      >
        {typeof count === 'number' ? count : items.length}
      </span>
    </>
  );
  const titleClassName = mergeUniqueClassNames(
    `${DESIGNER_CLASSNAME}left-sidebar-group-title`,
    'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-800 transition',
    'hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
  );

  return (
    <section
      className={mergeUniqueClassNames(
        `${DESIGNER_CLASSNAME}left-sidebar-group`,
        'rounded-2xl border border-slate-200/70 bg-white/92 p-2 shadow-sm',
      )}
    >
      {collapsible ? (
        <button
          type="button"
          className={titleClassName}
          data-collapsed={collapsed ? 'true' : 'false'}
          aria-expanded={!collapsed}
          aria-label={`Alternar categoría ${category}`}
          onClick={onToggle}
        >
          {titleContent}
        </button>
      ) : (
        <div
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-group-title`,
            'flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-800',
          )}
          data-collapsed={collapsed ? 'true' : 'false'}
        >
          {titleContent}
        </div>
      )}
      <div
        className={mergeUniqueClassNames(
          `${DESIGNER_CLASSNAME}left-sidebar-group-items`,
          'mt-2 space-y-1.5',
        )}
        data-view-mode={viewMode}
        data-collapsed={collapsed ? 'true' : 'false'}
      >
        {items}
      </div>
    </section>
  );
};

type LeftSidebarEmptyStateProps = {
  description: string;
};

export const LeftSidebarEmptyState = ({ description }: LeftSidebarEmptyStateProps) => (
  <div className={`${DESIGNER_CLASSNAME}left-sidebar-empty`}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
  </div>
);

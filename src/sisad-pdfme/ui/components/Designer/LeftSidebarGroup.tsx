import React from 'react';
import { ChevronDown } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeUniqueClassNames } from './shared/className.js';
import { SidebarEmptyState } from './shared/SidebarEmptyState.js';

type LeftSidebarGroupItem = React.ReactNode;

type LeftSidebarGroupProps = {
  category: string;
  items: LeftSidebarGroupItem[];
  count?: number;
  layout?: 'list' | 'tiles' | 'icons';
  density?: 'comfortable' | 'compact' | 'mini';
  collapsed?: boolean;
  collapsible?: boolean;
  onToggle?: () => void;
};

export const LeftSidebarGroup = ({
  category,
  items,
  count,
  layout = 'list',
  density = 'comfortable',
  collapsed = true,
  collapsible = true,
  onToggle,
}: LeftSidebarGroupProps) => {
  const isMini = density === 'mini';
  const isCompact = density === 'compact' || density === 'mini';
  
  const titleContent = (
    <>
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-group-title-chevron`,
            'inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-transform duration-200',
            collapsed ? 'rotate-[-90deg]' : '',
            isMini ? 'scale-75' : isCompact ? 'scale-90' : ''
          )}
          aria-hidden="true"
        >
          <ChevronDown size={isMini ? 8 : 10} strokeWidth={2.5} />
        </span>
        <span
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-group-title-label font-bold uppercase tracking-[0.06em] truncate`,
            isMini ? 'text-[7px]' : isCompact ? 'text-[8.5px]' : 'text-[9.5px]'
          )}
        >
          {category}
        </span>
      </div>
      <span
        className={mergeUniqueClassNames(
          `${DESIGNER_CLASSNAME}left-sidebar-group-title-count inline-flex min-h-[0.875rem] items-center rounded-full border border-slate-200 bg-slate-50/50 px-1 text-[8px] font-semibold text-slate-500`,
          isMini ? 'hidden' : ''
        )}
      >
        {typeof count === 'number' ? count : items.length}
      </span>
    </>
  );

  const titleClassName = mergeUniqueClassNames(
    `${DESIGNER_CLASSNAME}left-sidebar-group-title`,
    'flex w-full items-center justify-between gap-2 rounded-full border border-transparent px-2 py-1 text-left font-semibold text-slate-700 transition-colors duration-150 hover:border-slate-200 hover:bg-slate-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50',
    isMini ? 'min-h-[20px]' : isCompact ? 'min-h-[24px]' : 'min-h-[28px]',
  );

  return (
    <section
      className={mergeUniqueClassNames(
        `${DESIGNER_CLASSNAME}left-sidebar-group`,
        'rounded-2xl border border-slate-200/70 bg-white/90 px-1.5 py-1.5 shadow-sm last:border-b-0'
      )}
      data-testid="left-sidebar-group"
      data-density={density}
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
            'flex w-full items-center justify-between gap-3 rounded-full px-3 py-2 text-left text-sm font-semibold text-slate-800',
          )}
          data-collapsed={collapsed ? 'true' : 'false'}
        >
          {titleContent}
        </div>
      )}
      <div
        className={mergeUniqueClassNames(
          `${DESIGNER_CLASSNAME}left-sidebar-group-items`,
          'mt-1',
          layout === 'icons' 
            ? (isMini ? 'grid grid-cols-3 gap-0.5 px-0.5' : isCompact ? 'grid grid-cols-4 gap-1 px-1' : 'grid grid-cols-5 gap-1 px-1.5')
            : (isMini ? 'px-0.5 space-y-[1px]' : isCompact ? 'px-1 space-y-0.5' : 'px-1.5 space-y-1')
        )}
        data-catalog-layout={layout}
        data-collapsed={collapsed ? 'true' : 'false'}
      >
        {!collapsed && items}
      </div>
    </section>
  );
};

type LeftSidebarEmptyStateProps = {
  description?: string;
  density?: 'comfortable' | 'compact' | 'mini';
};

/**
 * Empty state unified with RightSidebar.
 */
export const LeftSidebarEmptyState = ({ description, density = 'comfortable' }: LeftSidebarEmptyStateProps) => (
  <SidebarEmptyState
    title="Sin resultados"
    description={description || 'No hay campos disponibles según los filtros aplicados.'}
    density={density}
    className="mx-2 mb-4"
  />
);

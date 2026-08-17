import React, { useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { I18nContext } from '@sisad-pdfme/ui/contexts';
import { mergeUniqueClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { SidebarEmptyState } from '@sisad-pdfme/ui/components/Designer/shared/SidebarEmptyState';

type LeftSidebarGroupItem = React.ReactNode;

type LeftSidebarGroupProps = {
  /**
   * Identificador de agrupación y orden. NO se traduce: alimenta la key de React,
   * el estado de colapso y los atributos `data-*` que consumen los tests.
   */
  category: string;

  /**
   * Etiqueta visible de la categoría. Si se omite se muestra `category`, que es
   * lo correcto para categorías aportadas por el host.
   */
  categoryLabel?: string;
  items: LeftSidebarGroupItem[];
  count?: number;
  layout?: 'list' | 'tiles' | 'icons';
  density?: 'comfortable' | 'compact' | 'minimal';
  collapsed?: boolean;
  collapsible?: boolean;
  onToggle?: () => void;
};

export const LeftSidebarGroup = ({
  category,
  categoryLabel,
  items,
  count,
  layout = 'list',
  density = 'comfortable',
  collapsed = true,
  collapsible = true,
  onToggle,
}: LeftSidebarGroupProps) => {
  const translate = useContext(I18nContext);
  const visibleCategory = categoryLabel || category;
  const isMini = density === 'minimal';
  const isCompact = density === 'compact' || density === 'minimal';
  const itemsClassName = mergeUniqueClassNames(
    `${DESIGNER_CLASSNAME}left-sidebar-group-items`,
    'mt-1',
    layout === 'icons'
      ? (isMini ? 'grid grid-cols-3 gap-0.5 px-0' : isCompact ? 'grid grid-cols-3 gap-0.5 px-0.5' : 'grid grid-cols-4 gap-0.5 px-0.5')
      : layout === 'tiles'
        ? (isMini ? 'grid grid-cols-2 gap-0.5 px-0' : isCompact ? 'grid grid-cols-2 gap-0.5 px-0.5' : 'grid grid-cols-2 gap-0.5 px-0.5')
        : (isMini ? 'px-0 space-y-0.5' : isCompact ? 'px-0.5 space-y-0.5' : 'px-0.5 space-y-0.5'),
  );

  const titleContent = (
    <>
      <div className="flex items-center gap-1 min-w-0">
        <span
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-group-title-chevron`,
            'inline-flex h-3 w-3 flex-shrink-0 items-center justify-center text-slate-400 transition-transform duration-200',
            collapsed ? 'rotate-[-90deg]' : '',
            isMini ? 'scale-75' : isCompact ? 'scale-85' : ''
          )}
          aria-hidden="true"
        >
          <ChevronDown size={isMini ? 10 : 12} strokeWidth={2.5} />
        </span>
        <span
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-group-title-label font-semibold uppercase tracking-[0.06em] truncate text-slate-600`,
            isMini ? 'text-[9px]' : isCompact ? 'text-[10px]' : 'text-[11px]'
          )}
        >
          {visibleCategory}
        </span>
      </div>
      <span
        className={mergeUniqueClassNames(
          `${DESIGNER_CLASSNAME}left-sidebar-group-title-count inline-flex min-h-[0.875rem] flex-shrink-0 items-center rounded-full bg-white px-1 text-[10px] font-semibold text-slate-500`,
          isMini ? 'hidden' : ''
        )}
      >
        {typeof count === 'number' ? count : items.length}
      </span>
    </>
  );

  const titleClassName = mergeUniqueClassNames(
    `${DESIGNER_CLASSNAME}left-sidebar-group-title`,
    'flex w-full items-center justify-between gap-1 rounded-md border border-transparent bg-slate-100 px-2 text-left font-semibold text-slate-600 transition-colors duration-150 hover:bg-slate-200/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30',
    isMini ? 'min-h-[24px]' : isCompact ? 'min-h-[28px]' : 'min-h-[32px]',
  );

  return (
    <section
      className={mergeUniqueClassNames(
        `${DESIGNER_CLASSNAME}left-sidebar-group`,
        'mb-2 bg-transparent p-1 last:mb-0'
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
          aria-label={`${translate('catalog.toggleCategory')} ${visibleCategory}`}
          onClick={onToggle}
        >
          {titleContent}
        </button>
      ) : (
        <div
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-group-title`,
            'flex w-full items-center justify-between gap-1 rounded-full px-1.5 py-0.5 text-left text-sm font-semibold text-slate-600',
          )}
          data-collapsed={collapsed ? 'true' : 'false'}
        >
          {titleContent}
        </div>
      )}
      <div
        className={itemsClassName}
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
  density?: 'comfortable' | 'compact' | 'minimal';
};

/**
 * Empty state unified with RightSidebar.
 */
export const LeftSidebarEmptyState = ({ description, density = 'comfortable' }: LeftSidebarEmptyStateProps) => {
  const translate = useContext(I18nContext);
  return (
    <SidebarEmptyState
      title={translate('catalog.noResults')}
      description={description || translate('catalog.noResultsDescription')}
      density={density}
      className="mx-2 mb-4"
    />
  );
};

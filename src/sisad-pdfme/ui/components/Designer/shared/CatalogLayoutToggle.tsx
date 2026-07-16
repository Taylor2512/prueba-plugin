import React from 'react';
import { Button } from 'antd';
import { ListTree, LayoutList, GalleryVerticalEnd } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from './className.js';

export type CatalogLayout = 'list' | 'tiles' | 'icons';

export interface CatalogLayoutToggleProps {
  layout: CatalogLayout;
  onChange: (layout: CatalogLayout) => void;
  density?: 'comfortable' | 'compact' | 'minimal';
  className?: string;
  showLabels?: boolean;
}

const CATALOG_VIEW_OPTIONS: Array<{ 
  layout: CatalogLayout; 
  icon: React.ReactNode; 
  label: string; 
  title: string;
  testId: string;
}> = [
  { 
    layout: 'list', 
    icon: <ListTree size={14} />, 
    label: 'Lista', 
    title: 'Ver como lista detallada (≡)',
    testId: 'left-sidebar-view-rich',
  },
  { 
    layout: 'tiles', 
    icon: <GalleryVerticalEnd size={14} />, 
    label: 'Tarjetas', 
    title: 'Ver como tarjetas densas (▦)',
    testId: 'left-sidebar-view-compact',
  },
  { 
    layout: 'icons', 
    icon: <LayoutList size={14} />, 
    label: 'Iconos', 
    title: 'Ver solo iconos (⠿)',
    testId: 'left-sidebar-view-mini',
  },
];

export const CatalogLayoutToggle = ({
  layout,
  onChange,
  density = 'comfortable',
  className,
  showLabels = true,
}: CatalogLayoutToggleProps) => {
  const compactMode = density !== 'comfortable' || !showLabels;

  return (
    <div
      role="group"
      aria-label="Diseño del catálogo"
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}catalog-layout-toggle`,
        'inline-flex max-w-full min-w-0 items-center gap-1 rounded-lg border border-slate-200/70 bg-white/90 p-1 shadow-none',
        className,
      )}
      data-layout={layout}
      data-density={density}
    >
      {CATALOG_VIEW_OPTIONS.map((option) => {
        const active = layout === option.layout;
        const displayLabel = showLabels && density !== 'minimal';
        
        return (
          <Button
            key={option.layout}
            className={mergeClassNames(
              `${DESIGNER_CLASSNAME}catalog-layout-toggle-btn`,
              `${DESIGNER_CLASSNAME}catalog-layout-toggle-btn-${option.layout}`,
              'flex-shrink-0 whitespace-nowrap',
              compactMode ? 'h-7 w-8 justify-center px-0' : 'h-7 min-w-[4.25rem] px-2',
            )}
            size="small"
            data-testid={option.testId}
            data-catalog-layout={option.layout}
            data-active={active ? 'true' : 'false'}
            type={active ? 'primary' : 'default'}
            aria-pressed={active}
            aria-label={option.title}
            onClick={() => onChange(option.layout)}
          >
            <span className={mergeClassNames('inline-flex items-center', compactMode ? 'gap-0' : 'gap-1')}>
              <span aria-hidden="true">{option.icon}</span>
              {displayLabel ? (
                <span className={mergeClassNames(
                  `${DESIGNER_CLASSNAME}catalog-layout-toggle-label`,
                  'ml-0.5 truncate',
                )}>
                  {option.label}
                </span>
              ) : (
                <span className="sr-only">{option.label}</span>
              )}
            </span>
          </Button>
        );
      })}
    </div>
  );
};

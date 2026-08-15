import React from 'react';
import { Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

export type SidebarRailItem = {
  key: string;
  icon: React.ReactNode;
  label: string;
  ariaLabel: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export type SidebarRailProps = {
  side: 'left' | 'right';
  items: SidebarRailItem[];
  density?: 'comfortable' | 'compact' | 'minimal';
  className?: string;
  /** Spacer at the top to avoid overlap with toggle handles or top bars. */
  topSpacer?: boolean;
  /** Altura del spacer superior. Debe cubrir el handle de colapso. */
  topSpacerClassName?: string;
};

export const SidebarRail = ({
  side,
  items,
  density = 'comfortable',
  className,
  topSpacer = true,
  topSpacerClassName,
}: SidebarRailProps) => {
  const compactTouchTarget = typeof window !== 'undefined' && window.innerWidth <= 768;
  const railPaddingClass = density === 'minimal'
    ? 'py-1 px-0.5 gap-0.5'
    : density === 'compact'
      ? 'py-0.5 px-0.5 gap-0.5'
      : 'py-1 px-0.5 gap-0.5';
  const buttonSizeClass = density === 'minimal'
    ? 'h-[1.75rem] w-[1.75rem] rounded-md'
    : density === 'compact'
      ? 'h-[1.75rem] w-[1.75rem] rounded-md'
      : 'h-[1.9rem] w-[1.9rem] rounded-md';
  const spacerHeight = density === 'minimal' ? 'h-9' : 'h-10';

  return (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}sidebar-rail`,
        `${DESIGNER_CLASSNAME}sidebar-rail-${side}`,
        'flex flex-col items-center',
        railPaddingClass,
        className,
      )}
      data-side={side}
      data-density={density}
      role="toolbar"
      aria-label={`Barra lateral ${side === 'left' ? 'izquierda' : 'derecha'}`}
    >
      {topSpacer && (
        <div
          className={mergeClassNames(topSpacerClassName || spacerHeight, 'shrink-0 pointer-events-none')}
          aria-hidden="true"
        />
      )}
      <div className={mergeClassNames('flex min-h-0 flex-1 flex-col', density === 'minimal' ? 'gap-0.5' : 'gap-0.5')}>
        {items.map((item) => (
          <Tooltip key={item.key} title={item.label} placement={side === 'left' ? 'right' : 'left'}>
            <button
              type="button"
              className={mergeClassNames(
                `${DESIGNER_CLASSNAME}sidebar-rail-btn`,
                'group relative inline-flex items-center justify-center border border-slate-200 bg-white text-slate-500 transition-all duration-200 hover:bg-sky-50 hover:text-sky-600 hover:border-sky-200',
                buttonSizeClass,
                'max-[48rem]:!h-11 max-[48rem]:!w-11',
                item.active && 'bg-sky-50 text-sky-600 border-sky-200 ring-1 ring-sky-200/60'
              )}
              style={compactTouchTarget ? { width: 44, height: 44 } : undefined}
              disabled={item.disabled}
              data-active={item.active ? 'true' : 'false'}
              data-testid={`sidebar-rail-${side}-${item.key}`}
              aria-pressed={item.active ? 'true' : 'false'}
              aria-label={item.ariaLabel}
              onClick={item.onClick}
            >
              {item.active && (
                <span className="absolute -left-px top-1 h-3 w-[2px] rounded-full bg-sky-500" aria-hidden="true" />
              )}
              <span className={`${DESIGNER_CLASSNAME}sidebar-rail-btn-icon transition-transform duration-200 group-active:scale-90`} aria-hidden="true">
                {React.isValidElement(item.icon)
                  ? React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 16 })
                  : item.icon}
              </span>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from './className.js';

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
  density?: 'comfortable' | 'compact' | 'mini';
  className?: string;
  /** Spacer at the top to avoid overlap with toggle handles or top bars. */
  topSpacer?: boolean;
};

export const SidebarRail = ({
  side,
  items,
  density = 'comfortable',
  className,
  topSpacer = true,
}: SidebarRailProps) => {
  const railPaddingClass = density === 'mini'
    ? 'py-1 px-0.5 gap-1'
    : density === 'compact'
      ? 'py-1.5 px-[0.1875rem] gap-[0.3125rem]'
      : 'py-2 px-1 gap-1.5';
  const buttonSizeClass = density === 'mini'
    ? 'h-[1.75rem] w-[1.75rem] rounded-lg'
    : density === 'compact'
      ? 'h-[1.875rem] w-[1.875rem] rounded-xl'
      : 'h-[1.9rem] w-[1.9rem] rounded-xl';
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
    >
      {topSpacer && (
         <div className={density === 'mini' ? 'h-10 shrink-0 pointer-events-none' : 'h-12 shrink-0 pointer-events-none'} aria-hidden="true" />
      )}
      <div className={mergeClassNames('flex min-h-0 flex-1 flex-col', density === 'mini' ? 'gap-0.5' : 'gap-[0.1875rem]')}>
        {items.map((item) => (
          <Tooltip key={item.key} title={item.label} placement={side === 'left' ? 'right' : 'left'}>
            <button
              type="button"
              className={mergeClassNames(
                `${DESIGNER_CLASSNAME}sidebar-rail-btn`,
                'group relative inline-flex items-center justify-center border border-transparent bg-transparent text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900',
                buttonSizeClass,
                item.active && 'bg-white text-sky-600 shadow-md ring-1 ring-slate-200/60'
              )}
              disabled={item.disabled}
              data-active={item.active ? 'true' : 'false'}
              data-testid={`sidebar-rail-${side}-${item.key}`}
              aria-pressed={item.active ? 'true' : 'false'}
              aria-label={item.ariaLabel}
              onClick={item.onClick}
            >
              {item.active && (
                <span className="absolute -left-[1px] top-1.5 h-4 w-[3px] rounded-full bg-sky-500" aria-hidden="true" />
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

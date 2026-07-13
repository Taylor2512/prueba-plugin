import React from 'react';
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
  return (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}sidebar-rail`,
        `${DESIGNER_CLASSNAME}sidebar-rail-${side}`,
        'flex flex-col items-center py-2 px-1 gap-1.5',
        className,
      )}
      data-side={side}
      data-density={density}
    >
      {topSpacer && (
         <div className="h-14 shrink-0 pointer-events-none" aria-hidden="true" />
      )}
      <div className="flex min-h-0 flex-1 flex-col gap-[0.1875rem]">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={mergeClassNames(
              `${DESIGNER_CLASSNAME}sidebar-rail-btn`,
              'group relative inline-flex h-[1.9rem] w-[1.9rem] items-center justify-center rounded-xl border border-transparent bg-transparent text-slate-500 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900',
              item.active && 'bg-white text-sky-600 shadow-md ring-1 ring-slate-200/60'
            )}
            disabled={item.disabled}
            data-active={item.active ? 'true' : 'false'}
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
        ))}
      </div>
    </div>
  );
};

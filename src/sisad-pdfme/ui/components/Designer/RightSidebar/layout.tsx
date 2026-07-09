import React from 'react';
import { Divider } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from '../shared/className.js';

export const SIDEBAR_H_PADDING_PX = 12;
export const SIDEBAR_V_PADDING_PX = 6;
export const SIDEBAR_HEADER_HEIGHT = 52;

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};
type SidebarFrameProps = SectionProps & {
  className?: string;
};
type SidebarHeaderProps = SectionProps & {
  stacked?: boolean;
};

export const SidebarFrame = ({ children, className, ...props }: SidebarFrameProps) => (
  <div
    className={mergeClassNames(
      DESIGNER_CLASSNAME + 'sidebar-frame',
      DESIGNER_CLASSNAME + 'right-sidebar-layout-frame',
      'flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/95 shadow-sm',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

export const SidebarHeader = ({ children, className, stacked = false, ...props }: SidebarHeaderProps) => (
  <div
    className={mergeClassNames(
      DESIGNER_CLASSNAME + 'right-sidebar-layout-header',
      stacked
        ? 'flex flex-none flex-col items-stretch justify-start gap-1.5 border-b border-slate-200/70 px-2.5 py-2'
        : 'flex flex-none items-center justify-between gap-2 border-b border-slate-200/70 px-2.5 py-2',
      className,
    )}
    {...props}
  >
    {children}
    <Divider
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'right-sidebar-layout-header-divider my-0 border-slate-200',
        stacked ? 'w-full' : '',
      )}
    />
  </div>
);

export const SidebarBody = ({ children, className, ...props }: SectionProps) => (
  <div
    className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-layout-body', 'min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-2 py-2', className)}
    {...props}
  >
    {children}
  </div>
);



export const SidebarFooter = ({ children, className, ...props }: SectionProps) => (
  <div
    className={mergeClassNames(
      DESIGNER_CLASSNAME + 'right-sidebar-layout-footer',
      'flex-none border-t border-slate-200/70 px-2.5 py-2',
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

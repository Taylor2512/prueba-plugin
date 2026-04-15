import React from 'react';
import { Divider } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from '../shared/className.js';

export const SIDEBAR_H_PADDING_PX = 16;
export const SIDEBAR_V_PADDING_PX = 8;
export const SIDEBAR_HEADER_HEIGHT = 60;

type SectionProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};
type SidebarFrameProps = SectionProps & {
  className?: string;
};

export const SidebarFrame = ({ children, className, ...props }: SidebarFrameProps) => (
  <div
    className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-layout-frame', className)}
    {...props}
  >
    {children}
  </div>
);

export const SidebarHeader = ({ children, className, ...props }: SectionProps) => (
  <div
    className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-layout-header', className)}
    {...props}
  >
    {children}
    <Divider className={DESIGNER_CLASSNAME + 'right-sidebar-layout-header-divider'} />
  </div>
);

export const SidebarBody = ({ children, className, ...props }: SectionProps) => (
  <div
    className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-layout-body', className)}
    {...props}
  >
    {children}
  </div>
);



export const SidebarFooter = ({ children, className, ...props }: SectionProps) => (
  <div
    className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-layout-footer', className)}
    {...props}
  >
    {children}
  </div>
);

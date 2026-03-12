import React from 'react';
import { Divider } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from '../shared/className.js';

export const SIDEBAR_H_PADDING_PX = 16;
export const SIDEBAR_V_PADDING_PX = 8;
export const SIDEBAR_HEADER_HEIGHT = 60;

type SectionProps = {
  children: React.ReactNode;
};
type SidebarFrameProps = SectionProps & {
  className?: string;
};

export const SidebarFrame = ({ children, className }: SidebarFrameProps) => (
  <div
    className={mergeClassNames(DESIGNER_CLASSNAME + 'right-sidebar-layout-frame', className)}
  >
    {children}
  </div>
);

export const SidebarHeader = ({ children }: SectionProps) => (
  <div className={DESIGNER_CLASSNAME + 'right-sidebar-layout-header'}>
    {children}
    <Divider className={DESIGNER_CLASSNAME + 'right-sidebar-layout-header-divider'} />
  </div>
);

export const SidebarBody = ({ children }: SectionProps) => (
  <div className={DESIGNER_CLASSNAME + 'right-sidebar-layout-body'}>
    {children}
  </div>
);



export const SidebarFooter = ({ children }: SectionProps) => (
  <div className={DESIGNER_CLASSNAME + 'right-sidebar-layout-footer'}>
    {children}
  </div>
);

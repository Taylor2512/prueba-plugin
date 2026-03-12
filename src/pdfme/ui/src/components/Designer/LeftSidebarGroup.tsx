import React from 'react';
import { Empty } from 'antd';
import { DESIGNER_CLASSNAME } from '../../constants.js';

type LeftSidebarGroupItem = React.ReactNode;

type LeftSidebarGroupProps = {
  category: string;
  items: LeftSidebarGroupItem[];
  count?: number;
  viewMode?: 'compact' | 'rich';
};

export const LeftSidebarGroup = ({ category, items, count, viewMode = 'compact' }: LeftSidebarGroupProps) => (
  <section className={`${DESIGNER_CLASSNAME}left-sidebar-group`}>
    <div className={`${DESIGNER_CLASSNAME}left-sidebar-group-title`}>
      <span className={`${DESIGNER_CLASSNAME}left-sidebar-group-title-label`}>{category}</span>
      <span className={`${DESIGNER_CLASSNAME}left-sidebar-group-title-count`}>
        {typeof count === 'number' ? count : items.length}
      </span>
    </div>
    <div
      className={`${DESIGNER_CLASSNAME}left-sidebar-group-items`}
      data-view-mode={viewMode}
    >
      {items}
    </div>
  </section>
);

type LeftSidebarEmptyStateProps = {
  description: string;
};

export const LeftSidebarEmptyState = ({ description }: LeftSidebarEmptyStateProps) => (
  <div className={`${DESIGNER_CLASSNAME}left-sidebar-empty`}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
  </div>
);

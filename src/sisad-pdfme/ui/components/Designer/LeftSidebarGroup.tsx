import React from 'react';
import { Empty } from 'antd';
import { DESIGNER_CLASSNAME } from '../../constants.js';

type LeftSidebarGroupItem = React.ReactNode;

type LeftSidebarGroupProps = {
  category: string;
  items: LeftSidebarGroupItem[];
  count?: number;
  viewMode?: 'compact' | 'rich';
  collapsed?: boolean;
  collapsible?: boolean;
  onToggle?: () => void;
};

export const LeftSidebarGroup = ({
  category,
  items,
  count,
  viewMode = 'rich',
  collapsed = true,
  collapsible = true,
  onToggle,
}: LeftSidebarGroupProps) => {
  const titleContent = (
    <>
      <span className={`${DESIGNER_CLASSNAME}left-sidebar-group-title-label`}>{category}</span>
      <span className={`${DESIGNER_CLASSNAME}left-sidebar-group-title-count`}>
        {typeof count === 'number' ? count : items.length}
      </span>
    </>
  );

  return (
    <section className={`${DESIGNER_CLASSNAME}left-sidebar-group`}>
      {collapsible ? (
        <button
          type="button"
          className={`${DESIGNER_CLASSNAME}left-sidebar-group-title`}
          data-collapsed={collapsed ? 'true' : 'false'}
          aria-expanded={!collapsed}
          aria-label={`Alternar categoría ${category}`}
          onClick={onToggle}
        >
          {titleContent}
        </button>
      ) : (
        <div className={`${DESIGNER_CLASSNAME}left-sidebar-group-title`} data-collapsed={collapsed ? 'true' : 'false'}>
          {titleContent}
        </div>
      )}
      <div
        className={`${DESIGNER_CLASSNAME}left-sidebar-group-items`}
        data-view-mode={viewMode}
        data-collapsed={collapsed ? 'true' : 'false'}
      >
        {items}
      </div>
    </section>
  );
};

type LeftSidebarEmptyStateProps = {
  description: string;
};

export const LeftSidebarEmptyState = ({ description }: LeftSidebarEmptyStateProps) => (
  <div className={`${DESIGNER_CLASSNAME}left-sidebar-empty`}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} />
  </div>
);

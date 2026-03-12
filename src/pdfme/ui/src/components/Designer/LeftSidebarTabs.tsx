import React from 'react';
import { Tooltip } from 'antd';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeUniqueClassNames } from './shared/className.js';

export type LeftSidebarTab = 'standard' | 'custom' | 'prefill';
export type SidebarTabOption = { id: LeftSidebarTab; label: string };

type LeftSidebarTabsProps = {
  tabs: SidebarTabOption[];
  activeTab: LeftSidebarTab;
  onChangeTab: (tab: LeftSidebarTab) => void;
  renderTabIcon: (tab: LeftSidebarTab) => React.ReactNode;
};

const LeftSidebarTabs = ({
  tabs,
  activeTab,
  onChangeTab,
  renderTabIcon,
}: LeftSidebarTabsProps) => (
  <ul
    className={`${DESIGNER_CLASSNAME}left-sidebar-tablist`}
    role="tablist"
    aria-orientation="horizontal"
    aria-label="Tipos de campo">
    {tabs.map((tab) => (
      <li key={tab.id} role="none" className={`${DESIGNER_CLASSNAME}left-sidebar-tab`}>
        <Tooltip title={tab.label} placement="bottom">
          <button
            type="button"
            id={tab.label.toLowerCase().replace(/\s+/g, '-')}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={mergeUniqueClassNames(
              `${DESIGNER_CLASSNAME}left-sidebar-tab-btn`,
              activeTab === tab.id ? `${DESIGNER_CLASSNAME}left-sidebar-tab-btn-active` : '',
            )}
            onClick={() => onChangeTab(tab.id)}
          >
            {renderTabIcon(tab.id)}
            <span className={`${DESIGNER_CLASSNAME}left-sidebar-tab-label`}>
              {tab.label}
            </span>
          </button>
        </Tooltip>
      </li>
    ))}
  </ul>
);

export default LeftSidebarTabs;

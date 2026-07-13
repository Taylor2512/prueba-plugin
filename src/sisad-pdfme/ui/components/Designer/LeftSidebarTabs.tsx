import React from 'react';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeUniqueClassNames } from './shared/className.js';

export type LeftSidebarTab = 'standard' | 'custom' | 'prefill';
export type SidebarTabOption = { id: LeftSidebarTab; label: string; badge?: number };

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
    className={mergeUniqueClassNames(
      `${DESIGNER_CLASSNAME}left-sidebar-tablist`,
      'flex items-stretch gap-1 overflow-x-auto rounded-2xl border border-slate-200/70 bg-slate-50/90 p-0.5 shadow-sm',
    )}
    role="tablist"
    aria-orientation="horizontal"
    aria-label="Tipos de campo">
    {tabs.map((tab) => (
      <li key={tab.id} role="none" className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-tab`, 'flex')}>
        <button
          type="button"
          id={tab.label.toLowerCase().replace(/\s+/g, '-')}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-label={tab.label}
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-tab-btn`,
            'group inline-flex min-w-0 items-center gap-1.5 rounded-xl border border-transparent px-2 py-[0.3125rem] text-[0.72rem] font-semibold text-slate-600 transition',
            'hover:border-slate-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
            activeTab === tab.id ? `${DESIGNER_CLASSNAME}left-sidebar-tab-btn-active` : '',
            activeTab === tab.id ? 'border-sky-200 bg-white text-sky-700 shadow-sm shadow-sky-100' : '',
          )}
          onClick={() => onChangeTab(tab.id)}
        >
          {renderTabIcon(tab.id)}
          <span className={mergeUniqueClassNames(`${DESIGNER_CLASSNAME}left-sidebar-tab-label`, 'whitespace-nowrap')}>
            {tab.label}
          </span>
          {typeof tab.badge === 'number' && (
            <span className={mergeUniqueClassNames(
              `${DESIGNER_CLASSNAME}left-sidebar-tab-badge`,
              'inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[8px] font-bold transition-colors',
              activeTab === tab.id ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-slate-600'
            )}>
              {tab.badge}
            </span>
          )}
        </button>
      </li>
    ))}
  </ul>
);

export default LeftSidebarTabs;

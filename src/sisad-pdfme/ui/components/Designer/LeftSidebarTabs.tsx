import React from 'react';
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
      'flex w-full min-w-0 items-center gap-[0.125rem] overflow-hidden rounded-[0.75rem] border border-[var(--border-subtle)] bg-[var(--color-gray-100-60)] p-[0.125rem]',
    )}
    role="tablist"
    aria-orientation="horizontal"
    aria-label="Tipos de campo">
    {tabs.map((tab) => (
      <li key={tab.id} role="none" className="flex-1 min-w-0">
        <button
          type="button"
          id={tab.label.toLowerCase().replace(/\s+/g, '-')}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-label={tab.label}
          className={mergeUniqueClassNames(
            'group relative inline-flex h-[1.875rem] w-full min-w-0 items-center justify-center gap-1.5 rounded-[0.625rem] border border-transparent bg-transparent px-2 text-[0.72rem] font-semibold text-[var(--color-gray-500)] cursor-pointer transition-[background,color,border-color,box-shadow]',
            'hover:border-[var(--color-border-20)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
            activeTab === tab.id
              ? 'border-[var(--color-border-14)] bg-[var(--color-bg-elevated)] text-[var(--color-primary)] shadow-[0_1px_3px_var(--color-gray-900-05),_inset_0_1px_0_var(--color-white-80)] after:absolute after:bottom-[3px] after:left-[25%] after:right-[25%] after:h-[2px] after:rounded-[1px] after:bg-[var(--color-primary)] after:content-[\'\']'
              : '',
          )}
          onClick={() => onChangeTab(tab.id)}
        >
          <span className="inline-flex items-center justify-center [&>svg]:h-4 [&>svg]:w-4 [&>svg]:transition-transform group-hover:[&>svg]:scale-110">
            {renderTabIcon(tab.id)}
          </span>
          <span className="hidden whitespace-nowrap">
            {tab.label}
          </span>
          {typeof tab.badge === 'number' && (
            <span
              className={mergeUniqueClassNames(
                'inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[8px] font-bold transition-colors',
                activeTab === tab.id
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300 group-hover:text-slate-600',
              )}
            >
              {tab.badge}
            </span>
          )}
        </button>
      </li>
    ))}
  </ul>
);

export default LeftSidebarTabs;

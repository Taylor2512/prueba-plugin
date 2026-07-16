import React from 'react';
import { DESIGNER_CLASSNAME } from '../../constants.js';
import { mergeUniqueClassNames } from './shared/className.js';

export type LeftSidebarTab = 'standard' | 'custom' | 'prefill';
export type SidebarTabOption = { id: LeftSidebarTab; label: string; badge?: number };

const TAB_LABELS: Record<LeftSidebarTab, { full: string; rail: string }> = {
  standard: { full: 'Estándar', rail: 'Base' },
  custom: { full: 'Custom', rail: 'Custom' },
  prefill: { full: 'Prefill', rail: 'Auto' },
};

type LeftSidebarTabsProps = {
  tabs: SidebarTabOption[];
  activeTab: LeftSidebarTab;
  onChangeTab: (tab: LeftSidebarTab) => void;
  renderTabIcon: (tab: LeftSidebarTab) => React.ReactNode;
  density?: 'comfortable' | 'compact' | 'minimal';
};

const LeftSidebarTabs = ({
  tabs,
  activeTab,
  onChangeTab,
  renderTabIcon,
  density = 'comfortable',
}: LeftSidebarTabsProps) => {
  const useRailLabel = density !== 'comfortable';

  return (
  <ul
    className={mergeUniqueClassNames(
      `${DESIGNER_CLASSNAME}left-sidebar-tablist`,
      'grid w-full min-w-0 grid-cols-3 gap-1 overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-50/90 p-1 shadow-sm',
    )}
    role="tablist"
    aria-orientation="horizontal"
    aria-label="Tipos de campo">
    {tabs.map((tab) => (
      <li key={tab.id} role="none" className="min-w-0">
        <button
          type="button"
          id={tab.label.toLowerCase().replace(/\s+/g, '-')}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-label={tab.label}
          className={mergeUniqueClassNames(
            `${DESIGNER_CLASSNAME}left-sidebar-tab-btn`,
            'group relative inline-flex min-h-[2.05rem] w-full min-w-0 flex-col items-center justify-center gap-[0.1rem] rounded-[0.85rem] border border-transparent bg-transparent px-1 py-[0.28rem] text-slate-500 cursor-pointer transition-[background,color,border-color,box-shadow,transform] duration-150 hover:border-slate-200 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-1 focus-visible:ring-offset-slate-50',
            density === 'comfortable' ? 'text-[0.56rem]' : 'min-h-[1.95rem] gap-0 px-0.5 py-[0.22rem] text-[0.5rem]',
            activeTab === tab.id
              ? 'border-sky-200 bg-white text-sky-700 shadow-sm ring-1 ring-sky-100 after:absolute after:bottom-[3px] after:left-[25%] after:right-[25%] after:h-[2px] after:rounded-[1px] after:bg-sky-500 after:content-[\'\']'
              : '',
          )}
          onClick={() => onChangeTab(tab.id)}
        >
          <span className="inline-flex items-center justify-center [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:transition-transform group-hover:[&>svg]:scale-110">
            {renderTabIcon(tab.id)}
          </span>
          <span className={density !== 'minimal' ? 'block max-w-full px-0.5 text-center font-semibold leading-[1.02]' : 'sr-only'}>
            <span className="block truncate">
              {useRailLabel ? TAB_LABELS[tab.id].rail : TAB_LABELS[tab.id].full}
            </span>
          </span>
          {typeof tab.badge === 'number' && (
            <span
              className={mergeUniqueClassNames(
                `${DESIGNER_CLASSNAME}left-sidebar-tab-badge`,
                'absolute right-1 top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full px-1 text-[8px] font-bold transition-colors',
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
};

export default LeftSidebarTabs;

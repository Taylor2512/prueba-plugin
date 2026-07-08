import React from 'react';
import { Tag, Typography } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';

const { Text } = Typography;

const EMPTY_BADGES: SidebarSurfaceBadge[] = [];

export type SidebarSurfaceBadge = {
  key?: React.Key;
  label: React.ReactNode;
  color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' | 'cyan' | 'purple';
  tooltip?: string;
};

type SidebarSurfaceHeaderProps = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  badges?: SidebarSurfaceBadge[];
  className?: string;
  compact?: boolean;
};

export const SidebarSurfaceHeader = ({
  title,
  subtitle,
  leading,
  trailing,
  badges = EMPTY_BADGES,
  className,
  compact = false,
}: SidebarSurfaceHeaderProps) => {
  return (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'sidebar-surface-header',
        'flex items-start justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white/92 px-3 py-3 shadow-sm',
        compact ? DESIGNER_CLASSNAME + 'sidebar-surface-header-compact' : '',
        className,
      )}
    >
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-header-main', 'min-w-0 flex-1')}>
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-header-copy', 'min-w-0 space-y-1')}>
          <Text strong className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-header-title', 'block truncate text-sm font-semibold text-slate-900')}>
            {title}
          </Text>
          {subtitle ? (
            <Text
              type="secondary"
              className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-header-subtitle', 'block truncate text-xs text-slate-500')}
            >
              {subtitle}
            </Text>
          ) : null}
          {badges.length > 0 ? (
            <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-header-badges', 'mt-1 flex flex-wrap gap-1.5')}>
              {badges.map((badge, index) => (
                <Tag
                  key={badge.key ?? badge.tooltip ?? String(badge.label) ?? index}
                  color={badge.color}
                  title={badge.tooltip}
                  className="m-0 rounded-full border-slate-200 px-2 py-0.5 text-[11px] leading-5"
                >
                  {badge.label}
                </Tag>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {trailing ? (
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-header-trailing', 'flex flex-none items-center gap-2')}>
          {trailing}
        </div>
      ) : null}
    </div>
  );
};

type SidebarSurfaceEmptyStateProps = {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export const SidebarSurfaceEmptyState = ({
  icon,
  title,
  description,
  action,
  className,
}: SidebarSurfaceEmptyStateProps) => {
  return (
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-empty', 'rounded-2xl', className)}>
      {icon ? <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-empty-icon', 'text-slate-400')}>{icon}</div> : null}
      <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-empty-copy', 'space-y-1')}>
        <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-empty-title', 'text-sm font-semibold text-slate-800')}>{title}</div>
        {description ? (
          <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-empty-description', 'text-xs leading-5 text-slate-500')}>
            {description}
          </div>
        ) : null}
      </div>
      {action ? <div className={DESIGNER_CLASSNAME + 'sidebar-surface-empty-action'}>{action}</div> : null}
    </div>
  );
};

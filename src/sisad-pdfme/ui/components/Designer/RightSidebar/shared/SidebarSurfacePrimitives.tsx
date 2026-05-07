import React from 'react';
import { Tag, Typography } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { mergeClassNames } from '../../shared/className.js';

const { Text } = Typography;

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
  badges = [],
  className,
  compact = false,
}: SidebarSurfaceHeaderProps) => {
  return (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'sidebar-surface-header',
        compact ? DESIGNER_CLASSNAME + 'sidebar-surface-header-compact' : '',
        className,
      )}
    >
      <div className={DESIGNER_CLASSNAME + 'sidebar-surface-header-main'}>
        {leading ? <div className={DESIGNER_CLASSNAME + 'sidebar-surface-header-leading'}>{leading}</div> : null}
        <div className={DESIGNER_CLASSNAME + 'sidebar-surface-header-copy'}>
          <Text strong className={DESIGNER_CLASSNAME + 'sidebar-surface-header-title'}>
            {title}
          </Text>
          {subtitle ? (
            <Text type="secondary" className={DESIGNER_CLASSNAME + 'sidebar-surface-header-subtitle'}>
              {subtitle}
            </Text>
          ) : null}
          {badges.length > 0 ? (
            <div className={DESIGNER_CLASSNAME + 'sidebar-surface-header-badges'}>
              {badges.map((badge, index) => (
                <Tag
                  key={badge.key ?? badge.tooltip ?? String(badge.label) ?? index}
                  color={badge.color}
                  title={badge.tooltip}
                >
                  {badge.label}
                </Tag>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      {trailing ? <div className={DESIGNER_CLASSNAME + 'sidebar-surface-header-trailing'}>{trailing}</div> : null}
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
    <div className={mergeClassNames(DESIGNER_CLASSNAME + 'sidebar-surface-empty', className)}>
      {icon ? <div className={DESIGNER_CLASSNAME + 'sidebar-surface-empty-icon'}>{icon}</div> : null}
      <div className={DESIGNER_CLASSNAME + 'sidebar-surface-empty-copy'}>
        <div className={DESIGNER_CLASSNAME + 'sidebar-surface-empty-title'}>{title}</div>
        {description ? <div className={DESIGNER_CLASSNAME + 'sidebar-surface-empty-description'}>{description}</div> : null}
      </div>
      {action ? <div className={DESIGNER_CLASSNAME + 'sidebar-surface-empty-action'}>{action}</div> : null}
    </div>
  );
};

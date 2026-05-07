import React from 'react';
import { Button, Tag } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

export type InspectorTag = {
  key?: React.Key;
  label: string;
  color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' | 'cyan' | 'purple';
};

type InspectorTagListProps = {
  tags?: InspectorTag[];
  classNameSuffix?: string;
  maxVisible?: number;
  overflowLabel?: string;
  overflowTooltip?: string;
};

const EMPTY_TAGS: InspectorTag[] = [];

export const InspectorTagList = ({
  tags = EMPTY_TAGS,
  classNameSuffix = 'inspector-tag-list',
  maxVisible,
  overflowLabel = '+',
  overflowTooltip,
}: InspectorTagListProps) => {
  const visibleTags = typeof maxVisible === 'number' ? tags.slice(0, maxVisible) : tags;
  const overflowCount = typeof maxVisible === 'number' ? Math.max(0, tags.length - maxVisible) : 0;

  return (
    <div className={`${DESIGNER_CLASSNAME}${classNameSuffix}`}>
      {visibleTags.map((tag, index) => (
        <Tag key={tag.key ?? tag.label ?? index} color={tag.color}>
          {tag.label}
        </Tag>
      ))}
      {overflowCount > 0 ? (
        <Tag color="default" title={overflowTooltip}>
          {overflowLabel}
          {overflowCount}
        </Tag>
      ) : null}
    </div>
  );
};

type InspectorAction = {
  key?: React.Key;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
};

type InspectorActionRowProps = {
  actions?: InspectorAction[];
  classNameSuffix?: string;
};

const EMPTY_ACTIONS: InspectorAction[] = [];

export const InspectorActionRow = ({
  actions = EMPTY_ACTIONS,
  classNameSuffix = 'inspector-action-row',
}: InspectorActionRowProps) => {
  if (actions.length === 0) return null;

  return (
    <div className={`${DESIGNER_CLASSNAME}${classNameSuffix}`}>
      {actions.map((action) => (
        <Button
          key={action.key ?? action.label}
          size="small"
          type={action.type || 'default'}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

type InspectorMetric = {
  key?: React.Key;
  label: string;
  value: React.ReactNode;
};

type InspectorMetricRowProps = {
  metrics?: InspectorMetric[];
  classNameSuffix?: string;
};

const EMPTY_METRICS: InspectorMetric[] = [];

export const InspectorMetricRow = ({
  metrics = EMPTY_METRICS,
  classNameSuffix = 'inspector-metric-row',
}: InspectorMetricRowProps) => {
  if (metrics.length === 0) return null;

  return (
    <div className={`${DESIGNER_CLASSNAME}${classNameSuffix}`}>
      {metrics.map((metric) => (
        <div key={metric.key ?? metric.label} className={`${DESIGNER_CLASSNAME}inspector-metric-chip`}>
          <span className={`${DESIGNER_CLASSNAME}inspector-metric-label`}>{metric.label}</span>
          <span className={`${DESIGNER_CLASSNAME}inspector-metric-value`}>{metric.value}</span>
        </div>
      ))}
    </div>
  );
};

type InspectorSummaryCardProps = {
  title: string;
  description?: string;
  tags?: InspectorTag[];
  metrics?: InspectorMetric[];
  actions?: InspectorAction[];
  children?: React.ReactNode;
  classNameSuffix?: string;
};

export const InspectorSummaryCard = ({
  title,
  description,
  tags,
  metrics,
  actions,
  children,
  classNameSuffix = 'inspector-summary-card',
}: InspectorSummaryCardProps) => {
  return (
    <div className={`${DESIGNER_CLASSNAME}${classNameSuffix}`}>
      <div className={`${DESIGNER_CLASSNAME}inspector-summary-card-head`}>
        <div className={`${DESIGNER_CLASSNAME}inspector-summary-card-copy`}>
          <div className={`${DESIGNER_CLASSNAME}inspector-summary-card-title`}>{title}</div>
          {description ? <div className={`${DESIGNER_CLASSNAME}inspector-summary-card-description`}>{description}</div> : null}
        </div>
        {tags && tags.length > 0 ? <InspectorTagList tags={tags} classNameSuffix="inspector-summary-card-tags" /> : null}
      </div>
      {metrics && metrics.length > 0 ? <InspectorMetricRow metrics={metrics} /> : null}
      {actions && actions.length > 0 ? <InspectorActionRow actions={actions} /> : null}
      {children}
    </div>
  );
};

type InspectorEmptyStateProps = {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  classNameSuffix?: string;
};

export const InspectorEmptyState = ({
  icon,
  label,
  description,
  classNameSuffix = 'inspector-empty-state',
}: InspectorEmptyStateProps) => {
  return (
    <div className={`${DESIGNER_CLASSNAME}${classNameSuffix}`}>
      {icon ? <div className={`${DESIGNER_CLASSNAME}inspector-empty-state-icon`}>{icon}</div> : null}
      <div className={`${DESIGNER_CLASSNAME}inspector-empty-state-label`}>{label}</div>
      {description ? <div className={`${DESIGNER_CLASSNAME}inspector-empty-state-description`}>{description}</div> : null}
    </div>
  );
};

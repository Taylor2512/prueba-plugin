import React from 'react';
import { Button, Tag } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { useResponsiveDensity } from '../../shared/useResponsiveDensity.js';
import { mergeClassNames } from '../../shared/className.js';

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
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}${classNameSuffix}`, 'flex flex-wrap items-center gap-1.5')}>
      {visibleTags.map((tag, index) => (
        <Tag
          key={tag.key ?? tag.label ?? index}
          color={tag.color}
          className="m-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700"
        >
          {tag.label}
        </Tag>
      ))}
      {overflowCount > 0 ? (
        <Tag
          color="default"
          title={overflowTooltip}
          className="m-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
        >
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
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}${classNameSuffix}`, 'flex flex-wrap gap-2')}>
      {actions.map((action) => (
        <Button
          key={action.key ?? action.label}
          size="small"
          type={action.type || 'default'}
          onClick={action.onClick}
          disabled={action.disabled}
          className="inline-flex items-center justify-center rounded-full border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
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
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}${classNameSuffix}`, 'grid grid-cols-2 gap-2')}>
      {metrics.map((metric) => (
        <div
          key={metric.key ?? metric.label}
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}inspector-metric-chip`,
            'rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm',
          )}
        >
          <span className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-metric-label`, 'block text-[11px] uppercase tracking-[0.14em] text-slate-500')}>
            {metric.label}
          </span>
          <span className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-metric-value`, 'block text-sm font-semibold text-slate-900')}>
            {metric.value}
          </span>
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
  const summaryCardRef = React.useRef<HTMLDivElement | null>(null);
  const { mode: inspectorDensity } = useResponsiveDensity(summaryCardRef, {
    comfortable: 360,
    compact: 286,
    mini: 234,
  });
  const visibleTagCount = inspectorDensity === 'mini' ? 1 : inspectorDensity === 'compact' ? 2 : undefined;

  return (
    <div
      ref={summaryCardRef}
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}${classNameSuffix}`,
        'space-y-3 rounded-2xl border border-slate-200/80 bg-white/90 p-3 shadow-sm backdrop-blur-sm',
      )}
      data-inspector-density={inspectorDensity}
    >
      <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-head`, 'flex items-start justify-between gap-3')}>
        <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-copy`, 'min-w-0 space-y-1')}>
          <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-title`, 'text-sm font-semibold text-slate-900')}>
            {title}
          </div>
          {description ? <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-description`, 'text-xs leading-5 text-slate-500')}>{description}</div> : null}
        </div>
        {tags && tags.length > 0 ? (
          <InspectorTagList
            tags={tags}
            classNameSuffix="inspector-summary-card-tags"
            maxVisible={visibleTagCount}
            overflowTooltip="Etiquetas adicionales"
          />
        ) : null}
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
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}${classNameSuffix}`, 'flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-center')}>
      {icon ? <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-empty-state-icon`, 'text-slate-400')}>{icon}</div> : null}
      <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-empty-state-label`, 'text-sm font-semibold text-slate-800')}>{label}</div>
      {description ? <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-empty-state-description`, 'text-xs leading-5 text-slate-500')}>{description}</div> : null}
    </div>
  );
};

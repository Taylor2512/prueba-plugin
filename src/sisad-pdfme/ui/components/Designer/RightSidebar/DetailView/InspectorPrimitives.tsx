/**
 * InspectorPrimitives — componentes pequeños reutilizables del inspector.
 *
 * Agrupa tags, filas de acciones, métricas, tarjetas resumen, switches y estados
 * vacíos. Estos primitives permiten mantener widgets complejos consistentes sin
 * duplicar markup ni clases del sistema SISAD PDFME.
 */
import React from 'react';
import { Button, Switch, Tag } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import { useResponsiveDensity } from '../../shared/useResponsiveDensity.js';
import { mergeClassNames } from '../../shared/className.js';
import { stopInspectorPointerEvent } from './inspectorInteractionGuards.js';

/** Tag visual pequeño usado por tarjetas y headers del inspector. */
export type InspectorTag = {
  key?: React.Key;
  label: string;
  color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' | 'cyan' | 'purple';
};

/** Props para renderizar listas compactas de tags. */
type InspectorTagListProps = {
  tags?: InspectorTag[];
  classNameSuffix?: string;
  maxVisible?: number;
  overflowLabel?: string;
  overflowTooltip?: string;
};

const EMPTY_TAGS: InspectorTag[] = [];

/**
 * Renderiza tags con soporte de overflow `+N`.
 */
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
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}${classNameSuffix}`, 'flex flex-wrap items-center gap-1')}>
      {visibleTags.map((tag, index) => (
        <Tag
          key={tag.key ?? tag.label ?? index}
          color={tag.color}
          className="m-0 inline-flex h-[1.1rem] items-center rounded-full border border-slate-200 bg-white px-[0.3125rem] text-[8px] font-medium leading-none text-slate-700"
        >
          {tag.label}
        </Tag>
      ))}
      {overflowCount > 0 ? (
        <Tag
          color="default"
          title={overflowTooltip}
          className="m-0 inline-flex h-[1.1rem] items-center rounded-full border border-slate-200 bg-slate-50 px-[0.3125rem] text-[8px] font-semibold leading-none text-slate-600"
        >
          {overflowLabel}
          {overflowCount}
        </Tag>
      ) : null}
    </div>
  );
};

/** Acción renderizable en filas compactas del inspector. */
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

/** Renderiza una fila de acciones compactas. */
export const InspectorActionRow = ({
  actions = EMPTY_ACTIONS,
  classNameSuffix = 'inspector-action-row',
}: InspectorActionRowProps) => {
  if (actions.length === 0) return null;

  return (
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}${classNameSuffix}`, 'flex flex-wrap gap-1')}>
      {actions.map((action) => (
        <Button
          key={action.key ?? action.label}
          size="small"
          type={action.type || 'default'}
          onClick={action.onClick}
          onPointerDown={stopInspectorPointerEvent}
          disabled={action.disabled}
          className="inline-flex h-[1.4rem] items-center justify-center rounded-lg border-slate-200 bg-white px-1.5 text-[0.62rem] font-semibold text-slate-700 shadow-none transition hover:border-slate-300 hover:bg-slate-50"
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

/** Métrica label/value mostrada como chip. */
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

/** Renderiza una grilla de métricas compactas. */
export const InspectorMetricRow = ({
  metrics = EMPTY_METRICS,
  classNameSuffix = 'inspector-metric-row',
}: InspectorMetricRowProps) => {
  if (metrics.length === 0) return null;

  return (
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}${classNameSuffix}`, 'grid grid-cols-2 gap-0.5')}>
      {metrics.map((metric) => (
        <div
          key={metric.key ?? metric.label}
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}inspector-metric-chip`,
            'rounded-lg border border-slate-200 bg-white px-1 py-[0.125rem] shadow-none',
          )}
        >
          <span className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-metric-label`, 'block text-[7px] uppercase tracking-wider text-slate-500')}>
            {metric.label}
          </span>
          <span className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-metric-value`, 'block text-[0.58rem] font-semibold text-slate-900')}>
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );
};

/** Props de tarjeta resumen reutilizable del inspector. */
type InspectorSummaryCardProps = {
  title: string;
  description?: string;
  tags?: InspectorTag[];
  metrics?: InspectorMetric[];
  actions?: InspectorAction[];
  children?: React.ReactNode;
  classNameSuffix?: string;
};

/**
 * Tarjeta resumen responsiva con tags, métricas, acciones y contenido opcional.
 */
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
        'space-y-0.5 rounded-lg border border-slate-200/80 bg-white/90 p-[0.1875rem] shadow-none backdrop-blur-sm',
      )}
      data-inspector-density={inspectorDensity}
    >
      <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-head`, 'flex items-start justify-between gap-1')}>
        <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-copy`, 'min-w-0 flex-1 space-y-0')}>
          <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-title`, 'truncate text-[0.6rem] font-semibold leading-tight text-slate-800')}>
            {title}
          </div>
          {description ? (
            <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-description`, 'truncate text-[0.56rem] leading-tight text-slate-500')}>
              {description}
            </div>
          ) : null}
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

/** Props del switch booleano compatible con form-render. */
type BooleanSwitchWidgetProps = {
  value: unknown;
  onChange?: (nextValue: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
};

/** Normaliza valores variados a booleano para el switch. */
const normalizeBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (!normalized) return false;
    return ['true', '1', 'yes', 'y', 'on', 'checked'].includes(normalized);
  }
  return Boolean(value);
};

/**
 * Switch booleano controlado con estado interno sincronizado.
 */
export const BooleanSwitchWidget = ({
  value,
  onChange,
  disabled,
  readOnly,
  checkedLabel,
  uncheckedLabel,
}: BooleanSwitchWidgetProps) => {
  const checked = normalizeBoolean(value);
  const [internalChecked, setInternalChecked] = React.useState(checked);

  React.useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  const commit = (nextChecked: boolean) => {
    setInternalChecked(nextChecked);
    onChange?.(nextChecked);
  };

  return (
    <span
      data-sisad-inspector-interactive="true"
      data-selecto-ignore="true"
      data-moveable-ignore="true"
      data-canvas-drop-ignore="true"
    >
      <Switch
        checked={internalChecked}
        disabled={disabled || readOnly}
        onChange={(next) => commit(Boolean(next))}
        onClick={(next) => commit(Boolean(next))}
      />
      {checkedLabel || uncheckedLabel ? (
        <span className="sr-only">{internalChecked ? checkedLabel || 'Activado' : uncheckedLabel || 'Desactivado'}</span>
      ) : null}
    </span>
  );
};

/** Props del estado vacío visual del inspector. */
type InspectorEmptyStateProps = {
  icon?: React.ReactNode;
  label: string;
  description?: string;
  classNameSuffix?: string;
};

/** Renderiza un estado vacío consistente para widgets del inspector. */
export const InspectorEmptyState = ({
  icon,
  label,
  description,
  classNameSuffix = 'inspector-empty-state',
}: InspectorEmptyStateProps) => {
  return (
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}${classNameSuffix}`, 'flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-center')}>
      {icon ? <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-empty-state-icon`, 'text-slate-400')}>{icon}</div> : null}
      <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-empty-state-label`, 'text-[0.62rem] font-semibold text-slate-800')}>{label}</div>
      {description ? <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-empty-state-description`, 'text-[0.58rem] leading-4 text-slate-500')}>{description}</div> : null}
    </div>
  );
};

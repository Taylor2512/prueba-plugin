/**
 * InspectorPrimitives — componentes pequeños reutilizables del inspector.
 *
 * Agrupa tags, filas de acciones, métricas, tarjetas resumen, switches y estados
 * vacíos. Estos primitives permiten mantener widgets complejos consistentes sin
 * duplicar markup ni clases del sistema SISAD PDFME.
 */
import React from 'react';
import { Button, Tag } from 'antd';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { useResponsiveDensity } from '@sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { stopInspectorPointerEvent } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards';
import { InspectorBooleanSwitch } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorBooleanSwitch';

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
          className="m-0 inline-flex h-[1.08rem] items-center rounded-full border border-slate-200/70 bg-white px-[0.375rem] text-[8px] font-medium leading-none text-slate-700"
        >
          {tag.label}
        </Tag>
      ))}
      {overflowCount > 0 ? (
        <Tag
          color="default"
          title={overflowTooltip}
          className="m-0 inline-flex h-[1.08rem] items-center rounded-full border border-slate-200/70 bg-slate-50 px-[0.375rem] text-[8px] font-semibold leading-none text-slate-600"
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
  density?: 'comfortable' | 'compact' | 'minimal';
};

const EMPTY_ACTIONS: InspectorAction[] = [];

/** Renderiza una fila de acciones compactas. */
export const InspectorActionRow = ({
  actions = EMPTY_ACTIONS,
  classNameSuffix = 'inspector-action-row',
  density = 'comfortable',
}: InspectorActionRowProps) => {
  if (actions.length === 0) return null;

  return (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}${classNameSuffix}`,
        'flex flex-wrap gap-1',
        density === 'minimal' ? 'items-start justify-start' : '',
      )}
    >
      {actions.map((action) => (
        <Button
          key={action.key ?? action.label}
          size="small"
          type={action.type || 'default'}
          onClick={action.onClick}
          onPointerDown={stopInspectorPointerEvent}
          onMouseDown={stopInspectorPointerEvent}
          disabled={action.disabled}
          className={mergeClassNames(
            'inline-flex appearance-none items-center justify-center rounded-lg border border-slate-200/70 bg-white px-1.5 text-[0.62rem] font-semibold text-slate-700 shadow-none transition hover:border-slate-300 hover:bg-slate-50',
            density === 'minimal' ? 'h-[1.45rem] px-[0.35rem] text-[0.68rem]' : 'h-6',
          )}
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
  density?: 'comfortable' | 'compact' | 'minimal';
};

const EMPTY_METRICS: InspectorMetric[] = [];

/** Renderiza una grilla de métricas compactas. */
export const InspectorMetricRow = ({
  metrics = EMPTY_METRICS,
  classNameSuffix = 'inspector-metric-row',
  density = 'comfortable',
}: InspectorMetricRowProps) => {
  if (metrics.length === 0) return null;

  return (
    <div
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}${classNameSuffix}`,
        'grid gap-1',
        density === 'minimal' ? 'grid-cols-1' : 'grid-cols-2',
      )}
    >
      {metrics.map((metric) => (
        <div
          key={metric.key ?? metric.label}
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}inspector-metric-chip`,
            'inline-flex items-center gap-[0.2rem] rounded-full border border-slate-200/70 bg-white/95 px-2 py-[0.35rem] shadow-[0_1px_3px_rgba(15,23,42,0.04)] min-w-0',
            density === 'minimal' ? 'px-[0.35rem] py-[0.22rem]' : '',
          )}
        >
          <span className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-metric-label`, 'block overflow-hidden whitespace-nowrap text-[7px] uppercase tracking-wider text-slate-500 text-ellipsis')}>
            {metric.label}
          </span>
          <span className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-metric-value`, 'block overflow-hidden whitespace-nowrap text-[0.64rem] font-semibold text-slate-900 text-ellipsis')}>
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
    comfortable: 390,
    compact: 318,
    minimal: 256,
  });
  // Normalize 'full' to 'comfortable' for inspector consumers which only accept
  // 'comfortable' | 'compact' | 'minimal'. This avoids narrowing issues when the
  // hook returns 'full' for wide containers.
  const inspectorDensityNormalized: 'comfortable' | 'compact' | 'minimal' =
    inspectorDensity === 'full' ? 'comfortable' : inspectorDensity;

  const visibleTagCount = inspectorDensityNormalized === 'minimal' ? 1 : inspectorDensityNormalized === 'compact' ? 2 : undefined;

  return (
    <div
      ref={summaryCardRef}
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}${classNameSuffix}`,
        'flex min-w-0 flex-col gap-[0.35rem] rounded-[1rem] border border-slate-200/70 bg-white/96 p-2 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-sm',
      )}
      data-inspector-density={inspectorDensity}
    >
      <div
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}inspector-summary-card-head`,
          'flex min-w-0 items-start justify-between gap-1.5',
          inspectorDensity === 'minimal' ? 'flex-col items-stretch' : '',
        )}
      >
        <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-copy`, 'min-w-0 flex-1 space-y-0')}>
          <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-title`, 'truncate text-[0.68rem] font-semibold leading-tight text-slate-800')}>
            {title}
          </div>
          {description ? (
            <div className={mergeClassNames(`${DESIGNER_CLASSNAME}inspector-summary-card-description`, 'truncate text-[0.6rem] leading-tight text-slate-500')}>
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
      {metrics && metrics.length > 0 ? <InspectorMetricRow metrics={metrics} density={inspectorDensityNormalized} /> : null}
      {actions && actions.length > 0 ? <InspectorActionRow actions={actions} density={inspectorDensityNormalized} /> : null}
      {children}
    </div>
  );
};

/** Props del switch booleano compatible con form-render. */
type BooleanSwitchWidgetProps = {
  value: unknown;
  onChange?: (_nextValue: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  checkedLabel?: string;
  uncheckedLabel?: string;
  disabledReason?: string;
  testId?: string;
  'aria-label'?: string;
};

/**
 * Adaptador de `InspectorBooleanSwitch` a la firma `value/onChange`.
 *
 * No implementa comportamiento propio: la lógica del switch vive en la
 * primitive única para que no reaparezcan estado local duplicado ni un segundo
 * handler de commit.
 */
export const BooleanSwitchWidget = ({
  value,
  onChange,
  disabled,
  readOnly,
  checkedLabel,
  uncheckedLabel,
  disabledReason,
  testId,
  'aria-label': ariaLabel,
}: BooleanSwitchWidgetProps) => (
  <InspectorBooleanSwitch
    checked={value}
    onChange={onChange}
    disabled={disabled}
    readOnly={readOnly}
    checkedLabel={checkedLabel}
    uncheckedLabel={uncheckedLabel}
    disabledReason={disabledReason}
    testId={testId}
    aria-label={ariaLabel}
  />
);

// `MinimalSelect` vivía aquí como placeholder no-op: un componente exportado que
// devolvía `null` a propósito, con un comentario que remitía a `FormSelect`. Sin
// consumidores, y peligroso si alguno hubiera aparecido —habría renderizado nada
// en silencio—. `FormSelect` es la única autoridad de select del inspector.

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

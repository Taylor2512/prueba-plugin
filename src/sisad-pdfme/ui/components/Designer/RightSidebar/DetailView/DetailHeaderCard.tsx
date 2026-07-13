/**
 * DetailHeaderCard — resumen superior del schema activo en el inspector.
 *
 * Muestra nombre, tipo, estado, destinatario, posición y acción de regreso con
 * densidad responsiva. Consume helpers puros de metadata para evitar duplicar
 * reglas visuales dentro del componente React.
 */
import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { Badge, Tag, Tooltip } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { resolveSchemaTone } from '../../shared/schemaTone.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import type { SchemaDesignerConfig } from '../../../../designerEngine.js';
import { SidebarSurfaceHeader } from '../shared/SidebarSurfacePrimitives.js';
import type { InspectorTag } from './InspectorPrimitives.js';
import { useResponsiveDensity } from '../../shared/useResponsiveDensity.js';
import { buildDetailHeaderSummary } from './detailHeaderUtils.js';
import { mergeClassNames } from '../../shared/className.js';

/**
 * Props del header compacto del DetailView.
 */
type DetailHeaderCardProps = {
  activeSchema: SchemaForUI;
  schemaConfig?: SchemaDesignerConfig | null;
  title?: React.ReactNode;
  typeLabel?: React.ReactNode;
  positionLabel?: React.ReactNode;
  tags?: InspectorTag[];
  maxVisibleTags?: number;
  showType?: boolean;
  showPosition?: boolean;
  showStateTags?: boolean;
  overflowTooltip?: string;
  metaTooltip?: string;
  leading?: React.ReactNode;
  className?: string;
  /** When provided, renders a back button as the trailing action. */
  onBack?: () => void;
  backTooltip?: string;
};

/**
 * Renderiza el resumen del schema activo con densidad adaptativa.
 *
 * @param props Metadata del schema, tags y acciones del header.
 * @returns Header visual del inspector.
 */
const DetailHeaderCard = ({
  activeSchema,
  schemaConfig,
  title,
  typeLabel,
  positionLabel,
  tags,
  maxVisibleTags = 1,
  showType = true,
  showPosition = true,
  showStateTags = true,
  overflowTooltip,
  metaTooltip,
  leading,
  className,
  onBack,
  backTooltip = 'Volver a campos',
}: DetailHeaderCardProps) => {
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  const { mode: headerDensity } = useResponsiveDensity(headerRef, {
    comfortable: 342,
    compact: 276,
    mini: 224,
    initialWidth: 342,
  });
  const tone = resolveSchemaTone(activeSchema, '#7c3aed');
  const headerSummary = buildDetailHeaderSummary(activeSchema, schemaConfig);
  // Recipient color takes precedence over schema tone for the leading badge
  const leadingColor = headerSummary.recipientColor || tone;
  const effectiveTags = tags || headerSummary.tags;
  const adaptiveMaxVisibleTags =
    headerDensity === 'mini' ? Math.min(1, maxVisibleTags) : headerDensity === 'compact' ? Math.min(2, maxVisibleTags) : maxVisibleTags;
  const resolvedShowStateTags = showStateTags;
  const resolvedShowPosition = showPosition;
  const visibleTags = resolvedShowStateTags ? effectiveTags.slice(0, adaptiveMaxVisibleTags) : [];
  const overflowCount = resolvedShowStateTags ? Math.max(0, effectiveTags.length - adaptiveMaxVisibleTags) : 0;
  const resolvedOverflowTooltip = overflowTooltip || metaTooltip || headerSummary.overflowTooltip;
  const resolvedSubtitle = showType
    ? [typeLabel || headerSummary.schemaType, headerSummary.contextLabel].filter(Boolean).join(' · ')
    : headerSummary.contextLabel || (positionLabel || headerSummary.positionLabel);

  const backBtn = onBack ? (
    <Tooltip title={backTooltip} placement="right">
      <button
        type="button"
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}detail-header-back-btn`,
          'inline-flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-none transition',
          'hover:border-sky-200 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
        )}
        onClick={onBack}
        aria-label={backTooltip}
      >
        <ArrowLeft strokeWidth={1.5} size={14} />
      </button>
    </Tooltip>
  ) : null;

  const trailingNode = (
    <>
      {resolvedShowPosition && (
        <Tag
          color="default"
          className={mergeClassNames(`${DESIGNER_CLASSNAME}detail-header-card-pos`, 'm-0 inline-flex h-[0.9rem] items-center rounded-full border-slate-200 px-[0.2rem] text-[7px] leading-none')}
        >
          {positionLabel || headerSummary.positionLabel}
        </Tag>
      )}
      {backBtn}
    </>
  );

  return (
    <div
      ref={headerRef}
      data-detail-header-density={headerDensity}
      data-testid="detail-header-card"
      data-schema-owner-color={headerSummary.recipientColor || undefined}
      style={{ '--schema-owner-color': leadingColor } as React.CSSProperties}
    >
      <SidebarSurfaceHeader
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}detail-header-card`,
          'rounded-lg border-slate-200/60 bg-white/92 shadow-none',
          className,
        )}
        compact
        leading={leading || <Badge color={leadingColor} />}
        title={title || headerSummary.schemaName}
        subtitle={resolvedSubtitle || (resolvedShowPosition ? (positionLabel || headerSummary.positionLabel) : undefined)}
        badges={
          resolvedShowStateTags
            ? [
                ...visibleTags.map((tag, index) => ({
                  key: tag.key || `${String(tag.label)}-${String(tag.color ?? 'default')}-${index}`,
                  label: tag.label,
                  color: tag.color,
                  tooltip: resolvedOverflowTooltip,
                })),
                ...(overflowCount > 0
                  ? [{ key: 'overflow', label: `+${overflowCount}`, color: 'default' as const, tooltip: resolvedOverflowTooltip }]
                  : []),
              ]
            : []
        }
        trailing={trailingNode}
      />
      {headerDensity === 'comfortable' && (headerSummary.uid || headerSummary.ownerName) && (
        <div className={mergeClassNames(`${DESIGNER_CLASSNAME}detail-header-tech-row`, 'mt-[0.125rem] flex items-center gap-1.5 border-t border-slate-100 px-2 pt-[0.125rem]')}>
          {headerSummary.uid && (
            <span className="inline-flex items-center text-[6px] font-mono text-slate-400">
              ID: {headerSummary.uid}
            </span>
          )}
          {headerSummary.ownerName && (
            <span className="inline-flex items-center gap-1 text-[6px] font-medium text-slate-500">
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              {headerSummary.ownerName}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailHeaderCard;

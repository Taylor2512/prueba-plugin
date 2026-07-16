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
  selectionCount?: number;
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
  selectionCount,
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
    comfortable: 390,
    compact: 318,
    minimal: 256,
    initialWidth: 320,
  });
  const tone = resolveSchemaTone(activeSchema, '#7c3aed');
  const headerSummary = buildDetailHeaderSummary(activeSchema, schemaConfig);
  // Recipient color takes precedence over schema tone for the leading badge
  const leadingColor = headerSummary.recipientColor || tone;
  const effectiveTags = tags || headerSummary.tags;
  const adaptiveMaxVisibleTags =
    headerDensity === 'minimal' ? Math.min(1, maxVisibleTags) : headerDensity === 'compact' ? Math.min(2, maxVisibleTags) : maxVisibleTags;
  const resolvedShowStateTags = showStateTags;
  const resolvedShowPosition = showPosition;
  const visibleTags = resolvedShowStateTags ? effectiveTags.slice(0, adaptiveMaxVisibleTags) : [];
  const overflowCount = resolvedShowStateTags ? Math.max(0, effectiveTags.length - adaptiveMaxVisibleTags) : 0;
  const resolvedOverflowTooltip = overflowTooltip || metaTooltip || headerSummary.overflowTooltip;
  const selectionTag =
    typeof selectionCount === 'number' && selectionCount > 0
      ? { label: selectionCount === 1 ? '1 seleccionado' : `${selectionCount} seleccionados`, color: 'processing' as const }
      : null;
  const showDenseMeta = headerDensity === 'comfortable';
  const showSubtitle = headerDensity !== 'minimal';
  const resolvedSubtitle = showType
    ? [typeLabel || headerSummary.schemaType, headerSummary.contextLabel].filter(Boolean).join(' · ')
    : headerSummary.contextLabel || (positionLabel || headerSummary.positionLabel);

  const backBtn = onBack ? (
      <Tooltip title={backTooltip} placement="right">
        <button
          type="button"
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}detail-header-back-btn`,
            'inline-flex h-7 w-7 appearance-none items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition',
            'hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/55',
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
          className={mergeClassNames(
            `${DESIGNER_CLASSNAME}detail-header-card-pos`,
            'm-0 inline-flex h-[1rem] items-center rounded-full border border-slate-200/70 bg-white px-1.5 text-[7px] leading-none text-slate-600',
          )}
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
      data-testid="detail-header-card"
      data-schema-owner-color={headerSummary.recipientColor || undefined}
      style={{ '--schema-owner-color': leadingColor } as React.CSSProperties}
    >
      <SidebarSurfaceHeader
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}detail-header-card`,
          'relative overflow-hidden rounded-[1rem] border-slate-200/70 bg-white/96 shadow-[0_1px_3px_rgba(15,23,42,0.04)] backdrop-blur-[4px] py-1.5',
          className,
        )}
        leading={leading || <Badge color={leadingColor} />}
        title={title || headerSummary.schemaName}
        subtitle={showSubtitle ? (resolvedSubtitle || (resolvedShowPosition ? (positionLabel || headerSummary.positionLabel) : undefined)) : undefined}
        badges={
          resolvedShowStateTags
            ? [
                ...(selectionTag ? [selectionTag] : []),
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
        trailing={showSubtitle ? trailingNode : undefined}
      />
      {showDenseMeta && (headerSummary.uid || headerSummary.ownerName) && (
        <div className={mergeClassNames(`${DESIGNER_CLASSNAME}detail-header-tech-row`, 'mt-0.5 flex flex-wrap items-center gap-1 px-2.5 pb-1 pt-1')}>
          {headerSummary.uid && (
            <span className="inline-flex items-center rounded-full border border-slate-200/70 bg-slate-50 px-1.5 py-[0.0625rem] font-mono text-[6px] text-slate-500">
              ID: {headerSummary.uid}
            </span>
          )}
          {headerSummary.ownerName && (
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/70 bg-white px-1.5 py-[0.0625rem] text-[6px] font-medium text-slate-500">
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

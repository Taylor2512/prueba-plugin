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

const DetailHeaderCard = ({
  activeSchema,
  schemaConfig,
  title,
  typeLabel,
  positionLabel,
  tags,
  maxVisibleTags = 3,
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
    comfortable: 350,
    compact: 286,
    mini: 232,
    initialWidth: 350,
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

  const backBtn = onBack ? (
    <Tooltip title={backTooltip} placement="right">
      <button
        type="button"
        className={`${DESIGNER_CLASSNAME}detail-header-back-btn`}
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
        <Tag color="default" className={`${DESIGNER_CLASSNAME}detail-header-card-pos`}>
          {positionLabel || headerSummary.positionLabel}
        </Tag>
      )}
      {backBtn}
    </>
  );

  return (
    <div ref={headerRef} data-detail-header-density={headerDensity}>
      <SidebarSurfaceHeader
        className={[`${DESIGNER_CLASSNAME}detail-header-card`, className].filter(Boolean).join(' ')}
        compact
        leading={leading || <Badge color={leadingColor} />}
        title={title || headerSummary.schemaName}
        subtitle={showType ? (typeLabel || headerSummary.schemaType) : resolvedShowPosition ? (positionLabel || headerSummary.positionLabel) : undefined}
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
    </div>
  );
};

export default DetailHeaderCard;

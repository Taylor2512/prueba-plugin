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

type StateTag = { label: string; color: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' };

/** Build the short metadata tooltip shown on the "+N" overflow indicator. */
const buildMetaTooltip = (
  activeSchema: SchemaForUI,
  schemaConfig: SchemaDesignerConfig | null | undefined,
): string => {
  const lines: string[] = [];
  const uid =
    typeof activeSchema.schemaUid === 'string' && activeSchema.schemaUid.trim()
      ? activeSchema.schemaUid.trim()
      : String(activeSchema.id || '').slice(0, 8);
  if (uid) lines.push(`UID: ${uid}`);
  const createdBy = typeof activeSchema.createdBy === 'string' ? activeSchema.createdBy.trim() : '';
  const modifiedBy = typeof activeSchema.lastModifiedBy === 'string' ? activeSchema.lastModifiedBy.trim() : '';
  if (createdBy) lines.push(`Creado por: ${createdBy}`);
  if (modifiedBy) lines.push(`Modificado: ${modifiedBy}`);
  if (activeSchema.ownerRecipientId) lines.push(`Owner: ${activeSchema.ownerRecipientId}`);
  if (activeSchema.state) lines.push(`Estado: ${activeSchema.state}`);
  if (activeSchema.ownerMode) lines.push(`Modo: ${activeSchema.ownerMode}`);
  if (activeSchema.saveValue === false) lines.push('No guarda valor');
  if (schemaConfig?.persistence?.enabled) lines.push('Persistencia activa');
  if (schemaConfig?.api?.enabled) lines.push('API activa');
  if (schemaConfig?.form?.enabled) lines.push('Form JSON activo');
  if (schemaConfig?.prefill?.enabled) lines.push('Prefill activo');
  const commentCount = activeSchema.commentsCount || activeSchema.comments?.length || 0;
  const anchorCount = activeSchema.commentAnchors?.length || activeSchema.commentsAnchors?.length || 0;
  if (commentCount > 0) lines.push(`Comentarios: ${commentCount}`);
  if (anchorCount > 0) lines.push(`Anchors: ${anchorCount}`);
  return lines.join('\n') || 'Sin metadatos adicionales';
};

export const buildDetailHeaderSummary = (
  activeSchema: SchemaForUI,
  schemaConfig: SchemaDesignerConfig | null | undefined,
): { tags: InspectorTag[]; overflowTooltip: string; positionLabel: string; schemaName: string; schemaType: string; recipientColor: string | null } => {
  const schemaName = typeof activeSchema.name === 'string' ? activeSchema.name : 'Campo';
  const schemaType = typeof activeSchema.type === 'string' ? activeSchema.type : 'schema';
  const schemaHidden = (activeSchema as SchemaForUI & { hidden?: boolean }).hidden === true;
  const ownerLabel =
    typeof activeSchema.ownerRecipientName === 'string' && activeSchema.ownerRecipientName.trim()
      ? activeSchema.ownerRecipientName.trim()
      : typeof activeSchema.ownerRecipientId === 'string' && activeSchema.ownerRecipientId.trim()
        ? activeSchema.ownerRecipientId.trim()
        : '';
  const recipientColor =
    typeof activeSchema.ownerColor === 'string' && activeSchema.ownerColor.trim()
      ? activeSchema.ownerColor.trim()
      : typeof (activeSchema as SchemaForUI & { userColor?: string }).userColor === 'string'
        ? ((activeSchema as SchemaForUI & { userColor?: string }).userColor ?? null)
        : null;

  const stateTags: StateTag[] = [];
  if (!schemaName.trim()) stateTags.push({ label: 'Sin nombre', color: 'warning' });
  if (activeSchema.required) stateTags.push({ label: 'Requerido', color: 'error' });
  if (activeSchema.readOnly) stateTags.push({ label: 'Solo lectura', color: 'gold' });
  if (schemaHidden) stateTags.push({ label: 'Oculto', color: 'default' });
  // Show recipient as a tag (color shown via Badge leading element)
  if (ownerLabel) stateTags.push({ label: ownerLabel, color: 'processing' });

  const posX = Number((activeSchema.position?.x ?? 0).toFixed(1));
  const posY = Number((activeSchema.position?.y ?? 0).toFixed(1));

  return {
    tags: stateTags,
    overflowTooltip: buildMetaTooltip(activeSchema, schemaConfig),
    positionLabel: `${posX},${posY}`,
    schemaName,
    schemaType,
    recipientColor,
  };
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
  });
  const tone = resolveSchemaTone(activeSchema, '#7c3aed');
  const headerSummary = buildDetailHeaderSummary(activeSchema, schemaConfig);
  // Recipient color takes precedence over schema tone for the leading badge
  const leadingColor = headerSummary.recipientColor || tone;
  const effectiveTags = tags || headerSummary.tags;
  const adaptiveMaxVisibleTags =
    headerDensity === 'mini' ? 0 : headerDensity === 'compact' ? Math.min(1, maxVisibleTags) : Math.min(2, maxVisibleTags);
  const resolvedShowStateTags = showStateTags && headerDensity !== 'mini';
  const resolvedShowPosition = showPosition && headerDensity !== 'mini';
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

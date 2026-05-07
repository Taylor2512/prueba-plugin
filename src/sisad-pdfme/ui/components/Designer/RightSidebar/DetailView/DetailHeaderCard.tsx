import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { Badge, Tag, Tooltip } from 'antd';
import { resolveSchemaTone } from '../../shared/schemaTone.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import type { SchemaDesignerConfig } from '../../../../designerEngine.js';
import { InspectorTagList, type InspectorTag } from './InspectorPrimitives.js';

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
};

type StateTag = { label: string; color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' };

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
): { tags: InspectorTag[]; overflowTooltip: string; positionLabel: string; schemaName: string; schemaType: string } => {
  const schemaName = typeof activeSchema.name === 'string' ? activeSchema.name : 'Campo';
  const schemaType = typeof activeSchema.type === 'string' ? activeSchema.type : 'schema';
  const schemaHidden = (activeSchema as SchemaForUI & { hidden?: boolean }).hidden === true;

  const stateTags: StateTag[] = [
    !schemaName.trim() ? { label: 'Sin nombre', color: 'warning' } : null,
    activeSchema.required ? { label: 'Requerido', color: 'error' } : null,
    activeSchema.readOnly ? { label: 'Solo lectura', color: 'gold' } : null,
    schemaHidden ? { label: 'Oculto', color: 'default' } : null,
  ].filter((t): t is StateTag => Boolean(t));

  const posX = Number((activeSchema.position?.x ?? 0).toFixed(1));
  const posY = Number((activeSchema.position?.y ?? 0).toFixed(1));

  return {
    tags: stateTags,
    overflowTooltip: buildMetaTooltip(activeSchema, schemaConfig),
    positionLabel: `${posX},${posY}`,
    schemaName,
    schemaType,
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
}: DetailHeaderCardProps) => {
  const tone = resolveSchemaTone(activeSchema, '#7c3aed');
  const headerSummary = buildDetailHeaderSummary(activeSchema, schemaConfig);
  const effectiveTags = tags || headerSummary.tags;
  const visibleTags = showStateTags ? effectiveTags.slice(0, maxVisibleTags) : [];
  const overflowCount = showStateTags ? Math.max(0, effectiveTags.length - maxVisibleTags) : 0;
  const resolvedOverflowTooltip = overflowTooltip || metaTooltip || headerSummary.overflowTooltip;

  return (
    <div className={[DESIGNER_CLASSNAME + 'detail-header-card', className].filter(Boolean).join(' ')}>
      {/* ── Identity row ── */}
      <div className={DESIGNER_CLASSNAME + 'detail-header-card-head'}>
        {leading || <Badge color={tone} />}
        <div className={DESIGNER_CLASSNAME + 'detail-header-card-title-wrap'}>
          <Tooltip title={typeof title === 'string' ? title : headerSummary.schemaName} placement="topLeft">
            <span className={DESIGNER_CLASSNAME + 'detail-header-card-title'}>
              {title || headerSummary.schemaName}
            </span>
          </Tooltip>
          {showType ? (
            <Tooltip title={`Tipo: ${headerSummary.schemaType}`}>
              <Tag color="default" className={DESIGNER_CLASSNAME + 'detail-header-card-tag-base'}>
                {typeLabel || headerSummary.schemaType}
              </Tag>
            </Tooltip>
          ) : null}
        </div>
        {/* ── Compact position stat ── */}
        {showPosition ? (
          <Tooltip title={`Posición X/Y: ${headerSummary.positionLabel} mm`} placement="topRight">
            <span className={DESIGNER_CLASSNAME + 'detail-header-card-pos'}>
              {positionLabel || headerSummary.positionLabel}
            </span>
          </Tooltip>
        ) : null}
      </div>

      {/* ── State tags row (progressive disclosure: max 3 + overflow badge) ── */}
      {visibleTags.length > 0 || overflowCount > 0 ? (
        <div className={DESIGNER_CLASSNAME + 'detail-header-card-state-row'}>
          <InspectorTagList
            tags={visibleTags}
            classNameSuffix="detail-header-card-state-tags"
            overflowTooltip={resolvedOverflowTooltip}
          />
          {overflowCount > 0 ? (
            <Tooltip title={resolvedOverflowTooltip} styles={{ root: { whiteSpace: 'pre-line', maxWidth: 260 } }}>
              <Tag color="default" className={DESIGNER_CLASSNAME + 'detail-header-card-state-tag is-overflow'}>
                +{overflowCount}
              </Tag>
            </Tooltip>
          ) : null}
          {/* When all tags fit inline, still show a compact metadata anchor. */}
          {(() => {
            const shouldShowMetadataBadge = overflowCount === 0 && visibleTags.length > 0;
            if (!shouldShowMetadataBadge) return null;
            return (
              <Tooltip title={resolvedOverflowTooltip} styles={{ root: { whiteSpace: 'pre-line', maxWidth: 260 } }}>
                <Tag color="default" className={DESIGNER_CLASSNAME + 'detail-header-card-state-tag is-overflow'}>
                  ···
                </Tag>
              </Tooltip>
            );
          })()}
        </div>
      ) : null}
    </div>
  );
};

export default DetailHeaderCard;

import React from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { Badge, Tag, Tooltip } from 'antd';
import { resolveSchemaTone } from '../../shared/schemaTone.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import type { SchemaDesignerConfig } from '../../../../designerEngine.js';

type DetailHeaderCardProps = {
  activeSchema: SchemaForUI;
  schemaConfig?: SchemaDesignerConfig | null;
};

const DetailHeaderCard = ({
  activeSchema,
  schemaConfig,
}: DetailHeaderCardProps) => {
  const tone = resolveSchemaTone(activeSchema, '#7c3aed');
  const schemaName = typeof activeSchema.name === 'string' ? activeSchema.name : 'Campo';
  const schemaType = typeof activeSchema.type === 'string' ? activeSchema.type : 'schema';
  const schemaHidden = (activeSchema as SchemaForUI & { hidden?: boolean }).hidden === true;
  const schemaUid =
    typeof activeSchema.schemaUid === 'string' && activeSchema.schemaUid.trim()
      ? activeSchema.schemaUid.trim()
      : String(activeSchema.id || '').trim();
  const createdBy = typeof activeSchema.createdBy === 'string' ? activeSchema.createdBy.trim() : '';
  const lastModifiedBy =
    typeof activeSchema.lastModifiedBy === 'string' ? activeSchema.lastModifiedBy.trim() : '';
  const commentCount = activeSchema.commentsCount || activeSchema.comments?.length || 0;
  const anchorCount = activeSchema.commentAnchors?.length || activeSchema.commentsAnchors?.length || 0;
  const configTags = [
    schemaConfig?.persistence?.enabled ? { label: 'Guardar', color: 'processing' as const } : null,
    schemaConfig?.api?.enabled ? { label: 'API', color: 'blue' as const } : null,
    schemaConfig?.form?.enabled ? { label: 'Form JSON', color: 'success' as const } : null,
    schemaConfig?.prefill?.enabled ? { label: 'Prefill', color: 'gold' as const } : null,
  ].filter(Boolean) as Array<{ label: string; color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' }>;
  const collaborationTags = [
    schemaUid ? { label: `UID: ${schemaUid}` } : null,
    createdBy ? { label: `Creado por: ${createdBy}` } : null,
    lastModifiedBy ? { label: `Modificado por: ${lastModifiedBy}` } : null,
    activeSchema.ownerRecipientId ? { label: `Owner: ${activeSchema.ownerRecipientId}` } : null,
    activeSchema.fileId || activeSchema.fileTemplateId
      ? { label: `Archivo: ${activeSchema.fileId || activeSchema.fileTemplateId}` }
      : null,
    activeSchema.state ? { label: `Estado: ${activeSchema.state}` } : null,
    activeSchema.ownerMode ? { label: `OwnerMode: ${activeSchema.ownerMode}` } : null,
    activeSchema.saveValue === false ? { label: 'No guarda valor' } : null,
    commentCount > 0 ? { label: `Comentarios: ${commentCount}` } : null,
    anchorCount > 0 ? { label: `Anchors: ${anchorCount}` } : null,
  ].filter(Boolean) as Array<{ label: string }>;
  const visibleCollaborationTags = collaborationTags.slice(0, 4);
  const hiddenCollaborationTagCount = Math.max(0, collaborationTags.length - visibleCollaborationTags.length);
  const visibleStats = [
    { label: 'X', value: activeSchema.position?.x ?? 0 },
    { label: 'Y', value: activeSchema.position?.y ?? 0 },
  ];

  const summaryTags = [
    schemaName.trim() ? null : { label: 'Sin nombre', color: 'warning' as const },
    activeSchema.required ? { label: 'Requerido', color: 'error' as const } : null,
    activeSchema.readOnly ? { label: 'Solo lectura', color: 'gold' as const } : null,
    schemaHidden ? { label: 'Oculto', color: 'default' as const } : null,
    ...configTags.slice(0, 2),
  ].filter((tag): tag is { label: string; color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' } => Boolean(tag));

  return (
    <div className={DESIGNER_CLASSNAME + 'detail-header-card'}>
      <div className={DESIGNER_CLASSNAME + 'detail-header-card-head'}>
        <Badge color={tone} />
        <div className={DESIGNER_CLASSNAME + 'detail-header-card-title-wrap'}>
          <Tooltip title={schemaName}>
            <span className={DESIGNER_CLASSNAME + 'detail-header-card-title'}>
              {schemaName}
            </span>
          </Tooltip>
          <div className={DESIGNER_CLASSNAME + 'detail-header-card-meta'}>
            <Tooltip title={`Tipo: ${schemaType}`}>
              <Tag color="default" className={DESIGNER_CLASSNAME + 'detail-header-card-tag-base'}>
                {schemaType}
              </Tag>
            </Tooltip>
          </div>
        </div>
      </div>
      {summaryTags.length > 0 ? (
        <div className={DESIGNER_CLASSNAME + 'detail-header-card-state-row'}>
          {summaryTags.map((tag) => (
            <Tag
              key={tag.label}
              color={tag.color || 'default'}
              className={DESIGNER_CLASSNAME + 'detail-header-card-state-tag'}
            >
              {tag.label}
            </Tag>
          ))}
        </div>
      ) : null}
      {visibleCollaborationTags.length > 0 ? (
        <div className={DESIGNER_CLASSNAME + 'detail-header-card-state-row'}>
          {visibleCollaborationTags.map((tag) => (
            <Tag key={tag.label} color="default" className={DESIGNER_CLASSNAME + 'detail-header-card-state-tag'}>
              {tag.label}
            </Tag>
          ))}
          {hiddenCollaborationTagCount > 0 ? (
            <Tag color="default" className={DESIGNER_CLASSNAME + 'detail-header-card-state-tag'}>
              +{hiddenCollaborationTagCount} más
            </Tag>
          ) : null}
        </div>
      ) : null}
      <div className={DESIGNER_CLASSNAME + 'detail-header-card-stats'}>
        {visibleStats.map((item) => (
          <div key={item.label} className={DESIGNER_CLASSNAME + 'detail-header-card-stat'}>
            <Tooltip title={`${item.label}: ${item.value}`}>
              <div className={DESIGNER_CLASSNAME + 'detail-header-card-stat-value'}>{item.value}</div>
            </Tooltip>
            <div className={DESIGNER_CLASSNAME + 'detail-header-card-stat-label'}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailHeaderCard;

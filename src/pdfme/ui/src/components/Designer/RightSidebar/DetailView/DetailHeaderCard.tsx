import React from 'react';
import type { SchemaForUI } from '@pdfme/common';
import { Badge, Tag, Tooltip } from 'antd';
import { resolveSchemaTone } from '../../shared/schemaTone.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

type DetailHeaderCardProps = {
  activeSchema: SchemaForUI;
  configTags?: Array<{ label: string; color?: 'default' | 'processing' | 'success' | 'warning' | 'error' | 'gold' | 'blue' }>;
};

const EMPTY_CONFIG_TAGS: NonNullable<DetailHeaderCardProps['configTags']> = [];

const DetailHeaderCard = ({ activeSchema, configTags = EMPTY_CONFIG_TAGS }: DetailHeaderCardProps) => {
  const tone = resolveSchemaTone(activeSchema, '#7c3aed');
  const schemaName = typeof activeSchema.name === 'string' ? activeSchema.name : 'Campo';
  const schemaType = typeof activeSchema.type === 'string' ? activeSchema.type : 'schema';
  const schemaHidden = (activeSchema as SchemaForUI & { hidden?: boolean }).hidden === true;
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

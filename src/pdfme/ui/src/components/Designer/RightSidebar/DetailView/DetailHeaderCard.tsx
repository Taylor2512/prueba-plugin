import React from 'react';
import type { SchemaForUI } from '@pdfme/common';
import { Badge, Tag, Tooltip } from 'antd';
import { resolveSchemaTone } from '../../shared/schemaTone.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';

type DetailHeaderCardProps = {
  activeSchema: SchemaForUI;
};

const DetailHeaderCard = ({ activeSchema }: DetailHeaderCardProps) => {
  const tone = resolveSchemaTone(activeSchema, '#7c3aed');
  const schemaName = typeof activeSchema.name === 'string' ? activeSchema.name : 'Campo';
  const schemaType = typeof activeSchema.type === 'string' ? activeSchema.type : 'schema';

  return (
    <div className={DESIGNER_CLASSNAME + 'detail-header-card'}>
      <div className={DESIGNER_CLASSNAME + 'detail-header-card-head'}>
        <Badge color={tone} />
        <Tooltip title={schemaName}>
          <span className={DESIGNER_CLASSNAME + 'detail-header-card-title'}>
            {schemaName}
          </span>
        </Tooltip>
        <Tooltip title={`Tipo: ${schemaType}`}>
          <Tag color="default" className={DESIGNER_CLASSNAME + 'detail-header-card-tag-base'}>
            {schemaType}
          </Tag>
        </Tooltip>
        {activeSchema.required ? (
          <Tag color="error" className={DESIGNER_CLASSNAME + 'detail-header-card-tag'}>
            Requerido
          </Tag>
        ) : null}
        {activeSchema.readOnly ? (
          <Tag color="gold" className={DESIGNER_CLASSNAME + 'detail-header-card-tag'}>
            Solo lectura
          </Tag>
        ) : null}
      </div>
      <div className={DESIGNER_CLASSNAME + 'detail-header-card-stats'}>
        {[
          { label: 'X', value: activeSchema.position?.x ?? 0 },
          { label: 'Y', value: activeSchema.position?.y ?? 0 },
          { label: 'Ancho', value: activeSchema.width ?? 0 },
          { label: 'Alto', value: activeSchema.height ?? 0 },
        ].map((item) => (
          <div key={item.label} className={DESIGNER_CLASSNAME + 'detail-header-card-stat'}>
            <div className={DESIGNER_CLASSNAME + 'detail-header-card-stat-label'}>
              {item.label}
            </div>
            <Tooltip title={`${item.label}: ${item.value}`}>
              <div className={DESIGNER_CLASSNAME + 'detail-header-card-stat-value'}>{item.value}</div>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailHeaderCard;

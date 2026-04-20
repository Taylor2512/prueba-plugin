import React, { useMemo } from 'react';
import type { PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { Divider, Input, InputNumber, Select, Space, Tag } from 'antd';
import { Lock, ShieldCheck, Users2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import {
  resolveSchemaCollaborativeMetadata,
  type DesignerEngine,
  type SchemaCollaborativeState,
  type SchemaDesignerConfig,
} from '../../../../designerEngine.js';

type CollaborationWidgetProps = PropPanelWidgetProps & {
  activeSchema: SchemaForUI;
  changeSchemas: (_objs: { key: string; value: unknown; schemaId: string }[]) => void;
  designerEngine?: DesignerEngine;
  schemaConfig?: SchemaDesignerConfig | null;
};

const STATE_OPTIONS: Array<{ label: string; value: SchemaCollaborativeState }> = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Bloqueado', value: 'locked' },
  { label: 'Fusionado', value: 'merged' },
];

const normalizeRecipientIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((entry) => String(entry || '').trim())
          .filter(Boolean),
      ),
    );
  }

  if (typeof value === 'string') {
    return Array.from(
      new Set(
        value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
    );
  }

  return [];
};

const joinRecipientIds = (value: unknown): string => normalizeRecipientIds(value).join(', ');

const buildStateTag = (state?: SchemaCollaborativeState) => {
  if (state === 'locked') return { label: 'Bloqueado', color: 'error' as const };
  if (state === 'merged') return { label: 'Fusionado', color: 'success' as const };
  return { label: 'Borrador', color: 'default' as const };
};

const SchemaCollaborationWidget = (props: CollaborationWidgetProps) => {
  const { activeSchema, changeSchemas, designerEngine } = props;
  const collaborative = useMemo(
    () => resolveSchemaCollaborativeMetadata(activeSchema, designerEngine) || {},
    [activeSchema, designerEngine],
  );

  const schemaUid = collaborative.schemaUid || activeSchema.id;
  const state = collaborative.state || 'draft';
  const ownerRecipientIds = normalizeRecipientIds(
    collaborative.ownerRecipientIds || collaborative.ownerRecipientId || activeSchema.ownerRecipientIds || activeSchema.ownerRecipientId,
  );
  const lock = collaborative.lock || activeSchema.lock || {};
  const stateTag = buildStateTag(state);

  const commit = (patch: Record<string, unknown>) => {
    changeSchemas(
      Object.entries(patch).map(([key, value]) => ({
        key,
        value,
        schemaId: activeSchema.id,
      })),
    );
  };

  const updateRecipientIds = (value: string) => {
    const nextRecipientIds = normalizeRecipientIds(value);
    commit({
      ownerRecipientIds: nextRecipientIds,
      ownerRecipientId: nextRecipientIds[0],
    });
  };

  const updateState = (nextState: SchemaCollaborativeState) => {
    commit({
      state: nextState,
      lock: nextState === 'locked' ? lock || {} : undefined,
    });
  };

  const hasLock = state === 'locked' || Boolean(lock?.lockedBy || lock?.lockedAt || lock?.reason);

  return (
    <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget`}>
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-head`}>
        <div>
          <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`}>Colaboración</div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>
            Identidad estable, propietario y bloqueo del campo para trabajo multiusuario.
          </div>
        </div>
        <Tag color={stateTag.color} icon={<ShieldCheck size={13} />}>
          {stateTag.label}
        </Tag>
      </div>

      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-summary`}>
        <Space size={[6, 6]} wrap>
          <Tag color="default">{schemaUid || 'sin schemaUid'}</Tag>
          <Tag color={ownerRecipientIds.length > 0 ? 'processing' : 'warning'} icon={<Users2 size={12} />}>
            {ownerRecipientIds.length > 0 ? `${ownerRecipientIds.length} owner(s)` : 'Sin owner'}
          </Tag>
          {hasLock ? (
            <Tag color="error" icon={<Lock size={12} />}>
              Bloqueo activo
            </Tag>
          ) : null}
        </Space>
      </div>

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />

      <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>schemaUid</div>
          <Input value={schemaUid || ''} disabled placeholder="UUID estable del campo" />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Archivo</div>
          <Input
            value={String(activeSchema.fileId || activeSchema.fileTemplateId || collaborative.fileId || collaborative.fileTemplateId || '')}
            onChange={(event) => commit({
              fileId: event.target.value || undefined,
              fileTemplateId: event.target.value || undefined,
            })}
            placeholder="file-01"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Página</div>
          <InputNumber
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            min={1}
            value={typeof activeSchema.pageNumber === 'number' ? activeSchema.pageNumber : collaborative.pageNumber}
            onChange={(value) => commit({ pageNumber: typeof value === 'number' ? value : undefined })}
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Estado</div>
          <Select
            value={state}
            options={STATE_OPTIONS}
            onChange={(value) => updateState(value)}
          />
        </div>
      </div>

      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Owner principal</div>
        <Input
          value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || ''}
          onChange={(event) => commit({ ownerRecipientId: event.target.value || undefined })}
          placeholder="recipient-1"
        />
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Co-propietarios</div>
        <Input
          value={joinRecipientIds(ownerRecipientIds)}
          onChange={(event) => updateRecipientIds(event.target.value)}
          placeholder="recipient-1, recipient-2"
        />
      </div>

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />

      <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Creado por</div>
          <Input
            value={activeSchema.createdBy || collaborative.createdBy || ''}
            onChange={(event) => commit({ createdBy: event.target.value || undefined })}
            placeholder="user-1"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Modificado por</div>
          <Input
            value={activeSchema.lastModifiedBy || collaborative.lastModifiedBy || ''}
            onChange={(event) => commit({ lastModifiedBy: event.target.value || undefined })}
            placeholder="user-1"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Creado</div>
          <InputNumber
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            value={typeof activeSchema.createdAt === 'number' ? activeSchema.createdAt : collaborative.createdAt}
            onChange={(value) => commit({ createdAt: typeof value === 'number' ? value : undefined })}
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Actualizado</div>
          <InputNumber
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            value={typeof activeSchema.updatedAt === 'number' ? activeSchema.updatedAt : collaborative.updatedAt}
            onChange={(value) => commit({ updatedAt: typeof value === 'number' ? value : undefined })}
          />
        </div>
      </div>

      {hasLock ? (
        <>
          <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
          <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado por</div>
              <Input
                value={String(lock?.lockedBy || '')}
                onChange={(event) => commit({ lock: { ...(lock || {}), lockedBy: event.target.value || undefined } })}
                placeholder="user-2"
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado en</div>
              <InputNumber
                className={`${DESIGNER_CLASSNAME}schema-config-number`}
                value={typeof lock?.lockedAt === 'number' ? lock.lockedAt : undefined}
                onChange={(value) => commit({ lock: { ...(lock || {}), lockedAt: typeof value === 'number' ? value : undefined } })}
              />
            </div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Motivo</div>
            <Input.TextArea
              value={String(lock?.reason || '')}
              onChange={(event) => commit({ lock: { ...(lock || {}), reason: event.target.value || undefined } })}
              placeholder="Edición concurrente"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SchemaCollaborationWidget;

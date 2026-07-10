import React, { useMemo } from 'react';
import { type PropPanelWidgetProps, type SchemaForUI } from '@sisad-pdfme/common';
import { Collapse, Divider, Input, InputNumber, Select, Space } from 'antd';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import {
  buildEffectiveCollaborationContext,
  resolveSchemaCollaborationState,
} from '../../../../collaborationContext.js';
import {
  resolveSchemaCollaborativeMetadata,
  type DesignerEngine,
  type SchemaCollaborativeLock,
  type SchemaCollaborativeState,
} from '../../../../designerEngine.js';
import { normalizeHexColor } from '../../shared/recipientColor.js';
import CompactConfigPanel from './CompactConfigPanel.js';
import {
  buildStateTag,
  joinRecipientIds,
  normalizeRecipientIds,
  resolveOwnerMode,
} from './schemaCollaborationUtils.js';

export { joinRecipientIds, normalizeRecipientIds, resolveOwnerMode } from './schemaCollaborationUtils.js';

type CollaborationWidgetProps = PropPanelWidgetProps & {
  activeSchema: SchemaForUI;
  changeSchemas: (_objs: { key: string; value: unknown; schemaId: string }[]) => void;
  designerEngine?: DesignerEngine;
  summaryTitle?: string;
  summaryDescription?: string;
  modalTitle?: string;
  modalTriggerLabel?: React.ReactNode;
  quickActionLabel?: React.ReactNode;
};

type CollaborationPatchKey =
  | 'ownerRecipientIds'
  | 'ownerRecipientId'
  | 'recipientId'
  | 'ownerRecipientName'
  | 'ownerColor'
  | 'userColor'
  | 'ownerMode'
  | 'state'
  | 'lock'
  | 'fileId'
  | 'fileTemplateId'
  | 'pageNumber'
  | 'createdBy'
  | 'lastModifiedBy'
  | 'createdAt'
  | 'updatedAt';

const STATE_OPTIONS: Array<{ label: string; value: SchemaCollaborativeState }> = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Bloqueado', value: 'locked' },
  { label: 'Fusionado', value: 'merged' },
];

const resolveStringLabel = (value: React.ReactNode, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback;

const formatTimestampLabel = (value: unknown) => {
  const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : null;
  if (numericValue === null) return '—';
  const normalized = numericValue > 1e12 ? numericValue : numericValue * 1000;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('es-EC', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
};

type CollaborationLockSectionProps = {
  isVisible: boolean;
  lock?: SchemaCollaborativeLock;
  onChangeLock: (patch: Partial<SchemaCollaborativeLock>) => void;
};

const CollaborationLockSection = ({ isVisible, lock, onChangeLock }: CollaborationLockSectionProps) => {
  if (!isVisible) return null;

  return (
    <>
      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
      <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado por</div>
          <Input
            id="collaboration-locked-by"
            name="collaboration-locked-by"
            value={String(lock?.lockedBy || '')}
            onChange={(event) => onChangeLock({ ...lock, lockedBy: event.target.value || undefined })}
            placeholder="user-2"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Fecha de bloqueo</div>
          <InputNumber
            id="collaboration-locked-at"
            name="collaboration-locked-at"
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            value={typeof lock?.lockedAt === 'number' ? lock.lockedAt : undefined}
            onChange={(value) => onChangeLock({ ...lock, lockedAt: typeof value === 'number' ? value : undefined })}
          />
          <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>Fecha: {formatTimestampLabel(lock?.lockedAt)}</div>
        </div>
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Motivo</div>
        <Input.TextArea
          id="collaboration-lock-reason"
          name="collaboration-lock-reason"
          value={String(lock?.reason || '')}
          onChange={(event) => onChangeLock({ ...lock, reason: event.target.value || undefined })}
          placeholder="Edición concurrente"
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      </div>
    </>
  );
};

const SchemaCollaborationWidget = (props: CollaborationWidgetProps) => {
  const { activeSchema, changeSchemas, designerEngine } = props;
  const collaborative = useMemo(
    () => resolveSchemaCollaborativeMetadata(activeSchema, designerEngine) || {},
    [activeSchema, designerEngine],
  );
  const collaborationContext = useMemo(
    () =>
      buildEffectiveCollaborationContext(
        designerEngine?.collaboration,
        String(activeSchema.fileId || collaborative.fileId || activeSchema.fileTemplateId || collaborative.fileTemplateId || '') || null,
      ),
    [
      activeSchema.fileId,
      activeSchema.fileTemplateId,
      collaborative.fileId,
      collaborative.fileTemplateId,
      designerEngine,
    ],
  );

  const schemaUid = collaborative.schemaUid || activeSchema.id;
  const state = collaborative.state || 'draft';
  const ownerRecipientIds = normalizeRecipientIds(
    collaborative.ownerRecipientIds || collaborative.ownerRecipientId || activeSchema.ownerRecipientIds || activeSchema.ownerRecipientId,
  );
  const resolvedSchemaState = resolveSchemaCollaborationState(activeSchema, collaborationContext);
  const ownerMode = collaborative.ownerMode || resolvedSchemaState.ownerMode || resolveOwnerMode(ownerRecipientIds);
  const lock = collaborative.lock || activeSchema.lock;
  const stateTag = buildStateTag(state);
  const recipientOptions = collaborationContext.recipientOptions || [];
  const hasRecipientOptions = recipientOptions.length > 0;
  const recipientSelectOptions = recipientOptions.map((recipient) => ({
    label: recipient.role ? `${recipient.name} · ${recipient.role}` : recipient.name,
    value: recipient.id,
  }));

  const commit = (patch: Partial<Record<CollaborationPatchKey, unknown>>) => {
    changeSchemas(
      Object.entries(patch).map(([key, value]) => ({
        key,
        value,
        schemaId: activeSchema.id,
      })),
    );
  };

  const updateRecipientIds = (value: string[] | string) => {
    const nextRecipientIds = normalizeRecipientIds(value);
    const nextPrimaryRecipientId = nextRecipientIds[0];
    const nextPrimaryRecipient =
      recipientOptions.find((recipient) => recipient.id === nextPrimaryRecipientId) || null;
    const nextPrimaryRecipientColor =
      designerEngine?.extensions?.resolveRecipientColor?.(nextPrimaryRecipient) ||
      normalizeHexColor(nextPrimaryRecipient?.color) ||
      normalizeHexColor(collaborative.ownerColor) ||
      normalizeHexColor(activeSchema.ownerColor) ||
      normalizeHexColor(activeSchema.userColor) ||
      undefined;
    const nextOwnerMode =
      nextRecipientIds.length === 0
        ? undefined
        : nextRecipientIds.length === recipientOptions.length && recipientOptions.length > 1
          ? 'shared'
          : resolveOwnerMode(nextRecipientIds);
    commit({
      ownerRecipientIds: nextRecipientIds,
      ownerRecipientId: nextPrimaryRecipientId,
      recipientId: nextPrimaryRecipientId,
      ownerRecipientName: nextPrimaryRecipient?.name || undefined,
      ownerColor: nextPrimaryRecipientColor,
      userColor: nextPrimaryRecipientColor,
      ownerMode: nextOwnerMode,
    });
  };

  const updateState = (nextState: SchemaCollaborativeState) => {
    commit({
      state: nextState,
      lock: nextState === 'locked' ? { ...lock } : undefined,
    });
  };

  const hasLock = state === 'locked' || Boolean(lock?.lockedBy || lock?.lockedAt || lock?.reason);
  const authorOptions = recipientSelectOptions;
  const resolvedOwnerLabel =
    resolvedSchemaState.ownerRecipientName ||
    collaborationContext.recipientNameMap.get(resolvedSchemaState.ownerRecipientId || '') ||
    'Sin asignar';
  const assignedToLabel = resolvedOwnerLabel === 'Sin asignar' ? '' : resolvedOwnerLabel;
  const resolvedLockedByLabel =
    lock?.lockedBy ? collaborationContext.recipientNameMap.get(lock.lockedBy) || '' : '';
  const stateLabel = hasLock ? 'Bloqueado para edición' : 'Disponible';
  const showLockedByRow = hasLock || Boolean(resolvedLockedByLabel);
  const triggerLabel = assignedToLabel ? 'Gestionar' : 'Asignar';
  const summaryNode = assignedToLabel ? (
    <dl className="grid gap-1.5">
      <div className="grid gap-0.5">
        <dt className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-slate-500">Estado</dt>
        <dd className="text-[0.72rem] font-semibold text-slate-800">{stateLabel}</dd>
      </div>
      <div className="grid gap-0.5">
        <dt className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-slate-500">Asignado a</dt>
        <dd className="text-[0.72rem] font-semibold text-slate-800">{assignedToLabel}</dd>
      </div>
      {showLockedByRow ? (
        <div className="grid gap-0.5">
          <dt className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-slate-500">Bloqueado por</dt>
          <dd className="text-[0.72rem] font-semibold text-slate-800">{resolvedLockedByLabel || assignedToLabel || 'Sin asignación'}</dd>
        </div>
      ) : null}
    </dl>
  ) : (
    <div className="space-y-0.5">
      <div className="text-[0.62rem] font-medium uppercase tracking-[0.08em] text-slate-500">Sin asignación</div>
      <div className="text-[0.68rem] leading-4 text-slate-700">Este campo todavía no tiene responsable.</div>
    </div>
  );

  return (
    <CompactConfigPanel
      title={props.summaryTitle || 'Asignación y bloqueo'}
      description={props.summaryDescription || 'Propietario y acceso.'}
      summary={summaryNode}
      statusTags={[{ label: stateTag.label, color: stateTag.color }]}
      modalTitle={props.modalTitle || 'Gestionar asignación y bloqueo'}
      modalTriggerLabel={resolveStringLabel(props.modalTriggerLabel, triggerLabel)}
    >
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget`}>
        <Collapse
          className={`${DESIGNER_CLASSNAME}schema-config-collapse`}
          ghost
          defaultActiveKey={[]}
          items={[
            {
              key: 'metadata',
              label: (
                <Space size={6} align="center">
                  <span className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`}>Información técnica</span>
                </Space>
              ),
              children: (
                <>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>UID técnico</div>
                      <Input id="collaboration-schema-uid" name="collaboration-schema-uid" value={schemaUid || ''} disabled placeholder="UUID estable del campo" />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Archivo</div>
                      <Input
                        id="collaboration-file"
                        name="collaboration-file"
                        value={String(activeSchema.fileId || activeSchema.fileTemplateId || collaborative.fileId || collaborative.fileTemplateId || '')}
                        onChange={(event) =>
                          commit({
                            fileId: event.target.value || undefined,
                            fileTemplateId: event.target.value || undefined,
                          })
                        }
                        placeholder="file-01"
                      />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Página</div>
                      <InputNumber
                        id="collaboration-page-number"
                        name="collaboration-page-number"
                        className={`${DESIGNER_CLASSNAME}schema-config-number`}
                        min={1}
                        value={typeof activeSchema.pageNumber === 'number' ? activeSchema.pageNumber : collaborative.pageNumber}
                        onChange={(value) => commit({ pageNumber: typeof value === 'number' ? value : undefined })}
                      />
                      <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>Página visible: {typeof activeSchema.pageNumber === 'number' ? activeSchema.pageNumber : collaborative.pageNumber || '—'}</div>
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Estado</div>
                      <Select id="collaboration-state" name="collaboration-state" value={state} options={STATE_OPTIONS} onChange={(value) => updateState(value)} />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Modo de asignación</div>
                      <Input
                        id="collaboration-owner-mode"
                        name="collaboration-owner-mode"
                        value={ownerMode || ''}
                        onChange={(event) => commit({ ownerMode: event.target.value || undefined })}
                        placeholder="único / múltiple / compartido"
                      />
                    </div>
                  </div>

                  {(activeSchema.createdBy || collaborative.createdBy) ? (
                    <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>
                      Autor {String(activeSchema.createdBy || collaborative.createdBy)}
                    </div>
                  ) : null}

                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Propietario</div>
                    {hasRecipientOptions ? (
                      <Select
                        id="collaboration-owner"
                        name="collaboration-owner"
                        value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || undefined}
                        options={recipientSelectOptions}
                        onChange={(value) => updateRecipientIds([value])}
                        placeholder="Selecciona un propietario"
                        allowClear
                        onClear={() => updateRecipientIds([])}
                      />
                    ) : (
                      <Input
                        id="collaboration-owner-raw"
                        name="collaboration-owner-raw"
                        value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || ''}
                        onChange={(event) => commit({ ownerRecipientId: event.target.value || undefined })}
                        placeholder="recipient-1"
                      />
                    )}
                  </div>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Co-propietarios</div>
                    {hasRecipientOptions ? (
                      <Select
                        id="collaboration-coowners"
                        name="collaboration-coowners"
                        mode="multiple"
                        value={ownerRecipientIds}
                        options={recipientSelectOptions}
                        onChange={(value) => updateRecipientIds(value)}
                        placeholder="Selecciona propietarios"
                      />
                    ) : (
                      <Input
                        id="collaboration-coowners-raw"
                        name="collaboration-coowners-raw"
                        value={joinRecipientIds(ownerRecipientIds)}
                        onChange={(event) => updateRecipientIds(event.target.value)}
                        placeholder="recipient-1, recipient-2"
                      />
                    )}
                  </div>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Visible</div>
                    <Input
                      id="collaboration-visible-name"
                      name="collaboration-visible-name"
                      value={resolvedOwnerLabel}
                      onChange={(event) => commit({ ownerRecipientName: event.target.value || undefined })}
                      placeholder="Nombre visible"
                    />
                  </div>

                  <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />

                  <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Creado por</div>
                      {hasRecipientOptions ? (
                        <Select
                          id="collaboration-created-by"
                          name="collaboration-created-by"
                          value={activeSchema.createdBy || collaborative.createdBy || undefined}
                          options={authorOptions}
                          onChange={(value) => {
                            const nextAuthor = recipientOptions.find((recipient) => recipient.id === value) || null;
                            commit({
                              createdBy: value || undefined,
                              userColor: nextAuthor?.color || collaborative.userColor || undefined,
                            });
                          }}
                          placeholder="Selecciona autor"
                          allowClear
                        />
                      ) : (
                        <Input
                          id="collaboration-created-by-raw"
                          name="collaboration-created-by-raw"
                          value={activeSchema.createdBy || collaborative.createdBy || ''}
                          onChange={(event) => commit({ createdBy: event.target.value || undefined })}
                          placeholder="user-1"
                        />
                      )}
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Modificado por</div>
                      {hasRecipientOptions ? (
                        <Select
                          id="collaboration-modified-by"
                          name="collaboration-modified-by"
                          value={activeSchema.lastModifiedBy || collaborative.lastModifiedBy || undefined}
                          options={authorOptions}
                          onChange={(value) => commit({ lastModifiedBy: value || undefined })}
                          placeholder="Selecciona editor"
                          allowClear
                        />
                      ) : (
                        <Input
                          id="collaboration-modified-by-raw"
                          name="collaboration-modified-by-raw"
                          value={activeSchema.lastModifiedBy || collaborative.lastModifiedBy || ''}
                          onChange={(event) => commit({ lastModifiedBy: event.target.value || undefined })}
                          placeholder="user-1"
                        />
                      )}
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Creado el</div>
                      <InputNumber
                        id="collaboration-created-at"
                        name="collaboration-created-at"
                        className={`${DESIGNER_CLASSNAME}schema-config-number`}
                        value={typeof activeSchema.createdAt === 'number' ? activeSchema.createdAt : collaborative.createdAt}
                        onChange={(value) => commit({ createdAt: typeof value === 'number' ? value : undefined })}
                      />
                      <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>Fecha: {formatTimestampLabel(activeSchema.createdAt ?? collaborative.createdAt)}</div>
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Actualizado el</div>
                      <InputNumber
                        id="collaboration-updated-at"
                        name="collaboration-updated-at"
                        className={`${DESIGNER_CLASSNAME}schema-config-number`}
                        value={typeof activeSchema.updatedAt === 'number' ? activeSchema.updatedAt : collaborative.updatedAt}
                        onChange={(value) => commit({ updatedAt: typeof value === 'number' ? value : undefined })}
                      />
                      <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>Fecha: {formatTimestampLabel(activeSchema.updatedAt ?? collaborative.updatedAt)}</div>
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Color del propietario</div>
                      <Input
                        id="collaboration-owner-color"
                        name="collaboration-owner-color"
                        value={activeSchema.ownerColor || collaborative.ownerColor || resolvedSchemaState.ownerColor || ''}
                        onChange={(event) => commit({ ownerColor: event.target.value || undefined })}
                        placeholder="#2563EB"
                      />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Color autor</div>
                      <Input
                        id="collaboration-author-color"
                        name="collaboration-author-color"
                        value={activeSchema.userColor || collaborative.userColor || resolvedSchemaState.userColor || ''}
                        onChange={(event) => commit({ userColor: event.target.value || undefined })}
                        placeholder="#2563EB"
                      />
                    </div>
                  </div>
                </>
              ),
            },
          ]}
        />

        <CollaborationLockSection
          isVisible={hasLock}
          lock={lock}
          onChangeLock={(patch) => commit({ lock: patch })}
        />
      </div>
    </CompactConfigPanel>
  );
};

export default SchemaCollaborationWidget;

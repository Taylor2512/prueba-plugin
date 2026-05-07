import React, { useMemo } from 'react';
import {
  normalizeRecipientIds as normalizeRecipientIdsShared,
  type PropPanelWidgetProps,
  type SchemaForUI,
} from '@sisad-pdfme/common';
import { Button, Collapse, Divider, Input, InputNumber, Select, Space } from 'antd';
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
import CompactConfigPanel from './CompactConfigPanel.js';
import { InspectorSummaryCard } from './InspectorPrimitives.js';

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

const STATE_OPTIONS: Array<{ label: string; value: SchemaCollaborativeState }> = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Bloqueado', value: 'locked' },
  { label: 'Fusionado', value: 'merged' },
];

export { normalizeRecipientIds } from '@sisad-pdfme/common';

export const joinRecipientIds = (value: unknown): string =>
  normalizeRecipientIdsShared(value as string[] | string | null | undefined).join(', ');

const buildStateTag = (state?: SchemaCollaborativeState) => {
  if (state === 'locked') return { label: 'Bloqueado', color: 'error' as const };
  if (state === 'merged') return { label: 'Fusionado', color: 'success' as const };
  return { label: 'Borrador', color: 'default' as const };
};

export const resolveOwnerMode = (ownerRecipientIds: string[]) => {
  if (ownerRecipientIds.length > 1) return 'multi' as const;
  if (ownerRecipientIds.length === 1) return 'single' as const;
  return undefined;
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
            value={String(lock?.lockedBy || '')}
            onChange={(event) => onChangeLock({ ...lock, lockedBy: event.target.value || undefined })}
            placeholder="user-2"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado en</div>
          <InputNumber
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            value={typeof lock?.lockedAt === 'number' ? lock.lockedAt : undefined}
            onChange={(value) => onChangeLock({ ...lock, lockedAt: typeof value === 'number' ? value : undefined })}
          />
        </div>
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Motivo</div>
        <Input.TextArea
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
  const ownerRecipientIds = normalizeRecipientIdsShared(
    collaborative.ownerRecipientIds || collaborative.ownerRecipientId || activeSchema.ownerRecipientIds || activeSchema.ownerRecipientId,
  );
  const resolvedSchemaState = resolveSchemaCollaborationState(activeSchema, collaborationContext);
  const ownerMode = collaborative.ownerMode || resolvedSchemaState.ownerMode || resolveOwnerMode(ownerRecipientIds);
  const lock = collaborative.lock || activeSchema.lock;
  const commentCount = typeof collaborative.commentsCount === 'number'
    ? collaborative.commentsCount
    : Array.isArray(activeSchema.comments)
      ? activeSchema.comments.length
      : 0;
  const anchorCount = Array.isArray(activeSchema.commentAnchors || activeSchema.commentsAnchors)
    ? (activeSchema.commentAnchors || activeSchema.commentsAnchors || []).length
    : 0;
  const stateTag = buildStateTag(state);
  const recipientOptions = collaborationContext.recipientOptions || [];
  const hasRecipientOptions = recipientOptions.length > 0;
  const recipientSelectOptions = recipientOptions.map((recipient) => ({
    label: recipient.role ? `${recipient.name} · ${recipient.role}` : recipient.name,
    value: recipient.id,
  }));

  const commit = (patch: Record<string, unknown>) => {
    changeSchemas(
      Object.entries(patch).map(([key, value]) => ({
        key,
        value,
        schemaId: activeSchema.id,
      })),
    );
  };

  const updateRecipientIds = (value: string[] | string) => {
    const nextRecipientIds = normalizeRecipientIdsShared(value as string[] | string | null | undefined);
    const nextPrimaryRecipientId = nextRecipientIds[0];
    const nextPrimaryRecipient =
      recipientOptions.find((recipient) => recipient.id === nextPrimaryRecipientId) || null;
    const nextOwnerMode =
      nextRecipientIds.length === 0
        ? undefined
        : nextRecipientIds.length === recipientOptions.length && recipientOptions.length > 1
          ? 'shared'
          : resolveOwnerMode(nextRecipientIds);
    commit({
      ownerRecipientIds: nextRecipientIds,
      ownerRecipientId: nextPrimaryRecipientId,
      ownerRecipientName: nextPrimaryRecipient?.name || undefined,
      ownerColor: nextPrimaryRecipient?.color || undefined,
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
    resolvedSchemaState.ownerRecipientId ||
    'Sin owner';

  return (
    <CompactConfigPanel
      title={props.summaryTitle || 'Colaboración'}
      description={props.summaryDescription || 'Gestiona owner, bloqueo y trazabilidad sin dejar abierto todo el formulario.'}
      summary={[
        schemaUid || 'sin schemaUid',
        resolvedOwnerLabel,
        commentCount > 0 ? `${commentCount} comentarios` : 'sin comentarios',
        anchorCount > 0 ? `${anchorCount} anclas` : 'sin anclas',
      ].join(' · ')}
      statusTags={[
        { label: stateTag.label, color: stateTag.color },
        ...(ownerMode ? [{ label: `Owner ${ownerMode}`, color: 'default' as const }] : []),
        {
          label: resolvedSchemaState.isShared
            ? 'Compartido'
            : resolvedSchemaState.isOwnerOther
              ? 'Pertenece a otro usuario'
              : resolvedSchemaState.isOwnerActive
                ? 'Owner activo'
                : resolvedOwnerLabel,
          color: resolvedSchemaState.isShared ? 'purple' : resolvedSchemaState.isOwnerOther ? 'gold' : 'processing',
        },
        {
          label: ownerRecipientIds.length > 0 ? `${ownerRecipientIds.length} owner(s)` : 'Sin owner',
          color: ownerRecipientIds.length > 0 ? 'processing' : 'warning',
        },
        ...(commentCount > 0 ? [{ label: `${commentCount} comentarios`, color: 'blue' as const }] : []),
        ...(anchorCount > 0 ? [{ label: `${anchorCount} anclas`, color: 'cyan' as const }] : []),
        ...(hasLock ? [{ label: 'Bloqueo activo', color: 'error' as const }] : []),
      ]}
      quickActions={
        <Button size="small" type="default" onClick={() => updateState(hasLock ? 'draft' : 'locked')}>
          {props.quickActionLabel || (hasLock ? 'Desbloquear' : 'Bloquear')}
        </Button>
      }
      modalTitle={props.modalTitle || 'Configurar colaboración del campo'}
      modalTriggerLabel={props.modalTriggerLabel || 'Gestionar colaboración'}
    >
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget`}>
        <InspectorSummaryCard
          title="Colaboración"
          description="Identidad estable, propietario y bloqueo del campo para trabajo multiusuario."
          tags={[
            { label: stateTag.label, color: stateTag.color },
            ...(ownerMode ? [{ label: `Owner ${ownerMode}`, color: 'default' as const }] : []),
            {
              label: resolvedSchemaState.isShared
                ? 'Compartido'
                : resolvedSchemaState.isOwnerOther
                  ? 'Pertenece a otro usuario'
                  : resolvedSchemaState.isOwnerActive
                    ? 'Owner activo'
                    : resolvedOwnerLabel,
              color: resolvedSchemaState.isShared ? 'purple' : resolvedSchemaState.isOwnerOther ? 'gold' : 'processing',
            },
            {
              label: ownerRecipientIds.length > 0 ? `${ownerRecipientIds.length} owner(s)` : 'Sin owner',
              color: ownerRecipientIds.length > 0 ? 'processing' : 'warning',
            },
            {
              label: collaborative.saveValue === false || activeSchema.saveValue === false ? 'No guardar valor' : 'Guardar valor',
              color: collaborative.saveValue === false || activeSchema.saveValue === false ? 'warning' : 'success',
            },
        ...(commentCount > 0 ? [{ label: `${commentCount} comentarios`, color: 'blue' as const }] : []),
        ...(anchorCount > 0 ? [{ label: `${anchorCount} anclas`, color: 'cyan' as const }] : []),
            ...(hasLock ? [{ label: 'Bloqueo activo', color: 'error' as const }] : []),
          ]}
        >
          <div className={`${DESIGNER_CLASSNAME}schema-config-help`} style={{ marginTop: 4 }}>
            Los comentarios y anchors se administran en la sección de comentarios del inspector.
          </div>
        </InspectorSummaryCard>

        <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />

        <Collapse
          className={`${DESIGNER_CLASSNAME}schema-config-collapse`}
          ghost
          defaultActiveKey={[]}
          items={[
            {
              key: 'metadata',
              label: (
                <Space size={6} align="center">
                  <span className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`}>Metadatos editables</span>
                </Space>
              ),
              children: (
                <>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>schemaUid</div>
                      <Input value={schemaUid || ''} disabled placeholder="UUID estable del campo" />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Archivo</div>
                      <Input
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
                        className={`${DESIGNER_CLASSNAME}schema-config-number`}
                        min={1}
                        value={typeof activeSchema.pageNumber === 'number' ? activeSchema.pageNumber : collaborative.pageNumber}
                        onChange={(value) => commit({ pageNumber: typeof value === 'number' ? value : undefined })}
                      />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Estado</div>
                      <Select value={state} options={STATE_OPTIONS} onChange={(value) => updateState(value)} />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Modo owner</div>
                      <Input
                        value={ownerMode || ''}
                        onChange={(event) => commit({ ownerMode: event.target.value || undefined })}
                        placeholder="single / multi / shared"
                      />
                    </div>
                  </div>

                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Owner</div>
                    {hasRecipientOptions ? (
                      <Select
                        value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || undefined}
                        options={recipientSelectOptions}
                        onChange={(value) => updateRecipientIds([value])}
                        placeholder="Selecciona un owner"
                        allowClear
                        onClear={() => updateRecipientIds([])}
                      />
                    ) : (
                      <Input
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
                        mode="multiple"
                        value={ownerRecipientIds}
                        options={recipientSelectOptions}
                        onChange={(value) => updateRecipientIds(value)}
                        placeholder="Selecciona owners"
                      />
                    ) : (
                      <Input
                        value={joinRecipientIds(ownerRecipientIds)}
                        onChange={(event) => updateRecipientIds(event.target.value)}
                        placeholder="recipient-1, recipient-2"
                      />
                    )}
                  </div>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Visible</div>
                    <Input
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
                          value={activeSchema.lastModifiedBy || collaborative.lastModifiedBy || undefined}
                          options={authorOptions}
                          onChange={(value) => commit({ lastModifiedBy: value || undefined })}
                          placeholder="Selecciona editor"
                          allowClear
                        />
                      ) : (
                        <Input
                          value={activeSchema.lastModifiedBy || collaborative.lastModifiedBy || ''}
                          onChange={(event) => commit({ lastModifiedBy: event.target.value || undefined })}
                          placeholder="user-1"
                        />
                      )}
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
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Color owner</div>
                      <Input
                        value={activeSchema.ownerColor || collaborative.ownerColor || resolvedSchemaState.ownerColor || ''}
                        onChange={(event) => commit({ ownerColor: event.target.value || undefined })}
                        placeholder="#2563EB"
                      />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Color autor</div>
                      <Input
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

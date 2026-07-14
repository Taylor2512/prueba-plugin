/**
 * SchemaCollaborationWidget — editor de asignación, propietario y bloqueo.
 *
 * Renderiza un resumen compacto y un modal de configuración para metadata
 * colaborativa del schema. Integra destinatarios del engine, lock state, auditoría
 * y colores de propietario sin mezclar lógica de canvas.
 */
import React, { useMemo } from 'react';
import { type PropPanelWidgetProps, type SchemaForUI } from '@sisad-pdfme/common';
import { Collapse, Divider, Input, InputNumber, Select, Space } from 'antd';
import { Users } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import {
  buildEffectiveCollaborationContext,
  resolveSchemaCollaborationState,
} from '../../../../collaborationContext.js';
import {
  resolveSchemaCollaborativeMetadata,
  type DesignerEngine,
  type SchemaCollaborativeState,
} from '../../../../designerEngine.js';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';
import CompactConfigPanel from './CompactConfigPanel.js';
import {
  normalizeRecipientIds,
  resolveOwnerMode,
} from './schemaCollaborationUtils.js';
import { resolveSchemaAccessState } from '../../../../collaboration/schemaRuntimeAccess.js';
import { resolveSchemaInteractionState } from '../../shared/schemaInteractionState.js';

export { joinRecipientIds, normalizeRecipientIds, resolveOwnerMode } from './schemaCollaborationUtils.js';

/**
 * Props del widget de colaboración del schema.
 */
type CollaborationWidgetProps = PropPanelWidgetProps & {
  activeSchema: SchemaForUI;
  changeSchemas: (_objs: { key: string; value: unknown; schemaId: string }[]) => void;
  activeElements?: HTMLElement[];
  selectionCommands?: SelectionCommandSet;
  designerEngine?: DesignerEngine;
  summaryTitle?: string;
  summaryDescription?: string;
  modalTitle?: string;
  modalTriggerLabel?: React.ReactNode;
  quickActionLabel?: React.ReactNode;
};

/**
 * Claves de schema que el widget puede modificar.
 */
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

/** Opciones de estado colaborativo visibles en el selector. */
const STATE_OPTIONS: Array<{ label: string; value: SchemaCollaborativeState }> = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Bloqueado', value: 'locked' },
  { label: 'Fusionado', value: 'merged' },
];

/**
 * Formatea timestamps segundos/milisegundos para mostrar auditoría.
 */
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

/**
 * Widget de asignación, ownership, lock y auditoría colaborativa.
 *
 * @param props Props del panel con schema activo y engine del diseñador.
 * @returns Panel compacto y modal de colaboración.
 */
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
  const interactionState = useMemo(
    () => resolveSchemaInteractionState(activeSchema, { collaborationContext }),
    [activeSchema, collaborationContext],
  );
  const ownerMode = collaborative.ownerMode || resolvedSchemaState.ownerMode || resolveOwnerMode(ownerRecipientIds);
  const lock = collaborative.lock || activeSchema.lock;
  const selectedCount = Array.isArray(props.activeElements) ? props.activeElements.length : 0;
  const selectedSchemaIds = useMemo(() => {
    const ids = Array.isArray(props.activeElements)
      ? props.activeElements
          .map((element) => String(element?.dataset?.schemaId || element?.id || '').trim())
          .map((value, index) => {
            const element = props.activeElements?.[index];
            return String(
              value ||
                element?.dataset?.schemaUid ||
                element?.dataset?.schemaId ||
                element?.id ||
                '',
            ).trim();
          })
          .filter(Boolean)
      : [];

    if (ids.length > 0) {
      return Array.from(new Set(ids));
    }

    return [activeSchema.id];
  }, [activeSchema.id, props.activeElements]);
  const recipientOptions = collaborationContext.recipientOptions || [];
  const hasRecipientOptions = recipientOptions.length > 0;
  const recipientSelectOptions = recipientOptions.map((recipient) => ({
    label: recipient.role ? `${recipient.name} · ${recipient.role}` : recipient.name,
    value: recipient.id,
  }));
  const accessState = resolveSchemaAccessState(activeSchema, collaborationContext, collaborationContext.activeRecipient);

  const commit = (patch: Partial<Record<CollaborationPatchKey, unknown>>) => {
    changeSchemas(
      Object.entries(patch).map(([key, value]) => ({
        key,
        value,
        schemaId: activeSchema.id,
      })),
    );
  };

  const commitOwnerPatch = (patch: Partial<Record<CollaborationPatchKey, unknown>>) => {
    changeSchemas(
      selectedSchemaIds.flatMap((schemaId) =>
        Object.entries(patch).map(([key, value]) => ({
          key,
          value,
          schemaId,
        })),
      ),
    );
  };

  const updateState = (nextState: SchemaCollaborativeState) => {
    commit({
      state: nextState,
      lock: nextState === 'locked' ? { ...lock } : undefined,
    });
  };

  const hasLock = accessState.hasCollaborationLock;
  const authorOptions = recipientSelectOptions;
  const resolvedOwnerLabel = accessState.ownerLabel || interactionState.owner.name || 'Sin asignar';
  const resolvedLockedBy = recipientOptions.find(r => r.id === lock?.lockedBy);
  const resolvedLockedByText = resolvedLockedBy ? (resolvedLockedBy.role ? `${resolvedLockedBy.name} (${resolvedLockedBy.role})` : resolvedLockedBy.name) : (lock?.lockedBy || '');
  const selectionHint = selectedCount > 1 ? ` · ${selectedCount} seleccionados` : '';

  const stateLabel = accessState.inspectorStatusLabel;
  const stateTagColor =
    interactionState.visibleBadge?.color ||
    (accessState.inspectorStatusTone === 'error'
      ? 'error'
      : accessState.inspectorStatusTone === 'success'
        ? 'success'
        : 'warning');

  return (
    <CompactConfigPanel
      title={props.summaryTitle || 'Asignación y bloqueo'}
      description={props.summaryDescription || `Propietario y acceso${selectionHint}.`}
      statusTags={[{ label: stateLabel, color: stateTagColor }]}
      modalTitle={props.modalTitle || 'Gestionar asignación y bloqueo'}
      modalTriggerLabel={props.modalTriggerLabel ?? 'Reasignar'}
      modalTriggerIcon={<Users size={14} />}
      modalTriggerAriaLabel={props.modalTitle || 'Cambiar propietario'}
    >
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget`}>
        {/* ── Vista normal: solo campos de negocio ─────────────────────────── */}
        <div data-testid="collaboration-normal-view">
          <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Estado</div>
              <Select id="collaboration-state" name="collaboration-state" value={state} options={STATE_OPTIONS} onChange={(value) => updateState(value)} />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Nombre visible</div>
              <Input
                id="collaboration-visible-name"
                name="collaboration-visible-name"
                value={resolvedOwnerLabel}
                onChange={(event) => commit({ ownerRecipientName: event.target.value || undefined })}
                placeholder="Nombre visible"
              />
            </div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Propietario registrado</div>
            {hasRecipientOptions ? (
              <Select
                id="collaboration-owner"
                name="collaboration-owner"
                value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || undefined}
                options={recipientSelectOptions}
                onChange={(value) => {
                  const nextRecipient = recipientOptions.find((recipient) => recipient.id === value) || null;
                  const nextRecipientColor = nextRecipient?.color || collaborative.ownerColor || activeSchema.ownerColor || activeSchema.userColor || undefined;

                  commitOwnerPatch({
                    ownerRecipientIds: value ? [value] : [],
                    ownerRecipientId: value || undefined,
                    recipientId: value || undefined,
                    ownerRecipientName: nextRecipient?.name || undefined,
                    ownerColor: nextRecipientColor,
                    userColor: nextRecipientColor,
                    ownerMode: value ? 'single' : undefined,
                  });
                }}
                placeholder="Selecciona un usuario registrado"
                allowClear
                showSearch
                optionFilterProp="label"
                onClear={() =>
                  commitOwnerPatch({
                    ownerRecipientIds: [],
                    ownerRecipientId: undefined,
                    recipientId: undefined,
                    ownerRecipientName: undefined,
                    ownerColor: undefined,
                    userColor: undefined,
                    ownerMode: undefined,
                  })
                }
              />
            ) : (
              <Input
                id="collaboration-owner-raw"
                name="collaboration-owner-raw"
                value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || ''}
                onChange={(event) => commitOwnerPatch({ ownerRecipientId: event.target.value || undefined })}
                placeholder="Sin usuarios registrados"
              />
            )}
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Propiedad</div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="truncate text-sm font-medium text-slate-900">{resolvedOwnerLabel}</div>
              <div className="mt-0.5 truncate text-xs text-slate-500">
                {hasRecipientOptions ? 'Usa el icono de usuarios para reasignar destinatarios.' : 'Sin usuarios registrados en este contexto.'}
              </div>
            </div>
          </div>
          {hasLock ? (
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado por</div>
              <div className="flex h-7 items-center rounded-md border border-slate-200 bg-slate-50 px-2 text-[0.62rem] font-medium text-slate-600">
                {resolvedLockedByText}
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Avanzado (colapsado): IDs, auditoría y depuración ─────────────── */}
        <Collapse
          className={`${DESIGNER_CLASSNAME}schema-config-collapse`}
          ghost
          defaultActiveKey={[]}
          items={[
            {
              key: 'advanced',
              label: (
                <Space size={6} align="center">
                  <span className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`} data-testid="collaboration-advanced-toggle">
                    Avanzado
                  </span>
                </Space>
              ),
              children: (
                <div data-testid="collaboration-advanced-view">
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
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Modo de asignación</div>
                      <Input
                        id="collaboration-owner-mode"
                        name="collaboration-owner-mode"
                        value={ownerMode || ''}
                        onChange={(event) => commit({ ownerMode: event.target.value || undefined })}
                        placeholder="único / múltiple / compartido"
                      />
                    </div>
                    {hasLock ? (
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Fecha de bloqueo</div>
                        <Input
                          id="collaboration-locked-at"
                          name="collaboration-locked-at"
                          className={`${DESIGNER_CLASSNAME}schema-config-number`}
                          value={formatTimestampLabel(lock?.lockedAt)}
                          disabled
                          readOnly
                        />
                        <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>Dato técnico: {typeof lock?.lockedAt === 'number' ? lock.lockedAt : '—'}</div>
                      </div>
                    ) : null}
                  </div>

                  {hasLock ? (
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Motivo técnico</div>
                      <Input.TextArea
                        id="collaboration-lock-reason"
                        name="collaboration-lock-reason"
                        value={String(lock?.reason || '')}
                        onChange={(event) => commit({ lock: { ...lock, reason: event.target.value || undefined } })}
                        placeholder="Edición concurrente"
                        autoSize={{ minRows: 2, maxRows: 4 }}
                      />
                    </div>
                  ) : null}

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
                      <Input
                        id="collaboration-created-at"
                        name="collaboration-created-at"
                        className={`${DESIGNER_CLASSNAME}schema-config-number`}
                        value={formatTimestampLabel(activeSchema.createdAt ?? collaborative.createdAt)}
                        readOnly
                        disabled
                      />
                      <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>Dato técnico: {typeof (activeSchema.createdAt ?? collaborative.createdAt) === 'number' ? (activeSchema.createdAt ?? collaborative.createdAt) : '—'}</div>
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Actualizado el</div>
                      <Input
                        id="collaboration-updated-at"
                        name="collaboration-updated-at"
                        className={`${DESIGNER_CLASSNAME}schema-config-number`}
                        value={formatTimestampLabel(activeSchema.updatedAt ?? collaborative.updatedAt)}
                        readOnly
                        disabled
                      />
                      <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>Dato técnico: {typeof (activeSchema.updatedAt ?? collaborative.updatedAt) === 'number' ? (activeSchema.updatedAt ?? collaborative.updatedAt) : '—'}</div>
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
                </div>
              ),
            },
          ]}
        />
      </div>
    </CompactConfigPanel>
  );
};

export default SchemaCollaborationWidget;

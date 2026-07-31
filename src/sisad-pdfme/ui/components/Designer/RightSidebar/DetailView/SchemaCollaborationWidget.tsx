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
import { mergeClassNames } from '../../shared/className.js';
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
import { SCHEMA_CONFIG_COLLAPSE } from './SchemaConnectionsShared.js';

;

const WIDGET_ROOT = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-collaboration-widget',
  'flex flex-col gap-1.5 rounded-[0.95rem] border border-slate-200/70 bg-white/96 p-1.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]',
);

const GRID_2 = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-grid-2',
  'grid grid-cols-2 gap-1 max-[820px]:grid-cols-1',
);

const FIELD = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-field',
  'flex min-w-0 flex-col gap-0.5 text-[0.6875rem] text-slate-500 [&_.ant-select-selector]:min-h-[2rem] [&_.ant-select-selector]:rounded-md [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:bg-white [&_.ant-select-selector]:text-[0.6875rem] [&_.ant-select-selector]:shadow-none',
);

const FIELD_LABEL = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-field-label',
  'inline-flex min-h-3.5 items-center font-medium text-slate-500',
);

const HELP = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-help',
  'mt-0.5 text-[0.625rem] leading-tight text-slate-500',
);

const DIVIDER = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-divider',
  'my-1.5 border-slate-200/70',
);

const NUMBER_INPUT = mergeClassNames(
  DESIGNER_CLASSNAME + 'schema-config-number',
  'h-8 rounded-md border border-slate-200/80 bg-white text-[0.71875rem] shadow-none',
);

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
  const ownerRecipientIds =
    normalizeRecipientIds(
      collaborative.ownerRecipientIds || collaborative.ownerRecipientId || activeSchema.ownerRecipientIds || activeSchema.ownerRecipientId || [],
    ) || [];
  const resolvedSchemaState = resolveSchemaCollaborationState(activeSchema, collaborationContext);
  const interactionState = useMemo(
    () => resolveSchemaInteractionState(activeSchema, { collaborationContext }),
    [activeSchema, collaborationContext],
  );
  const resolvedOwnerColor =
    interactionState.ownerColor ||
    resolvedSchemaState.ownerColor ||
    collaborative.ownerColor ||
    activeSchema.ownerColor ||
    activeSchema.userColor ||
    null;
  const ownerMode = collaborative.ownerMode || resolvedSchemaState.ownerMode || resolveOwnerMode(Array.isArray(ownerRecipientIds) ? ownerRecipientIds : []);
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

  const stateLabel = accessState.statusLabel;
  const stateTagColor = accessState.statusTone;

  return (
    <div
      data-testid="schema-collaboration-widget"
      data-schema-owner-color={resolvedOwnerColor || undefined}
      style={{ '--schema-owner-color': resolvedOwnerColor || undefined } as React.CSSProperties}
    >
      <CompactConfigPanel
        title={props.summaryTitle || 'Estado de acceso'}
        description={props.summaryDescription || `Propietario, bloqueo y auditoría${selectionHint}.`}
        statusTags={[{ label: stateLabel, color: stateTagColor }]}
        modalTitle={props.modalTitle || 'Gestionar asignación y bloqueo'}
        modalTriggerLabel={props.modalTriggerLabel ?? 'Reasignar'}
        modalTriggerIcon={<Users size={14} />}
        modalTriggerAriaLabel={props.modalTitle || 'Cambiar propietario'}
      >
        <div className={WIDGET_ROOT}>
        {/* ── Vista normal: solo campos de negocio ─────────────────────────── */}
        <div data-testid="collaboration-normal-view">
          <div className={GRID_2}>
            <div className={FIELD}>
              <div className={FIELD_LABEL}>Estado</div>
              <Select id="collaboration-state" name="collaboration-state" value={state} options={STATE_OPTIONS} onChange={(value) => updateState(value)} />
            </div>
            <div className={FIELD}>
              <div className={FIELD_LABEL}>Nombre visible</div>
              <Input
                id="collaboration-visible-name"
                name="collaboration-visible-name"
                value={resolvedOwnerLabel}
                onChange={(event) => commit({ ownerRecipientName: event.target.value || undefined })}
                placeholder="Nombre visible"
              />
            </div>
          </div>
          <div className={FIELD}>
            <div className={FIELD_LABEL}>
              <span
                className="inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--schema-owner-color,_transparent)]"
                aria-hidden="true"
              />
              Propietario registrado
            </div>
            {hasRecipientOptions ? (
              <Select
                id="collaboration-owner"
                name="collaboration-owner"
                value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || undefined}
                options={recipientSelectOptions}
                onChange={(value) => {
                  const nextRecipient = recipientOptions.find((recipient) => recipient.id === value) || null;
                  const nextRecipientColor = nextRecipient?.color || resolvedOwnerColor || undefined;

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
          {hasLock ? (
            <div className={FIELD}>
              <div className={FIELD_LABEL}>Bloqueado por</div>
              <div className="inline-flex min-h-7 items-center rounded-full border border-rose-200/70 bg-rose-50/90 px-2.5 py-1 text-[0.6875rem] font-semibold text-rose-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                {resolvedLockedByText}
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Avanzado (colapsado): IDs, auditoría y depuración ─────────────── */}
        <Collapse
          className={mergeClassNames(
            SCHEMA_CONFIG_COLLAPSE,
            'flex flex-col gap-1',
          )}
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
                  <div className={GRID_2}>
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>UID técnico</div>
                      <Input id="collaboration-schema-uid" name="collaboration-schema-uid" value={schemaUid || ''} disabled placeholder="UUID estable del campo" />
                    </div>
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Archivo</div>
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
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Página</div>
                      <InputNumber
                        id="collaboration-page-number"
                        name="collaboration-page-number"
                        className={NUMBER_INPUT}
                        min={1}
                        value={typeof activeSchema.pageNumber === 'number' ? activeSchema.pageNumber : collaborative.pageNumber}
                        onChange={(value) => commit({ pageNumber: typeof value === 'number' ? value : undefined })}
                      />
                      <div className={HELP}>Página visible: {typeof activeSchema.pageNumber === 'number' ? activeSchema.pageNumber : collaborative.pageNumber || '—'}</div>
                    </div>
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Modo de asignación</div>
                      <Input
                        id="collaboration-owner-mode"
                        name="collaboration-owner-mode"
                        value={ownerMode || ''}
                        onChange={(event) => commit({ ownerMode: event.target.value || undefined })}
                        placeholder="único / múltiple / compartido"
                      />
                    </div>
                    {hasLock ? (
                      <div className={FIELD}>
                        <div className={FIELD_LABEL}>Fecha de bloqueo</div>
                        <Input
                          id="collaboration-locked-at"
                          name="collaboration-locked-at"
                          className={NUMBER_INPUT}
                          value={formatTimestampLabel(lock?.lockedAt)}
                          disabled
                          readOnly
                        />
                        <div className={HELP}>Dato técnico: {typeof lock?.lockedAt === 'number' ? lock.lockedAt : '—'}</div>
                      </div>
                    ) : null}
                  </div>

                  {hasLock ? (
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Motivo técnico</div>
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

                  <Divider className={DIVIDER} />

                  <div className={GRID_2}>
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Creado por</div>
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
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Modificado por</div>
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
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Creado el</div>
                      <Input
                        id="collaboration-created-at"
                        name="collaboration-created-at"
                        className={NUMBER_INPUT}
                        value={formatTimestampLabel(activeSchema.createdAt ?? collaborative.createdAt)}
                        readOnly
                        disabled
                      />
                      <div className={HELP}>Dato técnico: {typeof (activeSchema.createdAt ?? collaborative.createdAt) === 'number' ? (activeSchema.createdAt ?? collaborative.createdAt) : '—'}</div>
                    </div>
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Actualizado el</div>
                      <Input
                        id="collaboration-updated-at"
                        name="collaboration-updated-at"
                        className={NUMBER_INPUT}
                        value={formatTimestampLabel(activeSchema.updatedAt ?? collaborative.updatedAt)}
                        readOnly
                        disabled
                      />
                      <div className={HELP}>Dato técnico: {typeof (activeSchema.updatedAt ?? collaborative.updatedAt) === 'number' ? (activeSchema.updatedAt ?? collaborative.updatedAt) : '—'}</div>
                    </div>
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Color del propietario</div>
                      <Input
                        id="collaboration-owner-color"
                        name="collaboration-owner-color"
                        value={resolvedOwnerColor || ''}
                        onChange={(event) => commit({ ownerColor: event.target.value || undefined })}
                        placeholder="#2563EB"
                      />
                    </div>
                    <div className={FIELD}>
                      <div className={FIELD_LABEL}>Color autor</div>
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
    </div>
  );
};

export default SchemaCollaborationWidget;

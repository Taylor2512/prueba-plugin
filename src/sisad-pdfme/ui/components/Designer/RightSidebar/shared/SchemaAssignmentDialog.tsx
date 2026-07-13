/**
 * SchemaAssignmentDialog — modal "Reasignar responsable".
 *
 * Permite elegir el nuevo propietario/recipient de uno o varios schemas
 * seleccionados. Es un componente controlado y presentacional: NO muta el
 * template ni conoce el CommandBus; solo notifica la intención vía `onConfirm`.
 *
 * Reglas de la UI (ver plan §4):
 * - Muestra los campos seleccionados y el responsable actual (o "mixtos").
 * - Permite buscar entre los destinatarios disponibles.
 * - Deshabilita confirmar cuando no hay un nuevo responsable elegido o cuando
 *   el elegido ya es el owner común de toda la selección ("Ya asignado").
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Input, Modal, Radio } from 'antd';
import { Search, Users } from 'lucide-react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import type { CollaborationRecipientOption } from '../../../../collaborationContext.js';
import { markInspectorInteractive, stopInspectorPointerEvent } from '../DetailView/inspectorInteractionGuards.js';
import { resolveSchemaUid } from '../../shared/schemaAssignmentService.js';

/**
 * Props del modal de reasignación.
 */
export type SchemaAssignmentDialogProps = {
  open: boolean;
  selectedSchemas: SchemaForUI[];
  recipients: CollaborationRecipientOption[];
  /** Owner común actual de la selección (null si mixto o sin asignar). */
  currentRecipientId?: string | null;
  /** Indica que los schemas seleccionados tienen propietarios distintos. */
  currentOwnerMixed?: boolean;
  /** Total de schemas seleccionados si difiere de `selectedSchemas.length`. */
  selectedCount?: number;
  onClose: () => void;
  onConfirm: (_recipientId: string) => void;
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const resolveSchemaLabel = (schema: SchemaForUI): string =>
  normalizeText((schema as SchemaForUI & { label?: string }).label) ||
  normalizeText(schema.name) ||
  resolveSchemaUid(schema) ||
  'Campo';

/**
 * Modal para reasignar el responsable de los schemas seleccionados.
 */
const SchemaAssignmentDialog = ({
  open,
  selectedSchemas,
  recipients,
  currentRecipientId = null,
  currentOwnerMixed = false,
  selectedCount,
  onClose,
  onConfirm,
}: SchemaAssignmentDialogProps) => {
  const [query, setQuery] = useState('');
  const [nextRecipientId, setNextRecipientId] = useState<string | null>(null);
  const bodyRef = React.useRef<HTMLDivElement | null>(null);

  // Reinicia el estado local cada vez que se abre para no arrastrar selecciones.
  useEffect(() => {
    if (open) {
      setQuery('');
      setNextRecipientId(null);
      markInspectorInteractive(bodyRef.current);
    }
  }, [open]);

  const totalSelected = typeof selectedCount === 'number' ? selectedCount : selectedSchemas.length;

  const currentRecipient = useMemo(
    () => recipients.find((recipient) => recipient.id === currentRecipientId) || null,
    [recipients, currentRecipientId],
  );

  const currentOwnerLabel = currentOwnerMixed
    ? 'Responsables mixtos'
    : currentRecipient
      ? currentRecipient.role
        ? `${currentRecipient.name} · ${currentRecipient.role}`
        : currentRecipient.name
      : 'Sin asignar';

  const filteredRecipients = useMemo(() => {
    const normalizedQuery = normalizeText(query).toLowerCase();
    if (!normalizedQuery) return recipients;
    return recipients.filter((recipient) =>
      [recipient.name, recipient.role, recipient.team, recipient.tag, recipient.id]
        .map((value) => normalizeText(value).toLowerCase())
        .some((value) => value.includes(normalizedQuery)),
    );
  }, [recipients, query]);

  const sampleNames = useMemo(
    () => selectedSchemas.slice(0, 4).map(resolveSchemaLabel),
    [selectedSchemas],
  );

  // Si el destinatario elegido ya es el owner común de toda la selección,
  // la reasignación no aporta nada → botón deshabilitado con "Ya asignado".
  const alreadyAssigned =
    !currentOwnerMixed && Boolean(nextRecipientId) && nextRecipientId === currentRecipientId;
  const canConfirm = Boolean(nextRecipientId) && !alreadyAssigned;

  const handleConfirm = () => {
    if (!nextRecipientId || !canConfirm) return;
    onConfirm(nextRecipientId);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Reasignar responsable"
      width={460}
      centered
      destroyOnHidden
      okText={alreadyAssigned ? 'Ya asignado' : 'Reasignar'}
      cancelText="Cancelar"
      okButtonProps={{
        disabled: !canConfirm,
        'data-testid': 'schema-assignment-confirm',
      }}
      cancelButtonProps={{ 'data-testid': 'schema-assignment-cancel' }}
      onOk={handleConfirm}
      rootClassName="sisad-pdfme-schema-assignment-dialog"
    >
      <div
        ref={bodyRef}
        data-testid="schema-assignment-dialog"
        data-sisad-inspector-interactive="true"
        data-selecto-ignore="true"
        data-moveable-ignore="true"
        data-canvas-drop-ignore="true"
        onPointerDown={stopInspectorPointerEvent}
        onMouseDown={stopInspectorPointerEvent}
        onClick={stopInspectorPointerEvent}
        className="flex flex-col gap-3"
      >
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Campos seleccionados
          </div>
          <div className="mt-1 flex flex-wrap gap-1.5" data-testid="schema-assignment-selected">
            {sampleNames.map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="inline-flex max-w-[12rem] items-center truncate rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700"
              >
                {name}
              </span>
            ))}
            {totalSelected > sampleNames.length ? (
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-500">
                +{totalSelected - sampleNames.length}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            {totalSelected === 1 ? '1 campo' : `${totalSelected} campos`}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Responsable actual
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700"
            data-testid="schema-assignment-current-owner"
          >
            <Users size={12} className="text-slate-400" />
            {currentOwnerLabel}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Nuevo responsable
          </span>
          <Input
            allowClear
            size="small"
            placeholder="Buscar usuario…"
            prefix={<Search size={12} className="text-slate-400" />}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="rounded-xl"
            data-testid="schema-assignment-search"
          />
          {filteredRecipients.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 px-3 py-4 text-center text-xs text-slate-500">
              No hay destinatarios disponibles.
            </div>
          ) : (
            <Radio.Group
              className="flex flex-col gap-1.5"
              value={nextRecipientId}
              onChange={(event) => setNextRecipientId(event.target.value)}
            >
              {filteredRecipients.map((recipient) => {
                const isCurrent = recipient.id === currentRecipientId && !currentOwnerMixed;
                return (
                  <Radio
                    key={recipient.id}
                    value={recipient.id}
                    data-testid={`schema-assignment-option-${recipient.id}`}
                    className="m-0 flex items-center rounded-xl border border-slate-200 px-3 py-1.5 hover:border-sky-200"
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: recipient.color || '#CBD5E1' }}
                      />
                      <span className="text-sm font-medium text-slate-800">{recipient.name}</span>
                      {recipient.role ? (
                        <span className="text-[11px] text-slate-400">· {recipient.role}</span>
                      ) : null}
                      {isCurrent ? (
                        <span className="text-[10px] font-semibold uppercase text-sky-600">Actual</span>
                      ) : null}
                    </span>
                  </Radio>
                );
              })}
            </Radio.Group>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default SchemaAssignmentDialog;

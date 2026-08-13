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
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Input, Modal, Radio } from 'antd';
import { Search, Users } from 'lucide-react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { OptionsContext } from '../../../../contexts.js';
import type { CollaborationRecipientOption } from '../../../../collaborationContext.js';
import { markInspectorInteractive, stopInspectorPointerEvent } from '../DetailView/inspectorInteractionGuards.js';
import { resolveSchemaUid } from '../../shared/schemaAssignmentService.js';
import { resetDesignerTransientInteractionState } from '../../shared/designerInteractionReset.js';
import { normalizeText } from '../../../../../shared/text.js';

/** Razón normalizada de cierre del modal (lifecycle único). */
type SchemaAssignmentCloseReason =
  | 'cancel'
  | 'x'
  | 'escape'
  | 'mask'
  | 'confirm'
  | 'unmount';

/**
 * Props del modal de reasignación.
 */
type SchemaAssignmentDialogProps = {
  open: boolean;
  selectedSchemas: SchemaForUI[];
  recipients: CollaborationRecipientOption[];
  /** Owner común actual de la selección (null si mixto o sin asignar). */
  currentRecipientId?: string | null;
  /** Indica que los schemas seleccionados tienen propietarios distintos. */
  currentOwnerMixed?: boolean;
  /** Total de schemas seleccionados si difiere de `selectedSchemas.length`. */
  selectedCount?: number;
  onClose: (payload?: { reason: SchemaAssignmentCloseReason }) => void;
  onConfirm: (_recipientId: string) => void;
  onAfterClose?: () => void;
};

/** Distingue Cancelar / X / Escape / mask a partir del evento de antd. */
const resolveCancelReason = (
  event?: React.MouseEvent | React.KeyboardEvent,
): SchemaAssignmentCloseReason => {
  const native = (event as { nativeEvent?: Event } | undefined)?.nativeEvent;
  if (native?.type === 'keydown' || (event as React.KeyboardEvent | undefined)?.key === 'Escape') {
    return 'escape';
  }
  const target = event?.target;
  if (target instanceof HTMLElement) {
    if (target.closest('.ant-modal-close')) return 'x';
    if (target.closest('[data-testid="schema-assignment-cancel"]')) return 'cancel';
    if (target.classList.contains('ant-modal-wrap')) return 'mask';
  }
  return 'cancel';
};

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
  onAfterClose,
}: SchemaAssignmentDialogProps) => {
  const [query, setQuery] = useState('');
  const [nextRecipientId, setNextRecipientId] = useState<string | null>(null);
  const bodyRef = React.useRef<HTMLDivElement | null>(null);
  const options = useContext(OptionsContext) as { debug?: { enabled?: boolean } } | undefined;
  const debugEnabled = options?.debug?.enabled === true;
  const openRef = useRef(open);

  const logLifecycle = useCallback(
    (phase: 'open' | 'close' | 'after-close', reason?: SchemaAssignmentCloseReason) => {
      if (!debugEnabled) return;
      // Log temporal de diagnóstico (TASK-INTERACTION-016), solo con debug.enabled.
      // Excepción a no-console: el `debugEnabled` de arriba ya corta la traza
      // salvo que el host active explícitamente `options.debug.enabled`.
      // eslint-disable-next-line no-console
      console.info('[assignment-modal-lifecycle]', {
        phase,
        reason: reason ?? null,
        isModalOpen: openRef.current,
        activeElementsCount: selectedSchemas.length,
      });
    },
    [debugEnabled, selectedSchemas.length],
  );

  /** Lifecycle único: TODO cierre (Cancelar/X/Escape/mask/Confirmar/unmount) pasa por aquí. */
  const requestClose = useCallback(
    (reason: SchemaAssignmentCloseReason) => {
      logLifecycle('close', reason);
      onClose?.({ reason });
    },
    [logLifecycle, onClose],
  );

  // Reinicia el estado local cada vez que se abre para no arrastrar selecciones.
  useEffect(() => {
    openRef.current = open;
    if (open) {
      setQuery('');
      setNextRecipientId(null);
      markInspectorInteractive(bodyRef.current);
      logLifecycle('open');
    }
  }, [open, logLifecycle]);

  // Safety de unmount: si el modal desaparece abierto (p. ej. cambio de panel),
  // el estado transitorio del diseñador no puede quedar bloqueado.
  useEffect(
    () => () => {
      if (openRef.current) {
        resetDesignerTransientInteractionState();
      }
    },
    [],
  );

  // Escape a nivel documento: el Escape nativo de antd exige foco dentro del
  // wrap, pero el botón Reasignar previene el focus (stopDesignerControlEvent
  // en pointerdown), así que el foco puede quedar fuera del modal. Mismo
  // lifecycle único: pasa por requestClose('escape').
  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      requestClose('escape');
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [open, requestClose]);

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
    requestClose('confirm');
  };

  return (
    <Modal
      open={open}
      onCancel={(event) => requestClose(resolveCancelReason(event))}
      title="Reasignar responsable"
      width={460}
      centered
      destroyOnHidden
      keyboard
      maskClosable
      afterOpenChange={(visible) => {
        if (!visible) {
          // keepSelection implícito: el reset transitorio NUNCA toca activeElements.
          resetDesignerTransientInteractionState();
          logLifecycle('after-close');
          onAfterClose?.();
        }
      }}
      okText={alreadyAssigned ? 'Ya asignado' : 'Reasignar'}
      cancelText="Cancelar"
      okButtonProps={{
        disabled: !canConfirm,
        'data-testid': 'schema-assignment-confirm',
      }}
      cancelButtonProps={{ 'data-testid': 'schema-assignment-cancel' }}
      onOk={handleConfirm}
      modalRender={(node) => (
        // Stops en bubble: cortan la fuga hacia el árbol React padre sin romper
        // los controles internos (un stop en capture detendría el descenso del
        // evento antes de llegar a Radio/Input del propio modal).
        <div
          data-designer-modal="true"
          data-interaction-exclusion="true"
          onPointerDown={stopInspectorPointerEvent}
          onMouseDown={stopInspectorPointerEvent}
          onClick={stopInspectorPointerEvent}
          onDoubleClickCapture={(event) => {
            const target = event.target as HTMLElement | null;
            // El doble click no tiene interacción interna salvo selección de
            // texto en inputs; fuera de ellos se detiene en capture.
            if (target?.closest('input, textarea, [contenteditable="true"]')) return;
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          {node}
        </div>
      )}
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

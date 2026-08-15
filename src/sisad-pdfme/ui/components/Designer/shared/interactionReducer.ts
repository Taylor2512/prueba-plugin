/**
 * Máquina de estados de interacción del Designer.
 *
 * `interactionState.ts` deriva una fase a partir de señales sueltas del Canvas.
 * Eso describe el presente pero no protege las transiciones: no hay forma de
 * rechazar «empezar a arrastrar con un modal abierto» ni de explicar por qué se
 * rechazó.
 *
 * Este reducer añade esa capa sin duplicar la derivación: el cálculo de fase
 * sigue siendo `deriveInteractionState`, y aquí vive únicamente el estado
 * acumulado y los guards.
 *
 * Reglas que fija:
 *
 * - un modal **bloquea** transform y edición, pero **no** borra la selección;
 * - una transición inválida no muta el estado y deja `lastRejection` con motivo;
 * - el reducer es puro: mismo estado + mismo evento ⇒ mismo resultado.
 */
import {
  deriveInteractionState,
  type InteractionPhase,
  type InteractionState,
} from '@sisad-pdfme/ui/components/Designer/shared/interactionState';

export type TransformKind = 'drag' | 'resize' | 'rotate';

export type InteractionMachineState = {
  /** Fase derivada; `modal` gana sobre cualquier otra. */
  phase: InteractionPhase | 'modal';
  selectionCount: number;
  hoverSchemaId: string | null;
  editing: boolean;
  transform: TransformKind | null;
  modalOpen: boolean;
  /** Último intento rechazado por un guard. `null` tras una transición válida. */
  lastRejection: { event: InteractionEvent['type']; reason: InteractionRejectionReason } | null;
};

export type InteractionRejectionReason =
  | 'modal-open'
  | 'no-selection'
  | 'requires-single-selection'
  | 'already-transforming'
  | 'no-transform-in-progress'
  | 'not-editing';

export type InteractionEvent =
  | { type: 'hover.enter'; schemaId: string }
  | { type: 'hover.leave' }
  | { type: 'selection.set'; count: number }
  | { type: 'edit.start' }
  | { type: 'edit.commit' }
  | { type: 'edit.cancel' }
  | { type: 'transform.start'; kind: TransformKind }
  | { type: 'transform.end' }
  | { type: 'modal.open' }
  | { type: 'modal.close' }
  | { type: 'reset' };

export const initialInteractionMachineState: InteractionMachineState = {
  phase: 'idle',
  selectionCount: 0,
  hoverSchemaId: null,
  editing: false,
  transform: null,
  modalOpen: false,
  lastRejection: null,
};

/**
 * Fase efectiva del estado acumulado.
 *
 * Delega en `deriveInteractionState` para no tener dos definiciones de fase.
 * `modal` no existe allí porque no es una señal del Canvas sino del shell.
 */
const resolvePhase = (state: Omit<InteractionMachineState, 'phase' | 'lastRejection'>) => {
  if (state.modalOpen) return 'modal' as const;

  const derived: InteractionState = deriveInteractionState({
    // La derivación solo mira la longitud, así que basta un array del tamaño.
    activeElements: new Array(state.selectionCount).fill(null) as HTMLElement[],
    hoveringSchemaId: state.hoverSchemaId,
    editing: state.editing,
    isDragging: state.transform === 'drag',
    isResizing: state.transform === 'resize',
    isRotating: state.transform === 'rotate',
  });

  return derived.phase;
};

const commit = (
  next: Omit<InteractionMachineState, 'phase' | 'lastRejection'>,
): InteractionMachineState => ({
  ...next,
  phase: resolvePhase(next),
  lastRejection: null,
});

const reject = (
  state: InteractionMachineState,
  event: InteractionEvent['type'],
  reason: InteractionRejectionReason,
): InteractionMachineState => ({ ...state, lastRejection: { event, reason } });

/**
 * Aplica un evento de interacción.
 *
 * Devuelve siempre un estado nuevo; si el guard rechaza, el estado funcional es
 * idéntico y solo cambia `lastRejection`.
 */
export const interactionReducer = (
  state: InteractionMachineState,
  event: InteractionEvent,
): InteractionMachineState => {
  const base = {
    selectionCount: state.selectionCount,
    hoverSchemaId: state.hoverSchemaId,
    editing: state.editing,
    transform: state.transform,
    modalOpen: state.modalOpen,
  };

  switch (event.type) {
    case 'hover.enter':
      // El hover sigue registrándose bajo modal: es información, no acción.
      return commit({ ...base, hoverSchemaId: event.schemaId });

    case 'hover.leave':
      return commit({ ...base, hoverSchemaId: null });

    case 'selection.set': {
      const count = Math.max(0, Math.trunc(event.count));
      // Cambiar la selección cierra cualquier edición en curso: se estaba
      // editando otro schema.
      return commit({
        ...base,
        selectionCount: count,
        editing: count === 1 ? state.editing : false,
      });
    }

    case 'edit.start':
      if (state.modalOpen) return reject(state, event.type, 'modal-open');
      if (state.selectionCount === 0) return reject(state, event.type, 'no-selection');
      if (state.selectionCount > 1) return reject(state, event.type, 'requires-single-selection');
      if (state.transform) return reject(state, event.type, 'already-transforming');
      return commit({ ...base, editing: true });

    case 'edit.commit':
    case 'edit.cancel':
      if (!state.editing) return reject(state, event.type, 'not-editing');
      return commit({ ...base, editing: false });

    case 'transform.start':
      if (state.modalOpen) return reject(state, event.type, 'modal-open');
      if (state.selectionCount === 0) return reject(state, event.type, 'no-selection');
      if (state.transform) return reject(state, event.type, 'already-transforming');
      // Transformar cancela la edición inline en curso, no la selección.
      return commit({ ...base, transform: event.kind, editing: false });

    case 'transform.end':
      if (!state.transform) return reject(state, event.type, 'no-transform-in-progress');
      return commit({ ...base, transform: null });

    case 'modal.open':
      // Abrir un modal conserva selección y hover; solo congela la interacción.
      return commit({ ...base, modalOpen: true, transform: null, editing: false });

    case 'modal.close':
      return commit({ ...base, modalOpen: false });

    case 'reset':
      return { ...initialInteractionMachineState };

    default:
      return state;
  }
};

/** ¿El evento sería aceptado en este estado? Útil para habilitar controles. */
export const canApplyInteractionEvent = (
  state: InteractionMachineState,
  event: InteractionEvent,
): boolean => interactionReducer(state, event).lastRejection === null;

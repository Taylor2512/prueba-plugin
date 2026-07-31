/**
 * COREUX-008 — Máquina de estados de interacción.
 *
 * Criterios: transiciones inválidas rechazadas, modal bloquea transform sin
 * borrar selección, reducer puro con tabla de transiciones.
 */
import { describe, expect, it } from 'vitest';
import {
  canApplyInteractionEvent,
  initialInteractionMachineState,
  interactionReducer,
  type InteractionEvent,
  type InteractionMachineState,
} from '@/sisad-pdfme/ui/components/Designer/shared/interactionReducer';

const run = (events: InteractionEvent[], from = initialInteractionMachineState) =>
  events.reduce(interactionReducer, from);

describe('tabla de transiciones válidas', () => {
  const cases: Array<{ name: string; events: InteractionEvent[]; phase: string }> = [
    { name: 'estado inicial', events: [], phase: 'idle' },
    { name: 'hover sin selección', events: [{ type: 'hover.enter', schemaId: 's1' }], phase: 'hover' },
    { name: 'selección simple', events: [{ type: 'selection.set', count: 1 }], phase: 'selected-single' },
    { name: 'selección múltiple', events: [{ type: 'selection.set', count: 3 }], phase: 'selected-multi' },
    {
      name: 'edición sobre selección simple',
      events: [{ type: 'selection.set', count: 1 }, { type: 'edit.start' }],
      phase: 'editing',
    },
    {
      name: 'arrastre',
      events: [{ type: 'selection.set', count: 1 }, { type: 'transform.start', kind: 'drag' }],
      phase: 'dragging',
    },
    {
      name: 'redimensionado',
      events: [{ type: 'selection.set', count: 2 }, { type: 'transform.start', kind: 'resize' }],
      phase: 'resizing',
    },
    {
      name: 'rotación',
      events: [{ type: 'selection.set', count: 1 }, { type: 'transform.start', kind: 'rotate' }],
      phase: 'rotating',
    },
    { name: 'modal', events: [{ type: 'modal.open' }], phase: 'modal' },
    {
      name: 'vuelta a idle tras deseleccionar',
      events: [{ type: 'selection.set', count: 2 }, { type: 'selection.set', count: 0 }],
      phase: 'idle',
    },
  ];

  cases.forEach(({ name, events, phase }) => {
    it(`${name} → ${phase}`, () => {
      const state = run(events);
      expect(state.phase).toBe(phase);
      expect(state.lastRejection).toBeNull();
    });
  });
});

describe('guards: transiciones inválidas', () => {
  const rejections: Array<{
    name: string;
    setup: InteractionEvent[];
    event: InteractionEvent;
    reason: string;
  }> = [
    {
      name: 'editar sin selección',
      setup: [],
      event: { type: 'edit.start' },
      reason: 'no-selection',
    },
    {
      name: 'editar con selección múltiple',
      setup: [{ type: 'selection.set', count: 2 }],
      event: { type: 'edit.start' },
      reason: 'requires-single-selection',
    },
    {
      name: 'transformar sin selección',
      setup: [],
      event: { type: 'transform.start', kind: 'drag' },
      reason: 'no-selection',
    },
    {
      name: 'transformar dos veces',
      setup: [{ type: 'selection.set', count: 1 }, { type: 'transform.start', kind: 'drag' }],
      event: { type: 'transform.start', kind: 'resize' },
      reason: 'already-transforming',
    },
    {
      name: 'terminar transform inexistente',
      setup: [],
      event: { type: 'transform.end' },
      reason: 'no-transform-in-progress',
    },
    {
      name: 'confirmar edición inexistente',
      setup: [{ type: 'selection.set', count: 1 }],
      event: { type: 'edit.commit' },
      reason: 'not-editing',
    },
  ];

  rejections.forEach(({ name, setup, event, reason }) => {
    it(`rechaza ${name} con motivo "${reason}"`, () => {
      const before = run(setup);
      const after = interactionReducer(before, event);

      expect(after.lastRejection).toEqual({ event: event.type, reason });
      // El estado funcional no cambia: solo se anota el rechazo.
      expect(after.phase).toBe(before.phase);
      expect(after.selectionCount).toBe(before.selectionCount);
      expect(after.transform).toBe(before.transform);
      expect(after.editing).toBe(before.editing);
    });
  });

  it('canApplyInteractionEvent anticipa el guard sin mutar', () => {
    const state = run([{ type: 'selection.set', count: 2 }]);

    expect(canApplyInteractionEvent(state, { type: 'edit.start' })).toBe(false);
    expect(canApplyInteractionEvent(state, { type: 'transform.start', kind: 'drag' })).toBe(true);
  });
});

describe('modal', () => {
  it('bloquea transform y edición sin borrar la selección', () => {
    const state = run([{ type: 'selection.set', count: 3 }, { type: 'modal.open' }]);

    expect(state.phase).toBe('modal');
    expect(state.selectionCount).toBe(3);

    const drag = interactionReducer(state, { type: 'transform.start', kind: 'drag' });
    const edit = interactionReducer(state, { type: 'edit.start' });

    expect(drag.lastRejection).toEqual({ event: 'transform.start', reason: 'modal-open' });
    expect(edit.lastRejection).toEqual({ event: 'edit.start', reason: 'modal-open' });
    expect(drag.selectionCount).toBe(3);
  });

  it('al cerrarse devuelve la fase que corresponde a la selección viva', () => {
    const state = run([
      { type: 'selection.set', count: 1 },
      { type: 'modal.open' },
      { type: 'modal.close' },
    ]);

    expect(state.phase).toBe('selected-single');
    expect(state.selectionCount).toBe(1);
  });

  it('abrir un modal durante un arrastre lo cancela pero conserva la selección', () => {
    const state = run([
      { type: 'selection.set', count: 2 },
      { type: 'transform.start', kind: 'drag' },
      { type: 'modal.open' },
    ]);

    expect(state.transform).toBeNull();
    expect(state.selectionCount).toBe(2);
  });
});

describe('pureza', () => {
  it('no muta el estado recibido', () => {
    const state = run([{ type: 'selection.set', count: 1 }]);
    const snapshot = JSON.parse(JSON.stringify(state)) as InteractionMachineState;

    interactionReducer(state, { type: 'transform.start', kind: 'drag' });
    interactionReducer(state, { type: 'edit.start' });

    expect(state).toEqual(snapshot);
  });

  it('mismo estado y evento producen el mismo resultado', () => {
    const state = run([{ type: 'selection.set', count: 1 }]);
    const event: InteractionEvent = { type: 'transform.start', kind: 'resize' };

    expect(interactionReducer(state, event)).toEqual(interactionReducer(state, event));
  });

  it('cambiar de selección cierra la edición en curso', () => {
    const state = run([
      { type: 'selection.set', count: 1 },
      { type: 'edit.start' },
      { type: 'selection.set', count: 2 },
    ]);

    expect(state.editing).toBe(false);
    expect(state.phase).toBe('selected-multi');
  });

  it('reset vuelve al estado inicial', () => {
    const state = run([
      { type: 'selection.set', count: 4 },
      { type: 'modal.open' },
      { type: 'reset' },
    ]);

    expect(state).toEqual(initialInteractionMachineState);
  });
});

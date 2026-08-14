import { describe, expect, it } from 'vitest';
import { mergeFormInputRows } from '../../../../../src/sisad-pdfme/ui/Form';
import {
  applySchemaInteraction,
  createSchemaInteractionState,
} from '../../../../../src/sisad-pdfme/runtime/schemaInteractionState';

type State = {
  initialValue: string;
  currentValue: string;
  touched: boolean;
  dirty: boolean;
  interactionCount: number;
  origin: 'initial' | 'host' | 'user';
};

const applyChange = (state: State, value: string, origin: State['origin']): State => ({
  ...state,
  currentValue: value,
  touched: origin === 'user' ? true : state.touched,
  dirty: value !== state.initialValue,
  interactionCount: state.interactionCount + (origin === 'user' ? 1 : 0),
  origin,
});

describe('Form schema interaction projection', () => {
  it.each([
    ['zero', 0],
    ['false', false],
  ])('completes required scalar %s without truthiness', (_label, value) => {
    const initial = createSchemaInteractionState({
      schemaUid: 'field', schemaName: 'field', schemaType: 'input', initialValue: '',
      policy: { required: true },
    });
    const next = applySchemaInteraction(initial, value, 'user', { required: true });
    expect(next.valid).toBe(true);
    expect(next.completed).toBe(true);
  });

  it('does not complete a required empty array unless a policy allows it', () => {
    const initial = createSchemaInteractionState({
      schemaUid: 'group', schemaName: 'group', schemaType: 'checkboxGroup', initialValue: [],
      policy: { required: true },
    });
    const next = applySchemaInteraction(initial, [], 'user', { required: true });
    expect(next.valid).toBe(false);
    expect(next.completed).toBe(false);
  });

  it('preserves schema A when a controlled Form row updates only schema B', () => {
    expect(mergeFormInputRows([{ schemaA: 'A', schemaB: '' }], [{ schemaB: 'B' }])).toEqual([
      { schemaA: 'A', schemaB: 'B' },
    ]);
  });

  it('clears a sibling only when the host sends an explicit empty value', () => {
    expect(mergeFormInputRows([{ schemaA: 'A', schemaB: 'B' }], [{ schemaB: '' }])).toEqual([
      { schemaA: 'A', schemaB: '' },
    ]);
  });

  it('keeps host pushes separate from user interaction', () => {
    const initial: State = {
      initialValue: '',
      currentValue: '',
      touched: false,
      dirty: false,
      interactionCount: 0,
      origin: 'initial',
    };
    const host = applyChange(initial, 'prefill', 'host');
    const user = applyChange(host, 'edited', 'user');

    expect(host).toMatchObject({ touched: false, dirty: true, interactionCount: 0, origin: 'host' });
    expect(user).toMatchObject({ touched: true, dirty: true, interactionCount: 1, origin: 'user' });
  });

  it('preserves zero and false-like values as non-empty string values', () => {
    const zero = applyChange({
      initialValue: '', currentValue: '', touched: false, dirty: false, interactionCount: 0, origin: 'initial',
    }, '0', 'user');
    const falseValue = applyChange({ ...zero }, 'false', 'user');

    expect(zero.currentValue).toBe('0');
    expect(zero.dirty).toBe(true);
    expect(falseValue.currentValue).toBe('false');
    expect(falseValue.interactionCount).toBe(2);
  });
});

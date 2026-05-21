import { describe, expect, test } from 'vitest';
import {
  InMemoryExternalFormStorage,
  areAllRequiredFieldsComplete,
  getSchemaVisibility,
} from '../../src/sisad-pdfme/externalForms/externalFormRunner';

const flowMyTurn = { completedRecipients: [], currentStep: 1, totalSteps: 3 };
const flowNotMyTurn = { completedRecipients: ['recipient-a'], currentStep: 2, totalSteps: 3 };

describe('externalFormRunner visibility and storage contracts', () => {
  test('getSchemaVisibility enforces precedence: readonly > signature-completed > scope', () => {
    const readonlyVisibility = getSchemaVisibility(
      { scope: 'global' },
      'schema-1',
      true,
      'recipient-a',
      flowMyTurn,
      false,
      false,
    );
    expect(readonlyVisibility).toBe('readonly');

    const signedVisibility = getSchemaVisibility(
      { scope: 'recipient', recipientId: 'recipient-a' },
      'signature-1',
      false,
      'recipient-a',
      flowMyTurn,
      true,
      true,
    );
    expect(signedVisibility).toBe('readonly');
  });

  test('getSchemaVisibility resolves scope behavior for global, recipient and group', () => {
    const globalMine = getSchemaVisibility(undefined, 'schema-global', false, 'recipient-a', flowMyTurn, false, false);
    expect(globalMine).toBe('editable');

    const globalNotMyTurn = getSchemaVisibility(
      undefined,
      'schema-global',
      false,
      'recipient-a',
      flowNotMyTurn,
      false,
      false,
    );
    expect(globalNotMyTurn).toBe('readonly');

    const recipientMine = getSchemaVisibility(
      { scope: 'recipient', recipientId: 'recipient-a' },
      'schema-recipient',
      false,
      'recipient-a',
      flowMyTurn,
      false,
      false,
    );
    expect(recipientMine).toBe('editable');

    const recipientOther = getSchemaVisibility(
      { scope: 'recipient', recipientId: 'recipient-b' },
      'schema-other',
      false,
      'recipient-a',
      flowMyTurn,
      false,
      false,
    );
    expect(recipientOther).toBe('hidden');

    const group = getSchemaVisibility(
      { scope: 'group', groupId: 'legal' },
      'schema-group',
      false,
      'recipient-a',
      flowMyTurn,
      false,
      false,
    );
    expect(group).toBe('editable');
  });

  test('required-field completion requires all editable schema inputs to exist and be defined', () => {
    const storage = new InMemoryExternalFormStorage();
    storage.saveInput('schema-1', 'John');
    storage.saveInput('schema-2', undefined);

    expect(areAllRequiredFieldsComplete(['schema-1'], storage)).toBe(true);
    expect(areAllRequiredFieldsComplete(['schema-1', 'schema-2'], storage)).toBe(false);

    storage.saveInput('schema-2', 'approved');
    expect(areAllRequiredFieldsComplete(['schema-1', 'schema-2'], storage)).toBe(true);
  });

  test('in-memory storage isolates recipient inputs and supports scoped clear', () => {
    const storage = new InMemoryExternalFormStorage();
    storage.registerSchemaForRecipient('schema-a1', 'recipient-a');
    storage.registerSchemaForRecipient('schema-a2', 'recipient-a');
    storage.registerSchemaForRecipient('schema-b1', 'recipient-b');

    storage.saveInput('schema-a1', 'A1');
    storage.saveInput('schema-a2', 'A2');
    storage.saveInput('schema-b1', 'B1');

    expect(storage.getInputs('recipient-a')).toEqual({ 'schema-a1': 'A1', 'schema-a2': 'A2' });
    expect(storage.getInputs('recipient-b')).toEqual({ 'schema-b1': 'B1' });

    storage.clearInputs('recipient-a');
    expect(storage.getInputs('recipient-a')).toEqual({});
    expect(storage.getInputs('recipient-b')).toEqual({ 'schema-b1': 'B1' });

    storage.clearInputs();
    expect(storage.getInputs('recipient-b')).toEqual({});
  });
});

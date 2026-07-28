import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import { actionConfigRegistry } from '@/sisad-pdfme/config/actionConfigRegistry';
import { featureRegistry } from '@/sisad-pdfme/config/featureRegistry';

describe('actionConfigRegistry', () => {
  it('maps delete-schema to its command id and honors selection state', () => {
    const resolved = createSisadPdfmeConfig({});
    const state = actionConfigRegistry['delete-schema'].resolve(resolved, {
      selectionCount: 0,
    });

    expect(state.commandId).toBe('removeSchemas');
    expect(state.executable).toBe(false);
    expect(state.reason).toBe('no-selection');
  });

  it('marks reassign-recipient hidden when assignment is disabled', () => {
    const resolved = createSisadPdfmeConfig({
      assignment: { enabled: false },
    });
    const state = actionConfigRegistry['reassign-recipient'].resolve(resolved, {
      selectionCount: 1,
      recipientCount: 1,
      canEditStructure: true,
    });

    expect(state.visible).toBe(false);
    expect(state.reason).toBe('assignment-disabled');
  });

  it('keeps reassign-recipient aligned with assignment feature state', () => {
    const resolved = createSisadPdfmeConfig({
      assignment: { enabled: true },
      collaboration: { canEditStructure: true },
    });
    const context = {
      selectionCount: 1,
      recipientCount: 0,
      canEditStructure: true,
    };

    const actionState = actionConfigRegistry['reassign-recipient'].resolve(resolved, context);
    const featureState = featureRegistry.assignment.resolve(resolved, context);

    expect(actionState.visible).toBe(featureState.visible);
    expect(actionState.permitted).toBe(featureState.permitted);
    expect(actionState.available).toBe(featureState.available);
    expect(actionState.executable).toBe(featureState.executable);
    expect(actionState.reason).toBe(featureState.reason);
  });
});

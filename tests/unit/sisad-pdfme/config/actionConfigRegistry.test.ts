import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import { actionConfigRegistry } from '@/sisad-pdfme/config/actionConfigRegistry';

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
});

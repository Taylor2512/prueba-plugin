import { describe, expect, it } from 'vitest';
import { resolveReassignActionState } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/ListView/reassignActionState.js';

describe('resolveReassignActionState', () => {
  const baseInput = {
    assignmentEnabled: true,
    reassignVisible: true,
    assignmentModalVisible: true,
    selectedCount: 1,
    assignableRecipientCount: 2,
    hasHandler: true,
    hasAssignableRecipients: true,
    bulkRecipientDisabled: false,
    collaborationContext: { canEditStructure: true, activeRecipient: null },
  } as const;

  it('keeps the button disabled until there are at least two assignable recipients', () => {
    const state = resolveReassignActionState({
      ...baseInput,
      assignableRecipientCount: 1,
    });

    expect(state.showButton).toBe(true);
    expect(state.buttonDisabled).toBe(true);
  });

  it('enables the button once there are at least two assignable recipients', () => {
    const state = resolveReassignActionState(baseInput);

    expect(state.showButton).toBe(true);
    expect(state.buttonDisabled).toBe(false);
  });

  it('keeps the trigger visible even if the modal surface is hidden', () => {
    const state = resolveReassignActionState({
      ...baseInput,
      assignmentModalVisible: false,
    });

    expect(state.showButton).toBe(true);
    expect(state.buttonDisabled).toBe(false);
  });
});

import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';

export type ReassignActionStateInput = {
  assignmentEnabled: boolean;
  reassignVisible: boolean;
  assignmentModalVisible: boolean;
  selectedCount: number;
  hasHandler: boolean;
  hasAssignableRecipients: boolean;
  bulkRecipientDisabled: boolean;
  collaborationContext?: Pick<EffectiveCollaborationContext, 'activeRecipient' | 'canEditStructure'> | null;
};

export type ReassignActionState = {
  showButton: boolean;
  buttonDisabled: boolean;
  showSelectionHint: boolean;
  selectionHintLabel: string | null;
};

export function resolveReassignActionState(input: ReassignActionStateInput): ReassignActionState {
  const selectedCount = Number.isFinite(input.selectedCount) ? Math.max(0, Math.trunc(input.selectedCount)) : 0;
  const hasActiveRecipient = Boolean(input.collaborationContext?.activeRecipient);
  const canEditStructure = input.collaborationContext?.canEditStructure !== false;
  const canOpenAction =
    input.assignmentEnabled &&
    input.reassignVisible &&
    input.assignmentModalVisible &&
    hasActiveRecipient &&
    canEditStructure &&
    input.hasHandler &&
    input.hasAssignableRecipients;

  return {
    showButton: canOpenAction && selectedCount > 0,
    buttonDisabled: canOpenAction && input.bulkRecipientDisabled,
    showSelectionHint:
      selectedCount === 0 &&
      input.assignmentEnabled &&
      input.reassignVisible &&
      input.assignmentModalVisible &&
      hasActiveRecipient &&
      canEditStructure &&
      input.hasHandler,
    selectionHintLabel: selectedCount === 0 ? 'Selecciona campos' : null,
  };
}

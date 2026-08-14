export type SisadPdfmeUser = {
  id: string;
  displayName: string;
  color?: string;
  role?: string;
  disabled?: boolean;
  capabilities?: {
    canEdit?: boolean;
    canSign?: boolean;
    canApprove?: boolean;
    canDecline?: boolean;
    canAttach?: boolean;
    canComment?: boolean;
    canEditStructure?: boolean;
  };
  metadata?: Record<string, unknown>;
  hostReference?: { type: string; id: string };
};

export type AssignmentMode = 'unassigned' | 'single' | 'multiple' | 'shared';
export type SchemaValueScope = 'shared' | 'per-user';

export type SchemaUserAssignment = {
  mode: AssignmentMode;
  assignedUserId?: string | null;
  assignedUserIds?: string[];
  valueScope?: SchemaValueScope;
};

export type SchemaAccessResult = {
  visible: boolean;
  editable: boolean;
  interactive: boolean;
  selectable: boolean;
  executable: boolean;
  reason:
    | 'active-user'
    | 'shared'
    | 'unassigned'
    | 'other-user'
    | 'missing-active-user'
    | 'disabled-user'
    | 'readonly'
    | 'locked';
};

export type ResolveSchemaAccessInput = {
  mode: 'designer' | 'form' | 'viewer' | 'pdf';
  users?: SisadPdfmeUser[];
  activeUserId?: string | null;
  assignment?: SchemaUserAssignment;
  readonly?: boolean;
  locked?: boolean;
};

const readOnlyResult = (reason: SchemaAccessResult['reason']): SchemaAccessResult => ({
  visible: true, editable: false, interactive: false, selectable: true, executable: false, reason,
});

export const resolveSchemaAccess = (input: ResolveSchemaAccessInput): SchemaAccessResult => {
  if (input.mode === 'viewer' || input.mode === 'pdf') return readOnlyResult('readonly');
  if (input.locked) return readOnlyResult('locked');
  if (input.readonly) return readOnlyResult('readonly');
  if (input.mode === 'designer') {
    return {
      visible: true, editable: true, interactive: false, selectable: true, executable: false,
      reason: 'unassigned',
    };
  }

  const users = input.users ?? [];
  const activeUserId = input.activeUserId ?? null;
  if (users.length > 1 && !activeUserId) return readOnlyResult('missing-active-user');
  const activeUser = users.find((user) => user.id === activeUserId);
  if (activeUser?.disabled) return readOnlyResult('disabled-user');
  if (activeUser?.capabilities?.canEdit === false) return readOnlyResult('readonly');

  const assignment = input.assignment ?? { mode: 'unassigned' as const };
  if (assignment.mode === 'shared') return { visible: true, editable: true, interactive: true, selectable: true, executable: true, reason: 'shared' };
  if (assignment.mode === 'single') {
    const matches = assignment.assignedUserId === activeUserId;
    return matches
      ? { visible: true, editable: true, interactive: true, selectable: true, executable: true, reason: 'active-user' }
      : readOnlyResult('other-user');
  }
  if (assignment.mode === 'multiple') {
    const matches = assignment.assignedUserIds?.includes(activeUserId || '') === true;
    return matches
      ? { visible: true, editable: true, interactive: true, selectable: true, executable: true, reason: 'active-user' }
      : readOnlyResult('other-user');
  }
  return { visible: true, editable: true, interactive: true, selectable: true, executable: true, reason: 'unassigned' };
};

/**
 * reassignActionState — estado del botón "Reasignar responsable" del ListView.
 *
 * Delegación (TASK-ACTIONS-002): el gating genérico (handler, visibility
 * config, selección, permiso estructural) sale de `resolveDesignerActionState`
 * ('reassign-recipient'), la MISMA fuente que usan las demás superficies. Aquí
 * solo se agregan las señales propias del toolbar (recipient activo, lista de
 * asignables y el hint de selección vacía).
 *
 * Semántica preservada: sin permiso estructural o sin config el botón se
 * OCULTA (no se deshabilita); `bulkRecipientDisabled` es el único disabled.
 */
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';
import { resolveDesignerActionState } from '../../shared/designerActionState.js';

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
  const canEditStructure = input.collaborationContext?.canEditStructure !== false;
  // `reassignVisible` ya incorpora assignment.enabled + visibility.actions.reassign.
  const visibleByConfig = input.reassignVisible && input.assignmentModalVisible;

  const action = resolveDesignerActionState('reassign-recipient', {
    hasHandler: input.hasHandler,
    selectionCount: selectedCount,
    canEditStructure,
    visibleByConfig,
  });

  const canOpenAction = action.visible && action.enabled && input.hasAssignableRecipients;

  // Para el hint se evalúan las mismas puertas con selección hipotética (1).
  const gates = resolveDesignerActionState('reassign-recipient', {
    hasHandler: input.hasHandler,
    selectionCount: 1,
    canEditStructure,
    visibleByConfig,
  });

  return {
    showButton: canOpenAction,
    buttonDisabled: canOpenAction && input.bulkRecipientDisabled,
    showSelectionHint:
      selectedCount === 0 && gates.visible && gates.enabled,
    selectionHintLabel: selectedCount === 0 ? 'Selecciona campos' : null,
  };
}

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
 * OCULTA (no se deshabilita). Cuando la acción existe, la selección vacía y
 * los bloqueos del toolbar se resuelven como estado disabled para no perder el
 * affordance en densidades compactas.
 */
import type { EffectiveCollaborationContext } from '../../../../collaborationContext.js';
import {
  describeDisabledReason,
  resolveDesignerActionState,
} from '../../shared/designerActionState.js';

export type ReassignActionStateInput = {
  assignmentEnabled: boolean;
  reassignVisible: boolean;
  assignmentModalVisible: boolean;
  selectedCount: number;
  assignableRecipientCount: number;
  hasHandler: boolean;
  hasAssignableRecipients: boolean;
  bulkRecipientDisabled: boolean;
  collaborationContext?: Pick<EffectiveCollaborationContext, 'activeRecipient' | 'canEditStructure'> | null;
};

export type ReassignActionState = {
  showButton: boolean;
  buttonDisabled: boolean;
  buttonTitle: string;
  showSelectionHint: boolean;
  selectionHintLabel: string | null;
  disabledReasonLabel: string | null;
};

export function resolveReassignActionState(input: ReassignActionStateInput): ReassignActionState {
  const selectedCount = Number.isFinite(input.selectedCount) ? Math.max(0, Math.trunc(input.selectedCount)) : 0;
  const assignableRecipientCount = Number.isFinite(input.assignableRecipientCount)
    ? Math.max(0, Math.trunc(input.assignableRecipientCount))
    : 0;
  const hasEnoughRecipientsForReassign = assignableRecipientCount > 1;
  const canEditStructure = input.collaborationContext?.canEditStructure !== false;
  // `reassignVisible` ya incorpora assignment.enabled + visibility.actions.reassign.
  // El trigger vive en el toolbar; la presencia del modal la resuelve su propia
  // superficie. Si el modal se oculta aquí, el usuario se queda sin affordance
  // para abrir la reasignación aunque la acción esté habilitada.
  const visibleByConfig = input.assignmentEnabled && input.reassignVisible;

  const action = resolveDesignerActionState('reassign-recipient', {
    hasHandler: input.hasHandler !== false,
    selectionCount: selectedCount,
    canEditStructure,
    visibleByConfig,
  });

  // Usamos una selección hipotética para conservar el gating de visibilidad
  // del registry sin esconder el affordance cuando la selección real es 0.
  const visibility = resolveDesignerActionState('reassign-recipient', {
    hasHandler: input.hasHandler !== false,
    selectionCount: 1,
    canEditStructure,
    visibleByConfig,
  });

  const disabledReasonLabel = (() => {
    if (!canEditStructure) return 'No tienes permisos para reasignar';
    if (!visibility.visible) return describeDisabledReason(visibility.reason) || 'Reasignación no disponible';
    if (selectedCount === 0) return 'Selecciona uno o más campos';
    if (!hasEnoughRecipientsForReassign) return 'Se requieren al menos dos responsables';
    if (input.bulkRecipientDisabled || !input.hasAssignableRecipients) return 'No hay responsables asignables';
    if (!input.hasHandler) return 'Acción no disponible';
    if (!action.enabled) return describeDisabledReason(action.reason) || 'No disponible para la selección actual';
    return null;
  })();

  return {
    showButton: canEditStructure && visibility.visible,
    buttonDisabled:
      !canEditStructure ||
      !visibility.visible ||
      !action.enabled ||
      input.bulkRecipientDisabled ||
      !input.hasAssignableRecipients ||
      !input.hasHandler ||
      !hasEnoughRecipientsForReassign ||
      selectedCount === 0,
    buttonTitle: disabledReasonLabel || 'Reasignar responsable',
    showSelectionHint:
      selectedCount === 0 && visibility.visible && visibility.enabled && hasEnoughRecipientsForReassign,
    selectionHintLabel: selectedCount === 0 ? 'Selecciona uno o más campos' : null,
    disabledReasonLabel,
  };
}

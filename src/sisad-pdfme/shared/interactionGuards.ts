/**
 * FASE 2 — Guards e Interaction Layer
 *
 * validateInteraction es el punto de entrada único para cualquier mutación.
 * Ninguna operación sobre un schema debe ocurrir sin pasar por aquí primero.
 *
 * Orden de prioridad de las reglas:
 * 1. source === 'collaboration_remote' → solo verifica readonly, bypasea locks locales
 * 2. isReadonly === true → bloquea todo excepto acciones read-only-safe
 * 3. lockOwner existe && !== currentUserId → locked_by_other_user
 * 4. assignment.scope === 'recipient' && recipientId !== currentRecipientId → wrong_recipient_scope
 * 5. version_conflict detectado → collaboration_conflict
 */
import type { CommandType, ActionSource } from '@sisad-pdfme/shared/commandTypes';
import { MUTATING_ACTIONS, READ_ONLY_SAFE_ACTIONS } from '@sisad-pdfme/shared/commandTypes';

/** Contexto completo de una acción para validación */
export interface InteractionGuardContext {
  schemaUid: string;
  action: CommandType;
  source: ActionSource;
  currentUserId: string;
  currentRecipientId?: string;
  /** userId que tiene el lock activo sobre este schema (si existe) */
  lockOwner?: string;
  /** Timestamp de expiración del lock */
  lockExpiresAt?: number;
  /** De __designer.ownership.readonly */
  isReadonly?: boolean;
  /** Para detectar version_conflict */
  templateVersion?: string;
  /** Para validar scope de assignment */
  assignmentScope?: 'recipient' | 'group' | 'global';
  /** recipientId del dueño del schema (para scope === 'recipient') */
  assignmentRecipientId?: string;
}

export type GuardResult =
  | { allowed: true }
  | {
      allowed: false;
      reason: GuardRejectionReason;
      /** Mensaje localizable para mostrar al usuario */
      message: string;
      /** true = el usuario puede hacer algo para desbloquearlo (esperar, cambiar recipient, etc.) */
      recoverable: boolean;
    };

export type GuardRejectionReason =
  | 'locked_by_other_user'
  | 'locked_by_other_recipient'
  | 'schema_readonly'
  | 'wrong_recipient_scope'
  | 'version_conflict'
  | 'action_not_permitted_for_source'
  | 'collaboration_conflict';

const ALLOWED: GuardResult = { allowed: true };

function denied(
  reason: GuardRejectionReason,
  message: string,
  recoverable: boolean,
): GuardResult {
  return { allowed: false, reason, message, recoverable };
}

/**
 * Valida si una acción está permitida sobre un schema dado el contexto actual.
 * Retorna { allowed: true } o { allowed: false, reason, message, recoverable }.
 */
export function validateInteraction(ctx: InteractionGuardContext): GuardResult {
  const isMutating = MUTATING_ACTIONS.has(ctx.action);
  const isReadOnlySafe = READ_ONLY_SAFE_ACTIONS.has(ctx.action);

  // Regla 1: collaboration_remote bypasea locks locales
  // Solo respeta readonly
  if (ctx.source === 'collaboration_remote') {
    if (ctx.isReadonly && isMutating) {
      return denied(
        'schema_readonly',
        'Este campo está marcado como solo lectura y no puede ser modificado.',
        false,
      );
    }
    return ALLOWED;
  }

  // Regla 2: schema readonly bloquea todas las mutaciones
  if (ctx.isReadonly && isMutating && !isReadOnlySafe) {
    return denied(
      'schema_readonly',
      'Este campo está protegido contra edición.',
      false,
    );
  }

  // Regla 3: lock de otro usuario bloquea mutaciones
  if (ctx.lockOwner && ctx.lockOwner !== ctx.currentUserId && isMutating) {
    const isExpired = ctx.lockExpiresAt != null && ctx.lockExpiresAt < Date.now();
    if (!isExpired) {
      return denied(
        'locked_by_other_user',
        'Otro usuario está editando este campo en este momento. Espera a que lo libere.',
        true,
      );
    }
    // Lock expirado → se trata como libre (debería haberse purgado)
  }

  // Regla 4: scope del assignment no coincide con el recipient actual
  if (
    ctx.assignmentScope === 'recipient' &&
    ctx.assignmentRecipientId &&
    ctx.currentRecipientId &&
    ctx.assignmentRecipientId !== ctx.currentRecipientId &&
    isMutating
  ) {
    return denied(
      'wrong_recipient_scope',
      'Este campo pertenece a otro destinatario y no puede ser editado por ti.',
      false,
    );
  }

  return ALLOWED;
}

/**
 * Valida un conjunto de schemas para una operación bulk.
 * Retorna un Map<schemaUid, GuardResult> con el resultado de cada uno.
 */
export function validateBulkInteraction(
  schemas: InteractionGuardContext[],
): Map<string, GuardResult> {
  const results = new Map<string, GuardResult>();
  for (const ctx of schemas) {
    results.set(ctx.schemaUid, validateInteraction(ctx));
  }
  return results;
}

/**
 * Helper: devuelve los schemaUids que están bloqueados en una operación bulk.
 */
export function getBlockedSchemas(
  results: Map<string, GuardResult>,
): string[] {
  const blocked: string[] = [];
  for (const [uid, result] of results.entries()) {
    if (!result.allowed) blocked.push(uid);
  }
  return blocked;
}

/**
 * Helper: devuelve los schemaUids que están permitidos en una operación bulk.
 */
export function getAllowedSchemas(
  results: Map<string, GuardResult>,
): string[] {
  const allowed: string[] = [];
  for (const [uid, result] of results.entries()) {
    if (result.allowed) allowed.push(uid);
  }
  return allowed;
}

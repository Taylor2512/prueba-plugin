/**
 * recipientPermissionResolver — permisos derivados de recipients.
 *
 * Rol arquitectónico:
 * - Decide QUÉ puede hacer un recipient (editar estructura, reasignar), sin
 *   renderizar UI ni conocer al host. `visibility` decide qué se muestra;
 *   aquí se decide qué se puede ejecutar.
 *
 * Regla por defecto (alineada con `collaborationContext.resolveCanEditStructure`):
 * los roles viewer/reviewer/commenter no editan estructura ni reasignan.
 */
import type {
  OwnerAwareSchemaLike,
  SisadPdfmeRecipient,
  SisadPdfmeRecipientsConfig,
} from './recipientTypes.js';

const READONLY_ROLES = new Set(['viewer', 'reviewer', 'commenter']);

const normalizeRole = (recipient: SisadPdfmeRecipient | null | undefined) =>
  String(recipient?.role ?? '').trim().toLowerCase();

export type RecipientPermissionResolver = {
  canEditStructure(recipient: SisadPdfmeRecipient | null): boolean;
  canAssign(schema: OwnerAwareSchemaLike | null, recipient: SisadPdfmeRecipient | null): boolean;
  canUnassign(recipient: SisadPdfmeRecipient | null): boolean;
  canShare(recipient: SisadPdfmeRecipient | null): boolean;
};

export type RecipientPermissionResolverOptions = {
  config?: SisadPdfmeRecipientsConfig;
  /** Override explícito del host (true/false gana sobre la regla por rol). */
  canEditStructure?: boolean;
};

export const createRecipientPermissionResolver = (
  options: RecipientPermissionResolverOptions = {},
): RecipientPermissionResolver => {
  const config = options.config ?? {};

  const canEditStructure = (recipient: SisadPdfmeRecipient | null): boolean => {
    if (typeof options.canEditStructure === 'boolean') return options.canEditStructure;
    if (recipient?.disabled === true) return false;
    return !READONLY_ROLES.has(normalizeRole(recipient));
  };

  return {
    canEditStructure,

    canAssign: (schema, recipient) => {
      if (!canEditStructure(recipient)) return false;
      // Un schema explícitamente bloqueado no se reasigna desde aquí; el flujo
      // de assignment preserva locks pero no los salta.
      if (schema && (schema as { locked?: unknown }).locked === true) return false;
      return true;
    },

    canUnassign: (recipient) =>
      canEditStructure(recipient) && config.allowUnassigned !== false,

    canShare: (recipient) =>
      canEditStructure(recipient) && config.allowShared !== false,
  };
};

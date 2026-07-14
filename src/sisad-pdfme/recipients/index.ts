/**
 * recipients — fachada del Recipient Registry.
 *
 * Fuente única de verdad de recipients/activeRecipient/colores/permisos.
 * Consumida por config, react wrappers, controller, snapshot y eventos.
 */
export type {
  OwnerAwareSchemaLike,
  SchemaOwnerAppearance,
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipient,
  SisadPdfmeRecipientRegistry,
  SisadPdfmeRecipientRegistryEvents,
  SisadPdfmeRecipientRegistryState,
  SisadPdfmeRecipientsConfig,
  SisadPdfmeRecipientsSnapshot,
} from './recipientTypes.js';
export {
  createRecipientRegistry,
  normalizeRecipients,
  type CreateRecipientRegistryOptions,
} from './recipientRegistry.js';
export {
  buildAssignmentContextFromRegistry,
  buildCollaborationSyncFromRegistry,
  buildRecipientOptionsFromRegistry,
  resolveOwnerRecipientId,
  resolveSchemaOwnerAppearance,
  type AssignmentContextFromRegistry,
  type CollaborationSyncFromRegistryOptions,
  type RegistryRecipientOption,
} from './recipientResolver.js';
export {
  buildRecipientColorMap,
  resolveRecipientColors,
  LAB_COLLABORATOR_PALETTE,
  type RecipientColorResolverOptions,
} from './recipientColorResolver.js';
export {
  createRecipientPermissionResolver,
  type RecipientPermissionResolver,
  type RecipientPermissionResolverOptions,
} from './recipientPermissionResolver.js';
export {
  recipientsFromSnapshot,
  recipientsToSnapshot,
} from './recipientSnapshot.js';
export {
  useRecipientRegistry,
  type RecipientsAdapterLike,
  type UseRecipientRegistryOptions,
  type UseRecipientRegistryResult,
} from './useRecipientRegistry.js';

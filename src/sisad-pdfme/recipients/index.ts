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
} from '@sisad-pdfme/recipients/recipientTypes';
export {
  createRecipientRegistry,
  normalizeRecipients,
  type CreateRecipientRegistryOptions,
} from '@sisad-pdfme/recipients/recipientRegistry';
export {
  buildAssignmentContextFromRegistry,
  buildCollaborationSyncFromRegistry,
  buildRecipientOptionsFromRegistry,
  resolveOwnerRecipientId,
  resolveSchemaOwnerAppearance,
  type AssignmentContextFromRegistry,
  type CollaborationSyncFromRegistryOptions,
  type RegistryRecipientOption,
} from '@sisad-pdfme/recipients/recipientResolver';
export {
  buildRecipientColorMap,
  resolveRecipientColors,
  LAB_COLLABORATOR_PALETTE,
  type RecipientColorResolverOptions,
} from '@sisad-pdfme/recipients/recipientColorResolver';
export {
  createRecipientPermissionResolver,
  type RecipientPermissionResolver,
  type RecipientPermissionResolverOptions,
} from '@sisad-pdfme/recipients/recipientPermissionResolver';
export {
  recipientsFromSnapshot,
  recipientsToSnapshot,
} from '@sisad-pdfme/recipients/recipientSnapshot';
export {
  useRecipientRegistry,
  type RecipientsAdapterLike,
  type UseRecipientRegistryOptions,
  type UseRecipientRegistryResult,
} from '@sisad-pdfme/recipients/useRecipientRegistry';

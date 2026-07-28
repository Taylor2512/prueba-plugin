import { describe, expect, it } from 'vitest';
import * as recipientsApi from '@/sisad-pdfme/recipients';
import type {
  OwnerAwareSchemaLike,
  SchemaOwnerAppearance,
  SisadPdfmeAssignmentChangePayload,
  SisadPdfmeRecipient,
  SisadPdfmeRecipientRegistry,
  SisadPdfmeRecipientRegistryEvents,
  SisadPdfmeRecipientRegistryState,
  SisadPdfmeRecipientsConfig,
  SisadPdfmeRecipientsSnapshot,
  CreateRecipientRegistryOptions,
  AssignmentContextFromRegistry,
  CollaborationSyncFromRegistryOptions,
  RegistryRecipientOption,
  RecipientColorResolverOptions,
  RecipientPermissionResolver,
  RecipientPermissionResolverOptions,
  RecipientsAdapterLike,
  UseRecipientRegistryOptions,
  UseRecipientRegistryResult,
} from '@/sisad-pdfme/recipients';

type _RecipientsTypeContract = {
  ownerAwareSchema: OwnerAwareSchemaLike;
  schemaOwnerAppearance: SchemaOwnerAppearance;
  assignmentChangePayload: SisadPdfmeAssignmentChangePayload;
  recipient: SisadPdfmeRecipient;
  recipientRegistry: SisadPdfmeRecipientRegistry;
  recipientRegistryEvents: SisadPdfmeRecipientRegistryEvents;
  recipientRegistryState: SisadPdfmeRecipientRegistryState;
  recipientsConfig: SisadPdfmeRecipientsConfig;
  recipientsSnapshot: SisadPdfmeRecipientsSnapshot;
  createRecipientRegistryOptions: CreateRecipientRegistryOptions;
  assignmentContext: AssignmentContextFromRegistry;
  collaborationOptions: CollaborationSyncFromRegistryOptions;
  registryRecipientOption: RegistryRecipientOption;
  colorResolverOptions: RecipientColorResolverOptions;
  permissionResolver: RecipientPermissionResolver;
  permissionResolverOptions: RecipientPermissionResolverOptions;
  recipientsAdapterLike: RecipientsAdapterLike;
  useRecipientRegistryOptions: UseRecipientRegistryOptions;
  useRecipientRegistryResult: UseRecipientRegistryResult;
};

describe('sisad-pdfme recipients public surface', () => {
  it('exposes the recipients barrel exports', () => {
    const recipientsSurface = [
      recipientsApi.createRecipientRegistry,
      recipientsApi.normalizeRecipients,
      recipientsApi.buildAssignmentContextFromRegistry,
      recipientsApi.buildCollaborationSyncFromRegistry,
      recipientsApi.buildRecipientOptionsFromRegistry,
      recipientsApi.resolveOwnerRecipientId,
      recipientsApi.resolveSchemaOwnerAppearance,
      recipientsApi.buildRecipientColorMap,
      recipientsApi.resolveRecipientColors,
      recipientsApi.LAB_COLLABORATOR_PALETTE,
      recipientsApi.createRecipientPermissionResolver,
      recipientsApi.recipientsFromSnapshot,
      recipientsApi.recipientsToSnapshot,
      recipientsApi.useRecipientRegistry,
    ];

    expect(recipientsSurface.length).toBe(14);
  });
});

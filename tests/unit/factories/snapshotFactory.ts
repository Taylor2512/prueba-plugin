import type {
  OfficialTemplateSnapshot,
  SnapshotAssignment,
  SnapshotComment,
  SnapshotDocument,
  SnapshotPage,
  SnapshotRecipient,
  SignatureConfig,
  ProviderConfig,
} from '../../../src/sisad-pdfme/shared/snapshot.js';
import type { DesignerState } from '../../../src/sisad-pdfme/shared/snapshotAdapter.js';
import { SNAPSHOT_VERSION } from '../../../src/sisad-pdfme/shared/snapshot.js';
import { fixedIso, stableId } from './_shared.js';
import { makeRecipient } from './recipientFactory.js';
import { makeCommentedSchema, makeReadonlySchema, makeSchema, makeSignatureSchema } from './schemaFactory.js';

export interface SnapshotFactoryOptions {
  version?: string;
  templateId?: string;
  createdAt?: string;
  updatedAt?: string;
  metadata?: Partial<OfficialTemplateSnapshot['metadata']>;
  documents?: SnapshotDocument[];
  recipients?: SnapshotRecipient[];
  assignments?: SnapshotAssignment[];
  signatureConfig?: SignatureConfig;
  providerConfig?: ProviderConfig;
  comments?: SnapshotComment[];
}

export function makeSnapshotRecipient(overrides: Partial<SnapshotRecipient> = {}): SnapshotRecipient {
  return makeRecipient({
    id: overrides.id ?? 'rec-1',
    name: overrides.name ?? 'Cliente',
    color: overrides.color ?? '#3B82F6',
    role: overrides.role,
    order: overrides.order,
  });
}

export function makeSnapshotPage(overrides: Partial<SnapshotPage> = {}): SnapshotPage {
  return {
    pageNumber: overrides.pageNumber ?? 1,
    schemas: overrides.schemas ?? [
      makeSchema({ id: 'schema-text-1', schemaUid: 'uid-text-1', name: 'campo_texto' }),
      makeSignatureSchema({ id: 'schema-sign-1', schemaUid: 'uid-sign-1', name: 'firma_cliente' }),
    ],
    background: overrides.background ?? { type: 'none' },
  };
}

export function makeSnapshotDocument(overrides: Partial<SnapshotDocument> = {}): SnapshotDocument {
  return {
    documentId: overrides.documentId ?? stableId('doc', overrides.name ?? 'principal'),
    name: overrides.name ?? 'Documento 1',
    order: overrides.order ?? 0,
    pages: overrides.pages ?? [makeSnapshotPage()],
  };
}

export function makeSnapshotAssignment(overrides: Partial<SnapshotAssignment> = {}): SnapshotAssignment {
  return {
    schemaUid: overrides.schemaUid ?? 'uid-text-1',
    recipientId: overrides.recipientId ?? 'rec-1',
    scope: overrides.scope ?? 'recipient',
    readonly: overrides.readonly ?? false,
  };
}

export function makeSignatureConfig(overrides: Partial<SignatureConfig> = {}): SignatureConfig {
  return {
    defaultMode: overrides.defaultMode ?? 'draw',
    allowedModes: overrides.allowedModes ?? ['draw', 'image', 'p12', 'provider'],
    recipientOverrides: overrides.recipientOverrides,
  };
}

export function makeProviderConfig(overrides: Partial<ProviderConfig> = {}): ProviderConfig {
  return {
    defaultProvider: overrides.defaultProvider ?? 'draw',
    allowedProviders: overrides.allowedProviders ?? ['draw', 'image', 'p12'],
    tenantConfig: overrides.tenantConfig,
  };
}

export function makeDesignerState(): DesignerState {
  return {
    documents: [makeSnapshotDocument()],
    recipients: [makeSnapshotRecipient()],
    assignments: [makeSnapshotAssignment()],
    signatureConfig: makeSignatureConfig(),
    providerConfig: makeProviderConfig(),
    comments: [],
  };
}

export function makeSnapshot(options: SnapshotFactoryOptions = {}): OfficialTemplateSnapshot {
  const now = options.createdAt ?? fixedIso();
  return {
    version: options.version ?? SNAPSHOT_VERSION,
    templateId: options.templateId ?? stableId('template', options.metadata?.name ?? 'principal'),
    createdAt: now,
    updatedAt: options.updatedAt ?? now,
    metadata: {
      name: options.metadata?.name ?? 'Plantilla de prueba',
      description: options.metadata?.description,
      createdByUserId: options.metadata?.createdByUserId ?? 'user-1',
      organizationId: options.metadata?.organizationId,
      tags: options.metadata?.tags ?? ['qa'],
    },
    documents: options.documents ?? [makeSnapshotDocument()],
    recipients: options.recipients ?? [makeSnapshotRecipient()],
    assignments: options.assignments ?? [makeSnapshotAssignment()],
    signatureConfig: options.signatureConfig ?? makeSignatureConfig(),
    providerConfig: options.providerConfig ?? makeProviderConfig(),
    comments: options.comments ?? [
      {
        commentId: 'comment-1',
        schemaUid: 'uid-text-1',
        authorUserId: 'user-1',
        authorName: 'QA',
        text: 'Comentario de prueba',
        createdAt: now,
        resolved: false,
      },
    ],
  };
}

export function makeLegacySnapshot(): Record<string, unknown> {
  return {
    name: 'Plantilla legacy',
    schemas: [[makeCommentedSchema({ name: 'campo_legacy', id: 'legacy-1' })]],
    basePdf: 'https://example.com/base.pdf',
  };
}

export function makeInvalidSnapshot(): Record<string, unknown> {
  return {
    version: '2.0.0',
    templateId: 42,
    documents: null,
  };
}

export function makeMigrableLegacySnapshot(): Record<string, unknown> {
  return makeLegacySnapshot();
}

export function makeCorruptSnapshot(): Record<string, unknown> {
  return {
    version: SNAPSHOT_VERSION,
    templateId: null,
    metadata: 'invalid',
    documents: [{ id: null }],
  };
}

export function makeReadonlySnapshot(): OfficialTemplateSnapshot {
  return makeSnapshot({
    documents: [
      {
        documentId: 'doc-1',
        name: 'Documento solo lectura',
        order: 0,
        pages: [
          {
            pageNumber: 1,
            background: { type: 'none' },
            schemas: [makeReadonlySchema({ id: 'schema-readonly-1', schemaUid: 'uid-readonly-1', name: 'campo_ro' })],
          },
        ],
      },
    ],
  });
}

export function makeMultiRecipientSnapshot(): OfficialTemplateSnapshot {
  return makeSnapshot({
    recipients: [
      makeSnapshotRecipient({ id: 'rec-1', name: 'Titular', color: '#3B82F6', order: 0 }),
      makeSnapshotRecipient({ id: 'rec-2', name: 'Aval', color: '#10B981', order: 1 }),
    ],
    assignments: [
      makeSnapshotAssignment({ schemaUid: 'uid-text-1', recipientId: 'rec-1', scope: 'recipient' }),
      makeSnapshotAssignment({ schemaUid: 'uid-sign-1', recipientId: 'rec-2', scope: 'recipient' }),
    ],
  });
}

export function makeV3ValidSnapshot(): OfficialTemplateSnapshot {
  return makeSnapshot({ version: SNAPSHOT_VERSION });
}

export function makeV3InvalidSnapshot(): Record<string, unknown> {
  return makeInvalidSnapshot();
}

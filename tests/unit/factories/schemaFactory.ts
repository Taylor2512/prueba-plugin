import type { SchemaDesignerMeta, GroupMeta } from '../../../src/sisad-pdfme/shared/schemaDesignerMeta.js';
import type { ValidatableSchema } from '../../../src/sisad-pdfme/shared/templateValidator.js';
import { fixedIso, stableId } from './_shared.js';

export interface SchemaDesignerMetaFixtureOptions {
  schemaUid?: string;
  templateVersion?: string;
  documentId?: string;
  pageNumber?: number;
  variant?: string;
  recipientId?: string;
  recipientName?: string;
  recipientColor?: string;
  assignmentScope?: 'recipient' | 'group' | 'global';
  ownerUserId?: string;
  readonly?: boolean;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
  integration?: Record<string, unknown>;
  signature?: SchemaDesignerMeta['signature'];
  group?: GroupMeta;
}

export interface SchemaFactoryOptions {
  id?: string;
  name?: string;
  type?: string;
  position?: { x: number; y: number };
  width?: number;
  height?: number;
  required?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  ownerRecipientId?: string;
  recipientId?: string;
  recipientName?: string;
  recipientColor?: string;
  documentId?: string;
  pageNumber?: number;
  templateVersion?: string;
  schemaUid?: string;
  variant?: string;
  designer?: SchemaDesignerMetaFixtureOptions;
  extra?: Record<string, unknown>;
}

function buildDesignerMeta(options: Required<Pick<SchemaFactoryOptions, 'documentId' | 'pageNumber' | 'templateVersion'>> & SchemaDesignerMetaFixtureOptions): SchemaDesignerMeta {
  const now = options.createdAt ?? fixedIso();
  const schemaUid = options.schemaUid
    ?? stableId('uid', options.templateVersion, options.documentId, options.pageNumber, options.recipientId ?? 'global', options.variant);

  const assignmentScope = options.assignmentScope ?? (options.recipientId ? 'recipient' : 'global');
  const assignment = {
    scope: assignmentScope,
    ...(options.recipientId ? { recipientIds: [options.recipientId] } : {}),
    ...(assignmentScope === 'group' ? { groupIds: ['group-1'] } : {}),
  };

  const ownership = {
    ...(options.ownerUserId ? { ownerUserId: options.ownerUserId } : {}),
    ...(options.readonly !== undefined ? { readonly: options.readonly } : {}),
  };

  const meta: SchemaDesignerMeta = {
    schemaUid,
    templateVersion: options.templateVersion,
    documentId: options.documentId,
    pageNumber: options.pageNumber,
    ...(options.recipientId ? { recipientId: options.recipientId } : {}),
    ...(options.recipientName ? { recipientName: options.recipientName } : {}),
    ...(options.recipientColor ? { recipientColor: options.recipientColor } : {}),
    assignment,
    ...(Object.keys(ownership).length > 0 ? { ownership } : {}),
    ...(options.signature ? { signature: options.signature } : {}),
    ...(options.group ? { group: options.group } : {}),
    ...(options.integration ? { integration: options.integration } : {}),
    version: options.version ?? 0,
    createdAt: now,
    updatedAt: options.updatedAt ?? now,
  };

  return meta;
}

export function makeSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  const type = options.type ?? 'text';
  const name = options.name ?? 'campo_prueba';
  const variant = options.variant ? `-${options.variant}` : '';
  const id = options.id ?? stableId('schema', type, name, variant);
  const schemaUid = options.schemaUid ?? stableId('uid', type, name, variant);

  return {
    id,
    name,
    type,
    position: options.position ?? { x: 10, y: 10 },
    width: options.width ?? 100,
    height: options.height ?? 20,
    required: options.required ?? false,
    readOnly: options.readOnly ?? false,
    hidden: options.hidden ?? false,
    ownerRecipientId: options.ownerRecipientId,
    recipientId: options.recipientId,
    __designer: buildDesignerMeta({
      documentId: options.documentId ?? 'doc-1',
      pageNumber: options.pageNumber ?? 1,
      templateVersion: options.templateVersion ?? '2.0.0',
      schemaUid,
      recipientId: options.recipientId,
      recipientName: options.recipientName,
      recipientColor: options.recipientColor,
      ...options.designer,
    }),
    ...options.extra,
  };
}

export function makeTextSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    type: 'text',
    extra: {
      placeholder: 'Texto de ejemplo',
      multiline: false,
      ...options.extra,
    },
  });
}

export function makeCheckboxSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    type: 'checkbox',
    width: options.width ?? 20,
    height: options.height ?? 20,
    extra: {
      content: 'true',
      checked: false,
      ...options.extra,
    },
  });
}

export function makeRadioGroupSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    type: 'radioGroup',
    width: options.width ?? 120,
    height: options.height ?? 24,
    extra: {
      options: [
        { label: 'Opcion 1', value: 'option-1' },
        { label: 'Opcion 2', value: 'option-2' },
      ],
      value: 'option-1',
      groupId: options.designer?.group?.groupId ?? 'group-radio-1',
      ...options.extra,
    },
  });
}

export function makeSelectSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    type: 'select',
    width: options.width ?? 120,
    height: options.height ?? 24,
    extra: {
      options: [
        { label: 'Opcion 1', value: 'option-1' },
        { label: 'Opcion 2', value: 'option-2' },
      ],
      defaultValue: 'option-1',
      ...options.extra,
    },
  });
}

export function makeSignatureSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    type: 'signature',
    width: options.width ?? 160,
    height: options.height ?? 60,
    extra: {
      mode: 'draw',
      signatureProvider: 'draw',
      ...options.extra,
    },
  });
}

export function makeTableSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    type: 'table',
    width: options.width ?? 240,
    height: options.height ?? 120,
    extra: {
      rows: 2,
      columns: 2,
      ...options.extra,
    },
  });
}

export function makeLegacySchema(options: SchemaFactoryOptions = {}): Record<string, unknown> {
  const schema = makeSchema(options);
  const { __designer, ...legacy } = schema;
  return legacy;
}

export function makeLockedSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    designer: {
      ownerUserId: 'user-lock-owner',
      ...options.designer,
    },
  });
}

export function makeReadonlySchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    readOnly: true,
    designer: {
      readonly: true,
      ...options.designer,
    },
  });
}

export function makeGlobalAssignmentSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    recipientId: undefined,
    designer: {
      assignmentScope: 'global',
      ...options.designer,
    },
  });
}

export function makeRecipientAssignmentSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  const recipientId = options.recipientId ?? 'rec-1';
  return makeSchema({
    ...options,
    recipientId,
    designer: {
      assignmentScope: 'recipient',
      recipientId,
      recipientName: options.recipientName ?? 'Cliente',
      recipientColor: options.recipientColor ?? '#3B82F6',
      ...options.designer,
    },
  });
}

export function makeCommentedSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSchema({
    ...options,
    extra: {
      comments: [
        {
          commentId: 'comment-1',
          text: 'Comentario de prueba',
        },
      ],
      ...options.extra,
    },
  });
}

export function makeProviderSignatureSchema(options: SchemaFactoryOptions = {}): ValidatableSchema {
  return makeSignatureSchema({
    ...options,
    designer: {
      signature: {
        mode: 'provider',
        providerKey: 'draw',
        allowedProviders: ['draw'],
      },
      ...options.designer,
    },
  });
}

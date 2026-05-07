import { cloneDeep, type SchemaForUI, type Size } from '@sisad-pdfme/common';
import {
  applySchemaCollaborativeDefaults,
  createSchemaCreationContext,
  DEFAULT_SCHEMA_CONFIG_STORAGE_KEY,
} from '../../../designerEngine.js';
import { uuid, getUniqueSchemaName } from '../../../helper.js';
import { resolveSmartDropPosition, type SmartPlacementInput } from '../Canvas/overlays/smartPlacement.js';

type ClipboardCollaborationContext = {
  fileId?: string | null;
  actorId?: string | null;
  ownerRecipientId?: string | null;
  ownerRecipientIds?: string[];
  ownerRecipientName?: string | null;
  ownerColor?: string | null;
  userColor?: string | null;
};

export type SchemaClipboardPayload = {
  source: 'copy' | 'cut';
  items: SchemaForUI[];
  removeIds: string[];
};

export type SchemaClipboardContext = {
  pageIndex: number;
  pageCount?: number;
  pageSize?: Size;
  fileId?: string | null;
  existingSchemas?: SchemaForUI[];
  collaborationContext?: ClipboardCollaborationContext;
  timestamp?: number;
  resolvePlacement?: (input: SmartPlacementInput) => { x: number; y: number };
};

const transientKeys: string[] = [
  'id',
  'schemaUid',
  'fileId',
  'fileTemplateId',
  'pageNumber',
  'ownerMode',
  'ownerRecipientId',
  'ownerRecipientIds',
  'ownerRecipientName',
  'ownerColor',
  'userColor',
  'createdBy',
  'lastModifiedBy',
  'createdAt',
  'updatedAt',
  'lastModifiedAt',
  'commentsCount',
  'state',
  'lock',
  'comments',
  'commentAnchors',
  'commentsAnchors',
  'collaboration',
];

const asSchemaRecord = (schema: SchemaForUI) => schema as SchemaForUI & Record<string, unknown>;

export const sanitizeCopiedSchema = (schema: SchemaForUI): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaForUI & Record<string, unknown>;
  for (const key of transientKeys) {
    delete next[key];
  }
  next.commentsCount = 0;
  next.lock = undefined;
  next.comments = undefined;
  next.commentAnchors = undefined;
  next.commentsAnchors = undefined;
  next.state = 'draft';
  return next as SchemaForUI;
};

export const copySchemasToClipboard = (schemas: SchemaForUI[]): SchemaClipboardPayload => ({
  source: 'copy',
  items: schemas.map((schema) => sanitizeCopiedSchema(schema)),
  removeIds: [],
});

export const cutSchemasToClipboard = (schemas: SchemaForUI[]): SchemaClipboardPayload => ({
  source: 'cut',
  items: schemas.map((schema) => sanitizeCopiedSchema(schema)),
  removeIds: schemas.map((schema) => schema.id),
});

export const resolvePasteOffset = (index: number) => {
  const offset = index === 0 ? 6 : 8;
  return { x: offset, y: offset };
};

export const resolveUniqueSchemaName = (
  schema: SchemaForUI,
  existingSchemas: SchemaForUI[],
  stackUniqueSchemaNames: string[],
) =>
  getUniqueSchemaName({
    copiedSchemaName: schema.name,
    schema: existingSchemas,
    stackUniqueSchemaNames,
  });

export const buildPastedSchema = (
  schema: SchemaForUI,
  context: SchemaClipboardContext,
  index = 0,
  stackUniqueSchemaNames: string[] = [],
): SchemaForUI => {
  const baseSchema = sanitizeCopiedSchema(schema);
  const nextSchemaUid = uuid();
  const targetFileId = context.fileId ?? context.collaborationContext?.fileId ?? undefined;
  const pageNumber = context.pageIndex + 1;
  const existingSchemas = context.existingSchemas || [];
  const offset = resolvePasteOffset(index);
  const sourcePosition = schema.position || { x: 0, y: 0 };
  const sourceSize = { width: schema.width || 0, height: schema.height || 0 };
  const candidate = {
    x: Math.max(0, sourcePosition.x + offset.x),
    y: Math.max(0, sourcePosition.y + offset.y),
  };
  const position =
    context.pageSize && (context.resolvePlacement || existingSchemas.length > 0)
      ? (context.resolvePlacement
          ? context.resolvePlacement({
              candidate,
              pageSize: context.pageSize,
              schemaSize: sourceSize,
              existingSchemas,
              stepMm: offset.x,
              maxAttempts: 12,
            })
          : resolveSmartDropPosition({
              candidate,
              pageSize: context.pageSize,
              schemaSize: sourceSize,
              existingSchemas,
              stepMm: offset.x,
              maxAttempts: 12,
            }))
      : candidate;

  const pasted = asSchemaRecord(baseSchema);
  const nextName = resolveUniqueSchemaName(schema, existingSchemas.concat(), stackUniqueSchemaNames);
  pasted.id = nextSchemaUid;
  pasted.schemaUid = nextSchemaUid;
  pasted.name = nextName;
  pasted.position = position;
  pasted.fileId = targetFileId;
  pasted.fileTemplateId = targetFileId;
  pasted.pageNumber = pageNumber;
  pasted.lock = undefined;
  pasted.state = 'draft';
  pasted.commentsCount = 0;
  pasted.createdAt = context.timestamp ?? Date.now();
  pasted.updatedAt = context.timestamp ?? Date.now();
  pasted.lastModifiedAt = context.timestamp ?? Date.now();

  const creationContext = createSchemaCreationContext({
    pageIndex: context.pageIndex,
    pageNumber,
    totalPages: context.pageCount ?? context.pageIndex + 1,
    fileId: targetFileId ?? null,
    timestamp: context.timestamp ?? Date.now(),
    collaboration: {
      actorId: context.collaborationContext?.actorId ?? null,
      ownerRecipientId: context.collaborationContext?.ownerRecipientId ?? null,
      ownerRecipientIds: context.collaborationContext?.ownerRecipientIds,
      ownerRecipientName: context.collaborationContext?.ownerRecipientName ?? null,
      ownerColor: context.collaborationContext?.ownerColor ?? null,
      userColor: context.collaborationContext?.userColor ?? null,
    },
  });

  const withCollaborativeDefaults = applySchemaCollaborativeDefaults(pasted as SchemaForUI, creationContext);
  const designerConfig = (withCollaborativeDefaults as SchemaForUI & Record<string, unknown>)[
    DEFAULT_SCHEMA_CONFIG_STORAGE_KEY
  ];

  if (designerConfig && typeof designerConfig === 'object' && !Array.isArray(designerConfig)) {
    const config = designerConfig as Record<string, unknown>;
    (withCollaborativeDefaults as SchemaForUI & Record<string, unknown>)[DEFAULT_SCHEMA_CONFIG_STORAGE_KEY] = {
      ...config,
      identity: {
        ...((config.identity as Record<string, unknown>) || {}),
        id: nextSchemaUid,
        key: nextName,
      },
    };
  }

  return withCollaborativeDefaults;
};

export const pasteSchemasFromClipboard = (
  clipboard: SchemaClipboardPayload | SchemaForUI[],
  context: SchemaClipboardContext,
): SchemaForUI[] => {
  const items = Array.isArray(clipboard) ? clipboard : clipboard.items;
  const existingSchemas = context.existingSchemas || [];
  const stackUniqueSchemaNames: string[] = [];
  const pasted: SchemaForUI[] = [];

  for (const [index, schema] of items.entries()) {
    const nextExistingSchemas = existingSchemas.concat(pasted);
    const next = buildPastedSchema(schema, { ...context, existingSchemas: nextExistingSchemas }, index, stackUniqueSchemaNames);
    pasted.push(next);
  }

  return pasted;
};

export const duplicateSchemas = (schemas: SchemaForUI[], context: SchemaClipboardContext): SchemaForUI[] =>
  pasteSchemasFromClipboard(copySchemasToClipboard(schemas), context);


import { cloneDeep, type SchemaForUI, type Size } from '@sisad-pdfme/common';
import {
  applySchemaCollaborativeDefaults,
  createSchemaCreationContext,
  DEFAULT_SCHEMA_CONFIG_STORAGE_KEY,
} from '../../../designerEngine.js';
import { uuid } from '../../../helper.js';
import { resolveSmartDropPosition, type SmartPlacementInput } from '../Canvas/overlays/smartPlacement.js';
import { createUniqueSchemaVariableName } from './schemaVariableName.js';
import { filterSchemasByCollisionScope } from './schemaCollision.js';
import { asRecord, isRecord } from './objectGuards.js';

/**
 * Controls how recipient assignment and collaboration metadata are handled
 * when pasting schemas into the designer.
 *
 * - preserveAssignments: keeps the original recipientId/color from the copied schema.
 *   Used when duplicating within the same recipient context.
 * - assignToActiveRecipient: strips legacy assignment and applies the currently active
 *   recipient from collaborationContext. Used when dropping into a different recipient slot.
 */
export type ClipboardPasteMode = 'preserveAssignments' | 'assignToActiveRecipient';

export type PastePolicy = {
  /** Controls assignment behavior on paste. Defaults to 'preserveAssignments'. */
  mode: ClipboardPasteMode;
  /** When false (default), locks are always stripped on paste. */
  preserveLocks?: boolean;
  /** When false (default), comments and commentAnchors are stripped on paste. */
  preserveComments?: boolean;
  /** Placement offset strategy. 'smart' uses collision-avoidance; 'fixed' applies a constant delta. */
  offsetStrategy?: 'smart' | 'fixed';
};

type ClipboardCollaborationContext = {
  fileId?: string | null;
  actorId?: string | null;
  ownerRecipientId?: string | null;
  ownerRecipientIds?: string[];
  ownerRecipientName?: string | null;
  ownerColor?: string | null;
  userColor?: string | null;
};

type SchemaRecord = SchemaForUI & Record<string, unknown>;
type DesignerRecord = Record<string, unknown> & {
  recipientId?: unknown;
  recipientName?: unknown;
  recipientColor?: unknown;
  group?: Record<string, unknown>;
  identity?: Record<string, unknown>;
};
type ClipboardTransientRecord = Record<string, unknown> & {
  lock?: SchemaForUI['lock'];
  comments?: SchemaForUI['comments'];
  commentAnchors?: SchemaForUI['commentAnchors'];
  commentsAnchors?: SchemaForUI['commentsAnchors'];
  __designer?: unknown;
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

const asSchemaRecord = (schema: SchemaForUI): SchemaRecord => schema as SchemaRecord;

const getDesignerRecord = (schema: SchemaForUI): DesignerRecord | undefined => {
  const designer = asRecord(asSchemaRecord(schema).__designer);
  return isRecord(designer) ? (designer as DesignerRecord) : undefined;
};

const normalizeText = (value: unknown) => String(value || '').trim();

const resolveSchemaGroupId = (schema: SchemaForUI): string | null => {
  const record = asSchemaRecord(schema) as SchemaRecord & { groupId?: string; group?: string };
  const designer = getDesignerRecord(schema);
  const groupId =
    normalizeText(designer?.group?.groupId) ||
    normalizeText(record.groupId) ||
    normalizeText(record.group);
  return groupId || null;
};

const remapGroupedSchemaIdentity = (
  schema: SchemaForUI,
  sourceSchema: SchemaForUI,
  groupIdMap: Map<string, string>,
) => {
  const sourceGroupId = resolveSchemaGroupId(sourceSchema);
  if (!sourceGroupId) return;

  const nextGroupId = groupIdMap.get(sourceGroupId) || uuid();
  if (!groupIdMap.has(sourceGroupId)) {
    groupIdMap.set(sourceGroupId, nextGroupId);
  }

  const record = asSchemaRecord(schema) as SchemaRecord & {
    type?: string;
    groupId?: string;
    group?: string;
    options?: Array<string | { optionId?: string; label?: string }>;
    selectedOptionId?: string;
    defaultSelectedOptionId?: string;
    selectedOptionIds?: string[];
    content?: string;
    __designer?: { group?: { groupId?: string; [key: string]: unknown }; [key: string]: unknown };
  };

  if (record.groupId !== undefined) record.groupId = nextGroupId;
  if (record.group !== undefined) record.group = nextGroupId;
  const designer = getDesignerRecord(schema);
  if (designer?.group) {
    record.__designer = {
      ...designer,
      group: {
        ...designer.group,
        groupId: nextGroupId,
      },
    };
  }

  const schemaType = normalizeText(record.type).toLowerCase();
  if (schemaType !== 'radiogroup' && schemaType !== 'checkboxgroup') return;

  const rawOptions = Array.isArray(record.options) ? record.options : [];
  const optionIdMap = new Map<string, string>();
  const normalizedOptions = rawOptions.map((entry, index) => {
    const previousId =
      typeof entry === 'string'
        ? normalizeText(entry) || `option_${index + 1}`
        : normalizeText(entry.optionId) || `option_${index + 1}`;
    const label =
      typeof entry === 'string'
        ? normalizeText(entry) || `Opción ${index + 1}`
        : normalizeText(entry.label) || previousId;
    const nextId = `option_${index + 1}_${uuid().slice(0, 6)}`;
    optionIdMap.set(previousId, nextId);
    return { optionId: nextId, label };
  });

  const mapSingleId = (value: unknown) => {
    const normalized = normalizeText(value);
    return optionIdMap.get(normalized) || normalized;
  };

  const mapManyIds = (values: unknown) => {
    if (Array.isArray(values)) {
      return values
        .map((value) => mapSingleId(value))
        .filter((value) => Boolean(normalizeText(value)));
    }
    const content = normalizeText(values);
    if (!content) return [];
    return content
      .split(',')
      .map((value) => mapSingleId(value))
      .filter((value) => Boolean(normalizeText(value)));
  };

  record.options = normalizedOptions;
  if (schemaType === 'radiogroup') {
    const nextSelectedId = mapSingleId(record.selectedOptionId || record.content || record.defaultSelectedOptionId);
    record.selectedOptionId = nextSelectedId;
    record.defaultSelectedOptionId = nextSelectedId;
    record.content = nextSelectedId;
    return;
  }

  const selectedOptionIds = mapManyIds(record.selectedOptionIds || record.content);
  record.selectedOptionIds = selectedOptionIds;
  record.content = selectedOptionIds.join(',');
};

export const sanitizeCopiedSchema = (schema: SchemaForUI): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaRecord;
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
) => {
  const existingNames = existingSchemas
    .map((entry) => entry.name)
    .filter((name): name is string => typeof name === 'string' && name.trim().length > 0)
    .concat(stackUniqueSchemaNames);
  const uniqueName = createUniqueSchemaVariableName(schema.type, existingNames);
  stackUniqueSchemaNames.push(uniqueName);
  return uniqueName;
};

export const buildPastedSchema = (
  schema: SchemaForUI,
  context: SchemaClipboardContext,
  index = 0,
  stackUniqueSchemaNames: string[] = [],
  policy: PastePolicy = { mode: 'preserveAssignments' },
): SchemaForUI => {
  // Capture transient fields from the original BEFORE sanitization so that
  // PastePolicy.preserveLocks / preserveComments can selectively restore them.
  const originalRecord = (asRecord(schema) || {}) as ClipboardTransientRecord;
  const originalLock = originalRecord.lock;
  const originalComments = originalRecord.comments;
  const originalCommentAnchors = originalRecord.commentAnchors;
  const originalCommentsAnchors = originalRecord.commentsAnchors;

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
  pasted.state = 'draft';
  pasted.commentsCount = 0;
  pasted.createdAt = context.timestamp ?? Date.now();
  pasted.updatedAt = context.timestamp ?? Date.now();
  pasted.lastModifiedAt = context.timestamp ?? Date.now();

  // Apply PastePolicy for comments — lock restoration must happen AFTER
  // applySchemaCollaborativeDefaults because that function hard-codes lock: undefined.
  if (policy.preserveComments) {
    if (originalComments !== undefined) pasted.comments = originalComments;
    if (originalCommentAnchors !== undefined) pasted.commentAnchors = originalCommentAnchors;
    if (originalCommentsAnchors !== undefined) pasted.commentsAnchors = originalCommentsAnchors;
  } else {
    pasted.comments = undefined;
    pasted.commentAnchors = undefined;
    pasted.commentsAnchors = undefined;
  }
  if (policy.mode === 'assignToActiveRecipient') {
    // Strip original recipient assignment — creationContext below will apply the active one
    delete pasted['ownerRecipientId'];
    delete pasted['ownerRecipientIds'];
    delete pasted['ownerRecipientName'];
    delete pasted['ownerColor'];
    const designer = asRecord(pasted.__designer);
    if (designer) {
      delete designer['recipientId'];
      delete designer['recipientName'];
      delete designer['recipientColor'];
      pasted.__designer = designer;
    }
  }

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

  const withCollaborativeDefaults = applySchemaCollaborativeDefaults(pasted as SchemaForUI, creationContext) as SchemaRecord;
  const designerConfig = asRecord(withCollaborativeDefaults[DEFAULT_SCHEMA_CONFIG_STORAGE_KEY]);

  if (designerConfig) {
    const designerIdentity = asRecord(designerConfig.identity) ?? {};
    withCollaborativeDefaults[DEFAULT_SCHEMA_CONFIG_STORAGE_KEY] = {
      ...designerConfig,
      identity: {
        ...designerIdentity,
        id: nextSchemaUid,
        key: nextName,
      },
    };
  }

  // Restore lock AFTER applySchemaCollaborativeDefaults (which always sets lock: undefined).
  // preserveLocks only works when the original schema had a lock value.
  const finalResult = withCollaborativeDefaults;
  if (policy.preserveLocks && originalLock !== undefined) {
    finalResult.lock = originalLock;
  }

  if (context.pageSize) {
    const collisionScopedSchemas = filterSchemasByCollisionScope(existingSchemas, finalResult as SchemaForUI, {
      fileId: targetFileId ?? null,
      pageNumber,
    });
    finalResult.position = resolveSmartDropPosition({
      candidate: (finalResult.position || position) as { x: number; y: number },
      pageSize: context.pageSize,
      schemaSize: sourceSize,
      existingSchemas: collisionScopedSchemas,
      stepMm: offset.x,
      maxAttempts: 12,
    });
  }

  return finalResult as SchemaForUI;
};

export const pasteSchemasFromClipboard = (
  clipboard: SchemaClipboardPayload | SchemaForUI[],
  context: SchemaClipboardContext,
  policy: PastePolicy = { mode: 'preserveAssignments' },
): SchemaForUI[] => {
  const items = Array.isArray(clipboard) ? clipboard : clipboard.items;
  const existingSchemas = context.existingSchemas || [];
  const stackUniqueSchemaNames: string[] = [];
  const groupIdMap = new Map<string, string>();
  const pasted: SchemaForUI[] = [];

  for (const [index, schema] of items.entries()) {
    const nextExistingSchemas = existingSchemas.concat(pasted);
    const next = buildPastedSchema(schema, { ...context, existingSchemas: nextExistingSchemas }, index, stackUniqueSchemaNames, policy);
    remapGroupedSchemaIdentity(next, schema, groupIdMap);
    pasted.push(next);
  }

  return pasted;
};

export const duplicateSchemas = (schemas: SchemaForUI[], context: SchemaClipboardContext): SchemaForUI[] =>
  pasteSchemasFromClipboard(copySchemasToClipboard(schemas), context);

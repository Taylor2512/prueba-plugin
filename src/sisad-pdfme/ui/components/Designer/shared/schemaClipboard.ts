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
import { isOptionGroupType } from '../../../../schemas/options/optionGroupLayout.js';

/**
 * Controls how recipient assignment and collaboration metadata are handled
 * when pasting schemas into the designer.
 *
 * - preserveAssignments: keeps the original recipientId/color from the copied schema.
 *   Used when duplicating within the same recipient context.
 * - assignToActiveRecipient: strips legacy assignment and applies the currently active
 *   recipient from collaborationContext. Used when dropping into a different recipient slot.
 */
type ClipboardPasteMode = 'preserveAssignments' | 'assignToActiveRecipient';

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

export type SchemaGroupBounds = { x: number; y: number; width: number; height: number };

/**
 * Optional rigid-group metadata captured when 2+ schemas are copied together.
 * Lets paste translate the whole selection by a single delta so the visual
 * bounding box, relative offsets, order, size and direction are preserved
 * (DocuSign/Figma-style group paste).
 */
export type SchemaGroupClipboardMeta = {
  anchor: { x: number; y: number };
  bounds: SchemaGroupBounds;
  itemOffsets: Record<string, { x: number; y: number }>;
  sourcePageIndex: number;
};

export type SchemaClipboardPayload = {
  source: 'copy' | 'cut';
  items: SchemaForUI[];
  removeIds: string[];
  group?: SchemaGroupClipboardMeta;
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
  /**
   * Preferred top-left anchor (mm) for a rigid-group paste. When present, the
   * whole group is translated so its bounding box starts here (clamped to page).
   * When absent, group paste falls back to a fixed +10mm/+10mm offset.
   */
  targetAnchor?: { x: number; y: number };
  /** Injectable identity source for deterministic adapters and tests. */
  createId?: () => string;
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
  createId: () => string,
) => {
  const sourceGroupId = resolveSchemaGroupId(sourceSchema);
  if (!sourceGroupId) return;

  const nextGroupId = groupIdMap.get(sourceGroupId) || createId();
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
  if (!isOptionGroupType(schemaType)) return;

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
    const nextId = `option_${index + 1}_${createId().slice(0, 6)}`;
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

/** Fixed offset (mm) applied to a rigid-group paste when no target anchor exists. */
const GROUP_PASTE_FALLBACK_OFFSET_MM = 10;

const schemaPosition = (schema: SchemaForUI) => {
  const position = schema.position || { x: 0, y: 0 };
  return { x: Number(position.x) || 0, y: Number(position.y) || 0 };
};

/** Visual bounding box (mm) of a set of schemas from position + width/height. */
export const computeSchemasBounds = (items: SchemaForUI[]): SchemaGroupBounds => {
  if (!items.length) return { x: 0, y: 0, width: 0, height: 0 };
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const schema of items) {
    const { x, y } = schemaPosition(schema);
    const width = Number(schema.width) || 0;
    const height = Number(schema.height) || 0;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

/** Builds rigid-group metadata for a multi-schema selection (undefined for <2). */
export const buildGroupClipboardMetadata = (
  items: SchemaForUI[],
  sourcePageIndex: number,
): SchemaGroupClipboardMeta | undefined => {
  if (items.length < 2) return undefined;
  const bounds = computeSchemasBounds(items);
  const itemOffsets: Record<string, { x: number; y: number }> = {};
  for (const schema of items) {
    const { x, y } = schemaPosition(schema);
    if (schema.id) {
      itemOffsets[schema.id] = { x: x - bounds.x, y: y - bounds.y };
    }
  }
  return { anchor: { x: bounds.x, y: bounds.y }, bounds, itemOffsets, sourcePageIndex };
};

/** Clamps a group top-left anchor so the whole bounding box stays inside the page. */
export const clampGroupAnchorToPage = (
  target: { x: number; y: number },
  groupBounds: SchemaGroupBounds,
  pageSize: Size,
): { x: number; y: number } => ({
  x: Math.max(0, Math.min(target.x, Math.max(0, pageSize.width - groupBounds.width))),
  y: Math.max(0, Math.min(target.y, Math.max(0, pageSize.height - groupBounds.height))),
});

const createClipboardPayload = (
  source: SchemaClipboardPayload['source'],
  schemas: SchemaForUI[],
  sourcePageIndex: number,
): SchemaClipboardPayload => ({
  source,
  items: schemas.map(sanitizeCopiedSchema),
  removeIds: source === 'cut' ? schemas.map((schema) => schema.id) : [],
  group: buildGroupClipboardMetadata(schemas, sourcePageIndex),
});

export const copySchemasToClipboard = (schemas: SchemaForUI[], sourcePageIndex = 0) =>
  createClipboardPayload('copy', schemas, sourcePageIndex);

export const cutSchemasToClipboard = (schemas: SchemaForUI[], sourcePageIndex = 0) =>
  createClipboardPayload('cut', schemas, sourcePageIndex);

export const resolvePasteOffset = (index: number) => {
  const offset = index === 0 ? 6 : 8;
  return { x: offset, y: offset };
};

const resolveUniqueSchemaName = (
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

/**
 * Rigid-group placement: translate the schema by a single shared delta and skip
 * all per-item collision/smart placement so the group geometry is preserved.
 */
type GroupPlacement = { delta: { x: number; y: number } };

const buildPastedSchema = (
  schema: SchemaForUI,
  context: SchemaClipboardContext,
  index = 0,
  stackUniqueSchemaNames: string[] = [],
  policy: PastePolicy = { mode: 'preserveAssignments' },
  placement?: GroupPlacement,
): SchemaForUI => {
  // Capture transient fields from the original BEFORE sanitization so that
  // PastePolicy.preserveLocks / preserveComments can selectively restore them.
  const originalRecord = (asRecord(schema) || {}) as ClipboardTransientRecord;
  const originalLock = originalRecord.lock;
  const originalComments = originalRecord.comments;
  const originalCommentAnchors = originalRecord.commentAnchors;
  const originalCommentsAnchors = originalRecord.commentsAnchors;

  const baseSchema = sanitizeCopiedSchema(schema);
  const nextSchemaUid = (context.createId ?? uuid)();
  const targetFileId = context.fileId ?? context.collaborationContext?.fileId ?? undefined;
  const pageNumber = context.pageIndex + 1;
  const existingSchemas = context.existingSchemas || [];
  const offset = resolvePasteOffset(index);
  const sourcePosition = schema.position || { x: 0, y: 0 };
  const sourceSize = { width: schema.width || 0, height: schema.height || 0 };
  // Rigid-group paste: apply the single shared delta and skip smart placement.
  const candidate = placement
    ? {
        x: Math.max(0, sourcePosition.x + placement.delta.x),
        y: Math.max(0, sourcePosition.y + placement.delta.y),
      }
    : {
        x: Math.max(0, sourcePosition.x + offset.x),
        y: Math.max(0, sourcePosition.y + offset.y),
      };
  const position =
    !placement && context.pageSize && (context.resolvePlacement || existingSchemas.length > 0)
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

  // Skip per-item collision resolution for rigid-group paste: the group already
  // carries a single shared delta, so the geometry must not be recomputed here.
  if (context.pageSize && !placement) {
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
  } else if (placement) {
    // Ensure the rigid delta position is authoritative even after collaborative defaults.
    finalResult.position = candidate;
  }

  return finalResult as SchemaForUI;
};

const pasteClipboardItems = (
  items: SchemaForUI[],
  context: SchemaClipboardContext,
  policy: PastePolicy,
  resolveItemContext: (pasted: SchemaForUI[]) => SchemaClipboardContext,
  placement?: GroupPlacement,
): SchemaForUI[] => {
  const stackUniqueSchemaNames: string[] = [];
  const groupIdMap = new Map<string, string>();
  const createId = context.createId ?? uuid;
  const pasted: SchemaForUI[] = [];

  for (const [index, schema] of items.entries()) {
    const next = buildPastedSchema(
      schema,
      resolveItemContext(pasted),
      index,
      stackUniqueSchemaNames,
      policy,
      placement,
    );
    remapGroupedSchemaIdentity(next, schema, groupIdMap, createId);
    pasted.push(next);
  }
  return pasted;
};

/**
 * Rigid-group paste: translate every schema by ONE shared delta derived from the
 * group bounding box, so order, spacing, size and direction are preserved. No
 * per-item smart placement or collision resolution runs; a single clamp keeps the
 * whole box inside the page.
 */
const pasteSchemaGroupFromClipboard = (
  items: SchemaForUI[],
  group: SchemaGroupClipboardMeta | undefined,
  context: SchemaClipboardContext,
  policy: PastePolicy = { mode: 'preserveAssignments' },
): SchemaForUI[] => {
  const bounds = group?.bounds ?? computeSchemasBounds(items);
  const rawAnchor = context.targetAnchor ?? {
    x: bounds.x + GROUP_PASTE_FALLBACK_OFFSET_MM,
    y: bounds.y + GROUP_PASTE_FALLBACK_OFFSET_MM,
  };
  const anchor = context.pageSize ? clampGroupAnchorToPage(rawAnchor, bounds, context.pageSize) : rawAnchor;
  const delta = { x: anchor.x - bounds.x, y: anchor.y - bounds.y };
  const placement: GroupPlacement = { delta };

  return pasteClipboardItems(items, context, policy, () => context, placement);
};

export const pasteSchemasFromClipboard = (
  clipboard: SchemaClipboardPayload | SchemaForUI[],
  context: SchemaClipboardContext,
  policy: PastePolicy = { mode: 'preserveAssignments' },
): SchemaForUI[] => {
  const items = Array.isArray(clipboard) ? clipboard : clipboard.items;
  const group = Array.isArray(clipboard) ? undefined : clipboard.group;

  // Multi-schema selections paste as a rigid group (single delta, no per-item
  // placement). Single schemas keep the existing smart-placement behavior.
  if (items.length > 1) {
    return pasteSchemaGroupFromClipboard(items, group, context, policy);
  }

  const existingSchemas = context.existingSchemas || [];
  return pasteClipboardItems(items, context, policy, (pasted) => ({
    ...context,
    existingSchemas: existingSchemas.concat(pasted),
  }));
};

export const duplicateSchemas = (schemas: SchemaForUI[], context: SchemaClipboardContext): SchemaForUI[] =>
  pasteSchemasFromClipboard(copySchemasToClipboard(schemas, context.pageIndex), context);

import { cloneDeep, normalizeRecipientIds } from '@sisad-pdfme/common';
import type { SchemaForUI, Template } from '@sisad-pdfme/common';
import { resolveCollaboratorById } from '@sisad-pdfme/collaboration/appearance';
import type { CollaboratorUser } from '@sisad-pdfme/collaboration/recipientPalette';

const normalizeOwnerId = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

const normalizeColor = (value: unknown): string =>
  typeof value === 'string' && value.trim() ? value.trim() : '';

type OwnerColorSource =
  | 'schema.userColor'
  | 'schema.ownerColor'
  | 'schema.recipientColor'
  | 'schema.__designer.collaboration.recipientColor'
  | 'schema.__designer.ownerColor'
  | 'schema.__designer.recipientColor'
  | 'recipient.color'
  | 'fallback';

export type SchemaOwnershipAppearanceOptions = {
  /**
   * Order in which an owner color is resolved. Defaults to `DEFAULT_PRIORITY`:
   * `schema.ownerColor` first, then `schema.userColor`, then
   * `schema.recipientColor`, then the `__designer` mirrors, then the recipient
   * registry, then empty.
   */
  ownerColorPriority?: readonly OwnerColorSource[];
  actorColor?: string;
};

type OwnerColorAwareSchema = SchemaForUI & {
  ownerColor?: string;
  userColor?: string;
  recipientColor?: string;
  __designer?: {
    ownerColor?: string;
    recipientColor?: string;
    collaboration?: {
      recipientColor?: string;
    };
  };
};

const DEFAULT_PRIORITY: readonly OwnerColorSource[] = [
  'schema.ownerColor',
  'schema.userColor',
  'schema.recipientColor',
  'schema.__designer.collaboration.recipientColor',
  'schema.__designer.ownerColor',
  'schema.__designer.recipientColor',
  'recipient.color',
  'fallback',
];

type OwnerAwareSchema = SchemaForUI & {
  ownerRecipientId?: string;
  ownerRecipientIds?: string[];
  ownerMode?: string;
  ownerColor?: string;
  userColor?: string;
  recipientColor?: string;
  __designer?: {
    ownerColor?: string;
    recipientColor?: string;
    collaboration?: {
      recipientColor?: string;
    };
  };
  lastModifiedBy?: string;
  createdBy?: string;
};

const buildOwnerIds = (schema: OwnerAwareSchema): string[] =>
  normalizeRecipientIds([
    ...(Array.isArray(schema?.ownerRecipientIds) ? schema.ownerRecipientIds : []),
    ...(schema?.ownerRecipientId ? [schema.ownerRecipientId] : []),
  ]);

/**
 * Extractor per source. Single table so the two public resolvers below cannot
 * drift apart: previously each one re-implemented the chain by hand, and their
 * docstrings had already diverged from the real order.
 *
 * `recipient.color` and `fallback` are not here because they need the
 * collaborator registry, which only `resolveSchemaOwnerColor` receives.
 */
const OWNER_COLOR_EXTRACTORS: Partial<
  Record<OwnerColorSource, (schema: OwnerColorAwareSchema | null | undefined) => string>
> = {
  'schema.ownerColor': (s) => normalizeColor(s?.ownerColor),
  'schema.userColor': (s) => normalizeColor(s?.userColor),
  'schema.recipientColor': (s) => normalizeColor(s?.recipientColor),
  'schema.__designer.collaboration.recipientColor': (s) =>
    normalizeColor(s?.__designer?.collaboration?.recipientColor),
  'schema.__designer.ownerColor': (s) => normalizeColor(s?.__designer?.ownerColor),
  'schema.__designer.recipientColor': (s) => normalizeColor(s?.__designer?.recipientColor),
};

/**
 * Resolves the raw ownership color stored on a schema without consulting the
 * collaborator registry. This is the shared fallback used by designer chrome,
 * field chrome and tone helpers.
 *
 * Returns `''` when the schema has no owner color, so callers can tell "no
 * owner" from "render something anyway".
 */
export function resolveSchemaOwnerColorValue(schema: SchemaForUI | null | undefined): string {
  const source = schema as OwnerColorAwareSchema | null | undefined;
  for (const key of DEFAULT_PRIORITY) {
    const color = OWNER_COLOR_EXTRACTORS[key]?.(source) ?? '';
    if (color) return color;
  }
  return '';
}

const resolveOwnerRecipientColor = (
  schema: OwnerAwareSchema,
  users: CollaboratorUser[],
): string => {
  // El color de dueño debe reflejar al DUEÑO del schema, no a quién lo editó por
  // última vez: los ids de owner (`ownerRecipientId`/`ownerRecipientIds`) tienen
  // prioridad sobre `lastModifiedBy`/`createdBy`, que solo actúan como respaldo.
  const candidates = [
    schema?.ownerRecipientId,
    ...buildOwnerIds(schema),
    schema?.lastModifiedBy,
    schema?.createdBy,
  ];
  for (const candidate of candidates) {
    const collaborator = resolveCollaboratorById(candidate, users);
    if (collaborator?.color) return String(collaborator.color);
  }
  return '';
};

/**
 * Resolves the color to render for a schema's owner, consulting the collaborator
 * registry when the schema carries no materialized color.
 *
 * Default priority (`DEFAULT_PRIORITY`): `schema.ownerColor` →
 * `schema.userColor` → `schema.recipientColor` → the three `__designer` mirrors
 * → recipient registry → `''`.
 *
 * `schema.ownerColor` must stay ahead of `schema.userColor`:
 * `decorateSchemaWithCollaboration` fills `userColor` from
 * `lastModifiedBy`/`createdBy`, so the reverse order would paint a field with
 * the color of whoever edited it last instead of its owner.
 */
export function resolveSchemaOwnerColor(
  schema: SchemaForUI,
  users: CollaboratorUser[] = [],
  options: SchemaOwnershipAppearanceOptions = {},
): string {
  const toneSchema = schema as OwnerAwareSchema;
  const priority = options.ownerColorPriority ?? DEFAULT_PRIORITY;

  for (const source of priority) {
    const fromSchema = OWNER_COLOR_EXTRACTORS[source]?.(toneSchema) ?? '';
    if (fromSchema) return fromSchema;
    if (source === 'recipient.color') {
      const fromRegistry = resolveOwnerRecipientColor(toneSchema, users);
      if (fromRegistry) return fromRegistry;
    }
  }
  return '';
}

/**
 * Returns a copy of the schema with normalized owner fields and derived
 * owner/author colors. Mirrors the us lab `decorateSchemaWithCollaboration`.
 */
export function decorateSchemaWithCollaboration<T extends SchemaForUI>(
  schema: T,
  users: CollaboratorUser[] = [],
  options: SchemaOwnershipAppearanceOptions = {},
): T {
  if (!schema || typeof schema !== 'object') return schema;

  const src = schema as OwnerAwareSchema;
  const ownerRecipientIds = buildOwnerIds(src);
  const ownerRecipientId = normalizeOwnerId(src.ownerRecipientId) || ownerRecipientIds[0] || undefined;

  let ownerMode = src.ownerMode;
  if (!ownerMode) {
    if (ownerRecipientIds.length > 1) ownerMode = 'multi';
    else if (ownerRecipientIds.length === 1) ownerMode = 'single';
  }

  const ownerColor = resolveSchemaOwnerColor(schema, users, options);
  const authorColor =
    resolveCollaboratorById(src?.lastModifiedBy, users)?.color ||
    resolveCollaboratorById(src?.createdBy, users)?.color ||
    ownerColor;

  const next = { ...src } as OwnerAwareSchema;

  if (ownerRecipientId && next.ownerRecipientId !== ownerRecipientId) {
    next.ownerRecipientId = ownerRecipientId;
  }

  if (
    ownerRecipientIds.length > 0 &&
    (ownerRecipientIds.length !==
      (Array.isArray(next.ownerRecipientIds) ? next.ownerRecipientIds.length : 0) ||
      ownerRecipientIds.some((value, index) => value !== next.ownerRecipientIds?.[index]))
  ) {
    next.ownerRecipientIds = ownerRecipientIds;
  }

  if (ownerMode && next.ownerMode !== ownerMode) next.ownerMode = ownerMode;
  if (ownerColor && next.ownerColor !== ownerColor) next.ownerColor = ownerColor;
  if (authorColor && next.userColor !== authorColor) next.userColor = String(authorColor);

  return next as T;
}

/**
 * Returns a deep-cloned template with every schema decorated. Mirrors the
 * us lab `decorateTemplateWithCollaboration`.
 */
export function decorateTemplateWithCollaboration(
  template: Template,
  users: CollaboratorUser[] = [],
  options: SchemaOwnershipAppearanceOptions = {},
): Template {
  if (!template || !Array.isArray(template.schemas)) return cloneDeep(template);

  return {
    ...cloneDeep(template),
    schemas: template.schemas.map((pageSchemas: SchemaForUI[] = []) =>
      pageSchemas.map((schema) => decorateSchemaWithCollaboration(schema, users, options)),
    ),
  };
}

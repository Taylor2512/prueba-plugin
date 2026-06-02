import { cloneDeep, normalizeRecipientIds } from '@sisad-pdfme/common';
import type { SchemaForUI, Template } from '@sisad-pdfme/common';
import { resolveCollaboratorById } from './appearance.js';
import type { CollaboratorUser } from './recipientPalette.js';

const normalizeId = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

type OwnerColorSource =
  | 'schema.userColor'
  | 'schema.ownerColor'
  | 'recipient.color'
  | 'fallback';

export type SchemaOwnershipAppearanceOptions = {
  /**
   * Order in which an owner color is resolved. Default reproduces the legacy
   * lab behavior: explicit schema.userColor, then schema.ownerColor, then the
   * resolved recipient/author color, then empty.
   */
  ownerColorPriority?: readonly OwnerColorSource[];
};

const DEFAULT_PRIORITY: readonly OwnerColorSource[] = [
  'schema.userColor',
  'schema.ownerColor',
  'recipient.color',
  'fallback',
];

type OwnerAwareSchema = SchemaForUI & {
  ownerRecipientId?: string;
  ownerRecipientIds?: string[];
  ownerMode?: string;
  ownerColor?: string;
  userColor?: string;
  lastModifiedBy?: string;
  createdBy?: string;
};

const buildOwnerIds = (schema: OwnerAwareSchema): string[] =>
  normalizeRecipientIds([
    ...(Array.isArray(schema?.ownerRecipientIds) ? schema.ownerRecipientIds : []),
    ...(schema?.ownerRecipientId ? [schema.ownerRecipientId] : []),
  ]);

const resolveRecipientColor = (
  schema: OwnerAwareSchema,
  users: CollaboratorUser[],
): string => {
  const candidates = [
    schema?.ownerRecipientId,
    schema?.lastModifiedBy,
    ...buildOwnerIds(schema),
    schema?.createdBy,
  ];
  for (const candidate of candidates) {
    const collaborator = resolveCollaboratorById(candidate, users);
    if (collaborator?.color) return String(collaborator.color);
  }
  return '';
};

/**
 * Resolves the color to render for a schema's owner. Default priority:
 * explicit userColor → explicit ownerColor → resolved recipient color → ''.
 */
export function resolveSchemaOwnerColor(
  schema: SchemaForUI,
  users: CollaboratorUser[] = [],
  options: SchemaOwnershipAppearanceOptions = {},
): string {
  const toneSchema = schema as OwnerAwareSchema;
  const priority = options.ownerColorPriority ?? DEFAULT_PRIORITY;

  for (const source of priority) {
    if (source === 'schema.userColor') {
      const c = typeof toneSchema?.userColor === 'string' ? toneSchema.userColor.trim() : '';
      if (c) return c;
    } else if (source === 'schema.ownerColor') {
      const c = typeof toneSchema?.ownerColor === 'string' ? toneSchema.ownerColor.trim() : '';
      if (c) return c;
    } else if (source === 'recipient.color') {
      const c = resolveRecipientColor(toneSchema, users);
      if (c) return c;
    }
  }
  return '';
}

/**
 * Returns a copy of the schema with normalized owner fields and derived
 * owner/author colors. Mirrors the legacy lab `decorateSchemaWithCollaboration`.
 */
export function decorateSchemaWithCollaboration<T extends SchemaForUI>(
  schema: T,
  users: CollaboratorUser[] = [],
  options: SchemaOwnershipAppearanceOptions = {},
): T {
  if (!schema || typeof schema !== 'object') return schema;

  const src = schema as OwnerAwareSchema;
  const ownerRecipientIds = buildOwnerIds(src);
  const ownerRecipientId = normalizeId(src.ownerRecipientId) || ownerRecipientIds[0] || undefined;

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
 * legacy lab `decorateTemplateWithCollaboration`.
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

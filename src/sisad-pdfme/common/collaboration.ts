/**
 * @file collaboration.ts
 *
 * Utilidades puras de colaboración para @sisad-pdfme/common.
 *
 * Responsabilidades:
 * - normalizar ids de usuarios/destinatarios;
 * - resolver autor/owner de schemas;
 * - filtrar schemas por vista colaborativa;
 * - crear comentarios y anchors;
 * - construir assignments por recipient, usuario y usuariorecipient;
 * - validar metadata colaborativa mínima.
 *
 * Regla arquitectónica:
 * Este archivo no debe importar React, CSS, canvas, sidebars ni lógica visual.
 */

import { cloneDeep } from './helper.js';

import type {
  CommentScope,
  SchemaComment,
  SchemaCommentReply,
  SchemaForUI,
  SchemaPageArray,
  CommentAnchor,
} from './types.js';

/**
 * Normaliza uno o varios recipient/user ids a un arreglo único de strings.
 *
 * Soporta dos entradas principales:
 *
 * 1. Array:
 *    ['user-1', 'user-2', 'user-1']
 *
 * 2. String separado por comas:
 *    'user-1,user-2,user-1'
 *
 * Siempre:
 *
 * - elimina espacios;
 * - elimina valores vacíos;
 * - elimina duplicados;
 * - retorna [] si el valor no es array ni string.
 */
export const normalizeRecipientIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((entry) => String(entry || '').trim())
          .filter(Boolean),
      ),
    );
  }

  if (typeof value === 'string') {
    return Array.from(
      new Set(
        value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
    );
  }

  return [];
};

/**
 * Estructura de assignments por recipient.
 *
 * Forma:
 *
 * assignments[recipientId][fileId][pageNumber] = [schemaUid]
 */
export type SchemaAssignments = Record<
  string,
  Record<string, Record<string, string[]>>
>;

/**
 * Estructura de assignments por usuario y recipient.
 *
 * Forma:
 *
 * assignments[userId][recipientId][fileId][pageNumber] = [schemaUid]
 *
 * Es útil cuando necesitas diferenciar:
 *
 * - quién creó/modificó el campo;
 * - a qué destinatario pertenece el campo;
 * - en qué documento/página está ubicado.
 */
export type UserRecipientSchemaAssignments = Record<
  string,
  Record<string, Record<string, Record<string, string[]>>>
>;

/**
 * Bucket reservado para schemas compartidos.
 *
 * Se usa cuando un schema no pertenece a un recipient único,
 * sino a una vista compartida/global.
 */
export const SHARED_ASSIGNMENTS_BUCKET = '__shared__';

/**
 * Filtro de vista colaborativa.
 *
 * activeUserId:
 * Usuario actual para filtrar campos por autor/owner.
 *
 * isGlobalView:
 * Si es true, no filtra por usuario y permite ver todo.
 */
export type CollaborationViewFilter = {
  activeUserId?: string | null;
  isGlobalView?: boolean;
};

/**
 * Identidad del autor de un comentario.
 *
 * Se usa al crear comentarios o anchors para registrar:
 *
 * - quién comentó;
 * - nombre visible;
 * - color visual;
 * - timestamp.
 */
export type CommentAuthorIdentity = {
  authorId?: string | null;
  authorName?: string | null;
  authorColor?: string | null;
  timestamp?: number;
};

/**
 * Normaliza texto únicamente si el valor recibido es string.
 *
 * Diferencia importante frente a otros helpers:
 * Si recibe number, boolean, object, null o undefined, retorna ''.
 */
const normalizeCollaborationCommonText = (value: unknown) =>
  typeof value === 'string' ? value.trim() : '';

/**
 * Draft flexible para crear un comentario.
 *
 * Permite recibir valores parciales y metadata extra antes de convertir
 * el objeto en un SchemaComment completo.
 */
type SchemaCommentDraft = {
  id?: string;
  scope?: CommentScope;
  fileId?: string;
  pageNumber?: number;
  fieldId?: string;
  schemaUid?: string;
  authorId?: string;
  authorName?: string;
  authorColor?: string;
  timestamp?: number;
  createdAt?: number;
  text?: string;
  resolved?: boolean;
  anchor?: CommentAnchor;
  replies?: SchemaCommentReply[];
};

/**
 * Draft flexible para crear un anchor de comentario.
 *
 * Un anchor representa la ubicación del comentario dentro del PDF:
 *
 * - documento;
 * - página;
 * - coordenadas;
 * - schema asociado;
 * - autor.
 */
type CommentAnchorDraft = {
  id?: string;
  scope?: CommentScope;
  schemaUid?: string;
  fileId?: string;
  pageNumber?: number;
  fieldId?: string;
  x?: number;
  y?: number;
  resolved?: boolean;
  authorId?: string;
  authorName?: string;
  authorColor?: string;
};

/**
 * Crea un identificador único para entidades internas.
 *
 * Usa crypto.randomUUID si está disponible.
 * Si no existe crypto.randomUUID, usa Date.now + Math.random.
 *
 * Ejemplos:
 *
 * - comment-550e8400-e29b-41d4-a716-446655440000
 * - anchor-550e8400-e29b-41d4-a716-446655440000
 */
const createEntityId = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

/**
 * Resuelve el scope real de un comentario o anchor.
 *
 * Prioridad:
 *
 * 1. Si scope ya es 'document', 'page' o 'schema', lo respeta.
 * 2. Si existe schemaUid o fieldId, usa scope 'schema'.
 * 3. Si existe pageNumber, usa scope 'page'.
 * 4. Si no hay datos suficientes, usa scope 'document'.
 */
const resolveCommentScope = (
  scope: CommentScope | undefined,
  fallback: {
    schemaUid?: string | null;
    fieldId?: string | null;
    pageNumber?: number;
  } = {},
): CommentScope => {
  if (scope === 'document' || scope === 'page' || scope === 'schema') {
    return scope;
  }

  if (String(fallback.schemaUid || fallback.fieldId || '').trim()) {
    return 'schema';
  }

  if (typeof fallback.pageNumber === 'number') {
    return 'page';
  }

  return 'document';
};

/**
 * Resuelve el autor principal de un schema.
 *
 * Prioridad:
 *
 * 1. createdBy
 * 2. lastModifiedBy
 * 3. ''
 *
 * Se usa para vistas colaborativas por autor.
 */
export const resolveSchemaAuthorId = (schema: SchemaForUI) =>
  normalizeCollaborationCommonText(
    (schema as SchemaForUI & {
      createdBy?: string;
      lastModifiedBy?: string;
    }).createdBy,
  ) ||
  normalizeCollaborationCommonText(
    (schema as SchemaForUI & {
      createdBy?: string;
      lastModifiedBy?: string;
    }).lastModifiedBy,
  ) ||
  '';

/**
 * Indica si un schema debe mostrarse en la vista colaborativa actual.
 *
 * Reglas:
 *
 * - Si isGlobalView es true, siempre retorna true.
 * - Si no hay activeUserId, retorna true.
 * - Si ownerMode === 'shared', retorna true.
 * - Si activeUserId coincide con createdBy/lastModifiedBy, retorna true.
 * - Si activeUserId coincide con ownerRecipientId/ownerRecipientIds, retorna true.
 */
export const schemaMatchesAuthorView = (
  schema: SchemaForUI,
  filter: CollaborationViewFilter = {},
) => {
  if (filter.isGlobalView) return true;

  const activeUserId = normalizeCollaborationCommonText(filter.activeUserId);

  if (!activeUserId) return true;

  const rawSchema = schema as SchemaForUI & {
    ownerRecipientId?: string;
    ownerRecipientIds?: string[] | string;
    createdBy?: string;
    lastModifiedBy?: string;
    ownerMode?: 'single' | 'multi' | 'shared';
  };

  const authorIds = normalizeRecipientIds(
    rawSchema.createdBy || rawSchema.lastModifiedBy,
  );

  const ownerIds = normalizeRecipientIds(
    rawSchema.ownerRecipientIds || rawSchema.ownerRecipientId,
  );

  return (
    rawSchema.ownerMode === 'shared' ||
    authorIds.includes(activeUserId) ||
    ownerIds.includes(activeUserId)
  );
};

/**
 * Filtra una lista plana de schemas según la vista colaborativa actual.
 */
export const filterSchemasByAuthorView = (
  schemas: SchemaForUI[],
  filter: CollaborationViewFilter = {},
) => schemas.filter((schema) => schemaMatchesAuthorView(schema, filter));

/**
 * Crea un comentario completo de schema/documento/página.
 *
 * Esta función normaliza:
 *
 * - id;
 * - scope;
 * - fileId;
 * - pageNumber;
 * - fieldId;
 * - schemaUid;
 * - autor;
 * - timestamp;
 * - texto;
 * - estado resolved;
 * - anchor;
 * - replies.
 *
 * También permite overrides para preservar compatibilidad con snapshots
 * o estructuras .
 */
export const createSchemaComment = (
  text: string,
  identity: CommentAuthorIdentity = {},
  overrides: SchemaCommentDraft = {},
): SchemaComment => ({
  /**
   * Primero se copian overrides para conservar metadata extra.
   * Luego las propiedades normalizadas sobrescriben las críticas.
   */
  ...(overrides as Record<string, unknown>),

  id: normalizeCollaborationCommonText(overrides.id) || createEntityId('comment'),

  scope: resolveCommentScope(overrides.scope, {
    schemaUid: overrides.schemaUid,
    fieldId: overrides.fieldId,
    pageNumber: overrides.pageNumber,
  }),

  fileId: normalizeCollaborationCommonText(overrides.fileId) || undefined,

  pageNumber:
    typeof overrides.pageNumber === 'number'
      ? overrides.pageNumber
      : undefined,

  /**
   * fieldId y schemaUid se mantienen sincronizados como aliases.
   *
   * Esto ayuda a soportar estructuras donde antes se usaba fieldId
   * y ahora se usa schemaUid.
   */
  fieldId:
    normalizeCollaborationCommonText(overrides.fieldId) ||
    normalizeCollaborationCommonText(overrides.schemaUid) ||
    undefined,

  schemaUid:
    normalizeCollaborationCommonText(overrides.schemaUid) ||
    normalizeCollaborationCommonText(overrides.fieldId) ||
    undefined,

  /**
   * Identidad del autor.
   */
  authorId: normalizeCollaborationCommonText(identity.authorId) || undefined,
  authorName: normalizeCollaborationCommonText(identity.authorName) || undefined,
  authorColor: normalizeCollaborationCommonText(identity.authorColor) || undefined,

  /**
   * Fecha de creación.
   */
  timestamp: Number(identity.timestamp) || Date.now(),
  createdAt: Number(identity.timestamp) || Date.now(),

  /**
   * Texto del comentario.
   */
  text: text.trim(),

  /**
   * Todo comentario nuevo nace sin resolver.
   */
  resolved: false,

  /**
   * Se clona el anchor para evitar mutación por referencia.
   */
  anchor: overrides.anchor ? cloneDeep(overrides.anchor) : undefined,

  /**
   * Replies también se clonan para proteger el estado original.
   */
  replies: Array.isArray(overrides.replies)
    ? cloneDeep(overrides.replies)
    : [],
});

/**
 * Crea un anchor de comentario.
 *
 * Un anchor representa una ubicación visual dentro del PDF o schema.
 *
 * Puede apuntar a:
 *
 * - documento completo;
 * - página;
 * - schema/campo;
 * - coordenadas x/y.
 */
export const createSchemaCommentAnchor = (
  anchor: CommentAnchorDraft = {},
  identity: CommentAuthorIdentity = {},
): CommentAnchor => ({
  ...(anchor as Record<string, unknown>),

  id: normalizeCollaborationCommonText(anchor.id) || createEntityId('anchor'),

  scope: resolveCommentScope(anchor.scope, {
    schemaUid: anchor.schemaUid,
    fieldId: anchor.fieldId,
    pageNumber: anchor.pageNumber,
  }),

  schemaUid: normalizeCollaborationCommonText(anchor.schemaUid) || undefined,

  fieldId:
    normalizeCollaborationCommonText(anchor.fieldId) ||
    normalizeCollaborationCommonText(anchor.schemaUid) ||
    undefined,

  fileId: normalizeCollaborationCommonText(anchor.fileId) || undefined,

  pageNumber:
    typeof anchor.pageNumber === 'number'
      ? anchor.pageNumber
      : undefined,

  x: typeof anchor.x === 'number' ? anchor.x : undefined,
  y: typeof anchor.y === 'number' ? anchor.y : undefined,

  resolved: Boolean(anchor.resolved),

  authorId: normalizeCollaborationCommonText(identity.authorId) || undefined,
  authorName: normalizeCollaborationCommonText(identity.authorName) || undefined,
  authorColor: normalizeCollaborationCommonText(identity.authorColor) || undefined,
});

/**
 * Inserta o actualiza un item dentro de un array usando su id.
 *
 * Si el id no existe, agrega el item al final.
 * Si el id ya existe, reemplaza el item existente.
 *
 * Es útil para comentarios, replies, anchors o entidades simples.
 */
export const upsertById = <T extends { id: string }>(
  items: T[] = [],
  nextItem: T,
) => {
  const index = items.findIndex((item) => item.id === nextItem.id);

  if (index < 0) return items.concat([nextItem]);

  const nextItems = items.slice();
  nextItems[index] = nextItem;

  return nextItems;
};

/**
 * Elimina un item por id sin mutar el array original.
 */
export const removeById = <T extends { id: string }>(
  items: T[] = [],
  id: string,
) => items.filter((item) => item.id !== id);

/**
 * Modo de identidad usado para generar assignments.
 *
 * recipient:
 * Agrupa schemas por ownerRecipientId/ownerRecipientIds.
 *
 * author:
 * Agrupa schemas por createdBy/lastModifiedBy.
 */

type CollaborativeAssignmentSchema = SchemaForUI & {
  schemaUid?: string;
  fileId?: string;
  fileTemplateId?: string;
  pageNumber?: number;
  ownerRecipientId?: string;
  ownerRecipientIds?: string[] | string;
  ownerMode?: 'single' | 'multi' | 'shared';
  createdBy?: string;
  lastModifiedBy?: string;
};

type SchemaAssignmentLocation = {
  schema: CollaborativeAssignmentSchema;
  schemaUid: string;
  fileId: string;
  pageKey: string;
};

const resolveSchemaAssignmentLocation = (
  schema: SchemaForUI,
  pageIndex: number,
): SchemaAssignmentLocation | null => {
  const rawSchema = schema as CollaborativeAssignmentSchema;
  const schemaUid = String(
    rawSchema.schemaUid || rawSchema.id || rawSchema.name || '',
  ).trim();

  if (!schemaUid) return null;

  const fileId =
    String(rawSchema.fileId || rawSchema.fileTemplateId || 'default').trim() ||
    'default';
  const pageNumber =
    typeof rawSchema.pageNumber === 'number' &&
    Number.isFinite(rawSchema.pageNumber) &&
    rawSchema.pageNumber > 0
      ? Math.trunc(rawSchema.pageNumber)
      : pageIndex + 1;

  return {
    schema: rawSchema,
    schemaUid,
    fileId,
    pageKey: String(pageNumber),
  };
};

const forEachSchemaAssignmentLocation = (
  schemas: SchemaPageArray,
  visitor: (location: SchemaAssignmentLocation) => void,
) => {
  schemas.forEach((page, pageIndex) => {
    page.forEach((schema) => {
      const location = resolveSchemaAssignmentLocation(schema, pageIndex);
      if (location) visitor(location);
    });
  });
};

const dedupeAssignmentTree = (
  tree: Record<string, unknown>,
  levelsBeforePageMap: number,
) => {
  if (levelsBeforePageMap > 0) {
    Object.values(tree).forEach((child) => {
      if (child && typeof child === 'object') {
        dedupeAssignmentTree(
          child as Record<string, unknown>,
          levelsBeforePageMap - 1,
        );
      }
    });
    return;
  }

  Object.keys(tree).forEach((pageKey) => {
    const values = Array.isArray(tree[pageKey]) ? tree[pageKey] : [];
    tree[pageKey] = Array.from(new Set(values));
  });
};

type AssignmentIdentityMode = 'recipient' | 'author';

/**
 * Opciones para generar assignments combinados:
 *
 * user → recipient → file → page → schemas
 */
export type UserRecipientAssignmentOptions = {
  sharedRecipientKey?: string;
  unassignedUserKey?: string;
  unassignedRecipientKey?: string;
  includeSharedRecipientBucket?: boolean;
};

/**
 * Genera assignments base desde un arreglo de páginas de schemas.
 *
 * Esta función es privada y se usa por:
 *
 * - buildSchemaAssignments
 * - buildUserSchemaAssignments
 *
 * Dependiendo del modo:
 *
 * - recipient: agrupa por destinatario/owner;
 * - author: agrupa por autor/usuario.
 *
 * Estructura final:
 *
 * assignments[identity][fileId][pageKey] = [schemaUid]
 */
const buildAssignments = (
  schemas: SchemaPageArray,
  mode: AssignmentIdentityMode,
): SchemaAssignments => {
  const assignments: SchemaAssignments = {};

  forEachSchemaAssignmentLocation(
    schemas,
    ({ schema: rawSchema, schemaUid, fileId, pageKey }) => {
      const identities =
        mode === 'author'
          ? normalizeRecipientIds(
              rawSchema.createdBy ||
                rawSchema.lastModifiedBy ||
                '__unassigned__',
            )
          : normalizeRecipientIds(
              rawSchema.ownerRecipientIds ||
                rawSchema.ownerRecipientId ||
                '__unassigned__',
            );

      const sharedIdentityKeys =
        mode === 'author' && rawSchema.ownerMode === 'shared'
          ? [SHARED_ASSIGNMENTS_BUCKET]
          : [];

      identities.concat(sharedIdentityKeys).forEach((identity) => {
        if (!assignments[identity]) assignments[identity] = {};
        if (!assignments[identity][fileId]) assignments[identity][fileId] = {};
        if (!assignments[identity][fileId][pageKey]) {
          assignments[identity][fileId][pageKey] = [];
        }
        assignments[identity][fileId][pageKey].push(schemaUid);
      });
    },
  );

  dedupeAssignmentTree(assignments as unknown as Record<string, unknown>, 2);

  return assignments;
};

/**
 * Genera assignments por destinatario/recipient.
 *
 * Estructura:
 *
 * assignments[recipientId][fileId][pageKey] = [schemaUid]
 */
export const buildSchemaAssignments = (
  schemas: SchemaPageArray,
): SchemaAssignments => buildAssignments(schemas, 'recipient');

/**
 * Genera assignments por autor/usuario.
 *
 * Estructura:
 *
 * assignments[userId][fileId][pageKey] = [schemaUid]
 */
export const buildUserSchemaAssignments = (
  schemas: SchemaPageArray,
): SchemaAssignments => buildAssignments(schemas, 'author');

/**
 * Genera assignments combinados por usuario y recipient.
 *
 * Estructura:
 *
 * assignments[userId][recipientId][fileId][pageKey] = [schemaUid]
 *
 * Esto permite responder preguntas como:
 *
 * - qué campos creó/modificó un usuario;
 * - qué campos de ese usuario pertenecen a cada recipient;
 * - en qué documento/página están esos campos.
 */
export const buildUserRecipientAssignments = (
  schemas: SchemaPageArray,
  options: UserRecipientAssignmentOptions = {},
): UserRecipientSchemaAssignments => {
  const sharedRecipientKey =
    normalizeCollaborationCommonText(options.sharedRecipientKey) || SHARED_ASSIGNMENTS_BUCKET;

  const unassignedUserKey =
    normalizeCollaborationCommonText(options.unassignedUserKey) || '__unassigned__';

  const unassignedRecipientKey =
    normalizeCollaborationCommonText(options.unassignedRecipientKey) || '__unassigned__';

  const includeSharedRecipientBucket =
    options.includeSharedRecipientBucket !== false;

  const assignments: UserRecipientSchemaAssignments = {};

  forEachSchemaAssignmentLocation(
    schemas,
    ({ schema: rawSchema, schemaUid, fileId, pageKey }) => {
      const userIds = normalizeRecipientIds(
        rawSchema.createdBy || rawSchema.lastModifiedBy || unassignedUserKey,
      );

      const normalizedSingle = normalizeRecipientIds(
        rawSchema.ownerRecipientId ||
          rawSchema.ownerRecipientIds ||
          unassignedRecipientKey,
      );
      const normalizedMulti = normalizeRecipientIds(
        rawSchema.ownerRecipientIds ||
          rawSchema.ownerRecipientId ||
          unassignedRecipientKey,
      );
      const recipientIds =
        rawSchema.ownerMode === 'single'
          ? normalizedSingle.slice(0, 1)
          : normalizedMulti.length > 0
            ? normalizedMulti
            : normalizedSingle;

      if (
        rawSchema.ownerMode === 'shared' &&
        includeSharedRecipientBucket &&
        !recipientIds.includes(sharedRecipientKey)
      ) {
        recipientIds.push(sharedRecipientKey);
      }

      userIds.forEach((userId) => {
        if (!assignments[userId]) assignments[userId] = {};

        recipientIds.forEach((recipientId) => {
          if (!assignments[userId][recipientId]) {
            assignments[userId][recipientId] = {};
          }
          if (!assignments[userId][recipientId][fileId]) {
            assignments[userId][recipientId][fileId] = {};
          }
          if (!assignments[userId][recipientId][fileId][pageKey]) {
            assignments[userId][recipientId][fileId][pageKey] = [];
          }
          assignments[userId][recipientId][fileId][pageKey].push(schemaUid);
        });
      });
    },
  );

  dedupeAssignmentTree(assignments as unknown as Record<string, unknown>, 3);

  return assignments;
};

/**
 * Valida que los schemas tengan metadata mínima colaborativa.
 *
 * Actualmente revisa:
 *
 * - createdBy
 * - userColor
 *
 * Retorna:
 *
 * {
 *   valid: boolean;
 *   issues: Array<{
 *     schemaUid: string;
 *     reason: 'missing-createdBy' | 'missing-userColor';
 *   }>
 * }
 */
export const validateCollaborativeSchemas = (
  schemas: SchemaPageArray,
) => {
  const issues: Array<{
    schemaUid: string;
    reason: 'missing-createdBy' | 'missing-userColor';
  }> = [];

  schemas.forEach((page) => {
    page.forEach((schema) => {
      const rawSchema = schema as SchemaForUI & {
        schemaUid?: string;
        createdBy?: string;
        userColor?: string;
      };

      const schemaUid = String(
        rawSchema.schemaUid || rawSchema.id || rawSchema.name || '',
      ).trim();

      if (!schemaUid) return;

      if (!String(rawSchema.createdBy || '').trim()) {
        issues.push({
          schemaUid,
          reason: 'missing-createdBy',
        });
      }

      if (!String(rawSchema.userColor || '').trim()) {
        issues.push({
          schemaUid,
          reason: 'missing-userColor',
        });
      }
    });
  });

  return {
    valid: issues.length === 0,
    issues,
  };
};

/**
 * schemaAssignmentService — modelo único para reasignar el responsable
 * (owner/recipient) de uno o varios schemas.
 *
 * Rol arquitectónico:
 * - Fuente de verdad de QUÉ campos cambia una reasignación y con qué valores.
 * - Reutilizado por ListView (toolbar) y por el DetailView (colaboración) para
 *   evitar tres implementaciones divergentes del mismo patch de propietario.
 *
 * Reglas clave (ver plan §5):
 * - Reasignar responsable cambia SOLO propietario/recipient/color/modo.
 * - NUNCA toca `locked`, `readOnly`, `objectLocked` ni el lock de colaboración.
 * - No duplica co-propietarios: la reasignación deja un único owner.
 * - El color visual se actualiza según el nuevo propietario.
 */
import type { SchemaForUI } from '@sisad-pdfme/common';

/**
 * Destinatario mínimo necesario para reasignar un schema.
 */
export type AssignableRecipient = {
  id: string;
  name?: string | null;
  color?: string | null;
};

/**
 * Operación individual compatible con `changeSchemas`.
 */
export type SchemaChangeOp = {
  key: string;
  value: unknown;
  schemaId: string;
};

/**
 * Resultado de la reasignación pura sobre páginas de un template.
 */
export type AssignSchemaOwnerResult = {
  pages: SchemaForUI[][];
  changedSchemaUids: string[];
};

const normalizeText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

/**
 * Resuelve la identidad estable de un schema.
 *
 * Prioriza `schemaUid` (identidad colaborativa) y cae a `id` y luego `name`
 * para tolerar schemas aún sin UID asignado.
 */
export const resolveSchemaUid = (schema: SchemaForUI): string => {
  const record = schema as SchemaForUI & { schemaUid?: string };
  return normalizeText(record.schemaUid) || normalizeText(schema.id) || normalizeText(schema.name);
};

/**
 * Opciones del patch de reasignación.
 *
 * `actorId` identifica a quien ejecuta la reasignación para trazar
 * `lastModifiedBy`; si falta, el campo no se toca.
 */
export type SchemaOwnerPatchOptions = {
  actorId?: string | null;
};

/**
 * Construye el patch de propietario único aplicado por una reasignación.
 *
 * Intencionalmente NO incluye `locked`, `readOnly` ni `objectLocked`.
 */
export const buildSchemaOwnerPatch = (
  recipient: AssignableRecipient,
  options: SchemaOwnerPatchOptions = {},
): Record<string, unknown> => {
  const nextRecipientId = normalizeText(recipient?.id);
  const nextRecipientName = normalizeText(recipient?.name) || nextRecipientId;
  const nextRecipientColor = normalizeText(recipient?.color) || null;
  const actorId = normalizeText(options.actorId);

  return {
    ownerRecipientId: nextRecipientId,
    ownerRecipientIds: [nextRecipientId],
    recipientId: nextRecipientId,
    ownerRecipientName: nextRecipientName,
    ownerColor: nextRecipientColor,
    recipientColor: nextRecipientColor,
    userColor: nextRecipientColor,
    ownerMode: 'single',
    ...(actorId ? { lastModifiedBy: actorId } : {}),
  };
};

/**
 * Construye las operaciones `changeSchemas` para reasignar el owner de un
 * conjunto de schemas (identificados por `schema.id`).
 */
export const buildAssignSchemaOwnerOps = (
  schemas: SchemaForUI[],
  schemaIds: string[],
  recipient: AssignableRecipient,
  options: SchemaOwnerPatchOptions = {},
): SchemaChangeOp[] => {
  const nextRecipientId = normalizeText(recipient?.id);
  if (!nextRecipientId) return [];
  const idSet = new Set(schemaIds.map((id) => normalizeText(id)).filter(Boolean));
  const patch = buildSchemaOwnerPatch(recipient, options);

  return schemas
    .filter((schema) => {
      const schemaUid = resolveSchemaUid(schema);
      return idSet.has(normalizeText(schema.id)) || idSet.has(schemaUid);
    })
    .flatMap((schema) =>
      Object.entries(patch).map(([key, value]) => ({ key, value, schemaId: schema.id })),
    );
};

/**
 * Reasigna de forma pura el owner de los schemas indicados dentro de las
 * páginas de un template.
 *
 * Preserva explícitamente el estado de bloqueo/solo-lectura de cada schema para
 * documentar la invariante (aunque el spread ya lo conservaría).
 *
 * @returns Nuevas páginas inmutables y los UIDs efectivamente modificados.
 */
export const assignSchemaOwner = (input: {
  pages: SchemaForUI[][];
  schemaUids: string[];
  recipient: AssignableRecipient;
  actorId?: string | null;
}): AssignSchemaOwnerResult => {
  const nextRecipientId = normalizeText(input.recipient?.id);
  if (!nextRecipientId) {
    return { pages: input.pages, changedSchemaUids: [] };
  }

  const targetUids = new Set(input.schemaUids.map((uid) => normalizeText(uid)).filter(Boolean));
  if (targetUids.size === 0) {
    return { pages: input.pages, changedSchemaUids: [] };
  }

  const patch = buildSchemaOwnerPatch(input.recipient, { actorId: input.actorId });
  const changedSchemaUids: string[] = [];

  const pages = input.pages.map((page) =>
    page.map((schema) => {
      const uid = resolveSchemaUid(schema);
      if (!targetUids.has(uid)) return schema;

      changedSchemaUids.push(uid);
      const source = schema as SchemaForUI & {
        locked?: unknown;
        readOnly?: unknown;
        objectLocked?: unknown;
        lock?: unknown;
      };

      return {
        ...schema,
        ...patch,
        // Invariante: reasignar responsable NO altera el bloqueo/solo-lectura.
        locked: source.locked,
        readOnly: source.readOnly,
        objectLocked: source.objectLocked,
        lock: source.lock,
      } as SchemaForUI;
    }),
  );

  return { pages, changedSchemaUids };
};

/**
 * Resuelve el propietario común de una selección de schemas.
 *
 * @returns `recipientId` cuando todos comparten owner; `mixed=true` cuando hay
 * propietarios distintos entre los schemas seleccionados.
 */
export const resolveSelectionOwner = (
  schemas: SchemaForUI[],
): { recipientId: string | null; mixed: boolean } => {
  const owners = new Set<string>();
  let hasUnassigned = false;

  schemas.forEach((schema) => {
    const record = schema as SchemaForUI & {
      ownerRecipientId?: string;
      ownerRecipientIds?: string[] | string;
      recipientId?: string;
    };
    const ownerId =
      normalizeText(record.ownerRecipientId) ||
      normalizeText(Array.isArray(record.ownerRecipientIds) ? record.ownerRecipientIds[0] : record.ownerRecipientIds) ||
      normalizeText(record.recipientId);
    if (ownerId) {
      owners.add(ownerId);
    } else {
      hasUnassigned = true;
    }
  });

  if (owners.size === 0) {
    return { recipientId: null, mixed: false };
  }
  if (owners.size === 1 && !hasUnassigned) {
    return { recipientId: [...owners][0], mixed: false };
  }
  return { recipientId: null, mixed: true };
};

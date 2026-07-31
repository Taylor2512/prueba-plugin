import { Schema } from '@sisad-pdfme/common';
import { resolveDesignerSchemaFamily, type SchemaFamily } from './schemaFamilies.js';

/**
 * Contexto extendido para evaluar el acceso a un schema.
 */
export type SchemaAccessContext = {
  activeActorId?: string;
  collaborationContext?: {
    isCollaborative: boolean;
    userId: string;
    canEditStructure: boolean;
  };
  canEditStructure?: boolean;
  /** `runtime.readonly` de la configuración: gana sobre cualquier otra fuente. */
  runtimeReadonly?: boolean;
  /**
   * Filtro por recipient activo. Cuando está activo, un schema de otro owner
   * no es editable aunque no tenga candado.
   */
  enforceOwnership?: boolean;
};

/** Capacidades cuyo rechazo debe poder explicarse. */
export type SchemaAccessCapability = 'move' | 'resize' | 'edit' | 'delete';

/**
 * Motivo por el que se deniega una capacidad.
 *
 * Un control visible siempre debe tener handler o `reason`: sin esto la UI
 * muestra botones inertes sin explicar por qué.
 */
export type SchemaAccessDenyReason =
  | 'runtime-readonly'
  | 'locked-by-other'
  | 'schema-locked'
  | 'schema-readonly'
  | 'object-locked'
  | 'not-owner'
  | 'structure-locked'
  | 'family-not-resizable'
  | 'family-not-deletable';

/**
 * Representa los permisos efectivos sobre un componente schema en la UI.
 */
export type SchemaAccessState = {
  uid: string;
  family: SchemaFamily;
  isSelectable: boolean;
  isMovable: boolean;
  isResizable: boolean;
  isEditable: boolean;
  isDeletable: boolean;
  isLockedByOther: boolean;
  lockingActorId: string | null;
  /** `null` cuando la capacidad está permitida. */
  reasons: Record<SchemaAccessCapability, SchemaAccessDenyReason | null>;
};

/**
 * Alias de compatibilidad para el contrato previo del canvas.
 */
type SchemaWithLock = Schema & {
  lockedByActorId?: string | null;
  locked?: boolean;
  readOnly?: boolean;
  objectLocked?: boolean;
  ownerRecipientId?: string | null;
  ownerRecipientIds?: string[];
};

/**
 * Primer motivo que aplica, en orden de precedencia.
 *
 * El orden importa: `runtime-readonly` gana sobre todo porque desactiva la
 * edición entera, y el candado ajeno gana sobre las banderas propias del
 * schema porque es una condición de colaboración.
 */
const firstReason = (
  candidates: Array<[boolean, SchemaAccessDenyReason]>,
): SchemaAccessDenyReason | null => candidates.find(([applies]) => applies)?.[1] ?? null;

/** ¿El schema pertenece al actor activo? Sin owner declarado, es de todos. */
const isOwnedByActor = (schema: SchemaWithLock, actorId?: string): boolean => {
  const owners = [
    ...(schema.ownerRecipientIds || []),
    ...(schema.ownerRecipientId ? [schema.ownerRecipientId] : []),
  ].filter(Boolean);
  if (owners.length === 0) return true;
  return Boolean(actorId) && owners.includes(actorId as string);
};

/**
 * Resuelve el estado de acceso de un schema basándose en el contexto y candados.
 */
export function resolveDesignerSchemaAccessState(
  schema: Schema,
  ctx: SchemaAccessContext
): SchemaAccessState {
  const family = resolveDesignerSchemaFamily(schema);
  const collab = ctx.collaborationContext;

  // 1. Detección de candado ajeno
  const lockedBy = (schema as SchemaWithLock).lockedByActorId;
  const isLockedByOther = !!lockedBy && lockedBy !== collab?.userId;

  // 2. Capacidad base del entorno
  const canEditBase = collab ? collab.canEditStructure : (ctx.canEditStructure ?? true);

  // 3. Reglas por familia (Harden Layout/Dynamic)
  const isLayout = family === 'layout';
  const isInteractive = family === 'interactive';

  // 4. Fuentes de bloqueo que antes no se consultaban aquí y cada superficie
  //    interpretaba por su cuenta.
  const withLock = schema as SchemaWithLock;
  const runtimeReadonly = ctx.runtimeReadonly === true;
  const schemaLocked = withLock.locked === true;
  const schemaReadOnly = withLock.readOnly === true;
  const objectLocked = withLock.objectLocked === true;
  const notOwner = ctx.enforceOwnership === true && !isOwnedByActor(withLock, ctx.activeActorId);

  /** Motivos comunes a toda capacidad, en orden de precedencia. */
  const commonReasons: Array<[boolean, SchemaAccessDenyReason]> = [
    [runtimeReadonly, 'runtime-readonly'],
    [isLockedByOther, 'locked-by-other'],
    [schemaLocked, 'schema-locked'],
    [objectLocked, 'object-locked'],
    [notOwner, 'not-owner'],
    [!canEditBase, 'structure-locked'],
  ];

  const reasons: Record<SchemaAccessCapability, SchemaAccessDenyReason | null> = {
    move: firstReason(commonReasons),
    resize: firstReason([...commonReasons, [isInteractive, 'family-not-resizable']]),
    // La edición de contenido añade `readOnly`, que no impide mover ni borrar.
    edit: firstReason([...commonReasons, [schemaReadOnly, 'schema-readonly']]),
    delete: firstReason([...commonReasons, [isLayout, 'family-not-deletable']]),
  };

  return {
    uid: schema.id,
    family,
    isSelectable: true, // Siempre seleccionable para inspección
    isMovable: reasons.move === null,
    isResizable: reasons.resize === null, // Firmas suelen tener ratio fijo
    isEditable: reasons.edit === null,
    isDeletable: reasons.delete === null, // Evitar borrar layout sin confirmación específica
    isLockedByOther,
    lockingActorId: lockedBy || null,
    reasons,
  };
}

/** Motivo por el que una capacidad está denegada, o `null` si está permitida. */
export function schemaAccessDenyReason(
  access: SchemaAccessState,
  capability: SchemaAccessCapability,
): SchemaAccessDenyReason | null {
  return access.reasons[capability];
}

/**
 * Determina si un comando específico puede ejecutarse sobre un schema con un acceso dado.
 */
export function canRunSchemaCommand(commandId: string, access: SchemaAccessState): boolean {
  if (access.isLockedByOther) return false;

  const normalizedId = (commandId || '').toLowerCase();

  // Comandos de mutación geométrica (Mover/Redimensionar)
  if (
    normalizedId.includes('move') ||
    normalizedId.includes('resize') ||
    normalizedId.includes('transform') ||
    normalizedId.includes('align') ||
    normalizedId.includes('distribute')
  ) {
    return access.isMovable || access.isResizable;
  }

  // Comandos de eliminación
  if (normalizedId.includes('delete') || normalizedId.includes('remove')) {
    return access.isDeletable;
  }

  // Comandos de modificación de estructura/contenido/metadata
  if (
    normalizedId.includes('update') ||
    normalizedId.includes('change') ||
    normalizedId.includes('group') ||
    normalizedId.includes('ungroup') ||
    normalizedId.includes('order') ||
    normalizedId.includes('style')
  ) {
    return access.isEditable;
  }

  return true;
}

/**
 * Compatibilidad para callers que solo necesitan saber si el schema puede transformarse.
 */
export function isTransformable(access: Pick<SchemaAccessState, 'isMovable' | 'isResizable' | 'isLockedByOther'>) {
  return !access.isLockedByOther && (access.isMovable || access.isResizable);
}

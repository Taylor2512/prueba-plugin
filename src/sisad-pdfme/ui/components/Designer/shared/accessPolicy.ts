import { Schema } from '@sisad-pdfme/common';
import { resolveSchemaFamily, type SchemaFamily } from './schemaFamilies.js';

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
};

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
};

/**
 * Alias de compatibilidad para el contrato previo del canvas.
 */
export type AccessState = SchemaAccessState;

type SchemaWithLock = Schema & {
  lockedByActorId?: string | null;
};

/**
 * Resuelve el estado de acceso de un schema basándose en el contexto y candados.
 */
export function resolveSchemaAccessState(
  schema: Schema,
  ctx: SchemaAccessContext
): SchemaAccessState {
  const family = resolveSchemaFamily(schema);
  const collab = ctx.collaborationContext;

  // 1. Detección de candado ajeno
  const lockedBy = (schema as SchemaWithLock).lockedByActorId;
  const isLockedByOther = !!lockedBy && lockedBy !== collab?.userId;

  // 2. Capacidad base del entorno
  const canEditBase = collab ? collab.canEditStructure : (ctx.canEditStructure ?? true);

  // 3. Reglas por familia (Harden Layout/Dynamic)
  const isLayout = family === 'layout';
  const isInteractive = family === 'interactive';

  return {
    uid: schema.id,
    family,
    isSelectable: true, // Siempre seleccionable para inspección
    isMovable: canEditBase && !isLockedByOther,
    isResizable: canEditBase && !isLockedByOther && !isInteractive, // Firmas suelen tener ratio fijo
    isEditable: canEditBase && !isLockedByOther,
    isDeletable: canEditBase && !isLockedByOther && !isLayout, // Evitar borrar layout por error sin confirmación específica
    isLockedByOther,
    lockingActorId: lockedBy || null,
  };
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

/**
 * Compatibilidad para callers que solo necesitan saber si el schema puede editarse.
 */
export function isContentEditable(access: Pick<SchemaAccessState, 'isEditable' | 'isLockedByOther'>) {
  return !access.isLockedByOther && access.isEditable;
}

/**
 * Resuelve solo los booleanos básicos para compatibilidad legacy si fuera necesario.
 */
export function resolveSchemaAccess(schema: SchemaWithLock, userId?: string) {
  const lockedBy = schema.lockedByActorId;
  const isLockedByOther = !!lockedBy && lockedBy !== userId;
  return {
    isEditable: !isLockedByOther,
    isMovable: !isLockedByOther,
    isLockedByOther,
  };
}

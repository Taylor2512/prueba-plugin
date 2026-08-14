/**
 * schemaRuntimeAccess — contrato único para resolver si un schema puede verse,
 * editarse, moverse, redimensionarse, eliminarse o bloquearse según:
 *
 * - modo runtime: designer, form, viewer o pdf;
 * - destinatario activo;
 * - vista global;
 * - ownership colaborativo;
 * - locks colaborativos;
 * - flags readonly/locked/hidden del schema.
 *
 * Fuente de verdad:
 * Reutiliza `resolveSchemaCollaborationState` desde `collaborationContext`,
 * evitando duplicar reglas de visibilidad, owner, destinatario activo o color.
 *
 * Importante:
 * Este módulo solo toma decisiones de datos. No aplica CSS, no usa display:none,
 * no modifica opacidad y no manipula DOM. Renderers, contadores, toolbar,
 * inspector y menús deben consumir este resultado para mantenerse sincronizados.
 */
import type { SchemaForUI } from '@sisad-pdfme/common';

import {
  resolveSchemaCollaborationState,
  type CollaborationRecipientOption,
  type EffectiveCollaborationContext,
} from '../collaborationContext.js';

/**
 * Modo runtime donde se evalúa el acceso del schema.
 *
 * designer:
 * Modo de edición estructural del documento.
 *
 * form:
 * Modo de llenado por destinatario.
 *
 * viewer:
 * Modo de visualización sin edición.
 *
 * pdf:
 * Modo de generación/exportación PDF.
 */
export type RuntimeMode = 'designer' | 'form' | 'viewer' | 'pdf';

/**
 * Razón normalizada del resultado de acceso runtime.
 *
 * Esta razón permite que UI, logs, contadores, inspector y tests expliquen
 * por qué un schema está visible, oculto, editable o readonly.
 */
type RuntimeSchemaAccessReason =
  /**
   * El destinatario activo es propietario del schema.
   */
  | 'active-owner'

  /**
   * El schema está compartido entre varios destinatarios.
   */
  | 'shared'

  /**
   * La vista global permite visualizar schemas sin filtrar por destinatario.
   */
  | 'global-view'

  /**
   * El schema está visible, pero solo lectura.
   */
  | 'readonly'

  /**
   * El schema está bloqueado y no puede editarse.
   */
  | 'locked'

  /**
   * El schema está oculto explícitamente.
   */
  | 'hidden'

  /**
   * El schema pertenece a otro destinatario.
   */
  | 'otherrecipient'

  /**
   * El schema no tiene propietario asignado.
   */
  | 'no-owner'

  /**
   * El schema se evalúa en modo designer.
   */
  | 'designer'

  /**
   * El modo runtime recibido no es reconocido.
   */
  | 'invalid-mode';

/**
 * Resultado plano de acceso runtime para un schema.
 *
 * Este contrato debe ser consumido por renderers, contadores, canvas,
 * inspector y toolbar para que todos apliquen la misma regla.
 */
export type RuntimeSchemaAccess = {
  /**
   * Indica si el schema debe renderizarse o contarse como visible.
   */
  visible: boolean;

  /**
   * Indica si el schema puede editarse en el modo actual.
   */
  editable: boolean;

  /**
   * Indica si el schema debe tratarse como solo lectura.
   */
  readonly: boolean;

  /**
   * Motivo principal que explica el estado de acceso.
   */
  reason: RuntimeSchemaAccessReason;

  /**
   * Destinatario propietario principal del schema.
   */
  ownerRecipientId: string | null;

  /**
   * Lista de destinatarios propietarios o participantes del schema.
   */
  ownerRecipientIds: string[];

  /**
   * Color visual del propietario resuelto por colaboración.
   */
  ownerColor: string | null;

  /**
   * Destinatario activo usado para resolver visibilidad/editabilidad.
   *
   * En vista global se normaliza a null.
   */
  activeRecipientId: string | null;

  /**
   * Modo runtime evaluado.
   */
  mode: RuntimeMode;

  /**
   * Indica si la evaluación se hizo en vista global.
   */
  isGlobalView: boolean;
};

/**
 * Subconjunto del contexto colaborativo necesario para resolver acceso runtime.
 *
 * Se usa `Pick` para mantener este módulo desacoplado del contexto completo
 * y evitar arrastrar dependencias que no son necesarias para acceso.
 */
type CollabCtx = Pick<
  EffectiveCollaborationContext,
  | 'recipientColorMap'
  | 'recipientNameMap'
  | 'activeRecipientId'
  | 'activeRecipient'
  | 'isGlobalView'
  | 'actorColor'
  | 'canEditStructure'
  | 'actorId'
>;

/**
 * Lee un campo booleano flexible desde el schema.
 *
 * Se usa para flags que pueden venir como propiedades dinámicas:
 *
 * - hidden;
 * - locked;
 * - readOnly;
 * - readonly.
 */
const boolField = (schema: SchemaForUI, key: string): boolean =>
  Boolean((schema as SchemaForUI & Record<string, unknown>)[key]);

/**
 * Normaliza texto dinámico.
 *
 * Devuelve string vacío si el valor no es string.
 */
const normalizeRuntimeText = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

/**
 * Normaliza texto dinámico a string o null.
 *
 * Útil para IDs opcionales donde string vacío debe tratarse como ausencia.
 */
const normalizeNullableText = (value: unknown): string | null => {
  const normalized = normalizeRuntimeText(value);
  return normalized || null;
};

/**
 * Resuelve la etiqueta visible del dueño de un lock o propietario.
 *
 * Prioridad:
 *
 * 1. nombre dentro del mapa de destinatarios;
 * 2. nombre del destinatario activo;
 * 3. ID crudo como fallback.
 */
const resolveLockOwnerLabel = (
  lockOwnerId: string | null,
  collaborationContext?: CollabCtx,
  activeRecipient?: CollaborationRecipientOption | null,
): string => {
  if (!lockOwnerId) return '';
  if (activeRecipient?.id === lockOwnerId && activeRecipient.name) {
    return activeRecipient.name;
  }

  return (
    collaborationContext?.recipientNameMap?.get(lockOwnerId) ||
    lockOwnerId
  );
};

/**
 * Estado de acceso operativo usado por inspector, toolbar y menús del canvas.
 *
 * A diferencia de `RuntimeSchemaAccess`, este contrato está más enfocado
 * en acciones de edición dentro del diseñador:
 *
 * - mover;
 * - redimensionar;
 * - eliminar;
 * - bloquear/desbloquear;
 * - mostrar estado en inspector;
 * - decidir si un menú contextual debe estar deshabilitado.
 */
export type SchemaAccessState = {
  /**
   * Estado resumido del lock colaborativo.
   */
  collaborationLock: 'none' | 'mine' | 'other' | 'unknown';

  /**
   * Indica si el schema tiene bloqueo de posición propio.
   */
  objectLocked: boolean;

  /**
   * Indica si el schema está en modo solo lectura.
   */
  readonly: boolean;

  /**
   * Permiso de edición de propiedades no geométricas.
   */
  canEditProperties: boolean;

  /**
   * Permiso de reubicación del schema.
   */
  canMove: boolean;

  /**
   * Permiso de redimensionamiento del schema.
   */
  canResize: boolean;

  /**
   * Permiso de eliminación del schema.
   */
  canDelete: boolean;

  /**
   * Permiso de reasignación del schema.
   */
  canReassign: boolean;

  /**
   * Etiqueta de estado unificada para inspector y widgets.
   */
  statusLabel: string;

  /**
   * Tono visual sugerido para el estado unificado.
   */
  statusTone: 'success' | 'warning' | 'error' | 'processing';

  /**
   * Identificador del dueño del lock colaborativo.
   */
  lockOwnerId: string | null;

  /**
   * Nombre visible del dueño del lock colaborativo.
   */
  lockOwnerLabel: string | null;

  /**
   * Etiqueta visible del propietario del schema.
   */
  ownerLabel: string;

  /**
   * Indica si el schema tiene lock colaborativo activo.
   */
  hasCollaborationLock: boolean;

  /**
   * Indica si el lock activo pertenece al actor/destinatario actual.
   */
  isLockedByMe: boolean;

  /**
   * Indica si el schema está bloqueado por otro actor/destinatario.
   */
  isLockedByOther: boolean;

  /**
   * Etiqueta visible del usuario/destinatario que bloqueó el schema.
   */
  lockedByLabel: string;

  /**
   * Indica si el objeto está bloqueado por flag propio del schema.
   *
   * Este bloqueo es distinto del lock colaborativo.
   */
  isObjectLocked: boolean;

  /**
   * Indica si el schema es solo lectura por flags `readOnly` o `readonly`.
   */
  isReadonly: boolean;

  /**
   * Permiso final de edición general (alias directo de `canEditProperties`).
   */
  canEdit: boolean;

  /**
   * Texto que debe mostrar el menú contextual para bloquear/desbloquear.
   */
  contextMenuLockLabel: string;

  /**
   * Indica si la acción de lock del menú contextual está deshabilitada.
   */
  contextMenuLockDisabled: boolean;

  /**
   * Texto de estado para el inspector (alias directo de `statusLabel`).
   */
  inspectorStatusLabel: string;

  /**
   * Tono visual sugerido para el inspector.
   */
  inspectorStatusTone: 'success' | 'warning' | 'error' | 'processing';
};

/**
 * Resuelve el estado operativo de acceso de un schema.
 *
 * Este resolver es compartido por:
 *
 * - inspector;
 * - toolbar;
 * - canvas context menu;
 * - acciones de lock/unlock;
 * - acciones de mover/redimensionar/eliminar.
 *
 * Mantiene separadas tres fuentes de restricción:
 *
 * 1. lock colaborativo;
 * 2. bloqueo propio del objeto;
 * 3. modo readonly.
 *
 * @param schema Schema evaluado.
 * @param collaborationContext Contexto colaborativo actual.
 * @param activeRecipient Destinatario activo opcional usado como fallback visual.
 * @returns Estado final de acceso y etiquetas listas para UI.
 */
export const resolveSchemaAccessState = (
  schema: SchemaForUI,
  collaborationContext?: CollabCtx,
  activeRecipient?: CollaborationRecipientOption | null,
): SchemaAccessState => {
  const state = resolveSchemaCollaborationState(schema, collaborationContext);

  const schemaRecord = schema as SchemaForUI & {
    lock?: {
      lockedBy?: string | null;
      ownerUserId?: string | null;
      lockedAt?: number | null;
      reason?: string | null;
    } | null;
    readOnly?: boolean;
    readonly?: boolean;
    locked?: boolean;
    ownerRecipientName?: string | null;
    ownerRecipientId?: string | null;
    lockedByActorId?: string | null;
  };

  const isReadonly = boolField(schema, 'readOnly') || boolField(schema, 'readonly');
  const isObjectLocked = boolField(schema, 'locked');

  const hasCollaborationLock = Boolean(
    schema.state === 'locked' ||
      schemaRecord.lock?.lockedBy ||
      schemaRecord.lock?.ownerUserId ||
      schemaRecord.lock?.lockedAt ||
      schemaRecord.lock?.reason ||
      schemaRecord.lockedByActorId,
  );

  const currentActorId = normalizeRuntimeText(collaborationContext?.actorId);
  const currentRecipientId = normalizeRuntimeText(collaborationContext?.activeRecipientId);

  const lockOwnerId =
    normalizeNullableText(schemaRecord.lock?.lockedBy) ||
    normalizeNullableText(schemaRecord.lock?.ownerUserId) ||
    normalizeNullableText(schemaRecord.lockedByActorId);

  const isLockedByMe = Boolean(
    hasCollaborationLock &&
      lockOwnerId &&
      [currentActorId, currentRecipientId].filter(Boolean).includes(lockOwnerId),
  );

  const collaborationLock: SchemaAccessState['collaborationLock'] = !hasCollaborationLock
    ? 'none'
    : lockOwnerId
      ? isLockedByMe
        ? 'mine'
        : 'other'
      : 'unknown';
  const isLockedByOther = collaborationLock === 'other';

  const ownerLabel =
    normalizeNullableText(state.ownerRecipientName) ||
    resolveLockOwnerLabel(state.ownerRecipientId, collaborationContext, activeRecipient) ||
    'Sin asignar';

  const lockedByLabel =
    collaborationLock === 'other' || collaborationLock === 'mine'
      ? resolveLockOwnerLabel(lockOwnerId, collaborationContext, activeRecipient)
      : '';

  const hasStructurePermission = collaborationContext?.canEditStructure !== false;
  const canEditProperties = Boolean(
    hasStructurePermission &&
      !isReadonly &&
      collaborationLock !== 'other' &&
      collaborationLock !== 'unknown',
  );
  const canMove = Boolean(canEditProperties && !isObjectLocked);
  const canResize = Boolean(canEditProperties && !isObjectLocked);
  const canDelete = Boolean(canEditProperties && !isObjectLocked);
  const canReassign = Boolean(hasStructurePermission && collaborationLock !== 'other');

  const statusLabel =
    !hasStructurePermission
      ? 'Sin permiso de edición'
      : collaborationLock === 'other'
        ? `Bloqueado por ${lockedByLabel || 'otro usuario'}`
        : collaborationLock === 'mine'
          ? 'En edición por ti'
          : isReadonly
            ? 'Solo lectura'
            : isObjectLocked
              ? 'Posición bloqueada'
              : collaborationLock === 'unknown'
                ? 'Bloqueo sin responsable'
                : 'Disponible';

  const statusTone: SchemaAccessState['statusTone'] =
    !hasStructurePermission || collaborationLock === 'other'
      ? 'error'
      : collaborationLock === 'mine'
        ? 'success'
        : isReadonly || collaborationLock === 'unknown'
          ? 'warning'
          : isObjectLocked
            ? 'processing'
            : 'warning';

  return {
    collaborationLock,
    objectLocked: isObjectLocked,
    readonly: isReadonly,
    canEditProperties,
    canMove,
    canResize,
    canDelete,
    canReassign,
    statusLabel,
    statusTone,
    lockOwnerId: lockOwnerId || null,
    lockOwnerLabel: lockedByLabel || null,
    ownerLabel,
    hasCollaborationLock,
    isLockedByMe,
    isLockedByOther,
    lockedByLabel,
    isObjectLocked,
    isReadonly,
    canEdit: canEditProperties,
    // El lock del menú contextual habla de POSICIÓN (objectLocked); solo el
    // lock colaborativo propio se libera como "edición".
    contextMenuLockLabel: isLockedByOther
      ? `Bloqueado por ${lockedByLabel || 'otro usuario'}`
      : isLockedByMe
        ? 'Liberar edición'
        : isObjectLocked
          ? 'Desbloquear posición'
          : 'Bloquear posición',
    contextMenuLockDisabled:
      isLockedByOther || collaborationContext?.canEditStructure === false,
    inspectorStatusLabel: statusLabel,
    inspectorStatusTone: statusTone,
  };
};

/**
 * Resuelve el acceso runtime de un schema.
 *
 * Es una función pura:
 *
 * - no modifica el schema;
 * - no modifica contexto;
 * - no toca DOM;
 * - no aplica estilos;
 * - mismos inputs producen el mismo output.
 *
 * Reglas principales:
 *
 * 1. `hidden` gana siempre y oculta el schema.
 * 2. modo inválido deja visible pero readonly.
 * 3. visibilidad por destinatario se evalúa antes que editabilidad.
 * 4. vista global y pdf pueden ver todo.
 * 5. viewer y pdf nunca editan.
 * 6. designer puede editar si `canEditStructure` lo permite y no está locked.
 * 7. form edita schemas sin owner, shared o del destinatario activo.
 *
 * @param schema Schema evaluado.
 * @param mode Modo runtime donde se evalúa el acceso.
 * @param collaborationContext Contexto colaborativo actual.
 * @returns Resultado plano de visibilidad/editabilidad para renderers.
 */
export const resolveRuntimeSchemaAccess = (
  schema: SchemaForUI,
  mode: RuntimeMode,
  collaborationContext?: CollabCtx,
): RuntimeSchemaAccess => {
  const state = resolveSchemaCollaborationState(schema, collaborationContext);

  const isGlobalView = collaborationContext?.isGlobalView === true;
  const activeRecipientId = isGlobalView
    ? null
    : collaborationContext?.activeRecipientId ?? null;

  const base = {
    ownerRecipientId: state.ownerRecipientId,
    ownerRecipientIds: state.ownerRecipientIds,
    ownerColor: state.ownerColor,
    activeRecipientId,
    mode,
    isGlobalView,
  };

  const hidden = boolField(schema, 'hidden');
  const locked = boolField(schema, 'locked');
  const readOnly = boolField(schema, 'readOnly') || boolField(schema, 'readonly');

  /**
   * Regla 1:
   * hidden gana sobre cualquier otro estado y aplica en todos los modos.
   */
  if (hidden) {
    return {
      ...base,
      visible: false,
      editable: false,
      readonly: true,
      reason: 'hidden',
    };
  }

  /**
   * Modo inválido/desconocido:
   * se conserva visible para no desaparecer datos, pero nunca editable.
   */
  if (mode !== 'designer' && mode !== 'form' && mode !== 'viewer' && mode !== 'pdf') {
    return {
      ...base,
      visible: true,
      editable: false,
      readonly: true,
      reason: 'invalid-mode',
    };
  }

  /**
   * Visibilidad por destinatario:
   *
   * - global view muestra todo;
   * - pdf muestra todo para exportación;
   * - schemas sin owner son visibles;
   * - schemas shared son visibles;
   * - schemas del owner activo son visibles.
   *
   * Designer con vista de usuario activo también respeta esta regla.
   */
  const noOwner = state.ownerRecipientIds.length === 0 && !state.ownerRecipientId;

  const visibleByRecipient =
    isGlobalView ||
    mode === 'pdf' ||
    noOwner ||
    state.isShared ||
    state.isOwnerActive;

  if (!visibleByRecipient) {
    return {
      ...base,
      visible: false,
      editable: false,
      readonly: true,
      reason: 'otherrecipient',
    };
  }

  /**
   * Modo designer:
   * visible según destinatario, editable solo si la estructura puede editarse
   * y el schema no está bloqueado.
   */
  if (mode === 'designer') {
    const canStructure = collaborationContext?.canEditStructure !== false;

    return {
      ...base,
      visible: true,
      editable: canStructure && !locked,
      readonly: locked || readOnly,
      reason: state.isShared
        ? 'shared'
        : state.isOwnerActive
          ? 'active-owner'
          : 'designer',
    };
  }

  /**
   * Viewer y PDF:
   * siempre readonly, nunca editables.
   */
  if (mode === 'viewer' || mode === 'pdf') {
    return {
      ...base,
      visible: true,
      editable: false,
      readonly: true,
      reason: state.isShared ? 'shared' : 'global-view',
    };
  }

  /**
   * Form:
   * locked y readonly se mantienen visibles, pero no editables.
   */
  if (locked) {
    return {
      ...base,
      visible: true,
      editable: false,
      readonly: true,
      reason: 'locked',
    };
  }

  if (readOnly) {
    return {
      ...base,
      visible: true,
      editable: false,
      readonly: true,
      reason: 'readonly',
    };
  }

  /**
   * Form:
   * un schema sin owner es un campo común del formulario y permanece editable.
   * Los schemas shared y del destinatario activo conservan la misma regla.
   */
  const editable = !isGlobalView && (noOwner || state.isShared || state.isOwnerActive);

  if (!editable) {
    return {
      ...base,
      visible: true,
      editable: false,
      readonly: true,
      reason: isGlobalView ? 'global-view' : 'otherrecipient',
    };
  }

  return {
    ...base,
    visible: true,
    editable: true,
    readonly: false,
    reason: noOwner ? 'no-owner' : state.isShared ? 'shared' : 'active-owner',
  };
};

/**
 * Cuenta schemas visibles, editables y bloqueados usando la misma regla
 * que deben usar los renderers.
 *
 * Esta función evita desalineaciones entre:
 *
 * - lo que se renderiza;
 * - lo que se cuenta en UI;
 * - lo que se muestra en badges;
 * - lo que se valida en tests.
 *
 * @param schemas Lista de schemas a evaluar.
 * @param mode Modo runtime donde se evaluará el acceso.
 * @param collaborationContext Contexto colaborativo actual.
 * @returns Contadores de schemas visibles, editables y bloqueados.
 */
export const countRuntimeAccess = (
  schemas: SchemaForUI[],
  mode: RuntimeMode,
  collaborationContext?: CollabCtx,
): { visible: number; editable: number; locked: number } => {
  let visible = 0;
  let editable = 0;
  let locked = 0;

  for (const schema of schemas) {
    const access = resolveRuntimeSchemaAccess(schema, mode, collaborationContext);

    if (access.visible) visible += 1;
    if (access.editable) editable += 1;
    if (access.reason === 'locked') locked += 1;
  }

  return { visible, editable, locked };
};

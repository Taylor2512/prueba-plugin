import {
  filterSchemasByAuthorView,
  normalizeRecipientIds,
  resolveSchemaAuthorId,
  schemaMatchesAuthorView,
  validateCollaborativeSchemas,
  cloneDeep,
  type SchemaForUI,
  type Template,
} from '@sisad-pdfme/common';

/**
 * Estado colaborativo soportado por este módulo.
 *
 * Puede ser:
 *
 * 1. Un Template completo, que contiene schemas.
 * 2. Un arreglo directo de páginas de schemas.
 *
 * Esto permite reutilizar las mismas funciones tanto en flujos donde
 * se manipula el template entero como en flujos donde solo se trabaja
 * con schemas.
 */
type CollaborationState = Template | SchemaForUI[][];

/**
 * Representa una entrada de presencia colaborativa.
 *
 * Sirve para saber qué usuario está activo, en qué documento/página está
 * trabajando y qué schemas tiene seleccionados.
 *
 * El índice `[key: string]: unknown` permite conservar metadata adicional
 * sin romper compatibilidad con estados futuros.
 */
type PresenceEntry = {
  userId?: string;
  name?: string | null;
  color?: string | null;
  activeDocumentId?: string | null;
  activePage?: number | null;
  activeSchemaIds?: string[];
  updatedAt?: number;
  [key: string]: unknown;
};

/**
 * Normaliza cualquier valor a string limpio.
 *
 * Evita problemas con:
 *
 * - null
 * - undefined
 * - espacios extra
 * - valores falsy
 */
const normalizeText = (value: unknown) => String(value || '').trim();

/**
 * Normaliza un color recibido.
 *
 * Actualmente solo limpia el texto.
 *
 * Nota:
 * No valida si el valor es un color CSS válido. Solo garantiza que
 * no tenga espacios extra ni valores null/undefined.
 */
const normalizeColor = (value: unknown) => normalizeText(value);

/**
 * Obtiene las páginas de schemas desde un CollaborationState.
 *
 * Si el state ya es SchemaForUI[][], lo devuelve directamente.
 * Si el state es Template, devuelve state.schemas.
 *
 * En caso de no existir schemas, devuelve [].
 */
const getSchemaPages = (state: CollaborationState) =>
  Array.isArray(state) ? state : state?.schemas || [];

/**
 * Actualiza las páginas de schemas dentro del estado colaborativo.
 *
 * Si el estado original era un arreglo de páginas, retorna directamente
 * el nuevo arreglo.
 *
 * Si el estado original era un Template, retorna una copia shallow
 * del template con la propiedad schemas actualizada.
 */
const updateSchemaPages = (
  state: CollaborationState,
  schemas: SchemaForUI[][],
) => (Array.isArray(state) ? schemas : ({ ...state, schemas } as Template));

/**
 * Recorre todas las páginas del estado y actualiza un schema específico.
 *
 * Busca el schema usando esta prioridad de identificadores:
 *
 * 1. schema.schemaUid
 * 2. schema.id
 * 3. schema.name
 *
 * Si encuentra coincidencia con schemaUid, clona el schema y aplica
 * el updater.
 *
 * Si schemaUid está vacío, devuelve una copia profunda del estado original.
 */
const mapSchemaState = (
  state: CollaborationState,
  schemaUid: string,
  updater: (_schema: SchemaForUI) => SchemaForUI,
) => {
  const normalizedSchemaUid = normalizeText(schemaUid);

  if (!normalizedSchemaUid) return cloneDeep(state);

  const pages = getSchemaPages(state).map((page = []) =>
    page.map((schema) => {
      const currentSchemaUid = normalizeText(
        schema.schemaUid || schema.id || schema.name,
      );

      if (currentSchemaUid !== normalizedSchemaUid) return schema;

      return updater(cloneDeep(schema));
    }),
  );

  return updateSchemaPages(state, pages);
};

/**
 * Busca un schema dentro del estado colaborativo.
 *
 * Recorre página por página y compara contra:
 *
 * - schema.schemaUid
 * - schema.id
 * - schema.name
 *
 * Retorna el schema encontrado o null.
 */
const findSchema = (state: CollaborationState, schemaUid: string) => {
  const normalizedSchemaUid = normalizeText(schemaUid);

  if (!normalizedSchemaUid) return null;

  const pages = getSchemaPages(state);

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const page = pages[pageIndex] || [];

    for (let schemaIndex = 0; schemaIndex < page.length; schemaIndex += 1) {
      const schema = page[schemaIndex];

      const currentSchemaUid = normalizeText(
        schema.schemaUid || schema.id || schema.name,
      );

      if (currentSchemaUid === normalizedSchemaUid) {
        return schema;
      }
    }
  }

  return null;
};

/**
 * Bloquea un schema para edición colaborativa.
 *
 * Agrega o actualiza:
 *
 * - state: 'locked'
 * - userColor
 * - lastModifiedBy
 * - lock.lockedBy
 * - lock.lockedAt
 * - lock.reason
 * - lock.sessionId
 *
 * Uso típico:
 *
 * - cuando un usuario selecciona o empieza a editar un campo;
 * - cuando se quiere evitar edición simultánea del mismo schema;
 * - cuando se necesita mostrar quién tiene bloqueado el campo.
 */
export const lockSchema = (
  schemaUid: string,
  state: CollaborationState,
  user: {
    id?: string | null;
    color?: string | null;
    reason?: string | null;
    sessionId?: string | null;
  } = {},
) =>
  mapSchemaState(state, schemaUid, (schema) => ({
    ...schema,
    state: 'locked',
    userColor: normalizeColor(user.color) || schema.userColor,
    lastModifiedBy: normalizeText(user.id) || schema.lastModifiedBy,
    lock: {
      lockedBy: normalizeText(user.id) || undefined,
      lockedAt: Date.now(),
      reason: normalizeText(user.reason) || undefined,
      sessionId: normalizeText(user.sessionId) || undefined,
    },
  }));

/**
 * Desbloquea un schema previamente bloqueado.
 *
 * Si el schema estaba en estado 'locked', lo vuelve a 'draft'.
 * Si tenía otro estado, conserva ese estado.
 *
 * También limpia la propiedad lock.
 *
 * Uso típico:
 *
 * - cuando el usuario deja de editar el campo;
 * - cuando termina una sesión;
 * - cuando se libera un lock remoto;
 * - cuando se fuerza limpieza de locks expirados.
 */
export const unlockSchema = (
  schemaUid: string,
  state: CollaborationState,
  user: { id?: string | null; color?: string | null } = {},
) =>
  mapSchemaState(state, schemaUid, (schema) => ({
    ...schema,
    state: schema.state === 'locked' ? 'draft' : schema.state,
    userColor: normalizeColor(user.color) || schema.userColor,
    lastModifiedBy: normalizeText(user.id) || schema.lastModifiedBy,
    lock: undefined,
  }));

/**
 * Indica si un schema está bloqueado.
 *
 * Retorna true si el schema tiene lock.lockedBy.
 *
 * No valida expiración del lock ni permisos del usuario actual.
 */
export const isSchemaLocked = (
  schemaUid: string,
  state: CollaborationState,
) => {
  const schema = findSchema(state, schemaUid);

  return Boolean(schema?.lock?.lockedBy);
};

/**
 * Obtiene información de ownership/autores del schema.
 *
 * Normaliza:
 *
 * - ownerRecipientId
 * - ownerRecipientIds
 * - ownerMode
 * - createdBy
 * - lastModifiedBy
 *
 * Esto permite que la UI o los filtros trabajen con una estructura estable,
 * aunque el schema venga con ownerRecipientId simple o ownerRecipientIds array.
 */
export const getSchemaOwner = (schema: SchemaForUI) => ({
  ownerRecipientId: normalizeText(schema?.ownerRecipientId) || null,
  ownerRecipientIds: normalizeRecipientIds(
    schema?.ownerRecipientIds || schema?.ownerRecipientId,
  ),
  ownerMode: schema?.ownerMode || null,
  createdBy: normalizeText(schema?.createdBy) || null,
  lastModifiedBy: normalizeText(schema?.lastModifiedBy) || null,
});

/**
 * Asigna ownership de un schema a un recipient.
 *
 * Si recipientId tiene valor:
 *
 * - ownerMode pasa a 'single'
 * - ownerRecipientId se asigna
 * - ownerRecipientIds queda con un único valor
 *
 * Si recipientId viene vacío/null:
 *
 * - ownerMode pasa a 'shared'
 * - ownerRecipientId se limpia
 * - ownerRecipientIds queda vacío
 *
 * También actualiza lastModifiedBy y updatedAt.
 */
export const assignSchemaOwner = (
  schemaUid: string,
  recipientId: string | null,
  state: CollaborationState,
  userId?: string | null,
) => {
  const normalizedRecipientId = normalizeText(recipientId);

  return mapSchemaState(state, schemaUid, (schema) => ({
    ...schema,
    ownerMode: normalizedRecipientId ? 'single' : 'shared',
    ownerRecipientId: normalizedRecipientId || undefined,
    ownerRecipientIds: normalizedRecipientId ? [normalizedRecipientId] : [],
    lastModifiedBy: normalizeText(userId) || schema.lastModifiedBy,
    updatedAt: Date.now(),
  }));
};

/**
 * Actualiza el color visual asociado al autor/usuario del schema.
 *
 * No cambia ownership ni recipient.
 * Solo actualiza userColor y updatedAt.
 */
export const setSchemaAuthorColor = (
  schemaUid: string,
  color: string | null,
  state: CollaborationState,
) =>
  mapSchemaState(state, schemaUid, (schema) => ({
    ...schema,
    userColor: normalizeColor(color) || schema.userColor,
    updatedAt: Date.now(),
  }));

/**
 * Filtra schemas según el contexto colaborativo actual.
 *
 * Primero aplica el filtro por autor usando filterSchemasByAuthorView.
 *
 * Luego, si existe activeRecipientId y no es vista global,
 * filtra también por ownerRecipientId / ownerRecipientIds.
 *
 * Uso típico:
 *
 * - mostrar solo campos del usuario activo;
 * - mostrar solo campos del destinatario activo;
 * - permitir una vista global para administradores/diseñadores.
 */
export const filterSchemasByCollaborationScope = (
  schemas: SchemaForUI[] = [],
  scope: {
    activeUserId?: string | null;
    activeRecipientId?: string | null;
    isGlobalView?: boolean;
  } = {},
) => {
  /**
   * Primer filtro:
   * visibilidad según autor/usuario activo.
   */
  const filteredByAuthor = filterSchemasByAuthorView(schemas, {
    activeUserId: scope.activeUserId,
    isGlobalView: scope.isGlobalView,
  });

  const activeRecipientId = normalizeText(scope.activeRecipientId);

  /**
   * Si no hay recipient activo o la vista es global,
   * se retorna únicamente el filtro por autor.
   */
  if (!activeRecipientId || scope.isGlobalView) return filteredByAuthor;

  /**
   * Segundo filtro:
   * se dejan solo los schemas cuyo ownerRecipientIds incluya
   * al recipient activo.
   */
  return filteredByAuthor.filter((schema) =>
    normalizeRecipientIds(
      schema.ownerRecipientIds || schema.ownerRecipientId,
    ).includes(activeRecipientId),
  );
};

/**
 * Construye un estado de presencia colaborativa deduplicado por usuario.
 *
 * Si existen varias entradas para el mismo userId, conserva la más reciente
 * según updatedAt.
 *
 * Luego retorna la lista ordenada de más reciente a más antigua.
 *
 * Uso típico:
 *
 * - mostrar usuarios conectados;
 * - pintar cursores/presencia remota;
 * - saber qué usuario está en qué documento/página;
 * - mostrar schemas activos por usuario.
 */
export const buildCollaborationPresenceState = (
  presenceEntries: PresenceEntry[] = [],
) => {
  const latestByUser = new Map<string, PresenceEntry>();

  (presenceEntries || []).forEach((entry) => {
    const userId = normalizeText(entry?.userId);

    if (!userId) return;

    const current = latestByUser.get(userId);

    /**
     * Si updatedAt no viene o no es numérico, se usa Date.now().
     */
    const nextUpdatedAt = Number(entry.updatedAt) || Date.now();
    const currentUpdatedAt = Number(current?.updatedAt) || 0;

    /**
     * Se conserva la entrada más reciente por usuario.
     */
    if (!current || nextUpdatedAt >= currentUpdatedAt) {
      latestByUser.set(userId, {
        ...entry,
        userId,
        updatedAt: nextUpdatedAt,
      });
    }
  });

  /**
   * Retorna presencia ordenada por fecha descendente.
   */
  return Array.from(latestByUser.values()).sort(
    (a, b) => (Number(b.updatedAt) || 0) - (Number(a.updatedAt) || 0),
  );
};

/**
 * Re-exporta utilidades colaborativas base desde @sisad-pdfme/common.
 *
 * normalizeRecipientIds:
 * Normaliza recipientId simple o array a una lista estable de ids.
 *
 * resolveSchemaAuthorId:
 * Resuelve el autor real de un schema.
 *
 * schemaMatchesAuthorView:
 * Indica si un schema pertenece a la vista de autor actual.
 *
 * filterSchemasByAuthorView:
 * Filtra schemas por usuario/autor.
 *
 * validateCollaborativeSchemas:
 * Valida consistencia colaborativa de schemas.
 */
export {
  normalizeRecipientIds,
  resolveSchemaAuthorId,
  schemaMatchesAuthorView,
  filterSchemasByAuthorView,
  validateCollaborativeSchemas,
};
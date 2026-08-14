/**
 * Assignments normalizados de schemas por usuario, destinatario, archivo y página.
 *
 * Estructura:
 *
 * assignments[userId][recipientId][fileId][pageNumber] = string[]
 *
 * Donde el arreglo final contiene los `schemaUid` asignados.
 *
 * Ejemplo:
 *
 * {
 *   "user-1": {
 *     "recipient-1": {
 *       "document-1": {
 *         "1": ["schema-uid-1", "schema-uid-2"]
 *       }
 *     }
 *   }
 * }
 *
 * Uso esperado:
 *
 * - distinguir qué usuario creó o administra la asignación;
 * - saber a qué destinatario pertenece cada campo;
 * - ubicar el campo por documento/archivo;
 * - ubicar el campo por página;
 * - resolver visibilidad, ownership, filtros por destinatario y flujos multidocumento.
 *
 * Nota:
 * Esta es la estructura recomendada para snapshots nuevos porque conserva
 * más contexto que el formato .
 */
export type UserSchemaAssignments = Record<
  string,
  Record<string, Record<string, Record<string, string[]>>>
>;

/**
 * Assignments  de schemas por destinatario, archivo y página.
 *
 * Estructura:
 *
 * assignments[recipientId][fileId][pageNumber] = string[]
 *
 * Donde el arreglo final contiene los `schemaUid` asignados.
 *
 * Ejemplo:
 *
 * {
 *   "recipient-1": {
 *     "document-1": {
 *       "1": ["schema-uid-1", "schema-uid-2"]
 *     }
 *   }
 * }
 *
 * Uso esperado:
 *
 * - compatibilidad con snapshots anteriores;
 * - migraciones desde versiones donde no existía agrupación por userId;
 * - lectura de templates antiguos sin romper runtime;
 * - adaptación hacia `UserSchemaAssignments` cuando se requiera contexto por usuario.
 *
 * Limitación:
 * No conserva el primer nivel `userId`, por lo que no permite distinguir
 * con precisión qué usuario creó, modificó o administra la asignación.
 */
export type SchemaAssignments = Record<
  string,
  Record<string, Record<string, string[]>>
>;

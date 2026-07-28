import {
  buildSchemaAssignments,
  buildUserSchemaAssignments,
  cloneDeep,
  type Schema,
  type SchemaAssignments,
  type Template,
} from '@sisad-pdfme/common';
import { normalizeLooseText } from '../shared/text.js';

/**
 * Representa un destinatario mínimo válido para filtrar assignments.
 *
 * No se usa todo el modelo real del destinatario porque este módulo
 * solo necesita conocer su identificador.
 */
type RecipientLike = {
  id?: string | null;
};

/**
 * Representa un documento mínimo válido para filtrar assignments.
 *
 * Se aceptan varias llaves porque dependiendo del flujo el documento
 * puede venir como:
 *
 * - id
 * - fileId
 * - fileTemplateId
 */
type DocumentLike = {
  id?: string | null;
  fileId?: string | null;
  fileTemplateId?: string | null;
};

/**
 * Normaliza el número de página usado como key dentro de assignments.
 *
 * Si el valor recibido no es un número válido o es menor/igual que 0,
 * se retorna '1' como página por defecto.
 *
 * Importante:
 * La key de página se guarda como string, no como number.
 */
const normalizePageNumber = (value: unknown) =>
  Number.isFinite(value) && Number(value) > 0
    ? String(Math.trunc(Number(value)))
    : '1';

/**
 * Garantiza que exista la estructura:
 *
 * assignments[recipientId][fileId][pageKey]
 *
 * Si algún nivel no existe, lo inicializa.
 *
 * Esto permite hacer push de schemaUid sin validar manualmente
 * cada nivel antes.
 */
const ensurePageBucket = (
  assignments: SchemaAssignments,
  recipientId: string,
  fileId: string,
  pageKey: string,
) => {
  if (!assignments[recipientId]) assignments[recipientId] = {};
  if (!assignments[recipientId][fileId]) assignments[recipientId][fileId] = {};
  if (!assignments[recipientId][fileId][pageKey]) {
    assignments[recipientId][fileId][pageKey] = [];
  }
};

/**
 * Elimina schemaUid duplicados dentro de cada página.
 *
 * Recorre toda la estructura de assignments y convierte cada array
 * de schemaUids en un Set para garantizar unicidad.
 *
 * Retorna la misma referencia recibida, ya normalizada.
 */
const dedupeAssignments = (assignments: SchemaAssignments) => {
  Object.values(assignments).forEach((fileMap) => {
    Object.values(fileMap).forEach((pageMap) => {
      Object.keys(pageMap).forEach((pageKey) => {
        pageMap[pageKey] = Array.from(new Set(pageMap[pageKey] || []));
      });
    });
  });

  return assignments;
};

/**
 * Extrae todos los identificadores técnicos de schemas presentes
 * en el template o arreglo de páginas.
 *
 * Prioridad:
 *
 * 1. schema.schemaUid
 * 2. schema.name
 *
 * Esto permite validar si un assignment apunta a un schema que
 * todavía existe dentro del template.
 */


type FileAssignmentProjection = 'wrapped' | 'pages';

const projectAssignmentsForFile = (
  assignments: SchemaAssignments,
  fileId: string | null | undefined,
  projection: FileAssignmentProjection,
  includeEmptyRecipients: boolean,
) => {
  const normalizedFileId = normalizeLooseText(fileId);
  if (!normalizedFileId) return {};

  const entries = Object.entries(assignments || {}).flatMap(([recipientId, files]) => {
    const pages = files?.[normalizedFileId];
    if (!pages && !includeEmptyRecipients) return [];

    return [[
      recipientId,
      pages
        ? projection === 'wrapped'
          ? { [normalizedFileId]: cloneDeep(pages) }
          : cloneDeep(pages)
        : {},
    ]];
  });

  return Object.fromEntries(entries);
};

const projectAssignmentsForPage = (
  assignments: SchemaAssignments,
  fileId: string | null | undefined,
  pageNumber: number | string | null | undefined,
) => {
  const normalizedFileId = normalizeLooseText(fileId);
  if (!normalizedFileId) return {};

  const pageKey = normalizePageNumber(pageNumber);
  return Object.fromEntries(
    Object.entries(assignments || {}).map(([recipientId, files]) => [
      recipientId,
      cloneDeep(files?.[normalizedFileId]?.[pageKey] || []),
    ]),
  );
};
const collectSchemaUids = (schemas: Schema[][] = []) => {
  const ids = new Set<string>();

  (schemas || []).forEach((page = []) => {
    (page || []).forEach((schema) => {
      const schemaUid = normalizeLooseText(schema.schemaUid || schema.name);
      if (schemaUid) ids.add(schemaUid);
    });
  });

  return ids;
};

/**
 * Genera assignments a partir de los schemas actuales.
 *
 * Internamente delega a buildSchemaAssignments de @sisad-pdfme/common.
 *
 * Uso típico:
 *
 * - reconstruir assignments desde el template
 * - obtener la fuente de verdad desde schemas
 * - evitar depender de assignments obsoletos
 */
export const buildRecipientAssignments = (schemas: Schema[][] = []) =>
  buildSchemaAssignments(Array.isArray(schemas) ? schemas : []);

/**
 * Filtra assignments para devolver únicamente los relacionados
 * con un archivo/documento específico.
 *
 * Retorna una estructura por destinatario, conservando solo el fileId indicado.
 *
 * Ejemplo de salida:
 *
 * {
 *   recipientA: {
 *     file1: {
 *       "1": ["schema-1", "schema-2"]
 *     }
 *   },
 *   recipientB: {}
 * }
 */
export const buildFileAssignments = (
  assignments: SchemaAssignments = {},
  fileId?: string | null,
) => projectAssignmentsForFile(assignments, fileId, 'wrapped', true);

/**
 * Filtra assignments por archivo y página.
 *
 * Retorna, por cada destinatario, el array de schemaUid asignados
 * a esa página específica.
 *
 * Ejemplo de salida:
 *
 * {
 *   recipientA: ["schema-1", "schema-2"],
 *   recipientB: []
 * }
 */
export const buildPageAssignments = (
  assignments: SchemaAssignments = {},
  fileId?: string | null,
  pageNumber?: number | string | null,
) => projectAssignmentsForPage(assignments, fileId, pageNumber);

/**
 * Reconcilia assignments contra la fuente actual de schemas,
 * destinatarios y documentos.
 *
 * Esta función cumple 3 responsabilidades principales:
 *
 * 1. Regenerar assignments desde los schemas actuales.
 * 2. Filtrar recipients/documents que ya no existen.
 * 3. Detectar assignments huérfanos que apuntan a schemas inexistentes.
 *
 * Importante:
 * La estructura final de assignments se construye desde los schemas,
 * no desde el objeto assignments recibido.
 *
 * El objeto assignments recibido se usa principalmente para detectar
 * referencias huérfanas.
 */
export const reconcileAssignments = ({
  template,
  schemas,
  assignments = {},
  recipients = [],
  documents = [],
}: {
  template?: Template | null;
  schemas?: Schema[][];
  assignments?: SchemaAssignments;
  recipients?: RecipientLike[];
  documents?: DocumentLike[];
} = {}) => {
  /**
   * Fuente principal de schemas:
   *
   * - si llega schemas explícito, usa ese valor;
   * - si no, usa template.schemas;
   * - si no existe nada, usa [].
   */
  const sourceSchemas = Array.isArray(schemas) ? schemas : template?.schemas || [];

  /**
   * Assignments generados automáticamente a partir de schemas.
   */
  const generatedAssignments = buildRecipientAssignments(sourceSchemas);

  /**
   * Copia editable de los assignments generados.
   *
   * Se usa cloneDeep para evitar mutar directamente el resultado original.
   */
  const nextAssignments = cloneDeep(generatedAssignments);

  /**
   * Set de destinatarios válidos.
   *
   * Si este Set tiene datos, se eliminarán los assignments cuyo recipientId
   * ya no exista en recipients.
   */
  const recipientIds = new Set(
    (recipients || [])
      .map((recipient) => normalizeLooseText(recipient?.id))
      .filter(Boolean),
  );

  /**
   * Set de documentos válidos.
   *
   * Se aceptan varias fuentes de id para soportar distintos flujos:
   *
   * - document.id
   * - document.fileId
   * - document.fileTemplateId
   */
  const fileIds = new Set(
    (documents || [])
      .map((document) => normalizeLooseText(document?.id || document?.fileId || document?.fileTemplateId))
      .filter(Boolean),
  );

  /**
   * Si hay recipients válidos, elimina recipients inexistentes
   * dentro de los assignments generados.
   */
  if (recipientIds.size > 0) {
    Object.keys(nextAssignments).forEach((recipientId) => {
      if (!recipientIds.has(recipientId)) delete nextAssignments[recipientId];
    });
  }

  /**
   * Si hay documentos válidos, elimina fileIds inexistentes
   * dentro de cada recipient.
   */
  if (fileIds.size > 0) {
    Object.values(nextAssignments).forEach((files) => {
      Object.keys(files || {}).forEach((fileId) => {
        if (!fileIds.has(fileId)) delete files[fileId];
      });
    });
  }

  /**
   * Lista de assignments que apuntan a schemas que ya no existen.
   *
   * Esto es útil para diagnóstico, migraciones o limpieza controlada.
   */
  const orphanAssignments = [] as Array<{
    recipientId: string;
    fileId: string;
    pageNumber: string;
    schemaUid: string;
  }>;

  /**
   * Set de schemaUid válidos presentes en el template actual.
   */
  const validSchemaUids = collectSchemaUids(sourceSchemas);

  /**
   * Recorre los assignments recibidos originalmente para detectar
   * referencias huérfanas.
   */
  Object.entries(assignments || {}).forEach(([recipientId, files]) => {
    Object.entries(files || {}).forEach(([fileId, pages]) => {
      Object.entries(pages || {}).forEach(([pageNumber, schemaUids]) => {
        (schemaUids || []).forEach((schemaUid) => {
          if (validSchemaUids.has(schemaUid)) return;

          orphanAssignments.push({
            recipientId,
            fileId,
            pageNumber,
            schemaUid,
          });
        });
      });
    });
  });

  return {
    /**
     * Assignments finales, deduplicados y filtrados.
     */
    assignments: dedupeAssignments(nextAssignments),

    /**
     * Assignments generados directamente desde schemas,
     * antes de limpieza adicional.
     */
    generatedAssignments,

    /**
     * Assignments antiguos que apuntan a schemas inexistentes.
     */
    orphanAssignments,
  };
};

/**
 * Elimina un schemaUid de todos los recipients, archivos y páginas.
 *
 * Se usa cuando:
 *
 * - se elimina un schema del canvas;
 * - se mueve un schema de un recipient/document/page a otro;
 * - se limpia una referencia manualmente.
 */
export const removeSchemaFromAssignments = (
  schemaUid: string,
  assignments: SchemaAssignments = {},
) => {
  const normalizedSchemaUid = normalizeLooseText(schemaUid);

  if (!normalizedSchemaUid) return cloneDeep(assignments || {});

  const nextAssignments = cloneDeep(assignments || {});

  Object.values(nextAssignments).forEach((files) => {
    Object.values(files).forEach((pages) => {
      Object.keys(pages).forEach((pageKey) => {
        pages[pageKey] = (pages[pageKey] || []).filter(
          (value) => value !== normalizedSchemaUid,
        );
      });
    });
  });

  return dedupeAssignments(nextAssignments);
};

/**
 * Mueve un schemaUid hacia un nuevo recipient/file/page.
 *
 * Funcionamiento:
 *
 * 1. Elimina el schemaUid de cualquier ubicación previa.
 * 2. Normaliza recipientId, fileId y pageNumber destino.
 * 3. Crea el bucket destino si no existe.
 * 4. Agrega el schemaUid al destino.
 * 5. Deduplica el resultado.
 *
 * Nota:
 * Los campos fromRecipientId, fromFileId y fromPageNumber existen en el contrato,
 * pero actualmente no se usan porque la función elimina el schema globalmente.
 */
export const moveSchemaAssignment = (
  schemaUid: string,
  assignments: SchemaAssignments = {},
  target: {
    fromRecipientId?: string | null;
    fromFileId?: string | null;
    fromPageNumber?: number | string | null;
    toRecipientId: string;
    toFileId: string;
    toPageNumber: number | string;
  },
) => {
  const nextAssignments = removeSchemaFromAssignments(schemaUid, assignments);

  const recipientId = normalizeLooseText(target?.toRecipientId);
  const fileId = normalizeLooseText(target?.toFileId);
  const pageKey = normalizePageNumber(target?.toPageNumber);
  const normalizedSchemaUid = normalizeLooseText(schemaUid);

  if (!recipientId || !fileId || !pageKey || !normalizedSchemaUid) {
    return nextAssignments;
  }

  ensurePageBucket(nextAssignments, recipientId, fileId, pageKey);

  nextAssignments[recipientId][fileId][pageKey].push(normalizedSchemaUid);

  return dedupeAssignments(nextAssignments);
};

/**
 * Obtiene todos los assignments de un recipient específico.
 *
 * Retorna la estructura completa:
 *
 * {
 *   fileId: {
 *     pageNumber: ["schemaUid"]
 *   }
 * }
 */
export const getAssignmentsForRecipient = (
  assignments: SchemaAssignments = {},
  recipientId?: string | null,
) => {
  const normalizedRecipientId = normalizeLooseText(recipientId);

  if (!normalizedRecipientId) return {};

  return cloneDeep(assignments?.[normalizedRecipientId] || {});
};

/**
 * Obtiene todos los assignments relacionados con un archivo específico,
 * agrupados por recipient.
 *
 * Ejemplo de salida:
 *
 * {
 *   recipientA: {
 *     "1": ["schema-1"],
 *     "2": ["schema-2"]
 *   }
 * }
 */
export const getAssignmentsForFile = (
  assignments: SchemaAssignments = {},
  fileId?: string | null,
) => projectAssignmentsForFile(assignments, fileId, 'pages', false);

/**
 * Obtiene los schemaUid asignados a una página específica de un archivo,
 * agrupados por recipient.
 *
 * Ejemplo de salida:
 *
 * {
 *   recipientA: ["schema-1", "schema-2"],
 *   recipientB: []
 * }
 */

/**
 * Valida la consistencia interna de assignments.
 *
 * Revisa:
 *
 * - recipientId vacío;
 * - fileId vacío;
 * - páginas cuyo valor no sea array;
 * - schemaUid duplicados dentro de una misma página;
 * - schemaUid que no existen dentro de schemas.
 *
 * Retorna errores y advertencias.
 */
export const validateAssignmentsConsistency = ({
  assignments = {},
  schemas = [],
}: {
  assignments?: SchemaAssignments;
  schemas?: Schema[][];
} = {}) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  const validSchemaUids = collectSchemaUids(schemas);

  Object.entries(assignments || {}).forEach(([recipientId, files]) => {
    if (!recipientId) {
      errors.push('Assignment has an empty recipient id.');
    }

    Object.entries(files || {}).forEach(([fileId, pages]) => {
      if (!fileId) {
        errors.push(`Recipient ${recipientId} has assignments without file id.`);
      }

      Object.entries(pages || {}).forEach(([pageKey, schemaUids]) => {
        if (!Array.isArray(schemaUids)) {
          errors.push(
            `Recipient ${recipientId} file ${fileId} page ${pageKey} is not an array.`,
          );
          return;
        }

        const duplicated = schemaUids.filter(
          (schemaUid, index) => schemaUids.indexOf(schemaUid) !== index,
        );

        if (duplicated.length > 0) {
          warnings.push(
            `Recipient ${recipientId} file ${fileId} page ${pageKey} has duplicated schema ids: ${Array.from(
              new Set(duplicated),
            ).join(', ')}`,
          );
        }

        schemaUids.forEach((schemaUid) => {
          if (validSchemaUids.size > 0 && !validSchemaUids.has(schemaUid)) {
            errors.push(
              `Schema '${schemaUid}' in recipient ${recipientId} does not exist in template.`,
            );
          }
        });
      });
    });
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Re-exporta helpers base desde @sisad-pdfme/common.
 *
 * buildSchemaAssignments:
 * Genera assignments generales desde schemas.
 *
 * buildUserSchemaAssignments:
 * Genera assignments orientados a usuario/recipient.
 */
export { buildSchemaAssignments, buildUserSchemaAssignments };

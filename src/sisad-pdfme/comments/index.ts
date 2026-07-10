import {
  cloneDeep,
  type CommentAnchor,
  type SchemaForUI,
  type Template,
} from '@sisad-pdfme/common';

import {
  addAnchorToSchema,
  addCommentToSchema,
  addCommentWithAnchorToTemplate,
  createSchemaComment,
  createSchemaCommentAnchor,
  deleteCommentFromSchema,
  filterCommentsByFileAndPage,
  findSchemaByUid,
  resolveCommentInSchema,
  updateCommentInSchema,
} from '@sisad-pdfme/common';

/**
 * Entrada parcial para actualizar la posición o asociación de un anchor.
 *
 * Un comentario puede estar anclado a:
 *
 * - una coordenada x/y dentro del documento;
 * - un fileId/documentId;
 * - una página;
 * - un schema específico mediante schemaUid.
 *
 * Se usa Partial porque no siempre se actualizan todos los campos.
 * Por ejemplo:
 *
 * - mover un comentario solo actualiza x/y;
 * - adjuntar a un campo solo actualiza schemaUid;
 * - cambiar de página actualiza fileId/pageNumber/x/y.
 */
type AnchorUpdateInput = Partial<
  Pick<CommentAnchor, 'x' | 'y' | 'fileId' | 'pageNumber' | 'schemaUid'>
>;

/**
 * Representa una entrada de comentario en template.pdfComments.
 *
 * Este contrato acepta una estructura flexible porque los comentarios
 * top-level pueden venir en distintos formatos según el origen:
 *
 * 1. entry.id
 * 2. entry.comment.id
 * 3. entry.comment.schemaUid
 * 4. entry.comment.fieldId
 * 5. entry.anchor.schemaUid
 *
 * El índice `[key: string]: unknown` permite conservar metadata adicional
 * sin romper compatibilidad con snapshots o versiones futuras.
 */
interface PdfCommentEntry {
  id?: string;
  comment?: {
    id?: string;
    text?: string;
    schemaUid?: string;
    fieldId?: string;
    resolved?: boolean;
    anchor?: CommentAnchor;
    [key: string]: unknown;
  };
  anchor?: CommentAnchor;
  [key: string]: unknown;
}

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
 * Actualiza los valores de un CommentAnchor sin mutar el objeto original.
 *
 * Solo aplica valores válidos:
 *
 * - x/y: deben ser números finitos;
 * - fileId: debe tener texto;
 * - pageNumber: debe ser número positivo;
 * - schemaUid: debe tener texto.
 *
 * Importante:
 * Esta función conserva todas las propiedades existentes del anchor.
 * Eso permite mantener metadata adicional, como id, resolved, createdBy,
 * updatedAt u otros campos agregados por el runtime.
 */
const updateCommentAnchorValues = (
  anchor: Record<string, unknown> = {},
  updates: AnchorUpdateInput = {},
) => ({
  ...anchor,

  /**
   * Actualiza coordenada horizontal del comentario.
   */
  ...(Number.isFinite(updates.x) ? { x: Number(updates.x) } : {}),

  /**
   * Actualiza coordenada vertical del comentario.
   */
  ...(Number.isFinite(updates.y) ? { y: Number(updates.y) } : {}),

  /**
   * Actualiza el archivo/documento al que pertenece el comentario.
   */
  ...(normalizeText(updates.fileId)
    ? { fileId: normalizeText(updates.fileId) }
    : {}),

  /**
   * Actualiza la página del comentario.
   *
   * La página se guarda como número entero positivo.
   */
  ...(Number.isFinite(updates.pageNumber) && Number(updates.pageNumber) > 0
    ? { pageNumber: Math.trunc(Number(updates.pageNumber)) }
    : {}),

  /**
   * Asocia el anchor a un schema específico.
   */
  ...(normalizeText(updates.schemaUid)
    ? { schemaUid: normalizeText(updates.schemaUid) }
    : {}),
});

/**
 * Obtiene todos los comentarios asociados a un documento/archivo.
 *
 * Internamente delega a filterCommentsByFileAndPage sin pageNumber,
 * por lo que devuelve comentarios de todas las páginas del fileId.
 */
export const getCommentsForDocument = (template: Template, fileId: string) =>
  filterCommentsByFileAndPage(template, fileId);

/**
 * Obtiene los comentarios asociados a una página específica de un documento.
 *
 * Filtra por:
 *
 * - fileId
 * - pageNumber
 */
export const getCommentsForPage = (
  template: Template,
  fileId: string,
  pageNumber: number,
) => filterCommentsByFileAndPage(template, fileId, pageNumber);

/**
 * Obtiene todos los comentarios asociados a un schema específico.
 *
 * Busca comentarios en dos fuentes:
 *
 * 1. Comentarios embebidos dentro del propio schema:
 *
 *    schema.comments[]
 *
 * 2. Comentarios top-level del template:
 *
 *    template.pdfComments[]
 *
 * Esto permite soportar ambos modelos:
 *
 * - comentarios guardados directamente en el campo;
 * - comentarios globales del PDF con anchor hacia un schema.
 */
export const getCommentsForSchema = (
  template: Template,
  schemaUid: string,
) => {
  /**
   * Busca el schema dentro del template usando el helper común.
   */
  const target = findSchemaByUid(template, schemaUid);

  if (!target?.schema) return [];

  /**
   * Comentarios propios del schema.
   *
   * Se adaptan al mismo formato de PdfCommentEntry para que la UI
   * pueda consumir una lista homogénea.
   */
  const schemaComments: PdfCommentEntry[] = (target.schema.comments || []).map(
    (comment) => ({
      schemaUid: target.schema?.schemaUid,
      fileId: comment.fileId,
      pageNumber: comment.pageNumber,
      comment,
      anchor: comment.anchor,
    }),
  );

  /**
   * Comentarios globales guardados en template.pdfComments.
   */
  const topLevelEntries = Array.isArray(template.pdfComments)
    ? (template.pdfComments as PdfCommentEntry[])
    : [];

  /**
   * Filtra comentarios top-level cuyo schemaUid/fieldId/anchor.schemaUid
   * coincida con el schemaUid solicitado.
   */
  const topLevelComments: PdfCommentEntry[] = topLevelEntries
    .filter(
      (entry) =>
        normalizeText(
          entry?.comment?.schemaUid ||
            entry?.comment?.fieldId ||
            entry?.anchor?.schemaUid,
        ) === normalizeText(schemaUid),
    )
    .map((entry) => ({
      schemaUid: entry?.comment?.schemaUid || entry?.anchor?.schemaUid,
      fileId: entry?.anchor?.fileId,
      pageNumber: entry?.anchor?.pageNumber,
      comment: entry.comment,
      anchor: entry.anchor,
    }));

  /**
   * Devuelve comentarios del schema + comentarios globales anclados al schema.
   */
  return schemaComments.concat(topLevelComments);
};

/**
 * Mueve o actualiza el anchor de un comentario.
 *
 * Busca el comentario por commentId en dos ubicaciones:
 *
 * 1. Dentro de cada schema:
 *
 *    schema.comments[]
 *    schema.commentAnchors[]
 *
 * 2. Dentro de comentarios top-level:
 *
 *    template.pdfComments[]
 *
 * Retorna siempre un nuevo Template clonado, sin mutar el original.
 */
export const moveCommentAnchor = (
  template: Template,
  commentId: string,
  updates: AnchorUpdateInput = {},
) => {
  const normalizedCommentId = normalizeText(commentId);

  /**
   * Si no hay commentId válido, se retorna una copia profunda del template.
   */
  if (!normalizedCommentId) return cloneDeep(template);

  const next = cloneDeep(template) as Template;
  const pages = next.schemas || [];

  /**
   * Recorre todas las páginas y schemas para actualizar comentarios
   * embebidos en schemas.
   */
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const page = pages[pageIndex] || [];

    for (let schemaIndex = 0; schemaIndex < page.length; schemaIndex += 1) {
      const schema = page[schemaIndex] as SchemaForUI;
      let changed = false;

      /**
       * Actualiza schema.comments[] cuando encuentra el commentId.
       */
      const comments = (schema.comments || []).map((comment) => {
        if (normalizeText(comment.id) !== normalizedCommentId) return comment;

        changed = true;

        return {
          ...comment,
          anchor: updateCommentAnchorValues(
            comment.anchor as Record<string, unknown>,
            updates,
          ) as CommentAnchor,
        };
      });

      /**
       * Actualiza schema.commentAnchors[] cuando encuentra el commentId.
       *
       * Nota:
       * Aquí se compara anchor.id contra commentId.
       */
      const commentAnchors = (schema.commentAnchors || []).map((anchor) => {
        if (normalizeText(anchor.id) !== normalizedCommentId) return anchor;

        changed = true;

        return updateCommentAnchorValues(
          anchor as Record<string, unknown>,
          updates,
        ) as CommentAnchor;
      });

      /**
       * Solo reemplaza el schema si realmente hubo cambios.
       */
      if (changed) {
        page[schemaIndex] = {
          ...schema,
          comments,
          commentAnchors,
        };
      }
    }
  }

  /**
   * Actualiza comentarios top-level en template.pdfComments.
   */
  const nextPdfComments = Array.isArray(next.pdfComments)
    ? (next.pdfComments as PdfCommentEntry[])
    : [];

  next.pdfComments = nextPdfComments.map((entry) => {
    /**
     * El id puede estar en entry.id o en entry.comment.id.
     */
    if (normalizeText(entry?.id || entry?.comment?.id) !== normalizedCommentId) {
      return entry;
    }

    const nextAnchor = updateCommentAnchorValues(
      entry.anchor as Record<string, unknown>,
      updates,
    );

    return {
      ...entry,

      /**
       * Actualiza anchor top-level.
       */
      anchor: nextAnchor as typeof entry.anchor,

      /**
       * Mantiene sincronizado comment.anchor.
       */
      comment: {
        ...entry.comment,
        anchor: nextAnchor as typeof entry.comment.anchor,
      },
    };
  });

  return next;
};

/**
 * Asocia un comentario existente a un schema/campo.
 *
 * Internamente solo actualiza schemaUid dentro del anchor.
 *
 * Uso típico:
 *
 * - arrastrar un comentario hacia un campo;
 * - vincular un comentario flotante con un schema;
 * - convertir un comentario de página en comentario de campo.
 */
export const attachCommentToField = (
  template: Template,
  commentId: string,
  schemaUid: string,
) =>
  moveCommentAnchor(template, commentId, {
    schemaUid,
  });

/**
 * Desasocia un comentario de cualquier campo/schema.
 *
 * Intención funcional:
 *
 * - quitar schemaUid del anchor;
 * - dejar el comentario como comentario de página/documento.
 *
 * OJO:
 * Con la implementación actual de updateCommentAnchorValues,
 * pasar schemaUid: '' NO elimina el schemaUid existente porque el helper
 * solo aplica schemaUid cuando normalizeText(updates.schemaUid) tiene valor.
 */
export const detachCommentFromField = (
  template: Template,
  commentId: string,
) =>
  moveCommentAnchor(template, commentId, {
    schemaUid: '',
  });

/**
 * Marca como resuelto o no resuelto un comentario top-level.
 *
 * Solo actualiza template.pdfComments.
 *
 * No actualiza schema.comments[] ni schema.commentAnchors[].
 */
export const resolveTopLevelComment = (
  template: Template,
  commentId: string,
  resolved = true,
) => {
  const normalizedCommentId = normalizeText(commentId);

  if (!normalizedCommentId) return cloneDeep(template);

  const next = cloneDeep(template) as Template;

  const nextPdfComments = Array.isArray(next.pdfComments)
    ? (next.pdfComments as PdfCommentEntry[])
    : [];

  next.pdfComments = nextPdfComments.map((entry) => {
    if (normalizeText(entry?.id || entry?.comment?.id) !== normalizedCommentId) {
      return entry;
    }

    return {
      ...entry,

      /**
       * Marca el anchor como resuelto/no resuelto.
       *
       * Esto es útil si la UI pinta el estado desde entry.anchor.
       */
      anchor: {
        ...entry.anchor,
        resolved,
      },

      /**
       * Marca el comentario como resuelto/no resuelto.
       *
       * Esto es útil si la UI pinta el estado desde entry.comment.
       */
      comment: {
        ...entry.comment,
        resolved,
      },
    };
  });

  return next;
};

/**
 * Reabre un comentario top-level previamente resuelto.
 *
 * Es un alias semántico de resolveTopLevelComment(..., false).
 */
export const reopenComment = (template: Template, commentId: string) =>
  resolveTopLevelComment(template, commentId, false);

/**
 * Re-exporta helpers base del módulo común de comentarios.
 *
 * Estos helpers son la fuente base para crear, agregar, actualizar,
 * eliminar, resolver y filtrar comentarios.
 */
export {
  createSchemaComment,
  createSchemaCommentAnchor,
  findSchemaByUid,
  addAnchorToSchema,
  addCommentToSchema,
  addCommentWithAnchorToTemplate,
  updateCommentInSchema,
  deleteCommentFromSchema,
  resolveCommentInSchema,
  filterCommentsByFileAndPage,
};
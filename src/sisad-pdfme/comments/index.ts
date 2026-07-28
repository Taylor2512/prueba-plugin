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
import { forEachSchemaInPages } from '../common/schemaPageTraversal.js';
import { normalizeLooseText } from '../shared/text.js';

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
const normalizeCommentText = normalizeLooseText;

type CommentsCapabilityFeatureState = {
  id: string;
  registered: boolean;
  supported: boolean;
  enabled: boolean;
  visible: boolean;
  permitted: boolean;
  available: boolean;
  active: boolean;
  executable: boolean;
  reason?: string;
  sources?: string[];
};

export type CommentsCapabilityContext = {
  comments?: {
    enabled?: boolean | null;
  } | null;
  visibility?: {
    modals?: {
      comments?: boolean;
    } | null;
    sidebars?: {
      right?: {
        panels?: {
          comments?: boolean;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type CommentsCapabilityState = CommentsCapabilityFeatureState & {
  panelVisible: boolean;
  modalVisible: boolean;
};

const createCommentsCapabilityState = (
  partial: Partial<CommentsCapabilityState>,
): CommentsCapabilityState => ({
  id: 'comments',
  registered: true,
  supported: true,
  enabled: true,
  visible: true,
  permitted: true,
  available: true,
  active: false,
  executable: true,
  panelVisible: true,
  modalVisible: true,
  sources: ['comments.enabled', 'visibility.modals.comments', 'visibility.sidebars.right.panels.comments'],
  ...partial,
});

export const resolveCommentsCapabilityState = (
  context: CommentsCapabilityContext = {},
): CommentsCapabilityState => {
  const enabled = context.comments?.enabled !== false;
  const panelVisible = context.visibility?.sidebars?.right?.panels?.comments !== false;
  const modalVisible = context.visibility?.modals?.comments !== false;
  const visible = panelVisible || modalVisible;

  return createCommentsCapabilityState({
    enabled,
    visible,
    permitted: true,
    available: enabled,
    active: enabled,
    executable: enabled,
    reason: enabled ? undefined : 'comments-disabled',
    panelVisible,
    modalVisible,
  });
};

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
) => {
  const nextAnchor: Record<string, unknown> = { ...anchor };

  if (Number.isFinite(updates.x)) nextAnchor.x = Number(updates.x);
  if (Number.isFinite(updates.y)) nextAnchor.y = Number(updates.y);

  const fileId = normalizeCommentText(updates.fileId);
  if (fileId) nextAnchor.fileId = fileId;

  if (Number.isFinite(updates.pageNumber) && Number(updates.pageNumber) > 0) {
    nextAnchor.pageNumber = Math.trunc(Number(updates.pageNumber));
  }

  if (Object.prototype.hasOwnProperty.call(updates, 'schemaUid')) {
    const schemaUid = normalizeCommentText(updates.schemaUid);
    if (schemaUid) nextAnchor.schemaUid = schemaUid;
    else delete nextAnchor.schemaUid;
  }

  return nextAnchor;
};

const mapTopLevelCommentsById = (
  template: Template,
  normalizedCommentId: string,
  updater: (entry: PdfCommentEntry) => PdfCommentEntry,
) => {
  const entries = Array.isArray(template.pdfComments)
    ? (template.pdfComments as PdfCommentEntry[])
    : [];

  template.pdfComments = entries.map((entry) =>
    normalizeCommentText(entry?.id || entry?.comment?.id) === normalizedCommentId
      ? updater(entry)
      : entry,
  );
};

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
        normalizeCommentText(
          entry?.comment?.schemaUid ||
            entry?.comment?.fieldId ||
            entry?.anchor?.schemaUid,
        ) === normalizeCommentText(schemaUid),
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
  const normalizedCommentId = normalizeCommentText(commentId);

  /**
   * Si no hay commentId válido, se retorna una copia profunda del template.
   */
  if (!normalizedCommentId) return cloneDeep(template);

  const next = cloneDeep(template) as Template;
  const pages = next.schemas || [];

  /** Actualiza comentarios embebidos en cada schema. */
  forEachSchemaInPages(pages as SchemaForUI[][], ({ schema, page, schemaIndex }) => {
    let changed = false;
    const comments = (schema.comments || []).map((comment) => {
      if (normalizeCommentText(comment.id) !== normalizedCommentId) return comment;
      changed = true;
      return {
        ...comment,
        anchor: updateCommentAnchorValues(
          comment.anchor as Record<string, unknown>,
          updates,
        ) as CommentAnchor,
      };
    });
    const commentAnchors = (schema.commentAnchors || []).map((anchor) => {
      if (normalizeCommentText(anchor.id) !== normalizedCommentId) return anchor;
      changed = true;
      return updateCommentAnchorValues(
        anchor as Record<string, unknown>,
        updates,
      ) as CommentAnchor;
    });

    if (changed) page[schemaIndex] = { ...schema, comments, commentAnchors };
  });

  /** Actualiza anchor y comment.anchor en la representación top-level. */
  mapTopLevelCommentsById(next, normalizedCommentId, (entry) => {
    const nextAnchor = updateCommentAnchorValues(
      entry.anchor as Record<string, unknown>,
      updates,
    );

    return {
      ...entry,
      anchor: nextAnchor as typeof entry.anchor,
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
 * El helper interpreta schemaUid vacío como una desasociación explícita y
 * elimina la referencia tanto en comentarios embebidos como top-level.
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
  const normalizedCommentId = normalizeCommentText(commentId);

  if (!normalizedCommentId) return cloneDeep(template);

  const next = cloneDeep(template) as Template;

  mapTopLevelCommentsById(next, normalizedCommentId, (entry) => ({
    ...entry,
    anchor: {
      ...entry.anchor,
      resolved,
    },
    comment: {
      ...entry.comment,
      resolved,
    },
  }));

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

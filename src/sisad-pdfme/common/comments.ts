/**
 * @file comments.ts
 *
 * Fachada común para comentarios del template y de schemas.
 *
 * Maneja dos modelos de almacenamiento:
 * - comentarios embebidos en schema.comments / schema.commentAnchors;
 * - comentarios top-level en template.pdfComments.
 *
 * Regla arquitectónica:
 * Este módulo solo manipula datos. No debe pintar CommentsRail ni depender de UI.
 */

import { cloneDeep } from '@sisad-pdfme/common/helper';
import type { Template, SchemaForUI, CommentAnchor, SchemaComment } from '@sisad-pdfme/common/types';
import type { PdfComment, TopLevelPdfCommentEntry } from '@sisad-pdfme/contracts';
import {
  createSchemaComment,
  createSchemaCommentAnchor,
  upsertById,
  removeById,
  ensureAnchorId,
  ensureComment,
} from '@sisad-pdfme/common/collaboration';

/** Identidad mínima del autor usada para comments y anchors. */
type Identity = { authorId?: string | null; authorName?: string | null; authorColor?: string | null };

/** Template con la colección canónica de comentarios top-level. */
type TemplateWithComments = Template & {
  pdfComments?: TopLevelPdfCommentEntry[];
};

/** Obtiene comentarios top-level desde su colección canónica. */
const getTopLevelEntries = (template: TemplateWithComments): TopLevelPdfCommentEntry[] => {
  return Array.isArray(template.pdfComments) ? template.pdfComments : [];
};

/** Normaliza comentarios top-level en su colección canónica. */
const setTopLevelEntries = (template: TemplateWithComments, entries: TopLevelPdfCommentEntry[]) => {
  template.pdfComments = entries.map((entry) => ({
    id: entry.id,
    anchor: ensureAnchorId(entry.anchor || {}) as TopLevelPdfCommentEntry['anchor'],
    comment: ensureComment(entry.comment || {}) as unknown as PdfComment,
  }));
};

/** Crea un CommentAnchor normalizado preservando identidad del autor cuando viene embebida en el anchor. */
const cloneAnchor = (
  anchor: Partial<CommentAnchor> & {
    authorId?: string | null;
    authorName?: string | null;
    authorColor?: string | null;
  },
) =>
  createSchemaCommentAnchor(anchor, {
    authorId: anchor.authorId || undefined,
    authorColor: anchor.authorColor || undefined,
    authorName: anchor.authorName || undefined,
  });

/** Busca un schema por schemaUid/id/name y devuelve su ubicación dentro de template.schemas. */
export const findSchemaByUid = (template: Template, schemaUid: string) => {
  const schemas = template?.schemas || [];
  for (let p = 0; p < schemas.length; p++) {
    const page = schemas[p] || [];
    for (let i = 0; i < page.length; i++) {
      const s = page[i] as SchemaForUI;
      const uid = String(s.schemaUid || s.id || s.name || '').trim();
      if (uid && uid === schemaUid) return { pageIndex: p, index: i, schema: s };
    }
  }
  return null;
};

/** Agrega o actualiza un anchor dentro de schema.commentAnchors sin mutar el schema original. */
export const addAnchorToSchema = (
  schema: SchemaForUI,
  anchor: Partial<CommentAnchor>,
  identity: Identity = {},
): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaForUI;
  const created = createSchemaCommentAnchor(anchor, {
    authorId: identity.authorId || undefined,
    authorColor: identity.authorColor || undefined,
    authorName: identity.authorName || undefined,
  });
  created.scope = 'schema';
  next.commentAnchors = upsertById(next.commentAnchors || [], created);
  return next;
};

/** Agrega un comentario a un schema y, opcionalmente, crea/anexa su anchor asociado. */
export const addCommentToSchema = (
  schema: SchemaForUI,
  text: string,
  identity: Identity = {},
  anchor?: Partial<CommentAnchor>,
): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaForUI;
  const createdAnchor = anchor
    ? cloneAnchor({
        ...anchor,
        authorId: identity.authorId || undefined,
        authorColor: identity.authorColor || undefined,
      })
    : undefined;
  const commentId = createdAnchor?.id;
  const comment = createSchemaComment(text, {
    authorId: identity.authorId || undefined,
    authorName: identity.authorName || undefined,
    authorColor: identity.authorColor || undefined,
    timestamp: Date.now(),
  }, {
    id: commentId,
    scope: 'schema',
    schemaUid: next.schemaUid || next.id,
    fieldId: next.schemaUid || next.id,
    pageNumber: next.pageNumber,
    anchor: createdAnchor ? cloneDeep(createdAnchor) : undefined,
  });
  if (createdAnchor) {
    createdAnchor.scope = 'schema';
  }
  next.comments = upsertById(next.comments || [], comment);
  if (createdAnchor) {
    next.commentAnchors = upsertById(next.commentAnchors || [], createdAnchor);
  }
  next.commentsCount = (Number(next.commentsCount) || 0) + 1;
  return next;
};

/** Agrega comentario al schema si existe schemaUid; si no, lo guarda como comentario top-level del template. */
export const addCommentWithAnchorToTemplate = (
  template: Template,
  anchor: Partial<CommentAnchor> & { schemaUid?: string },
  text: string,
  identity: Identity = {},
): Template => {
  const next = cloneDeep(template) as TemplateWithComments;
  const target = anchor.schemaUid ? findSchemaByUid(next, anchor.schemaUid) : null;

  if (target && target.schema) {
    const withComment = addCommentToSchema(target.schema as SchemaForUI, text, identity, anchor);
    next.schemas[target.pageIndex][target.index] = withComment;
    return next;
  }

  //  top-level storage for comments that do not belong to a concrete field.
  const createdAnchor = cloneAnchor({
    ...anchor,
    authorId: identity.authorId || undefined,
    authorColor: identity.authorColor || undefined,
  });
  const createdComment = createSchemaComment(
    text,
    {
      authorId: identity.authorId || undefined,
      authorName: identity.authorName || undefined,
      authorColor: identity.authorColor || undefined,
      timestamp: Date.now(),
    },
    { id: createdAnchor.id, anchor: cloneDeep(createdAnchor) },
  );

  const currentEntries = getTopLevelEntries(next);
  setTopLevelEntries(
    next,
    upsertById<TopLevelPdfCommentEntry>(currentEntries, {
      id: createdComment.id,
      /*
       * Puente entre los dos modelos de anchor: el de `common/schema.ts` deja
       * `x`/`y` opcionales (un comentario de documento no tiene coordenada),
       * mientras que el contrato top-level los declara obligatorios. Se
       * conserva el valor tal cual en vez de inventar un `0` que pintaría un
       * pin en la esquina de la página.
       */
      anchor: createdAnchor as TopLevelPdfCommentEntry['anchor'],
      comment: createdComment as unknown as PdfComment,
    }),
  );
  return next;
};

/** Inserta o reemplaza un comentario top-level usando su id. */
export const upsertTopLevelComment = (
  template: Template,
  entry: TopLevelPdfCommentEntry,
): Template => {
  const next = cloneDeep(template) as TemplateWithComments;
  const currentEntries = getTopLevelEntries(next);
  setTopLevelEntries(next, upsertById<TopLevelPdfCommentEntry>(currentEntries, entry));
  return next;
};

/** Elimina un comentario top-level por id. */
export const removeTopLevelComment = (template: Template, commentId: string): Template => {
  const next = cloneDeep(template) as TemplateWithComments;
  const currentEntries = getTopLevelEntries(next);
  setTopLevelEntries(next, removeById(currentEntries, commentId));
  return next;
};

/** Actualiza texto, estado o metadata de un comentario embebido en un schema. */
export const updateCommentInSchema = (
  schema: SchemaForUI,
  commentId: string,
  updates: Partial<{ text: string; resolved?: boolean; authorName?: string }>,
): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaForUI;
  const comments = next.comments || [];
  const idx = comments.findIndex((c) => c.id === commentId);
  if (idx < 0) return next;
  const item = { ...comments[idx], ...updates };
  const anchorId = String((item.anchor as CommentAnchor | undefined)?.id || commentId);
  if (typeof updates.resolved === 'boolean' && item.anchor) {
    item.anchor = { ...(item.anchor as CommentAnchor), resolved: updates.resolved };
  }
  const updated = comments.slice();
  updated[idx] = item;
  next.comments = updated;
  if (Array.isArray(next.commentAnchors)) {
    next.commentAnchors = next.commentAnchors.map((anchor) =>
      anchor.id === anchorId && typeof updates.resolved === 'boolean'
        ? { ...anchor, resolved: updates.resolved }
        : anchor,
    );
  }
  return next;
};

/** Elimina un comentario y su anchor asociado dentro de un schema. */
export const deleteCommentFromSchema = (schema: SchemaForUI, commentId: string): SchemaForUI => {
  const next = cloneDeep(schema) as unknown as SchemaForUI;
  const comment = (next.comments || []).find((entry) => entry.id === commentId);
  const anchorId = String((comment?.anchor as CommentAnchor | undefined)?.id || commentId);
  next.comments = removeById(next.comments || [], commentId);
  next.commentAnchors = removeById(next.commentAnchors || [], anchorId);
  next.commentsCount = Math.max(0, (Number(next.commentsCount) || 0) - 1);
  return next;
};

/** Marca un comentario de schema como resuelto o reabierto. */
export const resolveCommentInSchema = (schema: SchemaForUI, commentId: string, resolved = true): SchemaForUI =>
  updateCommentInSchema(schema, commentId, { resolved });

/** Devuelve comentarios del template filtrados por fileId y opcionalmente por pageNumber. */
export const filterCommentsByFileAndPage = (template: Template, fileId?: string | null, pageNumber?: number) => {
  const results: Array<{
    schemaUid?: string;
    fileId?: string | null;
    pageNumber?: number;
    comment: SchemaComment;
    anchor?: CommentAnchor;
  }> = [];
  const seenCommentIds = new Set<string>();
  const pages = template.schemas || [];
  for (let p = 0; p < pages.length; p++) {
    const page = pages[p] || [];
    for (let i = 0; i < page.length; i++) {
      const s = page[i] as SchemaForUI;
      const anchors = s.commentAnchors || [];
      const anchorById = new Map(anchors.map((anchor) => [anchor.id, anchor] as const));
      (s.comments || []).forEach((comment) => {
        const commentId = String(comment?.id || '').trim();
        if (!commentId || seenCommentIds.has(commentId)) return;
        const anchor = (comment.anchor as CommentAnchor | undefined)
          || anchorById.get(comment.id)
          || anchors.find((candidate) => candidate.id === comment.id);
        if (fileId != null && String(anchor?.fileId || '') !== String(fileId)) return;
        if (pageNumber != null && Number(anchor?.pageNumber) !== Number(pageNumber)) return;
        seenCommentIds.add(commentId);
        results.push({
          schemaUid: s.schemaUid,
          fileId: anchor?.fileId,
          pageNumber: anchor?.pageNumber,
          comment,
          anchor,
        });
      });
    }
  }
  const top = getTopLevelEntries(template as TemplateWithComments);
  top.forEach((entry) => {
    const c = (entry.comment || entry) as unknown as SchemaComment;
    const a = (entry.anchor || c?.anchor || {}) as CommentAnchor;
    const commentId = String(c?.id || entry?.id || '').trim();
    if (!commentId || seenCommentIds.has(commentId)) return;
    if ((fileId == null || String(a.fileId || '') === String(fileId)) && (pageNumber == null || Number(a.pageNumber) === Number(pageNumber))) {
      seenCommentIds.add(commentId);
      results.push({ schemaUid: undefined, fileId: a.fileId, pageNumber: a.pageNumber, comment: c, anchor: a });
    }
  });

  return results;
};

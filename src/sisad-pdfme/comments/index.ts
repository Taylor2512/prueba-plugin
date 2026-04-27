import { cloneDeep, type CommentAnchor, type SchemaForUI, type Template } from '@sisad-pdfme/common';
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

type AnchorUpdateInput = Partial<Pick<CommentAnchor, 'x' | 'y' | 'fileId' | 'pageNumber' | 'schemaUid'>>;

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

const normalizeText = (value: unknown) => String(value || '').trim();

const updateCommentAnchorValues = (anchor: Record<string, unknown> = {}, updates: AnchorUpdateInput = {}) => ({
  ...anchor,
  ...(Number.isFinite(updates.x) ? { x: Number(updates.x) } : {}),
  ...(Number.isFinite(updates.y) ? { y: Number(updates.y) } : {}),
  ...(normalizeText(updates.fileId) ? { fileId: normalizeText(updates.fileId) } : {}),
  ...(Number.isFinite(updates.pageNumber) && Number(updates.pageNumber) > 0
    ? { pageNumber: Math.trunc(Number(updates.pageNumber)) }
    : {}),
  ...(normalizeText(updates.schemaUid) ? { schemaUid: normalizeText(updates.schemaUid) } : {}),
});

export const getCommentsForDocument = (template: Template, fileId: string) =>
  filterCommentsByFileAndPage(template, fileId);

export const getCommentsForPage = (template: Template, fileId: string, pageNumber: number) =>
  filterCommentsByFileAndPage(template, fileId, pageNumber);

export const getCommentsForSchema = (template: Template, schemaUid: string) => {
  const target = findSchemaByUid(template, schemaUid);
  if (!target?.schema) return [];
  const schemaComments: PdfCommentEntry[] = (target.schema.comments || []).map((comment) => ({
    schemaUid: target.schema?.schemaUid,
    fileId: comment.fileId,
    pageNumber: comment.pageNumber,
    comment,
    anchor: comment.anchor,
  }));
  const topLevelEntries = Array.isArray(template.pdfComments)
    ? (template.pdfComments as PdfCommentEntry[])
    : [];
  const topLevelComments: PdfCommentEntry[] = topLevelEntries
    .filter(
      (entry) =>
        normalizeText(entry?.comment?.schemaUid || entry?.comment?.fieldId || entry?.anchor?.schemaUid) ===
        normalizeText(schemaUid),
    )
    .map((entry) => ({
      schemaUid: entry?.comment?.schemaUid || entry?.anchor?.schemaUid,
      fileId: entry?.anchor?.fileId,
      pageNumber: entry?.anchor?.pageNumber,
      comment: entry.comment,
      anchor: entry.anchor,
    }));
  return schemaComments.concat(topLevelComments);
};

export const moveCommentAnchor = (
  template: Template,
  commentId: string,
  updates: AnchorUpdateInput = {},
) => {
  const normalizedCommentId = normalizeText(commentId);
  if (!normalizedCommentId) return cloneDeep(template);

  const next = cloneDeep(template) as Template;
  const pages = next.schemas || [];
  for (let pageIndex = 0; pageIndex < pages.length; pageIndex += 1) {
    const page = pages[pageIndex] || [];
    for (let schemaIndex = 0; schemaIndex < page.length; schemaIndex += 1) {
      const schema = page[schemaIndex] as SchemaForUI;
      let changed = false;

      const comments = (schema.comments || []).map((comment) => {
        if (normalizeText(comment.id) !== normalizedCommentId) return comment;
        changed = true;
        return {
          ...comment,
          anchor: updateCommentAnchorValues(comment.anchor as Record<string, unknown>, updates) as CommentAnchor,
        };
      });

      const commentAnchors = (schema.commentAnchors || []).map((anchor) => {
        if (normalizeText(anchor.id) !== normalizedCommentId) return anchor;
        changed = true;
        return updateCommentAnchorValues(anchor as Record<string, unknown>, updates) as CommentAnchor;
      });

      if (changed) {
        page[schemaIndex] = {
          ...schema,
          comments,
          commentAnchors,
        };
      }
    }
  }

  const nextPdfComments = Array.isArray(next.pdfComments)
    ? (next.pdfComments as PdfCommentEntry[])
    : [];
  next.pdfComments = nextPdfComments.map((entry) => {
    if (normalizeText(entry?.id || entry?.comment?.id) !== normalizedCommentId) return entry;
    const nextAnchor = updateCommentAnchorValues(entry.anchor as Record<string, unknown>, updates);
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

export const attachCommentToField = (
  template: Template,
  commentId: string,
  schemaUid: string,
) =>
  moveCommentAnchor(template, commentId, {
    schemaUid,
  });

export const detachCommentFromField = (
  template: Template,
  commentId: string,
) =>
  moveCommentAnchor(template, commentId, {
    schemaUid: '',
  });

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
    if (normalizeText(entry?.id || entry?.comment?.id) !== normalizedCommentId) return entry;
    return {
      ...entry,
      anchor: {
        ...entry.anchor,
        resolved,
      },
      comment: {
        ...entry.comment,
        resolved,
      },
    };
  });
  return next;
};

export const reopenComment = (template: Template, commentId: string) =>
  resolveTopLevelComment(template, commentId, false);

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

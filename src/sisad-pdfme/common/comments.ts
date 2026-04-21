import { cloneDeep } from './helper.js';
import type { Template, SchemaForUI, CommentAnchor } from './types.js';
import {
  createSchemaComment,
  createSchemaCommentAnchor,
  upsertById,
  removeById,
} from './collaboration.js';

type Identity = { authorId?: string | null; authorName?: string | null; authorColor?: string | null };

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

export const addAnchorToSchema = (
  schema: SchemaForUI,
  anchor: Partial<CommentAnchor>,
  identity: Identity = {},
): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaForUI;
  const created = createSchemaCommentAnchor(anchor as any, {
    authorId: identity.authorId || undefined,
    authorColor: identity.authorColor || undefined,
    authorName: identity.authorName || undefined,
  } as any);
  next.commentAnchors = upsertById(next.commentAnchors || [], created as any);
  return next;
};

export const addCommentToSchema = (
  schema: SchemaForUI,
  text: string,
  identity: Identity = {},
): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaForUI;
  const comment = createSchemaComment(text, {
    authorId: identity.authorId || undefined,
    authorName: identity.authorName || undefined,
    authorColor: identity.authorColor || undefined,
    timestamp: Date.now(),
  } as any);
  next.comments = upsertById(next.comments || [], comment as any);
  next.commentsCount = (Number(next.commentsCount) || 0) + 1;
  return next;
};

export const addCommentWithAnchorToTemplate = (
  template: Template,
  anchor: Partial<CommentAnchor> & { schemaUid?: string },
  text: string,
  identity: Identity = {},
): Template => {
  const next = cloneDeep(template) as Template;
  const target = anchor.schemaUid ? findSchemaByUid(next, anchor.schemaUid) : null;

  if (target && target.schema) {
    const updatedSchema = addAnchorToSchema(target.schema as SchemaForUI, anchor, identity);
    const withComment = addCommentToSchema(updatedSchema as SchemaForUI, text, identity);
    next.schemas[target.pageIndex][target.index] = withComment as any;
    return next;
  }

  // Fallback: store on a top-level __commentAnchors property if no schemaUid matches
  const createdAnchor = createSchemaCommentAnchor(anchor as any, {
    authorId: identity.authorId || undefined,
    authorColor: identity.authorColor || undefined,
    authorName: identity.authorName || undefined,
  } as any);
  const createdComment = createSchemaComment(text, {
    authorId: identity.authorId || undefined,
    authorName: identity.authorName || undefined,
    authorColor: identity.authorColor || undefined,
    timestamp: Date.now(),
  } as any);

  (next as any).__commentAnchors = ((next as any).__commentAnchors as any[]) || [];
  (next as any).__commentAnchors.push({ anchor: createdAnchor, comment: createdComment });
  return next;
};

export const updateCommentInSchema = (
  schema: SchemaForUI,
  commentId: string,
  updates: Partial<{ text: string; resolved?: boolean; authorName?: string }>,
): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaForUI;
  const comments = next.comments || [];
  const idx = comments.findIndex((c: any) => c.id === commentId);
  if (idx < 0) return next;
  const item = { ...(comments[idx] as any), ...(updates as any) };
  const updated = comments.slice();
  updated[idx] = item;
  next.comments = updated as any;
  return next;
};

export const deleteCommentFromSchema = (schema: SchemaForUI, commentId: string): SchemaForUI => {
  const next = cloneDeep(schema) as SchemaForUI;
  next.comments = removeById(next.comments || [], commentId) as any;
  next.commentsCount = Math.max(0, (Number(next.commentsCount) || 0) - 1);
  return next;
};

export const resolveCommentInSchema = (schema: SchemaForUI, commentId: string, resolved = true): SchemaForUI =>
  updateCommentInSchema(schema, commentId, { resolved });

export const filterCommentsByFileAndPage = (template: Template, fileId?: string | null, pageNumber?: number) => {
  const results: Array<{ schemaUid?: string; fileId?: string | null; pageNumber?: number; comment: any; anchor?: any }> = [];
  const pages = template.schemas || [];
  for (let p = 0; p < pages.length; p++) {
    const page = pages[p] || [];
    for (let i = 0; i < page.length; i++) {
      const s = page[i] as SchemaForUI;
      const anchors = s.commentAnchors || [];
      anchors.forEach((a: any) => {
        if ((fileId == null || String(a.fileId || '') === String(fileId)) && (pageNumber == null || Number(a.pageNumber) === Number(pageNumber))) {
          const comments = s.comments || [];
          comments.forEach((c: any) => {
            results.push({ schemaUid: s.schemaUid, fileId: a.fileId, pageNumber: a.pageNumber, comment: c, anchor: a });
          });
        }
      });
    }
  }
  // also include top-level __commentAnchors if present (fallback anchors without schemaUid)
  const top = (template as any).__commentAnchors || [];
  top.forEach((entry: any) => {
    const a = entry.anchor || {};
    const c = entry.comment;
    if ((fileId == null || String(a.fileId || '') === String(fileId)) && (pageNumber == null || Number(a.pageNumber) === Number(pageNumber))) {
      results.push({ schemaUid: undefined, fileId: a.fileId, pageNumber: a.pageNumber, comment: c, anchor: a });
    }
  });

  return results;
};

export default {
  findSchemaByUid,
  addAnchorToSchema,
  addCommentToSchema,
  addCommentWithAnchorToTemplate,
  updateCommentInSchema,
  deleteCommentFromSchema,
  resolveCommentInSchema,
  filterCommentsByFileAndPage,
};

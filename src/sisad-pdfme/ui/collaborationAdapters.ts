import { ensureAnchorId, ensureComment } from '@sisad-pdfme/common/collaboration';
import { normalizeText } from '@sisad-pdfme/shared/text';
import type { SchemaComment, SchemaCommentAnchor } from '@sisad-pdfme/ui/designerEngine';

const genId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `anchor-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const toSchemaCommentAnchor = (
  anchor: unknown,
  fallbackId?: string,
): SchemaCommentAnchor => {
  // Use adapters to reduce `any`/`unknown` surface — normalize via ensureAnchorId
  const aRaw = ensureAnchorId(anchor as unknown);
  const a = (aRaw ?? {}) as Partial<SchemaCommentAnchor>;
  const id = String(a.id || fallbackId || genId());
  return {
    ...a,
    id,
    resolved: Boolean(a.resolved),
    pageNumber: typeof a.pageNumber === 'number' ? (a.pageNumber as number) : 0,
  };
};

export const toSchemaComment = (comment: unknown): SchemaComment => {
  const cRaw = ensureComment(comment as unknown);
  const c = (cRaw ?? {}) as Partial<SchemaComment>;
  const id = String(c.id || genId());
  const anchor = c.anchor ? toSchemaCommentAnchor(c.anchor, id) : undefined;
  const normalizeNullableString = (value: unknown) => {
    const n = normalizeText(value);
    return n || null;
  };

  const replies = Array.isArray(c.replies) ? (c.replies as unknown[]).map((r) => ({
    id: String((r as Record<string, unknown>)?.id || genId()),
    text: String((r as Record<string, unknown>)?.text || ''),
    authorId: (r as Record<string, unknown>)?.authorId as string | undefined,
    authorName: (r as Record<string, unknown>)?.authorName as string | undefined,
    authorColor: normalizeNullableString((r as Record<string, unknown>)?.authorColor),
    timestamp: typeof (r as Record<string, unknown>)?.timestamp === 'number' ? (r as Record<string, unknown>)?.timestamp as number : undefined,
    createdAt: typeof (r as Record<string, unknown>)?.createdAt === 'number' ? (r as Record<string, unknown>)?.createdAt as number : undefined,
    resolved: Boolean((r as Record<string, unknown>)?.resolved),
  })) : [];

  return {
    ...c,
    id,
    anchor,
    text: String(c.text || ''),
    replies,
    resolved: Boolean(c.resolved),
  };
};

export default {
  toSchemaCommentAnchor,
  toSchemaComment,
};

export const toSchemaCommentsArray = (comments?: unknown[]): SchemaComment[] =>
  Array.isArray(comments) ? (comments as unknown[]).map((c) => toSchemaComment(c)) : [];

export const toSchemaAnchorsArray = (anchors?: unknown[]): SchemaCommentAnchor[] =>
  Array.isArray(anchors) ? (anchors as unknown[]).map((a) => toSchemaCommentAnchor(a)) : [];

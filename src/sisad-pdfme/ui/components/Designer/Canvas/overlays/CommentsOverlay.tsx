import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { asRecord } from '../../shared/objectGuards.js';
import { MessageSquare } from 'lucide-react';

const MM_TO_PX = 3.7795275591;
const mm2px = (mm: number) => mm * MM_TO_PX;

type CommentsOverlayProps = {
  schemas: SchemaForUI[];
  scale: number;
  pageIndex: number;
  paperRefs: React.MutableRefObject<HTMLDivElement[]>;
  topLevelComments?: Array<{
    pageNumber?: number;
    anchor?: {
      id?: string;
      x?: number;
      y?: number;
      pageNumber?: number;
      schemaUid?: string;
      authorName?: string;
      authorId?: string;
      authorColor?: string;
      resolved?: boolean;
    };
    comment?: {
      id?: string;
      authorName?: string;
      authorId?: string;
      authorColor?: string;
      text?: string;
      resolved?: boolean;
    };
  }>;
};

type OverlayComment = {
  id?: string;
  anchor?: {
    id?: string;
    x?: number;
    y?: number;
    pageNumber?: number;
    schemaUid?: string;
    authorName?: string;
    authorId?: string;
    authorColor?: string;
    resolved?: boolean;
  };
  authorName?: string;
  authorId?: string;
  authorColor?: string;
  text?: string;
  resolved?: boolean;
};

type OverlayAnchor = {
  id?: string;
  x?: number;
  y?: number;
  pageNumber?: number;
  schemaUid?: string;
  authorName?: string;
  authorId?: string;
  authorColor?: string;
  text?: string;
  resolved?: boolean;
};

type OverlaySchema = SchemaForUI & {
  comments?: OverlayComment[];
  commentAnchors?: OverlayAnchor[];
};

const toStringOrUndefined = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

const CommentsOverlay = ({
  schemas = [],
  scale = 1,
  pageIndex,
  paperRefs,
  topLevelComments = [],
}: CommentsOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Re-measure tick: pins are positioned against EACH anchor's own page paper
  // (not a single page), so we recompute offsets on layout/resize/scroll.
  const [measureTick, setMeasureTick] = useState(0);
  const [anchorPositions, setAnchorPositions] = useState<Array<{
    id: string;
    commentId?: string;
    x: number;
    y: number;
    left: number;
    top: number;
    schemaUid?: string;
    authorName?: string;
    authorColor?: string;
    text?: string;
    resolved?: boolean;
  }>>([]);

  useLayoutEffect(() => {
    const bump = () => setMeasureTick((t) => t + 1);
    bump();
    window.addEventListener('resize', bump);
    window.addEventListener('scroll', bump, true);
    return () => {
      window.removeEventListener('resize', bump);
      window.removeEventListener('scroll', bump, true);
    };
  }, [pageIndex, paperRefs, scale, schemas.length]);

  const anchors = useMemo(() => {
    const byId = new Map<
      string,
      {
        id: string;
        x: number;
        y: number;
        pageIndex: number;
        schemaUid?: string;
        authorName?: string;
        authorColor?: string;
        text?: string;
        resolved?: boolean;
      }
    >();
    const toPageIndex = (pageNumber: unknown): number => {
      const n = Number(pageNumber);
      return Number.isInteger(n) && n >= 1 ? n - 1 : pageIndex;
    };
    schemas.forEach((s) => {
      const schema = s as OverlaySchema;
      const comments = schema.comments || [];
      comments.forEach((comment) => {
        const anchor = comment?.anchor;
        if (!anchor) return;
        const id = String(anchor.id || comment.id || `${s.schemaUid}-anchor`);
        byId.set(id, {
          id,
          commentId: String(comment.id || anchor.id || id),
          x: Number(anchor.x || 0),
          y: Number(anchor.y || 0),
          pageIndex: toPageIndex(anchor.pageNumber),
          schemaUid: anchor.schemaUid || s.schemaUid,
          authorName: toStringOrUndefined(comment.authorName) || toStringOrUndefined(comment.authorId),
          authorColor: toStringOrUndefined(comment.authorColor) || toStringOrUndefined(anchor.authorColor),
          text: String(comment.text || '').trim(),
          resolved: Boolean(comment.resolved || anchor.resolved),
        });
      });
      const as = schema.commentAnchors || [];
      as.forEach((a) => {
        const id = String(a.id || `${s.schemaUid}-anchor`);
        byId.set(id, {
          id,
          commentId: String(a.id || id),
          x: Number(a.x || 0),
          y: Number(a.y || 0),
          pageIndex: toPageIndex(a.pageNumber),
          schemaUid: a.schemaUid || s.schemaUid,
          authorName: toStringOrUndefined(a.authorName) || toStringOrUndefined(a.authorId),
          authorColor: toStringOrUndefined(a.authorColor),
          text: String(a.text || '').trim(),
          resolved: Boolean(a.resolved),
        });
      });
    });
    topLevelComments.forEach((entry) => {
      const anchor = asRecord(entry?.anchor) || {};
      const comment = asRecord(entry?.comment) || {};
      const id = String(anchor.id || comment.id || '').trim();
      if (!id) return;
      byId.set(id, {
        id,
        commentId: String(comment.id || anchor.id || id),
        x: Number(anchor.x || 0),
        y: Number(anchor.y || 0),
        pageIndex: toPageIndex(anchor.pageNumber ?? entry?.pageNumber),
        schemaUid: typeof anchor.schemaUid === 'string' ? anchor.schemaUid : undefined,
        authorName:
          (typeof comment.authorName === 'string' ? comment.authorName : undefined)
          || (typeof comment.authorId === 'string' ? comment.authorId : undefined)
          || (typeof anchor.authorName === 'string' ? anchor.authorName : undefined)
          || (typeof anchor.authorId === 'string' ? anchor.authorId : undefined),
        authorColor:
          (typeof comment.authorColor === 'string' ? comment.authorColor : undefined)
          || (typeof anchor.authorColor === 'string' ? anchor.authorColor : undefined),
        text: String(comment.text || '').trim(),
        resolved: Boolean(comment.resolved || anchor.resolved),
      });
    });
    return Array.from(byId.values());
  }, [schemas, topLevelComments, pageIndex]);

  useLayoutEffect(() => {
    const overlay = containerRef.current;
    if (!overlay) {
      setAnchorPositions([]);
      return;
    }

    const overlayRect = overlay.getBoundingClientRect();
    const nextPositions = anchors.flatMap((anchor) => {
      const paper = paperRefs.current[anchor.pageIndex];
      if (!paper) return [];
      const paperRect = paper.getBoundingClientRect();
      return [{
        ...anchor,
        left: paperRect.right - overlayRect.left + 10,
        top: paperRect.top - overlayRect.top + mm2px(anchor.y) * scale,
      }];
    });

    setAnchorPositions(nextPositions);
  }, [anchors, measureTick, paperRefs, scale]);

  if (!anchorPositions.length) return null;

  return (
    <div
      ref={containerRef}
      className="sisad-pdfme-ui-comments-overlay pointer-events-none absolute inset-0"
      data-overlay-interactive="true"
    >
      {anchorPositions.map((a) => {
        const preview = a.text ? (a.text.length > 48 ? `${a.text.slice(0, 48)}…` : a.text) : 'Comentario';
        return (
          <button
            key={a.id}
            type="button"
            title={`${a.authorName || 'Comentario'} · ${preview}`}
            onClick={(ev) => {
              ev.stopPropagation();
              ev.preventDefault();
              if (typeof window !== 'undefined') {
                window.dispatchEvent(
                  new CustomEvent('sisad-pdfme:pin-clicked', {
                    detail: {
                      anchorId: a.id,
                      commentId: a.commentId || a.id,
                      schemaUid: a.schemaUid,
                      pageNumber: a.pageIndex + 1,
                    },
                  }),
                );
              }
            }}
            style={{
              position: 'absolute',
              left: `${a.left}px`,
              top: `${a.top}px`,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
            }}
            className={[
              'inline-flex h-7 w-7 items-center justify-center rounded-full border border-sky-200 bg-white/95 shadow-md transition',
              'hover:border-sky-300 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200',
              a.resolved ? 'opacity-60' : 'opacity-100',
            ].filter(Boolean).join(' ')}
            aria-label={`Comentario en ${a.schemaUid || 'ancla'}`}
          >
            <MessageSquare size={13} className={a.resolved ? 'text-slate-400' : 'text-sky-600'} />
          </button>
        );
      })}
    </div>
  );
};

export default React.memo(CommentsOverlay);

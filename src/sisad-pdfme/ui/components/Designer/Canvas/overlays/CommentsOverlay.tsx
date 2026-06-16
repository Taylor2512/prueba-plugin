import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { asRecord } from '../../shared/objectGuards.js';

const MM_TO_PX = 3.7795275591;
const mm2px = (mm: number) => mm * MM_TO_PX;

type CommentsOverlayProps = {
  schemas: SchemaForUI[];
  scale: number;
  pageIndex: number;
  paperRefs: React.MutableRefObject<HTMLDivElement[]>;
  topLevelComments?: Array<{
    anchor?: {
      id?: string;
      x?: number;
      y?: number;
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
  const [pageOffset, setPageOffset] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    const updateOffset = () => {
      const paper = paperRefs.current[pageIndex];
      const overlay = containerRef.current;
      if (!paper || !overlay) return;
      const paperRect = paper.getBoundingClientRect();
      const overlayRect = overlay.getBoundingClientRect();
      setPageOffset({
        left: paperRect.left - overlayRect.left,
        top: paperRect.top - overlayRect.top,
      });
    };

    updateOffset();
    window.addEventListener('resize', updateOffset);
    return () => window.removeEventListener('resize', updateOffset);
  }, [pageIndex, paperRefs, scale, schemas.length]);

  const anchors = useMemo(() => {
    const byId = new Map<
      string,
      {
        id: string;
        x: number;
        y: number;
        schemaUid?: string;
        authorName?: string;
        authorColor?: string;
        text?: string;
        resolved?: boolean;
      }
    >();
    schemas.forEach((s) => {
      const schema = s as OverlaySchema;
      const comments = schema.comments || [];
      comments.forEach((comment) => {
        const anchor = comment?.anchor;
        if (!anchor) return;
        const id = String(anchor.id || comment.id || `${s.schemaUid}-anchor`);
        byId.set(id, {
          id,
          x: Number(anchor.x || 0),
          y: Number(anchor.y || 0),
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
          x: Number(a.x || 0),
          y: Number(a.y || 0),
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
        x: Number(anchor.x || 0),
        y: Number(anchor.y || 0),
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
  }, [schemas, topLevelComments]);

  if (!anchors.length) return null;

  return (
    <div
      ref={containerRef}
      className="sisad-pdfme-ui-comments-overlay"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      {anchors.map((a) => {
        const left = pageOffset.left + mm2px(a.x) * scale;
        const top = pageOffset.top + mm2px(a.y) * scale;
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
                window.dispatchEvent(new CustomEvent('sisad-pdfme:pin-clicked', { detail: { anchorId: a.id, schemaUid: a.schemaUid } }));
              }
            }}
            style={{
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: 16,
              height: 16,
              borderRadius: 8,
              background: a.authorColor || 'var(--color-primary)',
              border: '2px solid white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              cursor: 'pointer',
              opacity: a.resolved ? 0.6 : 1,
            }}
            aria-label={`Comentario en ${a.schemaUid || 'ancla'}`}
          />
        );
      })}
    </div>
  );
};

export default React.memo(CommentsOverlay);

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';

const MM_TO_PX = 3.7795275591;
const mm2px = (mm: number) => mm * MM_TO_PX;

type CommentsOverlayProps = {
  schemas: SchemaForUI[];
  scale: number;
  pageCursor: number;
  paperRefs: React.MutableRefObject<HTMLDivElement[]>;
  topLevelComments?: Array<{ anchor?: Record<string, unknown>; comment?: Record<string, unknown> }>;
};

const CommentsOverlay = ({
  schemas = [],
  scale = 1,
  pageCursor,
  paperRefs,
  topLevelComments = [],
}: CommentsOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pageOffset, setPageOffset] = useState({ left: 0, top: 0 });

  useLayoutEffect(() => {
    const updateOffset = () => {
      const paper = paperRefs.current[pageCursor];
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
  }, [pageCursor, paperRefs, scale, schemas.length]);

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
      const comments = (s.comments || []) as any[];
      comments.forEach((comment) => {
        const anchor = comment?.anchor;
        if (!anchor) return;
        const id = String(anchor.id || comment.id || `${s.schemaUid}-anchor`);
        byId.set(id, {
          id,
          x: Number(anchor.x || 0),
          y: Number(anchor.y || 0),
          schemaUid: anchor.schemaUid || s.schemaUid,
          authorName: comment.authorName || comment.authorId,
          authorColor: comment.authorColor || anchor.authorColor,
          text: String(comment.text || '').trim(),
          resolved: Boolean(comment.resolved || anchor.resolved),
        });
      });
      const as = (s.commentAnchors || []) as any[];
      as.forEach((a) => {
        const id = String(a.id || `${s.schemaUid}-anchor`);
        byId.set(id, {
          id,
          x: Number(a.x || 0),
          y: Number(a.y || 0),
          schemaUid: a.schemaUid || s.schemaUid,
          authorName: a.authorName || a.authorId,
          authorColor: a.authorColor,
          text: String(a.text || '').trim(),
          resolved: Boolean(a.resolved),
        });
      });
    });
    topLevelComments.forEach((entry) => {
      const anchor = (entry?.anchor || {}) as Record<string, unknown>;
      const comment = (entry?.comment || {}) as Record<string, unknown>;
      const id = String(anchor.id || comment.id || '').trim();
      if (!id) return;
      byId.set(id, {
        id,
        x: Number(anchor.x || 0),
        y: Number(anchor.y || 0),
        schemaUid: (anchor.schemaUid as string | undefined) || undefined,
        authorName:
          (comment.authorName as string | undefined)
          || (comment.authorId as string | undefined)
          || (anchor.authorName as string | undefined)
          || (anchor.authorId as string | undefined),
        authorColor:
          (comment.authorColor as string | undefined)
          || (anchor.authorColor as string | undefined),
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

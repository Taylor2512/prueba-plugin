import React, { useEffect, useMemo } from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { RULER_HEIGHT } from '../../../constants.js';

const MM_TO_PX = 3.7795275591;
const mm2px = (mm: number) => mm * MM_TO_PX;

type CommentsOverlayProps = {
  schemas: SchemaForUI[];
  scale: number;
  pageIndex: number;
};

const CommentsOverlay = ({ schemas = [], scale = 1, pageIndex = 0 }: CommentsOverlayProps) => {
  const anchors = useMemo(() => {
    const list: Array<{ id: string; x: number; y: number; schemaUid?: string }>[] = [];
    schemas.forEach((s) => {
      const as = (s.commentAnchors || []) as any[];
      as.forEach((a) => {
        list.push({ id: String(a.id || `${s.schemaUid}-anchor`), x: Number(a.x || 0), y: Number(a.y || 0), schemaUid: s.schemaUid });
      });
    });
    return list;
  }, [schemas]);

  useEffect(() => {
    const handler = (ev: any) => {
      // Re-emit a higher-level event so host can open a dialog
      if (typeof window === 'undefined') return;
      const detail = ev?.detail || {};
      window.dispatchEvent(new CustomEvent('sisad-pdfme:create-comment-request', { detail: { ...detail, pageIndex } }));
    };
    window.addEventListener('sisad-pdfme:create-comment', handler as EventListener);
    return () => window.removeEventListener('sisad-pdfme:create-comment', handler as EventListener);
  }, [pageIndex]);

  if (!anchors.length) return null;

  return (
    <div className="sisad-pdfme-ui-comments-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {anchors.map((a) => {
        const left = (mm2px(a.x) * scale) + RULER_HEIGHT;
        const top = (mm2px(a.y) * scale) + RULER_HEIGHT;
        return (
          <button
            key={a.id}
            type="button"
            title="Comentario"
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
              background: 'var(--color-primary)',
              border: '2px solid white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            aria-label={`Comentario en ${a.schemaUid || 'ancla'}`}
          />
        );
      })}
    </div>
  );
};

export default React.memo(CommentsOverlay);

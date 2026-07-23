/**
 * CommentsOverlay — renderiza pins de comentarios sobre el canvas.
 *
 * Consolida comentarios embebidos en schemas, anchors sueltos y comentarios
 * top-level del template/snapshot. Cada pin se posiciona contra el paper real
 * de su propia página para soportar documentos multipágina y multidocumento.
 */

import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { SchemaForUI } from '@sisad-pdfme/common';
import { asRecord } from '../../shared/objectGuards.js';
import { MessageSquare } from 'lucide-react';

/**
 * Factor de conversión de milímetros PDF a píxeles CSS a 96 DPI.
 */
const MM_TO_PX = 3.7795275591;
/**
 * Convierte una medida en milímetros a píxeles CSS antes de aplicar zoom.
 */
const mm2px = (mm: number) => mm * MM_TO_PX;

/**
 * Props del overlay de comentarios.
 *
 * Recibe todos los schemas relevantes, los comentarios top-level y referencias
 * a cada paper para ubicar pins según página, escala y posición real del DOM.
 */
type CommentAnchorMetadata = {
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

type CommentsOverlayProps = {
  schemas: SchemaForUI[];
  scale: number;
  pageIndex: number;
  paperRefs: React.MutableRefObject<HTMLDivElement[]>;
  topLevelComments?: Array<{
    pageNumber?: number;
    anchor?: CommentAnchorMetadata;
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

/**
 * Forma mínima de comentario embebido en un schema para pintar un pin.
 */
type OverlayComment = {
  id?: string;
  anchor?: CommentAnchorMetadata;
  authorName?: string;
  authorId?: string;
  authorColor?: string;
  text?: string;
  resolved?: boolean;
};

/**
 * Forma mínima de anchor suelto asociado a un schema.
 */
type OverlayAnchor = CommentAnchorMetadata & {
  text?: string;
};

/**
 * Extensión local de SchemaForUI con comentarios y anchors compatibles.
 */
type OverlaySchema = SchemaForUI & {
  comments?: OverlayComment[];
  commentAnchors?: OverlayAnchor[];
};

/**
 * Normaliza valores dinámicos a string no vacío o undefined.
 */
const toStringOrUndefined = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

type CommentAnchorViewModel = {
  id: string;
  commentId: string;
  x: number;
  y: number;
  pageIndex: number;
  schemaUid?: string;
  authorName?: string;
  authorColor?: string;
  text?: string;
  resolved?: boolean;
};

type CommentAnchorSource = Omit<CommentAnchorViewModel, 'id' | 'commentId' | 'x' | 'y' | 'pageIndex'> & {
  id: unknown;
  commentId?: unknown;
  x?: unknown;
  y?: unknown;
  pageNumber?: unknown;
};

/** Normaliza y registra el view-model compartido por todas las fuentes de comentarios. */
const upsertCommentAnchor = (
  byId: Map<string, CommentAnchorViewModel>,
  source: CommentAnchorSource,
  fallbackPageIndex: number,
) => {
  const id = String(source.id || '').trim();
  if (!id) return;
  const pageNumber = Number(source.pageNumber);
  byId.set(id, {
    id,
    commentId: String(source.commentId || id),
    x: Number(source.x || 0),
    y: Number(source.y || 0),
    pageIndex: Number.isInteger(pageNumber) && pageNumber >= 1 ? pageNumber - 1 : fallbackPageIndex,
    schemaUid: source.schemaUid,
    authorName: source.authorName,
    authorColor: source.authorColor,
    text: String(source.text || '').trim(),
    resolved: Boolean(source.resolved),
  });
};

/**
 * Renderiza botones/pins de comentario posicionados sobre cada página.
 *
 * Los pins emiten `sisad-pdfme:pin-clicked` para que paneles externos abran el
 * hilo correspondiente sin acoplar este overlay al estado de comentarios.
 */
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

/**
 * Fuerza recomputo de posiciones cuando cambia layout, scroll o tamaño.
 */
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

/**
 * Consolida comentarios embebidos, anchors y comentarios top-level.
 *
 * Usa un Map por id para evitar pins duplicados cuando el mismo comentario
 * aparece en más de una fuente serializada.
 */
  const anchors = useMemo(() => {
    const byId = new Map<string, CommentAnchorViewModel>();
    schemas.forEach((s) => {
      const schema = s as OverlaySchema;
      const comments = schema.comments || [];
      comments.forEach((comment) => {
        const anchor = comment?.anchor;
        if (!anchor) return;
        const id = String(anchor.id || comment.id || `${s.schemaUid}-anchor`);
        upsertCommentAnchor(byId, {
          id,
          commentId: String(comment.id || anchor.id || id),
          x: anchor.x,
          y: anchor.y,
          pageNumber: anchor.pageNumber,
          schemaUid: anchor.schemaUid || s.schemaUid,
          authorName: toStringOrUndefined(comment.authorName) || toStringOrUndefined(comment.authorId),
          authorColor: toStringOrUndefined(comment.authorColor) || toStringOrUndefined(anchor.authorColor),
          text: String(comment.text || '').trim(),
          resolved: Boolean(comment.resolved || anchor.resolved),
        }, pageIndex);
      });
      const as = schema.commentAnchors || [];
      as.forEach((a) => {
        const id = String(a.id || `${s.schemaUid}-anchor`);
        upsertCommentAnchor(byId, {
          id,
          commentId: String(a.id || id),
          x: a.x,
          y: a.y,
          pageNumber: a.pageNumber,
          schemaUid: a.schemaUid || s.schemaUid,
          authorName: toStringOrUndefined(a.authorName) || toStringOrUndefined(a.authorId),
          authorColor: toStringOrUndefined(a.authorColor),
          text: String(a.text || '').trim(),
          resolved: Boolean(a.resolved),
        }, pageIndex);
      });
    });
    topLevelComments.forEach((entry) => {
      const anchor = asRecord(entry?.anchor) || {};
      const comment = asRecord(entry?.comment) || {};
      const id = String(anchor.id || comment.id || '').trim();
      upsertCommentAnchor(byId, {
        id,
        commentId: String(comment.id || anchor.id || id),
        x: anchor.x,
        y: anchor.y,
        pageNumber: anchor.pageNumber ?? entry?.pageNumber,
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
      }, pageIndex);
    });
    return Array.from(byId.values());
  }, [schemas, topLevelComments, pageIndex]);

/**
 * Mide overlay/papers reales y transforma anchors en posiciones absolutas.
 */
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

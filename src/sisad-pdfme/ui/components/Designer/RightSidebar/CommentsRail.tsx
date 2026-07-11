import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { MessageSquare, MessageSquarePlus } from 'lucide-react';
import type { DesignerCommentItem } from '../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { SidebarSurfaceEmptyState, SidebarSurfaceHeader } from './shared/SidebarSurfacePrimitives.js';
import { mergeClassNames } from '../shared/className.js';

/**
 * Props del rail lateral de comentarios.
 *
 * Este rail presenta hilos asociados al diseñador y funciona como vista
 * compacta/scrollable dentro del RightSidebar. No persiste comentarios ni
 * ejecuta mutaciones; recibe los hilos ya normalizados y delega la creación
 * de nuevos comentarios mediante `onAdd`.
 */
export type CommentsRailProps = {
  /** Lista de hilos de comentarios que se deben renderizar. */
  items: DesignerCommentItem[];

  /** Callback opcional para solicitar la creación de un nuevo comentario. */
  onAdd?: () => void;

  /** Título principal del rail. */
  title?: string;

  /** Título mostrado cuando no existen comentarios. */
  emptyTitle?: string;

  /** Subtítulo opcional; si no se provee, se deriva de la cantidad de hilos/respuestas. */
  subtitle?: React.ReactNode;

  /** Texto/nodo del botón de agregar comentario. */
  addLabel?: React.ReactNode;

  /** Descripción del estado vacío. */
  emptyDescription?: React.ReactNode;

  /** Etiqueta para la sección de respuestas de un hilo. */
  replyLabel?: React.ReactNode;

  /** Etiqueta visible para hilos/respuestas resueltos. */
  resolvedLabel?: React.ReactNode;

  /** Etiqueta visible para hilos/respuestas abiertos. */
  openLabel?: React.ReactNode;

  /** ID del comentario activo; cuando cambia, el rail intenta hacer scroll hacia ese hilo. */
  activeCommentId?: string | null;

  /** Clase adicional para el contenedor raíz. */
  className?: string;

  /** Estilos inline opcionales para el contenedor raíz. */
  style?: React.CSSProperties;
};

/**
 * Formatea una fecha de comentario de forma corta para UI compacta.
 *
 * @param timestamp Marca de tiempo en milisegundos o segundos ya normalizada por la capa superior.
 * @returns Fecha legible o `Sin fecha` cuando el valor no es válido.
 */
const formatTimestamp = (timestamp?: number) => {
  if (!timestamp || !Number.isFinite(timestamp)) return 'Sin fecha';

  try {
    return COMMENT_DATE_FORMATTER.format(new Date(timestamp));
  } catch {
    return 'Sin fecha';
  }
};

/** Formatter compartido para fechas de comentarios dentro del rail. */
const COMMENT_DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Construye una etiqueta singular/plural para contadores compactos.
 */
const formatCountLabel = (count: number, singular: string, plural: string) => `${count} ${count === 1 ? singular : plural}`;

/**
 * Construye el resumen del header del rail.
 *
 * Incluye cantidad de hilos y, si aplica, cantidad de respuestas visibles.
 */
const formatThreadSummary = (threadCount: number, replyCount: number) => {
  const threadLabel = formatCountLabel(threadCount, 'hilo', 'hilos');
  if (replyCount <= 0) return threadLabel;
  return `${threadLabel} · ${formatCountLabel(replyCount, 'respuesta', 'respuestas')} en la página actual`;
};

/**
 * Construye la metadata compacta de un comentario.
 *
 * Prioriza referencia de campo, página y fecha para que el usuario pueda
 * ubicar el hilo dentro del documento sin abrir más paneles.
 */
const formatCommentMeta = (item: DesignerCommentItem) => {
  const segments: string[] = [];
  if (item.schemaUid) segments.push(`Campo ${item.schemaUid}`);
  if (item.pageNumber) segments.push(`Página ${item.pageNumber}`);
  const timestamp = formatTimestamp(item.timestamp);
  if (timestamp) segments.push(timestamp);
  return segments.join(' · ');
};

/**
 * Devuelve respuestas visibles y ordenadas cronológicamente.
 *
 * Se descartan respuestas sin texto para evitar ruido visual en el rail.
 */
const getVisibleReplies = (replies?: DesignerCommentItem['replies']) =>
  Array.isArray(replies)
    ? replies
        .filter((reply) => String(reply.text || '').trim())
        .slice()
        .sort((left, right) => (left.timestamp || 0) - (right.timestamp || 0))
    : [];

type CommentPillProps = {
  /** Contenido visible dentro del pill. */
  children: React.ReactNode;

  /** Tono visual del pill. */
  tone?: 'muted' | 'info' | 'success';
};

/**
 * Badge/pill pequeño usado para estado de hilo y conteo de respuestas.
 */
const CommentPill = ({ children, tone = 'muted' }: CommentPillProps) => {
  const palette =
    tone === 'success'
      ? { background: 'rgba(34, 197, 94, 0.14)', color: '#15803d' }
      : tone === 'info'
        ? { background: 'rgba(37, 99, 235, 0.12)', color: '#1d4ed8' }
        : { background: 'var(--sisad-pdfme-surface-soft)', color: 'var(--sisad-pdfme-text-muted)' };

  return (
    <span
      style={{
        borderRadius: 999,
        padding: '2px 8px',
        fontSize: 12,
        fontWeight: 700,
        background: palette.background,
        color: palette.color,
      }}
    >
      {children}
    </span>
  );
};

/**
 * Rail de comentarios del sidebar derecho.
 *
 * Responsabilidades:
 *
 * - presentar hilos y respuestas de comentarios;
 * - mostrar estado abierto/resuelto;
 * - hacer scroll automático hacia el comentario activo;
 * - mostrar estado vacío cuando no hay hilos;
 * - exponer acción opcional para crear nuevo comentario.
 *
 * Restricciones:
 *
 * - no modifica comentarios directamente;
 * - no conoce la geometría del canvas;
 * - no abre modales por sí mismo;
 * - no resuelve permisos colaborativos.
 */
const CommentsRail = ({
  items,
  onAdd,
  title = 'Comentarios',
  emptyTitle = 'Sin comentarios aún.',
  subtitle,
  addLabel = 'Agregar',
  emptyDescription = 'Crea el primer hilo para este campo.',
  replyLabel = 'Respuestas',
  resolvedLabel = 'Resuelto',
  openLabel = 'Abierto',
  activeCommentId = null,
  className,
  style,
}: CommentsRailProps) => {
  /** Mapa de refs por ID de comentario para soportar scroll hacia el hilo activo. */
  const itemRefs = useRef(new Map<string, HTMLElement>());

  /** Total de respuestas visibles en todos los hilos renderizados. */
  const replyTotal = items.reduce((total, item) => total + getVisibleReplies(item.replies).length, 0);

  /** Centra visualmente el hilo activo cuando `activeCommentId` cambia. */
  useEffect(() => {
    if (!activeCommentId) return;
    const activeNode = itemRefs.current.get(activeCommentId);
    if (!activeNode) return;
    activeNode.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeCommentId, items.length]);

  return (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'comments-rail',
        DESIGNER_CLASSNAME + 'sidebar-section-surface',
        'flex min-h-0 flex-1 flex-col gap-2 rounded-xl border border-slate-200/70 bg-white/90 p-2 shadow-sm',
        className,
      )}
      style={style}
    >
      <SidebarSurfaceHeader
        className="shrink-0"
        title={title}
        subtitle={subtitle || (items.length > 0 ? formatThreadSummary(items.length, replyTotal) : emptyTitle)}
        badges={items.length > 0 ? [{ label: items.length, color: 'default' }] : []}
        trailing={
          onAdd ? (
            <Button type="text" size="small" icon={<MessageSquarePlus size={13} />} onClick={onAdd}>
              {addLabel}
            </Button>
          ) : null
        }
        compact
      />

      {items.length === 0 ? (
        <SidebarSurfaceEmptyState
          icon={<MessageSquare size={16} />}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto overflow-x-hidden overscroll-contain">
          {items.map((item) => {
            const replies = getVisibleReplies(item.replies);
            const resolved = Boolean(item.resolved) && replies.every((reply) => Boolean(reply.resolved));
            const replyCount = replies.length;
            const isActive = activeCommentId === item.id;

            return (
              <article
                key={item.id}
                ref={(node) => {
                  if (node) {
                    itemRefs.current.set(item.id, node);
                  } else {
                    itemRefs.current.delete(item.id);
                  }
                }}
                data-active={isActive ? 'true' : 'false'}
                className={[
                  DESIGNER_CLASSNAME + 'comments-rail-thread',
                  isActive ? DESIGNER_CLASSNAME + 'comments-rail-thread-active' : '',
                ].filter(Boolean).join(' ')}
              >
                <div className={DESIGNER_CLASSNAME + 'comments-rail-thread-head'}>
                  <div className={DESIGNER_CLASSNAME + 'comments-rail-thread-author'}>
                    <span
                      aria-hidden="true"
                      className={DESIGNER_CLASSNAME + 'comments-rail-thread-dot'}
                      style={{ background: item.authorColor || 'var(--sisad-pdfme-border-strong)' }}
                    />
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--sisad-pdfme-text)' }}>
                      {item.authorName || 'Autor no identificado'}
                    </span>
                  </div>
                  <div className={DESIGNER_CLASSNAME + 'comments-rail-thread-badges'}>
                    {replyCount > 0 ? (
                      <CommentPill>
                        {formatCountLabel(replyCount, 'respuesta', 'respuestas')}
                      </CommentPill>
                    ) : null}
                    <CommentPill tone={resolved ? 'success' : 'info'}>
                      {resolved ? resolvedLabel : openLabel}
                    </CommentPill>
                  </div>
                </div>

                <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--sisad-pdfme-text)' }}>{item.text}</div>

                <div className={DESIGNER_CLASSNAME + 'comments-rail-thread-meta-row'}>
                  <span className={DESIGNER_CLASSNAME + 'comments-rail-thread-meta-pill'}>
                    {formatCommentMeta(item)}
                  </span>
                </div>

                {replyCount > 0 ? (
                  <div className={DESIGNER_CLASSNAME + 'comments-rail-thread-replies'}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--sisad-pdfme-text-muted)' }}>
                      {replyLabel}
                    </div>
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className={DESIGNER_CLASSNAME + 'comments-rail-reply'}
                      >
                        <div className={DESIGNER_CLASSNAME + 'comments-rail-reply-head'}>
                          <div className={DESIGNER_CLASSNAME + 'comments-rail-reply-author'}>
                            <span
                              aria-hidden="true"
                              className={DESIGNER_CLASSNAME + 'comments-rail-reply-dot'}
                              style={{ background: reply.authorColor || 'var(--sisad-pdfme-border-strong)' }}
                            />
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--sisad-pdfme-text)' }}>
                              {reply.authorName || 'Autor no identificado'}
                            </span>
                          </div>
                          <CommentPill tone={reply.resolved ? 'success' : 'muted'}>
                            {reply.resolved ? resolvedLabel : openLabel}
                          </CommentPill>
                        </div>

                        <div style={{ fontSize: 12.5, lineHeight: 1.45, color: 'var(--sisad-pdfme-text)' }}>{reply.text}</div>

                        <div style={{ fontSize: 11.5, color: 'var(--sisad-pdfme-text-muted)' }}>
                          {formatTimestamp(reply.timestamp)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentsRail;

import React, { useEffect, useRef } from 'react';
import type { DesignerCommentItem } from '../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../constants.js';

export type CommentsRailProps = {
  items: DesignerCommentItem[];
  onAdd?: () => void;
  title?: string;
  emptyTitle?: string;
  activeCommentId?: string | null;
  className?: string;
  style?: React.CSSProperties;
};

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp || !Number.isFinite(timestamp)) return 'Sin fecha';

  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  } catch {
    return 'Sin fecha';
  }
};

const formatCountLabel = (count: number, singular: string, plural: string) => `${count} ${count === 1 ? singular : plural}`;

const formatThreadSummary = (threadCount: number, replyCount: number) => {
  const threadLabel = formatCountLabel(threadCount, 'hilo', 'hilos');
  if (replyCount <= 0) return threadLabel;
  return `${threadLabel} · ${formatCountLabel(replyCount, 'respuesta', 'respuestas')}`;
};

const getVisibleReplies = (replies?: DesignerCommentItem['replies']) =>
  Array.isArray(replies)
    ? replies
        .filter((reply) => String(reply.text || '').trim())
        .slice()
        .sort((left, right) => (left.timestamp || 0) - (right.timestamp || 0))
    : [];

const CommentsRail = ({
  items,
  onAdd,
  title = 'Comentarios',
  emptyTitle = 'No hay comentarios en esta vista.',
  activeCommentId = null,
  className,
  style,
}: CommentsRailProps) => {
  const itemRefs = useRef(new Map<string, HTMLElement>());
  const replyTotal = items.reduce((total, item) => total + getVisibleReplies(item.replies).length, 0);

  useEffect(() => {
    if (!activeCommentId) return;
    const activeNode = itemRefs.current.get(activeCommentId);
    if (!activeNode) return;
    activeNode.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [activeCommentId, items.length]);

  return (
    <div
      className={[
        DESIGNER_CLASSNAME + 'comments-rail',
        DESIGNER_CLASSNAME + 'sidebar-section-surface',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        minHeight: 0,
        padding: 12,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sisad-pdfme-text)' }}>{title}</div>
          <div style={{ fontSize: 12, color: 'var(--sisad-pdfme-text-muted)' }}>
            {items.length > 0 ? `${formatThreadSummary(items.length, replyTotal)} en la página actual` : emptyTitle}
          </div>
        </div>
        {onAdd ? (
          <button
            type="button"
            onClick={onAdd}
            style={{
              border: '1px solid var(--sisad-pdfme-border)',
              borderRadius: 8,
              background: 'var(--sisad-pdfme-surface)',
              color: 'var(--sisad-pdfme-text)',
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--sisad-pdfme-shadow-sm)',
            }}
          >
            Agregar
          </button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div
          style={{
            border: '1px dashed var(--sisad-pdfme-border)',
            borderRadius: 10,
            padding: 14,
            background: 'var(--sisad-pdfme-surface-alt)',
            color: 'var(--sisad-pdfme-text-muted)',
            fontSize: 12,
          }}
        >
          {emptyTitle}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, overflowY: 'auto' }}>
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
                style={{
                  border: isActive ? '1px solid var(--sisad-pdfme-accent)' : '1px solid var(--sisad-pdfme-border)',
                  borderRadius: 12,
                  background: isActive ? 'var(--sisad-pdfme-accent-soft)' : 'var(--sisad-pdfme-surface)',
                  boxShadow: 'var(--sisad-pdfme-shadow-sm)',
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: '999px',
                        background: item.authorColor || 'var(--sisad-pdfme-border-strong)',
                        flex: '0 0 auto',
                      }}
                    />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--sisad-pdfme-text)' }}>
                      {item.authorName || 'Autor no identificado'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {replyCount > 0 ? (
                      <span
                        style={{
                          borderRadius: 999,
                          padding: '2px 8px',
                          fontSize: 11,
                          fontWeight: 700,
                          background: 'rgba(17, 24, 39, 0.08)',
                          color: 'var(--sisad-pdfme-text-muted)',
                        }}
                      >
                        {formatCountLabel(replyCount, 'respuesta', 'respuestas')}
                      </span>
                    ) : null}
                    <span
                      style={{
                        borderRadius: 999,
                        padding: '2px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        background: resolved ? 'rgba(34, 197, 94, 0.14)' : 'rgba(37, 99, 235, 0.12)',
                        color: resolved ? '#15803d' : '#1d4ed8',
                      }}
                    >
                      {resolved ? 'Resuelto' : 'Abierto'}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--sisad-pdfme-text)' }}>{item.text}</div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {item.schemaUid ? (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: '2px 8px',
                        fontSize: 11,
                        background: 'var(--sisad-pdfme-surface-soft)',
                        color: 'var(--sisad-pdfme-text-muted)',
                      }}
                    >
                      Campo {item.schemaUid}
                    </span>
                  ) : null}
                  {item.pageNumber ? (
                    <span
                      style={{
                        borderRadius: 999,
                        padding: '2px 8px',
                        fontSize: 11,
                        background: 'var(--sisad-pdfme-surface-soft)',
                        color: 'var(--sisad-pdfme-text-muted)',
                      }}
                    >
                      Página {item.pageNumber}
                    </span>
                  ) : null}
                  <span
                    style={{
                      borderRadius: 999,
                      padding: '2px 8px',
                      fontSize: 11,
                      background: 'var(--sisad-pdfme-surface-soft)',
                      color: 'var(--sisad-pdfme-text-muted)',
                    }}
                  >
                    {formatTimestamp(item.timestamp)}
                  </span>
                </div>

                {replyCount > 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      marginTop: 2,
                      paddingLeft: 12,
                      borderLeft: '2px solid rgba(37, 99, 235, 0.18)',
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sisad-pdfme-text-muted)' }}>
                      Respuestas
                    </div>
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        style={{
                          border: '1px solid rgba(37, 99, 235, 0.12)',
                          borderRadius: 10,
                          padding: 10,
                          background: 'rgba(255, 255, 255, 0.82)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            <span
                              aria-hidden="true"
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '999px',
                                background: reply.authorColor || 'var(--sisad-pdfme-border-strong)',
                                flex: '0 0 auto',
                              }}
                            />
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--sisad-pdfme-text)' }}>
                              {reply.authorName || 'Autor no identificado'}
                            </span>
                          </div>
                          <span
                            style={{
                              borderRadius: 999,
                              padding: '2px 8px',
                              fontSize: 11,
                              fontWeight: 700,
                              background: reply.resolved ? 'rgba(34, 197, 94, 0.14)' : 'rgba(17, 24, 39, 0.08)',
                              color: reply.resolved ? '#15803d' : 'var(--sisad-pdfme-text-muted)',
                            }}
                          >
                            {reply.resolved ? 'Resuelta' : 'Abierta'}
                          </span>
                        </div>

                        <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--sisad-pdfme-text)' }}>{reply.text}</div>

                        <div style={{ fontSize: 11, color: 'var(--sisad-pdfme-text-muted)' }}>
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
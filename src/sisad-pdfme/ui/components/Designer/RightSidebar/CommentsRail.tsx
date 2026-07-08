import React, { useEffect, useRef } from 'react';
import { Button } from 'antd';
import { MessageSquare, MessageSquarePlus } from 'lucide-react';
import type { DesignerCommentItem } from '../../../types.js';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { SidebarSurfaceEmptyState, SidebarSurfaceHeader } from './shared/SidebarSurfacePrimitives.js';
import { mergeClassNames } from '../shared/className.js';

export type CommentsRailProps = {
  items: DesignerCommentItem[];
  onAdd?: () => void;
  title?: string;
  emptyTitle?: string;
  subtitle?: React.ReactNode;
  addLabel?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  replyLabel?: React.ReactNode;
  resolvedLabel?: React.ReactNode;
  openLabel?: React.ReactNode;
  activeCommentId?: string | null;
  className?: string;
  style?: React.CSSProperties;
};

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp || !Number.isFinite(timestamp)) return 'Sin fecha';

  try {
    return COMMENT_DATE_FORMATTER.format(new Date(timestamp));
  } catch {
    return 'Sin fecha';
  }
};

const COMMENT_DATE_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const formatCountLabel = (count: number, singular: string, plural: string) => `${count} ${count === 1 ? singular : plural}`;

const formatThreadSummary = (threadCount: number, replyCount: number) => {
  const threadLabel = formatCountLabel(threadCount, 'hilo', 'hilos');
  if (replyCount <= 0) return threadLabel;
  return `${threadLabel} · ${formatCountLabel(replyCount, 'respuesta', 'respuestas')} en la página actual`;
};

const formatCommentMeta = (item: DesignerCommentItem) => {
  const segments: string[] = [];
  if (item.schemaUid) segments.push(`Campo ${item.schemaUid}`);
  if (item.pageNumber) segments.push(`Página ${item.pageNumber}`);
  const timestamp = formatTimestamp(item.timestamp);
  if (timestamp) segments.push(timestamp);
  return segments.join(' · ');
};

const getVisibleReplies = (replies?: DesignerCommentItem['replies']) =>
  Array.isArray(replies)
    ? replies
        .filter((reply) => String(reply.text || '').trim())
        .slice()
        .sort((left, right) => (left.timestamp || 0) - (right.timestamp || 0))
    : [];

type CommentPillProps = {
  children: React.ReactNode;
  tone?: 'muted' | 'info' | 'success';
};

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
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'comments-rail',
        DESIGNER_CLASSNAME + 'sidebar-section-surface',
        'flex min-h-0 flex-1 flex-col gap-2 rounded-xl border border-slate-200/70 bg-white/90 p-2 shadow-sm',
        className,
      )}
      style={style}
    >
      <SidebarSurfaceHeader
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0, overflowY: 'auto' }}>
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

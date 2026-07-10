import React, { useState } from 'react';
import { Button, Input, Space, Tag, Tooltip } from 'antd';
import { CheckCircle2, MessageSquare, MessageSquarePlus, RotateCcw, Trash2 } from 'lucide-react';
import {
  createSchemaComment,
  removeById,
  upsertById,
  type PropPanelWidgetProps,
  type SchemaForUI,
} from '@sisad-pdfme/common';
import { uuid } from '../../../../helper.js';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import type { SchemaComment } from '../../../../designerEngine.js';
import { InspectorEmptyState } from './InspectorPrimitives.js';
import { asRecord } from '../../shared/objectGuards.js';
import { mergeClassNames } from '../../shared/className.js';
import { stopInspectorPointerEvent } from './inspectorInteractionGuards.js';

type FieldCommentsWidgetProps = PropPanelWidgetProps & {
  activeSchema: SchemaForUI;
  changeSchemas: (_objs: { key: string; value: unknown; schemaId: string }[]) => void;
  designerEngine?: { collaboration?: { actorId?: string; actorName?: string; actorColor?: string } };
  composerPlaceholder?: string;
  addLabel?: React.ReactNode;
  emptyLabel?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  replyPlaceholder?: string;
  replyLabel?: React.ReactNode;
  resolvedLabel?: React.ReactNode;
  openLabel?: React.ReactNode;
};

const normalizeComments = (value: unknown): SchemaComment[] =>
  Array.isArray(value) ? (value as SchemaComment[]) : [];

const createTimestamp = () => Date.now();

const COMMENT_TIMESTAMP_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const formatTimestamp = (ts?: number): string => {
  if (!ts || !Number.isFinite(ts)) return '';
  try {
    return COMMENT_TIMESTAMP_FORMATTER.format(new Date(ts));
  } catch {
    return '';
  }
};

const resolveText = (value: React.ReactNode, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback;

const buildReplyComment = (args: {
  actorId: string;
  actorName: string;
  actorColor?: string;
  text: string;
}) => ({
  id: `reply-${uuid()}`,
  authorId: args.actorId,
  authorName: args.actorName,
  authorColor: args.actorColor,
  text: args.text,
  timestamp: createTimestamp(),
  resolved: false,
});

/**
 * Per-field inspector comments tab.
 *
 * Reads `activeSchema.comments`, lets the inspector user add new threads,
 * reply to threads, and resolve / reopen them.  Changes are persisted through
 * `changeSchemas` using the key `"comments"`.
 */
const SchemaFieldCommentsWidget = ({
  activeSchema,
  changeSchemas,
  designerEngine,
  composerPlaceholder = 'Escribe un comentario sobre este campo…',
  addLabel = 'Agregar',
  emptyLabel = 'Sin comentarios',
  emptyDescription = 'Añade el primer hilo.',
  replyPlaceholder = 'Responder…',
  replyLabel = 'Respuestas',
  resolvedLabel = 'Resuelto',
  openLabel = 'Abierto',
}: FieldCommentsWidgetProps) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const actorId = designerEngine?.collaboration?.actorId || 'local';
  const actorName = designerEngine?.collaboration?.actorName || actorId;
  const actorColor = designerEngine?.collaboration?.actorColor;

  const comments = normalizeComments(asRecord(activeSchema)?.comments);

  const persistComments = (next: SchemaComment[]) => {
    changeSchemas([{ key: 'comments', value: next, schemaId: activeSchema.id }]);
  };

  const handleAddComment = () => {
    const text = newCommentText.trim();
    if (!text) return;
    const comment = createSchemaComment(text, {
      authorId: actorId,
      authorName: actorName,
      authorColor: actorColor,
    });
    persistComments([...comments, comment as SchemaComment]);
    setNewCommentText('');
  };

  const resolvedEmptyLabel = resolveText(emptyLabel, 'Sin comentarios');
  const resolvedEmptyDescription = resolveText(emptyDescription, 'Añade el primer hilo.');

  const handleResolveToggle = (commentId: string, resolved: boolean) => {
    const next = comments.map((c) => (c.id === commentId ? { ...c, resolved } : c));
    persistComments(next);
  };

  const handleDeleteComment = (commentId: string) => {
    persistComments(removeById(comments, commentId));
  };

  const handleAddReply = (commentId: string) => {
    const text = (replyTexts[commentId] || '').trim();
    if (!text) return;
    const existingComment = comments.find((c) => c.id === commentId);
    if (!existingComment) return;
    const reply = buildReplyComment({
      actorId,
      actorName,
      actorColor,
      text,
    });
    const next = upsertById(
      comments,
      {
        ...existingComment,
        replies: [...((existingComment.replies as typeof reply[]) || []), reply],
      } as SchemaComment,
    );
    persistComments(next);
    setReplyTexts((prev) => ({ ...prev, [commentId]: '' }));
  };

  const cls = (suffix: string) => `${DESIGNER_CLASSNAME}${suffix}`;

  return (
    <div
      className={mergeClassNames(cls('field-comments-widget'), 'space-y-3')}
      data-sisad-inspector-interactive="true"
      data-selecto-ignore="true"
      data-moveable-ignore="true"
      data-canvas-drop-ignore="true"
      onPointerDown={stopInspectorPointerEvent}
      onMouseDown={stopInspectorPointerEvent}
      onClick={stopInspectorPointerEvent}
    >
      {/* New comment input */}
      <div className={mergeClassNames(cls('field-comments-add'), 'flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm')}>
        <Input.TextArea
          id={`comments-new-${activeSchema.id}`}
          name={`comments-new-${activeSchema.id}`}
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={composerPlaceholder}
          autoSize={{ minRows: 2, maxRows: 4 }}
          className="rounded-xl border-slate-200 shadow-sm"
          onPointerDown={stopInspectorPointerEvent}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <Button
          type="primary"
          size="small"
          icon={<MessageSquarePlus size={13} />}
          onClick={handleAddComment}
          onPointerDown={stopInspectorPointerEvent}
          disabled={!newCommentText.trim()}
          className={mergeClassNames(cls('field-comments-add-btn'), 'self-end rounded-full bg-sky-600 text-white shadow-sm')}
        >
          {addLabel}
        </Button>
      </div>

      {/* Thread list */}
      {comments.length === 0 ? (
        <InspectorEmptyState
          icon={<MessageSquare size={18} />}
          label={resolvedEmptyLabel}
          description={resolvedEmptyDescription}
          classNameSuffix="field-comments-empty"
        />
      ) : (
        <div className={mergeClassNames(cls('field-comments-list'), 'space-y-3')}>
          {comments.map((comment) => {
            const resolved = Boolean(comment.resolved);
            return (
              <div
                key={comment.id}
                className={mergeClassNames(
                  cls('field-comments-thread'),
                  resolved && 'is-resolved',
                  'space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3 shadow-sm',
                )}
              >
                {/* Thread header */}
                <div className={mergeClassNames(cls('field-comments-thread-header'), 'flex items-start justify-between gap-3')}>
                  <Space size={4} align="center">
                    {actorColor || comment.authorColor ? (
                      <span
                        className={mergeClassNames(cls('field-comments-author-dot'), 'h-2.5 w-2.5 rounded-full')}
                        style={{ background: comment.authorColor || actorColor }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className={mergeClassNames(cls('field-comments-author-name'), 'text-sm font-semibold text-slate-800')}>
                      {comment.authorName || comment.authorId || 'Anónimo'}
                    </span>
                    <span className={mergeClassNames(cls('field-comments-timestamp'), 'text-xs text-slate-500')}>
                      {formatTimestamp(comment.timestamp || comment.createdAt)}
                    </span>
                    {resolved ? (
                      <Tag color="success" className="m-0 rounded-full border-0 bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                        {resolvedLabel}
                      </Tag>
                    ) : null}
                  </Space>
                  <Space size={4}>
                    <Tooltip title={resolved ? 'Reabrir hilo' : 'Marcar como resuelto'}>
                      <Button
                        type="text"
                        size="small"
                        icon={
                          resolved ? (
                            <RotateCcw size={12} />
                          ) : (
                            <CheckCircle2 size={12} />
                          )
                        }
                        onClick={() => handleResolveToggle(comment.id, !resolved)}
                        onPointerDown={stopInspectorPointerEvent}
                        aria-label={resolved ? 'Reabrir hilo' : 'Marcar como resuelto'}
                      />
                    </Tooltip>
                    <Tooltip title="Eliminar hilo">
                      <Button
                        type="text"
                        size="small"
                        danger
                        icon={<Trash2 size={12} />}
                        onClick={() => handleDeleteComment(comment.id)}
                        onPointerDown={stopInspectorPointerEvent}
                        aria-label="Eliminar hilo de comentarios"
                      />
                    </Tooltip>
                  </Space>
                </div>

                {/* Thread body */}
                <div className={mergeClassNames(cls('field-comments-thread-body'), 'text-sm leading-6 text-slate-700')}>{comment.text}</div>

                {/* Replies */}
                {(comment.replies || []).length > 0 ? (
                  <div className={mergeClassNames(cls('field-comments-replies'), 'space-y-2')}>
                    {(comment.replies as { id: string; authorName?: string; authorId?: string; authorColor?: string; text: string; timestamp?: number; createdAt?: number }[]).map((reply) => (
                      <div key={reply.id} className={mergeClassNames(cls('field-comments-reply'), 'space-y-1 rounded-xl border border-slate-200 bg-white p-3')}>
                        <Space size={4} align="center">
                          {reply.authorColor ? (
                            <span
                              className={mergeClassNames(cls('field-comments-author-dot'), 'h-2.5 w-2.5 rounded-full')}
                              style={{ background: reply.authorColor }}
                              aria-hidden="true"
                            />
                          ) : null}
                          <span className={mergeClassNames(cls('field-comments-author-name'), 'text-sm font-semibold text-slate-800')}>
                            {reply.authorName || reply.authorId || 'Anónimo'}
                          </span>
                          <span className={mergeClassNames(cls('field-comments-timestamp'), 'text-xs text-slate-500')}>
                            {formatTimestamp(reply.timestamp || reply.createdAt)}
                          </span>
                        </Space>
                        <div className={mergeClassNames(cls('field-comments-reply-text'), 'text-sm leading-6 text-slate-700')}>{reply.text}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Reply input */}
                {!resolved ? (
                  <div className={mergeClassNames(cls('field-comments-reply-input'), 'flex items-center gap-2')}>
                    <Input
                      size="small"
                      id={`comment-reply-${comment.id}`}
                      name={`comment-reply-${comment.id}`}
                      value={replyTexts[comment.id] || ''}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))
                      }
                      placeholder={replyPlaceholder}
                      onPressEnter={() => handleAddReply(comment.id)}
                      className="rounded-xl border-slate-200 shadow-sm"
                    />
                    <Button
                      size="small"
                      onClick={() => handleAddReply(comment.id)}
                      disabled={!(replyTexts[comment.id] || '').trim()}
                      className="rounded-full border-slate-200 text-slate-700 shadow-sm"
                    >
                      {replyLabel}
                    </Button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SchemaFieldCommentsWidget;

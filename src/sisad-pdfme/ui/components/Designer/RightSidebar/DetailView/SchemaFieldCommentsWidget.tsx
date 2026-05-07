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
  emptyLabel = 'Sin comentarios en este campo',
  emptyDescription = 'Crea el primer hilo para este campo.',
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

  const comments = normalizeComments((activeSchema as unknown as Record<string, unknown>).comments);

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
    persistComments([...comments, comment as unknown as SchemaComment]);
    setNewCommentText('');
  };

  const resolvedEmptyLabel = resolveText(emptyLabel, 'Sin comentarios en este campo');
  const resolvedEmptyDescription = resolveText(emptyDescription, 'Crea el primer hilo para este campo.');

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
    <div className={cls('field-comments-widget')}>
      {/* New comment input */}
      <div className={cls('field-comments-add')}>
        <Input.TextArea
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder={composerPlaceholder}
          autoSize={{ minRows: 2, maxRows: 4 }}
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
          disabled={!newCommentText.trim()}
          className={cls('field-comments-add-btn')}
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
        <div className={cls('field-comments-list')}>
          {comments.map((comment) => {
            const resolved = Boolean(comment.resolved);
            return (
              <div
                key={comment.id}
                className={`${cls('field-comments-thread')}${resolved ? ' is-resolved' : ''}`}
              >
                {/* Thread header */}
                <div className={cls('field-comments-thread-header')}>
                  <Space size={4} align="center">
                    {actorColor || comment.authorColor ? (
                      <span
                        className={cls('field-comments-author-dot')}
                        style={{ background: comment.authorColor || actorColor }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <span className={cls('field-comments-author-name')}>
                      {comment.authorName || comment.authorId || 'Anónimo'}
                    </span>
                    <span className={cls('field-comments-timestamp')}>
                      {formatTimestamp(comment.timestamp || comment.createdAt)}
                    </span>
                    {resolved ? (
                      <Tag color="success" style={{ margin: 0 }}>
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
                        aria-label="Eliminar hilo de comentarios"
                      />
                    </Tooltip>
                  </Space>
                </div>

                {/* Thread body */}
                <div className={cls('field-comments-thread-body')}>{comment.text}</div>

                {/* Replies */}
                {(comment.replies || []).length > 0 ? (
                  <div className={cls('field-comments-replies')}>
                    {(comment.replies as { id: string; authorName?: string; authorId?: string; authorColor?: string; text: string; timestamp?: number; createdAt?: number }[]).map((reply) => (
                      <div key={reply.id} className={cls('field-comments-reply')}>
                        <Space size={4} align="center">
                          {reply.authorColor ? (
                            <span
                              className={cls('field-comments-author-dot')}
                              style={{ background: reply.authorColor }}
                              aria-hidden="true"
                            />
                          ) : null}
                          <span className={cls('field-comments-author-name')}>
                            {reply.authorName || reply.authorId || 'Anónimo'}
                          </span>
                          <span className={cls('field-comments-timestamp')}>
                            {formatTimestamp(reply.timestamp || reply.createdAt)}
                          </span>
                        </Space>
                        <div className={cls('field-comments-reply-text')}>{reply.text}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Reply input */}
                {!resolved ? (
                  <div className={cls('field-comments-reply-input')}>
                    <Input
                      size="small"
                      value={replyTexts[comment.id] || ''}
                      onChange={(e) =>
                        setReplyTexts((prev) => ({ ...prev, [comment.id]: e.target.value }))
                      }
                      placeholder={replyPlaceholder}
                      onPressEnter={() => handleAddReply(comment.id)}
                    />
                    <Button
                      size="small"
                      onClick={() => handleAddReply(comment.id)}
                      disabled={!(replyTexts[comment.id] || '').trim()}
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

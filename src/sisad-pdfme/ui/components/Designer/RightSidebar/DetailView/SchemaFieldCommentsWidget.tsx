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
import { uuid } from '@sisad-pdfme/ui/helper';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import type { SchemaComment } from '@sisad-pdfme/ui/designerEngine';
import { InspectorEmptyState } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/InspectorPrimitives';
import { asRecord } from '@sisad-pdfme/shared/objectGuards';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { stopInspectorPointerEvent } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards';

/**
 * Props del widget de comentarios por campo del inspector.
 *
 * Este widget trabaja sobre el schema activo y persiste los hilos en la
 * propiedad `comments` mediante `changeSchemas`. No conoce el panel padre,
 * el canvas, Moveable ni Selecto; únicamente emite cambios de datos.
 */
type FieldCommentsWidgetProps = PropPanelWidgetProps & {
  /** Schema actualmente seleccionado en el DetailView. */
  activeSchema: SchemaForUI;

  /**
   * Callback oficial del diseñador para persistir cambios sobre el schema.
   *
   * El widget lo usa exclusivamente con `key: 'comments'`.
   */
  changeSchemas: (_objs: { key: string; value: unknown; schemaId: string }[]) => void;

  /**
   * Información opcional del actor colaborativo actual.
   *
   * Se usa para completar autor, nombre visible y color de nuevos comentarios
   * o respuestas. Si no existe, se usa el actor local.
   */
  designerEngine?: { collaboration?: { actorId?: string; actorName?: string; actorColor?: string } };

  /** Placeholder del composer principal de nuevo comentario. */
  composerPlaceholder?: string;

  /** Texto visible del botón para agregar un comentario. */
  addLabel?: React.ReactNode;

  /** Título del estado vacío. */
  emptyLabel?: React.ReactNode;

  /** Descripción del estado vacío. */
  emptyDescription?: React.ReactNode;

  /** Placeholder del input de respuesta dentro de cada hilo. */
  replyPlaceholder?: string;

  /** Texto visible del botón de respuesta. */
  replyLabel?: React.ReactNode;

  /** Etiqueta usada para hilos resueltos. */
  resolvedLabel?: React.ReactNode;

  /** Etiqueta disponible para hilos abiertos. Reservada para estados futuros. */
  openLabel?: React.ReactNode;
};

/**
 * Normaliza una entrada desconocida a lista de comentarios.
 *
 * Los schemas antiguos o incompletos pueden traer `comments` ausente,
 * nulo o con una forma inválida. En esos casos se devuelve una lista vacía
 * para que el widget pueda renderizar sin fallar.
 */
const normalizeComments = (value: unknown): SchemaComment[] =>
  Array.isArray(value) ? (value as SchemaComment[]) : [];

/**
 * Genera timestamp en milisegundos para comentarios/respuestas creados
 * desde el inspector.
 */
const createTimestamp = () => Date.now();

/**
 * Formateador compacto de fecha/hora para hilos de comentarios.
 *
 * Se mantiene fuera del componente para evitar recrearlo en cada render.
 */
const COMMENT_TIMESTAMP_FORMATTER = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Formatea un timestamp opcional.
 *
 * Devuelve string vacío si el timestamp no es finito o no puede convertirse
 * a una fecha válida.
 */
const formatFieldCommentTimestamp = (ts?: number): string => {
  if (!ts || !Number.isFinite(ts)) return '';

  try {
    return COMMENT_TIMESTAMP_FORMATTER.format(new Date(ts));
  } catch {
    return '';
  }
};

/**
 * Resuelve un texto configurable cuando el valor recibido es un string útil.
 *
 * Si el usuario pasa un nodo React no-string o un string vacío, se usa el
 * fallback para conservar etiquetas seguras dentro de componentes que esperan
 * texto plano.
 */
const resolveText = (value: React.ReactNode, fallback: string) =>
  typeof value === 'string' && value.trim() ? value : fallback;

/**
 * Construye una respuesta de comentario con metadata del actor actual.
 *
 * Las respuestas usan un prefijo `reply-` para distinguirlas visualmente
 * de hilos raíz creados por `createSchemaComment`.
 */
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
 * Widget de comentarios por campo dentro del DetailView.
 *
 * Responsabilidades:
 *
 * - leer `activeSchema.comments`;
 * - crear hilos nuevos asociados al schema activo;
 * - agregar respuestas a un hilo existente;
 * - marcar hilos como resueltos o abiertos;
 * - eliminar hilos;
 * - persistir cambios mediante `changeSchemas`.
 *
 * Restricciones:
 *
 * - no modifica anchors de comentarios;
 * - no posiciona pins en canvas;
 * - no dispara eventos globales;
 * - no toca Moveable, Selecto ni selección del canvas;
 * - no conoce estructura multi-documento más allá del schema activo.
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
  /** Texto local del composer principal de comentario. */
  const [newCommentText, setNewCommentText] = useState('');

  /**
   * Drafts de respuestas por comentario.
   *
   * La key es el `comment.id`; el valor es el texto aún no persistido.
   */
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  /** Actor colaborativo actual con fallback local. */
  const actorId = designerEngine?.collaboration?.actorId || 'local';
  const actorName = designerEngine?.collaboration?.actorName || actorId;
  const actorColor = designerEngine?.collaboration?.actorColor;

  /** Comentarios normalizados desde el schema activo. */
  const comments = normalizeComments(asRecord(activeSchema)?.comments);

  /**
   * Persiste la lista completa de comentarios sobre el schema activo.
   *
   * Mantiene una única ruta de escritura para altas, bajas, respuestas
   * y cambios de estado.
   */
  const persistComments = (next: SchemaComment[]) => {
    changeSchemas([{ key: 'comments', value: next, schemaId: activeSchema.id }]);
  };

  /** Crea un hilo raíz nuevo si el composer tiene texto válido. */
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

  /** Cambia el estado resuelto/abierto de un hilo existente. */
  const handleResolveToggle = (commentId: string, resolved: boolean) => {
    const next = comments.map((c) => (c.id === commentId ? { ...c, resolved } : c));
    persistComments(next);
  };

  /** Elimina un hilo completo por ID. */
  const handleDeleteComment = (commentId: string) => {
    persistComments(removeById(comments, commentId));
  };

  /** Agrega una respuesta a un hilo existente. */
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

  /** Helper local para construir clases BEM/prefijadas del diseñador. */
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
      {/** Composer principal para crear un hilo raíz. */}
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

      {/** Lista de hilos o estado vacío cuando el campo no tiene comentarios. */}
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
                {/** Header del hilo: autor, fecha, estado y acciones. */}
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
                      {formatFieldCommentTimestamp(comment.timestamp || comment.createdAt)}
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

                {/** Texto principal del comentario raíz. */}
                <div className={mergeClassNames(cls('field-comments-thread-body'), 'text-sm leading-6 text-slate-700')}>{comment.text}</div>

                {/** Respuestas del hilo, si existen. */}
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
                            {formatFieldCommentTimestamp(reply.timestamp || reply.createdAt)}
                          </span>
                        </Space>
                        <div className={mergeClassNames(cls('field-comments-reply-text'), 'text-sm leading-6 text-slate-700')}>{reply.text}</div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/** Composer de respuesta. Solo se muestra si el hilo sigue abierto. */}
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

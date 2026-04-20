import React, { useMemo } from 'react';
import type { PropPanelWidgetProps, SchemaForUI } from '@sisad-pdfme/common';
import { Button, Divider, Input, InputNumber, Select, Space, Switch, Tag } from 'antd';
import { Lock, ShieldCheck, Users2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import {
  resolveSchemaCollaborativeMetadata,
  type DesignerEngine,
  type SchemaComment,
  type SchemaCommentAnchor,
  type SchemaCollaborativeState,
  type SchemaDesignerConfig,
} from '../../../../designerEngine.js';

type CollaborationWidgetProps = PropPanelWidgetProps & {
  activeSchema: SchemaForUI;
  changeSchemas: (_objs: { key: string; value: unknown; schemaId: string }[]) => void;
  designerEngine?: DesignerEngine;
  schemaConfig?: SchemaDesignerConfig | null;
};

const STATE_OPTIONS: Array<{ label: string; value: SchemaCollaborativeState }> = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Bloqueado', value: 'locked' },
  { label: 'Fusionado', value: 'merged' },
];

const normalizeRecipientIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value
          .map((entry) => String(entry || '').trim())
          .filter(Boolean),
      ),
    );
  }

  if (typeof value === 'string') {
    return Array.from(
      new Set(
        value
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean),
      ),
    );
  }

  return [];
};

const joinRecipientIds = (value: unknown): string => normalizeRecipientIds(value).join(', ');

const createId = (prefix: string) =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const normalizeComments = (value: unknown): SchemaComment[] =>
  Array.isArray(value)
    ? (value as SchemaComment[])
    : [];

const normalizeAnchors = (value: unknown): SchemaCommentAnchor[] =>
  Array.isArray(value)
    ? (value as SchemaCommentAnchor[])
    : [];

const createComment = (): SchemaComment => ({
  id: createId('comment'),
  authorId: '',
  authorName: '',
  timestamp: Date.now(),
  text: '',
  resolved: false,
  replies: [],
});

const createAnchor = (schemaUid?: string, fileId?: string | null, pageNumber?: number): SchemaCommentAnchor => ({
  id: createId('anchor'),
  schemaUid,
  fileId: fileId || undefined,
  pageNumber,
  x: 0,
  y: 0,
  resolved: false,
});

const buildStateTag = (state?: SchemaCollaborativeState) => {
  if (state === 'locked') return { label: 'Bloqueado', color: 'error' as const };
  if (state === 'merged') return { label: 'Fusionado', color: 'success' as const };
  return { label: 'Borrador', color: 'default' as const };
};

const SchemaCollaborationWidget = (props: CollaborationWidgetProps) => {
  const { activeSchema, changeSchemas, designerEngine } = props;
  const collaborative = useMemo(
    () => resolveSchemaCollaborativeMetadata(activeSchema, designerEngine) || {},
    [activeSchema, designerEngine],
  );

  const schemaUid = collaborative.schemaUid || activeSchema.id;
  const state = collaborative.state || 'draft';
  const ownerRecipientIds = normalizeRecipientIds(
    collaborative.ownerRecipientIds || collaborative.ownerRecipientId || activeSchema.ownerRecipientIds || activeSchema.ownerRecipientId,
  );
  const lock = collaborative.lock || activeSchema.lock || {};
  const comments = normalizeComments(activeSchema.comments || collaborative.comments);
  const anchors = normalizeAnchors(
    activeSchema.commentAnchors || activeSchema.commentsAnchors || collaborative.commentAnchors || collaborative.commentsAnchors,
  );
  const stateTag = buildStateTag(state);

  const commit = (patch: Record<string, unknown>) => {
    changeSchemas(
      Object.entries(patch).map(([key, value]) => ({
        key,
        value,
        schemaId: activeSchema.id,
      })),
    );
  };

  const updateRecipientIds = (value: string) => {
    const nextRecipientIds = normalizeRecipientIds(value);
    commit({
      ownerRecipientIds: nextRecipientIds,
      ownerRecipientId: nextRecipientIds[0],
    });
  };

  const updateState = (nextState: SchemaCollaborativeState) => {
    commit({
      state: nextState,
      lock: nextState === 'locked' ? lock || {} : undefined,
    });
  };

  const hasLock = state === 'locked' || Boolean(lock?.lockedBy || lock?.lockedAt || lock?.reason);
  const updateComments = (nextComments: SchemaComment[]) => {
    commit({
      comments: nextComments,
    });
  };

  const updateAnchors = (nextAnchors: SchemaCommentAnchor[]) => {
    commit({
      commentAnchors: nextAnchors,
      commentsAnchors: nextAnchors,
    });
  };

  const updateComment = (commentIndex: number, patch: Partial<SchemaComment>) => {
    updateComments(
      comments.map((comment, index) => (index === commentIndex ? { ...comment, ...patch } : comment)),
    );
  };

  const updateReply = (
    commentIndex: number,
    replyIndex: number,
    patch: Partial<NonNullable<SchemaComment['replies']>[number]>,
  ) => {
    updateComments(
      comments.map((comment, index) => {
        if (index !== commentIndex) return comment;
        const replies = Array.isArray(comment.replies) ? comment.replies : [];
        return {
          ...comment,
          replies: replies.map((reply, replyIdx) => (replyIdx === replyIndex ? { ...reply, ...patch } : reply)),
        };
      }),
    );
  };

  return (
    <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget`}>
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-head`}>
        <div>
          <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`}>Colaboración</div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>
            Identidad estable, propietario y bloqueo del campo para trabajo multiusuario.
          </div>
        </div>
        <Tag color={stateTag.color} icon={<ShieldCheck size={13} />}>
          {stateTag.label}
        </Tag>
      </div>

      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-summary`}>
        <Space size={[6, 6]} wrap>
          <Tag color="default">{schemaUid || 'sin schemaUid'}</Tag>
          <Tag color={ownerRecipientIds.length > 0 ? 'processing' : 'warning'} icon={<Users2 size={12} />}>
            {ownerRecipientIds.length > 0 ? `${ownerRecipientIds.length} owner(s)` : 'Sin owner'}
          </Tag>
          {hasLock ? (
            <Tag color="error" icon={<Lock size={12} />}>
              Bloqueo activo
            </Tag>
          ) : null}
        </Space>
      </div>

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />

      <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>schemaUid</div>
          <Input value={schemaUid || ''} disabled placeholder="UUID estable del campo" />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Archivo</div>
          <Input
            value={String(activeSchema.fileId || activeSchema.fileTemplateId || collaborative.fileId || collaborative.fileTemplateId || '')}
            onChange={(event) => commit({
              fileId: event.target.value || undefined,
              fileTemplateId: event.target.value || undefined,
            })}
            placeholder="file-01"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Página</div>
          <InputNumber
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            min={1}
            value={typeof activeSchema.pageNumber === 'number' ? activeSchema.pageNumber : collaborative.pageNumber}
            onChange={(value) => commit({ pageNumber: typeof value === 'number' ? value : undefined })}
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Estado</div>
          <Select
            value={state}
            options={STATE_OPTIONS}
            onChange={(value) => updateState(value)}
          />
        </div>
      </div>

      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Owner principal</div>
        <Input
          value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || ''}
          onChange={(event) => commit({ ownerRecipientId: event.target.value || undefined })}
          placeholder="recipient-1"
        />
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Co-propietarios</div>
        <Input
          value={joinRecipientIds(ownerRecipientIds)}
          onChange={(event) => updateRecipientIds(event.target.value)}
          placeholder="recipient-1, recipient-2"
        />
      </div>

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />

      <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Creado por</div>
          <Input
            value={activeSchema.createdBy || collaborative.createdBy || ''}
            onChange={(event) => commit({ createdBy: event.target.value || undefined })}
            placeholder="user-1"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Modificado por</div>
          <Input
            value={activeSchema.lastModifiedBy || collaborative.lastModifiedBy || ''}
            onChange={(event) => commit({ lastModifiedBy: event.target.value || undefined })}
            placeholder="user-1"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Creado</div>
          <InputNumber
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            value={typeof activeSchema.createdAt === 'number' ? activeSchema.createdAt : collaborative.createdAt}
            onChange={(value) => commit({ createdAt: typeof value === 'number' ? value : undefined })}
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Actualizado</div>
          <InputNumber
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            value={typeof activeSchema.updatedAt === 'number' ? activeSchema.updatedAt : collaborative.updatedAt}
            onChange={(value) => commit({ updatedAt: typeof value === 'number' ? value : undefined })}
          />
        </div>
      </div>

      {hasLock ? (
        <>
          <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
          <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado por</div>
              <Input
                value={String(lock?.lockedBy || '')}
                onChange={(event) => commit({ lock: { ...(lock || {}), lockedBy: event.target.value || undefined } })}
                placeholder="user-2"
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado en</div>
              <InputNumber
                className={`${DESIGNER_CLASSNAME}schema-config-number`}
                value={typeof lock?.lockedAt === 'number' ? lock.lockedAt : undefined}
                onChange={(value) => commit({ lock: { ...(lock || {}), lockedAt: typeof value === 'number' ? value : undefined } })}
              />
            </div>
          </div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Motivo</div>
            <Input.TextArea
              value={String(lock?.reason || '')}
              onChange={(event) => commit({ lock: { ...(lock || {}), reason: event.target.value || undefined } })}
              placeholder="Edición concurrente"
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </div>
        </>
      ) : null}

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comments-head`}>
        <div>
          <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`}>Comentarios</div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>
            Hilos persistibles por campo y anotaciones básicas para sincronización futura.
          </div>
        </div>
        <Button size="small" type="primary" onClick={() => updateComments([...comments, createComment()])}>
          Agregar comentario
        </Button>
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comments-list`}>
        {comments.length === 0 ? (
          <div className={`${DESIGNER_CLASSNAME}schema-config-empty`}>Sin comentarios</div>
        ) : null}
        {comments.map((comment, commentIndex) => (
          <div key={comment.id} className={`${DESIGNER_CLASSNAME}schema-collaboration-comment-card`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Autor</div>
                <Input
                  value={comment.authorName || ''}
                  onChange={(event) => updateComment(commentIndex, { authorName: event.target.value })}
                  placeholder="Nombre del autor"
                />
              </div>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>ID autor</div>
                <Input
                  value={comment.authorId || ''}
                  onChange={(event) => updateComment(commentIndex, { authorId: event.target.value })}
                  placeholder="user-1"
                />
              </div>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Timestamp</div>
                <InputNumber
                  className={`${DESIGNER_CLASSNAME}schema-config-number`}
                  value={comment.timestamp}
                  onChange={(value) => updateComment(commentIndex, { timestamp: typeof value === 'number' ? value : Date.now() })}
                />
              </div>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Resuelto</div>
                <Switch
                  checked={Boolean(comment.resolved)}
                  onChange={(checked) => updateComment(commentIndex, { resolved: checked })}
                />
              </div>
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Texto</div>
              <Input.TextArea
                value={comment.text}
                onChange={(event) => updateComment(commentIndex, { text: event.target.value })}
                placeholder="Escribe un comentario"
                autoSize={{ minRows: 2, maxRows: 5 }}
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comment-actions`}>
              <Button
                size="small"
                onClick={() =>
                  updateComment(commentIndex, {
                    replies: [...(comment.replies || []), {
                      id: createId('reply'),
                      authorId: '',
                      authorName: '',
                      timestamp: Date.now(),
                      text: '',
                      resolved: false,
                    }],
                  })
                }
              >
                Agregar respuesta
              </Button>
              <Button
                size="small"
                danger
                onClick={() => updateComments(comments.filter((_, index) => index !== commentIndex))}
              >
                Eliminar
              </Button>
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comment-replies`}>
              {(comment.replies || []).map((reply, replyIndex) => (
                <div key={reply.id} className={`${DESIGNER_CLASSNAME}schema-collaboration-comment-reply`}>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Autor</div>
                      <Input
                        value={reply.authorName || ''}
                        onChange={(event) => updateReply(commentIndex, replyIndex, { authorName: event.target.value })}
                        placeholder="Nombre"
                      />
                    </div>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Resuelto</div>
                      <Switch
                        checked={Boolean(reply.resolved)}
                        onChange={(checked) => updateReply(commentIndex, replyIndex, { resolved: checked })}
                      />
                    </div>
                  </div>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Respuesta</div>
                    <Input.TextArea
                      value={reply.text}
                      onChange={(event) => updateReply(commentIndex, replyIndex, { text: event.target.value })}
                      autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comments-head`}>
        <div>
          <div className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`}>Anchors</div>
          <div className={`${DESIGNER_CLASSNAME}schema-config-help`}>
            Marcadores para comentarios globales o posicionados en el documento.
          </div>
        </div>
        <Button
          size="small"
          onClick={() => updateAnchors([...anchors, createAnchor(schemaUid, activeSchema.fileId || collaborative.fileId, activeSchema.pageNumber || collaborative.pageNumber)])}
        >
          Agregar anchor
        </Button>
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comments-list`}>
        {anchors.length === 0 ? (
          <div className={`${DESIGNER_CLASSNAME}schema-config-empty`}>Sin anchors</div>
        ) : null}
        {anchors.map((anchor, anchorIndex) => (
          <div key={anchor.id} className={`${DESIGNER_CLASSNAME}schema-collaboration-comment-card`}>
            <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>fileId</div>
                <Input
                  value={anchor.fileId || ''}
                  onChange={(event) =>
                    updateAnchors(
                      anchors.map((item, index) =>
                        index === anchorIndex ? { ...item, fileId: event.target.value || undefined } : item,
                      ),
                    )
                  }
                />
              </div>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>pageNumber</div>
                <InputNumber
                  className={`${DESIGNER_CLASSNAME}schema-config-number`}
                  min={1}
                  value={anchor.pageNumber}
                  onChange={(value) =>
                    updateAnchors(
                      anchors.map((item, index) =>
                        index === anchorIndex
                          ? { ...item, pageNumber: typeof value === 'number' ? value : undefined }
                          : item,
                      ),
                    )
                  }
                />
              </div>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>x</div>
                <InputNumber
                  className={`${DESIGNER_CLASSNAME}schema-config-number`}
                  value={anchor.x}
                  onChange={(value) =>
                    updateAnchors(
                      anchors.map((item, index) =>
                        index === anchorIndex ? { ...item, x: typeof value === 'number' ? value : undefined } : item,
                      ),
                    )
                  }
                />
              </div>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>y</div>
                <InputNumber
                  className={`${DESIGNER_CLASSNAME}schema-config-number`}
                  value={anchor.y}
                  onChange={(value) =>
                    updateAnchors(
                      anchors.map((item, index) =>
                        index === anchorIndex ? { ...item, y: typeof value === 'number' ? value : undefined } : item,
                      ),
                    )
                  }
                />
              </div>
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
              <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Resuelto</div>
              <Switch
                checked={Boolean(anchor.resolved)}
                onChange={(checked) =>
                  updateAnchors(
                    anchors.map((item, index) => (index === anchorIndex ? { ...item, resolved: checked } : item)),
                  )
                }
              />
            </div>
            <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comment-actions`}>
              <Button
                size="small"
                danger
                onClick={() => updateAnchors(anchors.filter((_, index) => index !== anchorIndex))}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchemaCollaborationWidget;

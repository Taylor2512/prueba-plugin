import React, { useMemo } from 'react';
import {
  createSchemaComment,
  createSchemaCommentAnchor,
  normalizeRecipientIds as normalizeRecipientIdsShared,
  removeById,
  type PropPanelWidgetProps,
  type SchemaForUI,
} from '@sisad-pdfme/common';
import { Button, Collapse, Divider, Input, InputNumber, Select, Space, Switch, Tag } from 'antd';
import { Lock, ShieldCheck, Users2 } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import {
  buildEffectiveCollaborationContext,
  resolveSchemaCollaborationState,
} from '../../../../collaborationContext.js';
import {
  resolveSchemaCollaborativeMetadata,
  type DesignerEngine,
  type SchemaComment,
  type SchemaCommentAnchor,
  type SchemaCollaborativeLock,
  type SchemaCollaborativeState,
} from '../../../../designerEngine.js';

type CollaborationWidgetProps = PropPanelWidgetProps & {
  activeSchema: SchemaForUI;
  changeSchemas: (_objs: { key: string; value: unknown; schemaId: string }[]) => void;
  designerEngine?: DesignerEngine;
};

const STATE_OPTIONS: Array<{ label: string; value: SchemaCollaborativeState }> = [
  { label: 'Borrador', value: 'draft' },
  { label: 'Bloqueado', value: 'locked' },
  { label: 'Fusionado', value: 'merged' },
];

export { normalizeRecipientIds } from '@sisad-pdfme/common';

export const joinRecipientIds = (value: unknown): string =>
  normalizeRecipientIdsShared(value as string[] | string | null | undefined).join(', ');

const normalizeComments = (value: unknown): SchemaComment[] =>
  Array.isArray(value)
    ? (value as SchemaComment[])
    : [];

const normalizeAnchors = (value: unknown): SchemaCommentAnchor[] =>
  Array.isArray(value)
    ? (value as SchemaCommentAnchor[])
    : [];

const buildStateTag = (state?: SchemaCollaborativeState) => {
  if (state === 'locked') return { label: 'Bloqueado', color: 'error' as const };
  if (state === 'merged') return { label: 'Fusionado', color: 'success' as const };
  return { label: 'Borrador', color: 'default' as const };
};

export const resolveOwnerMode = (ownerRecipientIds: string[]) => {
  if (ownerRecipientIds.length > 1) return 'multi' as const;
  if (ownerRecipientIds.length === 1) return 'single' as const;
  return undefined;
};

type CollaborationCommentsSectionProps = {
  comments: SchemaComment[];
  commentCount: number;
  onAddComment: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onUpdateComment: (commentIndex: number, patch: Partial<SchemaComment>) => void;
  onUpdateReply: (
    commentIndex: number,
    replyIndex: number,
    patch: Partial<NonNullable<SchemaComment['replies']>[number]>,
  ) => void;
  onDeleteComment: (commentIndex: number) => void;
};

const CollaborationCommentsSection = ({
  comments,
  commentCount,
  onAddComment,
  onUpdateComment,
  onUpdateReply,
  onDeleteComment,
}: CollaborationCommentsSectionProps) => (
  <Collapse
    className={`${DESIGNER_CLASSNAME}schema-config-collapse`}
    ghost
    defaultActiveKey={commentCount === 0 ? ['comments'] : []}
    items={[
      {
        key: 'comments',
        label: (
          <Space size={6} align="center">
            <span className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`}>Comentarios</span>
            <Tag color={commentCount > 0 ? 'blue' : 'default'}>{commentCount}</Tag>
          </Space>
        ),
        extra: (
          <Button size="small" type="primary" onClick={onAddComment}>
            Agregar comentario
          </Button>
        ),
        children: (
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
                      onChange={(event) => onUpdateComment(commentIndex, { authorName: event.target.value })}
                      placeholder="Nombre del autor"
                    />
                  </div>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>ID autor</div>
                    <Input
                      value={comment.authorId || ''}
                      onChange={(event) => onUpdateComment(commentIndex, { authorId: event.target.value })}
                      placeholder="user-1"
                    />
                  </div>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Timestamp</div>
                    <InputNumber
                      className={`${DESIGNER_CLASSNAME}schema-config-number`}
                      value={comment.timestamp}
                      onChange={(value) => onUpdateComment(commentIndex, { timestamp: typeof value === 'number' ? value : Date.now() })}
                    />
                  </div>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                    <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Resuelto</div>
                    <Switch
                      checked={Boolean(comment.resolved)}
                      onChange={(checked) => onUpdateComment(commentIndex, { resolved: checked })}
                    />
                  </div>
                </div>
                <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                  <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Texto</div>
                  <Input.TextArea
                    value={comment.text}
                    onChange={(event) => onUpdateComment(commentIndex, { text: event.target.value })}
                    placeholder="Escribe un comentario"
                    autoSize={{ minRows: 2, maxRows: 5 }}
                  />
                </div>
                <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comment-actions`}>
                  <Button
                    size="small"
                    onClick={() =>
                      onUpdateComment(commentIndex, {
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
                  <Button size="small" danger onClick={() => onDeleteComment(commentIndex)}>
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
                            onChange={(event) => onUpdateReply(commentIndex, replyIndex, { authorName: event.target.value })}
                            placeholder="Nombre"
                          />
                        </div>
                        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Resuelto</div>
                          <Switch
                            checked={Boolean(reply.resolved)}
                            onChange={(checked) => onUpdateReply(commentIndex, replyIndex, { resolved: checked })}
                          />
                        </div>
                      </div>
                      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
                        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Respuesta</div>
                        <Input.TextArea
                          value={reply.text}
                          onChange={(event) => onUpdateReply(commentIndex, replyIndex, { text: event.target.value })}
                          autoSize={{ minRows: 2, maxRows: 4 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ]}
  />
);

type CollaborationAnchorsSectionProps = {
  anchors: SchemaCommentAnchor[];
  anchorCount: number;
  onAddAnchor: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onDeleteAnchor: (anchorIndex: number) => void;
  onUpdateAnchors: (nextAnchors: SchemaCommentAnchor[]) => void;
};

const CollaborationAnchorsSection = ({
  anchors,
  anchorCount,
  onAddAnchor,
  onDeleteAnchor,
  onUpdateAnchors,
}: CollaborationAnchorsSectionProps) => (
  <Collapse
    className={`${DESIGNER_CLASSNAME}schema-config-collapse`}
    ghost
    defaultActiveKey={anchorCount === 0 ? ['anchors'] : []}
    items={[
      {
        key: 'anchors',
        label: (
          <Space size={6} align="center">
            <span className={`${DESIGNER_CLASSNAME}schema-collaboration-widget-title`}>Anchors</span>
            <Tag color={anchorCount > 0 ? 'cyan' : 'default'}>{anchorCount}</Tag>
          </Space>
        ),
        extra: (
          <Button size="small" onClick={onAddAnchor}>
            Agregar anchor
          </Button>
        ),
        children: (
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
                        onUpdateAnchors(
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
                        onUpdateAnchors(
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
                        onUpdateAnchors(
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
                        onUpdateAnchors(
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
                      onUpdateAnchors(
                        anchors.map((item, index) => (index === anchorIndex ? { ...item, resolved: checked } : item)),
                      )
                    }
                  />
                </div>
                <div className={`${DESIGNER_CLASSNAME}schema-collaboration-comment-actions`}>
                  <Button size="small" danger onClick={() => onDeleteAnchor(anchorIndex)}>
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ),
      },
    ]}
  />
);

type CollaborationLockSectionProps = {
  isVisible: boolean;
  lock?: SchemaCollaborativeLock;
  onChangeLock: (patch: Partial<SchemaCollaborativeLock>) => void;
};

const CollaborationLockSection = ({ isVisible, lock, onChangeLock }: CollaborationLockSectionProps) => {
  if (!isVisible) return null;

  return (
    <>
      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
      <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado por</div>
          <Input
            value={String(lock?.lockedBy || '')}
            onChange={(event) => onChangeLock({ ...lock, lockedBy: event.target.value || undefined })}
            placeholder="user-2"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Bloqueado en</div>
          <InputNumber
            className={`${DESIGNER_CLASSNAME}schema-config-number`}
            value={typeof lock?.lockedAt === 'number' ? lock.lockedAt : undefined}
            onChange={(value) => onChangeLock({ ...lock, lockedAt: typeof value === 'number' ? value : undefined })}
          />
        </div>
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Motivo</div>
        <Input.TextArea
          value={String(lock?.reason || '')}
          onChange={(event) => onChangeLock({ ...lock, reason: event.target.value || undefined })}
          placeholder="Edición concurrente"
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      </div>
    </>
  );
};

const SchemaCollaborationWidget = (props: CollaborationWidgetProps) => {
  const { activeSchema, changeSchemas, designerEngine } = props;
  const collaborative = useMemo(
    () => resolveSchemaCollaborativeMetadata(activeSchema, designerEngine) || {},
    [activeSchema, designerEngine],
  );
  const collaborationContext = useMemo(
    () =>
      buildEffectiveCollaborationContext(
        designerEngine?.collaboration,
        String(activeSchema.fileId || collaborative.fileId || activeSchema.fileTemplateId || collaborative.fileTemplateId || '') || null,
      ),
    [
      activeSchema.fileId,
      activeSchema.fileTemplateId,
      collaborative.fileId,
      collaborative.fileTemplateId,
      designerEngine,
    ],
  );

  const schemaUid = collaborative.schemaUid || activeSchema.id;
  const state = collaborative.state || 'draft';
  const ownerRecipientIds = normalizeRecipientIdsShared(
    collaborative.ownerRecipientIds || collaborative.ownerRecipientId || activeSchema.ownerRecipientIds || activeSchema.ownerRecipientId,
  );
  const resolvedSchemaState = resolveSchemaCollaborationState(activeSchema, collaborationContext);
  const ownerMode = collaborative.ownerMode || resolvedSchemaState.ownerMode || resolveOwnerMode(ownerRecipientIds);
  const lock = collaborative.lock || activeSchema.lock;
  const comments = normalizeComments(activeSchema.comments || collaborative.comments);
  const anchors = normalizeAnchors(
    activeSchema.commentAnchors || activeSchema.commentsAnchors || collaborative.commentAnchors || collaborative.commentsAnchors,
  );
  const commentCount = typeof collaborative.commentsCount === 'number' ? collaborative.commentsCount : comments.length;
  const anchorCount = anchors.length;
  const stateTag = buildStateTag(state);
  const recipientOptions = collaborationContext.recipientOptions || [];
  const hasRecipientOptions = recipientOptions.length > 0;
  const recipientSelectOptions = recipientOptions.map((recipient) => ({
    label: recipient.role ? `${recipient.name} · ${recipient.role}` : recipient.name,
    value: recipient.id,
  }));

  const commit = (patch: Record<string, unknown>) => {
    changeSchemas(
      Object.entries(patch).map(([key, value]) => ({
        key,
        value,
        schemaId: activeSchema.id,
      })),
    );
  };

  const updateRecipientIds = (value: string[] | string) => {
    const nextRecipientIds = normalizeRecipientIdsShared(value as string[] | string | null | undefined);
    const nextPrimaryRecipientId = nextRecipientIds[0];
    const nextPrimaryRecipient =
      recipientOptions.find((recipient) => recipient.id === nextPrimaryRecipientId) || null;
    const nextOwnerMode =
      nextRecipientIds.length === 0
        ? undefined
        : nextRecipientIds.length === recipientOptions.length && recipientOptions.length > 1
          ? 'shared'
          : resolveOwnerMode(nextRecipientIds);
    commit({
      ownerRecipientIds: nextRecipientIds,
      ownerRecipientId: nextPrimaryRecipientId,
      ownerRecipientName: nextPrimaryRecipient?.name || undefined,
      ownerColor: nextPrimaryRecipient?.color || undefined,
      ownerMode: nextOwnerMode,
    });
  };

  const updateState = (nextState: SchemaCollaborativeState) => {
    commit({
      state: nextState,
      lock: nextState === 'locked' ? { ...lock } : undefined,
    });
  };

  const hasLock = state === 'locked' || Boolean(lock?.lockedBy || lock?.lockedAt || lock?.reason);
  const updateComments = (nextComments: SchemaComment[]) => {
    commit({
      comments: nextComments,
      commentsCount: nextComments.length,
    });
  };

  const updateAnchors = (nextAnchors: SchemaCommentAnchor[]) => {
    commit({
      commentAnchors: nextAnchors,
      commentsAnchors: nextAnchors,
    });
  };

  const handleAddComment = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    updateComments([
      ...comments,
      createSchemaComment('', {
        authorId: collaborationContext.activeRecipientId || collaborative.createdBy || activeSchema.createdBy,
        authorName: collaborationContext.activeRecipient?.name || resolvedOwnerLabel,
        authorColor: effectiveAuthorColor || null,
      }),
    ]);
  };

  const handleAddAnchor = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    updateAnchors([
      ...anchors,
      createSchemaCommentAnchor(
        {
          schemaUid,
          fileId: activeSchema.fileId || collaborative.fileId,
          pageNumber: activeSchema.pageNumber || collaborative.pageNumber,
          x: 0,
          y: 0,
        },
        {
          authorId: collaborationContext.activeRecipientId || collaborative.createdBy || activeSchema.createdBy,
          authorColor: effectiveAuthorColor || null,
        },
      ),
    ]);
  };

  const authorOptions = recipientSelectOptions;
  const resolvedOwnerLabel =
    resolvedSchemaState.ownerRecipientName ||
    collaborationContext.recipientNameMap.get(resolvedSchemaState.ownerRecipientId || '') ||
    resolvedSchemaState.ownerRecipientId ||
    'Sin owner';
  const effectiveAuthorColor = resolvedSchemaState.userColor || resolvedSchemaState.ownerColor || undefined;

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
          {ownerMode ? <Tag color="default">Owner {ownerMode}</Tag> : null}
          <Tag
            color={resolvedSchemaState.isShared ? 'purple' : resolvedSchemaState.isOwnerOther ? 'gold' : 'processing'}
          >
            {resolvedSchemaState.isShared
              ? 'Compartido'
              : resolvedSchemaState.isOwnerOther
                ? 'Pertenece a otro usuario'
                : resolvedSchemaState.isOwnerActive
                  ? 'Owner activo'
                  : resolvedOwnerLabel}
          </Tag>
          <Tag color={ownerRecipientIds.length > 0 ? 'processing' : 'warning'} icon={<Users2 size={12} />}>
            {ownerRecipientIds.length > 0 ? `${ownerRecipientIds.length} owner(s)` : 'Sin owner'}
          </Tag>
          {effectiveAuthorColor ? (
            <Tag color="default" style={{ borderColor: effectiveAuthorColor, color: effectiveAuthorColor }}>
              Autor {resolvedSchemaState.createdBy || 'sin asignar'}
            </Tag>
          ) : null}
          <Tag color={collaborative.saveValue === false || activeSchema.saveValue === false ? 'warning' : 'success'}>
            {collaborative.saveValue === false || activeSchema.saveValue === false ? 'No guardar valor' : 'Guardar valor'}
          </Tag>
          {commentCount > 0 ? <Tag color="blue">Comentarios: {commentCount}</Tag> : null}
          {anchorCount > 0 ? <Tag color="cyan">Anchors: {anchorCount}</Tag> : null}
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
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>ownerMode</div>
          <Input
            value={ownerMode || ''}
            onChange={(event) => commit({ ownerMode: event.target.value || undefined })}
            placeholder="single / multi / shared"
          />
        </div>
      </div>

      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Owner principal</div>
        {hasRecipientOptions ? (
          <Select
            value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || undefined}
            options={recipientSelectOptions}
            onChange={(value) => updateRecipientIds([value])}
            placeholder="Selecciona un owner"
            allowClear
            onClear={() => updateRecipientIds([])}
          />
        ) : (
          <Input
            value={activeSchema.ownerRecipientId || collaborative.ownerRecipientId || ''}
            onChange={(event) => commit({ ownerRecipientId: event.target.value || undefined })}
            placeholder="recipient-1"
          />
        )}
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Co-propietarios</div>
        {hasRecipientOptions ? (
          <Select
            mode="multiple"
            value={ownerRecipientIds}
            options={recipientSelectOptions}
            onChange={(value) => updateRecipientIds(value)}
            placeholder="Selecciona owners"
          />
        ) : (
          <Input
            value={joinRecipientIds(ownerRecipientIds)}
            onChange={(event) => updateRecipientIds(event.target.value)}
            placeholder="recipient-1, recipient-2"
          />
        )}
      </div>
      <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Owner visible</div>
        <Input
          value={resolvedOwnerLabel}
          onChange={(event) => commit({ ownerRecipientName: event.target.value || undefined })}
          placeholder="Nombre visible del owner"
        />
      </div>

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />

      <div className={`${DESIGNER_CLASSNAME}schema-config-grid-2`}>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Creado por</div>
          {hasRecipientOptions ? (
            <Select
              value={activeSchema.createdBy || collaborative.createdBy || undefined}
              options={authorOptions}
              onChange={(value) => {
                const nextAuthor = recipientOptions.find((recipient) => recipient.id === value) || null;
                commit({
                  createdBy: value || undefined,
                  userColor: nextAuthor?.color || collaborative.userColor || undefined,
                });
              }}
              placeholder="Selecciona autor"
              allowClear
            />
          ) : (
            <Input
              value={activeSchema.createdBy || collaborative.createdBy || ''}
              onChange={(event) => commit({ createdBy: event.target.value || undefined })}
              placeholder="user-1"
            />
          )}
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Modificado por</div>
          {hasRecipientOptions ? (
            <Select
              value={activeSchema.lastModifiedBy || collaborative.lastModifiedBy || undefined}
              options={authorOptions}
              onChange={(value) => commit({ lastModifiedBy: value || undefined })}
              placeholder="Selecciona editor"
              allowClear
            />
          ) : (
            <Input
              value={activeSchema.lastModifiedBy || collaborative.lastModifiedBy || ''}
              onChange={(event) => commit({ lastModifiedBy: event.target.value || undefined })}
              placeholder="user-1"
            />
          )}
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
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Color owner</div>
          <Input
            value={activeSchema.ownerColor || collaborative.ownerColor || resolvedSchemaState.ownerColor || ''}
            onChange={(event) => commit({ ownerColor: event.target.value || undefined })}
            placeholder="#2563EB"
          />
        </div>
        <div className={`${DESIGNER_CLASSNAME}schema-config-field`}>
          <div className={`${DESIGNER_CLASSNAME}schema-config-field-label`}>Color autor</div>
          <Input
            value={activeSchema.userColor || collaborative.userColor || resolvedSchemaState.userColor || ''}
            onChange={(event) => commit({ userColor: event.target.value || undefined })}
            placeholder="#2563EB"
          />
        </div>
      </div>

      <CollaborationLockSection
        isVisible={hasLock}
        lock={lock}
        onChangeLock={(patch) => commit({ lock: patch })}
      />

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
      <CollaborationCommentsSection
        comments={comments}
        commentCount={commentCount}
        onAddComment={handleAddComment}
        onUpdateComment={updateComment}
        onUpdateReply={updateReply}
        onDeleteComment={(commentIndex) => updateComments(removeById(comments, comments[commentIndex]?.id || ''))}
      />

      <Divider className={`${DESIGNER_CLASSNAME}schema-config-divider`} />
      <CollaborationAnchorsSection
        anchors={anchors}
        anchorCount={anchorCount}
        onAddAnchor={handleAddAnchor}
        onDeleteAnchor={(anchorIndex) => updateAnchors(removeById(anchors, anchors[anchorIndex]?.id || ''))}
        onUpdateAnchors={updateAnchors}
      />
    </div>
  );
};

export default SchemaCollaborationWidget;

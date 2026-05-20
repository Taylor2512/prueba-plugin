import {
  ChangeSchemas,
  cloneDeep,
  SchemaForUI,
  Size,
  type Command,
} from '@sisad-pdfme/common';
import { message } from 'antd';
import { round } from '../../../helper.js';
import type { EffectiveCollaborationContext } from '../../../collaborationContext.js';
import { duplicateSchemas } from './schemaClipboard.js';
export type AlignType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

export type DistributeType = 'vertical' | 'horizontal';

export type DeleteSchemasOptions = {
  origin?: 'keyboard' | 'toolbar' | 'context-menu' | 'field-list' | 'command';
  clearSelection?: boolean;
};

export const INLINE_EDIT_REQUEST_EVENT = 'sisad-pdfme-designer-inline-edit-request';

export type InlineEditTarget = 'content' | 'name';

export type InlineEditRequest = {
  schemaId: string;
  target: InlineEditTarget;
};

type InlineEditRequestHandler = (_request: InlineEditRequest) => void;

let inlineEditRequestHandler: InlineEditRequestHandler | null = null;

export const setInlineEditRequestHandler = (handler: InlineEditRequestHandler | null) => {
  inlineEditRequestHandler = handler;
  return () => {
    if (inlineEditRequestHandler === handler) {
      inlineEditRequestHandler = null;
    }
  };
};

export const emitInlineEditRequest = (request: InlineEditRequest) => {
  inlineEditRequestHandler?.(request);
};

export type SelectionCommandSet = {
  canEditStructure?: boolean;
  deleteSelection: () => boolean;
  deleteSchemasByIds: (ids: string[], options?: DeleteSchemasOptions) => boolean;
  duplicateSelection: () => void;
  copySelection?: () => void;
  pasteSelection?: () => void;
  cutSelection?: () => void;
  selectAllVisible?: () => void;
  clearSelection?: () => void;
  toggleHidden?: () => void;
  toggleRequired: () => void;
  toggleReadOnly: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  alignSelection: (type: AlignType) => void;
  distributeSelection: (type: DistributeType) => void;
  openProperties: () => void;
  groupSelection?: () => void;
  ungroupSelection?: () => void;
  copyStyle?: () => void;
  pasteStyle?: () => void;
  renameLabel?: () => void;
  editTextInline?: () => void;
  assignRecipient?: (recipient: {
    id: string;
    name?: string | null;
    color?: string | null;
  }) => void;
  changeRecipient?: (direction: 'previous' | 'next') => void;
  requestInlineEdit?: (_request: InlineEditRequest) => void;
  moveBy?: (_direction: AlignType | DistributeType | 'up' | 'down' | 'left' | 'right', _step: number) => void;
};

export type SelectionCommandsContext = {
  activeElements: HTMLElement[];
  schemasList: SchemaForUI[][];
  pageCursor: number;
  pageSize: Size;
  changeSchemas: ChangeSchemas;
  commitSchemas: (next: SchemaForUI[]) => void;
  removeSchemas: (ids: string[]) => void;
  onOpenProperties: () => void;
  requestInlineEdit?: (_request: InlineEditRequest) => void;
  onCopySelection?: () => void;
  onPasteSelection?: () => void;
  onCutSelection?: () => void;
  onSelectAllVisible?: () => void;
  onClearSelection?: () => void;
  collaborationContext?: Pick<
    EffectiveCollaborationContext,
    | 'fileId'
    | 'actorId'
    | 'ownerRecipientId'
    | 'ownerRecipientIds'
    | 'ownerRecipientName'
    | 'ownerColor'
    | 'userColor'
    | 'activeRecipientId'
    | 'recipientOptions'
    | 'canEditStructure'
  >;
  executeCommand?: (_command: Command) => void;
};

const getActiveIds = (elements: HTMLElement[]) => elements.filter(Boolean).map((element) => element.id);

const getActiveSchemas = (context: SelectionCommandsContext) => {
  const ids = getActiveIds(context.activeElements);
  return (context.schemasList[context.pageCursor] || []).filter((schema) => ids.includes(schema.id));
};

const getPageSchemas = (context: SelectionCommandsContext) =>
  context.schemasList[context.pageCursor] || [];

const getPageBounds = (schemas: SchemaForUI[], tgtPos: 'x' | 'y', tgtSize: 'width' | 'height') => {
  if (!schemas.length) return { min: 0, max: 0 };
  const positions = schemas.map((schema) => ({
    pos: schema.position?.[tgtPos] ?? 0,
    size: schema[tgtSize] ?? 0,
  }));
  const min = Math.min(...positions.map((entry) => entry.pos));
  const max = Math.max(...positions.map((entry) => entry.pos + entry.size));
  return { min, max };
};

const clampToPage = (value: number, max: number) => Math.min(Math.max(value, 0), max);

const hasDeleteDependencies = (schema: SchemaForUI) =>
  Boolean(
    schema.commentsCount ||
      (Array.isArray(schema.comments) && schema.comments.length > 0) ||
      (Array.isArray(schema.commentAnchors) && schema.commentAnchors.length > 0) ||
      (Array.isArray((schema as SchemaForUI & { commentsAnchors?: unknown[] }).commentsAnchors) &&
        (schema as SchemaForUI & { commentsAnchors?: unknown[] }).commentsAnchors?.length) ||
      (Array.isArray((schema as SchemaForUI & { connections?: unknown[] }).connections) &&
        (schema as SchemaForUI & { connections?: unknown[] }).connections?.length) ||
      (Array.isArray((schema as SchemaForUI & { connectionIds?: unknown[] }).connectionIds) &&
        (schema as SchemaForUI & { connectionIds?: unknown[] }).connectionIds?.length),
  );

export const createSelectionCommands = (context: SelectionCommandsContext): SelectionCommandSet => {
  const activeIds = getActiveIds(context.activeElements);
  const hasSelection = activeIds.length > 0;
  const canEditStructure = context.collaborationContext?.canEditStructure !== false;

  const guardStructureEdit = () => canEditStructure;

  const clearSelectionIfNeeded = (shouldClearSelection: boolean) => {
    if (shouldClearSelection) {
      context.onClearSelection?.();
    }
  };

  const deleteSchemasByIds = (ids: string[], options: DeleteSchemasOptions = {}) => {
    const normalizedIds = [...new Set(ids.map((id) => String(id || '').trim()).filter(Boolean))];
    if (!normalizedIds.length || !guardStructureEdit()) return false;

    const pageSchemas = getPageSchemas(context);
    const activeIdSet = new Set(activeIds);
    const shouldClearSelection = options.clearSelection ?? normalizedIds.some((id) => activeIdSet.has(id));
    const beforeSchemas = cloneDeep(pageSchemas) as SchemaForUI[];
    const afterSchemas = beforeSchemas.filter((schema) => !normalizedIds.includes(schema.id)) as SchemaForUI[];
    const deletedSchemas = beforeSchemas.filter((schema) => normalizedIds.includes(schema.id));
    const shouldConfirmDelete =
      normalizedIds.length > 1 || deletedSchemas.some((schema) => hasDeleteDependencies(schema));

    if (shouldConfirmDelete && typeof window !== 'undefined') {
      const confirmLabel =
        normalizedIds.length > 1
          ? `Se eliminarán ${normalizedIds.length} campos. ¿Deseas continuar?`
          : 'Este campo tiene comentarios o conexiones. ¿Deseas eliminarlo?';
      if (!window.confirm(confirmLabel)) return false;
    }

    const finishDelete = () => {
      message.success('Campo eliminado');
      clearSelectionIfNeeded(shouldClearSelection);
    };

    if (context.executeCommand) {
      context.executeCommand({
        id: 'deleteField',
        label: 'deleteField',
        execute: () => {
          context.commitSchemas(afterSchemas as SchemaForUI[]);
          finishDelete();
        },
        undo: () => {
          context.commitSchemas(beforeSchemas as SchemaForUI[]);
          clearSelectionIfNeeded(shouldClearSelection);
        },
        redo: () => {
          context.commitSchemas(afterSchemas as SchemaForUI[]);
          finishDelete();
        },
      });
      return true;
    }

    context.removeSchemas(normalizedIds);
    finishDelete();
    return true;
  };

  const deleteSelection = () => {
    if (!hasSelection || !guardStructureEdit()) return false;
    return deleteSchemasByIds(activeIds, { origin: 'keyboard' });
  };

  const duplicateSelection = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const existing = getPageSchemas(context);
    const clones = duplicateSchemas(getActiveSchemas(context), {
      pageIndex: context.pageCursor,
      pageSize: context.pageSize,
      pageCount: context.schemasList.length,
      fileId: context.collaborationContext?.fileId || null,
      collaborationContext: context.collaborationContext,
      existingSchemas: existing,
    });
    const nextSchemas = existing.concat(clones);
    if (context.executeCommand) {
      context.executeCommand({
        id: 'duplicateField',
        label: 'duplicateField',
        execute: () => {
          context.commitSchemas(nextSchemas);
        },
        undo: () => {
          context.commitSchemas(existing);
        },
      });
      return;
    }
    context.commitSchemas(nextSchemas);
  };

  const toggleRequired = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const ops = getActiveSchemas(context).map((schema) => ({
      key: 'required',
      value: !schema.required,
      schemaId: schema.id,
    }));
    context.changeSchemas(ops);
  };

  const toggleReadOnly = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const ops = getActiveSchemas(context).map((schema) => ({
      key: 'readOnly',
      value: !schema.readOnly,
      schemaId: schema.id,
    }));
    context.changeSchemas(ops);
  };

  const toggleHidden = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const ops = getActiveSchemas(context).map((schema) => ({
      key: 'hidden',
      value: (schema as SchemaForUI & { hidden?: boolean }).hidden !== true,
      schemaId: schema.id,
    }));
    context.changeSchemas(ops);
  };

  const bringForward = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const current = getPageSchemas(context);
    const selected = current.filter((schema) => activeIds.includes(schema.id));
    const remaining = current.filter((schema) => !activeIds.includes(schema.id));
    context.commitSchemas([...remaining, ...selected]);
  };

  const sendBackward = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const current = getPageSchemas(context);
    const selected = current.filter((schema) => activeIds.includes(schema.id));
    const remaining = current.filter((schema) => !activeIds.includes(schema.id));
    context.commitSchemas([...selected, ...remaining]);
  };

  const alignSelection = (type: AlignType) => {
    if (!hasSelection || !guardStructureEdit()) return;
    const schemas = getActiveSchemas(context);
    const isVertical = ['left', 'center', 'right'].includes(type);
    const tgtPos = isVertical ? 'x' : 'y';
    const tgtSize = isVertical ? 'width' : 'height';
    const { min, max } = getPageBounds(schemas, tgtPos, tgtSize);

    let basePos = min;
    let adjust: (value: number) => number = () => 0;
    if (['center', 'middle'].includes(type)) {
      basePos = (min + max) / 2;
      adjust = (value: number) => value / 2;
    } else if (['right', 'bottom'].includes(type)) {
      basePos = max;
      adjust = (value: number) => value;
    } else {
      adjust = () => 0;
    }

    const ops = schemas.map((schema) => {
      const size = schema[tgtSize] ?? 0;
      const value = round(basePos - adjust(size), 2);
      return { key: `position.${tgtPos}`, value: clampToPage(value, (tgtPos === 'x' ? context.pageSize.width : context.pageSize.height) - size), schemaId: schema.id };
    });
    context.changeSchemas(ops);
  };

  const distributeSelection = (type: DistributeType) => {
    if (!hasSelection || !guardStructureEdit()) return;
    const schemas = getActiveSchemas(context);
    if (schemas.length < 3) return;
    const isVertical = type === 'vertical';
    const tgtPos = isVertical ? 'y' : 'x';
    const tgtSize = isVertical ? 'height' : 'width';
    const { min, max } = getPageBounds(schemas, tgtPos, tgtSize);
    const totalSize = schemas.reduce((sum, schema) => sum + (schema[tgtSize] ?? 0), 0);
    const span = max - min;
    const gap = (span - totalSize) / (schemas.length - 1);
    let cursor = min;

    const ops = schemas.map((schema, index) => {
      const size = schema[tgtSize] ?? 0;
      if (index === 0) {
        cursor = min + size;
        return { key: `position.${tgtPos}`, value: min, schemaId: schema.id };
      }
      const value = cursor + gap;
      cursor = value + size;
      return { key: `position.${tgtPos}`, value: clampToPage(value, (tgtPos === 'x' ? context.pageSize.width : context.pageSize.height) - size), schemaId: schema.id };
    });
    context.changeSchemas(ops);
  };

  const openProperties = () => {
    context.onOpenProperties();
  };

  const requestInlineEdit = (target: InlineEditTarget) => {
    if (!hasSelection || !guardStructureEdit()) return;
    const activeSchemas = getActiveSchemas(context);
    if (activeSchemas.length !== 1) return;
    context.requestInlineEdit?.({ schemaId: activeSchemas[0].id, target });
  };

  const renameLabel = () => {
    requestInlineEdit('name');
  };

  const editTextInline = () => {
    requestInlineEdit('content');
  };

  const assignRecipient = (recipient: { id: string; name?: string | null; color?: string | null }) => {
    if (!hasSelection || !guardStructureEdit()) return;
    const nextRecipientId = String(recipient?.id || '').trim();
    if (!nextRecipientId) return;

    const nextRecipientName = String(recipient?.name || '').trim() || nextRecipientId;
    const nextRecipientColor = String(recipient?.color || '').trim() || null;
    const beforeSchemas = cloneDeep(getPageSchemas(context));
    const activeSchemaIds = new Set(activeIds);
    const afterSchemas = beforeSchemas.map((schema) =>
      activeSchemaIds.has(schema.id)
        ? {
            ...schema,
            ownerRecipientId: nextRecipientId,
            ownerRecipientIds: [nextRecipientId],
            recipientId: nextRecipientId,
            ownerRecipientName: nextRecipientName,
            ownerColor: nextRecipientColor,
            userColor: nextRecipientColor,
            ownerMode: 'single',
          }
        : schema,
    );

    if (context.executeCommand) {
      context.executeCommand({
        id: 'assignRecipient',
        label: 'assignRecipient',
        execute: () => {
          context.commitSchemas(afterSchemas as SchemaForUI[]);
        },
        undo: () => {
          context.commitSchemas(beforeSchemas as SchemaForUI[]);
        },
        redo: () => {
          context.commitSchemas(afterSchemas as SchemaForUI[]);
        },
      });
      return;
    }

    context.commitSchemas(afterSchemas as SchemaForUI[]);
  };

  const changeRecipient = (direction: 'previous' | 'next') => {
    if (!hasSelection || !guardStructureEdit()) return;
    const options = Array.isArray(context.collaborationContext?.recipientOptions)
      ? context.collaborationContext.recipientOptions
      : [];
    if (!options.length) return;

    const activeRecipientId = context.collaborationContext?.activeRecipientId || context.collaborationContext?.ownerRecipientId || null;
    const currentIndex = Math.max(
      0,
      options.findIndex((recipient) => recipient.id === activeRecipientId),
    );
    const nextIndex =
      direction === 'previous'
        ? (currentIndex - 1 + options.length) % options.length
        : (currentIndex + 1) % options.length;
    const nextRecipient = options[nextIndex];
    if (!nextRecipient?.id) return;
    assignRecipient({
      id: nextRecipient.id,
      name: nextRecipient.name || nextRecipient.tag || nextRecipient.id,
      color: nextRecipient.color || null,
    });
  };

  return {
    canEditStructure,
    deleteSelection,
    deleteSchemasByIds,
    duplicateSelection,
    copySelection: context.onCopySelection,
    pasteSelection: context.onPasteSelection,
    cutSelection: context.onCutSelection,
    selectAllVisible: context.onSelectAllVisible,
    clearSelection: context.onClearSelection,
    toggleHidden,
    toggleRequired,
    toggleReadOnly,
    bringForward,
    sendBackward,
    alignSelection,
    distributeSelection,
    openProperties,
    renameLabel,
    editTextInline,
    assignRecipient,
    changeRecipient,
  };
};

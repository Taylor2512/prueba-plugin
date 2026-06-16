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
import { evaluateSchemaMutationPermission } from './interactionGuards.js';
import { duplicateSchemas } from './schemaClipboard.js';
import type { GroupMeta } from '../../../../shared/schemaDesignerMeta.js';
import {
  optionGroupDesignerHeightMM,
  optionGroupDesignerWidthMM,
  isOptionGroupType,
} from '../../../../schemas/options/optionGroupLayout.js';
import { asRecord } from './objectGuards.js';
import { resolveActiveSchemasFromElements } from './selectionIdentityResolver.js';

type SchemaWithDesigner = SchemaForUI & {
  __designer?: Record<string, unknown>;
};

// ── Group helpers ──────────────────────────────────────────────────────────────

const generateGroupId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'grp-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
};

const isGroupMeta = (value: unknown): value is GroupMeta => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.groupId === 'string' &&
    (record.groupType === 'visual' ||
      record.groupType === 'radio' ||
      record.groupType === 'checkbox' ||
      record.groupType === 'signatureBlock' ||
      record.groupType === 'table' ||
      record.groupType === 'repeatable')
  );
};

/** Returns the GroupMeta for a schema from __designer or the schema itself */
const getGroupMeta = (schema: SchemaWithDesigner): GroupMeta | undefined => {
  const designer = asRecord(schema.__designer);
  const group = asRecord(designer?.group);
  return isGroupMeta(group) ? group : undefined;
};

/** Returns a new schema with __designer.group set */
const withGroupMeta = (schema: SchemaWithDesigner, group: GroupMeta | undefined): SchemaWithDesigner => {
  const existing = asRecord(schema.__designer) || {};
  if (group === undefined) {
    const { group: _removed, ...rest } = existing;
    return { ...schema, __designer: rest };
  }
  return { ...schema, __designer: { ...existing, group } };
};
export type AlignType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

export type DistributeType = 'vertical' | 'horizontal';

export type AlignmentMode = 'page' | 'selection';

export type PageBounds = {
  width: number;
  height: number;
};

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
  /** Adds one option to an active radioGroup/checkboxGroup (DocuSign-style "+"). */
  addGroupOption?: () => void;
  /** Converts an active lone checkbox into a checkboxGroup. */
  convertCheckboxToGroup?: () => void;
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

const getActiveIds = (elements: HTMLElement[]) =>
  elements
    .filter(Boolean)
    .map((element) => element.dataset.schemaId || element.id)
    .filter((id): id is string => Boolean(id));

const resolvePageIndexFromActiveElements = (context: SelectionCommandsContext): number => {
  for (const element of context.activeElements) {
    const pageIndex = Number(element?.dataset.pageIndex);
    if (Number.isInteger(pageIndex) && pageIndex >= 0 && context.schemasList[pageIndex]) {
      return pageIndex;
    }
  }
  return Math.max(0, Math.min(context.pageCursor, Math.max(0, context.schemasList.length - 1)));
};

const getActiveSchemas = (context: SelectionCommandsContext) =>
  resolveActiveSchemasFromElements(context.schemasList, context.activeElements);

const getPageSchemas = (context: SelectionCommandsContext) =>
  context.schemasList[resolvePageIndexFromActiveElements(context)] || [];

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

const clampToPage = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max, 0));

const clampSchemaPositionToPage = (
  value: number,
  axis: 'x' | 'y',
  size: number,
  pageBounds: PageBounds,
) => clampToPage(value, (axis === 'x' ? pageBounds.width : pageBounds.height) - size);

const createSelectionOps = (
  schemas: SchemaForUI[],
  key: string,
  valueFactory: (schema: SchemaForUI) => unknown,
) =>
  schemas.map((schema) => ({
    key,
    value: valueFactory(schema),
    schemaId: schema.id,
  }));

const applySelectionSchemas = (
  context: SelectionCommandsContext,
  updater: (schemas: SchemaForUI[]) => SchemaForUI[],
) => {
  const current = getPageSchemas(context);
  const next = updater(current);
  context.commitSchemas(next);
  return { current, next };
};

export const computeAlignedSchemas = (params: {
  schemas: SchemaForUI[];
  selectedIds: string[];
  pageBounds: PageBounds;
  align: AlignType;
  mode?: AlignmentMode;
}): Array<{ key: string; value: number; schemaId: string }> => {
  const { schemas, selectedIds, pageBounds, align } = params;
  const mode: AlignmentMode = params.mode || 'page';
  const selectedIdSet = new Set(selectedIds);
  const selectedSchemas = schemas.filter((schema) => selectedIdSet.has(schema.id));
  if (!selectedSchemas.length) return [];

  const axis: 'x' | 'y' = ['left', 'center', 'right'].includes(align) ? 'x' : 'y';
  const sizeKey: 'width' | 'height' = axis === 'x' ? 'width' : 'height';
  const pageAxisSize = axis === 'x' ? pageBounds.width : pageBounds.height;
  const selectionBounds = getPageBounds(selectedSchemas, axis, sizeKey);

  const useSelectionBounds = mode === 'selection' && selectedSchemas.length > 1;
  const anchorStart = useSelectionBounds ? selectionBounds.min : 0;
  const anchorEnd = useSelectionBounds ? selectionBounds.max : pageAxisSize;
  const anchorCenter = anchorStart + (anchorEnd - anchorStart) / 2;

  return selectedSchemas.map((schema) => {
    const schemaSize = schema[sizeKey] ?? 0;
    const targetPosition =
      align === 'left' || align === 'top'
        ? anchorStart
        : align === 'center' || align === 'middle'
          ? anchorCenter - schemaSize / 2
          : anchorEnd - schemaSize;

    const nextValue = clampSchemaPositionToPage(
      round(targetPosition, 2),
      axis,
      schemaSize,
      pageBounds,
    );

    return {
      key: `position.${axis}`,
      value: nextValue,
      schemaId: schema.id,
    };
  });
};

export const computeDistributedSchemas = (params: {
  schemas: SchemaForUI[];
  selectedIds: string[];
  pageBounds: PageBounds;
  distribute: DistributeType;
}): Array<{ key: string; value: number; schemaId: string }> => {
  const { schemas, selectedIds, pageBounds, distribute } = params;
  const selectedIdSet = new Set(selectedIds);
  const selectedSchemas = schemas.filter((schema) => selectedIdSet.has(schema.id));
  if (selectedSchemas.length < 3) return [];

  const axis: 'x' | 'y' = distribute === 'horizontal' ? 'x' : 'y';
  const sizeKey: 'width' | 'height' = axis === 'x' ? 'width' : 'height';
  const sortedSchemas = [...selectedSchemas].sort(
    (left, right) => (left.position?.[axis] ?? 0) - (right.position?.[axis] ?? 0),
  );
  const bounds = getPageBounds(sortedSchemas, axis, sizeKey);
  const totalSize = sortedSchemas.reduce((sum, schema) => sum + (schema[sizeKey] ?? 0), 0);
  const span = bounds.max - bounds.min;
  const gap = (span - totalSize) / (sortedSchemas.length - 1);

  let cursor = bounds.min;
  return sortedSchemas.map((schema, index) => {
    const schemaSize = schema[sizeKey] ?? 0;
    const next =
      index === 0
        ? bounds.min
        : cursor + gap;

    cursor = next + schemaSize;

    return {
      key: `position.${axis}`,
      value: clampSchemaPositionToPage(round(next, 2), axis, schemaSize, pageBounds),
      schemaId: schema.id,
    };
  });
};

const applySchemaOps = (
  schemas: SchemaForUI[],
  ops: Array<{ key: string; value: unknown; schemaId: string }>,
) => {
  if (!ops.length) return schemas;
  const byId = new Map(ops.map((op) => [op.schemaId, op]));
  return schemas.map((schema) => {
    const op = byId.get(schema.id);
    if (!op) return schema;
    if (op.key === 'position.x') {
      return {
        ...schema,
        position: {
          ...(schema.position || { x: 0, y: 0 }),
          x: Number(op.value),
        },
      };
    }
    if (op.key === 'position.y') {
      return {
        ...schema,
        position: {
          ...(schema.position || { x: 0, y: 0 }),
          y: Number(op.value),
        },
      };
    }
    return schema;
  });
};

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

const resolveSchemaRecipientId = (schema: SchemaForUI): string | null => {
  const asRecord = schema as SchemaForUI & { __designer?: { recipientId?: string | null }; ownerRecipientId?: string | null };
  return String(asRecord.__designer?.recipientId || asRecord.ownerRecipientId || '').trim() || null;
};

const isSchemaLockedByOtherUser = (
  schema: SchemaForUI,
  actorId?: string | null,
) => {
  const asRecord = schema as SchemaForUI & { lock?: { lockedBy?: string | null } };
  const lockedBy = String(asRecord.lock?.lockedBy || '').trim();
  const currentActor = String(actorId || '').trim();
  return Boolean(lockedBy && currentActor && lockedBy !== currentActor);
};

export const createSelectionCommands = (context: SelectionCommandsContext): SelectionCommandSet => {
  const activeIds = getActiveIds(context.activeElements);
  const hasSelection = activeIds.length > 0;
  const canEditStructure = context.collaborationContext?.canEditStructure !== false;

  const guardStructureEdit = () => canEditStructure;

  const guardSchemaMutation = (schema: SchemaForUI) =>
    evaluateSchemaMutationPermission({
      schemaId: schema.id,
      source: 'command-bus',
      canEditStructure,
      isReadonly: schema.readOnly === true,
      isLockedByOtherUser: isSchemaLockedByOtherUser(schema, context.collaborationContext?.actorId),
      schemaRecipientId: resolveSchemaRecipientId(schema),
      activeRecipientId: context.collaborationContext?.activeRecipientId || null,
    });

  const clearSelectionIfNeeded = (shouldClearSelection: boolean) => {
    if (shouldClearSelection) {
      context.onClearSelection?.();
    }
  };

  const deleteSchemasByIds = (ids: string[], options: DeleteSchemasOptions = {}) => {
    const normalizedIds = [...new Set(ids.map((id) => String(id || '').trim()).filter(Boolean))];
    if (!normalizedIds.length || !guardStructureEdit()) return false;

    const pageSchemas = getPageSchemas(context);
    const blocked = pageSchemas
      .filter((schema) => normalizedIds.includes(schema.id))
      .map((schema) => ({ schema, decision: guardSchemaMutation(schema) }))
      .find((entry) => !entry.decision.allowed);
    if (blocked) {
      message.warning(blocked.decision.message || 'No se puede modificar uno de los campos seleccionados.');
      return false;
    }
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
    const blocked = getActiveSchemas(context)
      .map((schema) => guardSchemaMutation(schema))
      .find((decision) => !decision.allowed);
    if (blocked) {
      message.warning(blocked.message || 'No se puede duplicar la selección actual.');
      return;
    }
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
    const ops = createSelectionOps(getActiveSchemas(context), 'required', (schema) => !schema.required);
    context.changeSchemas(ops);
  };

  const toggleReadOnly = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const ops = createSelectionOps(getActiveSchemas(context), 'readOnly', (schema) => !schema.readOnly);
    context.changeSchemas(ops);
  };

  const toggleHidden = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const ops = createSelectionOps(getActiveSchemas(context), 'hidden', (schema) => (schema as SchemaForUI & { hidden?: boolean }).hidden !== true);
    context.changeSchemas(ops);
  };

  const addGroupOption = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const schema = getActiveSchemas(context)[0] as SchemaForUI & {
      type?: string;
      options?: Array<string | { optionId: string; label: string }>;
    };
    if (!schema) return;
    const type = String(schema.type || '');
    if (!isOptionGroupType(type)) return;
    const raw = Array.isArray(schema.options) ? schema.options : [];
    const current = raw.map((entry, index) =>
      typeof entry === 'string'
        ? { optionId: entry || `option_${index + 1}`, label: entry || `Opción ${index + 1}` }
        : { optionId: entry.optionId || `option_${index + 1}`, label: entry.label || entry.optionId },
    );
    const existing = new Set(current.map((o) => o.optionId));
    let n = current.length + 1;
    let optionId = `option_${n}`;
    while (existing.has(optionId)) {
      n += 1;
      optionId = `option_${n}`;
    }
    const isRadio = type === 'radioGroup';
    const label = `${isRadio ? 'Opción' : 'Casilla'} ${current.length + 1}`;
    const nextOptions = [...current, { optionId, label }];
    const groupType = type.toLowerCase() === 'radiogroup' ? 'radioGroup' : 'checkboxGroup';
    context.changeSchemas([
      { key: 'options', value: nextOptions, schemaId: schema.id },
      { key: 'width',   value: optionGroupDesignerWidthMM(groupType), schemaId: schema.id },
      { key: 'height',  value: optionGroupDesignerHeightMM(groupType, nextOptions.length), schemaId: schema.id },
    ]);
  };

  const convertCheckboxToGroup = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const schema = getActiveSchemas(context)[0] as SchemaForUI & { type?: string; content?: unknown; width?: number };
    if (!schema || String(schema.type) !== 'checkbox') return;
    const wasChecked = schema.content === 'true';
    context.changeSchemas([
      { key: 'type', value: 'checkboxGroup', schemaId: schema.id },
      { key: 'groupName', value: 'Grupo de casillas', schemaId: schema.id },
      { key: 'groupId', value: 'Grupo_Casillas', schemaId: schema.id },
      { key: 'lockedAsGroup', value: true, schemaId: schema.id },
      { key: 'orientation', value: 'vertical', schemaId: schema.id },
      { key: 'spacing', value: 3, schemaId: schema.id },
      { key: 'height', value: 24, schemaId: schema.id },
      { key: 'width', value: Math.max(55, Number(schema.width) || 0), schemaId: schema.id },
      {
        key: 'options',
        value: [
          { optionId: 'option_1', label: 'Casilla 1' },
          { optionId: 'option_2', label: 'Casilla 2' },
        ],
        schemaId: schema.id,
      },
      { key: 'content', value: wasChecked ? 'option_1' : '', schemaId: schema.id },
      { key: 'selectedOptionIds', value: wasChecked ? ['option_1'] : [], schemaId: schema.id },
      { key: '__designer.group.groupId', value: 'Grupo_Casillas', schemaId: schema.id },
      { key: '__designer.group.groupType', value: 'checkbox', schemaId: schema.id },
      { key: '__designer.group.groupName', value: 'Grupo de casillas', schemaId: schema.id },
      { key: '__designer.group.lockedAsGroup', value: true, schemaId: schema.id },
    ]);
  };

  const bringForward = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    applySelectionSchemas(context, (current) => {
      const selected = current.filter((schema) => activeIds.includes(schema.id));
      const remaining = current.filter((schema) => !activeIds.includes(schema.id));
      return [...remaining, ...selected];
    });
  };

  const sendBackward = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    applySelectionSchemas(context, (current) => {
      const selected = current.filter((schema) => activeIds.includes(schema.id));
      const remaining = current.filter((schema) => !activeIds.includes(schema.id));
      return [...selected, ...remaining];
    });
  };

  const alignSelection = (type: AlignType) => {
    if (!hasSelection || !guardStructureEdit()) return;
    const pageSchemas = getPageSchemas(context);
    const ops = computeAlignedSchemas({
      schemas: pageSchemas,
      selectedIds: activeIds,
      pageBounds: {
        width: context.pageSize.width,
        height: context.pageSize.height,
      },
      align: type,
      mode: 'page',
    });
    if (!ops.length) return;

    if (context.executeCommand) {
      const beforeSchemas = cloneDeep(pageSchemas) as SchemaForUI[];
      const afterSchemas = applySchemaOps(beforeSchemas, ops);
      context.executeCommand({
        id: 'alignSelection',
        label: 'alignSelection',
        execute: () => {
          context.commitSchemas(afterSchemas);
        },
        undo: () => {
          context.commitSchemas(beforeSchemas);
        },
        redo: () => {
          context.commitSchemas(afterSchemas);
        },
      });
      return;
    }

    context.changeSchemas(ops);
  };

  const distributeSelection = (type: DistributeType) => {
    if (!hasSelection || !guardStructureEdit()) return;
    const pageSchemas = getPageSchemas(context);
    const ops = computeDistributedSchemas({
      schemas: pageSchemas,
      selectedIds: activeIds,
      pageBounds: {
        width: context.pageSize.width,
        height: context.pageSize.height,
      },
      distribute: type,
    });
    if (!ops.length) return;

    if (context.executeCommand) {
      const beforeSchemas = cloneDeep(pageSchemas) as SchemaForUI[];
      const afterSchemas = applySchemaOps(beforeSchemas, ops);
      context.executeCommand({
        id: 'distributeSelection',
        label: 'distributeSelection',
        execute: () => {
          context.commitSchemas(afterSchemas);
        },
        undo: () => {
          context.commitSchemas(beforeSchemas);
        },
        redo: () => {
          context.commitSchemas(afterSchemas);
        },
      });
      return;
    }

    context.changeSchemas(ops);
  };

  const openProperties = () => {
    context.onOpenProperties();
  };

  const groupSelection = () => {
    if (!hasSelection || activeIds.length < 2 || !guardStructureEdit()) return;
    const pageSchemas = getPageSchemas(context);
    const beforeSchemas = cloneDeep(pageSchemas) as SchemaForUI[];
    const groupId = generateGroupId();
    const groupMeta: GroupMeta = {
      groupId,
      groupType: 'visual',
      groupName: `Grupo ${groupId.slice(0, 6)}`,
      lockedAsGroup: false,
    };
    const afterSchemas = beforeSchemas.map((schema, order) =>
      activeIds.includes(schema.id)
        ? withGroupMeta(schema, { ...groupMeta, order })
        : schema,
    ) as SchemaForUI[];

    if (context.executeCommand) {
      context.executeCommand({
        id: 'groupSchemas',
        label: 'Agrupar campos',
        execute: () => {
          context.commitSchemas(afterSchemas);
          message.success(`${activeIds.length} campos agrupados`);
        },
        undo: () => {
          context.commitSchemas(beforeSchemas);
        },
        redo: () => {
          context.commitSchemas(afterSchemas);
          message.success(`${activeIds.length} campos agrupados`);
        },
      });
      return;
    }
    context.commitSchemas(afterSchemas);
    message.success(`${activeIds.length} campos agrupados`);
  };

  const ungroupSelection = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const pageSchemas = getPageSchemas(context);
    const beforeSchemas = cloneDeep(pageSchemas) as SchemaForUI[];

    // Collect groupIds from active schemas
    const groupIds = new Set(
      beforeSchemas
        .filter((s) => activeIds.includes(s.id) && getGroupMeta(s)?.groupId)
        .map((s) => getGroupMeta(s)!.groupId),
    );

    if (groupIds.size === 0) return;

    // Remove group meta from all schemas that share one of those groupIds
    const afterSchemas = beforeSchemas.map((schema) => {
      const meta = getGroupMeta(schema);
      if (meta && groupIds.has(meta.groupId)) {
        return withGroupMeta(schema, undefined);
      }
      return schema;
    }) as SchemaForUI[];

    if (context.executeCommand) {
      context.executeCommand({
        id: 'ungroupSchemas',
        label: 'Desagrupar campos',
        execute: () => {
          context.commitSchemas(afterSchemas);
          message.success('Grupo disuelto');
        },
        undo: () => {
          context.commitSchemas(beforeSchemas);
        },
        redo: () => {
          context.commitSchemas(afterSchemas);
          message.success('Grupo disuelto');
        },
      });
      return;
    }
    context.commitSchemas(afterSchemas);
    message.success('Grupo disuelto');
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
    groupSelection,
    ungroupSelection,
    addGroupOption,
    convertCheckboxToGroup,
    renameLabel,
    editTextInline,
    assignRecipient,
    changeRecipient,
  };
};

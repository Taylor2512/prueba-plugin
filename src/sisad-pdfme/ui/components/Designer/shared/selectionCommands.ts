import {
  ChangeSchemas,
  SchemaForUI,
  Size,
  type Command,
} from '@sisad-pdfme/common';
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
  deleteSelection: () => void;
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
    | 'canEditStructure'
  >;
  executeCommand?: (_command: Command) => void;
};

const getActiveIds = (elements: HTMLElement[]) => elements.map((element) => element.id);

const getActiveSchemas = (context: SelectionCommandsContext) => {
  const ids = getActiveIds(context.activeElements);
  return context.schemasList[context.pageCursor].filter((schema) => ids.includes(schema.id));
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

export const createSelectionCommands = (context: SelectionCommandsContext): SelectionCommandSet => {
  const activeIds = getActiveIds(context.activeElements);
  const hasSelection = activeIds.length > 0;
  const canEditStructure = context.collaborationContext?.canEditStructure !== false;

  const guardStructureEdit = () => canEditStructure;

  const deleteSelection = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    if (context.executeCommand) {
      const beforeSchemas = getPageSchemas(context);
      const afterSchemas = beforeSchemas.filter((schema) => !activeIds.includes(schema.id));
      context.executeCommand({
        id: 'deleteField',
        label: 'deleteField',
        execute: () => {
          context.commitSchemas(afterSchemas);
          context.onOpenProperties();
        },
        undo: () => {
          context.commitSchemas(beforeSchemas);
        },
      });
      return;
    }
    context.removeSchemas(activeIds);
  };

  const duplicateSelection = () => {
    if (!hasSelection || !guardStructureEdit()) return;
    const clones = duplicateSchemas(getActiveSchemas(context), {
      pageIndex: context.pageCursor,
      pageSize: context.pageSize,
      totalPages: context.schemasList.length,
      fileId: context.collaborationContext?.fileId || null,
      collaboration: context.collaborationContext,
      existingSchemas: getPageSchemas(context),
      offsetMm: 6,
      collisionStepMm: 6,
    });
    const nextSchemas = getPageSchemas(context).concat(clones);
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

  return {
    canEditStructure,
    deleteSelection,
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
  };
};

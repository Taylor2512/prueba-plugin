import {
  ChangeSchemas,
  SchemaForUI,
  Size,
  cloneDeep,
} from '@pdfme/common';
import { uuid, round } from '../../../helper.js';
export type AlignType =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

export type DistributeType = 'vertical' | 'horizontal';

export type SelectionCommandSet = {
  deleteSelection: () => void;
  duplicateSelection: () => void;
  toggleRequired: () => void;
  toggleReadOnly: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  alignSelection: (type: AlignType) => void;
  distributeSelection: (type: DistributeType) => void;
  openProperties: () => void;
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

  const deleteSelection = () => {
    if (!hasSelection) return;
    context.removeSchemas(activeIds);
  };

  const duplicateSelection = () => {
    if (!hasSelection) return;
    const existing = getPageSchemas(context);
    const clones = getActiveSchemas(context).map((schema) => {
      const clone = cloneDeep(schema);
      clone.id = uuid();
      clone.name = `${schema.name} copy`;
      clone.position = {
        x: clampToPage((schema.position?.x ?? 0) + 6, context.pageSize.width - (schema.width ?? 0)),
        y: clampToPage((schema.position?.y ?? 0) + 6, context.pageSize.height - (schema.height ?? 0)),
      };
      return clone;
    });
    context.commitSchemas(existing.concat(clones));
  };

  const toggleRequired = () => {
    if (!hasSelection) return;
    const ops = getActiveSchemas(context).map((schema) => ({
      key: 'required',
      value: !schema.required,
      schemaId: schema.id,
    }));
    context.changeSchemas(ops);
  };

  const toggleReadOnly = () => {
    if (!hasSelection) return;
    const ops = getActiveSchemas(context).map((schema) => ({
      key: 'readOnly',
      value: !schema.readOnly,
      schemaId: schema.id,
    }));
    context.changeSchemas(ops);
  };

  const bringForward = () => {
    if (!hasSelection) return;
    const current = getPageSchemas(context);
    const selected = current.filter((schema) => activeIds.includes(schema.id));
    const remaining = current.filter((schema) => !activeIds.includes(schema.id));
    context.commitSchemas([...remaining, ...selected]);
  };

  const sendBackward = () => {
    if (!hasSelection) return;
    const current = getPageSchemas(context);
    const selected = current.filter((schema) => activeIds.includes(schema.id));
    const remaining = current.filter((schema) => !activeIds.includes(schema.id));
    context.commitSchemas([...selected, ...remaining]);
  };

  const alignSelection = (type: AlignType) => {
    if (!hasSelection) return;
    const schemas = getActiveSchemas(context);
    const page = getPageSchemas(context);
    const isVertical = ['left', 'center', 'right'].includes(type);
    const tgtPos = isVertical ? 'x' : 'y';
    const tgtSize = isVertical ? 'width' : 'height';
    const { min, max } = getPageBounds(schemas, tgtPos as 'x' | 'y', tgtSize as 'width' | 'height');

    let basePos = min;
    let adjust = 0;
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
    if (!hasSelection) return;
    const schemas = getActiveSchemas(context);
    if (schemas.length < 3) return;
    const isVertical = type === 'vertical';
    const tgtPos = isVertical ? 'y' : 'x';
    const tgtSize = isVertical ? 'height' : 'width';
    const { min, max } = getPageBounds(schemas, tgtPos as 'x' | 'y', tgtSize as 'width' | 'height');
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

  return {
    deleteSelection,
    duplicateSelection,
    toggleRequired,
    toggleReadOnly,
    bringForward,
    sendBackward,
    alignSelection,
    distributeSelection,
    openProperties,
  };
};

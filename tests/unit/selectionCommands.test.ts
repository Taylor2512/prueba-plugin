import { describe, expect, test } from 'vitest';
import {
  computeAlignedSchemas,
  computeDistributedSchemas,
} from '@/sisad-pdfme/ui/components/Designer/shared/selectionCommands.js';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';

const makeSchema = (
  id: string,
  x: number,
  y: number,
  width = 40,
  height = 20,
): SchemaForUI =>
  ({
    id,
    name: id,
    type: 'text',
    content: id,
    position: { x, y },
    width,
    height,
    rotate: 5,
    ownerColor: '#112233',
  }) as SchemaForUI;

describe('selectionCommands geometry helpers', () => {
  test('aligns one schema against page bounds (left/center/right)', () => {
    const schemas = [makeSchema('a', 72, 16, 40, 20)];

    const left = computeAlignedSchemas({
      schemas,
      selectedIds: ['a'],
      pageBounds: { width: 200, height: 100 },
      align: 'left',
      mode: 'page',
    });
    const center = computeAlignedSchemas({
      schemas,
      selectedIds: ['a'],
      pageBounds: { width: 200, height: 100 },
      align: 'center',
      mode: 'page',
    });
    const right = computeAlignedSchemas({
      schemas,
      selectedIds: ['a'],
      pageBounds: { width: 200, height: 100 },
      align: 'right',
      mode: 'page',
    });

    expect(left).toEqual([{ key: 'position.x', value: 0, schemaId: 'a' }]);
    expect(center).toEqual([{ key: 'position.x', value: 80, schemaId: 'a' }]);
    expect(right).toEqual([{ key: 'position.x', value: 160, schemaId: 'a' }]);
  });

  test('aligns against selection bounds only in selection mode with multi selection', () => {
    const schemas = [
      makeSchema('a', 20, 10, 40, 20),
      makeSchema('b', 100, 30, 20, 20),
      makeSchema('c', 180, 10, 20, 20),
    ];

    const aligned = computeAlignedSchemas({
      schemas,
      selectedIds: ['a', 'b'],
      pageBounds: { width: 300, height: 120 },
      align: 'right',
      mode: 'selection',
    });

    expect(aligned).toEqual([
      { key: 'position.x', value: 80, schemaId: 'a' },
      { key: 'position.x', value: 100, schemaId: 'b' },
    ]);
  });

  test('distributes horizontally and returns no-op for fewer than three schemas', () => {
    const schemas = [
      makeSchema('a', 10, 10, 20, 10),
      makeSchema('b', 50, 10, 20, 10),
      makeSchema('c', 110, 10, 20, 10),
    ];

    const distributed = computeDistributedSchemas({
      schemas,
      selectedIds: ['a', 'b', 'c'],
      pageBounds: { width: 300, height: 100 },
      distribute: 'horizontal',
    });
    const tooFew = computeDistributedSchemas({
      schemas,
      selectedIds: ['a', 'b'],
      pageBounds: { width: 300, height: 100 },
      distribute: 'horizontal',
    });

    expect(distributed).toEqual([
      { key: 'position.x', value: 10, schemaId: 'a' },
      { key: 'position.x', value: 60, schemaId: 'b' },
      { key: 'position.x', value: 110, schemaId: 'c' },
    ]);
    expect(tooFew).toEqual([]);
  });
});

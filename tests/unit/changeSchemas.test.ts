import { describe, expect, it, vi } from 'vitest';
import type { BasePdf, PluginRegistry, SchemaForUI } from '@sisad-pdfme/common';
import { changeSchemas } from '../../src/sisad-pdfme/ui/helper.js';

const createPluginRegistry = (): PluginRegistry => ({
  plugins: {},
  exists: () => false,
  values: () => [],
  entries: () => [],
  findByType: () => undefined,
  findWithLabelByType: () => ['', undefined],
});

describe('changeSchemas', () => {
  it('preserves untouched page and schema references', () => {
    const page0Schema0 = {
      id: 'schema-0',
      name: 'field-0',
      type: 'text',
      content: 'a',
      position: { x: 10, y: 10 },
      width: 20,
      height: 10,
    } as SchemaForUI;
    const page0Schema1 = {
      id: 'schema-1',
      name: 'field-1',
      type: 'text',
      content: 'b',
      position: { x: 30, y: 10 },
      width: 20,
      height: 10,
    } as SchemaForUI;
    const page1Schema0 = {
      id: 'schema-2',
      name: 'field-2',
      type: 'text',
      content: 'c',
      position: { x: 10, y: 10 },
      width: 20,
      height: 10,
    } as SchemaForUI;

    const schemas = [[page0Schema0, page0Schema1], [page1Schema0]];
    const commitSchemas = vi.fn();

    changeSchemas({
      objs: [{ key: 'content', value: 'updated', schemaId: 'schema-0' }],
      schemas,
      basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] } as BasePdf,
      pluginsRegistry: createPluginRegistry(),
      pageSize: { width: 210, height: 297 },
      commitSchemas,
    });

    expect(commitSchemas).toHaveBeenCalledTimes(1);
    const nextSchemas = commitSchemas.mock.calls[0][0] as SchemaForUI[][];

    expect(nextSchemas).not.toBe(schemas);
    expect(nextSchemas[0]).not.toBe(schemas[0]);
    expect(nextSchemas[1]).toBe(schemas[1]);
    expect(nextSchemas[0][0]).not.toBe(page0Schema0);
    expect(nextSchemas[0][1]).toBe(page0Schema1);
    expect(nextSchemas[1][0]).toBe(page1Schema0);
    expect(nextSchemas[0][0].content).toBe('updated');
    expect(page0Schema0.content).toBe('a');
  });
});

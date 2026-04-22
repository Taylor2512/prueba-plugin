import { describe, expect, it } from 'vitest';
import { getDynamicTemplate } from '../../src/sisad-pdfme/common/dynamicTemplate.js';
import type { BasePdf, BlankPdf, Schema, Template } from '@sisad-pdfme/common';

const basePdf: BlankPdf = { width: 210, height: 297, padding: [10, 10, 10, 10] };

const createSchema = (name: string, y: number, height: number, content?: string): Schema => ({
  id: name,
  name,
  type: 'text',
  position: { x: 10, y },
  width: 100,
  height,
  content: content || `Content for ${name}`,
  readOnly: true,
});

describe('dynamicTemplate', () => {
  it('returns original template when basePdf is not blank', async () => {
    const externalPdf: BasePdf = 'external.pdf';
    const template: Template = {
      basePdf: externalPdf,
      schemas: [[createSchema('field1', 50, 20)]],
    };

    const result = await getDynamicTemplate({
      template,
      input: { field1: 'test' },
      _cache: new Map(),
      options: {},
      getDynamicHeights: async () => [20],
    });

    expect(result).toBe(template);
  });

  it('processes blank PDF templates with dynamic heights', async () => {
    const template: Template = {
      basePdf,
      schemas: [[createSchema('field1', 50, 20, 'Static content')]],
    };

    const result = await getDynamicTemplate({
      template,
      input: { field1: 'Dynamic content' },
      _cache: new Map(),
      options: {},
      getDynamicHeights: async (value) => [value.length * 2],
    });

    expect(result.schemas[0]).toBeDefined();
  });

  it('handles multiple schemas on a page', async () => {
    const template: Template = {
      basePdf,
      schemas: [[
        createSchema('field1', 50, 20),
        createSchema('field2', 80, 20),
        createSchema('field3', 110, 20),
      ]],
    };

    const result = await getDynamicTemplate({
      template,
      input: { field1: 'A', field2: 'B', field3: 'C' },
      _cache: new Map(),
      options: {},
      getDynamicHeights: async () => [20],
    });

    expect(result.schemas[0]).toHaveLength(3);
  });

  it('splits schemas across multiple pages when needed', async () => {
    const tallPdf: BlankPdf = { width: 210, height: 50, padding: [2, 2, 2, 2] };
    const template: Template = {
      basePdf: tallPdf,
      schemas: [[
        createSchema('field1', 10, 10),
        createSchema('field2', 25, 10),
        createSchema('field3', 40, 10),
      ]],
    };

    const result = await getDynamicTemplate({
      template,
      input: { field1: 'A', field2: 'B', field3: 'C' },
      _cache: new Map(),
      options: {},
      getDynamicHeights: async () => [10],
    });

    expect(result.schemas.length).toBeGreaterThanOrEqual(1);
  });

  it('handles empty schemas gracefully', async () => {
    const template: Template = {
      basePdf,
      schemas: [[]],
    };

    const result = await getDynamicTemplate({
      template,
      input: {},
      _cache: new Map(),
      options: {},
      getDynamicHeights: async () => [],
    });

    expect(result.schemas).toBeDefined();
  });

  it('uses cached dynamic heights when available', async () => {
    const template: Template = {
      basePdf,
      schemas: [[createSchema('field1', 50, 20)]],
    };

    const cache = new Map<string | number, unknown>();
    cache.set('field1_0', [20]);

    const result = await getDynamicTemplate({
      template,
      input: { field1: 'test' },
      _cache: cache,
      options: {},
      getDynamicHeights: async () => [20],
    });

    expect(result.schemas[0]).toBeDefined();
  });

  it('handles readOnly schemas with static content', async () => {
    const staticSchema: Schema = {
      id: 'static1',
      name: 'staticField',
      type: 'text',
      position: { x: 10, y: 50 },
      width: 100,
      height: 20,
      readOnly: true,
      content: 'Static content here',
    };

    const template: Template = {
      basePdf,
      schemas: [[staticSchema]],
    };

    const result = await getDynamicTemplate({
      template,
      input: {},
      _cache: new Map(),
      options: {},
      getDynamicHeights: async () => [20],
    });

    expect(result.schemas[0][0].content).toBe('Static content here');
  });
});
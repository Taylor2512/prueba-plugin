import { describe, expect, it } from 'vitest';
import type { BasePdf, Template } from '@sisad-pdfme/common';
import generate from '../../src/sisad-pdfme/generator/generate.js';
import { flatSchemaPlugins } from '../../src/sisad-pdfme/schemas/index.js';

const basePdf: BasePdf = { width: 210, height: 297, padding: [0, 0, 0, 0] };

describe('generator helper functions', () => {
  it('generates PDF with multiple pages', async () => {
    const template: Template = {
      basePdf,
      schemas: [
        [{ type: 'text', name: 'page1', position: { x: 0, y: 0 }, width: 50, height: 10, content: 'Page 1' }],
        [{ type: 'text', name: 'page2', position: { x: 0, y: 0 }, width: 50, height: 10, content: 'Page 2' }],
      ],
    };

    const output = await generate({
      template,
      inputs: [{}],
    });

    expect(output).toBeInstanceOf(Uint8Array);
    expect(output.length).toBeGreaterThan(0);
  });

  it('validates required fields in template', async () => {
    const template: Template = {
      basePdf,
      schemas: [[{
        type: 'text',
        name: 'requiredField',
        position: { x: 0, y: 0 },
        width: 50,
        height: 10,
        required: true,
      }]],
    };

    await expect(
      generate({
        template,
        inputs: [{}],
      }),
    ).rejects.toThrow("input for 'requiredField' is required");
  });

  it('generates PDF with multiple inputs', async () => {
    const template: Template = {
      basePdf,
      schemas: [[
        { type: 'text', name: 'field1', position: { x: 0, y: 0 }, width: 50, height: 10, content: 'A' },
        { type: 'text', name: 'field2', position: { x: 0, y: 0 }, width: 50, height: 10, content: 'B' },
      ]],
    };

    const output = await generate({
      template,
      inputs: [{ field1: 'Value1', field2: 'Value2' }],
    });

    expect(output).toBeInstanceOf(Uint8Array);
    expect(output.length).toBeGreaterThan(0);
  });

  it('generates PDF with form fields', async () => {
    const template: Template = {
      basePdf,
      schemas: [[{
        type: 'text',
        name: 'formField',
        position: { x: 0, y: 0 },
        width: 50,
        height: 10,
        readOnly: false,
      }]],
    };

    const output = await generate({
      template,
      inputs: [{ formField: 'Form value' }],
    });

    expect(output).toBeInstanceOf(Uint8Array);
    expect(output.length).toBeGreaterThan(0);
  });
});
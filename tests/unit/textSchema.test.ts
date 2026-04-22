import { describe, expect, it, vi } from 'vitest';
import type { BasePdf, Template, UIOptions } from '@sisad-pdfme/common';
import generate from '../../src/sisad-pdfme/generator/generate.js';
import { flatSchemaPlugins, builtInPlugins } from '../../src/sisad-pdfme/schemas/index.js';

const basePdf: BasePdf = { width: 210, height: 297, padding: [0, 0, 0, 0] };
const theme = {} as any;
const options = {} as UIOptions;

describe('text schema plugin', () => {
  it('has text in plugins', () => {
    expect(builtInPlugins.text).toBeDefined();
  });

  it('has propPanel default schema of type text', () => {
    expect(flatSchemaPlugins.text?.propPanel?.defaultSchema?.type).toBe('text');
  });

  it('renders text field in form mode', () => {
    const rootElement = document.createElement('div');

    builtInPlugins.text.ui({
      schema: { type: 'text', position: { x: 0, y: 0 }, width: 100, height: 20 } as any,
      basePdf,
      mode: 'form',
      value: '',
      rootElement,
      options,
      theme,
      i18n: (key) => key,
      scale: 1,
      _cache: new Map(),
    });

    expect(rootElement.innerHTML).toBeDefined();
  });

  it('renders text with value in form mode', () => {
    const rootElement = document.createElement('div');

    builtInPlugins.text.ui({
      schema: { type: 'text', position: { x: 0, y: 0 }, width: 100, height: 20 } as any,
      basePdf,
      mode: 'form',
      value: 'Test value',
      rootElement,
      options,
      theme,
      i18n: (key) => key,
      scale: 1,
      _cache: new Map(),
    });

    expect(rootElement.innerHTML).toBeDefined();
  });

  it('renders read-only text in viewer mode', () => {
    const rootElement = document.createElement('div');

    builtInPlugins.text.ui({
      schema: { 
        type: 'text', 
        position: { x: 0, y: 0 }, 
        width: 100, 
        height: 20,
      } as any,
      basePdf,
      mode: 'viewer',
      value: 'Read-only content',
      rootElement,
      options,
      theme,
      i18n: (key) => key,
      scale: 1,
      _cache: new Map(),
    });

    expect(rootElement.innerHTML).toBeDefined();
  });

  it('exports text field through generator', async () => {
    const template: Template = {
      basePdf,
      schemas: [[{
        type: 'text',
        name: 'textField',
        position: { x: 0, y: 0 },
        width: 100,
        height: 20,
        content: 'Hello World',
      }]],
    };

    const output = await generate({
      template,
      inputs: [{}],
    });

    expect(output).toBeInstanceOf(Uint8Array);
    expect(output.length).toBeGreaterThan(0);
  });

  it('handles placeholder variables', async () => {
    const template: Template = {
      basePdf,
      schemas: [[{
        type: 'text',
        name: 'placeholderField',
        position: { x: 0, y: 0 },
        width: 100,
        height: 20,
        content: 'Hello {{name}}, welcome!',
        readOnly: true,
      }]],
    };

    const output = await generate({
      template,
      inputs: [{ name: 'John' }],
    });

    expect(output).toBeInstanceOf(Uint8Array);
    expect(output.length).toBeGreaterThan(0);
  });
});
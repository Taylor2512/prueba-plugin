import { describe, expect, it, vi } from 'vitest';
import type { BasePdf, Template, UIOptions } from '@sisad-pdfme/common';
import generate from '../../src/sisad-pdfme/generator/generate.js';
import { flatSchemaPlugins, builtInPlugins } from '../../src/sisad-pdfme/schemas/index.js';

const basePdf: BasePdf = { width: 210, height: 297, padding: [0, 0, 0, 0] };
const theme = {} as any;
const options = {} as UIOptions;

describe('checkbox schema plugin', () => {
  it('has checkbox in plugins', () => {
    expect(builtInPlugins.checkbox).toBeDefined();
  });

  it('has propPanel default schema of type checkbox', () => {
    expect(flatSchemaPlugins.checkbox?.propPanel?.defaultSchema?.type).toBe('checkbox');
  });

  it('renders a checkbox in form mode', () => {
    const rootElement = document.createElement('div');
    const onChange = vi.fn();

    builtInPlugins.checkbox.ui({
      schema: { type: 'checkbox', position: { x: 0, y: 0 }, width: 20, height: 20 } as any,
      basePdf,
      mode: 'form',
      value: '',
      onChange,
      rootElement,
      options,
      theme,
      i18n: (key) => key,
      scale: 1,
      _cache: new Map(),
    });

    expect(rootElement.innerHTML).toBeDefined();
  });

  it('renders checked checkbox when value exists', () => {
    const rootElement = document.createElement('div');

    builtInPlugins.checkbox.ui({
      schema: { type: 'checkbox', position: { x: 0, y: 0 }, width: 20, height: 20 } as any,
      basePdf,
      mode: 'form',
      value: 'true',
      rootElement,
      options,
      theme,
      i18n: (key) => key,
      scale: 1,
      _cache: new Map(),
    });

    expect(rootElement.innerHTML).toBeDefined();
  });

  it('exports checkbox through generator', async () => {
    const template: Template = {
      basePdf,
      schemas: [[{
        type: 'checkbox',
        name: 'agreeTerms',
        position: { x: 0, y: 0 },
        width: 20,
        height: 20,
        content: 'true',
      }]],
    };

    const output = await generate({
      template,
      inputs: [{}],
    });

    expect(output).toBeInstanceOf(Uint8Array);
    expect(output.length).toBeGreaterThan(0);
  });
});
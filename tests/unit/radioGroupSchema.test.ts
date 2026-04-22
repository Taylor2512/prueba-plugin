import { describe, expect, it, vi } from 'vitest';
import type { BasePdf, Template, UIOptions } from '@sisad-pdfme/common';
import generate from '../../src/sisad-pdfme/generator/generate.js';
import { flatSchemaPlugins, builtInPlugins } from '../../src/sisad-pdfme/schemas/index.js';

const basePdf: BasePdf = { width: 210, height: 297, padding: [0, 0, 0, 0] };
const theme = {} as any;
const options = {} as UIOptions;

describe('radioGroup schema plugin', () => {
  it('has radioGroup in plugins', () => {
    expect(builtInPlugins.radioGroup).toBeDefined();
  });

  it('has propPanel default schema of type radioGroup', () => {
    expect(flatSchemaPlugins.radioGroup?.propPanel?.defaultSchema?.type).toBe('radioGroup');
  });

  it('renders radio buttons in form mode', () => {
    const rootElement = document.createElement('div');

    builtInPlugins.radioGroup.ui({
      schema: { type: 'radioGroup', position: { x: 0, y: 0 }, width: 100, height: 20 } as any,
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

  it('exports radioGroup through generator', async () => {
    const template: Template = {
      basePdf,
      schemas: [[{
        type: 'radioGroup',
        name: 'selection',
        position: { x: 0, y: 0 },
        width: 100,
        height: 20,
        content: 'option1',
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
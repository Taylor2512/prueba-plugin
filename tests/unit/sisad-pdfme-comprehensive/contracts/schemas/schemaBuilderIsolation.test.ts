import { describe, expect, it, vi } from 'vitest';
import type { Plugin } from '@sisad-pdfme/common';
import { createSchemaPlugin } from '../../../../../src/sisad-pdfme/schemas/schemaBuilder';

const definition = {
  key: 'test-schema',
  type: 'test',
  label: 'Test schema',
  category: 'Test',
};

const plugin = createSchemaPlugin({
  pdf: () => undefined,
  ui: ({ onChange }) => onChange?.([{ key: 'content', value: 'changed' }]),
  propPanel: { defaultSchema: { type: 'test', name: '' } },
} as Plugin, definition);

const render = (rootElement: HTMLDivElement, onChange: () => void) =>
  plugin.ui({
    schema: { id: 'same-id', type: 'test', name: 'field' },
    rootElement,
    onChange,
  } as never);

describe('schema plugin emission isolation', () => {
  it('does not suppress the first emission from a second Form root with the same schema id', async () => {
    const firstChange = vi.fn();
    const secondChange = vi.fn();

    await render(document.createElement('div'), firstChange);
    await render(document.createElement('div'), secondChange);

    expect(firstChange).toHaveBeenCalledTimes(1);
    expect(secondChange).toHaveBeenCalledTimes(1);
  });

  it('still suppresses an identical duplicate emission within one root', async () => {
    const onChange = vi.fn();
    const root = document.createElement('div');

    await render(root, onChange);
    await render(root, onChange);

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

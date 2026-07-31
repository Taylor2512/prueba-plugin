import { describe, expect, it, vi } from 'vitest';

vi.mock('@/sisad-pdfme/react', () => ({
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

vi.mock('@sisad-pdfme/schemas', () => {
  const builtInSchemaDefinitions = [
    { type: 'text' },
    { type: 'checkbox' },
    { type: 'signature' },
  ];

  return {
    builtInSchemaDefinitions,
    createDefaultSchema: (type: string, context: Record<string, unknown> = {}) => ({
      type,
      name: `${type}-${String(context.id || 'schema')}`,
      id: context.id || `${type}-schema`,
      schemaUid: context.schemaUid || `${type}-uid`,
      position: context.position || { x: 0, y: 0 },
      width: type === 'checkbox' ? 8 : type === 'signature' ? 60 : 45,
      height: type === 'checkbox' ? 8 : type === 'signature' ? 20 : 7,
      content: '',
    }),
    resolveSchemaFamily: (type: string) => {
      if (type === 'checkbox') return 'boolean';
      if (type === 'signature') return 'signature';
      return 'text';
    },
  };
});

import {
  buildShowcaseTemplate,
  createRuntimeConfig,
  FAMILY_EXAMPLES,
  PRIMARY_ROUTE_GROUPS,
  getLabExamples,
} from '@/examples/index.jsx';

describe('src/examples data helpers', () => {
  it('exposes the route registry from the component package', () => {
    const routes = getLabExamples();

    expect(routes).toHaveLength(PRIMARY_ROUTE_GROUPS.length + FAMILY_EXAMPLES.length);
  });

  it('builds a showcase template using the plugin dimensions', () => {
    const template = buildShowcaseTemplate([{ title: 'Demo', types: ['text', 'checkbox', 'signature'] }]);

    expect(template.schemas).toHaveLength(1);
    expect(template.schemas[0][0]).toMatchObject({ type: 'text', width: 45, height: 7 });
    expect(template.schemas[0][1]).toMatchObject({ type: 'checkbox', width: 8, height: 8 });
    expect(template.schemas[0][2]).toMatchObject({ type: 'signature', width: 60, height: 20 });
  });

  it('keeps the base runtime config mutable-free per call', () => {
    const first = createRuntimeConfig('runtime-viewer');
    const second = createRuntimeConfig('runtime-viewer');

    expect(first).not.toBe(second);
    expect(first.runtime?.mode).toBe('viewer');
    expect(second.runtime?.mode).toBe('viewer');
  });
});

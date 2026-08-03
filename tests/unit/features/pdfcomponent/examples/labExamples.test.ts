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
    getBuiltInFields: () => builtInSchemaDefinitions.map((definition) => ({ ...definition })),
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
    getSchemaFamily: (type: string) => {
      if (type === 'checkbox') return 'boolean';
      if (type === 'signature') return 'signature';
      return 'text';
    },
    resolveSchemaFamily: (type: string) => {
      if (type === 'checkbox') return 'boolean';
      if (type === 'signature') return 'signature';
      return 'text';
    },
  };
});

import {
  FAMILY_EXAMPLES,
} from '@/examples/catalog/familyCatalog.js';
import { buildShowcaseTemplate } from '@/examples/builders/showcaseTemplate.js';
import { createRuntimeConfig as createRuntimeConfigLocal } from '@/examples/config/runtimeConfig.js';
import {
  EXAMPLE_ROUTE_PATHS,
  PRIMARY_ROUTE_GROUPS,
  getExampleRouteCatalog,
  getExampleSchemaRoute,
} from '@/examples/routes/routeDefinitions.js';

describe('src/examples data helpers', () => {
  it('exposes the route registry from the component package', () => {
    const routes = getExampleRouteCatalog();

    expect(routes).toHaveLength(PRIMARY_ROUTE_GROUPS.length + FAMILY_EXAMPLES.length);
    expect(routes.map((route) => route.path)).toEqual(
      expect.arrayContaining([
        EXAMPLE_ROUTE_PATHS.catalog,
        EXAMPLE_ROUTE_PATHS.designerSingleUser,
        EXAMPLE_ROUTE_PATHS.designerMultiUser,
        EXAMPLE_ROUTE_PATHS.runtimeForm,
        EXAMPLE_ROUTE_PATHS.runtimeViewer,
        EXAMPLE_ROUTE_PATHS.schemas,
        getExampleSchemaRoute('boolean'),
      ]),
    );
  });

  it('builds a showcase template using the plugin dimensions', () => {
    const template = buildShowcaseTemplate([{ title: 'Demo', types: ['text', 'checkbox', 'signature'] }]);

    expect(template.schemas).toHaveLength(1);
    expect(template.schemas[0][0]).toMatchObject({ type: 'text', width: 45, height: 7 });
    expect(template.schemas[0][1]).toMatchObject({ type: 'checkbox', width: 8, height: 8 });
    expect(template.schemas[0][2]).toMatchObject({ type: 'signature', width: 60, height: 20 });
  });

  it('keeps the base runtime config mutable-free per call', () => {
    const first = createRuntimeConfigLocal('runtime-viewer');
    const second = createRuntimeConfigLocal('runtime-viewer');

    expect(first).not.toBe(second);
    expect(first.runtime?.mode).toBe('viewer');
    expect(second.runtime?.mode).toBe('viewer');
  });
});

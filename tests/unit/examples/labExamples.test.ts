import { describe, expect, it, vi } from 'vitest';

vi.mock('@/sisad-pdfme/react', () => ({
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

vi.mock('@/sisad-pdfme', () => ({
  SisadPdfmeInstance: () => null,
  defineSisadPdfmeInstance: (value: unknown) => value,
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

vi.mock('@sisad-pdfme/schemas', () => {
  const builtInSchemaDefinitions = [
    { type: 'text' },
    { type: 'multiVariableText' },
    { type: 'select' },
    { type: 'checkbox' },
    { type: 'date' },
    { type: 'datetime' },
    { type: 'signature' },
    { type: 'initials' },
    { type: 'dateSigned' },
    { type: 'table' },
    { type: 'qrcode' },
    { type: 'rectangle' },
    { type: 'image' },
    { type: 'line' },
    { type: 'attachment' },
  ];

  const familyByType: Record<string, string> = {
    text: 'text',
    multiVariableText: 'multiVariableText',
    select: 'choice',
    checkbox: 'boolean',
    date: 'dateTime',
    datetime: 'dateTime',
    signature: 'signature',
    initials: 'signature',
    dateSigned: 'signature',
    table: 'table',
    qrcode: 'barcode',
    rectangle: 'shape',
    image: 'media',
    line: 'shape',
    attachment: 'action',
  };

  // Medidas naturales por tipo, como las declara `propPanel.defaultSchema`.
  // El generador debe respetarlas, así que el mock tiene que variarlas.
  const naturalSizeByType: Record<string, { width: number; height: number }> = {
    checkbox: { width: 8, height: 8 },
    qrcode: { width: 30, height: 30 },
    signature: { width: 60, height: 20 },
    table: { width: 400, height: 40 },
  };

  return {
    builtInSchemaDefinitions,
    getBuiltInFields: () => builtInSchemaDefinitions.map((definition) => ({ ...definition })),
    createDefaultSchema: (type: string, context: Record<string, unknown> = {}) => ({
      type,
      name: `${type}-${String(context.id || 'schema')}`,
      id: context.id || `${type}-schema`,
      schemaUid: context.schemaUid || `${type}-uid`,
      position: context.position || { x: 0, y: 0 },
      ...(naturalSizeByType[type] || { width: 45, height: 7 }),
      content: '',
    }),
    getSchemaFamily: (type: string) => familyByType[type] || 'text',
    resolveSchemaFamily: (type: string) => familyByType[type] || 'text',
  };
});

import { FAMILY_EXAMPLES } from '@/examples/catalog/familyCatalog.js';
import { buildShowcaseTemplate } from '@/examples/builders/showcaseTemplate.js';
import { createRuntimeConfig } from '@/examples/config/runtimeConfig.js';
import {
  EXAMPLE_ROUTE_PATHS,
  PRIMARY_ROUTE_GROUPS,
  getExampleRouteCatalog,
  getExampleSchemaRoute,
} from '@/examples/routes/routeDefinitions.js';

describe('src/examples/labExamples', () => {
  it('exposes the primary routes and one route per schema family', () => {
    const routes = getExampleRouteCatalog();
    const paths = routes.map((route) => route.path);

    expect(paths).toContain(EXAMPLE_ROUTE_PATHS.catalog);
    expect(paths).toContain(EXAMPLE_ROUTE_PATHS.designerSingleUser);
    expect(paths).toContain(EXAMPLE_ROUTE_PATHS.designerMultiUser);
    expect(paths).toContain(EXAMPLE_ROUTE_PATHS.runtimeForm);
    expect(paths).toContain(EXAMPLE_ROUTE_PATHS.runtimeViewer);
    expect(paths).toContain(EXAMPLE_ROUTE_PATHS.schemas);
    expect(paths).toContain(getExampleSchemaRoute('boolean'));

    FAMILY_EXAMPLES.forEach((family) => {
      expect(paths).toContain(getExampleSchemaRoute(family.slug));
    });

    expect(new Set(paths).size).toBe(paths.length);
    expect(routes).toHaveLength(PRIMARY_ROUTE_GROUPS.length + FAMILY_EXAMPLES.length);
  });

  it('builds a multi-page showcase template from the declared families', () => {
    const template = buildShowcaseTemplate(
      FAMILY_EXAMPLES.map((family) => ({
        title: family.title,
        types: family.types,
      })),
    );

    expect(template.basePdf).toEqual({
      width: 210,
      height: 297,
      padding: [15, 15, 15, 15],
    });
    expect(template.schemas.length).toBeGreaterThan(1);
    expect(template.schemas.flat().length).toBeGreaterThan(0);
  });

  it('respeta el tamaño natural de cada plugin en lugar de estirar los schemas', () => {
    const template = buildShowcaseTemplate([
      { title: 'Mixto', types: ['text', 'checkbox', 'qrcode', 'signature'] },
    ]);
    const byType = new Map(template.schemas.flat().map((schema) => [schema.type, schema]));

    expect(byType.get('text')).toMatchObject({ width: 45, height: 7 });
    expect(byType.get('checkbox')).toMatchObject({ width: 8, height: 8 });
    expect(byType.get('qrcode')).toMatchObject({ width: 30, height: 30 });
    expect(byType.get('signature')).toMatchObject({ width: 60, height: 20 });
  });

  it('acomoda los schemas dentro de la caja de contenido, recortando solo lo que no cabe', () => {
    const template = buildShowcaseTemplate(
      FAMILY_EXAMPLES.map((family) => ({ title: family.title, types: family.types })),
    );

    const contentWidth = 210 - 15 - 15;
    const contentHeight = 297 - 15 - 15;

    template.schemas.flat().forEach((schema) => {
      expect(schema.width).toBeLessThanOrEqual(contentWidth);
      expect(schema.position.x + schema.width).toBeLessThanOrEqual(15 + contentWidth);
      expect(schema.position.y + schema.height).toBeLessThanOrEqual(15 + contentHeight);
    });

    // Varios campos comparten fila: el layout ya no es una banda por schema.
    const firstPage = template.schemas[0];
    const firstRowY = firstPage[0].position.y;
    expect(firstPage.filter((schema) => schema.position.y === firstRowY).length).toBeGreaterThan(1);
  });

  it('numera las páginas de forma global entre grupos', () => {
    const template = buildShowcaseTemplate([
      { title: 'A', types: ['text'] },
      { title: 'B', types: ['checkbox'] },
    ]);

    expect(template.schemas).toHaveLength(2);
    expect(template.schemas[0][0].pageNumber).toBe(1);
    expect(template.schemas[1][0].pageNumber).toBe(2);
  });
});

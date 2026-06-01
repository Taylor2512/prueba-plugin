import { describe, expect, test } from 'vitest';
import { buildInspectorSections } from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.js';
import type { SchemaForUI } from '../../src/sisad-pdfme/common/index.js';

const schema = {
  id: 'schema-1',
  name: 'field_name',
  type: 'text',
  content: 'Hola',
  position: { x: 12, y: 20 },
  width: 120,
  height: 24,
  rotate: 0,
  opacity: 1,
  readOnly: false,
  required: true,
  ownerRecipientId: 'recipient-1',
  ownerRecipientName: 'Cliente Principal',
  ownerColor: '#2563EB',
  commentsCount: 1,
  comments: [{ id: 'c-1', text: 'ok' }],
} as unknown as SchemaForUI;

const sections = () =>
  buildInspectorSections({
    activeSchemaType: 'text',
    activeSchema: schema,
    schemaConfig: {
      api: { enabled: true, endpoint: '/api/schema' },
      persistence: { enabled: true, key: 'field_name' },
      collaboration: { ownerRecipientId: 'recipient-1' },
    },
    typedI18n: (key: string) => key,
    defaultSchema: {
      readOnly: false,
      rotate: 0,
      opacity: 1,
    },
    pluginProps: {
      color: { title: 'Color', type: 'string', widget: 'color' },
      textAlign: { title: 'Alinear texto', type: 'string', widget: 'select' },
      fontSize: { title: 'Tamaño fuente', type: 'number', widget: 'inputNumber' },
    },
    pageSize: { width: 210, height: 297 },
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    maxWidth: 210,
    maxHeight: 297,
    validateUniqueSchemaName: () => true,
    validatePosition: () => true,
  });

const expectProperty = (allSections: ReturnType<typeof sections>, propertyKey: string) => {
  const found = allSections.some((section) => Boolean(section.schema.properties?.[propertyKey]));
  expect(found, `Property ${propertyKey} should be present in inspector matrix`).toBe(true);
};

describe('DetailView schema matrix', () => {
  test('covers identity and inline actions contract', () => {
    const allSections = sections();
    expectProperty(allSections, 'name');
    expectProperty(allSections, 'inlineEditActions');
  });

  test('covers box geometry and alignment contract', () => {
    const allSections = sections();
    expectProperty(allSections, 'align');
    expectProperty(allSections, 'position');
    expectProperty(allSections, 'width');
    expectProperty(allSections, 'height');
  });

  test('covers behavior and advanced properties', () => {
    const allSections = sections();
    expectProperty(allSections, 'editable');
    expectProperty(allSections, 'required');
    expectProperty(allSections, 'rotate');
    expectProperty(allSections, 'opacity');
  });

  test('covers collaboration, comments and data bindings sections when metadata exists', () => {
    const allSections = sections();
    const keys = allSections.map((section) => section.key);

    expect(keys).toContain('collaboration');
    expect(keys).toContain('comments');
    expect(keys).toContain('dataBindings');
  });

  test('keeps canonical section ordering stable for inspector UX', () => {
    const allSections = sections();
    const keys = allSections.map((section) => section.key);
    const canonicalOrder = ['identity', 'box', 'appearance', 'behavior', 'dataBindings', 'collaboration', 'comments', 'advanced'];
    const sorted = [...keys].sort((a, b) => canonicalOrder.indexOf(a) - canonicalOrder.indexOf(b));
    expect(keys).toEqual(sorted);
  });
});

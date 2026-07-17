import { describe, expect, test } from 'vitest';
import checkboxGroup from '@/sisad-pdfme/schemas/checkboxGroup/index.js';
import { buildInspectorSections } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.js';
import { CANONICAL_DETAIL_SECTION_ORDER } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSectionTaxonomy.js';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';

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

const checkboxGroupSections = () => {
  const pluginProps =
    typeof checkboxGroup.propPanel.schema === 'function'
      ? checkboxGroup.propPanel.schema({ i18n: (key: string) => key })
      : checkboxGroup.propPanel.schema;

  return buildInspectorSections({
    activeSchemaType: 'checkboxGroup',
    activeSchema: {
      id: 'checkbox-group-1',
      name: 'checkbox_group',
      type: 'checkboxGroup',
      content: 'option_1',
      position: { x: 12, y: 20 },
      width: 140,
      height: 48,
      options: [
        { optionId: 'option_1', label: 'Casilla 1' },
        { optionId: 'option_2', label: 'Casilla 2' },
      ],
      selectedOptionIds: ['option_1'],
      minSelected: 1,
      maxSelected: 2,
      groupId: 'Grupo_Casillas',
      groupName: 'Grupo de casillas',
      color: '#2563EB',
      __designer: {
        group: {
          groupId: 'Grupo_Casillas',
          groupType: 'checkbox',
          groupName: 'Grupo de casillas',
          lockedAsGroup: true,
        },
      },
    } as unknown as SchemaForUI,
    schemaConfig: undefined,
    typedI18n: (key: string) => key,
    defaultSchema: checkboxGroup.propPanel.defaultSchema as Record<string, unknown>,
    pluginProps: pluginProps as Record<string, unknown>,
    inspectorConfig: checkboxGroup.propPanel.inspector,
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
};

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

  test('covers checkboxGroup inspector fields for option limits and option editing', () => {
    const allSections = checkboxGroupSections();
    expectProperty(allSections, 'groupId');
    expectProperty(allSections, 'groupName');
    expectProperty(allSections, 'lockedAsGroup');
    expectProperty(allSections, 'orientation');
    expectProperty(allSections, 'spacing');
    expectProperty(allSections, 'minSelected');
    expectProperty(allSections, 'maxSelected');
    expectProperty(allSections, 'optionsContainer');
  });

  test('keeps canonical section ordering stable for inspector UX', () => {
    const allSections = sections();
    const keys = allSections.map((section) => section.key);
    const canonicalOrder = [...CANONICAL_DETAIL_SECTION_ORDER];
    const sorted = [...keys].sort((a, b) => canonicalOrder.indexOf(a) - canonicalOrder.indexOf(b));
    expect(keys).toEqual(sorted);
  });
});

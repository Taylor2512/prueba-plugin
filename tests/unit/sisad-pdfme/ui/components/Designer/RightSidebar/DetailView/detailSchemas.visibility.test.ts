import { describe, expect, it } from 'vitest';
import { buildInspectorSections } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';

describe('detailSchemas visibility', () => {
  it('hides the advanced section when visibility.inspector.sections.advanced is false', () => {
    const sections = buildInspectorSections({
      activeSchemaType: 'text',
      activeSchema: { id: 'schema-1', type: 'text' } as SchemaForUI,
      schemaConfig: null,
      typedI18n: (key) => key,
      defaultSchema: {},
      pluginProps: {},
      inspectorConfig: undefined,
      pageSize: { width: 210, height: 297 },
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      maxWidth: 210,
      maxHeight: 297,
      validateUniqueSchemaName: () => true,
      validatePosition: () => true,
      visibility: {
        inspector: {
          visible: true,
          sections: {
            advanced: false,
          },
        },
      },
    });

    expect(sections.some((section) => section.key === 'advanced')).toBe(false);
  });

  it('hides the inspector entirely when visibility.inspector.visible is false', () => {
    const sections = buildInspectorSections({
      activeSchemaType: 'text',
      activeSchema: { id: 'schema-1', type: 'text' } as SchemaForUI,
      schemaConfig: null,
      typedI18n: (key) => key,
      defaultSchema: {},
      pluginProps: {},
      inspectorConfig: undefined,
      pageSize: { width: 210, height: 297 },
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      maxWidth: 210,
      maxHeight: 297,
      validateUniqueSchemaName: () => true,
      validatePosition: () => true,
      visibility: {
        inspector: {
          visible: false,
        },
      },
    });

    expect(sections).toEqual([]);
  });

  it('hides the advanced section when showTechnical is false', () => {
    const sections = buildInspectorSections({
      activeSchemaType: 'text',
      activeSchema: { id: 'schema-1', type: 'text', schemaUid: 'uid-1' } as SchemaForUI,
      schemaConfig: null,
      typedI18n: (key) => key,
      defaultSchema: {},
      pluginProps: {
        debug: {
          title: 'Debug',
          type: 'string',
          widget: 'input',
        },
      },
      inspectorConfig: undefined,
      pageSize: { width: 210, height: 297 },
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      maxWidth: 210,
      maxHeight: 297,
      validateUniqueSchemaName: () => true,
      validatePosition: () => true,
      visibility: {
        inspector: {
          visible: true,
          showTechnical: false,
        },
      },
    });

    expect(sections.some((section) => section.key === 'advanced')).toBe(false);
  });
});

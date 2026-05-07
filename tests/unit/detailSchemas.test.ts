import { describe, expect, it } from 'vitest';
import { buildInspectorSections } from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.js';
import { createSchemaInspectorConfig } from '../../src/sisad-pdfme/schemas/index.js';

const typedI18n = (key: string) => key;

const baseParams = {
  typedI18n,
  defaultSchema: {},
  pluginProps: {},
  pageSize: { width: 210, height: 297 },
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  maxWidth: 210,
  maxHeight: 297,
  validateUniqueSchemaName: () => true,
  validatePosition: () => true,
};

describe('buildInspectorSections', () => {
  it('hides the editable type selector and keeps the variable name in identity', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'text',
      pluginProps: {
        fontName: {
          title: 'Fuente',
          type: 'string',
          widget: 'select',
        },
      },
    });

    const identity = sections.find((section) => section.key === 'identity');
    const appearance = sections.find((section) => section.key === 'appearance');
    expect(identity).toBeDefined();
    expect((identity?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('name');
    expect((identity?.schema as { properties?: Record<string, unknown> }).properties).not.toHaveProperty('type');
    expect((appearance?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('fontName');
  });

  it.each(['image', 'svg'] as const)(
    'renders %s schemas with canonical shell sections but no empty collaboration/comments',
    (activeSchemaType) => {
      const sections = buildInspectorSections({
        ...baseParams,
        activeSchemaType,
        defaultSchema: { rotate: 0, opacity: 1 },
      });

      expect(sections.map((section) => section.key)).toEqual([
        'identity',
        'box',
        'advanced',
      ]);
    },
  );

  it('routes signature placeholder to behavior and colors to appearance', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'signature',
      pluginProps: {
        placeholderText: {
          title: 'Texto de ayuda',
          type: 'string',
        },
        strokeColor: {
          title: 'Color del trazo',
          type: 'string',
          widget: 'color',
        },
      },
    });

    const behavior = sections.find((section) => section.key === 'behavior');
    const appearance = sections.find((section) => section.key === 'appearance');

    expect((behavior?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('placeholderText');
    expect((appearance?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('strokeColor');
  });

  it('supports propertyMap aliases in inspector config', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'text',
      inspectorConfig: {
        propertyMap: {
          customField: 'data',
        },
      },
      pluginProps: {
        customField: {
          title: 'Custom',
          type: 'string',
        },
      },
    });

    const behavior = sections.find((section) => section.key === 'behavior');
    expect((behavior?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('customField');
  });

  it('keeps table schemas data-aware while hiding empty collaboration/comments', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'table',
      defaultSchema: { rotate: 0, opacity: 1 },
    });

    expect(sections.map((section) => section.key)).toEqual([
      'identity',
      'box',
      'behavior',
      'dataBindings',
      'advanced',
    ]);
  });

  it('re-exports the family-aware inspector factory from the schemas barrel', () => {
    const mediaInspectorConfig = createSchemaInspectorConfig('media');

    expect(mediaInspectorConfig.supportsConnections).toBe(false);
    expect(mediaInspectorConfig.supportsCollaboration).toBe(true);
    expect(mediaInspectorConfig.supportsValidation).toBe(false);
    expect(mediaInspectorConfig.visibleSections).toEqual(['general', 'layout', 'style', 'collaboration', 'comments', 'advanced']);
  });
});

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
  it('hides the editable type selector and keeps the variable name in general', () => {
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

    const general = sections.find((section) => section.key === 'general');
    const style = sections.find((section) => section.key === 'style');
    expect(general).toBeDefined();
    expect((general?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('name');
    expect((general?.schema as { properties?: Record<string, unknown> }).properties).not.toHaveProperty('type');
    expect((style?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('fontName');
  });

  it.each(['image', 'svg'] as const)(
    'renders %s schemas with persistence and collaboration sections but no validation',
    (activeSchemaType) => {
      const sections = buildInspectorSections({
        ...baseParams,
        activeSchemaType,
        defaultSchema: { rotate: 0, opacity: 1 },
      });

      expect(sections.map((section) => section.key)).toEqual([
        'general',
        'layout',
        'collaboration',
        'advanced',
      ]);
    },
  );

  it('routes signature placeholder to data and colors to style', () => {
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

    const data = sections.find((section) => section.key === 'data');
    const style = sections.find((section) => section.key === 'style');

    expect((data?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('placeholderText');
    expect((style?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('strokeColor');
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

    const data = sections.find((section) => section.key === 'data');
    expect((data?.schema as { properties?: Record<string, unknown> }).properties).toHaveProperty('customField');
  });

  it('keeps table schemas connected and collaborative while hiding validation', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'table',
      defaultSchema: { rotate: 0, opacity: 1 },
    });

    expect(sections.map((section) => section.key)).toEqual([
      'general',
      'layout',
      'data',
      'connections',
      'collaboration',
      'advanced',
    ]);
  });

  it('re-exports the family-aware inspector factory from the schemas barrel', () => {
    const mediaInspectorConfig = createSchemaInspectorConfig('media');

    expect(mediaInspectorConfig.supportsConnections).toBe(false);
    expect(mediaInspectorConfig.supportsCollaboration).toBe(true);
    expect(mediaInspectorConfig.supportsValidation).toBe(false);
    expect(mediaInspectorConfig.visibleSections).toEqual(['general', 'layout', 'style', 'collaboration', 'advanced']);
  });
});
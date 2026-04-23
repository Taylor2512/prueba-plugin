import { describe, expect, it } from 'vitest';
import { buildInspectorSections } from '../../src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.js';
import { getSchemaTypeInspectorPreset } from '../../src/sisad-pdfme/schemas/schemaFamilies.js';

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

describe('inspector comments section', () => {
  it('includes a comments section for text schemas', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'text',
    });
    const keys = sections.map((s) => s.key);
    expect(keys).toContain('comments');
  });

  it('includes a comments section for checkbox schemas', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'checkbox',
    });
    const keys = sections.map((s) => s.key);
    expect(keys).toContain('comments');
  });

  it('includes a comments section for table schemas', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'table',
      defaultSchema: { rotate: 0, opacity: 1 },
    });
    const keys = sections.map((s) => s.key);
    expect(keys).toContain('comments');
  });

  it('does NOT include a comments section for image schemas (not in visibleSections)', () => {
    const preset = getSchemaTypeInspectorPreset('image');
    // mediaVisual supports comments but its visibleSections does not include 'comments',
    // so the section is absent from the rendered inspector output.
    expect(preset.visibleSections).not.toContain('comments');

    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'image',
      defaultSchema: { rotate: 0, opacity: 1 },
    });
    const keys = sections.map((s) => s.key);
    expect(keys).not.toContain('comments');
  });

  it('registers the SchemaFieldCommentsWidget in the comments section schema', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'text',
    });
    const commentsSection = sections.find((s) => s.key === 'comments');
    expect(commentsSection).toBeDefined();
    const props = (commentsSection?.schema as { properties?: Record<string, { widget?: string }> }).properties;
    expect(props).toBeDefined();
    const fieldComments = props?.fieldComments;
    expect(fieldComments?.widget).toBe('SchemaFieldCommentsWidget');
  });

  it('comments section has correct metadata', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'text',
    });
    const commentsSection = sections.find((s) => s.key === 'comments');
    expect(commentsSection?.title).toBe('Comentarios');
    expect(commentsSection?.defaultCollapsed).toBe(false);
  });
});

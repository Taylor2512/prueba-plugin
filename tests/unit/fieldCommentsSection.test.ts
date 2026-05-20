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
  it('does not render a comments section when there are no comments', () => {
    const textSections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'text',
    });
    expect(textSections.map((s) => s.key)).not.toContain('comments');

    const checkboxSections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'checkbox',
    });
    expect(checkboxSections.map((s) => s.key)).not.toContain('comments');

    const tableSections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'table',
      defaultSchema: { rotate: 0, opacity: 1 },
    });
    expect(tableSections.map((s) => s.key)).not.toContain('comments');
  });

  it('renders a comments section when the active schema carries comments metadata', () => {
    const sections = buildInspectorSections({
      ...baseParams,
      activeSchemaType: 'text',
      defaultSchema: { rotate: 0, opacity: 1 },
      pluginProps: {},
      activeSchema: {
        id: 'schema-1',
        name: 'campo',
        type: 'text',
        commentsCount: 1,
        comments: [
          {
            id: 'comment-1',
            scope: 'schema',
            authorId: 'user-1',
            authorName: 'Ana',
            timestamp: 1700000000000,
            text: 'Revisar este campo',
            resolved: false,
            replies: [],
          },
        ],
      } as never,
    });

    const commentsSection = sections.find((section) => section.key === 'comments');
    expect(commentsSection).toBeDefined();
    expect(commentsSection?.title).toBe('Comentarios');
    expect(commentsSection?.defaultCollapsed).toBe(true);

    const props = (commentsSection?.schema as { properties?: Record<string, { widget?: string }> }).properties;
    expect(props?.fieldComments?.widget).toBe('SchemaFieldCommentsWidget');
  });

  it('keeps comments available in visibleSections for families that support review metadata', () => {
    const preset = getSchemaTypeInspectorPreset('image');
    expect(preset.visibleSections).toContain('comments');
  });
});

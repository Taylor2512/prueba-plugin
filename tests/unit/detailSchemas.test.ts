import { describe, expect, test } from 'vitest';
import { buildInspectorSections } from '@/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.js';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';
import type { SchemaDesignerConfig } from '@/sisad-pdfme/ui/designerEngine.js';

const baseSchema: SchemaForUI = {
  id: 'schema-1',
  name: 'field_1',
  type: 'text',
  content: 'Texto',
  position: { x: 24, y: 30 },
  width: 80,
  height: 20,
  readOnly: false,
  required: true,
} as SchemaForUI;

const createParams = (overrides?: Partial<Parameters<typeof buildInspectorSections>[0]>) => ({
  activeSchemaType: 'text',
  activeSchema: baseSchema,
  schemaConfig: null,
  typedI18n: (k: string) => k,
  defaultSchema: {
    readOnly: false,
    rotate: 0,
    opacity: 1,
  },
  pluginProps: {
    color: {
      title: 'Color',
      type: 'string',
      widget: 'color',
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
  ...overrides,
});

describe('buildInspectorSections', () => {
  test('builds canonical sections with key fields for DetailView use cases', () => {
    const sections = buildInspectorSections(createParams());
    const byKey = new Map(sections.map((section) => [section.key, section]));

    expect(byKey.has('identity')).toBe(true);
    expect(byKey.has('box')).toBe(true);
    // Interacción se renderiza porque aloja el único control de solo lectura:
    // el fallback `editable` dejó de sintetizarse en Reglas de llenado
    // (docs/03-designer/12-inspector-taxonomy.md §2, regla 2).
    expect(byKey.has('behavior')).toBe(true);
    expect(byKey.get('behavior')?.schema.properties?.editable).toBeDefined();
    expect(byKey.get('validation')?.schema.properties?.editable).toBeUndefined();
    expect(byKey.has('advanced')).toBe(false);

    const identity = byKey.get('identity');
    const box = byKey.get('box');
    const advanced = byKey.get('advanced');

    expect(identity?.schema.properties?.name).toBeDefined();
    expect(identity?.schema.properties?.inlineEditActions).toBeDefined();

    expect(box?.schema.properties?.align).toBeDefined();
    expect(box?.schema.properties?.position).toBeDefined();
    expect(box?.schema.properties?.width).toBeDefined();
    expect(box?.schema.properties?.height).toBeDefined();

    expect(advanced).toBeUndefined();
  });

  test('hides empty technical section and uses attachment-specific labels', () => {
    const sections = buildInspectorSections(
      createParams({
        activeSchemaType: 'attachment',
        activeSchema: {
          id: 'attachment-1',
          name: 'attach_file',
          type: 'attachment',
          position: { x: 10, y: 20 },
          width: 60,
          height: 24,
        } as SchemaForUI,
        pluginProps: {
          readonly: {
            title: 'Solo lectura',
            type: 'boolean',
            widget: 'checkbox',
          },
          allowReplace: {
            title: 'Reemplazar',
            type: 'boolean',
            widget: 'checkbox',
          },
        },
      }),
    );

    const keys = sections.map((section) => section.key);
    expect(keys).not.toContain('advanced');
  });

  test('replaces color widget by nativeColor recursively', () => {
    const sections = buildInspectorSections(
      createParams({
        pluginProps: {
          backgroundColor: {
            title: 'Fill',
            type: 'object',
            properties: {
              primary: {
                title: 'Primary',
                type: 'string',
                widget: 'color',
              },
            },
          },
        },
      }),
    );

    const sectionWithFill = sections.find((section) =>
      Boolean(section.schema.properties?.backgroundColor),
    );
    const fill = sectionWithFill?.schema.properties?.backgroundColor as {
      properties?: { primary?: { widget?: string } };
    };
    expect(fill?.properties?.primary?.widget).toBe('nativeColor');
  });

  test('shows collaboration/comments/dataBindings sections when corresponding metadata exists', () => {
    const sections = buildInspectorSections(
      createParams({
        activeSchema: {
          ...baseSchema,
          ownerRecipientId: 'recipient-1',
          ownerColor: '#00AA88',
          commentsCount: 2,
          comments: [{ id: 'c1', text: 'note' }],
        } as SchemaForUI,
        schemaConfig: {
          api: { enabled: true },
        } as SchemaDesignerConfig,
      }),
    );

    const keys = sections.map((section) => section.key);
    expect(keys).toContain('collaboration');
    expect(keys).toContain('comments');
    expect(keys).toContain('dataBindings');
  });

  test('applies expected validation constraints for position and unique name', () => {
    const sections = buildInspectorSections(createParams());
    const identity = sections.find((section) => section.key === 'identity');
    const box = sections.find((section) => section.key === 'box');

    const name = identity?.schema.properties?.name as { rules?: unknown[] };
    const position = box?.schema.properties?.position as {
      properties?: {
        x?: { min?: number; max?: number; rules?: unknown[] };
        y?: { min?: number; max?: number; rules?: unknown[] };
      };
    };

    expect(Array.isArray(name?.rules)).toBe(true);
    expect(name?.rules?.length).toBeGreaterThan(0);
    expect(position?.properties?.x?.props?.min).toBe(0);
    expect(position?.properties?.x?.props?.max).toBe(210);
    expect(position?.properties?.y?.props?.min).toBe(0);
    expect(position?.properties?.y?.props?.max).toBe(297);
  });
});

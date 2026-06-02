import { describe, expect, test } from 'vitest';
import {
  getSchemaDesignerConfig,
  mergeSchemaDesignerConfig,
  setSchemaDesignerConfig,
} from '@/sisad-pdfme/ui/designerEngine.js';
import type { SchemaForUI } from '@/sisad-pdfme/common/index.js';

const makeSchema = (): SchemaForUI =>
  ({
    id: 'schema-1',
    name: 'schema-1',
    type: 'text',
    content: 'hello',
    position: { x: 10, y: 12 },
    width: 80,
    height: 18,
  }) as SchemaForUI;

describe('designerEngine config merge', () => {
  test('merges nested collaboration fields without dropping ownerColor', () => {
    const schema = setSchemaDesignerConfig(makeSchema(), {
      collaboration: {
        ownerColor: '#123456',
        ownerRecipientId: 'r-1',
      },
      metadata: {
        source: 'seed',
      },
    });

    const updated = mergeSchemaDesignerConfig(schema, {
      collaboration: {
        ownerRecipientName: 'Alice',
      },
      metadata: {
        updatedBy: 'test',
      },
    });

    const config = getSchemaDesignerConfig(updated);
    expect(config?.collaboration?.ownerColor).toBe('#123456');
    expect(config?.collaboration?.ownerRecipientName).toBe('Alice');
    expect(config?.metadata).toEqual({
      source: 'seed',
      updatedBy: 'test',
    });
  });
});

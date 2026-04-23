import { describe, expect, it, vi } from 'vitest';
import {
  createCustomSchemaFromDefinition,
  getCustomSchemaDefinitions,
  subscribeCustomSchemaDefinitions,
  upsertCustomSchemaDefinition,
} from '../../src/sisad-pdfme/ui/components/Designer/schemaRegistry.js';

let seq = 0;
const nextId = () => `custom-test-${++seq}`;

describe('schemaRegistry exported functions', () => {
  it('rejects invalid definitions and accepts valid ones', () => {
    expect(upsertCustomSchemaDefinition({ id: '', label: 'X', pluginType: 'text' })).toBeNull();
    expect(upsertCustomSchemaDefinition({ id: nextId(), label: '', pluginType: 'text' })).toBeNull();
    expect(upsertCustomSchemaDefinition({ id: nextId(), label: 'Ok', pluginType: '' })).toBeNull();

    const created = upsertCustomSchemaDefinition({
      id: nextId(),
      label: 'Campo Personalizado',
      category: 'Contratos',
      pluginType: 'text',
      defaultValue: 'hola',
    });

    expect(created?.label).toBe('Campo Personalizado');
    expect(created?.category).toBe('Contratos');
    expect(created?.pluginType).toBe('text');
  });

  it('notifies subscribers on upsert and supports unsubscribe', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeCustomSchemaDefinitions(listener);

    upsertCustomSchemaDefinition({ id: nextId(), label: 'A', pluginType: 'text' });
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    upsertCustomSchemaDefinition({ id: nextId(), label: 'B', pluginType: 'text' });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('returns cloned definitions to avoid external mutation', () => {
    const id = nextId();
    upsertCustomSchemaDefinition({
      id,
      label: 'Mutabilidad',
      pluginType: 'text',
      defaultSchema: { width: 99 },
    });

    const firstRead = getCustomSchemaDefinitions().find((entry) => entry.id === id);
    expect(firstRead).toBeDefined();
    if (!firstRead) return;
    firstRead.label = 'Mutado';
    if (firstRead.defaultSchema) {
      firstRead.defaultSchema.width = 10;
    }

    const secondRead = getCustomSchemaDefinitions().find((entry) => entry.id === id);
    expect(secondRead?.label).toBe('Mutabilidad');
    expect(secondRead?.defaultSchema?.width).toBe(99);
  });

  it('creates schema from definition with defaults, recipient autofill and registry priority', () => {
    const id = nextId();
    upsertCustomSchemaDefinition({
      id,
      label: 'Cliente',
      pluginType: 'text',
      autoFillSource: 'contact.email',
      defaultSchema: {
        type: 'text',
        width: 200,
        height: 24,
        position: { x: 12, y: 34 },
      },
    });

    const schema = createCustomSchemaFromDefinition({
      definitionId: id,
      recipient: { contact: { email: 'test@example.com' } },
      overrides: {
        resolveBaseSchema: () => ({ width: 10, height: 10, position: { x: 1, y: 1 } }),
      },
    });

    expect(schema).not.toBeNull();
    expect(schema?.name).toBe('Cliente');
    expect(schema?.type).toBe('text');
    expect(schema?.width).toBe(200);
    expect(schema?.height).toBe(24);
    expect(schema?.position).toEqual({ x: 12, y: 34 });
    expect(schema?.content).toBe('test@example.com');
  });

  it('returns null for unknown definition and fills fallback schema shape', () => {
    expect(createCustomSchemaFromDefinition({ definitionId: 'missing' })).toBeNull();

    const id = nextId();
    upsertCustomSchemaDefinition({ id, label: 'Fallback', pluginType: 'signature' });
    const schema = createCustomSchemaFromDefinition({ definitionId: id });

    expect(schema?.position).toEqual({ x: 0, y: 0 });
    expect(schema?.width).toBe(120);
    expect(schema?.height).toBe(18);
    expect(schema?.content).toBe('');
    expect(schema?.type).toBe('signature');
  });
});

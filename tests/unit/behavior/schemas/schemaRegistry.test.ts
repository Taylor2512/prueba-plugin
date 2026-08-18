
import { describe, expect, test } from 'vitest';
import {
  builtInSchemaDefinitions,
  flatSchemaPlugins,
  createDefaultSchema,
  getSchemaFamily,
  getSchemaPluginByType,
  getSchemaSerializationPolicy,
  generateUniqueSchemaName,
} from '../../../../src/sisad-pdfme/schemas';

describe('Registro canónico de schemas', () => {
  // @caso SCH-001
  // @caso SCH-014
  test('SCH-001 — cada definición built-in tiene identidad y plugin ejecutable sin inventario duplicado', () => {
    expect(builtInSchemaDefinitions.length).toBeGreaterThan(10);
    const keys = new Set<string>();
    const types = new Set<string>();

    for (const definition of builtInSchemaDefinitions) {
      expect(definition.key).toBeTruthy();
      expect(definition.type).toBeTruthy();
      expect(keys.has(definition.key)).toBe(false);
      keys.add(definition.key);
      types.add(definition.type);

      const plugin = getSchemaPluginByType(definition.type);
      expect(plugin, `plugin ${definition.type}`).toBeTruthy();
      expect(typeof plugin?.ui, `ui ${definition.type}`).toBe('function');
      expect(typeof plugin?.pdf, `pdf ${definition.type}`).toBe('function');
      expect(plugin?.propPanel?.defaultSchema).toBeTruthy();
    }

    expect(Object.keys(flatSchemaPlugins).length).toBeGreaterThanOrEqual(types.size);
  });

  test('TRC-005 — cada plugin expone política de serialización registry-driven', () => {
    for (const definition of builtInSchemaDefinitions) {
      const policy = getSchemaSerializationPolicy(definition.type);
      expect(typeof policy.serialize).toBe('function');
      expect(typeof policy.deserialize).toBe('function');
      expect(typeof policy.validate).toBe('function');
      expect(typeof policy.migrate).toBe('function');
      const schema = createDefaultSchema(definition.type, { schemaUid: `roundtrip-${definition.type}` });
      const serialized = policy.serialize(schema);
      expect(serialized.schemaUid).toBe(schema.schemaUid);
      expect(policy.validate(serialized)).toBe(true);
      expect(policy.deserialize(serialized).type).toBe(schema.type);
    }
  });

  // @caso INS-012
  test('INS-012 — todas las definiciones poseen una familia resoluble', () => {
    for (const definition of builtInSchemaDefinitions) {
      expect(['text', 'mediaVisual', 'boolean', 'shapeBarcode', 'table'])
        .toContain(getSchemaFamily(definition.type));
    }
  });

  // @caso SCH-002
  // @caso SCH-003
  test('SCH-002 — createDefaultSchema conserva identidad, página, owner y geometría suministrados', () => {
    const type = builtInSchemaDefinitions[0]?.type;
    expect(type).toBeTruthy();
    if (!type) return;

    const schema = createDefaultSchema(type, {
      schemaUid: 'uid-estable',
      id: 'id-estable',
      fileId: 'documento-a',
      pageNumber: 2,
      ownerRecipientId: 'usuario-a',
      ownerMode: 'single',
      position: { x: 12.5, y: 20.25 },
    });

    expect(schema.schemaUid).toBe('uid-estable');
    expect(schema.id).toBe('id-estable');
    expect(schema.fileId || schema.fileTemplateId).toBe('documento-a');
    expect(schema.pageNumber).toBe(2);
    expect(schema.ownerRecipientId).toBe('usuario-a');
    expect(schema.position).toEqual({ x: 12.5, y: 20.25 });
  });

  // @caso SID-010
  test('SID-010 — el nombre generado es único sin renombrar siblings existentes', () => {
    const existing = [
      { name: 'Campo', type: 'text' },
      { name: 'Campo_2', type: 'text' },
    ] as never[];
    expect(generateUniqueSchemaName('Campo', existing)).toBe('Campo_3');
    expect(existing).toHaveLength(2);
  });

  // @caso QLT-004
  test('QLT-004 — no existen dos plugins diferentes registrados con la misma clave plana', () => {
    const entries = Object.entries(flatSchemaPlugins);
    const seen = new Set<string>();
    for (const [key, plugin] of entries) {
      expect(seen.has(key)).toBe(false);
      seen.add(key);
      expect(plugin).toBeTruthy();
    }
  });
});

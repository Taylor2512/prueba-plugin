/**
 * Tests: Schema Groups — GroupMeta + group/ungroup operations
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { GroupMeta } from '../../src/sisad-pdfme/shared/schemaDesignerMeta.js';
import { createSchemaDesignerMeta, duplicateSchemaDesignerMeta } from '../../src/sisad-pdfme/shared/schemaDesignerMeta.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

type SchemaLike = {
  id: string;
  name: string;
  type: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  __designer?: { group?: GroupMeta; [k: string]: unknown };
};

function makeSchema(overrides: Partial<SchemaLike> = {}): SchemaLike {
  return {
    id: `s-${Math.random().toString(36).slice(2)}`,
    name: 'campo',
    type: 'text',
    position: { x: 10, y: 10 },
    width: 50,
    height: 10,
    ...overrides,
  };
}

function makeGroupMeta(overrides: Partial<GroupMeta> = {}): GroupMeta {
  return {
    groupId: `grp-${Math.random().toString(36).slice(2)}`,
    groupType: 'visual',
    groupName: 'Mi Grupo',
    lockedAsGroup: false,
    ...overrides,
  };
}

// ── GroupMeta type contract ────────────────────────────────────────────────────

describe('GroupMeta type contract', () => {
  it('GroupMeta mínimo: requiere solo groupId y groupType', () => {
    const meta: GroupMeta = { groupId: 'gid-1', groupType: 'visual' };
    expect(meta.groupId).toBe('gid-1');
    expect(meta.groupType).toBe('visual');
  });

  it('admite todos los groupTypes válidos', () => {
    const types: GroupMeta['groupType'][] = ['visual', 'radio', 'checkbox', 'signatureBlock', 'table', 'repeatable'];
    for (const t of types) {
      const meta = makeGroupMeta({ groupType: t });
      expect(meta.groupType).toBe(t);
    }
  });

  it('campos opcionales se asignan correctamente', () => {
    const meta = makeGroupMeta({
      groupName: 'Firmas contrato',
      parentGroupId: 'parent-123',
      order: 2,
      lockedAsGroup: true,
    });
    expect(meta.groupName).toBe('Firmas contrato');
    expect(meta.parentGroupId).toBe('parent-123');
    expect(meta.order).toBe(2);
    expect(meta.lockedAsGroup).toBe(true);
  });
});

// ── SchemaDesignerMeta.group integration ────────────────────────────────────

describe('SchemaDesignerMeta.group', () => {
  it('createSchemaDesignerMeta no incluye group por defecto', () => {
    const meta = createSchemaDesignerMeta({
      documentId: 'doc-1',
      pageNumber: 1,
      templateVersion: '2.0.0',
    });
    expect(meta.group).toBeUndefined();
  });

  it('duplicateSchemaDesignerMeta preserva group del original', () => {
    const source = createSchemaDesignerMeta({
      documentId: 'doc-1',
      pageNumber: 1,
      templateVersion: '2.0.0',
    });
    source.group = makeGroupMeta({ groupId: 'grp-abc', groupType: 'radio' });
    const dup = duplicateSchemaDesignerMeta(source);
    expect(dup.group?.groupId).toBe('grp-abc');
    expect(dup.group?.groupType).toBe('radio');
    // Pero schemaUid es distinto
    expect(dup.schemaUid).not.toBe(source.schemaUid);
  });

  it('se puede asignar y leer group directamente en un schema', () => {
    const schema = makeSchema();
    const group = makeGroupMeta({ groupId: 'grp-xyz', groupType: 'visual' });
    schema.__designer = { group };
    expect(schema.__designer?.group?.groupId).toBe('grp-xyz');
  });
});

// ── Group/Ungroup operations (pure logic) ───────────────────────────────────

/**
 * Pure helpers that replicate the logic from selectionCommands.ts
 * without React or antd dependencies.
 */
const withGroupMeta = (schema: SchemaLike, group: GroupMeta | undefined): SchemaLike => {
  const existing = schema.__designer ?? {};
  if (group === undefined) {
    const { group: _removed, ...rest } = existing as Record<string, unknown> & { group?: unknown };
    return { ...schema, __designer: rest };
  }
  return { ...schema, __designer: { ...existing, group } };
};

const getGroupMeta = (schema: SchemaLike): GroupMeta | undefined =>
  schema.__designer?.group;

describe('groupSelection (pure logic)', () => {
  it('asigna el mismo groupId a todos los schemas seleccionados', () => {
    const schemas = [makeSchema({ id: 'a' }), makeSchema({ id: 'b' }), makeSchema({ id: 'c' })];
    const groupId = 'grp-test-1';
    const groupMeta: GroupMeta = { groupId, groupType: 'visual', groupName: 'Test', lockedAsGroup: false };

    const result = schemas.map((s, order) => withGroupMeta(s, { ...groupMeta, order }));

    expect(getGroupMeta(result[0])?.groupId).toBe(groupId);
    expect(getGroupMeta(result[1])?.groupId).toBe(groupId);
    expect(getGroupMeta(result[2])?.groupId).toBe(groupId);
  });

  it('asigna order incremental a los miembros del grupo', () => {
    const schemas = [makeSchema({ id: 'a' }), makeSchema({ id: 'b' })];
    const meta: GroupMeta = { groupId: 'grp-1', groupType: 'visual' };
    const result = schemas.map((s, i) => withGroupMeta(s, { ...meta, order: i }));
    expect(getGroupMeta(result[0])?.order).toBe(0);
    expect(getGroupMeta(result[1])?.order).toBe(1);
  });

  it('schemas no seleccionados conservan su group original (o sin group)', () => {
    const selected = [makeSchema({ id: 'a' }), makeSchema({ id: 'b' })];
    const bystander = makeSchema({ id: 'c' });
    const groupMeta: GroupMeta = { groupId: 'grp-only-ab', groupType: 'visual' };
    const selectedIds = new Set(['a', 'b']);

    const all = [...selected, bystander];
    const result = all.map((s, i) =>
      selectedIds.has(s.id) ? withGroupMeta(s, { ...groupMeta, order: i }) : s,
    );

    expect(getGroupMeta(result[0])?.groupId).toBe('grp-only-ab');
    expect(getGroupMeta(result[1])?.groupId).toBe('grp-only-ab');
    expect(getGroupMeta(result[2])).toBeUndefined(); // bystander untouched
  });

  it('no agrupa cuando hay menos de 2 schemas seleccionados', () => {
    // Guard: requires selection >= 2
    const schemas = [makeSchema({ id: 'a' })];
    const canGroup = schemas.length >= 2;
    expect(canGroup).toBe(false);
  });
});

describe('ungroupSelection (pure logic)', () => {
  it('elimina group de todos los miembros del grupo', () => {
    const groupMeta: GroupMeta = { groupId: 'grp-bye', groupType: 'visual' };
    const schemas = [
      withGroupMeta(makeSchema({ id: 'a' }), groupMeta),
      withGroupMeta(makeSchema({ id: 'b' }), groupMeta),
      makeSchema({ id: 'c' }), // no group
    ];

    const groupIds = new Set(['grp-bye']);
    const result = schemas.map((s) => {
      const meta = getGroupMeta(s);
      return meta && groupIds.has(meta.groupId) ? withGroupMeta(s, undefined) : s;
    });

    expect(getGroupMeta(result[0])).toBeUndefined();
    expect(getGroupMeta(result[1])).toBeUndefined();
    expect(getGroupMeta(result[2])).toBeUndefined(); // bystander unchanged
  });

  it('no afecta a schemas de otros grupos', () => {
    const groupA: GroupMeta = { groupId: 'grp-A', groupType: 'visual' };
    const groupB: GroupMeta = { groupId: 'grp-B', groupType: 'radio' };
    const schemas = [
      withGroupMeta(makeSchema({ id: 'a1' }), groupA),
      withGroupMeta(makeSchema({ id: 'b1' }), groupB),
    ];

    const groupIds = new Set(['grp-A']); // only ungroup A
    const result = schemas.map((s) => {
      const meta = getGroupMeta(s);
      return meta && groupIds.has(meta.groupId) ? withGroupMeta(s, undefined) : s;
    });

    expect(getGroupMeta(result[0])).toBeUndefined(); // A ungrouped
    expect(getGroupMeta(result[1])?.groupId).toBe('grp-B'); // B untouched
  });

  it('desagrupar un schema sin grupo no lanza error', () => {
    const schema = makeSchema({ id: 'x' });
    expect(() => withGroupMeta(schema, undefined)).not.toThrow();
    expect(getGroupMeta(withGroupMeta(schema, undefined))).toBeUndefined();
  });

  it('preserva otros campos __designer al desagrupar', () => {
    const schema = makeSchema({ id: 'a' });
    schema.__designer = {
      group: { groupId: 'grp-1', groupType: 'visual' },
      recipientId: 'rec-42',
    };
    const result = withGroupMeta(schema, undefined);
    expect(result.__designer?.group).toBeUndefined();
    expect((result.__designer as Record<string, unknown>)?.recipientId).toBe('rec-42');
  });
});

// ── RadioGroup resolveGroupKey ────────────────────────────────────────────────

describe('RadioGroup group key resolution priority', () => {
  // Replicates resolveGroupKey logic from schemas/radioGroup/index.ts
  const resolveGroupKey = (schema: {
    name: string;
    group?: string;
    groupId?: string;
    __designer?: { group?: GroupMeta };
  }): string =>
    schema.__designer?.group?.groupId ?? schema.groupId ?? schema.group ?? schema.name;

  it('prioridad 1: __designer.group.groupId', () => {
    expect(resolveGroupKey({
      name: 'opt1',
      group: 'legacy-name',
      groupId: 'legacy-id',
      __designer: { group: { groupId: 'designer-id', groupType: 'radio' } },
    })).toBe('designer-id');
  });

  it('prioridad 2: groupId cuando no hay __designer.group', () => {
    expect(resolveGroupKey({
      name: 'opt1',
      group: 'legacy-name',
      groupId: 'gid-42',
    })).toBe('gid-42');
  });

  it('prioridad 3: group (legacy) cuando no hay groupId', () => {
    expect(resolveGroupKey({
      name: 'opt1',
      group: 'MyGroup',
    })).toBe('MyGroup');
  });

  it('fallback: name cuando no hay ningún grupo configurado', () => {
    expect(resolveGroupKey({ name: 'opt1' })).toBe('opt1');
  });
});

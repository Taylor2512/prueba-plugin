
import { describe, expect, test } from 'vitest';
import {
  ExecutionScopeStore,
  SHARED_SCOPE_USER,
} from '../../../../src/sisad-pdfme/runtime/executionScopeStore';
import {
  commitScopedInput,
  deriveSchemaValueScopes,
  projectScopedInputs,
  scopedCellUid,
} from '../../../../src/sisad-pdfme/runtime/scopedInputProjection';

const scope = (userId: string, documentId = 'doc-a', runtimeSessionId = 'sesion-a') => ({
  runtimeSessionId,
  userId,
  documentId,
});

describe('Aislamiento y proyección de inputs del runtime', () => {
  // @caso RUN-004
  // @caso UC-21
  test('RUN-004 — conserva exactamente 0, false, cadena vacía y arreglo vacío como outputs canónicos', () => {
    const store = new ExecutionScopeStore();
    const current = scope('alice');
    const values = { cero: 0, falso: false, vacio: '', arreglo: [] as unknown[] };

    for (const [name, value] of Object.entries(values)) {
      const result = commitScopedInput({
        store,
        scope: current,
        payload: { index: 0, name, value },
        valueScopes: { [name]: 'per-user' },
      });
      expect(result.accepted).toBe(true);
    }

    const projected = projectScopedInputs({
      store,
      scope: current,
      baseInputs: [{ cero: 99, falso: true, vacio: 'x', arreglo: ['x'] }],
      valueScopes: { cero: 'per-user', falso: 'per-user', vacio: 'per-user', arreglo: 'per-user' },
    });

    expect(projected).toEqual([{ cero: 0, falso: false, vacio: '', arreglo: [] }]);
  });

  // @caso DOC-002
  // @caso SCH-002
  test('DOC-002 — dos documentos del mismo usuario nunca comparten la misma celda', () => {
    const store = new ExecutionScopeStore();
    commitScopedInput({
      store, scope: scope('alice', 'doc-a'),
      payload: { index: 0, name: 'nombre', value: 'ALICE-DOC-A' },
      valueScopes: { nombre: 'shared' },
    });
    commitScopedInput({
      store, scope: scope('alice', 'doc-b'),
      payload: { index: 0, name: 'nombre', value: 'ALICE-DOC-B' },
      valueScopes: { nombre: 'shared' },
    });

    expect(projectScopedInputs({
      store, scope: scope('alice', 'doc-a'), baseInputs: [{ nombre: '' }],
      valueScopes: { nombre: 'shared' },
    })).toEqual([{ nombre: 'ALICE-DOC-A' }]);

    expect(projectScopedInputs({
      store, scope: scope('alice', 'doc-b'), baseInputs: [{ nombre: '' }],
      valueScopes: { nombre: 'shared' },
    })).toEqual([{ nombre: 'ALICE-DOC-B' }]);
  });

  // @caso SCH-003
  // @caso UC-07
  test('SCH-003 — un valor per-user se aísla entre usuarios del mismo documento', () => {
    const store = new ExecutionScopeStore();
    const valueScopes = { privado: 'per-user' as const };
    commitScopedInput({ store, scope: scope('alice'), payload: { index: 0, name: 'privado', value: 'ALICE' }, valueScopes });
    commitScopedInput({ store, scope: scope('bob'), payload: { index: 0, name: 'privado', value: 'BOB' }, valueScopes });

    expect(projectScopedInputs({ store, scope: scope('alice'), baseInputs: [{ privado: '' }], valueScopes }))
      .toEqual([{ privado: 'ALICE' }]);
    expect(projectScopedInputs({ store, scope: scope('bob'), baseInputs: [{ privado: '' }], valueScopes }))
      .toEqual([{ privado: 'BOB' }]);
  });

  // @caso UC-07
  test('UC-07 — un valor shared converge entre usuarios sin perder el aislamiento por documento', () => {
    const store = new ExecutionScopeStore();
    const uid = scopedCellUid(0, 'compartido');
    const alice = scope('alice');
    const bob = scope('bob');

    expect(store.commit({
      scope: alice, schemaUid: uid, value: 'COMUN', expectedRevision: 0,
      executionId: 'alice-1', valueScope: 'shared',
    }).accepted).toBe(true);

    expect(store.get(bob, uid, 'shared')).toMatchObject({ value: 'COMUN', revision: 1 });
    expect(store.get(bob, uid, 'per-user')).toBeUndefined();
  });

  // @caso RUN-015
  test('RUN-015 — compare-and-swap rechaza una revisión obsoleta y conserva el valor aceptado', () => {
    const store = new ExecutionScopeStore();
    const current = scope('alice');
    const uid = scopedCellUid(0, 'campo');

    const first = store.commit({
      scope: current, schemaUid: uid, value: 'A',
      expectedRevision: 0, executionId: 'exec-a',
    });
    expect(first.accepted).toBe(true);

    const stale = store.commit({
      scope: current, schemaUid: uid, value: 'B',
      expectedRevision: 0, executionId: 'exec-b',
    });
    // Se comprueba el discriminante y el motivo en una sola aserción: el
    // proyecto compila con `strict: false`, así que estrechar la unión con un
    // guard no elimina el error de tipo y sí oscurece qué se está probando.
    expect(stale).toMatchObject({ accepted: false, conflict: { reason: 'stale-revision' } });
    expect(store.get(current, uid)?.value).toBe('A');
  });

  // @caso DECL-UC-019
  test('DECL-UC-019 — el scope explícito manda sobre la inferencia por owner o assignment', () => {
    const scopes = deriveSchemaValueScopes({
      schemas: [[
        { name: 'a', valueScope: 'shared', ownerMode: 'single' },
        { name: 'b', assignment: { valueScope: 'per-user', mode: 'shared' } },
        { name: 'c', assignment: { mode: 'single' } },
        { name: 'd' },
      ]],
    });
    expect(scopes).toEqual({ a: 'shared', b: 'per-user', c: 'per-user', d: 'shared' });
  });

  // @caso DOC-013
  test('DOC-013 — clearUser no elimina una celda shared', () => {
    const store = new ExecutionScopeStore();
    const uid = scopedCellUid(0, 'campo');
    store.commit({
      scope: scope('alice'), schemaUid: uid, value: 'COMUN',
      expectedRevision: 0, executionId: 'shared', valueScope: 'shared',
    });
    store.commit({
      scope: scope('alice'), schemaUid: scopedCellUid(0, 'privado'), value: 'PRIVADO',
      expectedRevision: 0, executionId: 'private', valueScope: 'per-user',
    });
    expect(store.clearUser('sesion-a', 'alice')).toBe(1);
    expect(store.get(scope('bob'), uid, 'shared')?.value).toBe('COMUN');
    expect(SHARED_SCOPE_USER).toBe('__shared__');
  });
});

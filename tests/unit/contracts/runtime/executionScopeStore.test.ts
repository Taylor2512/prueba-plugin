/**
 * Aislamiento y concurrencia optimista del estado de ejecución (RTP-485).
 *
 * El store aceptaba cualquier commit con `revision` mayor que la almacenada,
 * de modo que un cliente podía declarar `revision: 999` y ganar siempre,
 * saltándose la detección de conflicto. Ahora es un compare-and-swap: el
 * cliente declara la revisión que CREE tener y el store asigna la siguiente.
 */
import { describe, expect, it } from 'vitest';
import {
  SHARED_SCOPE_USER,
  createExecutionScopeStore,
  type RuntimeScope,
} from '@/sisad-pdfme/runtime/executionScopeStore';

const scope = (userId: string, documentId = 'doc-1'): RuntimeScope => ({
  runtimeSessionId: 'session-1',
  userId,
  documentId,
});

describe('aislamiento de scope', () => {
  it('aísla dos usuarios en el mismo realm de JS', () => {
    const store = createExecutionScopeStore();
    store.commit({ scope: scope('a'), schemaUid: 'field', value: 'A', expectedRevision: 0, executionId: 'exec-a' });
    store.commit({ scope: scope('b'), schemaUid: 'field', value: 'B', expectedRevision: 0, executionId: 'exec-b' });
    expect(store.get(scope('a'), 'field')?.value).toBe('A');
    expect(store.get(scope('b'), 'field')?.value).toBe('B');
  });

  it('aísla dos documentos del mismo usuario', () => {
    const store = createExecutionScopeStore();
    store.commit({ scope: scope('a', 'doc-1'), schemaUid: 'f', value: '1', expectedRevision: 0, executionId: 'e' });
    store.commit({ scope: scope('a', 'doc-2'), schemaUid: 'f', value: '2', expectedRevision: 0, executionId: 'e' });
    expect(store.get(scope('a', 'doc-1'), 'f')?.value).toBe('1');
    expect(store.get(scope('a', 'doc-2'), 'f')?.value).toBe('2');
  });

  it('no comparte estado entre dos instancias', () => {
    const first = createExecutionScopeStore();
    const second = createExecutionScopeStore();
    first.commit({ scope: scope('a'), schemaUid: 'signature', value: 'private', expectedRevision: 0, executionId: 'one' });
    expect(second.get(scope('a'), 'signature')).toBeUndefined();
  });

  it('el scope compartido es una celda explícita, no la del primer usuario', () => {
    const store = createExecutionScopeStore();
    store.commit({
      scope: scope('a'),
      schemaUid: 'shared-field',
      value: 'compartido',
      expectedRevision: 0,
      executionId: 'exec-a',
      valueScope: 'shared',
    });
    // Otro usuario ve el mismo valor compartido…
    expect(store.get(scope('b'), 'shared-field', 'shared')?.value).toBe('compartido');
    // …pero su celda por-usuario sigue vacía.
    expect(store.get(scope('b'), 'shared-field')).toBeUndefined();
    expect(SHARED_SCOPE_USER).not.toBe('a');
  });
});

describe('compare-and-swap', () => {
  it('la revisión la asigna el store, no el cliente', () => {
    const store = createExecutionScopeStore();
    const first = store.commit({ scope: scope('a'), schemaUid: 'f', value: '1', expectedRevision: 0, executionId: 'e' });
    expect(first).toMatchObject({ accepted: true, revision: 1 });
    const second = store.commit({ scope: scope('a'), schemaUid: 'f', value: '2', expectedRevision: 1, executionId: 'e' });
    expect(second).toMatchObject({ accepted: true, revision: 2 });
  });

  it('rechaza un commit con revisión esperada obsoleta', () => {
    const store = createExecutionScopeStore();
    store.commit({ scope: scope('a'), schemaUid: 'f', value: 'A', expectedRevision: 0, executionId: 'exec-a', valueScope: 'shared' });
    const stale = store.commit({
      scope: scope('b'),
      schemaUid: 'f',
      value: 'B',
      expectedRevision: 0,
      executionId: 'exec-b',
      valueScope: 'shared',
    });
    expect(stale.accepted).toBe(false);
    expect(stale).toMatchObject({ conflict: { schemaUid: 'f', reason: 'stale-revision', revisions: [1, 0] } });
    expect(store.get(scope('a'), 'f', 'shared')?.value).toBe('A');
  });

  it('un cliente no puede inventar una revisión mayor para saltarse el conflicto', () => {
    const store = createExecutionScopeStore();
    store.commit({ scope: scope('a'), schemaUid: 'f', value: 'A', expectedRevision: 0, executionId: 'exec-a', valueScope: 'shared' });
    const forged = store.commit({
      scope: scope('b'),
      schemaUid: 'f',
      value: 'FORZADO',
      expectedRevision: 999,
      executionId: 'exec-b',
      valueScope: 'shared',
    });
    expect(forged.accepted).toBe(false);
    expect(store.get(scope('a'), 'f', 'shared')?.value).toBe('A');
  });

  it('dos escritores concurrentes sobre el mismo valor: sólo uno gana', () => {
    const store = createExecutionScopeStore();
    const base = store.revisionOf(scope('a'), 'f', 'shared');
    const first = store.commit({ scope: scope('a'), schemaUid: 'f', value: 'A', expectedRevision: base, executionId: 'exec-a', valueScope: 'shared' });
    const second = store.commit({ scope: scope('b'), schemaUid: 'f', value: 'B', expectedRevision: base, executionId: 'exec-b', valueScope: 'shared' });
    expect([first.accepted, second.accepted]).toEqual([true, false]);
  });
});

describe('limpieza de estado', () => {
  it('limpia por documento, por usuario y por sesión', () => {
    const store = createExecutionScopeStore();
    store.commit({ scope: scope('a', 'doc-1'), schemaUid: 'f', value: '1', expectedRevision: 0, executionId: 'e' });
    store.commit({ scope: scope('a', 'doc-2'), schemaUid: 'f', value: '2', expectedRevision: 0, executionId: 'e' });
    store.commit({ scope: scope('b', 'doc-1'), schemaUid: 'f', value: '3', expectedRevision: 0, executionId: 'e' });

    expect(store.clearDocument('session-1', 'doc-2')).toBe(1);
    expect(store.get(scope('a', 'doc-2'), 'f')).toBeUndefined();
    expect(store.get(scope('a', 'doc-1'), 'f')?.value).toBe('1');

    expect(store.clearUser('session-1', 'b')).toBe(1);
    expect(store.get(scope('b', 'doc-1'), 'f')).toBeUndefined();

    expect(store.clearSession('session-1')).toBe(1);
    expect(store.get(scope('a', 'doc-1'), 'f')).toBeUndefined();
  });
});

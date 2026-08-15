/**
 * RTP-510.A — aislamiento de valores por User × Document.
 *
 * `ExecutionScopeStore` sabía aislar celdas desde RTP-485, pero no tenía ningún
 * consumidor de producción: el Form mantenía un array de inputs plano. Con eso,
 * dos documentos de la misma ejecución comparten celda y lo escrito en D1
 * aparece en D2.
 *
 * Estas pruebas fijan el contrato de la proyección que une ambas piezas.
 */
import { describe, expect, it } from 'vitest';
import { createExecutionScopeStore, SHARED_SCOPE_USER } from '@sisad-pdfme/runtime/executionScopeStore';
import {
  commitScopedInput,
  deriveSchemaValueScopes,
  projectScopedInputs,
  scopedCellUid,
} from '@sisad-pdfme/runtime/scopedInputProjection';

const scope = (userId: string, documentId: string) => ({
  runtimeSessionId: 'session-1',
  userId,
  documentId,
});

const BASE = [{ text: 'plantilla', number: '0' }];

describe('deriveSchemaValueScopes', () => {
  it('un schema sin asignación tiene valor compartido', () => {
    const scopes = deriveSchemaValueScopes({ schemas: [[{ name: 'text', type: 'text' }]] });
    expect(scopes.text).toBe('shared');
  });

  it('ownerMode single y multiple producen valor por usuario', () => {
    const scopes = deriveSchemaValueScopes({
      schemas: [[
        { name: 'firma', type: 'signature', ownerMode: 'single' },
        { name: 'visto', type: 'checkbox', ownerMode: 'multiple' },
      ]],
    });
    expect(scopes.firma).toBe('per-user');
    expect(scopes.visto).toBe('per-user');
  });

  it('un valueScope explícito manda sobre la asignación', () => {
    const scopes = deriveSchemaValueScopes({
      schemas: [[{ name: 'total', type: 'text', ownerMode: 'single', valueScope: 'shared' }]],
    });
    expect(scopes.total).toBe('shared');
  });

  it('acepta schemas sin páginas anidadas', () => {
    const scopes = deriveSchemaValueScopes({ schemas: [{ name: 'plano', type: 'text' }] });
    expect(scopes.plano).toBe('shared');
  });

  it('un template inválido no revienta', () => {
    expect(deriveSchemaValueScopes(null)).toEqual({});
    expect(deriveSchemaValueScopes({ schemas: 'no' as unknown })).toEqual({});
  });
});

describe('proyección multi-documento', () => {
  it('lo escrito en D1 no aparece en D2, y cada documento conserva lo suyo', () => {
    const store = createExecutionScopeStore();
    const alice = { runtimeSessionId: 'session-1', userId: 'alice', documentId: 'D1' };

    commitScopedInput({
      store,
      scope: alice,
      payload: { index: 0, name: 'text', value: 'valor D1' },
    });

    const enD1 = projectScopedInputs({ store, scope: alice, baseInputs: BASE });
    expect((enD1[0] as Record<string, unknown>).text).toBe('valor D1');

    // D2 nunca se escribió: debe mostrar la plantilla, no lo de D1.
    const enD2Antes = projectScopedInputs({ store, scope: scope('alice', 'D2'), baseInputs: BASE });
    expect((enD2Antes[0] as Record<string, unknown>).text).toBe('plantilla');

    commitScopedInput({
      store,
      scope: scope('alice', 'D2'),
      payload: { index: 0, name: 'text', value: 'valor D2' },
    });

    // Volver a D1 recupera exactamente lo suyo; D2 conserva lo suyo.
    expect(
      (projectScopedInputs({ store, scope: alice, baseInputs: BASE })[0] as Record<string, unknown>).text,
    ).toBe('valor D1');
    expect(
      (projectScopedInputs({ store, scope: scope('alice', 'D2'), baseInputs: BASE })[0] as Record<string, unknown>)
        .text,
    ).toBe('valor D2');
  });

  it('el documento separa incluso un schema compartido entre usuarios', () => {
    const store = createExecutionScopeStore();
    const scopes = { text: 'shared' as const };

    commitScopedInput({
      store,
      scope: scope('alice', 'D1'),
      payload: { index: 0, name: 'text', value: 'de D1' },
      valueScopes: scopes,
    });

    // Bob comparte celda con Alice DENTRO de D1...
    expect(
      (projectScopedInputs({ store, scope: scope('bob', 'D1'), baseInputs: BASE, valueScopes: scopes })[0] as Record<
        string,
        unknown
      >).text,
    ).toBe('de D1');

    // ...pero D2 sigue limpio para ambos.
    expect(
      (projectScopedInputs({ store, scope: scope('bob', 'D2'), baseInputs: BASE, valueScopes: scopes })[0] as Record<
        string,
        unknown
      >).text,
    ).toBe('plantilla');
  });
});

describe('proyección multi-usuario', () => {
  it('un schema per-user no filtra el valor de A a B', () => {
    const store = createExecutionScopeStore();
    const valueScopes = { text: 'per-user' as const };

    commitScopedInput({
      store,
      scope: scope('alice', 'D1'),
      payload: { index: 0, name: 'text', value: 'sólo de Alice' },
      valueScopes,
    });

    expect(
      (projectScopedInputs({ store, scope: scope('bob', 'D1'), baseInputs: BASE, valueScopes })[0] as Record<
        string,
        unknown
      >).text,
    ).toBe('plantilla');

    expect(
      (projectScopedInputs({ store, scope: scope('alice', 'D1'), baseInputs: BASE, valueScopes })[0] as Record<
        string,
        unknown
      >).text,
    ).toBe('sólo de Alice');
  });

  it('la matriz Alice/Bob × D1/D2 mantiene cuatro celdas independientes', () => {
    const store = createExecutionScopeStore();
    const valueScopes = { text: 'per-user' as const };
    const matriz = [
      ['alice', 'D1'],
      ['alice', 'D2'],
      ['bob', 'D1'],
      ['bob', 'D2'],
    ] as const;

    matriz.forEach(([userId, documentId]) => {
      commitScopedInput({
        store,
        scope: scope(userId, documentId),
        payload: { index: 0, name: 'text', value: `${userId}-${documentId}` },
        valueScopes,
      });
    });

    matriz.forEach(([userId, documentId]) => {
      const proyectado = projectScopedInputs({
        store,
        scope: scope(userId, documentId),
        baseInputs: BASE,
        valueScopes,
      });
      expect((proyectado[0] as Record<string, unknown>).text).toBe(`${userId}-${documentId}`);
    });
  });

  it('el marcador de scope compartido no es un id de usuario real', () => {
    const store = createExecutionScopeStore();
    commitScopedInput({
      store,
      scope: scope(SHARED_SCOPE_USER, 'D1'),
      payload: { index: 0, name: 'text', value: 'anónimo' },
    });
    expect(
      (projectScopedInputs({ store, scope: scope('alice', 'D1'), baseInputs: BASE })[0] as Record<string, unknown>)
        .text,
    ).toBe('anónimo');
  });
});

describe('mecánica de celda', () => {
  it('el uid combina fila y nombre', () => {
    expect(scopedCellUid(0, 'text')).toBe('0::text');
    expect(scopedCellUid(2, 'text')).not.toBe(scopedCellUid(0, 'text'));
  });

  it('dos filas del mismo schema no comparten celda', () => {
    const store = createExecutionScopeStore();
    const base = [{ text: 'a' }, { text: 'b' }];
    commitScopedInput({ store, scope: scope('alice', 'D1'), payload: { index: 1, name: 'text', value: 'sólo fila 1' } });

    const proyectado = projectScopedInputs({ store, scope: scope('alice', 'D1'), baseInputs: base });
    expect((proyectado[0] as Record<string, unknown>).text).toBe('a');
    expect((proyectado[1] as Record<string, unknown>).text).toBe('sólo fila 1');
  });

  it('escribir dos veces la misma celda avanza la revisión sin conflicto', () => {
    const store = createExecutionScopeStore();
    const target = scope('alice', 'D1');

    const primero = commitScopedInput({ store, scope: target, payload: { index: 0, name: 'text', value: 'uno' } });
    const segundo = commitScopedInput({ store, scope: target, payload: { index: 0, name: 'text', value: 'dos' } });

    expect(primero.accepted).toBe(true);
    expect(segundo.accepted).toBe(true);
    expect(store.revisionOf(target, scopedCellUid(0, 'text'), 'shared')).toBe(2);
  });

  it('`0` y `false` son valores, no ausencias', () => {
    const store = createExecutionScopeStore();
    const target = scope('alice', 'D1');
    commitScopedInput({ store, scope: target, payload: { index: 0, name: 'number', value: 0 } });
    commitScopedInput({ store, scope: target, payload: { index: 0, name: 'text', value: false } });

    const proyectado = projectScopedInputs({ store, scope: target, baseInputs: BASE })[0] as Record<string, unknown>;
    expect(proyectado.number).toBe(0);
    expect(proyectado.text).toBe(false);
  });

  it('no muta los inputs de partida', () => {
    const store = createExecutionScopeStore();
    const base = [{ text: 'original' }];
    commitScopedInput({ store, scope: scope('alice', 'D1'), payload: { index: 0, name: 'text', value: 'editado' } });
    projectScopedInputs({ store, scope: scope('alice', 'D1'), baseInputs: base });
    expect(base[0].text).toBe('original');
  });

  it('una base no-array se proyecta como lista vacía', () => {
    const store = createExecutionScopeStore();
    expect(projectScopedInputs({ store, scope: scope('alice', 'D1'), baseInputs: null })).toEqual([]);
  });
});

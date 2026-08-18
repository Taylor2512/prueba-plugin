/**
 * Merge canónico (RTP-495).
 *
 * Dos defectos corregidos:
 * 1. la igualdad era `JSON.stringify`, que hace divergir valores que son el
 *    mismo dato (selección en distinto orden, número con distinto formato,
 *    fecha con distinta representación);
 * 2. un conflicto devolvía además un ganador publicable, de modo que un
 *    consumidor descuidado publicaba un PDF con un valor en disputa.
 */
import { describe, expect, it } from 'vitest';
import { mergeCanonicalDeltas } from '@/sisad-pdfme/runtime/canonicalMerge';

describe('merge canónico', () => {
  it('funde deltas que no colisionan', () => {
    const result = mergeCanonicalDeltas([
      { schemaUid: 'a', value: 'A', revision: 1, executionId: 'exec-a' },
      { schemaUid: 'b', value: 'B', revision: 1, executionId: 'exec-b' },
    ]);
    expect(result.values).toEqual({ a: 'A', b: 'B' });
    expect(result.conflicts).toEqual([]);
    expect(result.publishable).toBe(true);
  });

  it('un conflicto NO devuelve ganador publicable', () => {
    const result = mergeCanonicalDeltas([
      { schemaUid: 'shared', value: 'A', revision: 2, executionId: 'exec-a' },
      { schemaUid: 'shared', value: 'B', revision: 1, executionId: 'exec-b' },
    ]);
    expect(result.conflicts).toMatchObject([
      { schemaUid: 'shared', executions: ['exec-a', 'exec-b'], reason: 'divergent-values' },
    ]);
    expect(result.values).not.toHaveProperty('shared');
    expect(result.unresolvedSchemaUids).toEqual(['shared']);
    expect(result.publishable).toBe(false);
  });

  it('un conflicto no arrastra a los schemas que sí concuerdan', () => {
    const result = mergeCanonicalDeltas([
      { schemaUid: 'ok', value: 'X', revision: 1, executionId: 'exec-a' },
      { schemaUid: 'malo', value: 'A', revision: 2, executionId: 'exec-a' },
      { schemaUid: 'malo', value: 'B', revision: 1, executionId: 'exec-b' },
    ]);
    expect(result.values).toEqual({ ok: 'X' });
    expect(result.unresolvedSchemaUids).toEqual(['malo']);
    expect(result.publishable).toBe(false);
  });

  it('la igualdad es semántica: una selección en distinto orden no es conflicto', () => {
    const result = mergeCanonicalDeltas([
      { schemaUid: 'multi', value: ['a', 'b'], revision: 2, executionId: 'exec-a', codec: 'array' },
      { schemaUid: 'multi', value: ['b', 'a'], revision: 1, executionId: 'exec-b', codec: 'array' },
    ]);
    expect(result.conflicts).toEqual([]);
    expect(result.publishable).toBe(true);
    expect(result.values.multi).toEqual(['a', 'b']);
  });

  it('la igualdad es semántica para números y fechas', () => {
    const numeros = mergeCanonicalDeltas([
      { schemaUid: 'n', value: 1.5, revision: 2, executionId: 'a', codec: 'number' },
      { schemaUid: 'n', value: '1.50', revision: 1, executionId: 'b', codec: 'number' },
    ]);
    expect(numeros.publishable).toBe(true);

    const fechas = mergeCanonicalDeltas([
      { schemaUid: 'd', value: '2026-08-14T00:00:00.000Z', revision: 2, executionId: 'a', codec: 'date' },
      { schemaUid: 'd', value: new Date(Date.UTC(2026, 7, 14)).toString(), revision: 1, executionId: 'b', codec: 'date' },
    ]);
    expect(fechas.publishable).toBe(true);
  });

  it('valores realmente distintos siguen siendo conflicto', () => {
    const result = mergeCanonicalDeltas([
      { schemaUid: 'multi', value: ['a', 'b'], revision: 2, executionId: 'a', codec: 'array' },
      { schemaUid: 'multi', value: ['a'], revision: 1, executionId: 'b', codec: 'array' },
    ]);
    expect(result.publishable).toBe(false);
  });

  it('sin codec declarado compara por contenido, no por identidad', () => {
    const result = mergeCanonicalDeltas([
      { schemaUid: 'o', value: { a: 1, b: 2 }, revision: 2, executionId: 'a' },
      { schemaUid: 'o', value: { b: 2, a: 1 }, revision: 1, executionId: 'b' },
    ]);
    expect(result.publishable).toBe(true);
  });
});

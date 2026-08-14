import { describe, expect, it } from 'vitest';
import { mergeCanonicalDeltas } from '@/sisad-pdfme/runtime/canonicalMerge';

describe('canonical PDF input merge', () => {
  it('merges non-colliding sequential/parallel deltas', () => {
    const result = mergeCanonicalDeltas([
      { schemaUid: 'a', value: 'A', revision: 1, executionId: 'exec-a' },
      { schemaUid: 'b', value: 'B', revision: 1, executionId: 'exec-b' },
    ]);
    expect(result.values).toEqual({ a: 'A', b: 'B' });
    expect(result.conflicts).toEqual([]);
  });

  it('reports divergent writes to the same schema instead of hiding conflict', () => {
    const result = mergeCanonicalDeltas([
      { schemaUid: 'shared', value: 'A', revision: 2, executionId: 'exec-a' },
      { schemaUid: 'shared', value: 'B', revision: 1, executionId: 'exec-b' },
    ]);
    expect(result.values.shared).toBe('A');
    expect(result.conflicts).toMatchObject([{ schemaUid: 'shared', executions: ['exec-a', 'exec-b'] }]);
  });
});

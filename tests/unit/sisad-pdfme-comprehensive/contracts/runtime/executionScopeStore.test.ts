import { describe, expect, it } from 'vitest';
import { createExecutionScopeStore, type RuntimeScope } from '@/sisad-pdfme/runtime/executionScopeStore';

const scope = (userId: string, documentId = 'doc-1'): RuntimeScope => ({
  runtimeSessionId: 'session-1', userId, documentId,
});

describe('execution scope isolation', () => {
  it('isolates two users in the same JS realm', () => {
    const store = createExecutionScopeStore();
    store.commit({ scope: scope('a'), schemaUid: 'field', value: 'A', revision: 1, executionId: 'exec-a' });
    store.commit({ scope: scope('b'), schemaUid: 'field', value: 'B', revision: 1, executionId: 'exec-b' });
    expect(store.get(scope('a'), 'field')?.value).toBe('A');
    expect(store.get(scope('b'), 'field')?.value).toBe('B');
  });

  it('detects stale shared-document commits instead of last-write loss', () => {
    const store = createExecutionScopeStore();
    store.commit({ scope: scope('a'), schemaUid: 'field', value: 'A', revision: 2, executionId: 'exec-a', valueScope: 'shared' });
    const result = store.commit({ scope: scope('b'), schemaUid: 'field', value: 'B', revision: 1, executionId: 'exec-b', valueScope: 'shared' });
    expect(result.accepted).toBe(false);
    expect(result).toMatchObject({ conflict: { schemaUid: 'field', revisions: [2, 1] } });
  });

  it('does not share state between two store instances', () => {
    const first = createExecutionScopeStore();
    const second = createExecutionScopeStore();
    first.commit({ scope: scope('a'), schemaUid: 'signature', value: 'private', revision: 1, executionId: 'one' });
    expect(second.get(scope('a'), 'signature')).toBeUndefined();
  });
});

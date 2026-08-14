import { describe, expect, it } from 'vitest';
import { roundTripExecutionResult } from '@/sisad-pdfme/runtime/executionResult';

describe('execution result contract', () => {
  it('roundtrips snapshot, completion and artifact provenance', () => {
    const result = roundTripExecutionResult({
      executionId: 'exec-1', runtimeSessionId: 'session-1', userId: 'user-a',
      documents: [{ documentId: 'doc-1', complete: true, snapshot: { values: { field: 'A' } } }],
      completion: { complete: true },
      artifacts: [{ artifactId: 'pdf-1', runtimeSessionId: 'session-1', userId: 'user-a', documentId: 'doc-1', source: { reference: 'memory' } }],
    });
    expect(result.documents[0].snapshot).toEqual({ values: { field: 'A' } });
    expect(result.completion).toEqual({ complete: true });
    expect(result.artifacts[0].artifactId).toBe('pdf-1');
  });
});

import { describe, expect, it } from 'vitest';
import {
  getAssignedSchemaUids,
  normalizeRuntimeSchemaAssignments,
} from '@/sisad-pdfme/runtime/assignments';

describe('runtime assignments', () => {
  it('normalizes user × document × page and deduplicates schemaUid', () => {
    const result = normalizeRuntimeSchemaAssignments({
      userA: { doc1: { '1': ['schemaA', 'schemaA', ''] } },
    });
    expect(getAssignedSchemaUids(result, 'userA', 'doc1', 1)).toEqual(['schemaA']);
  });

  it('ignores invalid current assignment input', () => {
    expect(normalizeRuntimeSchemaAssignments(null)).toEqual({});
  });
});

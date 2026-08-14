import { describe, expect, it } from 'vitest';
import {
  getAssignedSchemaUids,
  migrateLegacySchemaAssignments,
  normalizeRuntimeSchemaAssignments,
} from '@/sisad-pdfme/runtime/assignments';

describe('runtime assignments', () => {
  it('normalizes user × document × page and deduplicates schemaUid', () => {
    const result = normalizeRuntimeSchemaAssignments({
      userA: { doc1: { '1': ['schemaA', 'schemaA', ''] } },
    });
    expect(getAssignedSchemaUids(result, 'userA', 'doc1', 1)).toEqual(['schemaA']);
  });

  it('does not infer legacy identity without an explicit fallback', () => {
    expect(migrateLegacySchemaAssignments({ oldKey: { doc1: { '1': ['schemaA'] } } })).toEqual({});
  });

  it('migrates legacy data with explicit generic user/document scope', () => {
    expect(migrateLegacySchemaAssignments(
      { oldKey: { oldDoc: { '1': ['schemaA'] } } },
      { fallbackUserId: 'userA', documentId: 'doc1' },
    )).toEqual({ userA: { doc1: { '1': ['schemaA'] } } });
  });
});

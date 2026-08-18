import { describe, expect, it } from 'vitest';
import {
  indexUsers,
  normalizeSisadPdfmeWorkspaceUsers,
  normalizeUsers,
  validateSisadPdfmeUsers,
  validateSisadPdfmeWorkspace,
} from '@/sisad-pdfme/contracts/workspace';

const valid = {
  template: { schemaVersion: '1.0.0', pages: [], schemas: [{ schemaUid: 's1', name: 'Field 1' }] },
  users: [{ id: 'u1', displayName: 'Alice' }],
  documents: [{ id: 'd1', label: 'Contrato' }],
  assignments: [{ id: 'a1', schemaUid: 's1', userIds: ['u1'], mode: 'single', valueScope: 'per-user' }],
};

describe('SisadPdfmeWorkspace contract', () => {
  it('accepts the canonical durable shape', () => {
    expect(validateSisadPdfmeWorkspace(valid)).toEqual({ valid: true, issues: [] });
  });

  it('rejects missing registries and non-JSON runtime objects', () => {
    const result = validateSisadPdfmeWorkspace({ template: { ok: true }, users: [], documents: [], assignments: [], runtime: { bad: BigInt(1) } });
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain('WORKSPACE_INVALID_JSON');
  });

  it('rejects duplicate ids and orphan user references', () => {
    const result = validateSisadPdfmeWorkspace({
      ...valid,
      users: [{ id: 'u1', displayName: 'Alice' }, { id: 'u1', displayName: 'Duplicate' }],
      assignments: [{ ...valid.assignments[0], userIds: ['missing'] }],
    });
    expect(result.issues.map((issue) => issue.code)).toEqual(expect.arrayContaining(['WORKSPACE_DUPLICATE_ID', 'WORKSPACE_INVALID_REFERENCE']));
  });

  it('rejects missing schema references and duplicate assignment rows', () => {
    const result = validateSisadPdfmeWorkspace({
      ...valid,
      assignments: [
        { id: 'a1', schemaUid: 'missing-schema', userIds: ['u1'], mode: 'single', valueScope: 'per-user' },
        { id: 'a2', schemaUid: 's1', userIds: ['u1'], mode: 'single', valueScope: 'per-user' },
        { id: 'a3', schemaUid: 's1', userIds: ['u1'], mode: 'shared', valueScope: 'shared' },
      ],
    });
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['WORKSPACE_INVALID_REFERENCE', 'WORKSPACE_DUPLICATE_ASSIGNMENT']),
    );
    expect(result.issues.map((issue) => issue.path)).toEqual(
      expect.arrayContaining(['$.assignments[0].schemaUid', '$.assignments[2].schemaUid']),
    );
  });

  it('fails closed when assignments exist without a schema registry', () => {
    const result = validateSisadPdfmeWorkspace({
      template: { schemaVersion: '1.0.0', pages: [] },
      users: [{ id: 'u1', displayName: 'Alice' }],
      documents: [{ id: 'd1', label: 'Contrato' }],
      assignments: [{ id: 'a1', schemaUid: 's1', userIds: ['u1'], mode: 'single', valueScope: 'per-user' }],
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.path)).toContain('$.template.schemas');
  });

  it('normalizes host participants without carrying credentials', () => {
    expect(normalizeSisadPdfmeWorkspaceUsers([
      { id: 'u1', name: 'Alice', email: 'alice@example.com', token: 'secret' },
      { id: 'u2', name: '', email: 'bob@example.com' },
      { id: '', name: 'Ignored' },
    ])).toEqual([
      { id: 'u1', displayName: 'Alice', email: 'alice@example.com' },
      { id: 'u2', displayName: 'User u2', email: 'bob@example.com' },
    ]);
  });

  it('indexes users by stable id', () => {
    expect(indexUsers([{ id: 'u1', displayName: 'Alice' }, { id: 'u2', displayName: 'Bob' }])).toEqual({
      u1: { id: 'u1', displayName: 'Alice' },
      u2: { id: 'u2', displayName: 'Bob' },
    });
  });

  it('validates duplicate emails as warnings and invalid activeUserId as error', () => {
    const users = normalizeUsers([
      { id: 'u1', name: 'Alice', email: 'same@example.com' },
      { id: 'u2', name: 'Bob', email: 'same@example.com' },
    ]);
    const result = validateSisadPdfmeUsers(users, { activeUserId: 'missing' });
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['USER_DUPLICATE_EMAIL', 'USER_INVALID_ACTIVE_USER']),
    );
  });

  it('rejects duplicate document order and unknown activeDocumentId', () => {
    const result = validateSisadPdfmeWorkspace({
      ...valid,
      documents: [
        { id: 'd1', name: 'Contrato A', order: 0 },
        { id: 'd2', name: 'Contrato B', order: 0 },
      ],
      runtime: { activeDocumentId: 'missing-doc' },
    });
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.path)).toEqual(
      expect.arrayContaining(['$.documents[1].order', '$.runtime.activeDocumentId']),
    );
  });
});

import { describe, expect, it } from 'vitest';
import { projectDocumentCompletion, projectExecutionCompletion, projectUserCompletion } from '@/sisad-pdfme/runtime/completionProjection';

const schemas = [
  { schemaUid: 'a-required', documentId: 'd1', required: true, assignedUserIds: ['a'], interaction: { touched: true, valid: true, completed: true } },
  { schemaUid: 'b-required', documentId: 'd1', required: true, assignedUserIds: ['b'], interaction: { touched: false, valid: true, completed: false } },
  { schemaUid: 'shared', documentId: 'd1', required: false, assignedUserIds: ['a', 'b'], interaction: { touched: false, valid: true, completed: false } },
  { schemaUid: 'hidden-b', documentId: 'd2', required: true, assignedUserIds: ['b'], visible: false, interaction: { touched: false, valid: true, completed: false } },
];

describe('completion projections', () => {
  it('does not let another user block user completion', () => {
    expect(projectUserCompletion('a', schemas)).toMatchObject({ complete: true, requiredTotal: 1, pendingSchemaUids: [] });
    expect(projectUserCompletion('b', schemas)).toMatchObject({ complete: false, requiredTotal: 1, pendingSchemaUids: ['b-required'] });
  });

  it('isolates documents and excludes hidden schemas', () => {
    expect(projectDocumentCompletion('d1', ['a', 'b'], schemas)).toMatchObject({ schemaTotal: 3, complete: false });
    expect(projectDocumentCompletion('d2', ['a', 'b'], schemas)).toMatchObject({ schemaTotal: 0, complete: true });
  });

  it('projects execution completion across documents', () => {
    expect(projectExecutionCompletion('session-1', ['a', 'b'], ['d1', 'd2'], schemas).complete).toBe(false);
  });
});

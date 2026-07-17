import { describe, expect, it } from 'vitest';
import {
  buildFileAssignments,
  buildPageAssignments,
  getAssignmentsForFile,
  getAssignmentsForPage,
  getAssignmentsForRecipient,
  moveSchemaAssignment,
  reconcileAssignments,
  removeSchemaFromAssignments,
  validateAssignmentsConsistency,
} from '@/sisad-pdfme/assignments';
import { assignmentMap, schema } from '../fixtures/sisadFixtures';

describe('assignments lifecycle', () => {
  it('filtra por archivo, página y recipient sin mutar', () => {
    const assignments = assignmentMap() as any;
    expect(buildFileAssignments(assignments, 'file-a')['recipient-1']['file-a']['1']).toEqual(['schema-1', 'schema-2']);
    expect(buildPageAssignments(assignments, 'file-a', 1)['recipient-2']).toEqual(['schema-4']);
    expect(getAssignmentsForRecipient(assignments, 'recipient-1')).not.toBe(assignments['recipient-1']);
    expect(getAssignmentsForFile(assignments, 'file-a')['recipient-1']['2']).toEqual(['schema-3']);
    expect(getAssignmentsForPage(assignments, 'file-a', 2)['recipient-1']).toEqual(['schema-3']);
  });

  it('mueve schema globalmente y deduplica destino', () => {
    const assignments = assignmentMap() as any;
    const moved = moveSchemaAssignment('schema-1', assignments, {
      toRecipientId: 'recipient-2', toFileId: 'file-a', toPageNumber: 2,
    });
    expect(moved['recipient-1']['file-a']['1']).not.toContain('schema-1');
    expect(moved['recipient-2']['file-a']['2']).toEqual(['schema-1']);
    expect(assignments['recipient-1']['file-a']['1']).toContain('schema-1');
  });

  it('elimina schema de todos los buckets', () => {
    const assignments = assignmentMap() as any;
    const next = removeSchemaFromAssignments('schema-1', assignments);
    expect(JSON.stringify(next)).not.toContain('schema-1');
  });

  it('detecta duplicados y referencias inexistentes', () => {
    const result = validateAssignmentsConsistency({
      assignments: {
        'recipient-1': { 'file-a': { '1': ['schema-1', 'schema-1', 'missing'] } },
      } as any,
      schemas: [[schema() as any]],
    });
    expect(result.isValid).toBe(false);
    expect(result.warnings.join(' ')).toMatch(/duplicated/i);
    expect(result.errors.join(' ')).toContain('missing');
  });

  it('reconcilia contra schemas/recipients/documents y reporta huérfanos', () => {
    const result = reconcileAssignments({
      schemas: [[schema() as any]],
      assignments: { old: { 'file-a': { '1': ['missing'] } } } as any,
      recipients: [{ id: 'recipient-1' }],
      documents: [{ id: 'file-a' }],
    });
    expect(result.orphanAssignments).toEqual([
      { recipientId: 'old', fileId: 'file-a', pageNumber: '1', schemaUid: 'missing' },
    ]);
  });
});

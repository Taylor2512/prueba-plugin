import { describe, expect, it } from 'vitest';
import {
  buildFileAssignments,
  buildPageAssignments,
  buildRecipientAssignments,
  validateAssignmentsConsistency,
} from '@sisad-pdfme/assignments';

describe('assignments public capability', () => {
  it('exposes the assignment facade through its semantic entrypoint', () => {
    expect(typeof buildRecipientAssignments).toBe('function');
    expect(typeof buildFileAssignments).toBe('function');
    expect(typeof buildPageAssignments).toBe('function');
    expect(typeof validateAssignmentsConsistency).toBe('function');
  });
});

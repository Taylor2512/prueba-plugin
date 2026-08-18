import { describe, expect, it } from 'vitest';
import { resolveSchemaAccess, type SisadPdfmeUser } from '@/sisad-pdfme/runtime/schemaAccess';

const users: SisadPdfmeUser[] = [
  { id: 'a', displayName: 'A' },
  { id: 'b', displayName: 'B' },
];

describe('generic schema access', () => {
  it('fails closed when multiple users have no active user', () => {
    expect(resolveSchemaAccess({ mode: 'form', users, assignment: { mode: 'unassigned' } })).toMatchObject({
      editable: false, interactive: false, reason: 'missing-active-user',
    });
  });

  it('supports single, multiple, shared and unassigned assignments', () => {
    expect(resolveSchemaAccess({ mode: 'form', users, activeUserId: 'a', assignment: { mode: 'single', assignedUserId: 'a' } }).editable).toBe(true);
    expect(resolveSchemaAccess({ mode: 'form', users, activeUserId: 'b', assignment: { mode: 'single', assignedUserId: 'a' } }).editable).toBe(false);
    expect(resolveSchemaAccess({ mode: 'form', users, activeUserId: 'b', assignment: { mode: 'multiple', assignedUserIds: ['a', 'b'], valueScope: 'per-user' } }).editable).toBe(true);
    expect(resolveSchemaAccess({ mode: 'form', users, activeUserId: 'a', assignment: { mode: 'shared', valueScope: 'shared' } }).reason).toBe('shared');
    expect(resolveSchemaAccess({ mode: 'form', users: [users[0]], activeUserId: 'a', assignment: { mode: 'unassigned' } }).editable).toBe(true);
  });

  it('keeps viewer/pdf non-interactive and disabled users closed', () => {
    expect(resolveSchemaAccess({ mode: 'viewer', users, activeUserId: 'a' }).interactive).toBe(false);
    expect(resolveSchemaAccess({ mode: 'pdf', users, activeUserId: 'a' }).editable).toBe(false);
    expect(resolveSchemaAccess({ mode: 'form', users: [{ ...users[0], disabled: true }], activeUserId: 'a' }).reason).toBe('disabled-user');
  });
});

/**
 * FASE 10 — Tests: Guards e Interaction Layer (sisad-pdfme)
 * Cubre validateInteraction y validateBulkInteraction de shared/interactionGuards.ts
 */
import { describe, it, expect } from 'vitest';
import {
  validateInteraction,
  validateBulkInteraction,
  getBlockedSchemas,
  getAllowedSchemas,
  type InteractionGuardContext,
} from '../../src/sisad-pdfme/shared/interactionGuards.js';

const BASE_CTX: InteractionGuardContext = {
  schemaUid: 'schema-1',
  action: 'schema.move',
  source: 'canvas_drag',
  currentUserId: 'user-1',
};

function makeCtx(overrides: Partial<InteractionGuardContext>): InteractionGuardContext {
  return { ...BASE_CTX, ...overrides };
}

describe('validateInteraction — lock de otro usuario', () => {
  it('todas las acciones mutables devuelven allowed:false con lock de otro usuario', () => {
    const mutating = [
      'schema.move', 'schema.resize', 'schema.rotate',
      'schema.edit', 'schema.delete', 'schema.duplicate',
    ] as const;
    for (const action of mutating) {
      const result = validateInteraction(makeCtx({ action, lockOwner: 'other-user' }));
      expect(result.allowed, `${action} debe estar bloqueada`).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toBe('locked_by_other_user');
        expect(result.recoverable).toBe(true);
      }
    }
  });

  it('schema.copy permitida con lock de otro usuario', () => {
    const result = validateInteraction(makeCtx({ action: 'schema.copy', lockOwner: 'other-user' }));
    expect(result.allowed).toBe(true);
  });

  it('lock expirado no bloquea', () => {
    const result = validateInteraction(makeCtx({
      action: 'schema.move',
      lockOwner: 'other-user',
      lockExpiresAt: Date.now() - 1_000,
    }));
    expect(result.allowed).toBe(true);
  });

  it('lock del mismo usuario no bloquea', () => {
    const result = validateInteraction(makeCtx({ lockOwner: 'user-1' }));
    expect(result.allowed).toBe(true);
  });
});

describe('validateInteraction — schema readonly', () => {
  it('edit/delete/duplicate bloqueados; copy permitida', () => {
    for (const action of ['schema.edit', 'schema.delete', 'schema.duplicate'] as const) {
      const r = validateInteraction(makeCtx({ action, isReadonly: true }));
      expect(r.allowed, `${action} debe estar bloqueada`).toBe(false);
      if (!r.allowed) expect(r.reason).toBe('schema_readonly');
    }
    const copyR = validateInteraction(makeCtx({ action: 'schema.copy', isReadonly: true }));
    expect(copyR.allowed).toBe(true);
  });
});

describe('validateInteraction — collaboration_remote', () => {
  it('bypasea locks locales', () => {
    const r = validateInteraction(makeCtx({
      source: 'collaboration_remote',
      lockOwner: 'other-user',
    }));
    expect(r.allowed).toBe(true);
  });

  it('respeta readonly incluso en collaboration_remote', () => {
    const r = validateInteraction(makeCtx({
      source: 'collaboration_remote',
      action: 'schema.edit',
      isReadonly: true,
    }));
    expect(r.allowed).toBe(false);
    if (!r.allowed) expect(r.reason).toBe('schema_readonly');
  });
});

describe('validateInteraction — scope de recipient', () => {
  it('bloquea edición si pertenece a otro recipient', () => {
    const r = validateInteraction(makeCtx({
      action: 'schema.edit',
      currentRecipientId: 'r-A',
      assignmentScope: 'recipient',
      assignmentRecipientId: 'r-B',
    }));
    expect(r.allowed).toBe(false);
    if (!r.allowed) {
      expect(r.reason).toBe('wrong_recipient_scope');
      expect(r.recoverable).toBe(false);
    }
  });

  it('permite edición al propio recipient', () => {
    const r = validateInteraction(makeCtx({
      action: 'schema.edit',
      currentRecipientId: 'r-A',
      assignmentScope: 'recipient',
      assignmentRecipientId: 'r-A',
    }));
    expect(r.allowed).toBe(true);
  });
});

describe('validateBulkInteraction', () => {
  it('resultados mixtos para schemas con distintos estados', () => {
    const schemas: InteractionGuardContext[] = [
      makeCtx({ schemaUid: 'locked', lockOwner: 'other-user' }),
      makeCtx({ schemaUid: 'free' }),
      makeCtx({ schemaUid: 'readonly', isReadonly: true }),
    ];
    const results = validateBulkInteraction(schemas);
    expect(results.get('locked')?.allowed).toBe(false);
    expect(results.get('free')?.allowed).toBe(true);
    expect(results.get('readonly')?.allowed).toBe(false);
  });

  it('getBlockedSchemas y getAllowedSchemas filtran correctamente', () => {
    const results = validateBulkInteraction([
      makeCtx({ schemaUid: 'a', lockOwner: 'other-user' }),
      makeCtx({ schemaUid: 'b' }),
    ]);
    expect(getBlockedSchemas(results)).toContain('a');
    expect(getAllowedSchemas(results)).toContain('b');
  });
});

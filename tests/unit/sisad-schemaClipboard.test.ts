/**
 * Tests for schemaClipboard.ts
 *
 * Covers:
 *  - sanitizeCopiedSchema: transient-key stripping and state reset
 *  - copySchemasToClipboard: payload shape for copy
 *  - cutSchemasToClipboard: payload shape for cut (populates removeIds)
 *  - resolvePasteOffset: first-paste vs subsequent-paste offsets
 *  - buildPastedSchema: id uniqueness, position offset, name uniqueness,
 *      PastePolicy.preserveLocks, PastePolicy.preserveComments,
 *      PastePolicy.mode = 'assignToActiveRecipient'
 *  - pasteSchemasFromClipboard: multi-schema paste with cascading uniqueness
 *  - duplicateSchemas: convenience wrapper delegates correctly
 */

import { describe, expect, it } from 'vitest';
import type { SchemaForUI } from '@sisad-pdfme/common';
import {
  sanitizeCopiedSchema,
  copySchemasToClipboard,
  cutSchemasToClipboard,
  resolvePasteOffset,
  buildPastedSchema,
  pasteSchemasFromClipboard,
  duplicateSchemas,
  type PastePolicy,
  type SchemaClipboardContext,
} from '../../src/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.js';

// ── Helpers ────────────────────────────────────────────────────────────────────

const makeSchema = (overrides: Partial<SchemaForUI> & Record<string, unknown> = {}): SchemaForUI =>
  ({
    id: 'schema-001',
    name: 'campo_a',
    type: 'text',
    position: { x: 10, y: 20 },
    width: 50,
    height: 15,
    content: 'Texto',
    ...overrides,
  }) as SchemaForUI;

const baseContext = (): SchemaClipboardContext => ({
  pageIndex: 0,
  pageCount: 1,
  pageSize: { width: 210, height: 297 },
  existingSchemas: [],
  timestamp: 1_700_000_000_000,
});

// ── sanitizeCopiedSchema ───────────────────────────────────────────────────────

describe('sanitizeCopiedSchema', () => {
  it('strips all transient identity keys', () => {
    const schema = makeSchema({
      id: 'old-id',
      schemaUid: 'old-uid',
      fileId: 'file-1',
      fileTemplateId: 'tpl-1',
      pageNumber: 2,
      ownerMode: 'single',
      ownerRecipientId: 'rec-1',
      ownerRecipientIds: ['rec-1'],
      ownerRecipientName: 'Alice',
      ownerColor: '#ff0000',
      userColor: '#0000ff',
      createdBy: 'alice',
      lastModifiedBy: 'bob',
      createdAt: 123,
      updatedAt: 456,
      lastModifiedAt: 789,
      commentsCount: 5,
      state: 'active',
      lock: { lockedBy: 'alice', expiresAt: 9999 },
      comments: [{ id: 'c1' }],
      commentAnchors: [{ id: 'a1' }],
      commentsAnchors: [{ id: 'ca1' }],
      collaboration: { something: true },
    } as unknown as Partial<SchemaForUI>);

    const result = sanitizeCopiedSchema(schema) as SchemaForUI & Record<string, unknown>;

    const stripped = [
      'id', 'schemaUid', 'fileId', 'fileTemplateId', 'pageNumber',
      'ownerMode', 'ownerRecipientId', 'ownerRecipientIds', 'ownerRecipientName',
      'ownerColor', 'userColor', 'createdBy', 'lastModifiedBy',
      'createdAt', 'updatedAt', 'lastModifiedAt', 'collaboration',
    ];
    for (const key of stripped) {
      expect(result[key], `key '${key}' should be stripped`).toBeUndefined();
    }
  });

  it('resets commentsCount to 0', () => {
    const schema = makeSchema({ commentsCount: 99 } as unknown as Partial<SchemaForUI>);
    const result = sanitizeCopiedSchema(schema) as SchemaForUI & Record<string, unknown>;
    expect(result.commentsCount).toBe(0);
  });

  it('clears lock, comments, and commentAnchors to undefined', () => {
    const schema = makeSchema({
      lock: { lockedBy: 'alice' },
      comments: [{ id: 'c1' }],
      commentAnchors: [{ id: 'a1' }],
    } as unknown as Partial<SchemaForUI>);
    const result = sanitizeCopiedSchema(schema) as SchemaForUI & Record<string, unknown>;
    expect(result.lock).toBeUndefined();
    expect(result.comments).toBeUndefined();
    expect(result.commentAnchors).toBeUndefined();
  });

  it('resets state to "draft"', () => {
    const schema = makeSchema({ state: 'signed' } as unknown as Partial<SchemaForUI>);
    const result = sanitizeCopiedSchema(schema) as SchemaForUI & Record<string, unknown>;
    expect(result.state).toBe('draft');
  });

  it('preserves non-transient fields', () => {
    const schema = makeSchema({ type: 'text', content: 'hello', name: 'mi_campo' });
    const result = sanitizeCopiedSchema(schema);
    expect(result.type).toBe('text');
    expect((result as SchemaForUI & { content?: string }).content).toBe('hello');
    expect(result.name).toBe('mi_campo');
  });

  it('does not mutate the original schema', () => {
    const schema = makeSchema({ commentsCount: 7, state: 'active' } as unknown as Partial<SchemaForUI>);
    sanitizeCopiedSchema(schema);
    expect((schema as SchemaForUI & Record<string, unknown>).commentsCount).toBe(7);
    expect((schema as SchemaForUI & Record<string, unknown>).state).toBe('active');
  });
});

// ── copySchemasToClipboard ────────────────────────────────────────────────────

describe('copySchemasToClipboard', () => {
  it('creates a payload with source "copy"', () => {
    const payload = copySchemasToClipboard([makeSchema()]);
    expect(payload.source).toBe('copy');
  });

  it('has empty removeIds for copy', () => {
    const payload = copySchemasToClipboard([makeSchema()]);
    expect(payload.removeIds).toEqual([]);
  });

  it('sanitizes each schema in items', () => {
    const schema = makeSchema({ commentsCount: 3, state: 'active' } as unknown as Partial<SchemaForUI>);
    const payload = copySchemasToClipboard([schema]);
    expect((payload.items[0] as SchemaForUI & Record<string, unknown>).commentsCount).toBe(0);
    expect((payload.items[0] as SchemaForUI & Record<string, unknown>).state).toBe('draft');
  });
});

// ── cutSchemasToClipboard ─────────────────────────────────────────────────────

describe('cutSchemasToClipboard', () => {
  it('creates a payload with source "cut"', () => {
    const payload = cutSchemasToClipboard([makeSchema()]);
    expect(payload.source).toBe('cut');
  });

  it('populates removeIds with original schema ids', () => {
    const schemas = [makeSchema({ id: 'id-1' }), makeSchema({ id: 'id-2', name: 'campo_b' })];
    const payload = cutSchemasToClipboard(schemas);
    expect(payload.removeIds).toEqual(['id-1', 'id-2']);
  });

  it('sanitizes each schema in items just like copy', () => {
    const schema = makeSchema({ lock: { lockedBy: 'alice' } } as unknown as Partial<SchemaForUI>);
    const payload = cutSchemasToClipboard([schema]);
    expect((payload.items[0] as SchemaForUI & Record<string, unknown>).lock).toBeUndefined();
  });
});

// ── resolvePasteOffset ────────────────────────────────────────────────────────

describe('resolvePasteOffset', () => {
  it('returns {x:6,y:6} for index 0 (first paste)', () => {
    expect(resolvePasteOffset(0)).toEqual({ x: 6, y: 6 });
  });

  it('returns {x:8,y:8} for index 1+', () => {
    expect(resolvePasteOffset(1)).toEqual({ x: 8, y: 8 });
    expect(resolvePasteOffset(2)).toEqual({ x: 8, y: 8 });
    expect(resolvePasteOffset(10)).toEqual({ x: 8, y: 8 });
  });
});

// ── buildPastedSchema ─────────────────────────────────────────────────────────

describe('buildPastedSchema', () => {
  it('generates a new id different from the original', () => {
    const schema = makeSchema({ id: 'original-id' });
    const result = buildPastedSchema(schema, baseContext());
    expect(result.id).not.toBe('original-id');
    expect(typeof result.id).toBe('string');
    expect(result.id.length).toBeGreaterThan(0);
  });

  it('assigns the same new id to both id and schemaUid', () => {
    const schema = makeSchema();
    const result = buildPastedSchema(schema, baseContext()) as SchemaForUI & Record<string, unknown>;
    expect(result.id).toBe(result.schemaUid);
  });

  it('offsets position by the first-paste delta', () => {
    const schema = makeSchema({ position: { x: 10, y: 20 } });
    const ctx: SchemaClipboardContext = { ...baseContext(), pageSize: undefined };
    const result = buildPastedSchema(schema, ctx, 0);
    // Without pageSize, falls back to candidate = original + offset
    expect(result.position.x).toBeGreaterThanOrEqual(10);
    expect(result.position.y).toBeGreaterThanOrEqual(20);
  });

  it('applies a unique name when the original name already exists', () => {
    const existing = makeSchema({ id: 'e-1', name: 'campo_a' });
    const schema = makeSchema({ name: 'campo_a' });
    const ctx: SchemaClipboardContext = { ...baseContext(), existingSchemas: [existing] };
    const result = buildPastedSchema(schema, ctx);
    expect(result.name).not.toBe('campo_a');
    expect(typeof result.name).toBe('string');
  });

  it('sets pageNumber to pageIndex + 1', () => {
    const schema = makeSchema();
    const ctx: SchemaClipboardContext = { ...baseContext(), pageIndex: 2 };
    const result = buildPastedSchema(schema, ctx) as SchemaForUI & Record<string, unknown>;
    expect(result.pageNumber).toBe(3);
  });

  it('sets state to "draft"', () => {
    const schema = makeSchema({ state: 'active' } as unknown as Partial<SchemaForUI>);
    const result = buildPastedSchema(schema, baseContext()) as SchemaForUI & Record<string, unknown>;
    expect(result.state).toBe('draft');
  });

  it('strips lock by default (preserveLocks not set)', () => {
    const schema = makeSchema({ lock: { lockedBy: 'bob' } } as unknown as Partial<SchemaForUI>);
    const result = buildPastedSchema(schema, baseContext()) as SchemaForUI & Record<string, unknown>;
    expect(result.lock).toBeUndefined();
  });

  it('preserves lock when policy.preserveLocks = true', () => {
    const schema = makeSchema({ lock: { lockedBy: 'bob' } } as unknown as Partial<SchemaForUI>);
    const policy: PastePolicy = { mode: 'preserveAssignments', preserveLocks: true };
    const result = buildPastedSchema(schema, baseContext(), 0, [], policy) as SchemaForUI & Record<string, unknown>;
    expect(result.lock).toEqual({ lockedBy: 'bob' });
  });

  it('strips comments by default (preserveComments not set)', () => {
    const schema = makeSchema({
      comments: [{ id: 'c1' }],
      commentAnchors: [{ id: 'a1' }],
    } as unknown as Partial<SchemaForUI>);
    const result = buildPastedSchema(schema, baseContext()) as SchemaForUI & Record<string, unknown>;
    expect(result.comments).toBeUndefined();
    expect(result.commentAnchors).toBeUndefined();
  });

  it('preserves comments when policy.preserveComments = true', () => {
    const schema = makeSchema({
      comments: [{ id: 'c1' }],
      commentAnchors: [{ id: 'a1' }],
    } as unknown as Partial<SchemaForUI>);
    const policy: PastePolicy = { mode: 'preserveAssignments', preserveComments: true };
    const result = buildPastedSchema(schema, baseContext(), 0, [], policy) as SchemaForUI & Record<string, unknown>;
    expect(result.comments).toEqual([{ id: 'c1' }]);
    expect(result.commentAnchors).toEqual([{ id: 'a1' }]);
  });

  it('strips recipient fields when mode = assignToActiveRecipient', () => {
    const schema = makeSchema({
      ownerRecipientId: 'rec-a',
      ownerRecipientIds: ['rec-a'],
      ownerRecipientName: 'Alice',
      ownerColor: '#aabbcc',
    } as unknown as Partial<SchemaForUI>);
    const policy: PastePolicy = { mode: 'assignToActiveRecipient' };
    const result = buildPastedSchema(schema, baseContext(), 0, [], policy) as SchemaForUI & Record<string, unknown>;
    // Original recipient assignment must be gone.
    // ownerRecipientId may be undefined or null depending on collaborative defaults normalization.
    expect(result.ownerRecipientId ?? null).toBeNull();
    // ownerRecipientIds normalized to [] (empty) — must NOT contain the original 'rec-a'.
    const ids = (result.ownerRecipientIds as string[] | undefined) ?? [];
    expect(ids).not.toContain('rec-a');
    expect(result.ownerRecipientName ?? null).toBeNull();
  });

  it('applies active recipient from context when mode = assignToActiveRecipient', () => {
    const schema = makeSchema({ ownerRecipientId: 'old-rec' } as unknown as Partial<SchemaForUI>);
    const ctx: SchemaClipboardContext = {
      ...baseContext(),
      collaborationContext: {
        ownerRecipientId: 'new-rec',
        ownerRecipientName: 'Bob',
        ownerColor: '#112233',
      },
    };
    const policy: PastePolicy = { mode: 'assignToActiveRecipient' };
    const result = buildPastedSchema(schema, ctx, 0, [], policy) as SchemaForUI & Record<string, unknown>;
    // Should now carry the new recipient from context
    expect(result.ownerRecipientId).toBe('new-rec');
  });

  it('uses custom resolvePlacement when provided', () => {
    const schema = makeSchema({ position: { x: 0, y: 0 } });
    const ctx: SchemaClipboardContext = {
      ...baseContext(),
      resolvePlacement: () => ({ x: 99, y: 88 }),
    };
    const result = buildPastedSchema(schema, ctx);
    expect(result.position).toEqual({ x: 99, y: 88 });
  });

  it('stores timestamps from context', () => {
    const schema = makeSchema();
    const ctx = { ...baseContext(), timestamp: 12345 };
    const result = buildPastedSchema(schema, ctx) as SchemaForUI & Record<string, unknown>;
    expect(result.createdAt).toBe(12345);
    expect(result.updatedAt).toBe(12345);
    expect(result.lastModifiedAt).toBe(12345);
  });
});

// ── pasteSchemasFromClipboard ─────────────────────────────────────────────────

describe('pasteSchemasFromClipboard', () => {
  it('returns one pasted schema per clipboard item', () => {
    const schemas = [makeSchema({ name: 'a' }), makeSchema({ id: 'b-id', name: 'b' })];
    const payload = copySchemasToClipboard(schemas);
    const result = pasteSchemasFromClipboard(payload, baseContext());
    expect(result).toHaveLength(2);
  });

  it('all pasted schemas have unique ids', () => {
    const schemas = [
      makeSchema({ name: 'a' }),
      makeSchema({ id: 'b-id', name: 'b' }),
      makeSchema({ id: 'c-id', name: 'c' }),
    ];
    const payload = copySchemasToClipboard(schemas);
    const result = pasteSchemasFromClipboard(payload, baseContext());
    const ids = result.map((s) => s.id);
    expect(new Set(ids).size).toBe(3);
  });

  it('all pasted schemas have unique names even when originals share the same name', () => {
    const schemas = [makeSchema({ name: 'campo' }), makeSchema({ id: 'b', name: 'campo' })];
    const payload = copySchemasToClipboard(schemas);
    const result = pasteSchemasFromClipboard(payload, baseContext());
    const names = result.map((s) => s.name);
    expect(new Set(names).size).toBe(2);
  });

  it('accepts a raw SchemaForUI[] array as first argument', () => {
    const schemas = [makeSchema({ name: 'raw' })];
    const result = pasteSchemasFromClipboard(schemas, baseContext());
    expect(result).toHaveLength(1);
    expect(result[0].name).toBeDefined();
  });

  it('pasted ids do not collide with ids in existingSchemas', () => {
    const existing = [makeSchema({ id: 'existing-1', name: 'campo_a' })];
    const schemas = [makeSchema({ name: 'nuevo' })];
    const ctx: SchemaClipboardContext = { ...baseContext(), existingSchemas: existing };
    const result = pasteSchemasFromClipboard(schemas, ctx);
    expect(result[0].id).not.toBe('existing-1');
  });

  it('forwards PastePolicy.preserveComments to each schema', () => {
    const schemas = [
      makeSchema({ comments: [{ id: 'c1' }] } as unknown as Partial<SchemaForUI>),
      makeSchema({ id: 'b', name: 'b', comments: [{ id: 'c2' }] } as unknown as Partial<SchemaForUI>),
    ];
    const policy: PastePolicy = { mode: 'preserveAssignments', preserveComments: true };
    const result = pasteSchemasFromClipboard(schemas, baseContext(), policy) as (SchemaForUI & Record<string, unknown>)[];
    // preserveComments = true: comments from original schemas should survive
    expect(result[0].comments).toEqual([{ id: 'c1' }]);
    expect(result[1].comments).toEqual([{ id: 'c2' }]);
  });
});

// ── duplicateSchemas ──────────────────────────────────────────────────────────

describe('duplicateSchemas', () => {
  it('produces the same number of schemas as input', () => {
    const schemas = [makeSchema(), makeSchema({ id: 'b', name: 'b' })];
    const result = duplicateSchemas(schemas, baseContext());
    expect(result).toHaveLength(2);
  });

  it('all duplicates have different ids from originals', () => {
    const schema = makeSchema({ id: 'orig' });
    const [dup] = duplicateSchemas([schema], baseContext());
    expect(dup!.id).not.toBe('orig');
  });

  it('offsets position from original', () => {
    const schema = makeSchema({ position: { x: 5, y: 5 } });
    const ctx: SchemaClipboardContext = { ...baseContext(), pageSize: undefined };
    const [dup] = duplicateSchemas([schema], ctx);
    // At minimum the offset is applied (position >= original)
    expect(dup!.position.x).toBeGreaterThanOrEqual(5);
    expect(dup!.position.y).toBeGreaterThanOrEqual(5);
  });

  it('preserves the schema type', () => {
    const schema = makeSchema({ type: 'signature' });
    const [dup] = duplicateSchemas([schema], baseContext());
    expect(dup!.type).toBe('signature');
  });
});

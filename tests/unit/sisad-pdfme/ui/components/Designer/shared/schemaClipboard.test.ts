import { describe, it, expect } from 'vitest';
import {
  sanitizeCopiedSchema,
  copySchemasToClipboard,
  cutSchemasToClipboard,
  resolvePasteOffset,
} from '@/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.js';
import type { SchemaForUI } from '@sisad-pdfme/common';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeSchema = (overrides: Partial<SchemaForUI & Record<string, unknown>> = {}): SchemaForUI =>
  ({
    id: 'schema-1',
    name: 'field_name',
    type: 'text',
    content: 'Hello',
    width: 80,
    height: 20,
    x: 10,
    y: 10,
    rotate: 0,
    ownerRecipientId: 'rec-1',
    ownerColor: '#FF0000',
    ...overrides,
  } as SchemaForUI);

// ─── sanitizeCopiedSchema ─────────────────────────────────────────────────────

describe('sanitizeCopiedSchema', () => {
  it('returns a new object (deep clone)', () => {
    const s = makeSchema();
    const result = sanitizeCopiedSchema(s);
    expect(result).not.toBe(s);
  });

  it('resets commentsCount to 0', () => {
    const s = makeSchema({ commentsCount: 5 } as any);
    const result = sanitizeCopiedSchema(s) as any;
    expect(result.commentsCount).toBe(0);
  });

  it('sets state to draft', () => {
    const s = makeSchema({ state: 'published' } as any);
    const result = sanitizeCopiedSchema(s) as any;
    expect(result.state).toBe('draft');
  });

  it('preserves core geometry fields', () => {
    const s = makeSchema({ width: 120, height: 35, x: 50, y: 60 });
    const result = sanitizeCopiedSchema(s);
    expect(result.width).toBe(120);
    expect(result.height).toBe(35);
  });

  it('strips transient fields ownerRecipientId and ownerColor', () => {
    const s = makeSchema({ ownerRecipientId: 'rec-1', ownerColor: '#AABBCC' });
    const result = sanitizeCopiedSchema(s) as any;
    expect(result.ownerRecipientId).toBeUndefined();
    expect(result.ownerColor).toBeUndefined();
  });

  it('strips lock metadata', () => {
    const s = makeSchema({ lock: { lockedBy: 'user-x' } } as any);
    const result = sanitizeCopiedSchema(s) as any;
    expect(result.lock).toBeUndefined();
  });
});

// ─── copySchemasToClipboard ───────────────────────────────────────────────────

describe('copySchemasToClipboard', () => {
  it('sets source to copy', () => {
    const payload = copySchemasToClipboard([makeSchema()]);
    expect(payload.source).toBe('copy');
  });

  it('items length matches input', () => {
    const payload = copySchemasToClipboard([makeSchema(), makeSchema({ id: 's-2' })]);
    expect(payload.items).toHaveLength(2);
  });

  it('removeIds is empty for copy', () => {
    const payload = copySchemasToClipboard([makeSchema()]);
    expect(payload.removeIds).toHaveLength(0);
  });

  it('schemas are sanitized (commentsCount reset)', () => {
    const s = makeSchema({ commentsCount: 3 } as any);
    const payload = copySchemasToClipboard([s]);
    expect((payload.items[0] as any).commentsCount).toBe(0);
  });
});

// ─── cutSchemasToClipboard ────────────────────────────────────────────────────

describe('cutSchemasToClipboard', () => {
  it('sets source to cut', () => {
    const payload = cutSchemasToClipboard([makeSchema()]);
    expect(payload.source).toBe('cut');
  });

  it('removeIds contains the id of each cut schema', () => {
    const schemas = [makeSchema({ id: 'x-1' }), makeSchema({ id: 'x-2' })];
    const payload = cutSchemasToClipboard(schemas);
    expect(payload.removeIds).toContain('x-1');
    expect(payload.removeIds).toContain('x-2');
  });
});

// ─── resolvePasteOffset ───────────────────────────────────────────────────────

describe('resolvePasteOffset', () => {
  it('first item (index 0) gets offset 6', () => {
    expect(resolvePasteOffset(0)).toEqual({ x: 6, y: 6 });
  });

  it('subsequent items get offset 8', () => {
    expect(resolvePasteOffset(1)).toEqual({ x: 8, y: 8 });
    expect(resolvePasteOffset(5)).toEqual({ x: 8, y: 8 });
  });
});

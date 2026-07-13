import { describe, it, expect } from 'vitest';
import {
  sanitizeCopiedSchema,
  copySchemasToClipboard,
  cutSchemasToClipboard,
  resolvePasteOffset,
  computeSchemasBounds,
  buildGroupClipboardMetadata,
  clampGroupAnchorToPage,
  pasteSchemasFromClipboard,
} from '@/sisad-pdfme/ui/components/Designer/shared/schemaClipboard.js';
import type { SchemaForUI } from '@sisad-pdfme/common';

type ClipboardSchema = SchemaForUI & {
  commentsCount?: number;
  state?: string;
  ownerRecipientId?: string;
  ownerColor?: string;
  lock?: unknown;
};

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
    const s = makeSchema({ commentsCount: 5 });
    const result = sanitizeCopiedSchema(s) as ClipboardSchema;
    expect(result.commentsCount).toBe(0);
  });

  it('sets state to draft', () => {
    const s = makeSchema({ state: 'published' });
    const result = sanitizeCopiedSchema(s) as ClipboardSchema;
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
    const result = sanitizeCopiedSchema(s) as ClipboardSchema;
    expect(result.ownerRecipientId).toBeUndefined();
    expect(result.ownerColor).toBeUndefined();
  });

  it('strips lock metadata', () => {
    const s = makeSchema({ lock: { lockedBy: 'user-x' } });
    const result = sanitizeCopiedSchema(s) as ClipboardSchema;
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
    const s = makeSchema({ commentsCount: 3 });
    const payload = copySchemasToClipboard([s]);
    expect((payload.items[0] as ClipboardSchema).commentsCount).toBe(0);
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

// ─── Rigid-group paste ────────────────────────────────────────────────────────

const makePositioned = (id: string, x: number, y: number, width = 80, height = 20): SchemaForUI =>
  ({
    id,
    name: id,
    type: 'text',
    content: 'x',
    width,
    height,
    position: { x, y },
    rotate: 0,
  } as unknown as SchemaForUI);

// Three vertically-stacked text fields (contract_name/date/stage layout).
const groupInput = () => [
  makePositioned('a', 20, 30),
  makePositioned('b', 20, 60),
  makePositioned('c', 20, 90),
];

describe('computeSchemasBounds', () => {
  it('computes the visual bounding box from position + size', () => {
    expect(computeSchemasBounds(groupInput())).toEqual({ x: 20, y: 30, width: 80, height: 80 });
  });

  it('returns a zero box for an empty selection', () => {
    expect(computeSchemasBounds([])).toEqual({ x: 0, y: 0, width: 0, height: 0 });
  });
});

describe('buildGroupClipboardMetadata', () => {
  it('is undefined for a single schema', () => {
    expect(buildGroupClipboardMetadata([makePositioned('a', 20, 30)], 0)).toBeUndefined();
  });

  it('captures anchor, bounds and per-id relative offsets', () => {
    const meta = buildGroupClipboardMetadata(groupInput(), 2)!;
    expect(meta.sourcePageIndex).toBe(2);
    expect(meta.anchor).toEqual({ x: 20, y: 30 });
    expect(meta.itemOffsets.a).toEqual({ x: 0, y: 0 });
    expect(meta.itemOffsets.b).toEqual({ x: 0, y: 30 });
    expect(meta.itemOffsets.c).toEqual({ x: 0, y: 60 });
  });
});

describe('clampGroupAnchorToPage', () => {
  const bounds = { x: 20, y: 30, width: 80, height: 80 };
  const page = { width: 210, height: 297 };

  it('keeps the whole box inside the page (right/bottom edge)', () => {
    expect(clampGroupAnchorToPage({ x: 999, y: 999 }, bounds, page)).toEqual({ x: 130, y: 217 });
  });

  it('never allows a negative anchor', () => {
    expect(clampGroupAnchorToPage({ x: -50, y: -50 }, bounds, page)).toEqual({ x: 0, y: 0 });
  });
});

describe('pasteSchemasFromClipboard — rigid group', () => {
  const page = { width: 210, height: 297 };

  it('translates the whole group by one delta, preserving relative spacing', () => {
    const payload = copySchemasToClipboard(groupInput(), 0);
    const pasted = pasteSchemasFromClipboard(payload, {
      pageIndex: 0,
      pageSize: page,
      existingSchemas: [],
      targetAnchor: { x: 100, y: 130 },
    });
    // Anchor (bounds top-left 20,30) → 100,130 means delta = (80,100).
    expect(pasted.map((s) => s.position)).toEqual([
      { x: 100, y: 130 },
      { x: 100, y: 160 },
      { x: 100, y: 190 },
    ]);
  });

  it('falls back to +10mm/+10mm when no target anchor is given', () => {
    const payload = copySchemasToClipboard(groupInput(), 0);
    const pasted = pasteSchemasFromClipboard(payload, {
      pageIndex: 0,
      pageSize: page,
      existingSchemas: [],
    });
    expect(pasted.map((s) => s.position)).toEqual([
      { x: 30, y: 40 },
      { x: 30, y: 70 },
      { x: 30, y: 100 },
    ]);
  });

  it('assigns fresh ids to every pasted schema', () => {
    const payload = copySchemasToClipboard(groupInput(), 0);
    const pasted = pasteSchemasFromClipboard(payload, { pageIndex: 0, pageSize: page, existingSchemas: [] });
    const ids = pasted.map((s) => s.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids).not.toContain('a');
  });
});

import { describe, it, expect } from 'vitest';
import {
  isValidDropPayload,
  isValidDropTarget,
  clampDropPositionToPage,
} from '@/sisad-pdfme/ui/components/Designer/shared/canvasDropPipeline.js';

// ─── isValidDropPayload ───────────────────────────────────────────────────────

describe('isValidDropPayload', () => {
  it('returns true for valid payload', () => {
    expect(isValidDropPayload({ schemaType: 'text', clientX: 100, clientY: 200 })).toBe(true);
  });

  it('returns true with optional fields included', () => {
    expect(isValidDropPayload({
      schemaType: 'checkboxGroup',
      clientX: 50,
      clientY: 80,
      defaultWidthMm: 40,
      defaultHeightMm: 20,
      zoom: 1.5,
    })).toBe(true);
  });

  it('returns false when schemaType is missing', () => {
    expect(isValidDropPayload({ clientX: 10, clientY: 10 })).toBe(false);
  });

  it('returns false when schemaType is empty string', () => {
    expect(isValidDropPayload({ schemaType: '', clientX: 10, clientY: 10 })).toBe(false);
  });

  it('returns false when clientX is not finite', () => {
    expect(isValidDropPayload({ schemaType: 'text', clientX: NaN, clientY: 10 })).toBe(false);
    expect(isValidDropPayload({ schemaType: 'text', clientX: Infinity, clientY: 10 })).toBe(false);
  });

  it('returns false when clientY is not finite', () => {
    expect(isValidDropPayload({ schemaType: 'text', clientX: 10, clientY: NaN })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidDropPayload(null)).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(isValidDropPayload('text')).toBe(false);
    expect(isValidDropPayload(42)).toBe(false);
  });
});

// ─── isValidDropTarget ────────────────────────────────────────────────────────

describe('isValidDropTarget', () => {
  it('returns true for valid target', () => {
    expect(isValidDropTarget({ documentId: 'doc-1', pageNumber: 0, x: 10, y: 20 })).toBe(true);
  });

  it('returns false when documentId is empty', () => {
    expect(isValidDropTarget({ documentId: '', pageNumber: 0, x: 10, y: 20 })).toBe(false);
  });

  it('returns false when documentId is missing', () => {
    expect(isValidDropTarget({ pageNumber: 0, x: 10, y: 20 })).toBe(false);
  });

  it('returns false when x is not finite', () => {
    expect(isValidDropTarget({ documentId: 'doc-1', pageNumber: 0, x: NaN, y: 20 })).toBe(false);
  });

  it('returns false when y is not finite', () => {
    expect(isValidDropTarget({ documentId: 'doc-1', pageNumber: 0, x: 10, y: Infinity })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isValidDropTarget(null)).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(isValidDropTarget(42)).toBe(false);
  });
});

// ─── clampDropPositionToPage ──────────────────────────────────────────────────

describe('clampDropPositionToPage', () => {
  it('returns position unchanged when fully inside page', () => {
    const result = clampDropPositionToPage(10, 20, 40, 20, 210, 297);
    expect(result).toEqual({ x: 10, y: 20 });
  });

  it('clamps x to 0 when negative', () => {
    const result = clampDropPositionToPage(-5, 10, 40, 20, 210, 297);
    expect(result.x).toBe(0);
  });

  it('clamps y to 0 when negative', () => {
    const result = clampDropPositionToPage(10, -10, 40, 20, 210, 297);
    expect(result.y).toBe(0);
  });

  it('clamps x so schema does not overflow right edge', () => {
    // page width 210, schema width 40 → max x = 170
    const result = clampDropPositionToPage(180, 10, 40, 20, 210, 297);
    expect(result.x).toBe(170);
  });

  it('clamps y so schema does not overflow bottom edge', () => {
    // page height 297, schema height 20 → max y = 277
    const result = clampDropPositionToPage(10, 290, 40, 20, 210, 297);
    expect(result.y).toBe(277);
  });

  it('clamps to 0 when schema is larger than page dimension', () => {
    const result = clampDropPositionToPage(100, 100, 300, 300, 210, 297);
    expect(result.x).toBe(0);
    expect(result.y).toBe(0);
  });
});

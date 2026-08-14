import { describe, expect, it } from 'vitest';
import {
  isNumberDraft,
  isNumberWithinBounds,
  normalizeNumberDraft,
} from '../../../../../src/sisad-pdfme/schemas/number/index';

const schema = { validationMin: -10, validationMax: 100 };

describe('number runtime input contract', () => {
  it.each([
    ['0', '0'],
    ['-1', '-1'],
    ['12.50', '12.5'],
    ['0.25', '0.25'],
    ['12,50', '12.5'],
  ])('canonicalizes %s without losing numeric meaning', (draft, expected) => {
    expect(normalizeNumberDraft(draft)).toBe(expected);
  });

  it('keeps an empty draft distinct from zero', () => {
    expect(normalizeNumberDraft('')).toBeNull();
    expect(isNumberDraft('')).toBe(true);
    expect(normalizeNumberDraft('0')).toBe('0');
  });

  it.each(['-', '.', '-.', '12.', ''])('allows an in-progress draft: %s', (draft) => {
    expect(isNumberDraft(draft)).toBe(true);
  });

  it.each(['abc', '1e', '1.2.3', '--1'])('rejects invalid drafts: %s', (draft) => {
    expect(isNumberDraft(draft)).toBe(false);
    expect(normalizeNumberDraft(draft)).toBeNull();
  });

  it('enforces configured minimum and maximum on commit', () => {
    expect(isNumberWithinBounds('-10', schema)).toBe(true);
    expect(isNumberWithinBounds('100', schema)).toBe(true);
    expect(isNumberWithinBounds('-10.01', schema)).toBe(false);
    expect(isNumberWithinBounds('100.01', schema)).toBe(false);
  });

  it('enforces decimal precision without changing the draft transport', () => {
    expect(isNumberWithinBounds('12.50', { ...schema, decimals: 2 })).toBe(true);
    expect(isNumberWithinBounds('12.5', { ...schema, decimals: 2 })).toBe(true);
    expect(isNumberWithinBounds('12.501', { ...schema, decimals: 2 })).toBe(false);
  });

  it('preserves the public string transport contract', () => {
    const committed = normalizeNumberDraft('0.25');
    expect(typeof committed).toBe('string');
    expect(committed).toBe('0.25');
  });
});

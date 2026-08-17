import { describe, expect, it } from 'vitest';
import { isAcceptableNumberInput, splitCurrency } from '@sisad-pdfme/schemas/number/inputPolicy';
import { isNumberDraft, isNumberWithinBounds, normalizeNumberDraft } from '@sisad-pdfme/schemas/number';

describe('number input policy — behavioral contract', () => {
  it.each(['', '-', ',', '.', '0', '12', '-7', '12,50', '12.50', ',5', '.5'])(
    'accepts valid intermediate draft %j',
    (value) => {
      expect(isAcceptableNumberInput(value, { format: 'free' })).toBe(true);
      expect(isNumberDraft(value, { format: 'free' })).toBe(true);
    },
  );

  it.each(['abc', '12a', '1,2,3', '1.2.3', '12\n3', '12\t3', '$12', '€12'])(
    'rejects invalid free-format draft %j',
    (value) => expect(isAcceptableNumberInput(value, { format: 'free' })).toBe(false),
  );

  it('enforces allowNegative=false without changing default behavior', () => {
    expect(isAcceptableNumberInput('-7', {})).toBe(true);
    expect(isAcceptableNumberInput('-7', { allowNegative: false })).toBe(false);
    expect(isAcceptableNumberInput('7', { allowNegative: false })).toBe(true);
  });

  it('allows exactly one currency symbol only in currency format', () => {
    expect(splitCurrency('$12,50', { format: 'currency' })).toEqual({ symbol: '$', numeric: '12,50' });
    expect(splitCurrency('$12', { format: 'free' })).toBeNull();
    expect(splitCurrency('$€12', { format: 'currency' })).toBeNull();
  });

  it.each([
    ['12,50', '12.5'], ['12.50', '12.5'], ['0', '0'], ['-7', '-7'], ['0007', '7'],
  ])('canonicalizes %j to %j', (input, expected) => {
    expect(normalizeNumberDraft(input, { format: 'free' })).toBe(expected);
  });

  it('preserves currency position and spacing during canonicalization', () => {
    expect(normalizeNumberDraft('$ 12,50', { format: 'currency' })).toBe('$ 12.5');
    expect(normalizeNumberDraft('12,50 €', { format: 'currency' })).toBe('12.5 €');
  });

  it('enforces decimal precision at commit time', () => {
    expect(isNumberWithinBounds('12.34', { decimals: 2 })).toBe(true);
    expect(isNumberWithinBounds('12.345', { decimals: 2 })).toBe(false);
    expect(isNumberWithinBounds('12', { decimals: 0 })).toBe(true);
    expect(isNumberWithinBounds('12.1', { decimals: 0 })).toBe(false);
  });

  it('enforces min and max inclusively', () => {
    const schema = { decimals: 2, validationMin: -10, validationMax: 10 };
    expect(isNumberWithinBounds('-10', schema)).toBe(true);
    expect(isNumberWithinBounds('10', schema)).toBe(true);
    expect(isNumberWithinBounds('-10.01', schema)).toBe(false);
    expect(isNumberWithinBounds('10.01', schema)).toBe(false);
  });

  it('does not treat empty or incomplete drafts as committed numbers', () => {
    expect(isNumberWithinBounds('', { decimals: 2 })).toBe(false);
    expect(isNumberWithinBounds('-', { decimals: 2 })).toBe(false);
    expect(normalizeNumberDraft('', {})).toBeNull();
  });
});

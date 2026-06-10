import { describe, expect, it } from 'vitest';
import { resolveSelectedOptionId } from '@/sisad-pdfme/schemas/options/optionValueAdapter.js';

describe('optionValueAdapter', () => {
  const options = [
    { optionId: 'opt_1', label: 'One', value: 'v1' },
    { optionId: 'opt_2', label: 'Two', value: 'v2' },
  ];

  it('resolves by option id', () => {
    expect(resolveSelectedOptionId('opt_2', options)).toBe('opt_2');
  });

  it('resolves by value', () => {
    expect(resolveSelectedOptionId('v1', options)).toBe('opt_1');
  });

  it('returns undefined when not found', () => {
    expect(resolveSelectedOptionId('missing', options)).toBeUndefined();
    expect(resolveSelectedOptionId(null, options)).toBeUndefined();
  });
});

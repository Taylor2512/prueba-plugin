import { describe, expect, it } from 'vitest';
import {
  ensureAtLeastOneOption,
  normalizeOptionId,
  normalizeOptionText,
  normalizeOptionsFromSource,
  normalizeText,
} from '@/sisad-pdfme/schemas/options/optionModel.js';

describe('optionModel', () => {
  it('normalizes option ids from strings and objects', () => {
    expect(normalizeOptionId('Hello World', 0)).toBe('hello_world');
    expect(normalizeOptionId('  *Special*  ', 1)).toBe('special');
    expect(normalizeOptionId('', 2)).toBe('option_3');
  });

  it('preserves the normalizeText compatibility alias', () => {
    expect(normalizeText('  Hola  ')).toBe('Hola');
    expect(normalizeText).toBe(normalizeOptionText);
  });

  it('converts an array of strings into OptionItem[]', () => {
    const list = normalizeOptionsFromSource(['Primero', 'Segundo']);
    expect(list.length).toBe(2);
    expect(list[0].optionId).toBe('primero');
    expect(list[1].label).toBe('Segundo');
  });

  it('ensures at least one option exists', () => {
    expect(ensureAtLeastOneOption([])).toHaveLength(1);
    expect(ensureAtLeastOneOption([{ optionId: 'x', label: 'X' }])).toHaveLength(1);
  });
});

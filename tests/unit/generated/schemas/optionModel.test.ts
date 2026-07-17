import { describe, expect, it } from 'vitest';
import {
  buildDefaultOptionGroupOptions,
  ensureAtLeastOneOption,
  normalizeOptionGroupOptions,
  normalizeOptionId,
  normalizeOptionsFromSource,
} from '@/sisad-pdfme/schemas/options/optionModel';

describe('option model', () => {
  it('normaliza ids y labels', () => {
    expect(normalizeOptionId(' Opción Única ', 0)).toBe('opci_n_nica');
    expect(normalizeOptionId('', 2)).toBe('option_3');
  });

  it('crea mínimo configurable', () => {
    expect(buildDefaultOptionGroupOptions('Casilla', 2)).toEqual([
      { optionId: 'option_1', label: 'Casilla 1' },
      { optionId: 'option_2', label: 'Casilla 2' },
    ]);
  });

  it('normaliza strings y objetos preservando value/disabled', () => {
    const result = normalizeOptionsFromSource([
      'Pendiente',
      { optionId: 'approved', label: 'Aprobado', value: 'A', disabled: true },
    ]);
    expect(result[0]).toEqual({ optionId: 'pendiente', label: 'Pendiente' });
    expect(result[1]).toEqual({ optionId: 'approved', label: 'Aprobado', value: 'A', disabled: true });
  });

  it('garantiza al menos una opción y fallback labels', () => {
    expect(ensureAtLeastOneOption([])).toEqual([{ optionId: 'option_1', label: 'Opción 1' }]);
    expect(normalizeOptionGroupOptions([''], 'Radio', 1)[0].label).toBe('Radio 1');
  });
});

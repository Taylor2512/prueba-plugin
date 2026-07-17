import { describe, expect, it } from 'vitest';
import {
  clampMultiOptionSelection,
  matchOptionId,
  normalizeStringOptions,
  resolveCompactSelection,
  resolveMultiOptionSelection,
  resolveSingleOptionSelection,
  toggleMultiOptionSelection,
} from '@/sisad-pdfme/schemas/options/optionSelectionBehavior';

const options = [
  { optionId: 'pending', label: 'Pendiente', value: 'P' },
  { optionId: 'approved', label: 'Aprobado', value: 'A' },
  { optionId: 'rejected', label: 'Rechazado', value: 'R' },
] as any;

describe('option selection behavior', () => {
  it('resuelve por id y por value', () => {
    expect(matchOptionId('approved', options)).toBe('approved');
    expect(matchOptionId('A', options)).toBe('approved');
    expect(matchOptionId('missing', options)).toBeUndefined();
  });

  it('single usa fallback válido o primera opción', () => {
    expect(resolveSingleOptionSelection('missing', options, 'rejected')).toBe('rejected');
    expect(resolveSingleOptionSelection('missing', options, 'invalid')).toBe('pending');
  });

  it('multi elimina ids inválidos y respeta fallback', () => {
    expect(resolveMultiOptionSelection(['approved', 'missing'], options)).toEqual(['approved']);
    expect(resolveMultiOptionSelection([], options, ['pending', 'missing'])).toEqual(['pending']);
  });

  it('toggle respeta min/max', () => {
    expect(toggleMultiOptionSelection(['pending'], 'pending', options, { minSelected: 1 })).toEqual(['pending']);
    expect(toggleMultiOptionSelection(['pending'], 'approved', options, { maxSelected: 1 })).toEqual(['pending']);
    expect(toggleMultiOptionSelection(['pending'], 'approved', options, { maxSelected: 2 })).toEqual(['pending', 'approved']);
  });

  it('clamp completa mínimo y corta máximo', () => {
    expect(clampMultiOptionSelection([], options, { minSelected: 2 })).toEqual(['pending', 'approved']);
    expect(clampMultiOptionSelection(['pending', 'approved', 'rejected'], options, { maxSelected: 2 })).toEqual(['pending', 'approved']);
  });

  it('normaliza opciones compactas sin duplicados', () => {
    expect(normalizeStringOptions([' A ', 'A', '', null, 'B'] as any)).toEqual(['A', 'B']);
    expect(resolveCompactSelection('B', ['A', 'B'])).toBe('B');
    expect(resolveCompactSelection('X', ['A', 'B'])).toBe('A');
  });
});

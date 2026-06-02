import { describe, it, expect } from 'vitest';
import {
  RUNTIME_MODES,
  isValidRuntimeMode,
  getErrorMessage,
  formatPageStatus,
  resolveInitialUxMode,
} from '@/sisad-pdfme/runtime/runtimeModes';

describe('runtimeModes', () => {
  it('exposes the three runtime modes', () => {
    expect(RUNTIME_MODES).toEqual(['designer', 'form', 'viewer']);
  });

  it('isValidRuntimeMode', () => {
    expect(isValidRuntimeMode('designer')).toBe(true);
    expect(isValidRuntimeMode('nope')).toBe(false);
  });

  it('getErrorMessage', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
    expect(getErrorMessage('x')).toBe('Error inesperado');
  });

  it('formatPageStatus clamps to >= 1', () => {
    expect(formatPageStatus({ currentPage: 2, totalPages: 5 })).toBe('Página 2 / 5');
    expect(formatPageStatus({ currentPage: 0, totalPages: 0 })).toBe('Página 1 / 1');
    expect(formatPageStatus()).toBe('Página 1 / 1');
  });

  describe('resolveInitialUxMode', () => {
    it('prefers a valid query mode', () => {
      expect(resolveInitialUxMode({ search: '?ux=default', storedMode: 'canvas-first' })).toBe('default');
    });
    it('falls back to stored mode when query invalid', () => {
      expect(resolveInitialUxMode({ search: '?ux=bogus', storedMode: 'default' })).toBe('default');
    });
    it('falls back to default when nothing valid', () => {
      expect(resolveInitialUxMode({})).toBe('canvas-first');
    });
    it('respects custom allowedModes', () => {
      expect(resolveInitialUxMode({ search: '?ux=zen', allowedModes: ['zen'], fallback: 'x' })).toBe('zen');
    });
  });
});

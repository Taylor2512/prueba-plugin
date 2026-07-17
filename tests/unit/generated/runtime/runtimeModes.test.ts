import { describe, expect, it } from 'vitest';
import {
  formatPageStatus,
  getErrorMessage,
  isValidRuntimeMode,
  resolveInitialUxMode,
} from '@/sisad-pdfme/runtime/runtimeModes';

describe('runtime modes', () => {
  it.each(['designer', 'form', 'viewer'])('acepta %s', (mode) => {
    expect(isValidRuntimeMode(mode)).toBe(true);
  });

  it('rechaza modos desconocidos', () => {
    expect(isValidRuntimeMode('preview')).toBe(false);
    expect(isValidRuntimeMode(null)).toBe(false);
  });

  it('formatea páginas con límites seguros', () => {
    expect(formatPageStatus({ currentPage: 2, totalPages: 14 })).toBe('Página 2 / 14');
    expect(formatPageStatus({ currentPage: 0, totalPages: 0 })).toBe('Página 1 / 1');
  });

  it('prioriza query, luego storage y fallback', () => {
    expect(resolveInitialUxMode({ search: '?ux=default', storedMode: 'canvas-first' })).toBe('default');
    expect(resolveInitialUxMode({ search: '?ux=bad', storedMode: 'canvas-first' })).toBe('canvas-first');
    expect(resolveInitialUxMode({ search: '?ux=bad', storedMode: 'bad', fallback: 'default' })).toBe('default');
  });

  it('normaliza mensajes de error', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('boom');
    expect(getErrorMessage('boom')).toBe('Error inesperado');
  });
});

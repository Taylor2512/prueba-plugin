/**
 * TASK-UI-016 — contrato de zoom: la UI muestra porcentaje, el estado interno
 * usa decimal, y el select siempre puede representar el nivel actual.
 */
import { describe, expect, it } from 'vitest';
import {
  buildZoomSelectOptions,
  formatZoomPercent,
  parseZoomPercent,
} from '@/sisad-pdfme/ui/components/CtlBar';

describe('zoom contract', () => {
  it('formatZoomPercent muestra 90%, no 0.9', () => {
    expect(formatZoomPercent(0.9)).toBe('90%');
    expect(formatZoomPercent(1)).toBe('100%');
    expect(formatZoomPercent(1.25)).toBe('125%');
    expect(formatZoomPercent(Number.NaN)).toBe('0%');
  });

  it('parseZoomPercent mapea porcentajes a decimales internos', () => {
    expect(parseZoomPercent('125%')).toBe(1.25);
    expect(parseZoomPercent('90')).toBe(0.9);
    expect(parseZoomPercent(50)).toBe(0.5);
    // Valores inválidos caen a 1 (100%).
    expect(parseZoomPercent('abc')).toBe(1);
    expect(parseZoomPercent('-10')).toBe(1);
  });

  it('las opciones del select siempre tienen label en porcentaje', () => {
    const options = buildZoomSelectOptions(1, [0.25, 0.5, 1, 2], 0.25, 2);
    expect(options.map((o) => o.label)).toEqual(['25%', '50%', '100%', '200%']);
    options.forEach((option) => expect(option.label).toMatch(/^\d+%$/));
  });

  it('incluye el nivel actual cuando no coincide con un preset (trigger nunca decimal)', () => {
    const options = buildZoomSelectOptions(0.9, [0.25, 0.5, 1, 2], 0.25, 2);
    const current = options.find((o) => o.value === 0.9);
    expect(current).toBeDefined();
    expect(current?.label).toBe('90%');
    // Orden ascendente estable.
    expect(options.map((o) => o.value)).toEqual([0.25, 0.5, 0.9, 1, 2]);
  });

  it('respeta los límites min/max para los presets', () => {
    const options = buildZoomSelectOptions(1, [0.1, 0.25, 3, 5], 0.25, 3);
    expect(options.map((o) => o.value)).toEqual([0.25, 1, 3]);
  });
});

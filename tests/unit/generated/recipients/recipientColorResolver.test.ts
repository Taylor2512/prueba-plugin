import { describe, expect, it } from 'vitest';
import {
  buildRecipientColorMap,
  resolveRecipientColors,
} from '@/sisad-pdfme/recipients/recipientColorResolver';

describe('recipientColorResolver', () => {
  it('preserva colores explícitos y asigna color a recipients sin color', () => {
    const result = resolveRecipientColors([
      { id: 'a', label: 'A', color: '#123456' },
      { id: 'b', label: 'B' },
      { id: 'c', label: 'C' },
    ] as any);

    expect(result).toHaveLength(3);
    expect(result[0].color?.toLowerCase()).toBe('#123456');
    expect(result[1].color).toMatch(/^#/);
    expect(result[2].color).toMatch(/^#/);
    expect(result[1].color).not.toBe(result[2].color);
  });

  it('no inventa colores con strategy schema/theme', () => {
    const recipients = [{ id: 'a', label: 'A' }] as any;
    const schemaStrategy = resolveRecipientColors(recipients, { strategy: 'schema' });
    const themeStrategy = resolveRecipientColors(recipients, { strategy: 'theme' });

    expect(schemaStrategy).not.toBe(recipients);
    expect(schemaStrategy[0].color).toBeUndefined();
    expect(themeStrategy[0].color).toBeUndefined();
  });

  it('construye un mapa solo con ids y colores efectivos', () => {
    const map = buildRecipientColorMap([
      { id: 'a', label: 'A', color: '#111111' },
      { id: 'b', label: 'B' },
      { id: '', label: 'Sin id', color: '#222222' },
    ] as any);

    expect([...map.entries()]).toEqual([['a', '#111111']]);
  });
});

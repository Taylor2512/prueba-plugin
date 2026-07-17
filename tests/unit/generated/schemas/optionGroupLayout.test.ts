import { describe, expect, it } from 'vitest';
import {
  CHECKBOX_GROUP_LAYOUT,
  RADIO_GROUP_LAYOUT,
  PX_PER_MM,
  computeOptionGroupDesignerHeightMM,
  computeOptionGroupDesignerWidthMM,
  isOptionGroupType,
  normalizeOptionGroupType,
  optionGroupDesignerHeightMM,
  optionGroupDesignerWidthMM,
} from '@/sisad-pdfme/schemas/options/optionGroupLayout';

describe('option group layout', () => {
  it('convierte px a mm con fórmula estable', () => {
    const expected = (2 * 22 + 4) / PX_PER_MM;
    expect(computeOptionGroupDesignerHeightMM(2, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(expected, 4);
    expect(computeOptionGroupDesignerWidthMM(RADIO_GROUP_LAYOUT)).toBeCloseTo(26 / PX_PER_MM, 4);
  });

  it('clampa counts inválidos a una opción', () => {
    expect(computeOptionGroupDesignerHeightMM(0, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(22 / PX_PER_MM, 4);
    expect(computeOptionGroupDesignerHeightMM(Number.NaN, RADIO_GROUP_LAYOUT)).toBeCloseTo(26 / PX_PER_MM, 4);
  });

  it('usa geometría distinta para radio y checkbox', () => {
    expect(optionGroupDesignerWidthMM('radioGroup')).toBeGreaterThan(optionGroupDesignerWidthMM('checkboxGroup'));
    expect(optionGroupDesignerHeightMM('radioGroup', 3)).toBeGreaterThan(optionGroupDesignerHeightMM('checkboxGroup', 3));
  });

  it('normaliza tipos case-insensitive', () => {
    expect(normalizeOptionGroupType(' CHECKBOXGROUP ')).toBe('checkboxGroup');
    expect(normalizeOptionGroupType('radioGroup')).toBe('radioGroup');
    expect(normalizeOptionGroupType('select')).toBeNull();
    expect(isOptionGroupType('RadioGroup')).toBe(true);
  });
});

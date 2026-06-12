import { describe, it, expect } from 'vitest';
import {
  PX_PER_MM,
  CHECKBOX_GROUP_LAYOUT,
  RADIO_GROUP_LAYOUT,
  computeOptionGroupDesignerHeightMM,
  computeOptionGroupDesignerWidthMM,
  optionGroupDesignerHeightMM,
  optionGroupDesignerWidthMM,
  getOptionGroupLayoutConfig,
} from '@/sisad-pdfme/schemas/options/optionGroupLayout.js';

describe('PX_PER_MM', () => {
  it('equals 96/25.4', () => {
    expect(PX_PER_MM).toBeCloseTo(96 / 25.4, 5);
  });
});

describe('CHECKBOX_GROUP_LAYOUT', () => {
  it('has expected boxSize and boxGap', () => {
    expect(CHECKBOX_GROUP_LAYOUT.boxSize).toBe(22);
    expect(CHECKBOX_GROUP_LAYOUT.boxGap).toBe(4);
  });
});

describe('RADIO_GROUP_LAYOUT', () => {
  it('has expected boxSize and boxGap', () => {
    expect(RADIO_GROUP_LAYOUT.boxSize).toBe(26);
    expect(RADIO_GROUP_LAYOUT.boxGap).toBe(4);
  });
});

describe('getOptionGroupLayoutConfig', () => {
  it('returns RADIO_GROUP_LAYOUT for radioGroup', () => {
    expect(getOptionGroupLayoutConfig('radioGroup')).toBe(RADIO_GROUP_LAYOUT);
  });

  it('returns CHECKBOX_GROUP_LAYOUT for checkboxGroup', () => {
    expect(getOptionGroupLayoutConfig('checkboxGroup')).toBe(CHECKBOX_GROUP_LAYOUT);
  });
});

describe('computeOptionGroupDesignerHeightMM', () => {
  it('n=1: just one box, no gap', () => {
    const { boxSize } = CHECKBOX_GROUP_LAYOUT;
    const expected = parseFloat((boxSize / PX_PER_MM).toFixed(4));
    expect(computeOptionGroupDesignerHeightMM(1, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(expected, 2);
  });

  it('n=2 checkboxGroup: 2*22 + 1*4 = 48px', () => {
    const px = 2 * 22 + 1 * 4;
    const expected = parseFloat((px / PX_PER_MM).toFixed(4));
    expect(computeOptionGroupDesignerHeightMM(2, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(expected, 2);
  });

  it('n=3 checkboxGroup: 3*22 + 2*4 = 74px', () => {
    const px = 3 * 22 + 2 * 4;
    const expected = parseFloat((px / PX_PER_MM).toFixed(4));
    expect(computeOptionGroupDesignerHeightMM(3, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(expected, 2);
  });

  it('height increases with each added option', () => {
    const h2 = computeOptionGroupDesignerHeightMM(2, CHECKBOX_GROUP_LAYOUT);
    const h3 = computeOptionGroupDesignerHeightMM(3, CHECKBOX_GROUP_LAYOUT);
    const h4 = computeOptionGroupDesignerHeightMM(4, CHECKBOX_GROUP_LAYOUT);
    expect(h3).toBeGreaterThan(h2);
    expect(h4).toBeGreaterThan(h3);
  });

  it('n=2 radioGroup: 2*26 + 1*4 = 56px', () => {
    const px = 2 * 26 + 1 * 4;
    const expected = parseFloat((px / PX_PER_MM).toFixed(4));
    expect(computeOptionGroupDesignerHeightMM(2, RADIO_GROUP_LAYOUT)).toBeCloseTo(expected, 2);
  });

  it('clamps negative/zero count to 1', () => {
    const h1 = computeOptionGroupDesignerHeightMM(1, CHECKBOX_GROUP_LAYOUT);
    expect(computeOptionGroupDesignerHeightMM(0, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(h1, 2);
    expect(computeOptionGroupDesignerHeightMM(-5, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(h1, 2);
  });

  it('clamps NaN/non-finite to 1', () => {
    const h1 = computeOptionGroupDesignerHeightMM(1, CHECKBOX_GROUP_LAYOUT);
    expect(computeOptionGroupDesignerHeightMM(NaN, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(h1, 2);
    expect(computeOptionGroupDesignerHeightMM(Infinity, CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(h1, 2);
  });
});

describe('computeOptionGroupDesignerWidthMM', () => {
  it('checkboxGroup width = 22px in mm', () => {
    const expected = parseFloat((22 / PX_PER_MM).toFixed(4));
    expect(computeOptionGroupDesignerWidthMM(CHECKBOX_GROUP_LAYOUT)).toBeCloseTo(expected, 2);
  });

  it('radioGroup width = 26px in mm', () => {
    const expected = parseFloat((26 / PX_PER_MM).toFixed(4));
    expect(computeOptionGroupDesignerWidthMM(RADIO_GROUP_LAYOUT)).toBeCloseTo(expected, 2);
  });
});

describe('optionGroupDesignerHeightMM convenience function', () => {
  it('delegates to correct layout config', () => {
    const cbx = computeOptionGroupDesignerHeightMM(3, CHECKBOX_GROUP_LAYOUT);
    const rdo = computeOptionGroupDesignerHeightMM(3, RADIO_GROUP_LAYOUT);
    expect(optionGroupDesignerHeightMM('checkboxGroup', 3)).toBeCloseTo(cbx, 4);
    expect(optionGroupDesignerHeightMM('radioGroup', 3)).toBeCloseTo(rdo, 4);
  });
});

describe('optionGroupDesignerWidthMM convenience function', () => {
  it('delegates to correct layout config', () => {
    const cbxW = computeOptionGroupDesignerWidthMM(CHECKBOX_GROUP_LAYOUT);
    const rdoW = computeOptionGroupDesignerWidthMM(RADIO_GROUP_LAYOUT);
    expect(optionGroupDesignerWidthMM('checkboxGroup')).toBeCloseTo(cbxW, 4);
    expect(optionGroupDesignerWidthMM('radioGroup')).toBeCloseTo(rdoW, 4);
  });
});

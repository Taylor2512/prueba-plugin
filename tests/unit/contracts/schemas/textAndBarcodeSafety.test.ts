import type { Font as FontKitFont } from 'fontkit';
import type { RGB } from 'pdf-lib';
import { describe, expect, it } from 'vitest';

import { validateBarcodeInput } from '@sisad-pdfme/schemas/barcodes/helper';
import { splitTextToSize } from '@sisad-pdfme/schemas/text/helper';
import { hex2PrintingColor } from '@sisad-pdfme/schemas/utils';

const font = {
  unitsPerEm: 1000,
  layout: (text: string) => ({
    glyphs: Array.from(text, () => ({ advanceWidth: 500 })),
  }),
} as unknown as FontKitFont;

const split = (value: string) =>
  splitTextToSize({
    value,
    characterSpacing: 0,
    boxWidthInPt: 10_000,
    fontSize: 12,
    fontKitFont: font,
  });

describe('barcode regex contracts', () => {
  it('Code39 conserva todos sus símbolos válidos y rechaza minúsculas', () => {
    expect(validateBarcodeInput('code39', 'ABC-.$/+% 123')).toBe(true);
    expect(validateBarcodeInput('code39', 'abc')).toBe(false);
  });

  it('Code128 permite texto Unicode general pero rechaza japonés y full-width', () => {
    expect(validateBarcodeInput('code128', 'ASCII ñ 😀')).toBe(true);
    expect(validateBarcodeInput('code128', 'カタカナ')).toBe(false);
    expect(validateBarcodeInput('code128', 'ＡＢＣ')).toBe(false);
    expect(validateBarcodeInput('code128', `A${String.fromCodePoint(0x3000)}B`)).toBe(false);
  });

  it('preserva formatos numéricos y start/stop de Codabar', () => {
    expect(validateBarcodeInput('ean13', '123456789012')).toBe(true);
    expect(validateBarcodeInput('ean8', '1234567')).toBe(true);
    expect(validateBarcodeInput('itf14', '1234567890123')).toBe(true);
    expect(validateBarcodeInput('upca', '12345678901')).toBe(true);
    expect(validateBarcodeInput('upce', '0123456')).toBe(true);
    expect(validateBarcodeInput('nw7', 'A12-.$/+34B')).toBe(true);
    expect(validateBarcodeInput('nw7', 'X12Y')).toBe(false);
  });
});

describe('text control-character splitting', () => {
  it('separa newline, carriage return, form feed y vertical tab explícito', () => {
    expect(split('uno\ndos\rtres\fcuatro')).toEqual(['uno\n', 'dos\n', 'tres\n', 'cuatro\n']);
    expect(split(`uno${String.fromCharCode(0x0b)}dos`)).toEqual(['uno\n', 'dos\n']);
  });

  it('conserva tab, Unicode y emoji como contenido de texto', () => {
    expect(split('uno\tdos')).toEqual(['uno\tdos\n']);
    expect(split('áéí 日本語 😀')).toEqual(['áéí 日本語 😀\n']);
  });
});

describe('monochrome PDF export', () => {
  it('elimina la cromaticidad convirtiendo RGB a luminancia neutra', () => {
    const color = hex2PrintingColor('#1677ff', 'grayscale') as RGB;
    expect(color).toMatchObject({ type: 'RGB' });
    expect(color?.red).toBe(color?.green);
    expect(color?.green).toBe(color?.blue);
  });
});

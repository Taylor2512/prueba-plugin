import { describe, expect, it } from 'vitest';
import { isRasterMonochromeUnsupported } from '@/sisad-pdfme/generator/preflight';

describe('monochrome raster preflight', () => {
  it('fails closed for populated images in grayscale mode', () => {
    expect(isRasterMonochromeUnsupported('image', 'grayscale', 'data:image/png;base64,abc')).toBe(true);
  });

  it('allows vector/non-grayscale or empty image values', () => {
    expect(isRasterMonochromeUnsupported('svg', 'grayscale', '<svg/>')).toBe(false);
    expect(isRasterMonochromeUnsupported('image', 'color', 'data:image/png;base64,abc')).toBe(false);
    expect(isRasterMonochromeUnsupported('image', 'grayscale', '')).toBe(false);
  });
});

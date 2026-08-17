import { vi } from 'vitest';

vi.mock('@sisad-pdfme/integration', async () => {
  const bundle = await import('@sisad-pdfme/integration/instanceBundleAssets');
  return bundle;
});

import {
  createPortableSisadPdfmeInstanceBundle,
  inlineSisadPdfmeInstanceAssets,
  isInlinedSisadPdfmeInstanceBundle,
  SISAD_PDFME_BUNDLE_ASSET_ENCODING,
} from '@sisad-pdfme';

describe('portable bundle root API', () => {
  it('exposes the asset portability capability without a deep import', () => {
    expect(typeof createPortableSisadPdfmeInstanceBundle).toBe('function');
    expect(typeof inlineSisadPdfmeInstanceAssets).toBe('function');
    expect(typeof isInlinedSisadPdfmeInstanceBundle).toBe('function');
    expect(SISAD_PDFME_BUNDLE_ASSET_ENCODING).toBe('base64-inline');
  });
});

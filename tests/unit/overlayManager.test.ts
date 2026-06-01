import { describe, expect, test } from 'vitest';
import { deriveCanvasBlockReason, shouldDisplayBlockingMask } from '../../src/sisad-pdfme/ui/components/Designer/Canvas/overlays/overlayState.js';

describe('overlayState blocking policy', () => {
  test('interaction-only modes never create a block reason by themselves', () => {
    expect(shouldDisplayBlockingMask(null, 'dragging')).toBe(false);
    expect(shouldDisplayBlockingMask(null, 'resizing')).toBe(false);
    expect(shouldDisplayBlockingMask(null, 'rotating')).toBe(false);
  });

  test('loading and error render states map to blocking reasons', () => {
    expect(deriveCanvasBlockReason({ type: 'loading_document' })).toBe('loading');
    expect(deriveCanvasBlockReason({ type: 'loading_page' })).toBe('loading');
    expect(
      deriveCanvasBlockReason({ type: 'render_error', error: new Error('boom'), recoverable: true }),
    ).toBe('error');
  });
});

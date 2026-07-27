import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import { featureRegistry } from '@/sisad-pdfme/config/featureRegistry';

describe('featureRegistry', () => {
  it('marks canvas unavailable when the canvas is disabled', () => {
    const resolved = createSisadPdfmeConfig({
      canvas: { enabled: false },
    });

    const state = featureRegistry.canvas.resolve(resolved, {});

    expect(state.enabled).toBe(false);
    expect(state.executable).toBe(false);
    expect(state.reason).toBe('canvas-disabled');
    expect(state.sources).toContain('canvas.enabled');
  });

  it('marks assignment unavailable when there is no selection or recipient', () => {
    const resolved = createSisadPdfmeConfig({});
    const state = featureRegistry.assignment.resolve(resolved, {
      selectionCount: 0,
      recipientCount: 0,
    });

    expect(state.executable).toBe(false);
    expect(state.reason).toBe('assignment-unavailable');
  });
});

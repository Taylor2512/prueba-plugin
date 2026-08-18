import { describe, expect, it } from 'vitest';
import { createOverlayManager, OVERLAY_Z_INDEX, PORTAL_REQUIRED_OVERLAYS } from '@sisad-pdfme/canvas/overlayManager';

describe('overlay public capability', () => {
  it('exposes the lifecycle facade and centralized policy', () => {
    const manager = createOverlayManager();
    expect(typeof manager.openTyped).toBe('function');
    expect(OVERLAY_Z_INDEX.modal).toBeGreaterThan(OVERLAY_Z_INDEX.toolbar);
    expect(PORTAL_REQUIRED_OVERLAYS.has('context_menu')).toBe(true);
  });
});

import { describe, expect, test } from 'vitest';
import { getCanvasStateConfig, isCanvasInteractive } from '../../src/sisad-pdfme/canvas/canvasRenderState.js';

describe('canvasRenderState contract', () => {
  test('dragging/resizing/rotating are not blocking states; loading is blocking', () => {
    const loading = { type: 'loading_page' } as const;
    const ready = { type: 'ready', schemaCount: 1 } as const;

    expect(getCanvasStateConfig(loading).blocksInteraction).toBe(true);
    expect(isCanvasInteractive(loading)).toBe(false);
    expect(getCanvasStateConfig(ready).blocksInteraction).toBe(false);
    expect(isCanvasInteractive(ready)).toBe(true);
  });

  test('permission-like non-ready states currently remain non-blocking only if configured so', () => {
    const disconnected = { type: 'collaboration_disconnected', lastSyncAt: Date.now() } as const;
    expect(getCanvasStateConfig(disconnected).blocksInteraction).toBe(false);
  });
});

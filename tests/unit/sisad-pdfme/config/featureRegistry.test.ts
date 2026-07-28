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

  it('keeps documents executable when the panel is hidden', () => {
    const resolved = createSisadPdfmeConfig({
      documents: {
        mode: 'single',
        activeDocumentStrategy: 'internal',
        preserveDocumentSchemaRouting: true,
      },
      visibility: {
        sidebars: {
          right: {
            panels: {
              documents: false,
            },
          },
        },
      },
    });

    const state = featureRegistry.documents.resolve(resolved, {});

    expect(state.enabled).toBe(true);
    expect(state.visible).toBe(false);
    expect(state.executable).toBe(true);
    expect(state.reason).toBeUndefined();
    expect(state.routingMode).toBe('single');
  });

  it('disables comments only when comments.enabled is false', () => {
    const resolved = createSisadPdfmeConfig({
      comments: {
        enabled: false,
      },
    } as never);

    const state = featureRegistry.comments.resolve(resolved, {});

    expect(state.enabled).toBe(false);
    expect(state.visible).toBe(false);
    expect(state.executable).toBe(false);
    expect(state.reason).toBe('comments-disabled');
  });

  it('keeps comments executable when the panel is hidden', () => {
    const resolved = createSisadPdfmeConfig({
      comments: {
        enabled: true,
      },
      visibility: {
        sidebars: {
          right: {
            panels: {
              comments: false,
            },
          },
        },
      },
    } as never);

    const state = featureRegistry.comments.resolve(resolved, {});

    expect(state.enabled).toBe(true);
    expect(state.visible).toBe(false);
    expect(state.executable).toBe(true);
    expect(state.reason).toBeUndefined();
  });
});

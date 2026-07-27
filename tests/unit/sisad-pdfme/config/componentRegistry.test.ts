import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import { componentRegistry } from '@/sisad-pdfme/config/componentRegistry';

describe('componentRegistry', () => {
  it('hides the comments panel when its visibility flag is disabled', () => {
    const resolved = createSisadPdfmeConfig({
      visibility: {
        sidebars: {
          right: {
            panels: {
              comments: false,
            },
          },
        },
      },
    });

    const state = componentRegistry['comments-panel'].resolve(resolved, {});

    expect(state.visible).toBe(false);
    expect(state.executable).toBe(false);
    expect(state.reason).toBe('hidden-by-config');
    expect(state.componentId).toBe('CommentsRail');
  });
});

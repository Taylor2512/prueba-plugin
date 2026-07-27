import { describe, expect, it } from 'vitest';
import { createSisadPdfmeConfig } from '@/sisad-pdfme/config/createSisadPdfmeConfig';
import { createSisadPdfmeConfigSelectors } from '@/sisad-pdfme/config/configSelectors';

describe('createSisadPdfmeConfigSelectors', () => {
  it('resolves feature, action and component states from the same snapshot', () => {
    const resolved = createSisadPdfmeConfig({
      canvas: { enabled: false },
      runtime: { readonly: true },
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
    const selectors = createSisadPdfmeConfigSelectors(resolved);

    const canvas = selectors.selectFeatureState('canvas');
    const sidebars = selectors.selectFeatureState('sidebars');
    const duplicate = selectors.selectActionState('duplicate-schema', { selectionCount: 0 });
    const commentsPanel = selectors.selectComponentState('comments-panel');

    expect(canvas.executable).toBe(false);
    expect(canvas.reason).toBe('canvas-disabled');
    expect(sidebars.executable).toBe(false);
    expect(sidebars.reason).toBe('dependency-unavailable');
    expect(duplicate.executable).toBe(false);
    expect(duplicate.reason).toBe('no-selection');
    expect(commentsPanel.visible).toBe(false);
  });
});

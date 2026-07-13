import { describe, expect, it, vi } from 'vitest';
import {
  isDesignerInteractionExcluded,
  stopDesignerControlEvent,
} from '@/sisad-pdfme/ui/components/Designer/shared/interactionExclusions.js';

describe('interactionExclusions', () => {
  it('detects designer control and modal targets as excluded', () => {
    const button = document.createElement('button');
    button.setAttribute('data-designer-control', 'true');
    const modal = document.createElement('div');
    modal.setAttribute('data-designer-modal', 'true');

    expect(isDesignerInteractionExcluded(button)).toBe(true);
    expect(isDesignerInteractionExcluded(modal)).toBe(true);
  });

  it('stops both synthetic and native propagation when requested', () => {
    const preventDefault = vi.fn();
    const stopPropagation = vi.fn();
    const stopImmediatePropagation = vi.fn();

    stopDesignerControlEvent({
      preventDefault,
      stopPropagation,
      nativeEvent: { stopImmediatePropagation } as unknown as Event,
    });

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);
    expect(stopImmediatePropagation).toHaveBeenCalledTimes(1);
  });
});

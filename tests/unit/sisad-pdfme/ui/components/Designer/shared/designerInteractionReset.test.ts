import { afterEach, describe, expect, it, vi } from 'vitest';
import { resetDesignerTransientInteractionState } from '../../../../../../../src/sisad-pdfme/ui/components/Designer/shared/designerInteractionReset.js';

describe('resetDesignerTransientInteractionState', () => {
  afterEach(() => {
    document.body.style.pointerEvents = '';
    document.body.style.overflow = '';
    vi.restoreAllMocks();
  });

  it('clears transient UI state and emits the internal reset event', () => {
    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');
    const blur = vi.spyOn(HTMLElement.prototype, 'blur').mockImplementation(() => {});

    document.body.style.pointerEvents = 'none';
    document.body.style.overflow = 'hidden';

    const calls: string[] = [];
    resetDesignerTransientInteractionState({
      clearContextMenu: () => calls.push('context'),
      clearInlineEdit: () => calls.push('inline'),
      clearDragState: () => calls.push('drag'),
      clearRegionSelection: () => calls.push('region'),
      clearHoverState: () => calls.push('hover'),
      resumeKeyboardShortcuts: () => calls.push('keys'),
    });

    expect(calls).toEqual(['context', 'inline', 'drag', 'region', 'hover', 'keys']);
    expect(blur).toHaveBeenCalledTimes(1);
    expect(document.body.style.pointerEvents).toBe('');
    expect(document.body.style.overflow).toBe('');
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy.mock.calls[0]?.[0]).toBeInstanceOf(CustomEvent);
    expect((dispatchSpy.mock.calls[0]?.[0] as CustomEvent).type).toBe('sisad-pdfme:designer-interaction-reset');
  });
});

import { describe, expect, it } from 'vitest';
import { createDesignerEffectCoordinator } from '@sisad-pdfme/ui/components/Designer/shared/designerEffectCoordinator';
import {
  initialInteractionMachineState,
  interactionReducer,
} from '@sisad-pdfme/ui/components/Designer/shared/interactionReducer';

describe('designer interaction capabilities', () => {
  it('exposes pure interaction state and effect coordination', () => {
    const coordinator = createDesignerEffectCoordinator();
    expect(typeof coordinator.lockBodyScroll).toBe('function');
    const next = interactionReducer(initialInteractionMachineState, { type: 'selection.set', count: 1 });
    expect(next.selectionCount).toBe(1);
    coordinator.dispose();
  });
});

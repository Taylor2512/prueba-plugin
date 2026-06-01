import { describe, expect, test } from 'vitest';
import { canStartInteraction } from '../../src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.js';

const baseState = {
  mode: 'idle' as const,
  activeSchemaIds: [],
  isKeyboardInputFocused: false,
  isDraggingFromPalette: false,
  isOverCanvas: true,
  isOverPage: true,
};

describe('interactionGuards', () => {
  test('allows dragging and resizing transitions from idle context', () => {
    expect(canStartInteraction(baseState, 'dragging-schema')).toBe(true);
    expect(canStartInteraction(baseState, 'resizing-schema')).toBe(true);
    expect(canStartInteraction(baseState, 'rotating-schema')).toBe(true);
  });

  test('blocks region selection while dragging from palette', () => {
    const current = { ...baseState, mode: 'dragging-plugin' as const, isDraggingFromPalette: true };
    expect(canStartInteraction(current, 'region-selecting')).toBe(false);
  });

  test('blocks non-sidebar modes when keyboard focus is in editable input', () => {
    const current = { ...baseState, isKeyboardInputFocused: true };
    expect(canStartInteraction(current, 'dragging-schema')).toBe(false);
    expect(canStartInteraction(current, 'sidebar-editing')).toBe(true);
  });
});

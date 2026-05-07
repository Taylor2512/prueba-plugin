import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
  canStartInteraction,
  type DesignerInteractionState,
  isAntDPopupOpen,
  isEditableTarget,
  shouldSuppressDesignerShortcuts,
  shouldSuppressCanvasRegionSelection,
} from '../../src/sisad-pdfme/ui/components/Designer/shared/interactionGuards.js';

describe('interaction guards', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('detects editable targets and suppresses shortcuts', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);

    expect(isEditableTarget(input)).toBe(true);
    expect(shouldSuppressDesignerShortcuts(input, {})).toBe(true);
    expect(shouldSuppressCanvasRegionSelection(input, {})).toBe(true);
  });

  it('suppresses designer actions when AntD popups are open or interaction is modal', () => {
    const popup = document.createElement('div');
    popup.className = 'ant-dropdown';
    document.body.appendChild(popup);

    expect(isAntDPopupOpen()).toBe(true);
    expect(shouldSuppressDesignerShortcuts(document.body, { isModalOpen: true })).toBe(true);
    expect(shouldSuppressCanvasRegionSelection(document.body, { isModalOpen: true })).toBe(true);
  });

  it('uses the shared interaction state to block selection while dragging a palette item', () => {
    const current: DesignerInteractionState = {
      mode: 'dragging-plugin',
      activeSchemaIds: [],
      isKeyboardInputFocused: false,
      isDraggingFromPalette: true,
      isOverCanvas: true,
      isOverPage: true,
    };

    expect(canStartInteraction(current, 'region-selecting')).toBe(false);
    expect(shouldSuppressCanvasRegionSelection(document.body, { isDraggingPlugin: true })).toBe(true);
  });

  it('blocks shortcuts when keyboard focus is inside an input surface', () => {
    expect(shouldSuppressDesignerShortcuts(document.body, { isKeyboardInputFocused: true })).toBe(true);
  });
});

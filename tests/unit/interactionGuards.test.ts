import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import {
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
});

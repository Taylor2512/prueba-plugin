import { describe, expect, test } from 'vitest';
import {
  getShortcutsByScope,
  resolveShortcutByKeyboardEvent,
} from '@/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.js';

describe('keyboardShortcutRegistry behavior', () => {
  test('resolves canonical selection shortcuts with platform aliases', () => {
    const group = resolveShortcutByKeyboardEvent(
      new KeyboardEvent('keydown', { key: 'g', ctrlKey: true, bubbles: true, cancelable: true }),
    );
    const ungroup = resolveShortcutByKeyboardEvent(
      new KeyboardEvent('keydown', { key: 'g', ctrlKey: true, shiftKey: true, bubbles: true, cancelable: true }),
    );
    const clearSelection = resolveShortcutByKeyboardEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    );

    expect(group?.id).toBe('group');
    expect(ungroup?.id).toBe('ungroup');
    expect(clearSelection?.id).toBe('clearSelection');
  });

  test('lists shortcuts by scope with the expected selection actions', () => {
    const selectionShortcuts = getShortcutsByScope('selection').map((shortcut) => shortcut.id);

    expect(selectionShortcuts).toEqual(
      expect.arrayContaining(['copy', 'cut', 'duplicate', 'delete', 'group', 'ungroup', 'showInspector']),
    );
  });
});

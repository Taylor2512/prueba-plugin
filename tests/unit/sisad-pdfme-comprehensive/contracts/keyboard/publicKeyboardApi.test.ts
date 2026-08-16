import { describe, expect, it } from 'vitest';
import { KEYBOARD_SHORTCUTS, TOOLBAR_SINGLE, findShortcut } from '@sisad-pdfme/shared/keyboardShortcuts';

describe('keyboard shortcut public capability', () => {
  it('exposes the canonical shortcut catalog and lookup', () => {
    expect(KEYBOARD_SHORTCUTS.length).toBeGreaterThan(0);
    expect(TOOLBAR_SINGLE).toContain('delete');
    expect(findShortcut('Escape')?.id).toBe('escape');
  });
});

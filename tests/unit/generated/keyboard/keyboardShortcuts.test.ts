import { describe, expect, it } from 'vitest';
import {
  KEYBOARD_SHORTCUTS,
  findShortcut,
  normalizeKeyCombo,
  platformKey,
} from '@/sisad-pdfme/shared/keyboardShortcuts';

describe('keyboard shortcuts', () => {
  it('incluye acciones fundamentales', () => {
    const ids = new Set(KEYBOARD_SHORTCUTS.map((shortcut) => shortcut.id));
    for (const id of ['escape', 'select_all', 'delete', 'copy', 'paste', 'duplicate', 'undo', 'redo_shift', 'group', 'ungroup']) {
      expect(ids.has(id), `Falta shortcut ${id}`).toBe(true);
    }
  });

  it('normaliza combinación con modificadores en orden estable', () => {
    const event = new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, shiftKey: true });
    expect(normalizeKeyCombo(event)).toBe('Ctrl+Shift+z');
    expect(findShortcut('Ctrl+Shift+z')?.action).toBe('internal:redo');
  });

  it('encuentra shortcuts case-insensitive', () => {
    expect(findShortcut('ctrl+c')?.action).toBe('schema.copy');
    expect(findShortcut('DELETE')?.action).toBe('schema.delete');
  });

  it('platformKey produce una etiqueta legible', () => {
    expect(platformKey('Meta+c')).toMatch(/⌘|Meta|Ctrl/i);
  });
});

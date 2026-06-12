import { describe, it, expect } from 'vitest';
import {
  getShortcut,
  getShortcuts,
  getShortcutsByScope,
  resolveShortcutByKeyboardEvent,
  formatShortcutForPlatform,
} from '@/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.js';

describe('getShortcut', () => {
  it('returns the delete shortcut by id', () => {
    const s = getShortcut('delete');
    expect(s).toBeDefined();
    expect(s?.id).toBe('delete');
  });

  it('returns the copy shortcut by id', () => {
    const s = getShortcut('copy');
    expect(s?.id).toBe('copy');
  });

  it('returns undefined for unknown id', () => {
    expect(getShortcut('not_a_real_shortcut')).toBeUndefined();
  });
});

describe('getShortcuts', () => {
  it('returns a non-empty list', () => {
    expect(getShortcuts().length).toBeGreaterThan(0);
  });

  it('all shortcuts have id, keys array, and scope', () => {
    for (const s of getShortcuts()) {
      expect(typeof s.id).toBe('string');
      expect(Array.isArray(s.keys)).toBe(true);
      expect(typeof s.scope).toBe('string');
    }
  });
});

describe('getShortcutsByScope', () => {
  it('returns selection-scoped shortcuts', () => {
    const selection = getShortcutsByScope('selection');
    expect(selection.length).toBeGreaterThan(0);
    expect(selection.every((s) => s.scope === 'selection')).toBe(true);
  });

  it('returns canvas-scoped shortcuts', () => {
    const canvas = getShortcutsByScope('canvas');
    expect(canvas.length).toBeGreaterThan(0);
  });

  it('does not mix scopes', () => {
    const canvas = getShortcutsByScope('canvas');
    expect(canvas.every((s) => s.scope === 'canvas')).toBe(true);
  });
});

describe('resolveShortcutByKeyboardEvent', () => {
  const makeEvent = (key: string, ctrl = false, meta = false, shift = false): KeyboardEvent =>
    new KeyboardEvent('keydown', { key, ctrlKey: ctrl, metaKey: meta, shiftKey: shift, bubbles: true });

  it('resolves Delete key to delete shortcut', () => {
    const e = makeEvent('Delete');
    const resolved = resolveShortcutByKeyboardEvent(e);
    expect(resolved?.id).toBe('delete');
  });

  it('resolves Backspace to delete shortcut', () => {
    const e = makeEvent('Backspace');
    const resolved = resolveShortcutByKeyboardEvent(e);
    expect(resolved?.id).toBe('delete');
  });

  it('resolves Ctrl+Z to undo', () => {
    const e = makeEvent('z', true);
    const resolved = resolveShortcutByKeyboardEvent(e);
    expect(resolved?.id).toBe('undo');
  });

  it('returns undefined for unregistered key combo', () => {
    const e = makeEvent('F9');
    expect(resolveShortcutByKeyboardEvent(e)).toBeUndefined();
  });
});

describe('formatShortcutForPlatform', () => {
  it('returns a non-empty string for copy on mac', () => {
    const s = getShortcut('copy')!;
    const label = formatShortcutForPlatform(s, 'mac');
    expect(typeof label).toBe('string');
    expect(label.length).toBeGreaterThan(0);
  });

  it('returns a non-empty string for copy on windows', () => {
    const s = getShortcut('copy')!;
    const label = formatShortcutForPlatform(s, 'windows');
    expect(typeof label).toBe('string');
  });
});

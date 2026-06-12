import { describe, it, expect } from 'vitest';
import {
  detectShortcutPlatform,
  isMacShortcutPlatform,
  DESIGNER_SHORTCUTS,
} from '@/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.js';
import type { ShortcutDefinition } from '@/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.js';

// ─── detectShortcutPlatform ───────────────────────────────────────────────────

describe('detectShortcutPlatform', () => {
  it('returns a known platform string', () => {
    const platform = detectShortcutPlatform();
    expect(['mac', 'windows', 'linux']).toContain(platform);
  });
});

// ─── isMacShortcutPlatform ────────────────────────────────────────────────────

describe('isMacShortcutPlatform', () => {
  it('returns true for mac', () => {
    expect(isMacShortcutPlatform('mac')).toBe(true);
  });

  it('returns false for windows', () => {
    expect(isMacShortcutPlatform('windows')).toBe(false);
  });

  it('returns false for linux', () => {
    expect(isMacShortcutPlatform('linux')).toBe(false);
  });
});

// ─── DESIGNER_SHORTCUTS structure ────────────────────────────────────────────

describe('DESIGNER_SHORTCUTS', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(DESIGNER_SHORTCUTS)).toBe(true);
    expect(DESIGNER_SHORTCUTS.length).toBeGreaterThan(0);
  });

  it('every shortcut has required fields (id, label, keys, scope)', () => {
    for (const s of DESIGNER_SHORTCUTS) {
      expect(typeof s.id).toBe('string');
      expect(s.id.length).toBeGreaterThan(0);
      expect(typeof s.label).toBe('string');
      expect(Array.isArray(s.keys)).toBe(true);
      expect(s.keys.length).toBeGreaterThan(0);
      expect(typeof s.scope).toBe('string');
    }
  });

  it('ids are unique', () => {
    const ids = DESIGNER_SHORTCUTS.map((s: ShortcutDefinition) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('contains copy shortcut', () => {
    const copy = DESIGNER_SHORTCUTS.find((s: ShortcutDefinition) => s.id === 'copy');
    expect(copy).toBeDefined();
    expect(copy?.scope).toBe('selection');
  });

  it('contains undo shortcut', () => {
    const undo = DESIGNER_SHORTCUTS.find((s: ShortcutDefinition) => s.id === 'undo');
    expect(undo).toBeDefined();
    expect(undo?.scope).toBe('global');
  });

  it('contains redo shortcut', () => {
    const redo = DESIGNER_SHORTCUTS.find((s: ShortcutDefinition) => s.id === 'redo');
    expect(redo).toBeDefined();
  });

  it('contains delete shortcut marked as danger priority', () => {
    const del = DESIGNER_SHORTCUTS.find((s: ShortcutDefinition) => s.id === 'delete');
    expect(del).toBeDefined();
    expect(del?.priority).toBe('danger');
  });

  it('destructive selection shortcuts (delete, cut) require requiresSelection', () => {
    for (const id of ['delete', 'cut', 'duplicate', 'copy']) {
      const s = DESIGNER_SHORTCUTS.find((d: ShortcutDefinition) => d.id === id);
      expect(s?.requiresSelection).toBe(true);
    }
  });

  it('disabledWhenEditingText is defined for most shortcuts', () => {
    const withFlag = DESIGNER_SHORTCUTS.filter((s: ShortcutDefinition) => s.disabledWhenEditingText === true);
    expect(withFlag.length).toBeGreaterThan(5);
  });
});

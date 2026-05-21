/**
 * Tests: Keyboard Shortcuts cross-platform
 *
 * Cubre:
 *   - shared/keyboardShortcuts.ts: isMacOS, platformKey, normalizeKeyCombo, findShortcut,
 *     TOOLBAR_SINGLE, TOOLBAR_MULTI, KEYBOARD_SHORTCUTS
 *   - Designer/shared/keyboardShortcuts.ts: DESIGNER_SHORTCUTS incluyendo nuevos shortcuts
 *   - Designer/shared/keyboardShortcutRegistry.ts: registro, resolveShortcutByKeyboardEvent,
 *     formatShortcutForPlatform
 */
import { describe, it, expect, afterEach } from 'vitest';

// ── shared/keyboardShortcuts ───────────────────────────────────────────────────
import {
  isMacOS,
  platformKey,
  normalizeKeyCombo,
  findShortcut,
  KEYBOARD_SHORTCUTS,
  TOOLBAR_SINGLE,
  TOOLBAR_MULTI,
  type ToolbarAction,
} from '../../src/sisad-pdfme/shared/keyboardShortcuts.js';

// ── Designer/shared/keyboardShortcuts ─────────────────────────────────────────
import { DESIGNER_SHORTCUTS } from '../../src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcuts.js';

// ── Designer/shared/keyboardShortcutRegistry ─────────────────────────────────
import {
  getShortcut,
  getShortcuts,
  getShortcutsByScope,
  resolveShortcutByKeyboardEvent,
  formatShortcutForPlatform,
} from '../../src/sisad-pdfme/ui/components/Designer/shared/keyboardShortcutRegistry.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function mockNavigator(platform: string, userAgent = '') {
  Object.defineProperty(globalThis, 'navigator', {
    value: { platform, userAgent },
    configurable: true,
    writable: true,
  });
}

function makeKeyboardEvent(overrides: Partial<KeyboardEvent>): KeyboardEvent {
  return {
    key: '',
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    defaultPrevented: false,
    ...overrides,
  } as KeyboardEvent;
}

// ── shared/keyboardShortcuts.ts ───────────────────────────────────────────────

describe('isMacOS', () => {
  afterEach(() => {
    // Restore navigator
    Object.defineProperty(globalThis, 'navigator', {
      value: { platform: 'Linux x86_64', userAgent: 'Linux' },
      configurable: true,
      writable: true,
    });
  });

  it('retorna true cuando navigator.platform contiene "mac" (case-insensitive)', () => {
    mockNavigator('MacIntel');
    expect(isMacOS()).toBe(true);
  });

  it('retorna false en Linux', () => {
    mockNavigator('Linux x86_64');
    expect(isMacOS()).toBe(false);
  });

  it('retorna false en Win32', () => {
    mockNavigator('Win32');
    expect(isMacOS()).toBe(false);
  });

  it('retorna false cuando navigator no está disponible', () => {
    const saved = globalThis.navigator;
    Object.defineProperty(globalThis, 'navigator', { value: undefined, configurable: true });
    expect(isMacOS()).toBe(false);
    Object.defineProperty(globalThis, 'navigator', { value: saved, configurable: true });
  });
});

describe('platformKey', () => {
  it('reemplaza Meta por Ctrl en Linux', () => {
    mockNavigator('Linux x86_64');
    expect(platformKey('Meta+c')).toBe('Ctrl+c');
  });

  it('mantiene Meta en macOS', () => {
    mockNavigator('MacIntel');
    expect(platformKey('Meta+c')).toBe('Meta+c');
  });
});

describe('normalizeKeyCombo', () => {
  it('construye "Meta+c" para Cmd+C en Mac', () => {
    const event = makeKeyboardEvent({ key: 'c', metaKey: true });
    expect(normalizeKeyCombo(event)).toBe('Meta+c');
  });

  it('construye "Ctrl+z" para Ctrl+Z en Windows', () => {
    const event = makeKeyboardEvent({ key: 'z', ctrlKey: true });
    expect(normalizeKeyCombo(event)).toBe('Ctrl+z');
  });

  it('incluye Shift en el combo', () => {
    const event = makeKeyboardEvent({ key: 'z', metaKey: true, shiftKey: true });
    const combo = normalizeKeyCombo(event);
    expect(combo).toContain('Shift');
    expect(combo).toContain('z');
  });

  it('no incluye la tecla modificadora sola como parte del key', () => {
    const event = makeKeyboardEvent({ key: 'Meta', metaKey: true });
    const combo = normalizeKeyCombo(event);
    expect(combo).not.toContain('Meta+Meta');
  });
});

describe('findShortcut', () => {
  it('encuentra el shortcut "copy" por "Meta+c"', () => {
    const s = findShortcut('Meta+c');
    expect(s).toBeDefined();
    expect(s?.id).toBe('copy');
  });

  it('encuentra el shortcut "undo" por "Ctrl+z"', () => {
    const s = findShortcut('Ctrl+z');
    expect(s).toBeDefined();
    expect(s?.id).toBe('undo');
  });

  it('encuentra el shortcut "group" por "Meta+g"', () => {
    const s = findShortcut('Meta+g');
    expect(s).toBeDefined();
    expect(s?.id).toBe('group');
  });

  it('encuentra el shortcut "ungroup" por "Ctrl+Shift+g"', () => {
    const s = findShortcut('Ctrl+Shift+g');
    expect(s).toBeDefined();
    expect(s?.id).toBe('ungroup');
  });

  it('retorna undefined para una combinación desconocida', () => {
    expect(findShortcut('Ctrl+Shift+X9')).toBeUndefined();
  });
});

describe('KEYBOARD_SHORTCUTS table', () => {
  it('contiene todos los shortcuts básicos requeridos', () => {
    const ids = KEYBOARD_SHORTCUTS.map((s) => s.id);
    for (const required of ['delete', 'copy', 'paste', 'duplicate', 'undo', 'group', 'ungroup']) {
      expect(ids, `falta el shortcut: ${required}`).toContain(required);
    }
  });

  it('todos los shortcuts tienen al menos una tecla', () => {
    for (const s of KEYBOARD_SHORTCUTS) {
      expect(s.keys.length, `${s.id} debe tener keys`).toBeGreaterThan(0);
    }
  });

  it('no hay IDs duplicados', () => {
    const ids = KEYBOARD_SHORTCUTS.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('redo_y solo aplica en Windows (platform: windows)', () => {
    const redo = KEYBOARD_SHORTCUTS.find((s) => s.id === 'redo_y');
    expect(redo?.platform).toBe('windows');
  });
});

describe('TOOLBAR_SINGLE', () => {
  it('contiene las acciones de toolbar para selección única', () => {
    for (const action of ['delete', 'duplicate', 'copy'] as ToolbarAction[]) {
      expect(TOOLBAR_SINGLE).toContain(action);
    }
  });
});

describe('TOOLBAR_MULTI', () => {
  it('contiene acciones de alineación', () => {
    for (const action of ['align_left', 'align_right', 'distribute_horizontal'] as ToolbarAction[]) {
      expect(TOOLBAR_MULTI).toContain(action);
    }
  });
});

// ── Designer/shared/keyboardShortcuts.ts ─────────────────────────────────────

describe('DESIGNER_SHORTCUTS — nuevos atajos', () => {
  it('incluye group (Mod+G)', () => {
    const s = DESIGNER_SHORTCUTS.find((d) => d.id === 'group');
    expect(s).toBeDefined();
    expect(s?.macKeys).toContain('meta+g');
    expect(s?.windowsKeys).toContain('ctrl+g');
    expect(s?.requiresEditableStructure).toBe(true);
    expect(s?.requiresSelection).toBe(true);
  });

  it('incluye ungroup (Mod+Shift+G)', () => {
    const s = DESIGNER_SHORTCUTS.find((d) => d.id === 'ungroup');
    expect(s).toBeDefined();
    expect(s?.macKeys).toContain('meta+shift+g');
    expect(s?.windowsKeys).toContain('ctrl+shift+g');
  });

  it('incluye showInspector (Mod+Shift+I)', () => {
    const s = DESIGNER_SHORTCUTS.find((d) => d.id === 'showInspector');
    expect(s).toBeDefined();
    expect(s?.macKeys).toContain('meta+shift+i');
    expect(s?.windowsKeys).toContain('ctrl+shift+i');
  });

  it('incluye copyStyle (Mod+Shift+C)', () => {
    const s = DESIGNER_SHORTCUTS.find((d) => d.id === 'copyStyle');
    expect(s).toBeDefined();
    expect(s?.macKeys).toContain('meta+shift+c');
  });

  it('incluye pasteStyle (Mod+Shift+D)', () => {
    const s = DESIGNER_SHORTCUTS.find((d) => d.id === 'pasteStyle');
    expect(s).toBeDefined();
    expect(s?.macKeys).toContain('meta+shift+d');
    expect(s?.requiresEditableStructure).toBe(true);
  });

  it('no hay IDs duplicados en DESIGNER_SHORTCUTS', () => {
    const ids = DESIGNER_SHORTCUTS.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ── Designer/shared/keyboardShortcutRegistry.ts ──────────────────────────────

describe('keyboardShortcutRegistry', () => {
  it('getShortcut retorna un shortcut registrado por id', () => {
    const s = getShortcut('copy');
    expect(s).toBeDefined();
    expect(s?.id).toBe('copy');
  });

  it('getShortcutsByScope retorna solo los de ese scope', () => {
    const viewShortcuts = getShortcutsByScope('view');
    for (const s of viewShortcuts) {
      expect(s.scope).toBe('view');
    }
    expect(viewShortcuts.length).toBeGreaterThan(0);
  });

  it('resolveShortcutByKeyboardEvent resuelve "copy" en macOS (metaKey+c)', () => {
    const event = makeKeyboardEvent({ key: 'c', metaKey: true });
    // We need to pass the platform explicitly or rely on navigator
    // The registry detects platform from navigator; mock it
    mockNavigator('MacIntel');
    const s = resolveShortcutByKeyboardEvent(event, getShortcuts());
    expect(s?.id).toBe('copy');
  });

  it('resolveShortcutByKeyboardEvent resuelve "delete" con Backspace', () => {
    const event = makeKeyboardEvent({ key: 'Backspace' });
    const s = resolveShortcutByKeyboardEvent(event, getShortcuts());
    expect(s?.id).toBe('delete');
  });

  it('resolveShortcutByKeyboardEvent resuelve "group" con Ctrl+g en Windows', () => {
    mockNavigator('Win32');
    const event = makeKeyboardEvent({ key: 'g', ctrlKey: true });
    const s = resolveShortcutByKeyboardEvent(event, getShortcuts());
    expect(s?.id).toBe('group');
  });

  it('resolveShortcutByKeyboardEvent resuelve "ungroup" con Ctrl+Shift+g en Windows', () => {
    mockNavigator('Win32');
    const event = makeKeyboardEvent({ key: 'g', ctrlKey: true, shiftKey: true });
    const s = resolveShortcutByKeyboardEvent(event, getShortcuts());
    expect(s?.id).toBe('ungroup');
  });

  it('formatShortcutForPlatform muestra "Cmd" en macOS', () => {
    const shortcut = getShortcut('copy')!;
    const label = formatShortcutForPlatform(shortcut, 'mac');
    expect(label).toContain('Cmd');
  });

  it('formatShortcutForPlatform muestra "Ctrl" en Windows', () => {
    const shortcut = getShortcut('copy')!;
    const label = formatShortcutForPlatform(shortcut, 'windows');
    expect(label).toContain('Ctrl');
  });
});

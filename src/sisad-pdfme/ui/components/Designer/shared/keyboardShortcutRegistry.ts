import type { ShortcutDefinition, ShortcutPlatform } from './keyboardShortcuts.js';
import {
  DESIGNER_SHORTCUTS,
  detectShortcutPlatform,
  isMacShortcutPlatform,
} from './keyboardShortcuts.js';

export type { ShortcutDefinition, ShortcutPlatform } from './keyboardShortcuts.js';

const registry = new Map<string, ShortcutDefinition>();
const orderedIds: string[] = [];

const KEY_ALIASES: Record<string, string[]> = {
  cmd: ['mod'],
  command: ['mod'],
  meta: ['mod'],
  ctrl: ['mod'],
  control: ['mod'],
  option: ['alt'],
  alt: ['alt'],
  shift: ['shift'],
  esc: ['escape'],
  escape: ['escape'],
  del: ['delete'],
  delete: ['delete'],
  backspace: ['backspace'],
  return: ['enter'],
  enter: ['enter'],
  space: ['space'],
  comma: ['comma', ',', 'less'],
  period: ['period', '.', 'greater'],
  slash: ['slash', '/'],
  question: ['question', 'slash', '/'],
  plus: ['plus', 'equal', '+'],
  equal: ['equal', '='],
  minus: ['minus', 'hyphen', '-'],
  hyphen: ['hyphen', 'minus', '-'],
  pageup: ['pageup'],
  pagedown: ['pagedown'],
  arrowup: ['arrowup', 'up'],
  arrowdown: ['arrowdown', 'down'],
  arrowleft: ['arrowleft', 'left'],
  arrowright: ['arrowright', 'right'],
};

const normalizeToken = (token: string) => {
  const value = token.trim().toLowerCase();
  if (!value) return '';
  if (value === 'mod' || value === 'meta' || value === 'ctrl' || value === 'alt' || value === 'shift') return value;
  if (value === 'cmd' || value === 'command') return 'mod';
  if (value === 'control') return 'ctrl';
  if (value === 'option') return 'alt';
  if (value === 'esc') return 'escape';
  if (value === 'del') return 'delete';
  if (value === 'return') return 'enter';
  return value;
};

const normalizePattern = (pattern: string) => {
  const tokens = pattern
    .trim()
    .toLowerCase()
    .split('+')
    .map(normalizeToken)
    .filter(Boolean);

  const modifiers: string[] = [];
  let key = '';

  for (const token of tokens) {
    if (token === 'mod' || token === 'meta' || token === 'ctrl' || token === 'alt' || token === 'shift') {
      modifiers.push(token);
    } else {
      key = token;
    }
  }

  return { modifiers, key };
};

const getPatternVariants = (pattern: string) => {
  const { modifiers, key } = normalizePattern(pattern);

  const resolvedKey = key || '';
  const keyVariants = KEY_ALIASES[resolvedKey] || [resolvedKey];

  return keyVariants.map((variant) => {
    const resolvedModifiers = modifiers.filter(Boolean).join('+');

    return resolvedModifiers ? `${resolvedModifiers}+${variant}` : variant;
  });
};

const getEventKeyVariants = (event: KeyboardEvent) => {
  const key = String(event.key || '').trim().toLowerCase();
  const aliases = KEY_ALIASES[key] || [key];
  const values = new Set<string>(aliases);
  if (key === '?' && event.shiftKey) {
    values.add('slash');
  }
  if (key === '+' || key === '=') {
    values.add('plus');
    values.add('equal');
  }
  if (key === '-' || key === '_') {
    values.add('minus');
    values.add('hyphen');
  }
  return Array.from(values).filter(Boolean);
};

const getEventModifierVariants = (event: KeyboardEvent, platform: ShortcutPlatform) => {
  const common = [] as string[];
  if (event.altKey) common.push('alt');
  if (event.shiftKey) common.push('shift');

  const variants = [common];

  if (platform === 'mac' && event.metaKey) {
    variants.push([...common, 'mod']);
    variants.push([...common, 'meta']);
  } else if (platform !== 'mac' && event.ctrlKey) {
    variants.push([...common, 'mod']);
    variants.push([...common, 'ctrl']);
  }

  if (!event.metaKey && !event.ctrlKey) {
    variants.push(common);
  }

  return variants.map((tokens) => Array.from(new Set(tokens)).filter(Boolean).join('+')).filter(Boolean);
};

const getCandidateSignatures = (event: KeyboardEvent, platform: ShortcutPlatform) => {
  const keys = getEventKeyVariants(event);
  const modifierVariants = getEventModifierVariants(event, platform);
  const signatures = new Set<string>();

  for (const key of keys) {
    for (const modifiers of modifierVariants) {
      signatures.add(modifiers ? `${modifiers}+${key}` : key);
      if (event.shiftKey) {
        const shiftless = modifiers
          .split('+')
          .filter((token) => token !== 'shift')
          .join('+');
        signatures.add(shiftless ? `${shiftless}+${key}` : key);
      }
    }
  }

  return signatures;
};

const getShortcutPatterns = (shortcut: ShortcutDefinition, platform: ShortcutPlatform) => {
  if (platform === 'mac' && Array.isArray(shortcut.macKeys) && shortcut.macKeys.length > 0) {
    return shortcut.macKeys;
  }
  if (platform !== 'mac' && Array.isArray(shortcut.windowsKeys) && shortcut.windowsKeys.length > 0) {
    return shortcut.windowsKeys;
  }
  return shortcut.keys;
};

const getRegisteredShortcuts = () => orderedIds.map((id) => registry.get(id)).filter(Boolean) as ShortcutDefinition[];

export const registerShortcut = (shortcut: ShortcutDefinition): ShortcutDefinition => {
  if (!registry.has(shortcut.id)) {
    orderedIds.push(shortcut.id);
  }
  registry.set(shortcut.id, shortcut);
  return shortcut;
};

export const registerShortcuts = (shortcuts: ShortcutDefinition[]): ShortcutDefinition[] => shortcuts.map(registerShortcut);

export const getShortcut = (id: string): ShortcutDefinition | undefined => registry.get(id);

export const getShortcuts = (): ShortcutDefinition[] => getRegisteredShortcuts();

export const getShortcutsByScope = (scope: ShortcutDefinition['scope']): ShortcutDefinition[] =>
  getRegisteredShortcuts().filter((shortcut) => shortcut.scope === scope);

export const resolveShortcutByKeyboardEvent = (
  event: KeyboardEvent,
  shortcuts: ShortcutDefinition[] = getRegisteredShortcuts(),
): ShortcutDefinition | undefined => {
  const platform = detectShortcutPlatform();
  const candidates = getCandidateSignatures(event, platform);

  for (const shortcut of shortcuts) {
    const patterns = getShortcutPatterns(shortcut, platform).flatMap((pattern) => getPatternVariants(pattern));
    if (patterns.some((pattern) => candidates.has(pattern))) {
      return shortcut;
    }
  }

  return undefined;
};

const normalizeKeyLabel = (key: string, platform: ShortcutPlatform) => {
  const value = key.trim().toLowerCase();
  switch (value) {
    case 'mod':
      return isMacShortcutPlatform(platform) ? 'Cmd' : 'Ctrl';
    case 'meta':
      return isMacShortcutPlatform(platform) ? 'Cmd' : 'Meta';
    case 'ctrl':
      return 'Ctrl';
    case 'alt':
      return 'Alt';
    case 'shift':
      return 'Shift';
    case 'escape':
      return 'Esc';
    case 'enter':
      return 'Enter';
    case 'backspace':
      return 'Backspace';
    case 'delete':
      return 'Delete';
    case 'pageup':
      return 'Page Up';
    case 'pagedown':
      return 'Page Down';
    case 'arrowup':
    case 'up':
      return 'Up';
    case 'arrowdown':
    case 'down':
      return 'Down';
    case 'arrowleft':
    case 'left':
      return 'Left';
    case 'arrowright':
    case 'right':
      return 'Right';
    case 'question':
      return '?';
    case 'slash':
      return '/';
    case 'plus':
      return '+';
    case 'equal':
      return '=';
    case 'minus':
    case 'hyphen':
      return '-';
    case 'space':
      return 'Space';
    case 'comma':
      return ',';
    case 'period':
      return '.';
    default:
      return value.length === 1 ? value.toUpperCase() : value;
  }
};

const formatPattern = (pattern: string, platform: ShortcutPlatform) => {
  const { modifiers, key } = normalizePattern(pattern);
  const rendered: string[] = [];

  for (const modifier of modifiers) {
    rendered.push(normalizeKeyLabel(modifier, platform));
  }

  if (key) {
    rendered.push(normalizeKeyLabel(key, platform));
  }

  return rendered.join(' + ');
};

export const formatShortcutForPlatform = (
  shortcut: ShortcutDefinition,
  platform: ShortcutPlatform = detectShortcutPlatform(),
): string => {
  const patterns = getShortcutPatterns(shortcut, platform);
  const rendered = patterns.map((pattern) => formatPattern(pattern, platform));
  return Array.from(new Set(rendered)).join(' / ');
};

registerShortcuts(DESIGNER_SHORTCUTS);

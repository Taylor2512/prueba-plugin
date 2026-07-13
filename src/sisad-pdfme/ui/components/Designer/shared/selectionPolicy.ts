import { detectShortcutPlatform, type ShortcutPlatform } from './keyboardShortcuts.js';

export type PlatformKind = ShortcutPlatform | 'unknown';

export type SelectionIntent =
  | 'replace'      // Reemplaza la selección actual
  | 'toggle'       // Alterna (añade si no está, quita si está)
  | 'add'          // Añade a la selección actual
  | 'remove'       // Quita de la selección actual
  | 'clear'        // Limpia toda la selección
  | 'region'       // Inicia selección por región
  | 'inspect-only'; // Selecciona para ver detalles pero no para transformar (bloqueados)

export type SelectionPolicyInput = {
  platform: PlatformKind;
  event: MouseEvent | KeyboardEvent | React.MouseEvent | React.KeyboardEvent;
  isTargetSelected?: boolean;
  isTargetLocked?: boolean;
  pointerKind?: 'click' | 'double-click' | 'drag-region' | 'keyboard';
};

/**
 * Detecta la plataforma del usuario usando la utilidad existente de atajos.
 */
export function detectPlatform(): PlatformKind {
  try {
    return detectShortcutPlatform();
  } catch {
    return 'unknown';
  }
}

/**
 * Resuelve la intención de selección basada en el evento y la plataforma.
 */
export function resolveSelectionIntent(input: SelectionPolicyInput): SelectionIntent {
  const { platform, event, isTargetLocked, pointerKind } = input;
  
  const isMac = platform === 'mac';
  const ctrlKey = event.ctrlKey;
  const metaKey = event.metaKey;
  const shiftKey = event.shiftKey;

  // 1. Si está bloqueado, solo inspección
  if (isTargetLocked && pointerKind !== 'drag-region') {
    return 'inspect-only';
  }

  // 2. Lógica por plataforma para multi-selección
  if (isMac) {
    // macOS: Command es la tecla principal de multi-selección
    if (metaKey && !shiftKey) return 'toggle';
    if (metaKey && shiftKey) return 'add';
    if (shiftKey && !metaKey) return 'add';
  } else {
    // Windows/Linux: Control es la tecla principal
    if (ctrlKey && !shiftKey) return 'toggle';
    if (ctrlKey && shiftKey) return 'add';
    if (shiftKey && !ctrlKey) return 'add';
  }

  // 3. Región
  if (pointerKind === 'drag-region') {
    return (isMac ? metaKey || shiftKey : ctrlKey || shiftKey) ? 'add' : 'replace';
  }

  // 4. Doble click (por ahora lo tratamos como replace, pero podría ser edit)
  if (pointerKind === 'double-click') return 'replace';

  // 5. Click por defecto
  return 'replace';
}

/**
 * Indica si la intención es acumulativa.
 */
export function isAdditiveSelectionIntent(intent: SelectionIntent): boolean {
  return intent === 'toggle' || intent === 'add' || intent === 'region';
}

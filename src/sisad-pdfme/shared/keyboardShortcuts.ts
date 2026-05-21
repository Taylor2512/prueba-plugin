/**
 * FASE 6 — Keyboard Shortcuts y acciones rápidas
 *
 * Mapa completo de atajos de teclado del canvas.
 * Los shortcuts SOLO se activan cuando isCanvasFocused && !isInputFocused.
 * Excepción: Escape siempre actúa (cierra overlay activo o limpia selección).
 *
 * Plataforma: detectada en runtime — Meta en macOS, Ctrl en Windows/Linux.
 */
import type { CommandType } from './commandTypes.js';

export type InternalAction =
  | 'internal:clear_selection'
  | 'internal:close_overlay'
  | 'internal:select_all'
  | 'internal:focus_next'
  | 'internal:focus_prev'
  | 'internal:undo'
  | 'internal:redo';

export type ShortcutAction = CommandType | InternalAction;

export interface ShortcutDefinition {
  id: string;
  /** Combinaciones de teclas. Meta = Cmd en macOS, Ctrl en Windows. */
  keys: string[];
  action: ShortcutAction;
  requiresSelection: boolean;
  multiSchemaAllowed: boolean;
  description: string;
  platform: 'mac' | 'windows' | 'both';
}

/** Detecta si el entorno es macOS */
export function isMacOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /mac/i.test(navigator.platform);
}

/** Normaliza una combinación de teclas según la plataforma */
export function platformKey(key: string): string {
  const mod = isMacOS() ? 'Meta' : 'Ctrl';
  return key.replace(/Meta|Ctrl/g, mod);
}

export const KEYBOARD_SHORTCUTS: ShortcutDefinition[] = [
  // ── Escape — prioridad máxima, siempre activo ────────────────────────────
  {
    id: 'escape',
    keys: ['Escape'],
    action: 'internal:close_overlay',
    requiresSelection: false,
    multiSchemaAllowed: false,
    description: 'Cerrar overlay activo o limpiar selección',
    platform: 'both',
  },

  // ── Navegación ───────────────────────────────────────────────────────────
  {
    id: 'select_all',
    keys: ['Meta+a', 'Ctrl+a'],
    action: 'internal:select_all',
    requiresSelection: false,
    multiSchemaAllowed: true,
    description: 'Seleccionar todos los schemas de la página actual',
    platform: 'both',
  },
  {
    id: 'tab_next',
    keys: ['Tab'],
    action: 'internal:focus_next',
    requiresSelection: false,
    multiSchemaAllowed: false,
    description: 'Enfocar el siguiente schema en la página',
    platform: 'both',
  },
  {
    id: 'tab_prev',
    keys: ['Shift+Tab'],
    action: 'internal:focus_prev',
    requiresSelection: false,
    multiSchemaAllowed: false,
    description: 'Enfocar el schema anterior',
    platform: 'both',
  },

  // ── Mover (1 unidad) ─────────────────────────────────────────────────────
  {
    id: 'move_up',
    keys: ['ArrowUp'],
    action: 'schema.move',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Mover 1px hacia arriba',
    platform: 'both',
  },
  {
    id: 'move_down',
    keys: ['ArrowDown'],
    action: 'schema.move',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Mover 1px hacia abajo',
    platform: 'both',
  },
  {
    id: 'move_left',
    keys: ['ArrowLeft'],
    action: 'schema.move',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Mover 1px hacia la izquierda',
    platform: 'both',
  },
  {
    id: 'move_right',
    keys: ['ArrowRight'],
    action: 'schema.move',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Mover 1px hacia la derecha',
    platform: 'both',
  },

  // ── Mover (10 unidades) ──────────────────────────────────────────────────
  {
    id: 'move_up_10',
    keys: ['Shift+ArrowUp'],
    action: 'schema.move',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Mover 10px hacia arriba',
    platform: 'both',
  },
  {
    id: 'move_down_10',
    keys: ['Shift+ArrowDown'],
    action: 'schema.move',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Mover 10px hacia abajo',
    platform: 'both',
  },
  {
    id: 'move_left_10',
    keys: ['Shift+ArrowLeft'],
    action: 'schema.move',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Mover 10px hacia la izquierda',
    platform: 'both',
  },
  {
    id: 'move_right_10',
    keys: ['Shift+ArrowRight'],
    action: 'schema.move',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Mover 10px hacia la derecha',
    platform: 'both',
  },

  // ── Edición ──────────────────────────────────────────────────────────────
  {
    id: 'delete',
    keys: ['Delete', 'Backspace'],
    action: 'schema.delete',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Eliminar schema(s) seleccionado(s) — respeta guards',
    platform: 'both',
  },
  {
    id: 'copy',
    keys: ['Meta+c', 'Ctrl+c'],
    action: 'schema.copy',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Copiar schema(s) al portapapeles interno',
    platform: 'both',
  },
  {
    id: 'paste',
    keys: ['Meta+v', 'Ctrl+v'],
    action: 'schema.paste',
    requiresSelection: false,
    multiSchemaAllowed: true,
    description: 'Pegar schema(s) copiados (+10,+10 o centrado en nueva página)',
    platform: 'both',
  },
  {
    id: 'duplicate',
    keys: ['Meta+d', 'Ctrl+d'],
    action: 'schema.duplicate',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Duplicar in-place con offset +10,+10',
    platform: 'both',
  },

  // ── Undo / Redo ──────────────────────────────────────────────────────────
  {
    id: 'undo',
    keys: ['Meta+z', 'Ctrl+z'],
    action: 'internal:undo',
    requiresSelection: false,
    multiSchemaAllowed: false,
    description: 'Deshacer la última acción',
    platform: 'both',
  },
  {
    id: 'redo_shift',
    keys: ['Meta+Shift+z', 'Ctrl+Shift+z'],
    action: 'internal:redo',
    requiresSelection: false,
    multiSchemaAllowed: false,
    description: 'Rehacer (Shift+Z)',
    platform: 'both',
  },
  {
    id: 'redo_y',
    keys: ['Ctrl+y'],
    action: 'internal:redo',
    requiresSelection: false,
    multiSchemaAllowed: false,
    description: 'Rehacer (Y — convención Windows)',
    platform: 'windows',
  },

  // ── Z-order ──────────────────────────────────────────────────────────────
  {
    id: 'bring_forward',
    keys: ['Meta+]', 'Ctrl+]'],
    action: 'schema.bring_forward',
    requiresSelection: true,
    multiSchemaAllowed: false,
    description: 'Traer al frente un nivel',
    platform: 'both',
  },
  {
    id: 'send_backward',
    keys: ['Meta+[', 'Ctrl+['],
    action: 'schema.send_backward',
    requiresSelection: true,
    multiSchemaAllowed: false,
    description: 'Enviar atrás un nivel',
    platform: 'both',
  },
  {
    id: 'bring_to_front',
    keys: ['Meta+Shift+]', 'Ctrl+Shift+]'],
    action: 'schema.bring_to_front',
    requiresSelection: true,
    multiSchemaAllowed: false,
    description: 'Traer al frente del todo',
    platform: 'both',
  },
  {
    id: 'send_to_back',
    keys: ['Meta+Shift+[', 'Ctrl+Shift+['],
    action: 'schema.send_to_back',
    requiresSelection: true,
    multiSchemaAllowed: false,
    description: 'Enviar al fondo del todo',
    platform: 'both',
  },

  // ── Agrupación ───────────────────────────────────────────────────────────
  {
    id: 'group',
    keys: ['Meta+g', 'Ctrl+g'],
    action: 'schema.group',
    requiresSelection: true,
    multiSchemaAllowed: true,
    description: 'Agrupar schemas seleccionados',
    platform: 'both',
  },
  {
    id: 'ungroup',
    keys: ['Meta+Shift+g', 'Ctrl+Shift+g'],
    action: 'schema.ungroup',
    requiresSelection: true,
    multiSchemaAllowed: false,
    description: 'Desagrupar el grupo seleccionado',
    platform: 'both',
  },
];

/** Acciones disponibles en la toolbar flotante según contexto de selección */
export type ToolbarAction =
  | 'delete'
  | 'duplicate'
  | 'copy'
  | 'assign_recipient'
  | 'lock'
  | 'unlock'
  | 'comment'
  | 'properties'
  // Solo multi:
  | 'align_left'
  | 'align_center_h'
  | 'align_right'
  | 'align_top'
  | 'align_center_v'
  | 'align_bottom'
  | 'distribute_horizontal'
  | 'distribute_vertical';

export const TOOLBAR_SINGLE: ToolbarAction[] = [
  'delete', 'duplicate', 'copy', 'assign_recipient', 'lock', 'comment', 'properties',
];

export const TOOLBAR_MULTI: ToolbarAction[] = [
  'delete', 'duplicate', 'copy', 'assign_recipient',
  'align_left', 'align_center_h', 'align_right',
  'distribute_horizontal', 'distribute_vertical',
];

/** Normaliza una tecla presionada a la convención del mapa de atajos */
export function normalizeKeyCombo(event: KeyboardEvent): string {
  const parts: string[] = [];
  if (event.metaKey) parts.push('Meta');
  if (event.ctrlKey) parts.push('Ctrl');
  if (event.shiftKey) parts.push('Shift');
  if (event.altKey) parts.push('Alt');
  if (event.key && event.key !== 'Meta' && event.key !== 'Control' &&
      event.key !== 'Shift' && event.key !== 'Alt') {
    parts.push(event.key);
  }
  return parts.join('+');
}

/** Busca la definición del shortcut para un key combo dado */
export function findShortcut(keyCombo: string): ShortcutDefinition | undefined {
  const lower = keyCombo.toLowerCase();
  return KEYBOARD_SHORTCUTS.find((s) =>
    s.keys.some((k) => k.toLowerCase() === lower),
  );
}

/**
 * Action Registry
 *
 * Centralized declarative registry for all schema actions in the designer.
 * Each action declares its presentation mode, visibility rules and execution
 * contract so that toolbars, context menus and inspectors can resolve actions
 * from a single source of truth without duplicating logic.
 *
 * Design principles:
 *  - No inline complex config: actions with presentationMode 'modal' or
 *    'drawer' are expected to open a dedicated surface instead of rendering
 *    inline widgets in the sidebar.
 *  - Composable filtering: consumers call `getActionsForContext` to get the
 *    right subset of actions for their display surface.
 *  - No UI imports here: this module is pure data / behaviour, keeping it
 *    testable and tree-shakeable independently from React.
 */

import type { SchemaForUI } from '@sisad-pdfme/common';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ActionPriority = 'primary' | 'secondary' | 'danger';

export type ActionPresentationMode =
  | 'inline'
  | 'popover'
  | 'modal'
  | 'drawer'
  | 'contextMenu'
  | 'hidden';

export type ActionContext = {
  activeSchemas: SchemaForUI[];
  selectionCount: number;
  canEditStructure: boolean;
  isLocked?: boolean;
};

export type SchemaActionDefinition = {
  /** Unique identifier used to look up and execute the action. */
  id: string;
  /** Human-readable label for buttons, menu items and tooltips. */
  label: string;
  /** Optional semantic grouping (e.g. 'structure', 'data', 'collaboration'). */
  section?: string;
  /** Visual priority that drives toolbar placement. */
  priority?: ActionPriority;
  /**
   * How this action should be surfaced in the UI.
   * - 'inline'      → rendered directly in the inspector or toolbar
   * - 'popover'     → opens a small popover anchored to the trigger
   * - 'modal'       → opens a full modal dialog
   * - 'drawer'      → opens a side drawer
   * - 'contextMenu' → shown only in right-click context menus
   * - 'hidden'      → registered but never auto-rendered
   */
  presentationMode?: ActionPresentationMode;
  /**
   * Schema types this action supports.  If omitted the action applies to all
   * types.  Use the lowercase `schema.type` value (e.g. 'text', 'checkbox').
   */
  supportsSchemaTypes?: string[];
  /** When true, the action requires an exclusive lock before it can execute. */
  requiresLock?: boolean;
  /** When true, a confirmation dialog is shown before `execute` is called. */
  requiresConfirmation?: boolean;
  /** Returns false to hide the action from the surface entirely. */
  isVisible?: (context: ActionContext) => boolean;
  /** Returns false to render the action disabled (but still visible). */
  isEnabled?: (context: ActionContext) => boolean;
  /** Executes the action.  Called after confirmation when required. */
  execute?: (context: ActionContext) => void;
};

// ── Registry store ─────────────────────────────────────────────────────────────

const _registry = new Map<string, SchemaActionDefinition>();

// ── Public API ─────────────────────────────────────────────────────────────────

/** Register or replace a single action definition. */
export const registerAction = (definition: SchemaActionDefinition): void => {
  _registry.set(definition.id, definition);
};

/** Register multiple action definitions at once. */
export const registerActions = (definitions: SchemaActionDefinition[]): void => {
  for (const def of definitions) {
    _registry.set(def.id, def);
  }
};

/** Retrieve a single action definition by id, or undefined if not registered. */
export const getAction = (id: string): SchemaActionDefinition | undefined =>
  _registry.get(id);

/** Return all registered actions, optionally filtered. */
export const getActions = (
  filter?: Partial<Pick<SchemaActionDefinition, 'section' | 'priority' | 'presentationMode'>>,
): SchemaActionDefinition[] => {
  const all = Array.from(_registry.values());
  if (!filter) return all;
  return all.filter((action) => {
    if (filter.section !== undefined && action.section !== filter.section) return false;
    if (filter.priority !== undefined && action.priority !== filter.priority) return false;
    if (filter.presentationMode !== undefined && action.presentationMode !== filter.presentationMode) return false;
    return true;
  });
};

/**
 * Return actions that are visible and enabled for the given context, sorted by
 * priority (primary → secondary → danger).
 */
export const getActionsForContext = (
  context: ActionContext,
  filter?: Partial<Pick<SchemaActionDefinition, 'section' | 'priority' | 'presentationMode'>>,
): SchemaActionDefinition[] => {
  const schemaType = context.activeSchemas[0]?.type?.toLowerCase?.() ?? '';
  const candidates = getActions(filter);

  const priorityOrder: Record<ActionPriority, number> = { primary: 0, secondary: 1, danger: 2 };

  return candidates
    .filter((action) => {
      // Filter by schema type support
      if (
        action.supportsSchemaTypes &&
        action.supportsSchemaTypes.length > 0 &&
        schemaType &&
        !action.supportsSchemaTypes.includes(schemaType)
      ) {
        return false;
      }
      // Filter by visibility rule
      if (action.isVisible && !action.isVisible(context)) return false;
      return true;
    })
    .sort((a, b) => {
      const pa = a.priority ? priorityOrder[a.priority] : 1;
      const pb = b.priority ? priorityOrder[b.priority] : 1;
      return pa - pb;
    });
};

/** Remove a previously registered action. */
export const unregisterAction = (id: string): boolean => _registry.delete(id);

/** Clear all registered actions.  Useful for testing. */
export const clearActionRegistry = (): void => _registry.clear();

// ── Built-in core actions ──────────────────────────────────────────────────────
//
// These are the canonical action definitions for the built-in designer.
// Each plugin or feature can call `registerAction` to extend the registry.

const CORE_ACTIONS: SchemaActionDefinition[] = [
  // ── Structure ──
  {
    id: 'duplicate',
    label: 'Duplicar',
    section: 'structure',
    priority: 'primary',
    presentationMode: 'inline',
    requiresConfirmation: false,
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  {
    id: 'delete',
    label: 'Eliminar',
    section: 'structure',
    priority: 'danger',
    presentationMode: 'inline',
    requiresConfirmation: true,
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  {
    id: 'editText',
    label: 'Editar texto',
    section: 'structure',
    priority: 'primary',
    presentationMode: 'inline',
    supportsSchemaTypes: ['text', 'multivariabletext'],
    isEnabled: (ctx) => ctx.canEditStructure && !ctx.isLocked,
  },
  // ── State toggles ──
  {
    id: 'toggleRequired',
    label: 'Marcar obligatorio',
    section: 'state',
    priority: 'secondary',
    presentationMode: 'contextMenu',
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  {
    id: 'toggleHidden',
    label: 'Ocultar',
    section: 'state',
    priority: 'secondary',
    presentationMode: 'contextMenu',
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  {
    id: 'toggleReadOnly',
    label: 'Bloquear',
    section: 'state',
    priority: 'secondary',
    presentationMode: 'contextMenu',
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  // ── Ordering ──
  {
    id: 'bringForward',
    label: 'Traer al frente',
    section: 'order',
    priority: 'secondary',
    presentationMode: 'contextMenu',
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  {
    id: 'sendBackward',
    label: 'Enviar atrás',
    section: 'order',
    priority: 'secondary',
    presentationMode: 'contextMenu',
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  // ── Style ──
  {
    id: 'copyStyle',
    label: 'Copiar estilo',
    section: 'style',
    priority: 'secondary',
    presentationMode: 'contextMenu',
  },
  {
    id: 'pasteStyle',
    label: 'Pegar estilo',
    section: 'style',
    priority: 'secondary',
    presentationMode: 'contextMenu',
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  // ── Connections & Collaboration (complex → open in modal) ──
  {
    id: 'openConnections',
    label: 'Configurar conexiones',
    section: 'data',
    priority: 'secondary',
    presentationMode: 'modal',
    requiresLock: false,
    isVisible: (ctx) => ctx.activeSchemas.length === 1,
    isEnabled: (ctx) => ctx.canEditStructure,
  },
  {
    id: 'openCollaboration',
    label: 'Gestionar colaboración',
    section: 'collaboration',
    priority: 'secondary',
    presentationMode: 'modal',
    isVisible: (ctx) => ctx.activeSchemas.length === 1,
  },
  // ── Comments ──
  {
    id: 'addComment',
    label: 'Agregar comentario',
    section: 'comments',
    priority: 'secondary',
    presentationMode: 'modal',
  },
  {
    id: 'viewComments',
    label: 'Ver comentarios',
    section: 'comments',
    priority: 'secondary',
    presentationMode: 'drawer',
  },
  // ── Anchors ──
  {
    id: 'addAnchor',
    label: 'Agregar anchor',
    section: 'comments',
    priority: 'secondary',
    presentationMode: 'contextMenu',
    isVisible: (ctx) => ctx.activeSchemas.length === 1,
  },
];

registerActions(CORE_ACTIONS);

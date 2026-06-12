/**
 * Schema interaction capabilities contract.
 *
 * Defines what canvas interactions each schema type supports.
 * Single source of truth for: can drag, can resize, can rotate,
 * can inline-edit, is option-based, has floating-action overlay.
 *
 * Does NOT contain business rules — those live in Canvas.tsx /
 * Moveable.tsx / selectionCommands.ts. This module only declares
 * the static per-type contract.
 */

export type SchemaInteractionCapabilities = {
  /** Schema can be moved on the canvas (drag). Always true for non-locked schemas. */
  canDrag: boolean;
  /** Schema bounding box can be resized via Moveable handles. */
  canResize: boolean;
  /** Schema can be rotated via Moveable rotate handle. */
  canRotate: boolean;
  /** Double-click on canvas opens inline text editor. */
  canInlineEdit: boolean;
  /** Schema carries an options array (checkboxGroup, radioGroup, select). */
  isOptionBased: boolean;
  /**
   * Schema type shows a GroupOptionFloatingAction "+" button
   * as an external overlay below the Moveable control box.
   */
  hasGroupFloatingAction: boolean;
  /** Schema requires a signing provider (signature, initials, stamp). */
  requiresProvider: boolean;
  /** Schema is purely decorative/layout — no user data (line, rect, ellipse). */
  isShape: boolean;
  /** Schema renders media (image, svg). */
  isMedia: boolean;
};

// ─── Type sets ───────────────────────────────────────────────────────────────

const DRAGGABLE: ReadonlySet<string> = new Set(['*']);

const NON_RESIZABLE: ReadonlySet<string> = new Set([
  // none currently — all standard types support resize
]);

const NON_ROTATABLE: ReadonlySet<string> = new Set([
  'attachment',
  'approve',
  'decline',
  'note',
]);

const INLINE_EDITABLE: ReadonlySet<string> = new Set([
  'text',
  'multivariabletext',
]);

const OPTION_BASED: ReadonlySet<string> = new Set([
  'checkbox',
  'checkboxGroup',
  'radioGroup',
  'select',
  'dropdown',
]);

/** Only checkboxGroup and radioGroup have the floating "+" overlay. */
const HAS_GROUP_FLOATING_ACTION: ReadonlySet<string> = new Set([
  'checkboxGroup',
  'radioGroup',
]);

const REQUIRES_PROVIDER: ReadonlySet<string> = new Set([
  'signature',
  'initials',
  'stamp',
]);

const SHAPES: ReadonlySet<string> = new Set([
  'line',
  'rectangle',
  'ellipse',
]);

const MEDIA: ReadonlySet<string> = new Set([
  'image',
  'svg',
]);

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Returns the interaction capabilities for a given schema type.
 * Unknown types receive sensible defaults (all standard ops allowed).
 */
export const getSchemaInteractionCapabilities = (
  schemaType: string,
): SchemaInteractionCapabilities => {
  const t = (schemaType || '').toLowerCase();
  return {
    canDrag: true,
    canResize: !NON_RESIZABLE.has(t) && !NON_RESIZABLE.has(schemaType),
    canRotate: !NON_ROTATABLE.has(t) && !NON_ROTATABLE.has(schemaType),
    canInlineEdit: INLINE_EDITABLE.has(t) || INLINE_EDITABLE.has(schemaType),
    isOptionBased: OPTION_BASED.has(t) || OPTION_BASED.has(schemaType),
    hasGroupFloatingAction:
      HAS_GROUP_FLOATING_ACTION.has(t) || HAS_GROUP_FLOATING_ACTION.has(schemaType),
    requiresProvider: REQUIRES_PROVIDER.has(t) || REQUIRES_PROVIDER.has(schemaType),
    isShape: SHAPES.has(t) || SHAPES.has(schemaType),
    isMedia: MEDIA.has(t) || MEDIA.has(schemaType),
  };
};

/**
 * Convenience helper: returns true when the schema type should show
 * the GroupOptionFloatingAction "+" button as an external overlay.
 */
export const schemaHasGroupFloatingAction = (schemaType: string): boolean =>
  getSchemaInteractionCapabilities(schemaType).hasGroupFloatingAction;

/**
 * Convenience helper: returns true when the schema type supports
 * options-based editing (checkboxGroup, radioGroup, select/dropdown).
 */
export const schemaIsOptionBased = (schemaType: string): boolean =>
  getSchemaInteractionCapabilities(schemaType).isOptionBased;

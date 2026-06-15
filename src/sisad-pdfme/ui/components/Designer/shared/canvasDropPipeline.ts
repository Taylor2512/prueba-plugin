/**
 * Canvas drop pipeline — types and documentation.
 *
 * Formalizes the flow from palette pointer-down to schema commit.
 * Does NOT implement the flow — Canvas.tsx and LeftSidebar.tsx own
 * the implementation. This module provides shared types and
 * validation utilities used across the pipeline.
 *
 * Pipeline steps:
 *  1. palette pointerdown → create DropPayload
 *  2. activate externalSchemaDragActive flag
 *  3. detect document/page under pointer (designerCoordinateService)
 *  4. convert clientX/clientY to page-local mm coordinates
 *     (apply zoom, scroll, page offset)
 *  5. resolve active recipient → ownerRecipientId, ownerColor
 *  6. smartPlacement (collision-aware nudge)
 *  7. no-overlap check per owner/document/page
 *  8. if no space: next page/PDF or return DropResult.noSpace
 *  9. commit via changeSchemas
 * 10. select created schema, open DetailView if applicable
 */

import { asRecord } from './objectGuards.js';

// ─── Types ───────────────────────────────────────────────────────────────────

export type DropPayload = {
  /** Schema type to instantiate (e.g. 'text', 'checkboxGroup'). */
  schemaType: string;
  /** Suggested initial width in mm (from plugin defaultSchema). */
  defaultWidthMm?: number;
  /** Suggested initial height in mm (from plugin defaultSchema). */
  defaultHeightMm?: number;
  /** clientX at drop point. */
  clientX: number;
  /** clientY at drop point. */
  clientY: number;
  /** Override zoom (defaults to current designer zoom). */
  zoom?: number;
};

export type DropTarget = {
  documentId: string;
  pageNumber: number;
  /** Drop position in page-local mm coordinates. */
  x: number;
  y: number;
};

export type DropOwner = {
  ownerRecipientId: string | null;
  ownerColor: string | null;
};

export type DropResult =
  | { status: 'committed'; schemaId: string }
  | { status: 'noSpace'; reason: string }
  | { status: 'cancelled' }
  | { status: 'error'; reason: string };

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Returns true when the drop payload is structurally valid
 * (has a schemaType and finite coordinates).
 */
export const isValidDropPayload = (payload: unknown): payload is DropPayload => {
  const p = asRecord(payload);
  if (!p) return false;
  return (
    typeof p.schemaType === 'string' &&
    p.schemaType.trim().length > 0 &&
    typeof p.clientX === 'number' &&
    Number.isFinite(p.clientX) &&
    typeof p.clientY === 'number' &&
    Number.isFinite(p.clientY)
  );
};

/**
 * Returns true when the drop target has a valid document+page+position.
 */
export const isValidDropTarget = (target: unknown): target is DropTarget => {
  const t = asRecord(target);
  if (!t) return false;
  return (
    typeof t.documentId === 'string' &&
    t.documentId.trim().length > 0 &&
    typeof t.pageNumber === 'number' &&
    Number.isFinite(t.pageNumber) &&
    typeof t.x === 'number' &&
    Number.isFinite(t.x) &&
    typeof t.y === 'number' &&
    Number.isFinite(t.y)
  );
};

/**
 * Clamps a page-local position so the schema stays fully inside
 * the page bounds (in mm).
 */
export const clampDropPositionToPage = (
  x: number,
  y: number,
  widthMm: number,
  heightMm: number,
  pageWidthMm: number,
  pageHeightMm: number,
): { x: number; y: number } => ({
  x: Math.max(0, Math.min(x, pageWidthMm - widthMm)),
  y: Math.max(0, Math.min(y, pageHeightMm - heightMm)),
});

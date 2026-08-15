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

import { asRecord } from '@sisad-pdfme/shared/objectGuards';
import {
  clientPointToPagePoint,
  getPageRectInViewport,
  pagePointToSchemaPoint,
  type DOMRectLike,
  type Point,
} from '@sisad-pdfme/ui/components/Designer/shared/coordinateMath';

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

export type ResolvePointerDropTargetInput = {
  clientX: number;
  clientY: number;
  paperRefs: Array<HTMLElement | null | undefined> | { current?: Array<HTMLElement | null | undefined> | null };
  pageSizes?: Array<{ width: number; height: number } | null | undefined>;
  scale?: number;
  activeDocumentId?: string | null;
  canvasElement?: HTMLElement | null;
  pageCursor?: number;
  preferredPageIndex?: number | null;
};

export type ResolvePointerDropTargetResult = {
  documentId: string | null;
  pageIndex: number;
  pageNumber: number;
  paperRect: DOMRectLike | null;
  pagePointPx: Point | null;
  schemaPointMm: Point | null;
  isOverPage: boolean;
  isOverCanvas: boolean;
  dropValid: boolean;
};

const isPointInRect = (x: number, y: number, rect: DOMRectLike) =>
  x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

const pointDistanceToRect = (x: number, y: number, rect: DOMRectLike) => {
  const dx =
    x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0;
  const dy =
    y < rect.top ? rect.top - y : y > rect.bottom ? y - rect.bottom : 0;
  return Math.hypot(dx, dy);
};

const resolvePaperElements = (
  paperRefs: ResolvePointerDropTargetInput['paperRefs'],
): Array<HTMLElement | null | undefined> => (Array.isArray(paperRefs) ? paperRefs : paperRefs.current || []);

export const resolvePointerDropTarget = ({
  clientX,
  clientY,
  paperRefs,
  pageSizes = [],
  scale = 1,
  activeDocumentId = null,
  canvasElement = null,
  pageCursor = -1,
  preferredPageIndex = null,
}: ResolvePointerDropTargetInput): ResolvePointerDropTargetResult => {
  const papers = resolvePaperElements(paperRefs);
  const canvasRect = canvasElement ? canvasElement.getBoundingClientRect() : null;
  const hitIndex = papers.findIndex((paper) => {
    if (!paper) return false;
    const rect = getPageRectInViewport(paper);
    return isPointInRect(clientX, clientY, rect);
  });

  const isOverCanvas = canvasRect ? isPointInRect(clientX, clientY, canvasRect) : hitIndex >= 0;
  const hasHit = hitIndex >= 0;
  const preferredIndex =
    Number.isInteger(preferredPageIndex) && preferredPageIndex != null && preferredPageIndex >= 0
      ? preferredPageIndex
      : -1;
  const preferredPaper = preferredIndex >= 0 ? papers[preferredIndex] || null : null;
  const preferredDistance =
    preferredPaper && isOverCanvas ? pointDistanceToRect(clientX, clientY, getPageRectInViewport(preferredPaper)) : Number.POSITIVE_INFINITY;
  const seamTolerancePx = Math.max(16, 24 * Math.max(1, scale));
  const preferredWithinTolerance = preferredDistance <= seamTolerancePx;
  const fallbackPageIndex = Number.isInteger(pageCursor) && pageCursor >= 0 ? pageCursor : -1;
  const pageIndex = hasHit
    ? hitIndex
    : preferredWithinTolerance && preferredIndex >= 0
      ? preferredIndex
      : fallbackPageIndex;
  const paperElement =
    pageIndex >= 0 ? papers[pageIndex] || null : null;
  const paperRect = paperElement ? getPageRectInViewport(paperElement) : null;
  const pagePointPx = paperRect ? clientPointToPagePoint(clientX, clientY, paperRect, scale) : null;
  const schemaPointMm = pagePointPx ? pagePointToSchemaPoint(pagePointPx) : null;
  const isOverPage = hasHit || (preferredWithinTolerance && preferredIndex >= 0) || fallbackPageIndex >= 0;

  return {
    documentId: activeDocumentId || null,
    pageIndex,
    pageNumber: pageIndex >= 0 ? pageIndex + 1 : 0,
    paperRect,
    pagePointPx,
    schemaPointMm,
    isOverPage,
    isOverCanvas,
    dropValid: isOverPage && isOverCanvas,
  };
};

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

import { cloneDeep } from '@sisad-pdfme/common';
import {
  sanitizeIdentifier,
  chunkItems,
  createSchemaByType,
  createAuditMetadata as defaultCreateAuditMetadata,
} from './schemaFactory.js';

/** Default vertical grid used to lay out showcase schemas on a page. */
export const SHOWCASE_GRID_POSITIONS: ReadonlyArray<{ x: number; y: number }> = [
  { x: 18, y: 24 },
  { x: 18, y: 68 },
  { x: 18, y: 112 },
  { x: 18, y: 156 },
  { x: 18, y: 200 },
  { x: 18, y: 244 },
];

type Rect = { x: number; y: number; width: number; height: number };

export const rectsIntersect = (a: Rect, b: Rect): boolean => {
  const ax1 = a.x || 0;
  const ay1 = a.y || 0;
  const ax2 = (a.x || 0) + (a.width || 0);
  const ay2 = (a.y || 0) + (a.height || 0);

  const bx1 = b.x || 0;
  const by1 = b.y || 0;
  const bx2 = (b.x || 0) + (b.width || 0);
  const by2 = (b.y || 0) + (b.height || 0);

  return !(ax2 <= bx1 || bx2 <= ax1 || ay2 <= by1 || by2 <= ay1);
};

/**
 * Merges two page arrays. When an extra page's schema bounding-box collides
 * with a base schema, the whole extra page is shifted right by `shiftX`.
 */
export const mergeSchemaPages = (
  basePages: any[][] = [],
  extraPages: any[][] = [],
  pageCount = 1,
  shiftX = 120,
): any[][] => {
  const safePageCount = Math.max(1, Number(pageCount) || 1);
  return Array.from({ length: safePageCount }, (_, pageIndex) => {
    const base = cloneDeep(basePages[pageIndex] || []);
    let extra = cloneDeep(extraPages[pageIndex] || []);

    const occupiedRects = base.map((s: any) => ({
      x: s?.position?.x || 0,
      y: s?.position?.y || 0,
      width: s?.width || 0,
      height: s?.height || 0,
    }));

    const collides = extra.some((s: any) => {
      const r = { x: s?.position?.x || 0, y: s?.position?.y || 0, width: s?.width || 0, height: s?.height || 0 };
      return occupiedRects.some((br: Rect) => rectsIntersect(r, br));
    });

    if (collides) {
      extra = extra.map((s: any) => ({
        ...s,
        position: { ...(s.position || {}), x: (s.position?.x || 0) + shiftX },
      }));
    }

    return [...base, ...extra];
  });
};

export type CreateSchemaShowcasePagesConfig = {
  definitions: Array<{ type: string; [key: string]: unknown }>;
  scope: string;
  ownerRecipientId?: string;
  fileId?: string;
  fileTemplateId?: string;
  startingPageNumber?: number;
  auditOffset?: number;
  /** Grid positions per page. Defaults to SHOWCASE_GRID_POSITIONS. */
  positions?: ReadonlyArray<{ x: number; y: number }>;
  /** Per-type schema overrides (host-supplied example content). */
  overridesByType?: Record<string, any>;
  /** Plugin registry passed to createSchemaByType. */
  plugins?: Record<string, any>;
  /** Audit metadata factory. Defaults to schemaFactory's createAuditMetadata. */
  createAuditMetadata?: typeof defaultCreateAuditMetadata;
};

/**
 * Generates showcase pages: chunks `definitions` into pages by grid size and
 * builds one schema per definition. Host injects example content via
 * `overridesByType` and timing via `createAuditMetadata` so no lab text leaks
 * into the core builder.
 */
export const createSchemaShowcasePages = ({
  definitions,
  scope,
  ownerRecipientId,
  fileId = `${sanitizeIdentifier(scope)}-showcase`,
  fileTemplateId = fileId,
  startingPageNumber = 1,
  auditOffset = 0,
  positions = SHOWCASE_GRID_POSITIONS,
  overridesByType = {},
  plugins,
  createAuditMetadata = defaultCreateAuditMetadata,
}: CreateSchemaShowcasePagesConfig): any[][] =>
  chunkItems(definitions, positions.length).map((pageDefinitions, pageIndex) =>
    pageDefinitions.map((definition, itemIndex) => {
      const slug = sanitizeIdentifier(definition.type);
      const baseOverrides = overridesByType[definition.type] || {};

      return createSchemaByType(
        definition.type,
        {
          ...baseOverrides,
          position: cloneDeep(positions[itemIndex]),
          name: `${sanitizeIdentifier(scope)}_${slug}`,
          schemaUid: `${sanitizeIdentifier(scope)}-${slug}`,
          fileId,
          fileTemplateId,
          pageNumber: startingPageNumber + pageIndex,
          ownerMode: 'single',
          ownerRecipientId,
          ...createAuditMetadata(
            ownerRecipientId as string,
            ownerRecipientId as string,
            auditOffset + pageIndex * 10000 + itemIndex * 1000,
          ),
        },
        { plugins },
      );
    }),
  );

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
type SchemaShowcaseRecord = Record<string, unknown> & {
  position?: { x?: unknown; y?: unknown };
  width?: unknown;
  height?: unknown;
  size?: { width?: unknown; height?: unknown };
};

type SchemaShowcaseOverrides = Record<string, unknown> & {
  width?: unknown;
  height?: unknown;
  size?: { width?: unknown; height?: unknown };
};

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

const readDimension = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const findFreePosition = (
  occupiedRects: Rect[],
  occupiedKeys: Set<string>,
  basePosition: { x: number; y: number },
  width: number,
  height: number,
): { x: number; y: number } => {
  const safeWidth = Math.max(0, Number(width) || 0);
  const safeHeight = Math.max(0, Number(height) || 0);
  const stepY = Math.max(16, Math.round(safeHeight * 0.35) || 16);
  const maxAttempts = 48;
  let nextY = Number(basePosition?.y) || 0;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = {
      x: Number(basePosition?.x) || 0,
      y: nextY,
      width: safeWidth,
      height: safeHeight,
    };
    const candidateKey = `${candidate.x},${candidate.y}`;
    if (!occupiedKeys.has(candidateKey) && !occupiedRects.some((rect) => rectsIntersect(rect, candidate))) {
      return { x: candidate.x, y: candidate.y };
    }
    nextY += stepY;
  }

  return {
    x: Number(basePosition?.x) || 0,
    y: nextY,
  };
};

/**
 * Merges two page arrays. When an extra page's schema bounding-box collides
 * with a base schema, the whole extra page is shifted right by `shiftX`.
 */
export const mergeSchemaPages = (
  basePages: SchemaShowcaseRecord[][] = [],
  extraPages: SchemaShowcaseRecord[][] = [],
  pageCount = 1,
  shiftX = 120,
): SchemaShowcaseRecord[][] => {
  const safePageCount = Math.max(1, Number(pageCount) || 1);
  return Array.from({ length: safePageCount }, (_, pageIndex) => {
    const base = cloneDeep(basePages[pageIndex] || []);
    let extra = cloneDeep(extraPages[pageIndex] || []);

    const occupiedRects = base.map((s) => ({
      x: readDimension(s?.position?.x),
      y: readDimension(s?.position?.y),
      width: readDimension(s?.width),
      height: readDimension(s?.height),
    }));

    const collides = extra.some((s) => {
      const r = {
        x: readDimension(s?.position?.x),
        y: readDimension(s?.position?.y),
        width: readDimension(s?.width),
        height: readDimension(s?.height),
      };
      return occupiedRects.some((br: Rect) => rectsIntersect(r, br));
    });

    if (collides) {
      extra = extra.map((s) => ({
        ...s,
        position: { ...(s.position || {}), x: readDimension(s.position?.x) + shiftX },
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
  overridesByType?: Record<string, SchemaShowcaseOverrides>;
  /** Plugin registry passed to createSchemaByType. */
  plugins?: Record<string, unknown>;
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
}: CreateSchemaShowcasePagesConfig): SchemaShowcaseRecord[][] =>
  chunkItems(definitions, positions.length).map((pageDefinitions, pageIndex) => {
    const occupiedRects: Rect[] = [];
    const occupiedKeys = new Set<string>();

    return pageDefinitions.map((definition, itemIndex) => {
      const slug = sanitizeIdentifier(definition.type);
      const baseOverrides = overridesByType[definition.type] || {};
      const basePosition = cloneDeep(positions[itemIndex]);
      const candidatePosition = findFreePosition(
        occupiedRects,
        occupiedKeys,
        basePosition,
        readDimension(baseOverrides.width ?? baseOverrides.size?.width),
        readDimension(baseOverrides.height ?? baseOverrides.size?.height),
      );
      const createdSchema = createSchemaByType(
        definition.type,
        {
          ...baseOverrides,
          position: candidatePosition,
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
      const createdSchemaRecord = createdSchema as SchemaShowcaseRecord & {
        position?: { x?: unknown; y?: unknown };
        width?: unknown;
        height?: unknown;
      };

      occupiedRects.push({
        x: readDimension(createdSchemaRecord.position?.x),
        y: readDimension(createdSchemaRecord.position?.y),
        width: readDimension(createdSchemaRecord.width),
        height: readDimension(createdSchemaRecord.height),
      });
      occupiedKeys.add(`${readDimension(createdSchemaRecord.position?.x)},${readDimension(createdSchemaRecord.position?.y)}`);

      return createdSchema;
    });
  });

import { clampPointToPageBounds, type PointLike } from './pointerGeometry.js';

export type SmartPlacementInput = {
  candidate: PointLike;
  pageSize: { width: number; height: number };
  schemaSize: { width: number; height: number };
  existingSchemas?: Array<{
    position?: { x?: number; y?: number };
    width?: number;
    height?: number;
  }>;
  stepMm?: number;
  maxAttempts?: number;
};

const overlaps = (
  leftA: number,
  topA: number,
  rightA: number,
  bottomA: number,
  leftB: number,
  topB: number,
  rightB: number,
  bottomB: number,
) =>
  leftA < rightB &&
  rightA > leftB &&
  topA < bottomB &&
  bottomA > topB;

const schemaBox = (
  schema: {
    position?: { x?: number; y?: number };
    width?: number;
    height?: number;
  },
) => {
  const x = Number(schema.position?.x || 0);
  const y = Number(schema.position?.y || 0);
  const width = Math.max(0, Number(schema.width || 0));
  const height = Math.max(0, Number(schema.height || 0));
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
  };
};

const hasOverlap = (
  candidate: { x: number; y: number },
  size: { width: number; height: number },
  existingSchemas: SmartPlacementInput['existingSchemas'] = [],
) => {
  const left = candidate.x;
  const top = candidate.y;
  const right = left + size.width;
  const bottom = top + size.height;

  return existingSchemas.some((schema) => {
    if (!schema) return false;
    const box = schemaBox(schema);
    return overlaps(left, top, right, bottom, box.left, box.top, box.right, box.bottom);
  });
};

export const resolveSmartDropPosition = ({
  candidate,
  pageSize,
  schemaSize,
  existingSchemas = [],
  stepMm = 6,
  maxAttempts = 12,
}: SmartPlacementInput) => {
  let next = clampPointToPageBounds(candidate, pageSize, schemaSize);

  if (!hasOverlap(next, schemaSize, existingSchemas)) {
    return next;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const delta = stepMm * attempt;
    const shifted = clampPointToPageBounds(
      {
        x: candidate.x + delta,
        y: candidate.y + delta,
      },
      pageSize,
      schemaSize,
    );
    if (!hasOverlap(shifted, schemaSize, existingSchemas)) {
      return shifted;
    }

    const shiftedDown = clampPointToPageBounds(
      {
        x: candidate.x,
        y: candidate.y + delta,
      },
      pageSize,
      schemaSize,
    );
    if (!hasOverlap(shiftedDown, schemaSize, existingSchemas)) {
      return shiftedDown;
    }

    const shiftedRight = clampPointToPageBounds(
      {
        x: candidate.x + delta,
        y: candidate.y,
      },
      pageSize,
      schemaSize,
    );
    if (!hasOverlap(shiftedRight, schemaSize, existingSchemas)) {
      return shiftedRight;
    }
  }

  return {
    x: Math.max(0, Math.round((pageSize.width - schemaSize.width) / 2)),
    y: Math.max(0, Math.round((pageSize.height - schemaSize.height) / 2)),
  };
};

/**
 * smartPlacement — resolución de posiciones de drop sin superposición.
 *
 * Busca una posición válida para insertar schemas dentro de la página evitando
 * colisiones con campos existentes. Trabaja en unidades del template/PDF.
 */

import { clampPointToPageBounds, type PointLike } from './pointerGeometry.js';

/**
 * Entrada para resolver una posición de inserción inteligente.
 */
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

/**
 * Normaliza el paso de búsqueda en milímetros.
 */
const clampStep = (value: number) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 6;
  return Math.max(1, Math.round(numeric));
};

/**
 * Determina si dos rectángulos se superponen.
 */
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

/**
 * Convierte un schema existente en caja rectangular comparable.
 */
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

/**
 * Indica si un candidato colisiona con algún schema existente.
 */
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

/**
 * Busca una posición libre recorriendo la página en grilla.
 */
const findGridPosition = ({
  pageSize,
  schemaSize,
  existingSchemas,
  step,
}: {
  pageSize: { width: number; height: number };
  schemaSize: { width: number; height: number };
  existingSchemas: SmartPlacementInput['existingSchemas'];
  step: number;
}) => {
  const maxX = Math.max(0, pageSize.width - schemaSize.width);
  const maxY = Math.max(0, pageSize.height - schemaSize.height);

  for (let y = 0; y <= maxY; y += step) {
    for (let x = 0; x <= maxX; x += step) {
      const candidate = { x, y };
      if (!hasOverlap(candidate, schemaSize, existingSchemas)) {
        return candidate;
      }
    }
  }

  // Last edge probes to avoid missing the far border because of step rounding.
  const edgeCandidates = [
    { x: maxX, y: 0 },
    { x: 0, y: maxY },
    { x: maxX, y: maxY },
  ];
  for (const candidate of edgeCandidates) {
    if (!hasOverlap(candidate, schemaSize, existingSchemas)) {
      return candidate;
    }
  }

  return null;
};

/**
 * Resuelve una posición de drop dentro de página evitando superposición.
 *
 * Estrategia:
 * 1. prueba candidato clamped;
 * 2. desplaza diagonal/abajo/derecha por intentos;
 * 3. recorre grilla;
 * 4. cae al centro si no hay espacio libre.
 */
export const resolveSmartDropPosition = ({
  ...input
}: SmartPlacementInput) =>
  resolveDropPosition(input, ({ pageSize, schemaSize }) => ({
    x: Math.max(0, Math.round((pageSize.width - schemaSize.width) / 2)),
    y: Math.max(0, Math.round((pageSize.height - schemaSize.height) / 2)),
  }));

type PlacementFallback = (input: Pick<SmartPlacementInput, 'pageSize' | 'schemaSize'>) => PointLike | null;

/**
 * Ejecuta el recorrido canónico de posiciones; el caller decide únicamente
 * qué contrato aplicar cuando la página no contiene ningún hueco libre.
 */
const resolveDropPosition = ({
  candidate,
  pageSize,
  schemaSize,
  existingSchemas = [],
  stepMm = 6,
  maxAttempts = 12,
}: SmartPlacementInput, fallbackStrategy: PlacementFallback) => {
  const step = clampStep(stepMm);
  const clampedCandidate = clampPointToPageBounds(candidate, pageSize, schemaSize);

  if (!hasOverlap(clampedCandidate, schemaSize, existingSchemas)) {
    return clampedCandidate;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const delta = step * attempt;
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

  const fallback = findGridPosition({
    pageSize,
    schemaSize,
    existingSchemas,
    step,
  });

  if (fallback) return fallback;

  return fallbackStrategy({ pageSize, schemaSize });
};

export const resolveNonOverlappingDropPosition = ({
  ...input
}: SmartPlacementInput) => resolveDropPosition(input, () => null);

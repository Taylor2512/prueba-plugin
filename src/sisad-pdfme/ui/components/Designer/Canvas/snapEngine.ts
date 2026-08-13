/**
 * snapEngine — geometría de las guías de alineación del Designer.
 *
 * Vive separado de `SnapLines.tsx` porque no es un componente: tenerlos en el
 * mismo módulo rompía el Fast Refresh del overlay
 * (`react-refresh/only-export-components`). Todas las posiciones están en
 * milímetros.
 */

/**
 * Línea guía calculada en milímetros.
 */
export interface SnapLine {
  type: 'horizontal' | 'vertical';
  /** Position in mm */
  pos: number;
  /** Display label (e.g. distance in mm) */
  label?: string;
}

/**
 * Resultado completo de snapping: líneas visuales y coordenada ajustada.
 */
export interface SnapComputation {
  lines: SnapLine[];
  snapped: {
    x: number;
    y: number;
  };
}

/**
 * Mejor coincidencia de snap para un eje.
 */
type SnapMatch = {
  delta: number;
  guide: number;
  snappedOrigin: number;
};


const roundMm = (value: number) => Math.round(value * 1000) / 1000;

/**
 * Busca el candidato de snap más cercano para un eje.
 */
const findBestSnap = ({
  candidates,
  edgeStart,
  edgeCenter,
  edgeEnd,
  startToOrigin,
  centerToOrigin,
  endToOrigin,
  threshold,
}: {
  candidates: number[];
  edgeStart: number;
  edgeCenter: number;
  edgeEnd: number;
  startToOrigin: (candidate: number) => number;
  centerToOrigin: (candidate: number) => number;
  endToOrigin: (candidate: number) => number;
  threshold: number;
}): SnapMatch | null => {
  let best: SnapMatch | null = null;

  for (const candidate of candidates) {
    const checks = [
      { delta: candidate - edgeStart, snappedOrigin: startToOrigin(candidate) },
      { delta: candidate - edgeCenter, snappedOrigin: centerToOrigin(candidate) },
      { delta: candidate - edgeEnd, snappedOrigin: endToOrigin(candidate) },
    ];

    for (const check of checks) {
      const absDelta = Math.abs(check.delta);
      if (absDelta > threshold) continue;
      if (!best || absDelta < Math.abs(best.delta)) {
        best = { delta: check.delta, guide: roundMm(candidate), snappedOrigin: roundMm(check.snappedOrigin) };
      }
    }
  }

  return best;
};

/**
 * Calcula snapping en X/Y contra página y elementos vecinos.
 */
export function computeSnapResult(
  dragged: { x: number; y: number; width: number; height: number },
  page: { width: number; height: number },
  others: Array<{ x: number; y: number; width: number; height: number }>,
  threshold = 2,
): SnapComputation {
  const lines: SnapLine[] = [];
  const { x, y, width, height } = dragged;

  const dragRight = x + width;
  const dragBottom = y + height;
  const dragCX = x + width / 2;
  const dragCY = y + height / 2;

  const pageCX = page.width / 2;
  const pageCY = page.height / 2;

  const addH = (pos: number, label?: string) => {
    const normalizedPos = roundMm(pos);
    if (!lines.find((l) => l.type === 'horizontal' && l.pos === normalizedPos)) {
      lines.push({ type: 'horizontal', pos: normalizedPos, label });
    }
  };
  const addV = (pos: number, label?: string) => {
    const normalizedPos = roundMm(pos);
    if (!lines.find((l) => l.type === 'vertical' && l.pos === normalizedPos)) {
      lines.push({ type: 'vertical', pos: normalizedPos, label });
    }
  };

  const xCandidates: number[] = [0, page.width, pageCX];
  const yCandidates: number[] = [0, page.height, pageCY];

  // Alignment with other elements
  for (const other of others) {
    const oRight = other.x + other.width;
    const oBottom = other.y + other.height;
    const oCX = other.x + other.width / 2;
    const oCY = other.y + other.height / 2;

    xCandidates.push(other.x, oRight, oCX);
    yCandidates.push(other.y, oBottom, oCY);
  }

  const snapX: SnapMatch | null = findBestSnap({
    candidates: xCandidates,
    edgeStart: x,
    edgeCenter: dragCX,
    edgeEnd: dragRight,
    startToOrigin: (candidate) => candidate,
    centerToOrigin: (candidate) => candidate - width / 2,
    endToOrigin: (candidate) => candidate - width,
    threshold,
  });

  const snapY: SnapMatch | null = findBestSnap({
    candidates: yCandidates,
    edgeStart: y,
    edgeCenter: dragCY,
    edgeEnd: dragBottom,
    startToOrigin: (candidate) => candidate,
    centerToOrigin: (candidate) => candidate - height / 2,
    endToOrigin: (candidate) => candidate - height,
    threshold,
  });

  if (snapX) {
    addV(snapX.guide, Math.abs(snapX.guide - pageCX) < 0.001 ? 'center' : undefined);
  }
  if (snapY) {
    addH(snapY.guide, Math.abs(snapY.guide - pageCY) < 0.001 ? 'center' : undefined);
  }

  return {
    lines,
    snapped: {
      x: snapX ? roundMm(snapX.snappedOrigin) : roundMm(x),
      y: snapY ? roundMm(snapY.snappedOrigin) : roundMm(y),
    },
  };
}

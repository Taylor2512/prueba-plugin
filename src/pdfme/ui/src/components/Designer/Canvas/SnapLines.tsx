import { DESIGNER_CLASSNAME } from "../../../constants.js";
/**
 * SnapLines – Wix-style alignment guide overlay shown during element drag/resize.
 *
 * Renders thin coloured lines across the canvas whenever a dragged element
 * is aligned (within threshold) with the page centre, page edges, or another
 * element's edge/centre.  Distance badges appear between the dragged element
 * and the nearest neighbour, matching the Wix Editor experience.
 */
import React from 'react';
import { ZOOM } from '@pdfme/common';

export interface SnapLine {
  type: 'horizontal' | 'vertical';
  /** Position in mm */
  pos: number;
  /** Display label (e.g. distance in mm) */
  label?: string;
}

export interface SnapComputation {
  lines: SnapLine[];
  snapped: {
    x: number;
    y: number;
  };
}

type SnapMatch = {
  delta: number;
  guide: number;
  snappedOrigin: number;
};

interface Props {
  lines: SnapLine[];
  /** Canvas scroll offsets (px) so lines stay aligned with the paper */
  scrollLeft?: number;
  scrollTop?: number;
  className?: string;
  style?: React.CSSProperties;
  useDefaultStyles?: boolean;
  palette?: {
    lineColor?: string;
    centerColor?: string;
  };
}

const LINE_COLOR = '#1890ff';
const CENTER_COLOR = '#ff4d4f';

const cn = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(' ');

const SnapLines = ({
  lines,
  scrollLeft = 0,
  scrollTop = 0,
  className,
  style,
  useDefaultStyles = true,
  palette,
}: Props) => {
  const isCenter = (line: SnapLine) => line.label === 'center';
  const lineColor = palette?.lineColor || LINE_COLOR;
  const centerColor = palette?.centerColor || CENTER_COLOR;
  const hasCustomClass = typeof className === 'string' && className.trim().length > 0;
  const rootClassName = cn(
    `${DESIGNER_CLASSNAME}snap-lines`,
    hasCustomClass && `${DESIGNER_CLASSNAME}custom-${className?.trim()}`,
  );

  return (
    <div className={rootClassName} style={useDefaultStyles ? undefined : style}>
      {lines.map((line, i) => {
        const color = isCenter(line) ? centerColor : lineColor;
        const posPx = line.pos * ZOOM;

        if (line.type === 'horizontal') {
          return (
            <React.Fragment key={i}>
              <div
                className={cn(
                  `${DESIGNER_CLASSNAME}snap-line`,
                  `${DESIGNER_CLASSNAME}snap-line-horizontal`,
                  `${DESIGNER_CLASSNAME}div-auto`,
                )}
                data-is-center={isCenter(line) ? 'true' : 'false'}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${posPx - scrollTop}px`,
                  height: 0,
                  borderTop: `1px solid ${color}`,
                  pointerEvents: 'none',
                  zIndex: 7,
                  ...(useDefaultStyles ? {} : style || {}),
                }}
              />
              {line.label && line.label !== 'center' && (
                <span
                  className={cn(
                    `${DESIGNER_CLASSNAME}snap-label`,
                    `${DESIGNER_CLASSNAME}snap-label-horizontal`,
                    `${DESIGNER_CLASSNAME}span-auto`,
                  )}
                  style={{
                    position: 'absolute',
                    top: `${posPx - scrollTop - 14}px`,
                    left: 8,
                    fontSize: 10,
                    lineHeight: 1,
                    padding: '2px 5px',
                    borderRadius: 8,
                    color,
                    background: 'rgba(255,255,255,0.9)',
                    border: `1px solid ${color}`,
                    pointerEvents: 'none',
                    zIndex: 8,
                  }}
                >
                  {line.label}
                </span>
              )}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={i}>
            <div
              className={cn(
                `${DESIGNER_CLASSNAME}snap-line`,
                `${DESIGNER_CLASSNAME}snap-line-vertical`,
                `${DESIGNER_CLASSNAME}div-auto`,
              )}
              data-is-center={isCenter(line) ? 'true' : 'false'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${posPx - scrollLeft}px`,
                width: 0,
                borderLeft: `1px solid ${color}`,
                pointerEvents: 'none',
                zIndex: 7,
                ...(useDefaultStyles ? {} : style || {}),
              }}
            />
            {line.label && line.label !== 'center' && (
              <span
                className={cn(
                  `${DESIGNER_CLASSNAME}snap-label`,
                  `${DESIGNER_CLASSNAME}snap-label-vertical`,
                  `${DESIGNER_CLASSNAME}span-auto`,
                )}
                style={{
                  position: 'absolute',
                  top: 8,
                  left: `${posPx - scrollLeft + 5}px`,
                  fontSize: 10,
                  lineHeight: 1,
                  padding: '2px 5px',
                  borderRadius: 8,
                  color,
                  background: 'rgba(255,255,255,0.9)',
                  border: `1px solid ${color}`,
                  pointerEvents: 'none',
                  zIndex: 8,
                }}
              >
                {line.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SnapLines;

/**
 * Compute snap lines for an element being dragged.
 *
 * @param dragged  Current position/size of the dragged element (mm)
 * @param page     Page dimensions (mm)
 * @param others   Other elements on the page (mm)
 * @param threshold Snap threshold in mm (default 2)
 */
export function computeSnapLines(
  dragged: { x: number; y: number; width: number; height: number },
  page: { width: number; height: number },
  others: Array<{ x: number; y: number; width: number; height: number }>,
  threshold = 2,
): SnapLine[] {
  return computeSnapResult(dragged, page, others, threshold).lines;
}

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
        best = { delta: check.delta, guide: candidate, snappedOrigin: check.snappedOrigin };
      }
    }
  }

  return best;
};

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
    if (!lines.find((l) => l.type === 'horizontal' && l.pos === pos)) {
      lines.push({ type: 'horizontal', pos, label });
    }
  };
  const addV = (pos: number, label?: string) => {
    if (!lines.find((l) => l.type === 'vertical' && l.pos === pos)) {
      lines.push({ type: 'vertical', pos, label });
    }
  };

  const xCandidates: number[] = [0, page.width, pageCX];
  const yCandidates: number[] = [0, page.height, pageCY];

  // Page centre alignment
  if (Math.abs(dragCX - pageCX) < threshold) addV(pageCX, 'center');
  if (Math.abs(dragCY - pageCY) < threshold) addH(pageCY, 'center');

  // Page edges
  if (Math.abs(x) < threshold) addV(0);
  if (Math.abs(dragRight - page.width) < threshold) addV(page.width);
  if (Math.abs(y) < threshold) addH(0);
  if (Math.abs(dragBottom - page.height) < threshold) addH(page.height);

  // Alignment with other elements
  for (const other of others) {
    const oRight = other.x + other.width;
    const oBottom = other.y + other.height;
    const oCX = other.x + other.width / 2;
    const oCY = other.y + other.height / 2;

    xCandidates.push(other.x, oRight, oCX);
    yCandidates.push(other.y, oBottom, oCY);

    // Vertical guides
    if (Math.abs(x - other.x) < threshold) addV(other.x);
    if (Math.abs(x - oRight) < threshold) addV(oRight);
    if (Math.abs(dragRight - other.x) < threshold) addV(other.x);
    if (Math.abs(dragRight - oRight) < threshold) addV(oRight);
    if (Math.abs(dragCX - oCX) < threshold) addV(oCX);

    // Horizontal guides
    if (Math.abs(y - other.y) < threshold) addH(other.y);
    if (Math.abs(y - oBottom) < threshold) addH(oBottom);
    if (Math.abs(dragBottom - other.y) < threshold) addH(other.y);
    if (Math.abs(dragBottom - oBottom) < threshold) addH(oBottom);
    if (Math.abs(dragCY - oCY) < threshold) addH(oCY);

    // Distance label between dragged right edge and other left edge
    if (Math.abs(other.x - dragRight) < threshold * 3 && other.x > dragRight) {
      const dist = Math.round((other.x - dragRight) * 10) / 10;
      addV(dragRight + (other.x - dragRight) / 2, `${dist}mm`);
    }
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
      x: snapX ? snapX.snappedOrigin : x,
      y: snapY ? snapY.snappedOrigin : y,
    },
  };
}

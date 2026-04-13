import { useMemo } from 'react';
import { resolveCenteredFloatingSurfacePosition } from './floatingSurfaceGeometry.js';

type Bounds = { top: number; left: number; right: number; bottom: number };
type PageSize = { width: number; height: number };

const parsePx = (value: string | undefined) => {
  if (!value) return 0;
  return Number(value.replace('px', '')) || 0;
};

const TOOLBAR_WIDTH = 212;
const TOOLBAR_HEIGHT = 34;

export const useFloatingToolbarPosition = (activeElements: HTMLElement[], pageSize: PageSize) =>
  useMemo(() => {
    if (!activeElements.length) return null;

    const bounds = activeElements.reduce<Bounds>((acc, element) => {
      const { style } = element;
      const top = parsePx(style.top);
      const left = parsePx(style.left);
      const width = parsePx(style.width);
      const height = parsePx(style.height);
      acc.top = Math.min(acc.top, top);
      acc.left = Math.min(acc.left, left);
      acc.right = Math.max(acc.right, left + width);
      acc.bottom = Math.max(acc.bottom, top + height);
      return acc;
    }, { top: Number.POSITIVE_INFINITY, left: Number.POSITIVE_INFINITY, right: 0, bottom: 0 });

    if (!Number.isFinite(bounds.top) || !Number.isFinite(bounds.left)) {
      return null;
    }

    const width = bounds.right - bounds.left;
    const height = bounds.bottom - bounds.top;
    const safePageWidth = Number.isFinite(pageSize.width) ? Math.max(0, pageSize.width) : 0;
    const safePageHeight = Number.isFinite(pageSize.height) ? Math.max(0, pageSize.height) : 0;

    const { top, left } = resolveCenteredFloatingSurfacePosition(
      bounds,
      { width: TOOLBAR_WIDTH, height: TOOLBAR_HEIGHT },
      { width: safePageWidth, height: safePageHeight },
    );

    return {
      top,
      left,
      width,
      height,
    };
  }, [activeElements, pageSize.height, pageSize.width]);

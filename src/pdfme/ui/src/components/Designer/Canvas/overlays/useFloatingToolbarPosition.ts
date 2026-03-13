import { useMemo } from 'react';

type Bounds = { top: number; left: number; right: number; bottom: number };

const parsePx = (value: string | undefined) => {
  if (!value) return 0;
  return Number(value.replace('px', '')) || 0;
};

export const useFloatingToolbarPosition = (activeElements: HTMLElement[]) =>
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

    return {
      top: Math.max(0, bounds.top - 38),
      left: bounds.right + 6,
      width,
      height,
    };
  }, [activeElements]);

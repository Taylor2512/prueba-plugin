import { RefObject, useEffect, useMemo, useState } from 'react';

export type DensityMode = 'full' | 'comfortable' | 'compact' | 'mini';

type ResponsiveDensityBreakpoints = {
  comfortable?: number;
  compact?: number;
  mini?: number;
};

type UseResponsiveDensityOptions = ResponsiveDensityBreakpoints & {
  initialWidth?: number;
};

const DEFAULT_BREAKPOINTS: Required<ResponsiveDensityBreakpoints> = {
  comfortable: 440,
  compact: 320,
  mini: 236,
};

const resolveDensityMode = (
  width: number,
  breakpoints: Required<ResponsiveDensityBreakpoints>,
): DensityMode => {
  if (width <= breakpoints.mini) return 'mini';
  if (width <= breakpoints.compact) return 'compact';
  if (width <= breakpoints.comfortable) return 'comfortable';
  return 'full';
};

export const useResponsiveDensity = <T extends HTMLElement>(
  ref: RefObject<T>,
  options?: UseResponsiveDensityOptions,
) => {
  const breakpoints = useMemo(
    () => ({
      comfortable: options?.comfortable ?? DEFAULT_BREAKPOINTS.comfortable,
      compact: options?.compact ?? DEFAULT_BREAKPOINTS.compact,
      mini: options?.mini ?? DEFAULT_BREAKPOINTS.mini,
    }),
    [options?.comfortable, options?.compact, options?.mini],
  );
  const [width, setWidth] = useState(options?.initialWidth ?? 0);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const updateWidth = () => {
      setWidth(Math.max(0, Math.round(target.getBoundingClientRect().width)));
    };

    updateWidth();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const nextWidth =
        entry.borderBoxSize && entry.borderBoxSize.length > 0
          ? Math.round(entry.borderBoxSize[0].inlineSize)
          : Math.round(entry.contentRect.width);
      setWidth(Math.max(0, nextWidth));
    });

    observer.observe(target);
    return () => observer.disconnect();
  }, [ref]);

  const mode = useMemo(() => resolveDensityMode(width, breakpoints), [breakpoints, width]);

  return {
    width,
    mode,
  } as const;
};

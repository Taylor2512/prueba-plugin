/**
 * SchemaDropCommitFlash — micro feedback al confirmar un drop.
 *
 * Muestra un destello visual en la coordenada donde se creó el schema, usando
 * la posición del paper y la conversión mm→px. No altera el modelo de datos.
 */

import React, { useEffect, useRef, useState } from 'react';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

/**
 * Props del destello visual de confirmación de drop.
 */
export type SchemaDropCommitFlashProps = {
  paperRect: { left: number; top: number } | null;
  xMm: number;
  yMm: number;
  zoom: number;
  ownerColor?: string;
  icon?: React.ReactNode;
};

/**
 * Factor de conversión de milímetros PDF a píxeles CSS.
 */
const MM_TO_PX = 3.7795275591;

/**
 * Renderiza una animación breve en el punto donde se confirmó el drop.
 */
const SchemaDropCommitFlashSession = ({
  paperRect,
  xMm,
  yMm,
  zoom,
  ownerColor,
  icon,
}: Omit<SchemaDropCommitFlashProps, 'paperRect'> & { paperRect: { left: number; top: number } }) => {
  const [entering, setEntering] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timersRef = useRef<{
    enterFrame: number | null;
    exitTimer: number | null;
  }>({
    enterFrame: null,
    exitTimer: null,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePrefersReducedMotion = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePrefersReducedMotion();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePrefersReducedMotion);
      return () => mediaQuery.removeEventListener('change', updatePrefersReducedMotion);
    }

    mediaQuery.addListener(updatePrefersReducedMotion);
    return () => mediaQuery.removeListener(updatePrefersReducedMotion);
  }, []);

  useEffect(() => {
    const clearScheduledAnimation = () => {
      const { enterFrame, exitTimer } = timersRef.current;
      if (enterFrame !== null) cancelAnimationFrame(enterFrame);
      if (exitTimer !== null) window.clearTimeout(exitTimer);
      timersRef.current = { enterFrame: null, exitTimer: null };
    };

    const scheduleExit = () => {
      timersRef.current.exitTimer = window.setTimeout(() => setExiting(true), 110);
    };

    if (!prefersReducedMotion) {
      const scheduledEnterFrame = window.requestAnimationFrame(() => setEntering(true));
      timersRef.current.enterFrame = scheduledEnterFrame;
    }

    scheduleExit();
    return clearScheduledAnimation;
  }, [paperRect, prefersReducedMotion]);

  const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  const left = paperRect.left + xMm * MM_TO_PX * scale;
  const top = paperRect.top + yMm * MM_TO_PX * scale;
  const transitionClassName = prefersReducedMotion
    ? 'transition-none'
    : 'transition-[opacity,transform] duration-75 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const stateClassName = prefersReducedMotion
    ? exiting
      ? 'opacity-0 scale-100'
      : 'opacity-100 scale-100'
    : exiting
      ? 'opacity-0 scale-[0.96]'
      : entering
        ? 'opacity-100 scale-[1.08]'
        : 'opacity-0 scale-[0.62]';

  return (
    <div
      className={mergeClassNames(
        'sisad-pdfme-schema-drop-commit-flash fixed z-[10000] pointer-events-none -translate-x-1/2 -translate-y-1/2',
        transitionClassName,
        stateClassName,
      )}
      style={
        {
          left: `${left}px`,
          top: `${top}px`,
          '--schema-owner-color': ownerColor || '#2563eb',
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="sisad-pdfme-schema-drop-commit-flash-orb grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white/95 shadow-md backdrop-blur-md">
        {icon ? <span className="sisad-pdfme-schema-drop-commit-flash-icon inline-flex items-center justify-center">{icon}</span> : null}
      </div>
    </div>
  );
};

const SchemaDropCommitFlash = (props: SchemaDropCommitFlashProps) => {
  if (!props.paperRect) return null;

  const { paperRect } = props;
  const animationKey = [paperRect.left, paperRect.top, props.xMm, props.yMm, props.zoom].join(':');
  return <SchemaDropCommitFlashSession key={animationKey} {...props} paperRect={paperRect} />;
};

export default SchemaDropCommitFlash;

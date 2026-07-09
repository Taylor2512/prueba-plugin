import React from 'react';
import type { SnapLine } from '../SnapLines.js';
import { mergeClassNames } from '../../shared/className.js';

type SnapFeedbackOverlayProps = {
  bounds: { top: number; left: number } | null;
  snapLines: SnapLine[];
};

const SnapFeedbackOverlay = ({ bounds, snapLines }: SnapFeedbackOverlayProps) => {
  if (!bounds || !snapLines.length) return null;
  const labels = snapLines
    .map((line) => line.label)
    .filter((label): label is string => Boolean(label));
  if (!labels.length) return null;

  const primaryLabel = labels.includes('center')
    ? 'Alineado al centro'
    : labels.find((label) => label !== 'center') || labels[0];
  const secondaryLabels = labels
    .filter((label) => label !== 'center' && label !== primaryLabel)
    .slice(0, 2);

  return (
    <div
      className={mergeClassNames(
        'sisad-pdfme-ui-snap-feedback fixed inline-flex -translate-y-full items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/95 px-2.5 py-1 text-[10.5px] font-medium text-slate-700 shadow-lg backdrop-blur-md pointer-events-none',
      )}
      style={{
        top: `${bounds.top - 52}px`,
        left: `${bounds.left}px`,
        zIndex: 'calc(var(--z-overlay) + 3)',
      }}
    >
      <span className="sisad-pdfme-ui-snap-feedback-primary font-semibold text-slate-900">{primaryLabel}</span>
      {secondaryLabels.length > 0 ? (
        <span className="sisad-pdfme-ui-snap-feedback-secondary text-slate-500">{secondaryLabels.join(' · ')}</span>
      ) : null}
    </div>
  );
};

export default SnapFeedbackOverlay;

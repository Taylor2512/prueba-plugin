import React from 'react';
import type { SnapLine } from '../SnapLines.js';

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
      className="pdfme-ui-snap-feedback"
      style={{
        top: `${bounds.top - 52}px`,
        left: `${bounds.left}px`,
      }}>
      <span className="pdfme-ui-snap-feedback-primary">{primaryLabel}</span>
      {secondaryLabels.length > 0 ? (
        <span className="pdfme-ui-snap-feedback-secondary">{secondaryLabels.join(' · ')}</span>
      ) : null}
    </div>
  );
};

export default SnapFeedbackOverlay;

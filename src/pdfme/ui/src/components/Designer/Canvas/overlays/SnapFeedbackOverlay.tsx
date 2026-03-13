import React from 'react';
import type { SnapLine } from '../SnapLines.js';

type SnapFeedbackOverlayProps = {
  bounds: { top: number; left: number } | null;
  snapLines: SnapLine[];
};

const SnapFeedbackOverlay = ({ bounds, snapLines }: SnapFeedbackOverlayProps) => {
  if (!bounds || !snapLines.length) return null;
  const labelLine = snapLines.find((line) => line.label && line.label !== 'center');
  if (!labelLine) return null;
  return (
    <div
      className="pdfme-ui-snap-feedback"
      style={{
        top: `${bounds.top - 52}px`,
        left: `${bounds.left}px`,
      }}>
      {labelLine.label}
    </div>
  );
};

export default SnapFeedbackOverlay;

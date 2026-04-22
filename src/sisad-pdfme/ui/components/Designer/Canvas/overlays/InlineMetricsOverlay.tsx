import React from 'react';

type InlineMetricsOverlayProps = {
  bounds: { top: number; left: number; width: number; height: number } | null;
};

const InlineMetricsOverlay = ({ bounds }: InlineMetricsOverlayProps) => {
  if (!bounds) return null;
  const width = Math.max(0, Math.round(bounds.width));
  const height = Math.max(0, Math.round(bounds.height));
  return (
    <div
      className="sisad-pdfme-ui-inline-metrics"
      style={{
        top: `${bounds.top - 28}px`,
        left: `${bounds.left}px`,
      }}>
      {`${width}px × ${height}px`}
    </div>
  );
};

export default InlineMetricsOverlay;

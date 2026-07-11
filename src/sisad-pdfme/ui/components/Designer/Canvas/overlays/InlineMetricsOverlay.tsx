/**
 * InlineMetricsOverlay — muestra métricas rápidas de selección.
 *
 * Presenta ancho y alto calculados desde los bounds activos. Es un overlay
 * puramente visual: no participa en selección, drag, resize ni persistencia.
 */

import React from 'react';

/**
 * Props del overlay de métricas inline.
 */
type InlineMetricsOverlayProps = {
  bounds: { top: number; left: number; width: number; height: number } | null;
};

/**
 * Muestra ancho y alto redondeados de la selección activa.
 */
const InlineMetricsOverlay = ({ bounds }: InlineMetricsOverlayProps) => {
  if (!bounds) return null;
  const width = Math.max(0, Math.round(bounds.width));
  const height = Math.max(0, Math.round(bounds.height));
  return (
    <div
      className="sisad-pdfme-ui-inline-metrics absolute rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-sm"
      style={{
        top: `${bounds.top - 28}px`,
        left: `${bounds.left}px`,
      }}>
      {`${width}px × ${height}px`}
    </div>
  );
};

export default InlineMetricsOverlay;

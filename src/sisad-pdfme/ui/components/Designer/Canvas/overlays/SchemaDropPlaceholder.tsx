import React from 'react';

type SchemaDropPlaceholderProps = {
  label: string;
  xMm: number;
  yMm: number;
  widthMm: number;
  heightMm: number;
  zoom: number;
  ownerColor?: string;
  valid: boolean;
  paperRect: { left: number; top: number } | null;
};

const MM_TO_PX = 3.7795275591;

const SchemaDropPlaceholder = ({
  label,
  xMm,
  yMm,
  widthMm,
  heightMm,
  zoom,
  ownerColor,
  valid,
  paperRect,
}: SchemaDropPlaceholderProps) => {
  if (!paperRect) return null;

  const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  const left = paperRect.left + xMm * MM_TO_PX * scale;
  const top = paperRect.top + yMm * MM_TO_PX * scale;
  const width = Math.max(1, widthMm * MM_TO_PX * scale);
  const height = Math.max(1, heightMm * MM_TO_PX * scale);

  return (
    <div
      className="sisad-pdfme-schema-drop-placeholder fixed rounded-xl border border-dashed bg-white/70 shadow-sm"
      data-valid={valid ? 'true' : 'false'}
      style={
        {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          '--schema-owner-color': ownerColor || '#2563eb',
        } as React.CSSProperties
      }
    >
      <div className="sisad-pdfme-schema-drop-placeholder-badge rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700">
        {label}
      </div>
    </div>
  );
};

export default SchemaDropPlaceholder;

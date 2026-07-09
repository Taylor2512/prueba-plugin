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
  const showBadge = width >= 88 && height >= 28;

  return (
    <div
      className="sisad-pdfme-schema-drop-placeholder fixed z-[18] overflow-hidden rounded-[8px] border border-dashed border-slate-200 pointer-events-none"
      style={
        {
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
          '--schema-owner-color': ownerColor || '#2563eb',
          borderColor: valid ? (ownerColor || '#2563eb') : '#ef4444',
          background: valid
            ? `color-mix(in srgb, ${ownerColor || '#2563eb'} 8%, transparent)`
            : 'rgba(239, 68, 68, 0.06)',
          boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.8)',
        } as React.CSSProperties
      }
    >
      {showBadge ? (
        <div className="sisad-pdfme-schema-drop-placeholder-badge absolute left-2 top-2 max-w-[calc(100%-16px)] overflow-hidden whitespace-nowrap rounded-full border border-slate-200 bg-white px-1.5 py-0.5 text-[10.5px] font-medium text-slate-700">
          {label}
        </div>
      ) : null}
    </div>
  );
};

export default SchemaDropPlaceholder;

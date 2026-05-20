import React from 'react';

export type SchemaDropCommitFlashProps = {
  paperRect: { left: number; top: number } | null;
  xMm: number;
  yMm: number;
  zoom: number;
  ownerColor?: string;
  icon?: React.ReactNode;
};

const MM_TO_PX = 3.7795275591;

const SchemaDropCommitFlash = ({
  paperRect,
  xMm,
  yMm,
  zoom,
  ownerColor,
  icon,
}: SchemaDropCommitFlashProps) => {
  if (!paperRect) return null;
  const scale = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  const left = paperRect.left + xMm * MM_TO_PX * scale;
  const top = paperRect.top + yMm * MM_TO_PX * scale;

  return (
    <div
      className="sisad-pdfme-schema-drop-commit-flash"
      style={
        {
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          '--schema-owner-color': ownerColor || '#2563eb',
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="sisad-pdfme-schema-drop-commit-flash-orb">
        {icon ? <span className="sisad-pdfme-schema-drop-commit-flash-icon">{icon}</span> : null}
      </div>
    </div>
  );
};

export default SchemaDropCommitFlash;

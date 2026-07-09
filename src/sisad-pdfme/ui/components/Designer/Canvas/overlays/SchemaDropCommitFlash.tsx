import React from 'react';
import { mergeClassNames } from '../../shared/className.js';

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
      className={mergeClassNames(
        'sisad-pdfme-schema-drop-commit-flash fixed z-[10000] pointer-events-none -translate-x-1/2 -translate-y-1/2 [animation:schema-drop-commit-flash-enter_180ms_cubic-bezier(0.16,1,0.3,1)_both]',
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

export default SchemaDropCommitFlash;

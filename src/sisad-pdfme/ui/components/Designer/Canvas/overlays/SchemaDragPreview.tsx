import React from 'react';

type SchemaDragPreviewProps = {
  schemaType: string;
  icon?: React.ReactNode;
  pointer: { x: number; y: number };
  ownerColor?: string;
  isOverCanvas: boolean;
  isOverPage: boolean;
};

const SchemaDragPreview = ({
  schemaType,
  icon,
  pointer,
  ownerColor,
  isOverCanvas,
  isOverPage,
}: SchemaDragPreviewProps) => {
  return (
    <div
      className="sisad-pdfme-schema-drag-preview fixed left-0 top-0 z-[60] pointer-events-none h-8 w-8 origin-top-left rounded-xl border border-white/70 bg-white/90 shadow-[0_8px_18px_rgba(15,23,42,0.16)] backdrop-blur-md [transition:opacity_120ms_var(--wix-ease-out)] [will-change:transform,opacity] [animation:schema-drag-preview-enter_170ms_cubic-bezier(0.16,1,0.3,1)_both] opacity-90 data-[over-canvas=false]:opacity-60 data-[over-page=true]:opacity-75"
      data-over-canvas={isOverCanvas ? 'true' : 'false'}
      data-over-page={isOverPage ? 'true' : 'false'}
      style={
        {
          '--drag-x': `${pointer.x}px`,
          '--drag-y': `${pointer.y}px`,
          '--schema-owner-color': ownerColor || '#2563eb',
          transform: 'translate3d(calc(var(--drag-x) + 18px), calc(var(--drag-y) - 42px), 0)',
          willChange: 'transform, opacity',
          animation: 'schema-drag-preview-enter 170ms cubic-bezier(0.16, 1, 0.3, 1) both',
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      <div className="sisad-pdfme-schema-drag-preview-orb grid h-full w-full place-items-center rounded-xl bg-white">
        {icon ? (
          <span className="sisad-pdfme-schema-drag-preview-icon inline-flex items-center justify-center text-[color:var(--schema-owner-color,#2563eb)]">
            {icon}
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default SchemaDragPreview;

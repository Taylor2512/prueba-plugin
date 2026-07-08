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
      className="sisad-pdfme-schema-drag-preview pointer-events-none"
      data-over-canvas={isOverCanvas ? 'true' : 'false'}
      data-over-page={isOverPage ? 'true' : 'false'}
      style={
        {
          '--drag-x': `${pointer.x}px`,
          '--drag-y': `${pointer.y}px`,
          '--schema-owner-color': ownerColor || '#2563eb',
        } as React.CSSProperties
      }
      aria-label={`${schemaType} drag preview`}
    >
      <div className="sisad-pdfme-schema-drag-preview-orb flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-lg">
        {icon ? <span className="sisad-pdfme-schema-drag-preview-icon text-slate-700">{icon}</span> : null}
      </div>
    </div>
  );
};

export default SchemaDragPreview;

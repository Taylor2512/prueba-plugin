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
      className="sisad-pdfme-schema-drag-preview"
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
      <div className="sisad-pdfme-schema-drag-preview-orb">
        {icon ? <span className="sisad-pdfme-schema-drag-preview-icon">{icon}</span> : null}
      </div>
    </div>
  );
};

export default SchemaDragPreview;

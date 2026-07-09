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
      className="sisad-pdfme-schema-drag-preview fixed left-0 top-0 z-[9999] pointer-events-none h-11 w-11 origin-top-left rounded-[14px] border border-[color:color-mix(in_srgb,var(--schema-owner-color,#2563eb)_34%,var(--color-primary-25))] bg-[radial-gradient(circle_at_35%_30%,rgba(255,255,255,0.99),rgba(255,255,255,0.92)_74%),color-mix(in_srgb,var(--schema-owner-color,#2563eb)_18%,rgba(255,255,255,0.94))] p-0 shadow-[0_10px_20px_rgba(15,23,42,0.16),0_0_0_1px_rgba(255,255,255,0.45)_inset] backdrop-blur-[10px] saturate-[1.04] [transition:border-color_120ms_var(--wix-ease-out),box-shadow_140ms_var(--wix-ease-out),background_120ms_var(--wix-ease-out),opacity_120ms_var(--wix-ease-out)] [will-change:transform,opacity,box-shadow] [animation:schema-drag-preview-enter_170ms_cubic-bezier(0.16,1,0.3,1)_both] data-[over-canvas=false]:opacity-[0.82] data-[over-page=true]:border-[color:var(--schema-owner-color,#2563eb)] data-[over-page=true]:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--schema-owner-color,#2563eb)_22%,transparent),0_12px_28px_rgba(15,23,42,0.2),0_0_0_1px_rgba(255,255,255,0.5)_inset] data-[over-page=true]:[animation:schema-drag-preview-enter_170ms_cubic-bezier(0.16,1,0.3,1)_both,schema-drag-preview-glow_1.05s_ease-in-out_infinite]"
      data-over-canvas={isOverCanvas ? 'true' : 'false'}
      data-over-page={isOverPage ? 'true' : 'false'}
      style={
        {
          '--drag-x': `${pointer.x}px`,
          '--drag-y': `${pointer.y}px`,
          '--schema-owner-color': ownerColor || '#2563eb',
          transform: 'translate3d(calc(var(--drag-x) + 8px), calc(var(--drag-y) + 8px), 0)',
          willChange: 'transform, opacity, box-shadow',
          animation: 'schema-drag-preview-enter 170ms cubic-bezier(0.16, 1, 0.3, 1) both',
        } as React.CSSProperties
      }
      aria-label={`${schemaType} drag preview`}
    >
      <div className="sisad-pdfme-schema-drag-preview-orb flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/95 shadow-md">
        {icon ? <span className="sisad-pdfme-schema-drag-preview-icon text-slate-700">{icon}</span> : null}
      </div>
    </div>
  );
};

export default SchemaDragPreview;

/**
 * SchemaDragPreview — preview flotante durante drag externo de schemas.
 *
 * Sigue el puntero y comunica visualmente si el usuario está sobre el canvas o
 * sobre una página válida. No participa en hit testing ni persistencia.
 */

import React from 'react';
import { useEffect, useState } from 'react';

/**
 * Props del preview visual de drag externo de schema.
 */
type SchemaDragPreviewProps = {
  schemaType: string;
  icon?: React.ReactNode;
  pointer: { x: number; y: number };
  ownerColor?: string;
  isOverCanvas: boolean;
  isOverPage: boolean;
};

/**
 * Renderiza un preview fijo que sigue el puntero durante drag de un schema.
 */
const SchemaDragPreview = ({
  schemaType,
  icon,
  pointer,
  ownerColor,
  isOverCanvas,
  isOverPage,
}: SchemaDragPreviewProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      // El preview se porta a `document.body`, así que su apilamiento compite
      // con el del host. Un host que monte el diseñador dentro de una capa
      // `fixed` propia (un modal, una vista a pantalla completa) lo dejaría
      // debajo y el arrastre se vería sin previsualización. El token permite
      // elevarlo desde fuera sin que este componente conozca esa capa.
      className={`sisad-pdfme-schema-drag-preview fixed left-0 top-0 z-[var(--sisad-pdfme-drag-overlay-z,60)] pointer-events-none h-8 w-8 origin-top-left rounded-xl border border-white/70 bg-white/90 shadow-[0_8px_18px_rgba(15,23,42,0.16)] backdrop-blur-md transition-[opacity,transform] duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] [will-change:transform,opacity] ${
        mounted ? 'opacity-90 data-[over-canvas=false]:opacity-60 data-[over-page=true]:opacity-75' : 'opacity-0'
      }`}
      data-over-canvas={isOverCanvas ? 'true' : 'false'}
      data-over-page={isOverPage ? 'true' : 'false'}
      style={
        {
          '--drag-x': `${pointer.x}px`,
          '--drag-y': `${pointer.y}px`,
          '--schema-owner-color': ownerColor || '#2563eb',
          transform: `translate3d(calc(var(--drag-x) + 18px), calc(var(--drag-y) - 42px), 0) scale(${mounted ? 1 : 0.82})`,
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

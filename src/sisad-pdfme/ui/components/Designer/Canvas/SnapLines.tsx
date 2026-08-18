/**
 * SnapLines — overlay de guías de alineación estilo Wix/DocuSign.
 *
 * Renderiza líneas horizontales/verticales y calcula snapping contra bordes,
 * centros de página y otros schemas. Las posiciones se calculan en milímetros
 * y se convierten a píxeles usando ZOOM.
 */
import { DESIGNER_CLASSNAME } from "@sisad-pdfme/ui/constants";
/**
 * SnapLines – Wix-style alignment guide overlay shown during element drag/resize.
 *
 * Renders thin coloured lines across the canvas whenever a dragged element
 * is aligned (within threshold) with the page centre, page edges, or another
 * element's edge/centre.  Distance badges appear between the dragged element
 * and the nearest neighbour, matching the Wix Editor experience.
 */
import React from 'react';
import { ZOOM } from '@sisad-pdfme/common';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
import type { SnapLine } from '@sisad-pdfme/ui/components/Designer/Canvas/snapEngine';

// Re-export para los consumidores históricos del overlay.
export type { SnapLine, SnapComputation } from '@sisad-pdfme/ui/components/Designer/Canvas/snapEngine';

/**
 * Props del overlay visual de snap lines.
 */
interface Props {
  lines: SnapLine[];
  /** Canvas scroll offsets (px) so lines stay aligned with the paper */
  scrollLeft?: number;
  scrollTop?: number;
  className?: string;
  style?: React.CSSProperties;
  useDefaultStyles?: boolean;
  palette?: {
    lineColor?: string;
    centerColor?: string;
  };
}

/**
 * Colores por defecto de guías normales y guías de centro.
 */
const LINE_COLOR = '#1890ff';
const CENTER_COLOR = '#ff4d4f';

/**
 * Presentación de la línea de snap, incluido el realce de la guía de centro.
 *
 * El `drag-shadow` de centro vivía en `sisad-pdfme.css` como
 * `.sisad-pdfme-designer-snap-line[data-is-center='true']`; el estado lo sigue
 * escribiendo este mismo componente en `data-is-center`, así que la variante
 * `data-[…]` reproduce la regla sin hoja de estilos aparte.
 */
const SNAP_LINE_CENTER_CLASSES =
  'pointer-events-none border-solid data-[is-center=true]:[filter:drop-shadow(0_0_2px_var(--color-danger-32))]';

const snapToDevicePixel = (value: number) => {
  const ratio = typeof window !== 'undefined' && Number.isFinite(window.devicePixelRatio)
    ? window.devicePixelRatio || 1
    : 1;
  return Math.round(value * ratio) / ratio;
};

/**
 * Renderiza líneas de alineación y etiquetas de distancia.
 */
const SnapLines = ({
  lines,
  scrollLeft = 0,
  scrollTop = 0,
  className,
  style,
  useDefaultStyles = true,
  palette,
}: Props) => {
  const isCenter = (line: SnapLine) => line.label === 'center';
  const lineColor = palette?.lineColor || LINE_COLOR;
  const centerColor = palette?.centerColor || CENTER_COLOR;
  const hasCustomClass = typeof className === 'string' && className.trim().length > 0;
  const rootClassName = mergeClassNames(
    `${DESIGNER_CLASSNAME}snap-lines`,
    hasCustomClass && `${DESIGNER_CLASSNAME}custom-${className?.trim()}`,
    'pointer-events-none absolute inset-0 z-[6]',
  );

  return (
    <div className={rootClassName} style={useDefaultStyles ? undefined : style}>
      {lines.map((line, i) => {
        const color = isCenter(line) ? centerColor : lineColor;
        const posPx = line.pos * ZOOM;
        const snappedTop = snapToDevicePixel(posPx - scrollTop);
        const snappedLeft = snapToDevicePixel(posPx - scrollLeft);

        if (line.type === 'horizontal') {
          return (
            <React.Fragment key={i}>
              <div
                className={mergeClassNames(
                  `${DESIGNER_CLASSNAME}snap-line`,
                  `${DESIGNER_CLASSNAME}snap-line-horizontal`,
                  SNAP_LINE_CENTER_CLASSES,
                )}
                data-is-center={isCenter(line) ? 'true' : 'false'}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${snappedTop}px`,
                  height: 0,
                  borderTop: `1px solid ${color}`,
                  pointerEvents: 'none',
                  zIndex: 7,
                  ...(useDefaultStyles ? {} : style || {}),
                }}
              />
              {line.label && line.label !== 'center' && (
                <span
                className={mergeClassNames(
                  `${DESIGNER_CLASSNAME}snap-label`,
                  `${DESIGNER_CLASSNAME}snap-label-horizontal`,
                  'absolute pointer-events-none rounded-md border border-current bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold leading-none whitespace-nowrap shadow-sm',
                )}
                  style={{
                    position: 'absolute',
                    top: `${snapToDevicePixel(snappedTop - 14)}px`,
                    left: 8,
                    fontSize: 10,
                    lineHeight: 1,
                    padding: '2px 5px',
                    borderRadius: 8,
                    color,
                    background: 'rgba(255,255,255,0.9)',
                    border: `1px solid ${color}`,
                    pointerEvents: 'none',
                    zIndex: 8,
                  }}
                >
                  {line.label}
                </span>
              )}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={i}>
            <div
              className={mergeClassNames(
                `${DESIGNER_CLASSNAME}snap-line`,
                `${DESIGNER_CLASSNAME}snap-line-vertical`,
                SNAP_LINE_CENTER_CLASSES,
              )}
              data-is-center={isCenter(line) ? 'true' : 'false'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${snappedLeft}px`,
                width: 0,
                borderLeft: `1px solid ${color}`,
                pointerEvents: 'none',
                zIndex: 7,
                ...(useDefaultStyles ? {} : style || {}),
              }}
            />
            {line.label && line.label !== 'center' && (
              <span
              className={mergeClassNames(
                `${DESIGNER_CLASSNAME}snap-label`,
                `${DESIGNER_CLASSNAME}snap-label-vertical`,
                'absolute pointer-events-none rounded-md border border-current bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold leading-none whitespace-nowrap shadow-sm',
              )}
              style={{
                position: 'absolute',
                top: 8,
                left: `${snapToDevicePixel(snappedLeft + 5)}px`,
                fontSize: 10,
                lineHeight: 1,
                padding: '2px 5px',
                  borderRadius: 8,
                  color,
                  background: 'rgba(255,255,255,0.9)',
                  border: `1px solid ${color}`,
                  pointerEvents: 'none',
                  zIndex: 8,
                }}
              >
                {line.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default SnapLines;


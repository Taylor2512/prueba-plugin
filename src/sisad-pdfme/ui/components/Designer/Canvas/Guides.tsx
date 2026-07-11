/**
 * Guides — wrapper visual de @scena/react-guides para reglas del diseñador.
 *
 * Renderiza la esquina, regla horizontal y regla vertical alrededor del Paper.
 * Permite customizar colores/unidad sin acoplar Canvas a detalles de Scena.
 */
import React, { Ref } from 'react';
import GuidesComponent from '@scena/react-guides';
import { ZOOM, Size } from '@sisad-pdfme/common';
import { RULER_HEIGHT, DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from '../shared/className.js';

/**
 * Construye estilos absolutos comunes para esquina y reglas.
 */
const guideStyle = (
  top: number,
  left: number,
  height: number,
  width: number,
  extra?: React.CSSProperties,
): React.CSSProperties => ({
  position: 'absolute',
  top,
  left,
  height,
  width,
  ...extra,
});

/**
 * Paleta visual configurable de reglas.
 */
export type GuidesPalette = {
  backgroundColor?: string;
  lineColor?: string;
  textColor?: string;
  cornerBackground?: string;
};

/**
 * Props del wrapper de reglas del diseñador.
 */
export type GuidesProps = {
  paperSize: Size;
  horizontalRef: Ref<GuidesComponent> | undefined;
  verticalRef: Ref<GuidesComponent> | undefined;
  className?: string;
  unit?: number;
  palette?: GuidesPalette;
};

/**
 * Renderiza esquina, regla horizontal y regla vertical del Paper.
 */
const Guides = ({
  paperSize,
  horizontalRef,
  verticalRef,
  className,
  unit = 10,
  palette,
}: GuidesProps) => {
  const effectivePalette: Required<GuidesPalette> = {
    backgroundColor: palette?.backgroundColor || '#2d2d2d',
    lineColor: palette?.lineColor || '#5b9aff',
    textColor: palette?.textColor || 'rgba(255,255,255,0.65)',
    cornerBackground: palette?.cornerBackground || '#2d2d2d',
  };

  return (
    <>
      {/* Corner square where both rulers meet */}
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'guides-corner',
          className,
          'overflow-hidden border-b border-r border-slate-700/90 bg-slate-800 shadow-sm',
        )}
        style={guideStyle(0, 0, RULER_HEIGHT, RULER_HEIGHT)}
      />
      {/* Horizontal ruler (top) */}
      <GuidesComponent
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'guides-ruler',
          DESIGNER_CLASSNAME + 'guides-ruler-horizontal',
          className,
          'overflow-hidden border-b border-slate-700/90 bg-slate-800 shadow-sm',
        )}
        style={guideStyle(0, RULER_HEIGHT, RULER_HEIGHT, paperSize.width)}
        zoom={ZOOM}
        type="horizontal"
        ref={horizontalRef}
        lineColor={effectivePalette.lineColor}
        textColor={effectivePalette.textColor}
        backgroundColor={effectivePalette.backgroundColor}
        unit={unit} />
      {/* Vertical ruler (left) */}
      <GuidesComponent
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'guides-ruler',
          DESIGNER_CLASSNAME + 'guides-ruler-vertical',
          className,
          'overflow-hidden border-r border-slate-700/90 bg-slate-800 shadow-sm',
        )}
        style={guideStyle(RULER_HEIGHT, 0, paperSize.height, RULER_HEIGHT)}
        zoom={ZOOM}
        type="vertical"
        ref={verticalRef}
        lineColor={effectivePalette.lineColor}
        textColor={effectivePalette.textColor}
        backgroundColor={effectivePalette.backgroundColor}
        unit={unit} />
    </>
  );
};

export default Guides;

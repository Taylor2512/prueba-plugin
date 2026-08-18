/**
 * Guides — wrapper visual de @scena/react-guides para reglas del diseñador.
 *
 * Renderiza la esquina, regla horizontal y regla vertical alrededor del Paper.
 * Permite customizar colores/unidad sin acoplar Canvas a detalles de Scena.
 */
import React, { Ref } from 'react';
import GuidesComponent from '@scena/react-guides';
import { ZOOM, Size } from '@sisad-pdfme/common';
import { RULER_HEIGHT, DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

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
 * Presentación del DOM interno de scena-guides.
 *
 * `@scena/react-guides` cuelga nuestra `className` del propio
 * `.scena-guides-manager`, así que todo lo que la hoja de estilos alcanzaba
 * como descendiente de la regla —o de la página del canvas, donde este
 * componente sólo lo monta `Canvas`— se expresa aquí como variante arbitraria
 * sobre el mismo nodo.
 *
 * `scena-guides-text` y `scena-guides-number` se conservan por paridad con la
 * regla original; la versión instalada del paquete no emite esas clases.
 */
const GUIDES_RULER_CLASSES = [
  'backdrop-blur-[0.0125rem]',
  '[&_.scena-guides-text]:text-[0.625rem]',
  '[&_.scena-guides-text]:opacity-[0.82]',
  '[&_.scena-guides-number]:text-[0.625rem]',
  '[&_.scena-guides-number]:opacity-[0.82]',
  '[&_.scena-guides-guide.scena-guides-adder]:opacity-[0.72]',
  '[&_.scena-guides-guide.scena-guides-adder]:bg-[var(--color-info-55)]',
  '[&_.scena-guides-guide-origin]:bg-transparent',
].join(' ');

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
  // Paleta clara por defecto, consistente con el diseñador light (el corner ya
  // usa el token `--sisad-pdfme-guides-corner-bg: #f1f5f9`). Los valores oscuros
  // previos (#2d2d2d / bg-slate-800 + texto blanco) producían la franja negra
  // junto a reglas/guías (regresión TASK-CANVAS-003).
  const effectivePalette: Required<GuidesPalette> = {
    backgroundColor: palette?.backgroundColor || '#f8fafc',
    lineColor: palette?.lineColor || '#cbd5e1',
    textColor: palette?.textColor || 'rgba(15,23,42,0.55)',
    cornerBackground: palette?.cornerBackground || '#f1f5f9',
  };

  return (
    <>
      {/* Corner square where both rulers meet */}
      <div
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'guides-corner',
          className,
          // `border-solid` explícito: preflight está desactivado, así que las
          // utilidades de lado (`border-b/-r`) fijan ancho pero no estilo y el
          // borde colapsaría a 0 sin él.
          'overflow-hidden border-b border-r border-solid border-slate-200/80 bg-slate-100',
        )}
        style={guideStyle(0, 0, RULER_HEIGHT, RULER_HEIGHT, {
          backgroundColor: effectivePalette.cornerBackground,
        })}
      />
      {/* Horizontal ruler (top) */}
      <GuidesComponent
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'guides-ruler',
          DESIGNER_CLASSNAME + 'guides-ruler-horizontal',
          className,
          'pointer-events-none overflow-hidden border-b border-solid border-slate-200/80 bg-slate-50',
          GUIDES_RULER_CLASSES,
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
          'pointer-events-none overflow-hidden border-r border-solid border-slate-200/80 bg-slate-50',
          GUIDES_RULER_CLASSES,
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

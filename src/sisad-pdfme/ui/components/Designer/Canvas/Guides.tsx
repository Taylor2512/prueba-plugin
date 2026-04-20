import React, { Ref } from 'react';
import GuidesComponent from '@scena/react-guides';
import { ZOOM, Size } from '@sisad-pdfme/common';
import { RULER_HEIGHT, DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from '../shared/className.js';

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

export type GuidesPalette = {
  backgroundColor?: string;
  lineColor?: string;
  textColor?: string;
  cornerBackground?: string;
};

export type GuidesProps = {
  paperSize: Size;
  horizontalRef: Ref<GuidesComponent> | undefined;
  verticalRef: Ref<GuidesComponent> | undefined;
  className?: string;
  unit?: number;
  palette?: GuidesPalette;
};

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
        className={mergeClassNames(DESIGNER_CLASSNAME + 'guides-corner', className)}
        style={guideStyle(0, 0, RULER_HEIGHT, RULER_HEIGHT)}
      />
      {/* Horizontal ruler (top) */}
      <GuidesComponent
        className={mergeClassNames(
          DESIGNER_CLASSNAME + 'guides-ruler',
          DESIGNER_CLASSNAME + 'guides-ruler-horizontal',
          className,
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

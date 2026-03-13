import React from 'react';
import { Size } from '@pdfme/common';
import { RULER_HEIGHT, DESIGNER_CLASSNAME } from '../../../constants.js';
import { theme } from 'antd';
import { mergeClassNames } from '../shared/className.js';

export type MaskProps = Size & {
  className?: string;
  style?: React.CSSProperties;
  maskColor?: string;
  blur?: number;
};

const Mask = ({ width, height, className, style, maskColor, blur = 1 }: MaskProps) => {
  const { token } = theme.useToken();

  return (
    <div
      className={mergeClassNames(DESIGNER_CLASSNAME + 'mask', className)}
      style={{
        position: 'absolute',
        top: -RULER_HEIGHT,
        left: -RULER_HEIGHT,
        zIndex: 100,
        width,
        height,
        background: maskColor || token.colorBgMask,
        backdropFilter: `blur(${blur}px)`,
        ...style,
      }}
    />
  );
};

export default Mask;

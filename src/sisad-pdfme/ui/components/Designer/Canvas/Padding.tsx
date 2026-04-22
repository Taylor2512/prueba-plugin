import { DESIGNER_CLASSNAME } from "../../../constants.js";
import React from 'react';
import type * as CSS from 'csstype';
import { ZOOM, BasePdf, isBlankPdf } from '@sisad-pdfme/common';
import { theme } from 'antd';

const getPaddingStyle = (i: number, p: number, color: string): CSS.Properties => {
  const style: CSS.Properties = {
    position: 'absolute',
    background: color,
    opacity: 0.25,
    pointerEvents: 'none',
  };
  switch (i) {
    case 0:
      style.top = 0;
      style.height = `${p * ZOOM}px`;
      style.left = 0;
      style.right = 0;
      break;
    case 1:
      style.right = 0;
      style.width = `${p * ZOOM}px`;
      style.top = 0;
      style.bottom = 0;
      break;
    case 2:
      style.bottom = 0;
      style.height = `${p * ZOOM}px`;
      style.left = 0;
      style.right = 0;
      break;
    case 3:
      style.left = 0;
      style.width = `${p * ZOOM}px`;
      style.top = 0;
      style.bottom = 0;
      break;
    default:
      break;
  }

  return style;
};

export type PaddingProps = {
  basePdf: BasePdf;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  opacity?: number;
};

const Padding = ({ basePdf, className, style, color, opacity = 0.25 }: PaddingProps) => {
  const { token } = theme.useToken();
  const resolvedColor = color || token.colorError;
  const hasCustomClass = typeof className === 'string' && className.trim().length > 0;
  const resolvedClassName = hasCustomClass
    ? `${DESIGNER_CLASSNAME}custom-${className.trim()}`
    : `${DESIGNER_CLASSNAME}padding`;
  const padding = isBlankPdf(basePdf) ? (basePdf.padding as [number, number, number, number]) : [0, 0, 0, 0];

  return (
    <>
      {isBlankPdf(basePdf) &&
        padding.map((p, i) => (
          <div
            key={String(i)}
            className={resolvedClassName}
            style={{
              ...getPaddingStyle(i, p, resolvedColor),
              opacity,
              ...(style || {}),
            }}
          />
        ))}
    </>
  );
};

export default Padding;

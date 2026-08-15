/**
 * Mask — overlay visual para páginas no activas o bloqueadas del canvas.
 *
 * Se usa para comunicar que una página existe/renderiza, pero no es la página
 * actualmente interactiva para Moveable/Selecto. No debe ocultar información
 * crítica ni reemplazar reglas de acceso de datos.
 */
import React from 'react';
import { Size } from '@sisad-pdfme/common';
import { RULER_HEIGHT, DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { theme } from 'antd';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

/**
 * Props del overlay de máscara.
 *
 * Extiende `Size` porque la máscara se dimensiona con width/height del Paper.
 */
export type MaskProps = Size & {
  className?: string;
  style?: React.CSSProperties;
  maskColor?: string;
  blur?: number;
};

/**
 * Renderiza una capa no interactiva sobre una página.
 */
const Mask = ({ width, height, className, style, maskColor, blur = 1 }: MaskProps) => {
  const { token } = theme.useToken();

  return (
    <div
      className={mergeClassNames(
        DESIGNER_CLASSNAME + 'mask',
        className,
        'pointer-events-none absolute z-[100] bg-[var(--sisad-pdfme-mask-bg)] [backdrop-filter:blur(var(--sisad-pdfme-mask-blur))] [transition:opacity_0.2s_ease] cursor-not-allowed',
      )}
      style={{
        top: -RULER_HEIGHT,
        left: -RULER_HEIGHT,
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

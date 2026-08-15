/**
 * Contenedor raíz del runtime PDFME.
 *
 * Aplica tamaño, fondo base, carga fuentes declaradas en FontContext y muestra
 * Spinner mientras el cálculo de escala no está listo.
 */
import { useContext, forwardRef, ReactNode, Ref, useEffect } from 'react';
import { Size } from '@sisad-pdfme/common';
import { FontContext } from '@sisad-pdfme/ui/contexts';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import Spinner from '@sisad-pdfme/ui/components/Spinner';
import '../runtimeStyles.js';

/**
 * Props del contenedor raíz del runtime.
 */
type Props = { size: Size; scale: number; children: ReactNode };

/**
 * Root visual del runtime.
 *
 * Carga fuentes declaradas, aplica tamaño/fondo y decide si mostrar Spinner o
 * contenido según la escala calculada.
 */
const Root = ({ size, scale, children }: Props, ref: Ref<HTMLDivElement>) => {
  const font = useContext(FontContext);

  useEffect(() => {
    if (!document?.fonts) return;
    const fontFaces = Object.entries(font).map(
      ([key, { data }]) =>
        new FontFace(key, typeof data === 'string' ? `url(${data})` : (data as BufferSource), {
          display: 'swap',
        }),
    );
    const newFontFaces = fontFaces.filter((fontFace) => !document.fonts.has(fontFace));

    void Promise.allSettled(newFontFaces.map((f) => f.load())).then((loadedFontFaces) => {
      loadedFontFaces.forEach((loadedFontFace) => {
        if (loadedFontFace.status === 'fulfilled') {
          document.fonts.add(loadedFontFace.value);
        }
      });
    });
  }, [font]);

  return (
    <div
      className={`${DESIGNER_CLASSNAME}root box-border relative flex min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/60 bg-[var(--color-bg-base)] shadow-sm`}
      ref={ref}
      style={{ ...size }}>
      <div
        className={`${DESIGNER_CLASSNAME}background relative box-border flex h-full w-full min-h-0 flex-col`}
        style={{ ...size }}>
        {scale === 0 ? <Spinner /> : children}
      </div>
    </div>
  );
};

export default forwardRef<HTMLDivElement, Props>(Root);

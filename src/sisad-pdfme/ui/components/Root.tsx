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
 * Tokens de runtime declarados en el root del diseñador.
 *
 * Vivían en `.sisad-pdfme-root` dentro de `ui/styles/sisad-pdfme.css`, una
 * clase que ningún nodo llegaba a llevar: el root real es
 * `DESIGNER_CLASSNAME + 'root'` (`sisad-pdfme-designer-root`), de modo que las
 * declaraciones nunca se aplicaban y los consumidores sin fallback
 * (`var(--sisad-schema-radius)`, `var(--sisad-schema-selected-shadow)`) perdían
 * la declaración entera.
 *
 * Se expresan como utilidades de propiedad arbitraria sobre este mismo nodo
 * para conservar el alcance original —tokens del runtime, no globales— sin
 * depender de una hoja de estilos aparte.
 */
const RUNTIME_TOKEN_CLASSES = [
  '[--bg-hover:var(--color-bg-hover)]',
  '[--bg-active:var(--color-bg-active)]',
  '[--border-subtle:var(--color-border-subtle)]',
  '[--border-soft:var(--color-border-soft)]',
  '[--border-strong:var(--color-gray-400)]',
  '[--text-primary:var(--color-text-primary)]',
  '[--text-secondary:var(--color-text-secondary)]',
  '[--text-muted:var(--color-text-muted)]',
  '[--transition:180ms_ease]',
  '[--sisad-schema-radius:4px]',
  '[--sisad-schema-border-alpha:0.64]',
  '[--sisad-schema-surface-alpha:0.14]',
  '[--sisad-schema-selected-color:var(--sisad-pdfme-selection-color,#4200ca)]',
  '[--sisad-schema-selected-shadow:0_0_0_1px_var(--sisad-schema-selected-color)]',
  '[--sisad-schema-font-size:11px]',
  '[--sisad-schema-line-height:1.2]',
  '[--sisad-schema-padding-x:6px]',
  '[--sisad-schema-padding-y:3px]',
].join(' ');

/*
 * `box-sizing: border-box` heredado por todo el subárbol NO se migra.
 *
 * La regla existía en `sisad-pdfme.css` sobre `.sisad-pdfme-root *`, así que
 * nunca llegó a aplicarse, y su comentario daba por hecho que «preflight cubre
 * esto en la app»: no lo cubre, `tailwind.config.js` lo desactiva a propósito
 * «para no alterar canvas, PDF, inputs, Ant Design, Moveable ni medidas del
 * diseñador». Colgarla aquí la encendería por primera vez sobre todo el
 * runtime —incluida la geometría de cada schema, que compara contra el PDF—,
 * que es justamente lo que esa decisión evita. Los nodos que sí necesitan
 * `border-box` ya lo declaran uno a uno.
 */

/** Scrollbars propias del runtime (WebKit), heredadas por todo el subárbol. */
const RUNTIME_SCROLLBAR_CLASSES = [
  '[&_::-webkit-scrollbar]:w-[5px]',
  '[&_::-webkit-scrollbar]:h-[5px]',
  '[&_::-webkit-scrollbar-track]:bg-transparent',
  '[&_::-webkit-scrollbar-thumb]:rounded-[100px]',
  '[&_::-webkit-scrollbar-thumb]:bg-[var(--border-soft)]',
  '[&_::-webkit-scrollbar-thumb:hover]:bg-[var(--border-strong)]',
].join(' ');

/** Tipografía base del chrome del runtime. */
const RUNTIME_TYPOGRAPHY_CLASSES =
  '[font-family:var(--font-family-ui)] text-[0.8125rem] leading-[1.5] text-[color:var(--color-text-primary)] antialiased';

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
      className={`${DESIGNER_CLASSNAME}root box-border relative flex min-h-0 flex-col overflow-hidden rounded-[1.5rem] border border-slate-200/60 bg-[var(--color-bg-base)] shadow-sm ${RUNTIME_TYPOGRAPHY_CLASSES} ${RUNTIME_TOKEN_CLASSES} ${RUNTIME_SCROLLBAR_CLASSES}`}
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

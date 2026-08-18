/**
 * Paper renderiza las páginas del documento y posiciona schemas por página.
 *
 * Este componente es la capa visual común del Designer, Preview, Form y Viewer:
 * calcula bloques de página, fondos, tamaños y metadatos DOM para cada paper,
 * manteniendo una última versión estable para evitar parpadeos durante cargas.
 */
import { ReactNode, useContext, useMemo, useState } from 'react';
import { ZOOM, SchemaForUI, Size, getFallbackFontName } from '@sisad-pdfme/common';
import { FontContext } from '@sisad-pdfme/ui/contexts';
import { RULER_HEIGHT, PAGE_GAP } from '@sisad-pdfme/ui/constants';
import { buildPageMetadataAttrs } from '@sisad-pdfme/ui/components/shared/pageMetadata';

/**
 * Imagen transparente usada como fallback cuando una página aún no tiene fondo.
 */
const TRANSPARENT_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+pR6QAAAAASUVORK5CYII=';

/**
 * Bloque calculado de página en coordenadas de canvas.
 */
type PageBlock = {
  background: string;
  pageSize: Size;
  paperSize: { width: number; height: number };
  pageTop: number;
};

/**
 * Snapshot estable del layout de páginas.
 *
 * Permite mantener la última estructura válida mientras se recalcula o refresca
 * el preprocesamiento de fondos.
 */
type StablePaperState = {
  key: string;
  pageBlocks: PageBlock[];
  normalizedSchemasList: SchemaForUI[][];
  rootWidth: number;
  rootHeight: number;
};

/**
 * Props internas para renderizar una página física del documento.
 */
type PaperPageProps = {
  block: PageBlock;
  paperIndex: number;
  documentId?: string | null;
  normalizedSchemasList: SchemaForUI[][];
  renderPaper: (arg: { index: number; paperSize: Size }) => ReactNode;
  renderSchema: (arg: { index: number; pageIndex: number; schema: SchemaForUI }) => ReactNode;
  fontName: string;
  registerPaperRef: (paperIndex: number, element: HTMLDivElement | null) => void;
};

/**
 * Página individual del documento.
 *
 * Aplica background, metadata DOM, ref registrable y delega renderPaper/renderSchema
 * para que Designer, Preview y Form agreguen su propio contenido.
 */
const PaperPage = ({
  block,
  paperIndex,
  documentId,
  normalizedSchemasList,
  renderPaper,
  renderSchema,
  fontName,
  registerPaperRef,
}: PaperPageProps) => (
  <div
    key={String(paperIndex) + JSON.stringify(block.paperSize)}
    data-paper-page="true"
    className="sisad-pdfme-paper-page absolute left-0 box-border rounded-[0.35rem] border border-[rgba(148,163,184,0.28)] bg-white bg-no-repeat bg-left-top shadow-[0_14px_32px_rgba(15,23,42,0.08),0_2px_8px_rgba(15,23,42,0.06)]"
    {...buildPageMetadataAttrs({ documentId, pageIndex: paperIndex, pageNumber: paperIndex + 1 })}
    tabIndex={-1}
    ref={(e) => registerPaperRef(paperIndex, e)}
    role="presentation"
    /*
     * Geometría por página: alto/ancho/desplazamiento y fondo dependen del
     * tamaño real del PDF, así que viven en `style` y no en utilidades. Tailwind
     * solo posee la presentación estática (borde, radio, sombra, color base).
     */
    style={{
      fontFamily: `'${fontName}'`,
      top: block.pageTop,
      width: block.paperSize.width,
      height: block.paperSize.height,
      backgroundImage: `url(${block.background})`,
      backgroundSize: `${block.paperSize.width}px ${block.paperSize.height}px`,
    }}
  >
    {renderPaper({ paperSize: block.pageSize, index: paperIndex })}
    {/*
      La posición desempata la key: los `defaultSchema` de los grupos de
      opciones traían un `id` literal, así que dos grupos del mismo tipo
      llegaban con identidad repetida y React descartaba uno de los dos.
    */}
    {(normalizedSchemasList[paperIndex] || []).map((schema, schemaIndex) => (
      <div key={`${schema.id ?? schema.name ?? 'schema'}-${paperIndex}-${schemaIndex}`}>
        {renderSchema({
          schema,
          pageIndex: paperIndex,
          index:
            paperIndex === 0
              ? schemaIndex
              : schemaIndex + normalizedSchemasList[paperIndex - 1].length,
        })}
      </div>
    ))}
  </div>
);

/**
 * Renderiza el conjunto de páginas del documento.
 *
 * Normaliza schemas por página, calcula tamaños en píxeles y mantiene el layer
 * escalado que sirve como base común del canvas y preview.
 */
const Paper = (props: {
  scale: number;
  size: Size;
  schemasList: SchemaForUI[][];
  pageSizes: Size[];
  backgrounds: string[];
  documentId?: string | null;
  renderPaper: (arg: { index: number; paperSize: Size }) => ReactNode;
  renderSchema: (arg: { index: number; pageIndex: number; schema: SchemaForUI }) => ReactNode;
  hasRulers?: boolean;
  registerPaperRef: (paperIndex: number, element: HTMLDivElement | null) => void;
  contentOffsetX?: number;
}) => {
  const { scale, schemasList, pageSizes, backgrounds, documentId, renderPaper, renderSchema, hasRulers, registerPaperRef, contentOffsetX = 0 } = props;
  const font = useContext(FontContext);

  const normalizedSchemasList =
    pageSizes.length === schemasList.length
      ? schemasList
      : Array.from({ length: pageSizes.length }, (_, paperIndex) => schemasList[paperIndex] || []);
  const initialTop = hasRulers ? RULER_HEIGHT : PAGE_GAP * 2;
  const fallbackBackgrounds = useMemo(
    () => Array.from({ length: pageSizes.length }, (_, paperIndex) => backgrounds[paperIndex] || TRANSPARENT_PNG),
    [backgrounds, pageSizes.length],
  );

  const currentState = useMemo<StablePaperState | null>(() => {
    if (pageSizes.length === 0) {
      return null;
    }

    const resolvedBackgrounds = pageSizes.map(
      (_, paperIndex) => backgrounds[paperIndex] || fallbackBackgrounds[paperIndex] || TRANSPARENT_PNG,
    );

    const computedState = pageSizes.reduce<{
      pageBlocks: PageBlock[];
      nextTop: number;
      rootWidth: number;
      rootHeight: number;
    }>(
      (acc, pageSizeItem, paperIndex) => {
        const background = resolvedBackgrounds[paperIndex] || TRANSPARENT_PNG;
        const paperSize = { width: pageSizeItem.width * ZOOM, height: pageSizeItem.height * ZOOM };
        const pageTop = acc.nextTop;

        return {
          pageBlocks: acc.pageBlocks.concat({
            background,
            pageSize: pageSizeItem,
            paperSize,
            pageTop,
          }),
          nextTop: pageTop + paperSize.height + PAGE_GAP,
          rootWidth: Math.max(acc.rootWidth, paperSize.width),
          rootHeight: Math.max(acc.rootHeight, pageTop + paperSize.height),
        };
      },
      {
        pageBlocks: [],
        nextTop: initialTop,
        rootWidth: 0,
        rootHeight: 0,
      },
    );

    const key = [
      computedState.rootWidth,
      computedState.rootHeight,
      computedState.pageBlocks
        .map(
          (block) =>
            `${block.pageSize.width}x${block.pageSize.height}:${block.paperSize.width}x${block.paperSize.height}:${block.pageTop}:${block.background}`,
        )
        .join('|'),
    ].join(':');

    return {
      key,
      pageBlocks: computedState.pageBlocks,
      normalizedSchemasList,
      rootWidth: computedState.rootWidth,
      rootHeight: computedState.rootHeight,
    };
  }, [backgrounds, fallbackBackgrounds, initialTop, normalizedSchemasList, pageSizes]);

  const [lastStableState, setLastStableState] = useState<StablePaperState | null>(currentState);
  if (currentState && lastStableState?.key !== currentState.key) {
    setLastStableState(currentState);
  }

  const stableState = currentState || lastStableState;
  if (!stableState) {
    return null;
  }

  const { pageBlocks, normalizedSchemasList: stableSchemasList, rootWidth, rootHeight } = stableState;

  const scaledRootWidth = rootWidth * scale;
  const scaledRootHeight = rootHeight * scale;

  return (
    <div
      data-paper-root="true"
      /*
       * `mx-auto` (y no `justify-center` en el contenedor) es lo que centra el
       * documento: con márgenes automáticos el papel queda centrado mientras
       * sobra espacio y se alinea al inicio cuando desborda por zoom, de modo
       * que el borde izquierdo sigue siendo alcanzable con scroll.
       */
      className="sisad-pdfme-paper-root relative box-border mx-auto flex-none min-w-0 min-h-0"
      {...buildPageMetadataAttrs({ documentId })}
      style={{
        width: scaledRootWidth,
        height: scaledRootHeight,
        transform: contentOffsetX ? `translateX(${contentOffsetX}px)` : undefined,
        willChange: contentOffsetX ? 'transform' : undefined,
      }}
    >
      <div
        data-paper-scale-layer="true"
        className="sisad-pdfme-paper-scale-layer absolute left-0 top-0 box-border origin-top-left"
        style={{
          width: rootWidth,
          height: rootHeight,
          transform: `scale(${scale})`,
        }}
      >
        {pageBlocks.map((block, paperIndex) => (
          <PaperPage
            key={String(paperIndex) + JSON.stringify(block.paperSize)}
            block={block}
            paperIndex={paperIndex}
            documentId={documentId}
            normalizedSchemasList={stableSchemasList}
            renderPaper={renderPaper}
            renderSchema={renderSchema}
            fontName={getFallbackFontName(font)}
            registerPaperRef={registerPaperRef}
          />
        ))}
      </div>
    </div>
  );
};

export default Paper;

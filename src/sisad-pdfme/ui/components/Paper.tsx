/**
 * Paper renderiza las páginas del documento y posiciona schemas por página.
 *
 * Este componente es la capa visual común del Designer, Preview, Form y Viewer:
 * calcula bloques de página, fondos, tamaños y metadatos DOM para cada paper,
 * manteniendo una última versión estable para evitar parpadeos durante cargas.
 */
import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ZOOM, SchemaForUI, Size, getFallbackFontName } from '@sisad-pdfme/common';
import { FontContext } from '../contexts.js';
import { RULER_HEIGHT, PAGE_GAP } from '../constants.js';
import { buildPageMetadataAttrs } from './shared/pageMetadata.js';

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
    className="sisad-pdfme-paper-page bg-no-repeat bg-left-top"
    {...buildPageMetadataAttrs({ documentId, pageIndex: paperIndex, pageNumber: paperIndex + 1 })}
    tabIndex={-1}
    ref={(e) => registerPaperRef(paperIndex, e)}
    role="presentation"
    style={{
      backgroundImage: `url(${block.background})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top left',
      backgroundSize: `${block.paperSize.width}px ${block.paperSize.height}px`,
      '--paper-page-font': `'${fontName}'`,
      '--paper-page-top': `${block.pageTop}px`,
      '--paper-page-background': `url(${block.background})`,
      '--paper-page-width': `${block.paperSize.width}px`,
      '--paper-page-height': `${block.paperSize.height}px`,
      '--paper-page-background-size': `${block.paperSize.width}px ${block.paperSize.height}px`,
    } as React.CSSProperties}
  >
    {renderPaper({ paperSize: block.pageSize, index: paperIndex })}
    {(normalizedSchemasList[paperIndex] || []).map((schema, schemaIndex) => (
      <div key={schema.id}>
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
}) => {
  const { scale, schemasList, pageSizes, backgrounds, documentId, renderPaper, renderSchema, hasRulers, registerPaperRef } = props;
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

  const [lastStableState, setLastStableState] = useState<StablePaperState | null>(null);

  useEffect(() => {
    if (!currentState) return;
    setLastStableState((prev) => (prev?.key === currentState.key ? prev : currentState));
  }, [currentState]);

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
      className="sisad-pdfme-paper-root relative"
      {...buildPageMetadataAttrs({ documentId })}
      style={{
        '--paper-root-width': `${scaledRootWidth}px`,
        '--paper-root-height': `${scaledRootHeight}px`,
      } as React.CSSProperties}
    >
      <div
        data-paper-scale-layer="true"
        className="sisad-pdfme-paper-scale-layer relative"
        style={{
          '--paper-layer-width': `${rootWidth}px`,
          '--paper-layer-height': `${rootHeight}px`,
          '--paper-scale': String(scale),
        } as React.CSSProperties}
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

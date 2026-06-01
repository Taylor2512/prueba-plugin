import React, { ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { ZOOM, SchemaForUI, Size, getFallbackFontName } from '@sisad-pdfme/common';
import { FontContext } from '../contexts.js';
import { RULER_HEIGHT, PAGE_GAP } from '../constants.js';

type PageBlock = {
  background: string;
  pageSize: Size;
  paperSize: { width: number; height: number };
  pageTop: number;
};

type StablePaperState = {
  key: string;
  pageBlocks: PageBlock[];
  normalizedSchemasList: SchemaForUI[][];
  rootWidth: number;
  rootHeight: number;
};

type PaperPageProps = {
  block: PageBlock;
  paperIndex: number;
  normalizedSchemasList: SchemaForUI[][];
  renderPaper: (arg: { index: number; paperSize: Size }) => ReactNode;
  renderSchema: (arg: { index: number; schema: SchemaForUI }) => ReactNode;
  fontName: string;
  registerPaperRef: (paperIndex: number, element: HTMLDivElement | null) => void;
};

const PaperPage = ({
  block,
  paperIndex,
  normalizedSchemasList,
  renderPaper,
  renderSchema,
  fontName,
  registerPaperRef,
}: PaperPageProps) => (
  <div
    key={String(paperIndex) + JSON.stringify(block.paperSize)}
    data-paper-page="true"
    className="sisad-pdfme-paper-page"
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
          index:
            paperIndex === 0
              ? schemaIndex
              : schemaIndex + normalizedSchemasList[paperIndex - 1].length,
        })}
      </div>
    ))}
  </div>
);

const Paper = (props: {
  scale: number;
  size: Size;
  schemasList: SchemaForUI[][];
  pageSizes: Size[];
  backgrounds: string[];
  renderPaper: (arg: { index: number; paperSize: Size }) => ReactNode;
  renderSchema: (arg: { index: number; schema: SchemaForUI }) => ReactNode;
  hasRulers?: boolean;
  registerPaperRef: (paperIndex: number, element: HTMLDivElement | null) => void;
}) => {
  const { scale, schemasList, pageSizes, backgrounds, renderPaper, renderSchema, hasRulers, registerPaperRef } = props;
  const font = useContext(FontContext);

  const normalizedSchemasList =
    pageSizes.length === schemasList.length
      ? schemasList
      : Array.from({ length: pageSizes.length }, (_, paperIndex) => schemasList[paperIndex] || []);
  const initialTop = hasRulers ? RULER_HEIGHT : PAGE_GAP * 2;

  const currentState = useMemo<StablePaperState | null>(() => {
    if (pageSizes.length !== backgrounds.length) {
      return null;
    }

    const computedState = backgrounds.reduce<{
      pageBlocks: PageBlock[];
      nextTop: number;
      rootWidth: number;
      rootHeight: number;
    }>(
      (acc, background, paperIndex) => {
        const pageSize = pageSizes[paperIndex];
        const paperSize = { width: pageSize.width * ZOOM, height: pageSize.height * ZOOM };
        const pageTop = acc.nextTop;

        return {
          pageBlocks: acc.pageBlocks.concat({
            background,
            pageSize,
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
  }, [backgrounds, initialTop, normalizedSchemasList, pageSizes]);

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
      className="sisad-pdfme-paper-root"
      style={{
        '--paper-root-width': `${scaledRootWidth}px`,
        '--paper-root-height': `${scaledRootHeight}px`,
      } as React.CSSProperties}
    >
      <div
        data-paper-scale-layer="true"
        className="sisad-pdfme-paper-scale-layer"
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

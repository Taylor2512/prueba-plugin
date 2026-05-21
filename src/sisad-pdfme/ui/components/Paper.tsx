import React, { MutableRefObject, ReactNode, useContext } from 'react';
import { ZOOM, SchemaForUI, Size, getFallbackFontName } from '@sisad-pdfme/common';
import { FontContext } from '../contexts.js';
import { RULER_HEIGHT, PAGE_GAP } from '../constants.js';

type PageBlock = {
  background: string;
  pageSize: Size;
  paperSize: { width: number; height: number };
  pageTop: number;
};

const Paper = (props: {
  paperRefs: MutableRefObject<HTMLDivElement[]>;
  scale: number;
  size: Size;
  schemasList: SchemaForUI[][];
  pageSizes: Size[];
  backgrounds: string[];
  renderPaper: (arg: { index: number; paperSize: Size }) => ReactNode;
  renderSchema: (arg: { index: number; schema: SchemaForUI }) => ReactNode;
  hasRulers?: boolean;
}) => {
  const {
    paperRefs,
    scale,
    schemasList,
    pageSizes,
    backgrounds,
    renderPaper,
    renderSchema,
    hasRulers,
  } = props;
  const font = useContext(FontContext);

  if (pageSizes.length !== backgrounds.length) {
    return null;
  }

  const normalizedSchemasList =
    pageSizes.length === schemasList.length
      ? schemasList
      : Array.from({ length: pageSizes.length }, (_, pageIndex) => schemasList[pageIndex] || []);
  const initialTop = hasRulers ? RULER_HEIGHT : PAGE_GAP * 2;
  const { pageBlocks, rootWidth, rootHeight } = backgrounds.reduce<{
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

  const scaledRootWidth = rootWidth * scale;
  const scaledRootHeight = rootHeight * scale;

  return (
    <div
      data-paper-root="true"
      style={{
        position: 'relative',
        width: `${scaledRootWidth}px`,
        height: `${scaledRootHeight}px`,
        flex: '0 0 auto',
      }}
    >
      <div
        data-paper-scale-layer="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: `${rootWidth}px`,
          height: `${rootHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {pageBlocks.map(({ background, pageSize, paperSize, pageTop }, paperIndex) => (
          <div
            key={String(paperIndex) + JSON.stringify(paperSize)}
            data-paper-page="true"
            ref={(e) => {
              if (e) {
                paperRefs.current[paperIndex] = e;
              }
            }}
            onMouseDown={(e) => {
              if (
                e.currentTarget === e.target &&
                document &&
                document.hasFocus() &&
                document.activeElement instanceof HTMLElement
              ) {
                document.activeElement.blur();
              }
            }}
            style={{
              fontFamily: `'${getFallbackFontName(font)}'`,
              top: `${pageTop}px`,
              left: '0px',
              position: 'absolute',
              backgroundImage: `url(${background})`,
              backgroundSize: `${paperSize.width}px ${paperSize.height}px`,
              width: `${paperSize.width}px`,
              height: `${paperSize.height}px`,
            }}
          >
            {renderPaper({ paperSize: pageSize, index: paperIndex })}
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
        ))}
      </div>
    </div>
  );
};

export default Paper;

import React, { MutableRefObject, ReactNode, useContext } from 'react';
import { ZOOM, SchemaForUI, Size, getFallbackFontName } from '@pdfme/common';
import { FontContext } from '../contexts.js';
import { RULER_HEIGHT, PAGE_GAP, UI_CLASSNAME } from '../constants.js';

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
    schemasList,
    pageSizes,
    backgrounds,
    renderPaper,
    renderSchema,
    hasRulers,
  } = props;
  const font = useContext(FontContext);
  const rulerHeight = hasRulers ? RULER_HEIGHT : 0;

  if (pageSizes.length !== backgrounds.length || pageSizes.length !== schemasList.length) {
    return null;
  }

  return (
    <div
      className={UI_CLASSNAME + "div-auto"}
    >
      {backgrounds.map((background, paperIndex) => {
        const pageSize = pageSizes[paperIndex];
        const paperSize = { width: pageSize.width * ZOOM, height: pageSize.height * ZOOM };

        // Keep page geometry explicit so the canvas never collapses to a tiny height.
        // Layout is handled by flow (column stack), so we only need deterministic size + top gap.
        const pageTopGap = hasRulers
          ? paperIndex === 0
            ? rulerHeight
            : rulerHeight + PAGE_GAP
          : paperIndex === 0
            ? PAGE_GAP * 2
            : PAGE_GAP;

        return (
          <div
            key={String(paperIndex) + JSON.stringify(paperSize)}
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
              position: 'relative',
              width: `${paperSize.width + rulerHeight}px`,
              height: `${paperSize.height + rulerHeight}px`,
              marginTop: `${pageTopGap}px`,
            }}
            className={UI_CLASSNAME + "div-auto"}
          >
            {renderPaper({ paperSize, index: paperIndex })}
            {schemasList[paperIndex].map((schema, schemaIndex) => {
              return (
                <div key={schema.id}>
                  {renderSchema({
                    schema,
                    index:
                      paperIndex === 0
                        ? schemaIndex
                        : schemaIndex + schemasList[paperIndex - 1].length,
                  })}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Paper;

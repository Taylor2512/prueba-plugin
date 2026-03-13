import React, { MutableRefObject, ReactNode, useContext } from 'react';
import { ZOOM, SchemaForUI, Size, getFallbackFontName } from '@pdfme/common';
import { FontContext } from '../contexts.js';
import { RULER_HEIGHT, PAGE_GAP } from '../constants.js';

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
    size,
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

  const getUsableViewportWidth = () => {
    if (!hasRulers || typeof window === 'undefined' || typeof document === 'undefined') {
      return size.width;
    }

    const canvas = document.querySelector('.pdfme-designer-canvas') as HTMLElement | null;
    if (!canvas) return size.width;

    const styles = window.getComputedStyle(canvas);
    const paddingLeft = Number.parseFloat(styles.paddingLeft || '0') || 0;
    const paddingRight = Number.parseFloat(styles.paddingRight || '0') || 0;
    const contentWidth = canvas.clientWidth - paddingLeft - paddingRight;

    return Number.isFinite(contentWidth) && contentWidth > 0 ? contentWidth : size.width;
  };

  const viewportWidth = getUsableViewportWidth();

  return (
    <div
      data-paper-root="true"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        // NOTE: These values do not impact the UI unless they exceed the Paper sizes.
        // We set them to the scale value to ensure the container is redrawn when you zoom in/out.
        height: scale,
        width: scale,
      }}
    >
      {backgrounds.map((background, paperIndex) => {
        const pageSize = pageSizes[paperIndex];
        const paperSize = { width: pageSize.width * ZOOM, height: pageSize.height * ZOOM };

        // We want to center the content within the available viewport, but transform: scale()
        // must be done from the top-left or CSS crops off left-hand content as you zoom in.
        // However, we want to display the content centrally, so we apply a left indent for
        // when the content does not exceed its container
        const leftCenteringIndent =
          paperSize.width * scale + rulerHeight < viewportWidth
            ? `${(viewportWidth / scale - paperSize.width) / 2}px`
            : `${rulerHeight}px`;

        // Rulers are drawn above/before the top of each page, so each Paper div must have
        // a top offset considering them.
        let pageTop = paperIndex > 0 ? (rulerHeight + PAGE_GAP) * (paperIndex + 1) : rulerHeight;

        if (!hasRulers) {
          // If no rulers (i.e. Preview/Form) then we'll add an initial gap at the top of the first page
          pageTop += PAGE_GAP * 2;
        }

        return (
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
              left: leftCenteringIndent,
              position: 'relative',
              backgroundImage: `url(${background})`,
              backgroundSize: `${paperSize.width}px ${paperSize.height}px`,
              ...paperSize,
            }}
          >
            {renderPaper({ paperSize, index: paperIndex })}
            {(schemasList[paperIndex] || []).map((schema, schemaIndex) => {
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

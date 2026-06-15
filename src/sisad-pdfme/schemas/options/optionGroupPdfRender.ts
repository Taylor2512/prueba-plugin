import type { PDFRenderProps, Schema } from '@sisad-pdfme/common';
import type { OptionItem } from './optionTypes.js';
import { convertForPdfLayoutProps, hex2PrintingColor } from '../utils.js';

export type OptionGroupPdfParams = {
  page: PDFRenderProps<Schema>['page'];
  schema: Schema;
  options: OptionItem[];
  selectionMode: 'single' | 'multiple';
  color?: string;
};

// Simple PDF renderer for option groups (draws small radio circles or checkbox squares)
export const renderOptionGroupPdf = ({ page, schema, options, selectionMode, color = '#1677ff' }: OptionGroupPdfParams) => {
  const pageHeight = page.getHeight();
  const {
    position: { x: left, y: top },
  } = convertForPdfLayoutProps({ schema, pageHeight, applyRotateTranslate: false });
  const printingColor = hex2PrintingColor(color);

  const BOX_SIZE = 8; // small marker in PDF units
  const GAP = 6;

  let cursorY = top;

  options.forEach((opt) => {
    const markerX = left;
    const labelX = left + BOX_SIZE + 6;

    if (selectionMode === 'single') {
      // radio circle
      page.drawCircle({
        x: markerX + BOX_SIZE / 2,
        y: cursorY + BOX_SIZE / 2,
        size: BOX_SIZE / 2,
        color: printingColor,
        borderColor: printingColor,
        borderWidth: 0.8,
      });
    } else {
      // checkbox square
      page.drawRectangle({
        x: markerX,
        y: cursorY,
        width: BOX_SIZE,
        height: BOX_SIZE,
        color: undefined,
        borderColor: printingColor,
        borderWidth: 0.8,
      });
    }

    page.drawText(String(opt.label || opt.optionId), { x: labelX, y: cursorY + 1, size: 10, color: hex2PrintingColor('#000000') });

    cursorY += BOX_SIZE + GAP;
  });
};

export default renderOptionGroupPdf;

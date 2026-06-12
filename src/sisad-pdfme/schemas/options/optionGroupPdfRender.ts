import type { OptionItem } from './optionTypes.js';
import { convertForPdfLayoutProps, hex2PrintingColor } from '../utils/convertForPdfLayoutProps.js';

export type OptionGroupPdfParams = {
  page: Record<string, (...args: unknown[]) => unknown>;
  x: number;
  y: number;
  width: number;
  schema: Record<string, unknown>;
  options: OptionItem[];
  selectionMode: 'single' | 'multiple';
  color?: string;
};

// Simple PDF renderer for option groups (draws small radio circles or checkbox squares)
export const renderOptionGroupPdf = ({ page, x, y, width, schema, options, selectionMode, color = '#1677ff' }: OptionGroupPdfParams) => {
  const { top, left } = convertForPdfLayoutProps({ x, y, width }, schema);
  const printingColor = hex2PrintingColor(color);

  const BOX_SIZE = 8; // small marker in PDF units
  const GAP = 6;

  let cursorY = top;

  options.forEach((opt) => {
    const markerX = left;
    const labelX = left + BOX_SIZE + 6;

    if (selectionMode === 'single') {
      // radio circle
      page.drawCircle({ x: markerX + BOX_SIZE / 2, y: cursorY + BOX_SIZE / 2, r: BOX_SIZE / 2, color: printingColor, border: { color: printingColor, width: 0.8 } });
    } else {
      // checkbox square
      page.drawRect({ x: markerX, y: cursorY, w: BOX_SIZE, h: BOX_SIZE, color: null, border: { color: printingColor, width: 0.8 } });
    }

    page.drawText(String(opt.label || opt.optionId), { x: labelX, y: cursorY + 1, size: 10, color: '#000000' });

    cursorY += BOX_SIZE + GAP;
  });
};

export default renderOptionGroupPdf;

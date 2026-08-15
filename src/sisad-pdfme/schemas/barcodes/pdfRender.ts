import { PDFRenderProps } from '@sisad-pdfme/common';
import { convertForPdfLayoutProps } from '@sisad-pdfme/schemas/utils';
import type { BarcodeSchema } from '@sisad-pdfme/schemas/barcodes/types';
import { createBarCode, validateBarcodeInput } from '@sisad-pdfme/schemas/barcodes/helper';
import { PDFImage } from 'pdf-lib';

const getBarcodeCacheKey = (schema: BarcodeSchema, value: string) => {
  return `${schema.type}${schema.backgroundColor}${schema.barColor}${schema.textColor}${value}${schema.includetext}`;
};

export const renderBarcodePdf = async (arg: PDFRenderProps<BarcodeSchema>) => {
  const { value, schema, pdfDoc, page, _cache } = arg;
  if (!validateBarcodeInput(schema.type, value)) return;

  const inputBarcodeCacheKey = getBarcodeCacheKey(schema, value);
  let image = _cache.get(inputBarcodeCacheKey) as PDFImage | undefined;
  if (!image) {
    const imageBuf = await createBarCode({
      ...schema,
      type: schema.type,
      input: value,
    });
    image = await pdfDoc.embedPng(imageBuf);
    _cache.set(inputBarcodeCacheKey, image);
  }

  const pageHeight = page.getHeight();
  const {
    width,
    height,
    rotate,
    position: { x, y },
    opacity,
  } = convertForPdfLayoutProps({ schema, pageHeight });

  page.drawImage(image, { x, y, rotate, width, height, opacity });
};

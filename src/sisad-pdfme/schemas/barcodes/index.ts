import { renderBarcodePdf } from '@sisad-pdfme/schemas/barcodes/pdfRender';
import { getPropPanelByBarcodeType } from '@sisad-pdfme/schemas/barcodes/propPanel';
import { renderBarcodeUi } from '@sisad-pdfme/schemas/barcodes/uiRender';
import type { BarcodeSchema, BarcodeTypes } from '@sisad-pdfme/schemas/barcodes/types';
import { BARCODE_TYPES } from '@sisad-pdfme/schemas/barcodes/constants';
import { createSvgStr } from '@sisad-pdfme/schemas/utils';
import { Plugin } from '@sisad-pdfme/common';
import { QrCode, Barcode } from 'lucide-react';

const barcodes = BARCODE_TYPES.reduce(
  (acc, type) =>
    Object.assign(acc, {
      [type]: {
        pdf: renderBarcodePdf,
        ui: renderBarcodeUi,
        propPanel: getPropPanelByBarcodeType(type),
        icon: createSvgStr(type === 'qrcode' ? QrCode : Barcode),
      },
    }),
  {} as Record<BarcodeTypes, Plugin<BarcodeSchema>>,
);

export default barcodes;

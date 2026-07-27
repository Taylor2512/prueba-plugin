import { renderBarcodePdf } from './pdfRender.js';
import { getPropPanelByBarcodeType } from './propPanel.js';
import { renderBarcodeUi } from './uiRender.js';
import type { BarcodeSchema, BarcodeTypes } from './types.js';
import { BARCODE_TYPES } from './constants.js';
import { createSvgStr } from '../utils.js';
import { Plugin } from '@sisad-pdfme/common';
import { QrCode, Barcode } from 'lucide-react';

const barcodes = BARCODE_TYPES.reduce(
  (acc, type) =>
    Object.assign(acc, {
      [type]: {
        pdf: renderBarcodePdf,
        ui: renderBarcodeUi,
        propPanel: getPropPanelByBarcodeType(type),
        icon: createSvgStr(type == 'qrcode' ? QrCode : Barcode),
      },
    }),
  {} as Record<BarcodeTypes, Plugin<BarcodeSchema>>,
);

export default barcodes;

import { getDynamicTemplate } from '@sisad-pdfme/common';
import type { GenerateProps } from '@sisad-pdfme/common';
import generate from './generate.js';
import { validateRequiredFields } from './helper.js';

export { generate, validateRequiredFields };
export const generatePdf = generate;

export const buildDynamicTemplate = getDynamicTemplate;

export const generatePdfBuffer = async (props: GenerateProps): Promise<ArrayBuffer> => {
  const output = await generate(props);
  return output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength) as ArrayBuffer;
};

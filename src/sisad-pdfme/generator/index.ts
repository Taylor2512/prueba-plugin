import { getDynamicTemplate } from '@sisad-pdfme/common';
import type { GenerateProps } from '@sisad-pdfme/common';
import generate from './generate.js';
import { validateRequiredFields } from './helper.js';
import { createPdfPreflightReport } from './preflight.js';

export { generate, validateRequiredFields, createPdfPreflightReport };
export type {
  PdfPreflightIssue,
  PdfPreflightIssueSeverity,
  PdfPreflightPageReport,
  PdfPreflightReport,
} from './preflight.js';
export const generatePdf = generate;

export const buildDynamicTemplate = getDynamicTemplate;

export const generatePdfWithPreflight = async (props: GenerateProps) => {
  const report = await createPdfPreflightReport(props);
  const pdf = await generate(props);
  return { pdf, report };
};

export const generatePdfBuffer = async (props: GenerateProps): Promise<ArrayBuffer> => {
  const output = await generate(props);
  return output.buffer.slice(output.byteOffset, output.byteOffset + output.byteLength) as ArrayBuffer;
};

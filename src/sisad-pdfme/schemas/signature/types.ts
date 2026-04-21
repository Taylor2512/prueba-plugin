import type { Schema } from '@sisad-pdfme/common';

export interface SignatureSchema extends Schema {
  placeholderText?: string;
  strokeColor?: string;
  borderColor?: string;
  backgroundColor?: string;
}
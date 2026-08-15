import type { TextSchema } from '@sisad-pdfme/schemas/text/types';

export interface MultiVariableTextSchema extends TextSchema {
  text: string;
  variables: string[];
}

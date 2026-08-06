import { createSisadPdfmeConfig } from '@/sisad-pdfme';

export const sisadPdfmeConfig = createSisadPdfmeConfig({
  configVersion: 2,
  runtime: {
    mode: 'designer',
    readonly: false,
  },
  documents: {
    mode: 'multi',
    preserveDocumentSchemaRouting: true,
  },
  persistence: {
    mode: 'host',
    autosave: false,
  },
});

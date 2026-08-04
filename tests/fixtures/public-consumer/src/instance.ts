import { defineSisadPdfmeInstance } from '@/sisad-pdfme';

export const consumerInstance = defineSisadPdfmeInstance({
  id: 'public-consumer',
  revision: 1,
  definition: {
    mode: 'form',
    defaultState: {
      inputs: [{ name: 'initial' }],
    },
  },
});

import { configurePdfjsWorker } from '@/sisad-pdfme/integration';

export async function bootstrapPdfme() {
  await configurePdfjsWorker();
}

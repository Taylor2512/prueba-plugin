// Re-export shim. Logic moved to the core browser module
// (Fase 1 de migración features → sisad-pdfme). Removed in Fase 6.
export {
  createObjectUrl,
  revokeObjectUrls,
} from '@/sisad-pdfme/browser/objectUrls'
export { downloadUrl } from '@/sisad-pdfme/browser/downloads'

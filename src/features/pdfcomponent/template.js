// Re-export shim. Factory moved to core `createDefaultTemplate`
// (Fase 1 de migración features → sisad-pdfme). Removed in Fase 6.
import { createDefaultTemplate } from '@/sisad-pdfme/templates/createDefaultTemplate'

export function createInitialPdfmeTemplate() {
  return createDefaultTemplate()
}

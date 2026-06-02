// Partial re-export shim. Generic runtime helpers moved to core
// `runtime/runtimeModes` (Fase 1). Lab-only constants stay here.
import {
  RUNTIME_MODES,
  DEFAULT_UX_MODES,
  getErrorMessage,
  formatPageStatus,
  resolveInitialUxMode,
} from '@/sisad-pdfme/runtime/runtimeModes'

export const MODES = [...RUNTIME_MODES]
export const UX_MODES = [...DEFAULT_UX_MODES]
// Lab-specific storage key — NOT moved to core (host concern).
export const UX_MODE_STORAGE_KEY = 'sisad-pdfme.lab.ux-mode'

export const isValidUxMode = (mode) => UX_MODES.includes(String(mode || ''))

export { getErrorMessage, formatPageStatus, resolveInitialUxMode }

export const MODES = ['designer', 'form', 'viewer']
export const UX_MODES = ['default', 'canvas-first']
export const UX_MODE_STORAGE_KEY = 'sisad-pdfme.lab.ux-mode'

export const getErrorMessage = (error) =>
  error instanceof Error ? error.message : 'Error inesperado'

export const isValidUxMode = (mode) => UX_MODES.includes(String(mode || ''))

export const resolveInitialUxMode = ({ search = '', storedMode = '', fallback = 'canvas-first' } = {}) => {
  const searchParams = new URLSearchParams(search)
  const modeFromQuery = searchParams.get('ux')
  const candidate = [modeFromQuery, storedMode].find((value) => isValidUxMode(value))
  return candidate || fallback
}

export const formatPageStatus = (pageInfo) => {
  const current = Math.max(1, Number(pageInfo?.currentPage || 1))
  const total = Math.max(1, Number(pageInfo?.totalPages || 1))
  return `Página ${current} / ${total}`
}

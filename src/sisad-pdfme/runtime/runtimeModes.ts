/**
 * Runtime mode + status helpers, extracted from the lab `domain/labState.js`.
 *
 * Only the generic pieces live here. The lab-specific storage key
 * (`sisad-pdfme.lab.ux-mode`) stays in the host and is passed in as a value —
 * it is not a runtime concern.
 */

export const RUNTIME_MODES = ['designer', 'form', 'viewer'] as const;
export type RuntimeMode = (typeof RUNTIME_MODES)[number];

export const DEFAULT_UX_MODES = ['default', 'canvas-first'] as const;

export function isValidRuntimeMode(mode: unknown): mode is RuntimeMode {
  return RUNTIME_MODES.includes(mode as RuntimeMode);
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Error inesperado';
}

export function formatPageStatus(pageInfo?: {
  currentPage?: number;
  totalPages?: number;
}): string {
  const current = Math.max(1, Number(pageInfo?.currentPage || 1));
  const total = Math.max(1, Number(pageInfo?.totalPages || 1));
  return `Página ${current} / ${total}`;
}

export type ResolveInitialUxModeArgs = {
  /** location.search string, e.g. "?ux=canvas-first". */
  search?: string;
  /** Mode previously persisted by the host (storage key is the host's concern). */
  storedMode?: string;
  /** Used when neither query nor stored mode is valid. */
  fallback?: string;
  /** Allowed mode whitelist. Defaults to ['default','canvas-first']. */
  allowedModes?: readonly string[];
};

/**
 * Resolves the initial UX mode from a query string then a stored value,
 * falling back to `fallback`. Generic over `allowedModes` so it is not tied to
 * the lab's two modes.
 */
export function resolveInitialUxMode({
  search = '',
  storedMode = '',
  fallback = 'canvas-first',
  allowedModes = DEFAULT_UX_MODES,
}: ResolveInitialUxModeArgs = {}): string {
  const isValid = (value: unknown) =>
    allowedModes.includes(String(value || ''));

  const modeFromQuery = new URLSearchParams(search).get('ux');
  const candidate = [modeFromQuery, storedMode].find(isValid);
  return candidate || fallback;
}

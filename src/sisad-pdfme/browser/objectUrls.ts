/**
 * Browser object-URL helpers, safe for SSR/test environments.
 *
 * These guard against missing `URL` (e.g. server-side rendering or a test
 * runner without a DOM) so callers don't have to repeat the checks.
 */

const hasUrlApi = (): boolean =>
  typeof URL !== 'undefined' &&
  typeof URL.createObjectURL === 'function';

/**
 * Creates an object URL for the given bytes. Returns an empty string when the
 * URL API is unavailable (SSR/test), so callers can branch on a falsy result.
 */
export function createObjectUrl(bytes: BlobPart, mimeType: string): string {
  if (!hasUrlApi()) return '';
  return URL.createObjectURL(new Blob([bytes], { type: mimeType }));
}

/**
 * Revokes a list of object URLs, skipping null/undefined/empty entries. No-op
 * when the URL API is unavailable.
 */
export function revokeObjectUrls(
  urls: ReadonlyArray<string | null | undefined>,
): void {
  if (!hasUrlApi() || typeof URL.revokeObjectURL !== 'function') return;
  for (const url of urls) {
    if (url) URL.revokeObjectURL(url);
  }
}

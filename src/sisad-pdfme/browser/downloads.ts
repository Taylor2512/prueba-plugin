/**
 * Browser download helpers, safe for SSR/test environments.
 */

import { createObjectUrl } from './objectUrls.js';

const hasDocument = (): boolean => typeof document !== 'undefined';

/**
 * Triggers a download for an existing URL via a synthetic anchor click.
 * No-op when there is no `document` (SSR/test).
 */
export function downloadUrl(url: string, filename: string): void {
  if (!hasDocument() || !url) return;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.rel = 'noopener';
  const style = link as HTMLAnchorElement & { style?: CSSStyleDeclaration };
  if (style.style) style.style.display = 'none';
  if (link instanceof Node) document.body.appendChild(link);
  link.click();
  if (typeof link.remove === 'function') {
    link.remove();
  } else if (link instanceof Node && link.parentNode) {
    link.parentNode.removeChild(link);
  }
}

/**
 * Serializes `data` to pretty JSON, downloads it, and returns the object URL
 * so the caller can revoke it. Returns an empty string when unavailable.
 */
export function downloadJson(data: unknown, filename: string): string {
  const json = JSON.stringify(data, null, 2);
  const url = createObjectUrl(json, 'application/json');
  if (url) downloadUrl(url, filename);
  return url;
}

/**
 * Downloads arbitrary bytes with the given mime type and returns the object
 * URL so the caller can revoke it. Returns an empty string when unavailable.
 */
export function downloadBytes(
  bytes: BlobPart,
  filename: string,
  mimeType: string,
): string {
  const url = createObjectUrl(bytes, mimeType);
  if (url) downloadUrl(url, filename);
  return url;
}

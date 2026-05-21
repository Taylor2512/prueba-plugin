export const FIXED_ISO = '2024-01-01T00:00:00.000Z';
export const FIXED_NOW = Date.parse(FIXED_ISO);

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item';
}

export function stableId(prefix: string, ...parts: Array<string | number | boolean | null | undefined>): string {
  const suffix = parts
    .filter((part) => part !== undefined && part !== null && part !== '')
    .map((part) => slugify(String(part)))
    .join('-');
  return suffix ? `${prefix}-${suffix}` : prefix;
}

export function fixedIso(offsetMs = 0): string {
  return new Date(FIXED_NOW + offsetMs).toISOString();
}

export function fixedMs(offsetMs = 0): number {
  return FIXED_NOW + offsetMs;
}

export function clone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

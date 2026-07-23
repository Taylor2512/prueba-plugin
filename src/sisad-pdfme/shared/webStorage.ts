/**
 * Shared Web Storage helpers used by local-only persistence adapters.
 * Keeps SSR/test fallbacks and JSON parsing behavior consistent.
 */
const createMemoryStorage = (): Storage => {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
    removeItem: (key: string) => {
      values.delete(key);
    },
    clear: () => {
      values.clear();
    },
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    get length() {
      return values.size;
    },
  };
};

export const readJsonStorageValue = <T>(
  storage: Storage,
  key: string,
  fallback: T,
): T => {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const resolveBrowserStorage = (
  preferred: 'session' | 'local',
): Storage => {
  if (preferred === 'session' && typeof sessionStorage !== 'undefined') {
    return sessionStorage;
  }
  if (typeof localStorage !== 'undefined') return localStorage;
  if (typeof sessionStorage !== 'undefined') return sessionStorage;
  return createMemoryStorage();
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const deepMergeProfileConfig = <T extends Record<string, unknown>>(base: T, patch?: Record<string, unknown>): T => {
  if (!isPlainObject(patch)) return { ...base };

  const next = { ...base } as Record<string, unknown>;

  Object.entries(patch).forEach(([key, value]) => {
    const current = next[key];

    if (isPlainObject(current) && isPlainObject(value)) {
      next[key] = deepMergeProfileConfig(current, value);
      return;
    }

    if (Array.isArray(value)) {
      next[key] = value.slice();
      return;
    }

    next[key] = value;
  });

  return next as T;
};

export const createProfiledConfig = <
  TBase extends Record<string, unknown>,
  TProfiles extends Record<string, Record<string, unknown>>,
>(
  base: TBase,
  profiles: TProfiles,
  profile?: keyof TProfiles | string | null,
  overrides: Record<string, unknown> = {},
): TBase => {
  const baseClone = structuredClone(base);
  const profileClone = structuredClone(profile ? profiles[profile as keyof TProfiles] || {} : {});

  return deepMergeProfileConfig(deepMergeProfileConfig(baseClone, profileClone), overrides);
};

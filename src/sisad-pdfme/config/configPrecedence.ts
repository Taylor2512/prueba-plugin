/**
 * Single source of truth for effective configuration precedence.
 * Undefined means "not specified"; false, 0 and null are valid overrides.
 */
export type ConfigPrecedenceLayer =
  | 'hardSafety'
  | 'surface'
  | 'instance'
  | 'template'
  | 'schema'
  | 'default';

export const CONFIG_PRECEDENCE: readonly ConfigPrecedenceLayer[] = [
  'hardSafety',
  'surface',
  'instance',
  'template',
  'schema',
  'default',
] as const;

export type ConfigPrecedenceLayers<T> = Partial<Record<ConfigPrecedenceLayer, T | undefined>>;

export type ResolvedConfigValue<T> = {
  value: T;
  origin: ConfigPrecedenceLayer;
};

export const resolveConfigValue = <T>(
  layers: ConfigPrecedenceLayers<T>,
  fallback: T,
): ResolvedConfigValue<T> => {
  for (const origin of CONFIG_PRECEDENCE) {
    const value = layers[origin];
    if (value !== undefined) return { value, origin };
  }
  return { value: fallback, origin: 'default' };
};

export const resolveConfigRecord = <T extends Record<string, unknown>>(
  layers: Partial<Record<ConfigPrecedenceLayer, Partial<T> | undefined>>,
  defaults: T,
): { value: T; origins: Record<keyof T, ConfigPrecedenceLayer> } => {
  const keys = new Set<keyof T>(Object.keys(defaults) as Array<keyof T>);
  CONFIG_PRECEDENCE.forEach((origin) => {
    Object.keys(layers[origin] || {}).forEach((key) => keys.add(key as keyof T));
  });
  const value = {} as T;
  const origins = {} as Record<keyof T, ConfigPrecedenceLayer>;
  keys.forEach((key) => {
    const resolved = resolveConfigValue(
      CONFIG_PRECEDENCE.reduce<ConfigPrecedenceLayers<unknown>>((acc, origin) => {
        acc[origin] = layers[origin]?.[key];
        return acc;
      }, {}),
      defaults[key],
    );
    value[key] = resolved.value as T[typeof key];
    origins[key] = resolved.origin;
  });
  return { value, origins };
};

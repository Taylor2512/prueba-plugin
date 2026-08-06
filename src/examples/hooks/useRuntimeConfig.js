import { useMemo } from 'react';

import { createRuntimeConfig } from '../config/runtimeConfig.js';

export function useRuntimeConfig(profile) {
  return useMemo(() => createRuntimeConfig(profile), [profile]);
}

import { useMemo } from 'react';

import { createRuntimeConfig } from '../config/runtimeConfig.js';

export function useExampleRuntimeConfig(profile) {
  return useMemo(() => createRuntimeConfig(profile), [profile]);
}

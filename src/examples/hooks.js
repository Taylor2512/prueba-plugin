/**
 * Hooks compartidos por las páginas de ejemplo.
 */
import { useCallback, useMemo, useRef, useState } from 'react';

import { createRuntimeConfig } from './catalog.js';

export function useRuntimeConfig(profile) {
  return useMemo(() => createRuntimeConfig(profile), [profile]);
}

export function useEventLog(maxEntries = 40) {
  const [events, setEvents] = useState([]);

  const record = useCallback((name, detail) => {
    setEvents((current) => [
      ...current.slice(-Math.max(0, maxEntries - 1)),
      {
        id: `${Date.now()}-${current.length}`,
        name,
        detail,
        at: new Date().toLocaleTimeString('es'),
      },
    ]);
  }, [maxEntries]);

  const clear = useCallback(() => setEvents([]), []);

  return { events, record, clear };
}

export function useController() {
  const controllerRef = useRef(null);

  const handleControllerReady = useCallback((controller) => {
    controllerRef.current = controller;
  }, []);

  const getController = useCallback(() => controllerRef.current, []);

  return { controllerRef, handleControllerReady, getController };
}

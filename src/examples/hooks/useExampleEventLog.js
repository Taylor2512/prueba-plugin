import { useCallback, useState } from 'react';

export function useExampleEventLog(maxEntries = 40) {
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

  return {
    events,
    record,
    clear,
  };
}

import { useCallback, useRef } from 'react';

export function useExampleController() {
  const controllerRef = useRef(null);

  const handleControllerReady = useCallback((controller) => {
    controllerRef.current = controller;
  }, []);

  const getController = useCallback(() => controllerRef.current, []);

  return {
    controllerRef,
    handleControllerReady,
    getController,
  };
}

import { useCallback, useRef } from 'react';

const usePaperRefRegistry = () => {
  const paperRefs = useRef<HTMLDivElement[]>([]);

  const registerPaperRef = useCallback((paperIndex: number, element: HTMLDivElement | null) => {
    if (element) {
      paperRefs.current[paperIndex] = element;
      return;
    }
    delete paperRefs.current[paperIndex];
  }, []);

  return {
    paperRefs,
    registerPaperRef,
  };
};

export default usePaperRefRegistry;

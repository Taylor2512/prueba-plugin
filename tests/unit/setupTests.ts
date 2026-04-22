import '@testing-library/jest-dom/vitest';

if (typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
  const originalGetComputedStyle = window.getComputedStyle.bind(window);
  window.getComputedStyle = ((element: Element, pseudoElt?: string) => {
    if (pseudoElt) {
      return originalGetComputedStyle(element);
    }
    return originalGetComputedStyle(element, pseudoElt);
  }) as typeof window.getComputedStyle;
}

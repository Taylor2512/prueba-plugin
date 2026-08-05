import { useCallback, useEffect, useRef, useState } from 'react';

export type SidebarPresentation = 'docked' | 'overlay';

export type UseSidebarCollapseOptions = {
  /** Clave de localStorage donde se recuerda la preferencia del usuario. */
  storageKey: string;
  /** `overlay` fuerza el panel colapsado; `docked` respeta la preferencia. */
  presentation: SidebarPresentation;
  /** Tecla que alterna el panel junto a Ctrl/Cmd (por ejemplo `b`). */
  shortcutKey?: string;
  /** Estado usado cuando no hay preferencia guardada. */
  defaultExpanded?: boolean;
};

const isBrowser = () => typeof window !== 'undefined';

const readStoredPreference = (storageKey: string): boolean | null => {
  if (!isBrowser()) return null;
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === 'true') return true;
    if (stored === 'false') return false;
    return null;
  } catch {
    return null;
  }
};

const writeStoredPreference = (storageKey: string, expanded: boolean) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(storageKey, expanded ? 'true' : 'false');
  } catch {
    // localStorage puede estar bloqueado (modo privado, iframe sin permisos).
  }
};

/**
 * El atajo no debe dispararse mientras el usuario escribe en un campo o en el
 * canvas editable, donde Ctrl/Cmd+B tiene su propio significado.
 */
const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
};

/**
 * Estado de colapso de un sidebar con preferencia persistida y atajo de teclado.
 *
 * En `overlay` el panel siempre arranca colapsado para no tapar el canvas, pero
 * la preferencia del usuario se conserva y vuelve a aplicarse al recuperar el
 * modo `docked`.
 */
export const useSidebarCollapse = ({
  storageKey,
  presentation,
  shortcutKey,
  defaultExpanded = true,
}: UseSidebarCollapseOptions) => {
  const [expanded, setExpanded] = useState(() => {
    if (presentation === 'overlay') return false;
    return readStoredPreference(storageKey) ?? defaultExpanded;
  });
  const presentationRef = useRef(presentation);

  useEffect(() => {
    presentationRef.current = presentation;
  }, [presentation]);

  useEffect(() => {
    if (presentation === 'overlay') {
      setExpanded(false);
      return;
    }
    setExpanded(readStoredPreference(storageKey) ?? defaultExpanded);
  }, [defaultExpanded, presentation, storageKey]);

  const applyExpanded = useCallback(
    (next: boolean) => {
      setExpanded(next);
      // El colapso automático de `overlay` no debe pisar lo que el usuario
      // eligió mientras trabajaba con el panel acoplado.
      if (presentationRef.current === 'docked') {
        writeStoredPreference(storageKey, next);
      }
    },
    [storageKey],
  );

  const toggle = useCallback(() => {
    setExpanded((prev) => {
      const next = !prev;
      if (presentationRef.current === 'docked') {
        writeStoredPreference(storageKey, next);
      }
      return next;
    });
  }, [storageKey]);

  useEffect(() => {
    if (!shortcutKey || !isBrowser()) return;
    const normalizedShortcut = shortcutKey.toLowerCase();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) return;
      if (event.altKey || event.shiftKey) return;
      if (event.key.toLowerCase() !== normalizedShortcut) return;
      if (isTypingTarget(event.target)) return;
      event.preventDefault();
      toggle();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcutKey, toggle]);

  return { expanded, setExpanded: applyExpanded, toggle } as const;
};

/**
 * Etiqueta del atajo adaptada a la plataforma, para tooltips y `aria-keyshortcuts`.
 */
export const resolveShortcutHint = (shortcutKey?: string): string => {
  if (!shortcutKey) return '';
  const isApple =
    isBrowser() && /mac|iphone|ipad|ipod/i.test(window.navigator.platform || window.navigator.userAgent || '');
  return `${isApple ? '⌘' : 'Ctrl+'}${shortcutKey.toUpperCase()}`;
};

export default useSidebarCollapse;

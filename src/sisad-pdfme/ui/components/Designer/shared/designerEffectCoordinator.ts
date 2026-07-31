/**
 * Coordinador de efectos del Designer.
 *
 * Centraliza los efectos que hoy están repartidos: bloqueo de scroll del body,
 * foco, anuncios accesibles y limpieza de suscripciones. Sin un dueño único
 * aparecen dos fallos recurrentes:
 *
 * - **body bloqueado para siempre**: dos superficies bloquean el scroll y la
 *   primera en cerrarse lo desbloquea, o ninguna lo hace al desmontar;
 * - **foco perdido**: al cerrar un modal el foco se queda en el `body` en vez
 *   de volver al control que lo abrió.
 *
 * Por eso el bloqueo es por token con refcount y el foco es una pila.
 * `dispose()` libera todo, pase lo que pase: es la garantía de que ningún
 * efecto sobrevive al desmontaje.
 *
 * No decide *cuándo* ocurre un efecto —eso es del reducer de interacción— solo
 * lo ejecuta y lo revierte.
 */

export type DesignerEffectCoordinatorOptions = {
  /** Inyectable para pruebas y para hosts con múltiples documentos. */
  documentRef?: Document;
};

export type DesignerEffectCoordinator = {
  lockBodyScroll(token: string): void;
  unlockBodyScroll(token: string): void;
  isBodyLocked(): boolean;
  activeLockTokens(): string[];
  captureFocus(): void;
  restoreFocus(): void;
  focusDepth(): number;
  announce(message: string, politeness?: 'polite' | 'assertive'): void;
  register(cleanup: () => void): () => void;
  pendingCleanups(): number;
  dispose(): void;
};

const ANNOUNCER_ATTRIBUTE = 'data-sisad-pdfme-announcer';

export const createDesignerEffectCoordinator = (
  options: DesignerEffectCoordinatorOptions = {},
): DesignerEffectCoordinator => {
  const doc = options.documentRef ?? (typeof document !== 'undefined' ? document : undefined);

  /** Tokens vivos de bloqueo. Set, no contador: desbloquear dos veces es idempotente. */
  const lockTokens = new Set<string>();
  /** Pila de foco: soporta modales anidados. */
  const focusStack: Array<Element | null> = [];
  const cleanups = new Set<() => void>();
  /** Valor original del `overflow` para restaurarlo tal cual estaba. */
  let previousOverflow: string | null = null;
  let announcer: HTMLElement | null = null;

  const applyBodyLock = () => {
    if (!doc?.body) return;
    if (lockTokens.size > 0) {
      if (previousOverflow === null) {
        previousOverflow = doc.body.style.overflow;
        doc.body.style.overflow = 'hidden';
      }
      return;
    }
    if (previousOverflow !== null) {
      doc.body.style.overflow = previousOverflow;
      previousOverflow = null;
    }
  };

  const ensureAnnouncer = (): HTMLElement | null => {
    if (!doc?.body) return null;
    if (announcer?.isConnected) return announcer;
    announcer = doc.createElement('div');
    announcer.setAttribute(ANNOUNCER_ATTRIBUTE, 'true');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    // Fuera de pantalla pero accesible a lectores: `display:none` no se anuncia.
    announcer.style.cssText =
      'position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0';
    doc.body.appendChild(announcer);
    return announcer;
  };

  return {
    lockBodyScroll(token) {
      lockTokens.add(token);
      applyBodyLock();
    },

    unlockBodyScroll(token) {
      lockTokens.delete(token);
      applyBodyLock();
    },

    isBodyLocked: () => lockTokens.size > 0,
    activeLockTokens: () => [...lockTokens],

    captureFocus() {
      focusStack.push(doc?.activeElement ?? null);
    },

    restoreFocus() {
      const target = focusStack.pop();
      if (!target) return;
      // Un elemento desconectado ya no puede recibir foco: devolverlo al body
      // sería peor que dejarlo donde está.
      if (!target.isConnected) return;
      (target as HTMLElement).focus?.();
    },

    focusDepth: () => focusStack.length,

    announce(message, politeness = 'polite') {
      const node = ensureAnnouncer();
      if (!node) return;
      node.setAttribute('aria-live', politeness);
      // Reasignar el mismo texto no dispara anuncio; se limpia primero.
      node.textContent = '';
      node.textContent = message;
    },

    register(cleanup) {
      cleanups.add(cleanup);
      return () => {
        cleanups.delete(cleanup);
      };
    },

    pendingCleanups: () => cleanups.size,

    dispose() {
      cleanups.forEach((cleanup) => {
        try {
          cleanup();
        } catch {
          // Una limpieza fallida no puede impedir las demás ni dejar el body
          // bloqueado: por eso se traga aquí y se sigue.
        }
      });
      cleanups.clear();

      lockTokens.clear();
      applyBodyLock();

      focusStack.length = 0;

      if (announcer?.isConnected) announcer.remove();
      announcer = null;
    },
  };
};

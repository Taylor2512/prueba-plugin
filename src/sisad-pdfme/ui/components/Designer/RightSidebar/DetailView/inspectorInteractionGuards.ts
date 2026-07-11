/**
 * inspectorInteractionGuards — utilidades para aislar interacción del inspector.
 *
 * Marca nodos del sidebar/modal como interactivos y detiene eventos que no deben
 * llegar al canvas. Es clave para que Selecto, Moveable y drag/drop no reaccionen
 * cuando el usuario edita controles del inspector.
 */
/** Atributo público que identifica superficies interactivas del inspector. */
export const INSPECTOR_INTERACTIVE_ATTR = 'data-sisad-inspector-interactive';

/** Eventos que deben detenerse para no llegar al canvas. */
const POINTER_EVENT_NAMES = ['pointerdown', 'mousedown', 'click', 'dblclick', 'dragstart', 'drop', 'contextmenu'];

/**
 * Marca un elemento como interactivo e instala guards de propagación.
 */
export const markInspectorInteractive = (element: HTMLElement | null | undefined) => {
  if (!element) return;
  if (element.getAttribute('data-sisad-inspector-interactive-bound') === 'true') return;
  element.setAttribute(INSPECTOR_INTERACTIVE_ATTR, 'true');
  element.setAttribute('data-selecto-ignore', 'true');
  element.setAttribute('data-moveable-ignore', 'true');
  element.setAttribute('data-canvas-drop-ignore', 'true');
  element.setAttribute('data-sisad-inspector-interactive-bound', 'true');

  const stop = (event: Event) => {
    event.stopPropagation();
  };

  POINTER_EVENT_NAMES.forEach((eventName) => {
    element.addEventListener(eventName, stop);
  });
};

/**
 * Determina si un target pertenece a una superficie interactiva del inspector.
 */
export const isInspectorInteractiveTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(`[${INSPECTOR_INTERACTIVE_ATTR}="true"]`) || target.matches(`[${INSPECTOR_INTERACTIVE_ATTR}="true"]`));
};

/** Detiene propagación de eventos originados en controles del inspector. */
export const stopInspectorPointerEvent = (event: { stopPropagation: () => void }) => {
  event.stopPropagation();
};

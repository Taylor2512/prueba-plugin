export const INSPECTOR_INTERACTIVE_ATTR = 'data-sisad-inspector-interactive';

const POINTER_EVENT_NAMES = ['pointerdown', 'mousedown', 'click', 'dblclick', 'dragstart', 'drop', 'contextmenu'];

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

export const isInspectorInteractiveTarget = (target: EventTarget | null | undefined): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest(`[${INSPECTOR_INTERACTIVE_ATTR}="true"]`) || target.matches(`[${INSPECTOR_INTERACTIVE_ATTR}="true"]`));
};

export const stopInspectorPointerEvent = (event: { stopPropagation: () => void }) => {
  event.stopPropagation();
};

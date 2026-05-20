const PASSIVE_EVENT_TYPES = new Set(['touchstart', 'touchmove', 'touchend', 'touchcancel', 'wheel']);

let passiveTouchListenersInstalled = false;

const isDesktopLikeEnvironment = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (navigator.maxTouchPoints > 0) return false;
  if (typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches) return false;
  return true;
};

export const installPassiveTouchListenerGuard = () => {
  if (passiveTouchListenersInstalled || !isDesktopLikeEnvironment() || typeof EventTarget === 'undefined') {
    return;
  }

  const originalAddEventListener = EventTarget.prototype.addEventListener;

  EventTarget.prototype.addEventListener = function addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (PASSIVE_EVENT_TYPES.has(type)) {
      if (typeof options === 'boolean') {
        options = { capture: options, passive: true };
      } else if (options && options.passive !== true) {
        options = { ...options, passive: true };
      } else if (!options) {
        options = { passive: true };
      }
    }

    return originalAddEventListener.call(this, type, listener, options as AddEventListenerOptions | boolean | undefined);
  };

  passiveTouchListenersInstalled = true;
};
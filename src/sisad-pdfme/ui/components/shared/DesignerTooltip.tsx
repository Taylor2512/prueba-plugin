/**
 * Tooltip controlada del Designer.
 *
 * Sustituye al atributo `title` nativo, que tiene tres problemas para chrome de
 * producto: el navegador decide el retardo y la posición, no es accesible por
 * teclado de forma consistente, y no se puede estilar ni truncar.
 *
 * Reglas que implementa:
 *
 * - se muestra con hover **y** con foco de teclado;
 * - `Escape` la cierra sin cerrar la superficie que la contiene;
 * - el disparador queda descrito por `aria-describedby`, así que el lector de
 *   pantalla anuncia el texto sin depender de `title`;
 * - si el hijo ya trae `title`, se elimina: dos tooltips sobre el mismo control
 *   es peor que ninguna.
 *
 * No usa `setTimeout` para el ciclo de vida — solo para el retardo de
 * aparición, que es presentación, no coordinación.
 */
import React, { cloneElement, isValidElement, useCallback, useEffect, useId, useRef, useState } from 'react';

export type DesignerTooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export type DesignerTooltipProps = {
  /** Texto a mostrar. Vacío o ausente ⇒ no se renderiza tooltip. */
  label?: string | null;
  placement?: DesignerTooltipPlacement;
  /** Retardo de aparición en ms. 0 muestra de inmediato. */
  delay?: number;
  /** Control externo opcional; sin él la tooltip se gobierna sola. */
  open?: boolean;
  children: React.ReactElement;
};

const PLACEMENT_CLASS: Record<DesignerTooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-1',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1',
  left: 'right-full top-1/2 -translate-y-1/2 mr-1',
  right: 'left-full top-1/2 -translate-y-1/2 ml-1',
};


/**
 * Añade los handlers de la tooltip al disparador.
 *
 * Vive fuera del componente a propósito: `cloneElement` dentro del cuerpo de
 * render hace que el linter lo trate como acceso a refs durante el render.
 * Los handlers originales del hijo se preservan y se ejecutan primero.
 */
const decorateTrigger = (
  child: React.ReactElement,
  options: { describedBy?: string; show: (immediate?: boolean) => void; hide: () => void },
): React.ReactElement => {
  const childProps = child.props as Record<string, unknown>;
  const chain = <E,>(original: unknown, next: () => void) => (event: E) => {
    (original as ((e: E) => void) | undefined)?.(event);
    next();
  };

  return cloneElement(child, {
    // Evita la tooltip nativa duplicada sobre el mismo control.
    title: undefined,
    'aria-describedby': options.describedBy,
    onMouseEnter: chain<React.MouseEvent>(childProps.onMouseEnter, () => options.show()),
    onMouseLeave: chain<React.MouseEvent>(childProps.onMouseLeave, options.hide),
    // El foco muestra de inmediato: quien navega con teclado no debe esperar.
    onFocus: chain<React.FocusEvent>(childProps.onFocus, () => options.show(true)),
    onBlur: chain<React.FocusEvent>(childProps.onBlur, options.hide),
  } as Record<string, unknown>);
};

/* eslint-disable react-hooks/refs */

export const DesignerTooltip = ({
  label,
  placement = 'top',
  delay = 250,
  open,
  children,
}: DesignerTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const show = useCallback(
    (immediate = false) => {
      clearTimer();
      if (immediate || delay <= 0) {
        setVisible(true);
        return;
      }
      timerRef.current = setTimeout(() => setVisible(true), delay);
    },
    [clearTimer, delay],
  );

  const hide = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  // El timer nunca puede sobrevivir al desmontaje.
  useEffect(() => clearTimer, [clearTimer]);

  useEffect(() => {
    if (!visible) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      // `stopPropagation` no: Escape debe poder cerrar también la superficie si
      // la tooltip ya estaba cerrada. Aquí solo se cierra a sí misma.
      if (event.key === 'Escape') hide();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [hide, visible]);

  if (!isValidElement(children)) return children ?? null;
  const text = typeof label === 'string' ? label.trim() : '';
  if (!text) return children;

  const isOpen = open ?? visible;
 
  const trigger = decorateTrigger(children, {
    describedBy: isOpen ? tooltipId : undefined,
    show,
    hide,
  });
  /* eslint-enable react-hooks/refs */

  return (
    <span className="relative inline-flex" data-designer-tooltip-anchor="true">
      {trigger}
      {isOpen ? (
        <span
          id={tooltipId}
          role="tooltip"
          data-testid="designer-tooltip"
          data-placement={placement}
          className={`pointer-events-none absolute z-[60] whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-md ${PLACEMENT_CLASS[placement]}`}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
};

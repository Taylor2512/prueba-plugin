import { useEffect, useMemo, useRef } from 'react';
import type { PropPanelWidgetProps } from '@sisad-pdfme/common';
import { markInspectorInteractive } from '@sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/inspectorInteractionGuards';

/**
 * Props del wrapper para widgets imperativos heredados de plugins.
 *
 * `WidgetRenderer` adapta widgets que esperan recibir un `rootElement`
 * real donde pintar manualmente su UI, manteniendo el contrato de
 * plugins no migrados a React declarativo.
 */
type Props = PropPanelWidgetProps & {
  /**
   * Widget imperativo del plugin.
   *
   * El widget recibe todas las props del PropPanel más `rootElement` para
   * montar contenido dentro del contenedor administrado por este wrapper.
   */
  widget: (props: PropPanelWidgetProps) => void;
};

/**
 * Renderizador puente para widgets imperativos del prop panel.
 *
 * Responsabilidades:
 *
 * - crear un contenedor DOM estable;
 * - marcar el contenedor como interacción del inspector para que Selecto,
 *   Moveable y el canvas ignoren sus eventos;
 * - limpiar el contenido antes de cada render imperativo;
 * - invocar el widget con `rootElement`;
 * - limpiar el nodo al desmontar o re-renderizar.
 *
 * Restricciones:
 *
 * - no debe interpretar el contenido del widget;
 * - no debe persistir cambios por sí mismo;
 * - no debe acoplarse a plugins específicos;
 * - no debe tocar selección ni geometría del canvas.
 */
const WidgetRenderer = (props: Props) => {
  const { widget, ...otherProps } = props;

  /** Contenedor DOM entregado al widget imperativo. */
  const ref = useRef<HTMLDivElement>(null);
  const latestPropsRef = useRef(otherProps);
  const activeSchema = (otherProps as { activeSchema?: { id?: string; type?: string } }).activeSchema;
  const renderSignature = useMemo(() => {
    try {
      return JSON.stringify({
        value: otherProps.value,
        readOnly: otherProps.readOnly,
        disabled: otherProps.disabled,
        hidden: otherProps.hidden,
        schemaId: activeSchema?.id || null,
        schemaType: activeSchema?.type || null,
      });
    } catch {
      // Defensive: if structured cloning fails for any prop, fall back to
      // a minimal signature to avoid breaking imperative widgets.
      return String(activeSchema?.id || '') + '|' + String(activeSchema?.type || '');
    }
  }, [activeSchema?.id, activeSchema?.type, otherProps.disabled, otherProps.hidden, otherProps.readOnly, otherProps.value]);
  useEffect(() => {
    latestPropsRef.current = otherProps;
  }, [otherProps]);

  /**
   * Limpia el contenido imperativo del contenedor.
   *
   * Se usa antes de montar el widget y durante cleanup para evitar nodos
   * duplicados, listeners obsoletos o restos visuales entre renders.
   */
  const clearRoot = () => {
    if (ref.current) {
      ref.current.innerHTML = '';
    }
  };

  /**
   * Monta el widget imperativo en cada render.
   *
   * No se declara dependency array para preservar el comportamiento original:
   * el widget se reconstruye con las props más recientes en cada render.
   */
  useEffect(() => {
    if (ref.current) {
      markInspectorInteractive(ref.current);
      clearRoot();
      widget({ ...latestPropsRef.current, rootElement: ref.current });
    }

    return () => {
      clearRoot();
    };
  }, [renderSignature, widget]);

  return <div ref={ref} className="min-w-0" />;
};

export default WidgetRenderer;

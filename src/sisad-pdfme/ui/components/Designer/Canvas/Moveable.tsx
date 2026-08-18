/**
 * Moveable — adapter aislado sobre react-moveable.
 *
 * Centraliza configuración de drag/resize/rotate, guidelines, bounds y color
 * de controles, evitando que Canvas dependa directamente de detalles visuales
 * o quirks del paquete externo.
 */
import { useEffect, forwardRef, Ref, useId } from 'react';
import MoveableComponent, {
  type OnClick,
  type OnDrag,
  type OnDragEnd,
  type OnDragGroup,
  type OnDragGroupEnd,
  type OnDragGroupStart,
  type OnDragStart,
  type OnResize,
  type OnResizeEnd,
  type OnResizeGroup,
  type OnResizeGroupEnd,
  type OnResizeStart,
  type OnRotate,
  type OnRotateEnd,
  type OnRotateGroup,
  type OnRotateGroupEnd,
  type OnRotateGroupStart,
  type OnRotateStart,
} from 'react-moveable';
import { resolveFirstClassSelector } from '@sisad-pdfme/ui/components/Designer/shared/className';
import { installPassiveTouchListenerGuard } from '@sisad-pdfme/ui/components/Designer/shared/passiveTouchListeners';

installPassiveTouchListenerGuard();

/**
 * Props del adapter Moveable.
 *
 * Mantiene tipados todos los callbacks usados por Canvas para drag, resize,
 * rotate, operaciones grupales y click sobre controles.
 */
type Props = {
  target: HTMLElement[];
  bounds: { left: number; top: number; bottom: number; right: number };
  horizontalGuidelines: number[];
  verticalGuidelines: number[];
  keepRatio: boolean;
  rotatable: boolean;
  onDrag: (e: OnDrag) => void;
  onDragEnd: (e: OnDragEnd) => void;
  onDragGroupEnd: (e: OnDragGroupEnd) => void;
  onDragStart?: (e: OnDragStart) => void;
  onRotate: (e: OnRotate) => void;
  onRotateStart?: (e: OnRotateStart) => void;
  onRotateEnd: (e: OnRotateEnd) => void;
  onRotateGroupEnd: (e: OnRotateGroupEnd) => void;
  onResize: (e: OnResize) => void;
  onResizeStart?: (e: OnResizeStart) => void;
  onResizeEnd: (e: OnResizeEnd) => void;
  onResizeGroupEnd: (e: OnResizeGroupEnd) => void;
  onClick: (e: OnClick) => void;
  className?: string;
  useDefaultStyles?: boolean;
  moveableColor?: string;
  zoom?: number;
};

/**
 * Clase base usada para encontrar y tematizar los controles de Moveable.
 */
const baseClassName = 'sisad-pdfme-moveable';

/**
 * Presentación de los controles de Moveable.
 *
 * Vivía en `sisad-pdfme.css` colgando de
 * `.sisad-pdfme-designer-canvas [data-canvas-page='true'] .moveable-control-box`,
 * un selector que no podía casar: este adapter monta el control box en
 * `document.body` vía `rootContainer`, fuera del canvas. `className` sí aterriza
 * en el propio `.moveable-control-box`, así que las variantes arbitrarias
 * alcanzan línea, control, origen y línea de rotación desde el nodo correcto.
 */
const MOVEABLE_CONTROL_CLASSES = [
  'z-[12]',
  '[--moveable-color:var(--color-info)]',
  '[&_.moveable-line]:bg-[var(--moveable-color)]',
  '[&_.moveable-line]:opacity-95',
  '[&_.moveable-control]:w-2',
  '[&_.moveable-control]:h-2',
  '[&_.moveable-control]:rounded-[62.4375rem]',
  '[&_.moveable-control]:border',
  '[&_.moveable-control]:border-solid',
  '[&_.moveable-control]:border-[var(--color-white)]',
  '[&_.moveable-control]:bg-[var(--moveable-color)]',
  '[&_.moveable-control]:shadow-[0_0_0_1px_var(--color-bg-elevated),0_1px_0.25rem_var(--color-gray-900-10)]',
  '[&_.moveable-origin]:w-[0.4375rem]',
  '[&_.moveable-origin]:h-[0.4375rem]',
  '[&_.moveable-origin]:rounded-[62.4375rem]',
  '[&_.moveable-origin]:border',
  '[&_.moveable-origin]:border-solid',
  '[&_.moveable-origin]:border-[var(--color-white)]',
  '[&_.moveable-origin]:bg-[var(--color-warning)]',
  '[&_.moveable-rotation-line]:border-[var(--moveable-color)]',
  '[&_.moveable-rotation-line]:opacity-90',
].join(' ');

/**
 * Adapter de Moveable con configuración SISAD PDFME.
 */
const Moveable = (props: Props, ref: Ref<MoveableComponent>) => {
  const instanceId = useId();
  const resolvedClassName = props.className || `${baseClassName}-${instanceId.replace(/:/g, '-')}`;
  const styleClassSelector = resolveFirstClassSelector(resolvedClassName, baseClassName);
  // El host que pide `useDefaultStyles: false` renuncia también a la
  // presentación de los controles, igual que ocurría con la hoja de estilos.
  const controlBoxClassName =
    props.useDefaultStyles === false
      ? resolvedClassName
      : `${resolvedClassName} ${MOVEABLE_CONTROL_CLASSES}`;

  /**
   * Aplica el color de controles Moveable mediante CSS variables en el nodo raíz.
   */
  useEffect(() => {
    if (props.useDefaultStyles === false) return;
    if (!styleClassSelector) return;
    const containerElement = document.querySelector(`.${styleClassSelector}`);
    const moveableLines = document.querySelectorAll(`.${styleClassSelector} .moveable-line`);
    const color = props.moveableColor || 'var(--ant-color-primary, #1677ff)';
    if (containerElement instanceof HTMLElement) {
      containerElement.style.setProperty('--moveable-color', color);
      moveableLines.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.style.setProperty('--moveable-color', color);
        }
      });
    }
  }, [props.moveableColor, props.target, props.useDefaultStyles, styleClassSelector]);

  return (
    <MoveableComponent
      className={controlBoxClassName}
      rootContainer={typeof document === 'undefined' ? undefined : document.body}
      snappable
      draggable
      preventDefault={false}
      rotatable={props.rotatable}
      resizable
      throttleDrag={1}
      throttleRotate={1}
      throttleResize={1}
      ref={ref}
      target={props.target}
      bounds={props.bounds}
      zoom={props.zoom ?? 1}
      horizontalGuidelines={props.horizontalGuidelines}
      verticalGuidelines={props.verticalGuidelines}
      keepRatio={props.keepRatio}
      onRotate={props.onRotate}
      onRotateStart={props.onRotateStart}
      onRotateEnd={props.onRotateEnd}
      onRotateGroupStart={({ events }: OnRotateGroupStart) => {
        events.forEach((event) => props.onRotateStart?.(event));
      }}
      onRotateGroup={({ events }: OnRotateGroup) => {
        events.forEach(props.onRotate);
      }}
      onRotateGroupEnd={props.onRotateGroupEnd}
      onDrag={props.onDrag}
      onDragStart={props.onDragStart}
      onDragGroupStart={({ events }: OnDragGroupStart) => {
        events.forEach((event) => props.onDragStart?.(event));
      }}
      onDragGroup={({ events }: OnDragGroup) => {
        events.forEach(props.onDrag);
      }}
      onDragEnd={props.onDragEnd}
      onDragGroupEnd={props.onDragGroupEnd}
      onResize={props.onResize}
      onResizeStart={props.onResizeStart}
      onResizeGroup={({ events }: OnResizeGroup) => {
        events.forEach(props.onResize);
      }}
      onResizeEnd={props.onResizeEnd}
      onResizeGroupEnd={props.onResizeGroupEnd}
      onClick={props.onClick}
    />
  );
};

export default forwardRef<MoveableComponent, Props>(Moveable);

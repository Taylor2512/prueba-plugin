/**
 * Selecto — adapter aislado sobre react-selecto.
 *
 * Centraliza selección por click/región, contenedores de drag, límites y estilo
 * del rectángulo de selección. Canvas decide cuándo se puede iniciar selección;
 * este wrapper solo configura y propaga eventos.
 */
import { useEffect } from 'react';
import SelectoComponent, {
  OnSelect as SelectoOnSelect,
  OnDragStart as SelectoOnDragStart,
} from 'react-selecto';
import type { OnDragStart as GestoOnDragStart } from 'gesto';
import { SELECTABLE_CLASSNAME } from '../../../constants.js';
import { theme } from 'antd';
import { rectToPointArea } from '../shared/coordinateMath.js';
import { resolveFirstClassSelector } from '../shared/className.js';
import { installPassiveTouchListenerGuard } from '../shared/passiveTouchListeners.js';
import { isDesignerInteractionExcluded } from '../shared/interactionExclusions.js';

installPassiveTouchListenerGuard();

/**
 * Área de puntos usada por Selecto para hit testing geométrico.
 */
type SelectoPointArea = {
  pos1: number[];
  pos2: number[];
  pos3: number[];
  pos4: number[];
};

/**
 * Props del adapter Selecto.
 */
type Props = {
  container: HTMLElement | null;
  rootContainer?: HTMLElement | null;
  dragContainer?: HTMLElement | Window | Element | Array<HTMLElement | Window | Element> | string | null;
  boundContainer?: HTMLElement | string | boolean | null;
  checkInput?: boolean;
  dragCondition?: (e: GestoOnDragStart) => boolean;
  continueSelect: boolean;
  onDragStart: (e: SelectoOnDragStart) => void;
  onSelect: (e: SelectoOnSelect) => void;
  className?: string;
  useDefaultStyles?: boolean;
  getElementRect?: (element: HTMLElement) => SelectoPointArea;
  selectionStyle?: {
    backgroundColor?: string;
    borderColor?: string;
    opacity?: number;
  };
};

/**
 * Clase base del rectángulo de selección.
 */
const defaultClassName = 'sisad-pdfme-selecto';

/**
 * Normaliza dragContainer aceptando Window, Element, arrays o fallback local.
 */
const normalizeDragContainer = (
  container: Props['dragContainer'],
  fallback: HTMLElement | null,
): string | Element | Window | Element[] | null => {
  if (!Array.isArray(container)) {
    return container ?? fallback;
  }

  const windowContainer = container.find((item): item is Window => typeof Window !== 'undefined' && item instanceof Window);
  if (windowContainer) return windowContainer;

  const elementContainers = container.filter((item): item is Element => item instanceof Element);
  return elementContainers.length > 0 ? elementContainers : fallback;
};

/**
 * Renderiza Selecto configurado para schemas del canvas.
 */
const Selecto = (props: Props) => {
  const { token } = theme.useToken();
  const className = props.className || defaultClassName;
  const styleClassSelector = resolveFirstClassSelector(className, defaultClassName);
  const dragContainer = normalizeDragContainer(props.dragContainer, props.container);

  useEffect(() => {
    if (props.useDefaultStyles === false) return;
    const containerElement = document.querySelector('.' + styleClassSelector);
    if (containerElement instanceof HTMLElement) {
      Object.assign(containerElement.style, {
        backgroundColor: props.selectionStyle?.backgroundColor || token.colorPrimary,
        opacity: String(props.selectionStyle?.opacity ?? 0.75),
        borderColor: props.selectionStyle?.borderColor || token.colorPrimaryBorder,
      });
    }
  }, [
    className,
    props.container,
    props.selectionStyle?.backgroundColor,
    props.selectionStyle?.borderColor,
    props.selectionStyle?.opacity,
    props.useDefaultStyles,
    token.colorPrimary,
    styleClassSelector,
    token.colorPrimaryBorder,
  ]);

  return (
    <SelectoComponent
      className={className}
      selectFromInside={false}
      selectByClick
      preventDragFromInside
      preventDefault={false}
      hitRate={0}
      selectableTargets={[`.${SELECTABLE_CLASSNAME}`]}
      container={props.container}
      rootContainer={props.rootContainer ?? null}
      dragContainer={dragContainer}
      boundContainer={props.boundContainer ?? props.container}
      checkInput={props.checkInput ?? true}
      dragCondition={(dragStart) => {
        const inputEvent = dragStart.inputEvent as MouseEvent | TouchEvent;
        const target = inputEvent?.target as EventTarget | null;
        if (isDesignerInteractionExcluded(target)) return false;
        return props.dragCondition ? props.dragCondition(dragStart) : true;
      }}
      getElementRect={props.getElementRect ?? ((element) => rectToPointArea(element.getBoundingClientRect()))}
      continueSelect={props.continueSelect}
      onDragStart={props.onDragStart}
      onSelect={props.onSelect}
    />
  );
};

export default Selecto;

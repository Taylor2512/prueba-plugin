import React, { useEffect, forwardRef, Ref, useId } from 'react';
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
import { resolveFirstClassSelector } from '../shared/className.js';
import { installPassiveTouchListenerGuard } from '../shared/passiveTouchListeners.js';

installPassiveTouchListenerGuard();

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

const baseClassName = 'sisad-pdfme-moveable';

const Moveable = (props: Props, ref: Ref<MoveableComponent>) => {
  const instanceId = useId();
  const resolvedClassName = props.className || `${baseClassName}-${instanceId.replace(/:/g, '-')}`;
  const styleClassSelector = resolveFirstClassSelector(resolvedClassName, baseClassName);

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
      className={resolvedClassName}
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

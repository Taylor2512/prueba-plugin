import React, { useEffect, forwardRef, Ref, useId } from 'react';
import MoveableComponent from 'react-moveable';
import { theme } from 'antd';
import { resolveFirstClassSelector } from '../shared/className.js';

const MoveableElement = MoveableComponent as any;

type Props = {
  target: HTMLElement[];
  bounds: { left: number; top: number; bottom: number; right: number };
  horizontalGuidelines: number[];
  verticalGuidelines: number[];
  keepRatio: boolean;
  rotatable: boolean;
  onDrag: (e: any) => void;
  onDragEnd: (e: any) => void;
  onDragGroupEnd: (e: any) => void;
  onDragStart?: (e: any) => void;
  onRotate: (e: any) => void;
  onRotateStart?: (e: any) => void;
  onRotateEnd: (e: any) => void;
  onRotateGroupEnd: (e: any) => void;
  onResize: (e: any) => void;
  onResizeStart?: (e: any) => void;
  onResizeEnd: (e: any) => void;
  onResizeGroupEnd: (e: any) => void;
  onClick: (e: any) => void;
  className?: string;
  useDefaultStyles?: boolean;
  moveableColor?: string;
};

const baseClassName = 'sisad-pdfme-moveable';

const Moveable = (props: Props, ref: Ref<MoveableComponent>) => {
  const { token } = theme.useToken();
  const instanceId = useId();
  const resolvedClassName = props.className || `${baseClassName}-${instanceId.replace(/:/g, '-')}`;
  const styleClassSelector = resolveFirstClassSelector(resolvedClassName, baseClassName);

  useEffect(() => {
    if (props.useDefaultStyles === false) return;
    if (!styleClassSelector) return;
    const containerElement = document.querySelector(`.${styleClassSelector}`);
    const moveableLines = document.querySelectorAll(`.${styleClassSelector} .moveable-line`);
    const color = props.moveableColor || token.colorPrimary;
    if (containerElement instanceof HTMLElement) {
      containerElement.style.setProperty('--moveable-color', color);
      moveableLines.forEach((e) => {
        if (e instanceof HTMLElement) {
          e.style.setProperty('--moveable-color', color);
        }
      });
    }
  }, [props.moveableColor, props.target, props.useDefaultStyles, styleClassSelector, token.colorPrimary]);

  return (
    <MoveableElement
      className={resolvedClassName}
      rootContainer={typeof document === 'undefined' ? undefined : document.body}
      snappable
      draggable
      rotatable={props.rotatable}
      resizable
      throttleDrag={1}
      throttleRotate={1}
      throttleResize={1}
      ref={ref}
      target={props.target}
      bounds={props.bounds}
      horizontalGuidelines={props.horizontalGuidelines}
      verticalGuidelines={props.verticalGuidelines}
      keepRatio={props.keepRatio}
      onRotate={props.onRotate}
      onRotateStart={props.onRotateStart}
      onRotateEnd={props.onRotateEnd}
      onRotateGroupStart={({ events }: { events: any[] }) => {
        events.forEach((event) => props.onRotateStart?.(event));
      }}
      onRotateGroup={({ events }: { events: any[] }) => {
        events.forEach(props.onRotate);
      }}
      onRotateGroupEnd={props.onRotateGroupEnd}
      onDrag={props.onDrag}
      onDragStart={props.onDragStart}
      onDragGroupStart={({ events }: { events: any[] }) => {
        events.forEach((event) => props.onDragStart?.(event));
      }}
      onDragGroup={({ events }: { events: any[] }) => {
        events.forEach(props.onDrag);
      }}
      onDragEnd={props.onDragEnd}
      onDragGroupEnd={props.onDragGroupEnd}
      onResize={props.onResize}
      onResizeStart={props.onResizeStart}
      onResizeGroup={({ events }: { events: any[] }) => {
        events.forEach(props.onResize);
      }}
      onResizeEnd={props.onResizeEnd}
      onResizeGroupEnd={props.onResizeGroupEnd}
      onClick={props.onClick}
    />
  );
};

export default forwardRef<MoveableComponent, Props>(Moveable);

import React, { useEffect } from 'react';
import SelectoComponent, {
  OnSelect as SelectoOnSelect,
  OnDragStart as SelectoOnDragStart,
} from 'react-selecto';
import { SELECTABLE_CLASSNAME } from '../../../constants.js';
import { theme } from 'antd';
import { resolveFirstClassSelector } from '../shared/className.js';

type Props = {
  container: HTMLElement | null;
  continueSelect: boolean;
  onDragStart: (e: SelectoOnDragStart) => void;
  onSelect: (e: SelectoOnSelect) => void;
  className?: string;
  useDefaultStyles?: boolean;
  selectionStyle?: {
    backgroundColor?: string;
    borderColor?: string;
    opacity?: number;
  };
};

const defaultClassName = 'sisad-pdfme-selecto';

const Selecto = (props: Props) => {
  const { token } = theme.useToken();
  const className = props.className || defaultClassName;
  const styleClassSelector = resolveFirstClassSelector(className, defaultClassName);

  useEffect(() => {
    if (props.useDefaultStyles === false) return;
    const containerElement = document.querySelector('.' + styleClassSelector);
    if (containerElement instanceof HTMLElement) {
      containerElement.style.backgroundColor =
        props.selectionStyle?.backgroundColor || token.colorPrimary;
      containerElement.style.opacity = String(props.selectionStyle?.opacity ?? 0.75);
      containerElement.style.borderColor =
        props.selectionStyle?.borderColor || token.colorPrimaryBorder;
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
      preventDefault
      hitRate={0}
      selectableTargets={[`.${SELECTABLE_CLASSNAME}`]}
      container={props.container}
      continueSelect={props.continueSelect}
      onDragStart={props.onDragStart}
      onSelect={props.onSelect}
    />
  );
};

export default Selecto;

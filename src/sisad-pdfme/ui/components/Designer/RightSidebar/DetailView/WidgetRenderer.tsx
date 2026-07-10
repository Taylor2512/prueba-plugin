import React, { useEffect, useRef } from 'react';
import type { PropPanelWidgetProps } from '@sisad-pdfme/common';
import { markInspectorInteractive } from './inspectorInteractionGuards.js';

type Props = PropPanelWidgetProps & {
  widget: (props: PropPanelWidgetProps) => void;
};

const WidgetRenderer = (props: Props) => {
  const { widget, ...otherProps } = props;
  const ref = useRef<HTMLDivElement>(null);

  const clearRoot = () => {
    if (ref.current) {
      ref.current.innerHTML = '';
    }
  };

  useEffect(() => {
    if (ref.current) {
      markInspectorInteractive(ref.current);
      clearRoot();
      widget({ ...otherProps, rootElement: ref.current });
    }

    return () => {
      clearRoot();
    };
  });

  return <div ref={ref} className="min-w-0" />;
};

export default WidgetRenderer;

import React, { useEffect, useRef } from 'react';
import type { PropPanelWidgetProps } from '@sisad-pdfme/common';

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
      clearRoot();
      widget({ ...otherProps, rootElement: ref.current });
    }

    return () => {
      clearRoot();
    };
  });

  return <div ref={ref} />;
};

export default WidgetRenderer;

import React from 'react';
import { Button, Form } from 'antd';
import type { PropPanelWidgetProps } from '@pdfme/common';
import { DESIGNER_CLASSNAME } from '../../../../constants.js';
import {
  AlignStartVertical,
  AlignStartHorizontal,
  AlignCenterVertical,
  AlignCenterHorizontal,
  AlignEndVertical,
  AlignEndHorizontal,
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
} from 'lucide-react';
import type { SelectionCommandSet, AlignType, DistributeType } from '../../shared/selectionCommands.js';

const LAYOUT_BUTTONS = [
  { id: 'left', label: 'Alinear a la izquierda', icon: <AlignStartVertical size={15} />, type: 'align', value: 'left' },
  { id: 'center', label: 'Centrar horizontalmente', icon: <AlignCenterVertical size={15} />, type: 'align', value: 'center' },
  { id: 'right', label: 'Alinear a la derecha', icon: <AlignEndVertical size={15} />, type: 'align', value: 'right' },
  { id: 'top', label: 'Alinear arriba', icon: <AlignStartHorizontal size={15} />, type: 'align', value: 'top' },
  { id: 'middle', label: 'Centrar verticalmente', icon: <AlignCenterHorizontal size={15} />, type: 'align', value: 'middle' },
  { id: 'bottom', label: 'Alinear abajo', icon: <AlignEndHorizontal size={15} />, type: 'align', value: 'bottom' },
  { id: 'vertical', label: 'Distribuir verticalmente', icon: <AlignVerticalSpaceAround size={15} />, type: 'distribute', value: 'vertical' },
  { id: 'horizontal', label: 'Distribuir horizontalmente', icon: <AlignHorizontalSpaceAround size={15} />, type: 'distribute', value: 'horizontal' },
];

const AlignWidget = (props: PropPanelWidgetProps & { selectionCommands?: SelectionCommandSet }) => {
  const { activeElements, selectionCommands } = props;
  const hasSelection = activeElements.length > 0;
  const isMulti = activeElements.length > 1;

  const handleClick = (btn: typeof LAYOUT_BUTTONS[number]) => {
    if (!selectionCommands) return;
    if (btn.type === 'align') {
      selectionCommands.alignSelection(btn.value as AlignType);
    } else {
      selectionCommands.distributeSelection(btn.value as DistributeType);
    }
  };

  return (
    <Form.Item label="Alineación" className={`${DESIGNER_CLASSNAME}align-widget`}> 
      <div className={`${DESIGNER_CLASSNAME}align-widget-grid`}>
        {LAYOUT_BUTTONS.map((btn) => (
          <Button
            key={btn.id}
            className={`${DESIGNER_CLASSNAME}align-btn ${DESIGNER_CLASSNAME}align-${btn.id}`}
            onClick={() => handleClick(btn)}
            disabled={!hasSelection || (btn.type === 'distribute' && !isMulti)}
            icon={btn.icon}
          />
        ))}
      </div>
    </Form.Item>
  );
};

export default AlignWidget;

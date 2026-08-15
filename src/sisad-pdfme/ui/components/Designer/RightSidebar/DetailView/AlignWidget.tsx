/**
 * AlignWidget — controles compactos de alineación y distribución del inspector.
 *
 * Este widget expone acciones de layout sobre la selección activa usando el
 * `SelectionCommandSet` compartido por Canvas, toolbar contextual y DetailView.
 * No calcula geometría ni modifica schemas directamente; delega las operaciones
 * a comandos ya normalizados para mantener un único contrato de selección.
 */
import { Button, Form, Tooltip } from 'antd';
import type { PropPanelWidgetProps } from '@sisad-pdfme/common';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';
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
import type { SelectionCommandSet, AlignType, DistributeType } from '@sisad-pdfme/ui/components/Designer/shared/selectionCommands';

/**
 * Botones declarativos disponibles para alinear o distribuir la selección.
 *
 * `type` decide qué comando del `SelectionCommandSet` se ejecutará y `value`
 * contiene el contrato esperado por `alignSelection` o `distributeSelection`.
 */
const LAYOUT_BUTTONS = [
  { id: 'left', label: 'Alinear a la izquierda', icon: <AlignStartVertical size={14} />, type: 'align', value: 'left' },
  { id: 'center', label: 'Centrar horizontalmente', icon: <AlignCenterVertical size={14} />, type: 'align', value: 'center' },
  { id: 'right', label: 'Alinear a la derecha', icon: <AlignEndVertical size={14} />, type: 'align', value: 'right' },
  { id: 'top', label: 'Alinear arriba', icon: <AlignStartHorizontal size={14} />, type: 'align', value: 'top' },
  { id: 'middle', label: 'Centrar verticalmente', icon: <AlignCenterHorizontal size={14} />, type: 'align', value: 'middle' },
  { id: 'bottom', label: 'Alinear abajo', icon: <AlignEndHorizontal size={14} />, type: 'align', value: 'bottom' },
  { id: 'vertical', label: 'Distribuir verticalmente', icon: <AlignVerticalSpaceAround size={14} />, type: 'distribute', value: 'vertical' },
  { id: 'horizontal', label: 'Distribuir horizontalmente', icon: <AlignHorizontalSpaceAround size={14} />, type: 'distribute', value: 'horizontal' },
];

/**
 * Widget del inspector para alineación y distribución de elementos activos.
 *
 * @param props Props del panel de propiedades extendidas con comandos de selección.
 * @returns Grupo de botones de layout conectado a `SelectionCommandSet`.
 */
const AlignWidget = (props: PropPanelWidgetProps & { selectionCommands?: SelectionCommandSet }) => {
  const { activeElements, selectionCommands } = props;
  const hasSelection = activeElements.length > 0;
  const canDistribute = activeElements.length >= 3;

  /**
   * Ejecuta el comando correspondiente al botón seleccionado.
   *
   * @param btn Configuración declarativa del botón pulsado.
   */
  const handleClick = (btn: typeof LAYOUT_BUTTONS[number]) => {
    if (!selectionCommands) return;
    if (btn.type === 'align') {
      selectionCommands.alignSelection(btn.value as AlignType);
    } else {
      selectionCommands.distributeSelection(btn.value as DistributeType);
    }
  };

  return (
    <Form.Item label="Alineación" className={mergeClassNames(`${DESIGNER_CLASSNAME}align-widget`, 'm-0')}>
      <div className={mergeClassNames(`${DESIGNER_CLASSNAME}align-widget-grid`, 'grid grid-cols-4 gap-1')}>
        {LAYOUT_BUTTONS.map((btn) => (
          <Tooltip key={btn.id} title={btn.label} placement="top" mouseEnterDelay={0.35}>
            <Button
              className={mergeClassNames(
                `${DESIGNER_CLASSNAME}align-btn`,
                `${DESIGNER_CLASSNAME}align-${btn.id}`,
                'inline-flex h-[1.75rem] w-[1.75rem] items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-none transition',
                'hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40',
              )}
              onClick={() => handleClick(btn)}
              aria-label={btn.label}
              disabled={!hasSelection || (btn.type === 'distribute' && !canDistribute)}
              icon={btn.icon}
            />
          </Tooltip>
        ))}
      </div>
    </Form.Item>
  );
};

export default AlignWidget;

/**
 * Navegador lateral de unidades/registros del Preview/Form.
 *
 * Se muestra cuando existen múltiples inputs y permite saltar al primero,
 * anterior, siguiente o último registro sin interferir con el scroll de páginas.
 */
import React from 'react';
import { Size } from '@sisad-pdfme/common';
import { theme, Typography, Button } from 'antd';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const { Text } = Typography;

/**
 * Props de botón de navegación entre unidades.
 */
type UnitButtonProps = {
  type: 'left' | 'right' | 'doubleLeft' | 'doubleRight';
  onClick: () => void;
  disabled: boolean;
};

/**
 * Mapa de tipo de botón a icono visual.
 */
const icons = {
  left: ChevronLeft,
  right: ChevronRight,
  doubleLeft: ChevronsLeft,
  doubleRight: ChevronsRight,
};

/**
 * Clases compartidas de los clusters flotantes de paginación.
 */
const clusterClassName =
  'flex items-center gap-1 rounded-full border border-white/10 bg-slate-950/70 px-2 py-1 shadow-lg backdrop-blur';

/**
 * Botón individual del paginador de unidades.
 */
const UnitButton: React.FC<UnitButtonProps> = ({ type, onClick, disabled }) => {
  const Icon = icons[type];

  return (
    <Button
      type="text"
      size="small"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white"
    >
      <Icon size={14} className="text-white" />
    </Button>
  );
};

/**
 * Props del paginador de unidades/inputs.
 */
type Props = {
  size: Size;
  unitCursor: number;
  unitNum: number;
  setUnitCursor: (page: number) => void;
};

/**
 * Control flotante para cambiar de unidad cuando Preview/Form recibe múltiples inputs.
 */
const UnitPager = ({ size, unitCursor, unitNum, setUnitCursor }: Props) => {
  if (unitNum <= 1) return null;

  const { token } = theme.useToken();

  const buttonWrapStyle: React.CSSProperties = {
    padding: token.paddingSM,
    borderRadius: token.borderRadius,
    backgroundColor: token.colorBgMask,
  };

  return (
    <div className="absolute" style={{ ...size }}>
      <div className="sticky top-1/2 z-[1] flex w-full -translate-y-1/2 items-center">
        {unitCursor > 0 && (
          <div className={`ml-4 ${clusterClassName}`} style={buttonWrapStyle}>
            <UnitButton
              type="doubleLeft"
              onClick={() => setUnitCursor(0)}
              disabled={unitCursor <= 0}
            />
            <UnitButton
              type="left"
              onClick={() => setUnitCursor(unitCursor - 1)}
              disabled={unitCursor <= 0}
            />
            <Text strong className="m-0 px-1 text-xs text-white">
              {unitCursor + 1}/{unitNum}
            </Text>
          </div>
        )}
        {unitCursor + 1 < unitNum && (
          <div className={`ml-auto mr-4 ${clusterClassName}`} style={buttonWrapStyle}>
            <Text strong className="m-0 px-1 text-xs text-white">
              {unitCursor + 1}/{unitNum}
            </Text>
            <UnitButton
              type="right"
              onClick={() => setUnitCursor(unitCursor + 1)}
              disabled={unitCursor + 1 >= unitNum}
            />
            <UnitButton
              type="doubleRight"
              onClick={() => setUnitCursor(unitNum - 1)}
              disabled={unitCursor + 1 >= unitNum}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitPager;

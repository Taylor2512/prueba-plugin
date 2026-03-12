import { UI_CLASSNAME } from "../constants.js";
import React from 'react';
import { Size } from '@pdfme/common';
import { theme, Typography, Button } from 'antd';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const { Text } = Typography;

type UnitButtonProps = {
  type: 'left' | 'right' | 'doubleLeft' | 'doubleRight';
  onClick: () => void;
  disabled: boolean;
  textStyle: { color: string; fontSize: number; margin: number };
};

const icons = {
  left: ChevronLeft,
  right: ChevronRight,
  doubleLeft: ChevronsLeft,
  doubleRight: ChevronsRight,
};

const UnitButton: React.FC<UnitButtonProps> = ({ type, onClick, disabled, textStyle }) => {
  const Icon = icons[type];

  return (
    <Button type="text" onClick={onClick} disabled={disabled}>
      <Icon className={UI_CLASSNAME + "icon-auto"} />
    </Button>
  );
};

type Props = {
  size: Size;
  unitCursor: number;
  unitNum: number;
  setUnitCursor: (page: number) => void;
};

const UnitPager = ({ size, unitCursor, unitNum, setUnitCursor }: Props) => {
  if (unitNum <= 1) return null;

  const { token } = theme.useToken();

  const buttonWrapStyle: React.CSSProperties = {
    pointerEvents: 'initial',
    position: 'sticky',
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    height: 40,
    padding: token.paddingSM,
    borderRadius: token.borderRadius,
    backgroundColor: token.colorBgMask,
  };
  const textStyle = {
    color: token.colorWhite,
    fontSize: token.fontSize,
    margin: token.marginXS,
  };

  return (
    <div className={UI_CLASSNAME + "div-auto"}>
      <div
        className={UI_CLASSNAME + "div-auto"}
      >
        {unitCursor > 0 && (
          <div className={UI_CLASSNAME + "div-auto"}>
            <UnitButton
              type="doubleLeft"
              onClick={() => setUnitCursor(0)}
              disabled={unitCursor <= 0}
              textStyle={textStyle}
            />
            <UnitButton
              type="left"
              onClick={() => setUnitCursor(unitCursor - 1)}
              disabled={unitCursor <= 0}
              textStyle={textStyle}
            />
            <Text strong className={UI_CLASSNAME + "text-auto"}>
              {unitCursor + 1}/{unitNum}
            </Text>
          </div>
        )}
        {unitCursor + 1 < unitNum && (
          <div
            className={UI_CLASSNAME + "div-auto"}
          >
            <Text strong className={UI_CLASSNAME + "text-auto"}>
              {unitCursor + 1}/{unitNum}
            </Text>
            <UnitButton
              type="right"
              onClick={() => setUnitCursor(unitCursor + 1)}
              disabled={unitCursor + 1 >= unitNum}
              textStyle={textStyle}
            />
            <UnitButton
              type="doubleRight"
              onClick={() => setUnitCursor(unitNum - 1)}
              disabled={unitCursor + 1 >= unitNum}
              textStyle={textStyle}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitPager;

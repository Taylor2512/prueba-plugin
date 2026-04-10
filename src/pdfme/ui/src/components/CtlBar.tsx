import React, { useContext } from 'react';
import { Size } from '@pdfme/common';
// Import icons from lucide-react
// Note: In tests, these will be mocked by the mock file in __mocks__/lucide-react.js
import { Plus, Minus, ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';

import type { MenuProps } from 'antd';
import { Typography, Button, Dropdown, Select } from 'antd';
import { I18nContext } from '../contexts.js';
import { useMaxZoom } from '../helper.js';
import { UI_CLASSNAME } from '../constants.js';

const { Text } = Typography;

type ZoomProps = {
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  iconColor?: string;
};

const Zoom = ({ zoomLevel, setZoomLevel, iconColor }: ZoomProps) => {
  const zoomStep = 0.25;
  const maxZoom = useMaxZoom();
  const minZoom = 0.25;
  const presets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

  const nextZoomOut = zoomLevel - zoomStep;
  const nextZoomIn = zoomLevel + zoomStep;

  return (
    <div className={UI_CLASSNAME + 'zoom'}>
      <Button
        className={UI_CLASSNAME + 'zoom-out'}
        type="text"
        disabled={minZoom >= nextZoomOut}
        onClick={() => setZoomLevel(nextZoomOut)}
        icon={<Minus size={16} color={iconColor} />}
      />
      <Text strong>
        {Math.round(zoomLevel * 100)}%
      </Text>
      <Button
        className={UI_CLASSNAME + 'zoom-in'}
        type="text"
        disabled={maxZoom < nextZoomIn}
        onClick={() => setZoomLevel(nextZoomIn)}
        icon={<Plus size={16} color={iconColor} />}
      />
      <Select
        size="small"
        value={Number(zoomLevel.toFixed(2))}
        options={presets
          .filter((preset) => preset >= minZoom && preset <= maxZoom)
          .map((preset) => ({
            value: Number(preset.toFixed(2)),
            label: `${Math.round(preset * 100)}%`,
          }))}
        onChange={(value) => setZoomLevel(Number(value))}
        styles={{ popup: { root: { minWidth: 90 } } }}
      />
    </div>
  );
};

type PagerProps = {
  pageCursor: number;
  pageNum: number;
  setPageCursor: (page: number) => void;
  iconColor?: string;
};

const Pager = ({ pageCursor, pageNum, setPageCursor, iconColor }: PagerProps) => {
  return (
    <div className={UI_CLASSNAME + 'pager'}>
      <Button className={UI_CLASSNAME + 'page-prev'} type="text" disabled={pageCursor <= 0} onClick={() => setPageCursor(pageCursor - 1)}>
        <ChevronLeft size={16} color={iconColor} />
      </Button>
      <Text strong>
        {pageCursor + 1}/{pageNum}
      </Text>
      <Button
        className={UI_CLASSNAME + 'page-next'}
        type="text"
        disabled={pageCursor + 1 >= pageNum}
        onClick={() => setPageCursor(pageCursor + 1)}
      >
        <ChevronRight size={16} color={iconColor} />
      </Button>
    </div>
  );
};

type ContextMenuProps = {
  items: MenuProps['items'];
  iconColor?: string;
};
const ContextMenu = ({ items, iconColor }: ContextMenuProps) => (
  <Dropdown menu={{ items }} placement="top" arrow trigger={['click']}>
    <Button className={UI_CLASSNAME + 'context-menu'} type="text">
      <Ellipsis size={16} color={iconColor} />
    </Button>
  </Dropdown>
);

type CtlBarProps = {
  size: Size;
  pageCursor: number;
  pageNum: number;
  setPageCursor: (page: number) => void;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
  setZoom?: (zoom: number) => void;
  addPageAfter?: () => void;
  removePage?: () => void;
};

const CtlBar = (props: CtlBarProps) => {
  const i18n = useContext(I18nContext);

  const {
    size: _size,
    pageCursor,
    pageNum,
    setPageCursor,
    zoomLevel,
    setZoomLevel,
    setZoom,
    addPageAfter,
    removePage,
  } = props;
  void _size;
  const zoomChangeHandler = setZoom ?? setZoomLevel;

  const contextMenuItems: MenuProps['items'] = [];
  if (addPageAfter) {
    contextMenuItems.push({
      key: '1',
      label: <div onClick={addPageAfter}>{i18n('addPageAfter')}</div>,
    });
  }
  if (removePage && pageNum > 1 && pageCursor !== 0) {
    contextMenuItems.push({
      key: '2',
      label: <div onClick={removePage}>{i18n('removePage')}</div>,
    });
  }

  return (
    <div className={UI_CLASSNAME + 'control-bar'}>
      <div className={UI_CLASSNAME + 'control-bar-context'}>
        <span className={UI_CLASSNAME + 'control-bar-kicker'}>Página activa</span>
        <Text strong className={UI_CLASSNAME + 'control-bar-page'}>
          {pageCursor + 1}
        </Text>
        <span className={UI_CLASSNAME + 'control-bar-subtext'}>
          {pageNum > 1 ? `de ${pageNum}` : 'página única'}
        </span>
      </div>
      <div className={UI_CLASSNAME + 'control-bar-actions'}>
        {pageNum > 1 && (
          <Pager pageCursor={pageCursor} pageNum={pageNum} setPageCursor={setPageCursor} />
        )}
        <Zoom zoomLevel={zoomLevel} setZoomLevel={zoomChangeHandler} />
        {contextMenuItems.length > 0 && <ContextMenu items={contextMenuItems} />}
      </div>
    </div>
  );
};

export default CtlBar;

import React from 'react';
import { Tooltip } from 'antd';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { DESIGNER_CLASSNAME } from '../../../constants.js';
import { mergeClassNames } from './className.js';

export type SidebarCollapseHandleProps = {
  side: 'left' | 'right';
  expanded: boolean;
  presentation: 'docked' | 'overlay';
  density?: 'full' | 'comfortable' | 'compact' | 'mini';
  labelExpanded: string;
  labelCollapsed: string;
  onToggle: () => void;
  className?: string;
};

const SidebarCollapseHandle = ({
  side,
  expanded,
  presentation,
  density = 'full',
  labelExpanded,
  labelCollapsed,
  onToggle,
  className,
}: SidebarCollapseHandleProps) => {
  const isLeft = side === 'left';
  const Icon = expanded
    ? isLeft
      ? PanelLeftClose
      : PanelRightClose
    : isLeft
      ? PanelLeftOpen
      : PanelRightOpen;
  const label = expanded ? labelExpanded : labelCollapsed;
  const placement = isLeft ? 'right' : 'left';

  return (
    <Tooltip title={label} placement={placement}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={label}
        data-side={side}
        data-expanded={expanded ? 'true' : 'false'}
        data-presentation={presentation}
        data-density={density}
        onClick={onToggle}
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}sidebar-toggle-btn`,
          `${DESIGNER_CLASSNAME}sidebar-collapse-handle`,
          `${DESIGNER_CLASSNAME}sidebar-collapse-handle-${side}`,
          'inline-flex items-center justify-center',
          className,
        )}
      >
        <Icon size={16} strokeWidth={2.2} />
      </button>
    </Tooltip>
  );
};

export default SidebarCollapseHandle;

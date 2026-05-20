import React from 'react';
import { Button, Tooltip } from 'antd';
import type { ReactNode } from 'react';
import { Keyboard } from 'lucide-react';

type ShortcutHelpButtonProps = {
  onClick: () => void;
  className?: string;
  label?: ReactNode;
  tooltip?: ReactNode;
  icon?: ReactNode;
};

const ShortcutHelpButton = ({
  onClick,
  className,
  label = 'Atajos',
  tooltip = 'Ver atajos del diseñador (Ctrl+/)',
  icon = <Keyboard size={14} />,
}: ShortcutHelpButtonProps) => {
  return (
    <Tooltip title={tooltip} placement="bottom">
      <Button
        size="small"
        icon={icon}
        onClick={onClick}
        aria-label={typeof label === 'string' ? label : 'Ver atajos del diseñador'}
        className={`sisad-pdfme-shortcuts-button ${className || ''}`.trim()}
      >
        {label}
      </Button>
    </Tooltip>
  );
};

export default React.memo(ShortcutHelpButton);

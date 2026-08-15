import React from 'react';
import { Button, Tooltip } from 'antd';
import type { ReactNode } from 'react';
import { Keyboard } from 'lucide-react';
import { cn } from '@sisad-pdfme/ui/utils/cn';

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
  const buttonClassName = cn(
    'sisad-pdfme-shortcuts-button inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition',
    'hover:border-sky-200 hover:text-sky-700 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60',
    className,
  );

  return (
    <Tooltip title={tooltip} placement="bottom">
      <Button
        size="small"
        icon={icon}
        onClick={onClick}
        aria-label={typeof label === 'string' ? label : 'Ver atajos del diseñador'}
        className={buttonClassName}
      >
        {label}
      </Button>
    </Tooltip>
  );
};

export default React.memo(ShortcutHelpButton);

import React from 'react';
import { Button } from 'antd';
import { Keyboard } from 'lucide-react';

type ShortcutHelpButtonProps = {
  onClick: () => void;
  className?: string;
};

const ShortcutHelpButton = ({ onClick, className }: ShortcutHelpButtonProps) => {
  return (
    <Button
      size="small"
      icon={<Keyboard size={14} />}
      onClick={onClick}
      className={`sisad-pdfme-shortcuts-button ${className || ''}`.trim()}
    >
      Atajos
    </Button>
  );
};

export default React.memo(ShortcutHelpButton);


import React from 'react';
import {
  Trash2,
  Copy,
  Asterisk,
  Lock,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignJustify,
} from 'lucide-react';
import type { SelectionCommandSet } from '../../shared/selectionCommands.js';

const buttonConfig = [
  { id: 'duplicate', label: 'Duplicar', icon: <Copy size={14} />, action: (cmd: SelectionCommandSet) => cmd.duplicateSelection() },
  { id: 'delete', label: 'Eliminar', icon: <Trash2 size={14} />, action: (cmd: SelectionCommandSet) => cmd.deleteSelection() },
  { id: 'required', label: 'Requerido', icon: <Asterisk size={14} />, action: (cmd: SelectionCommandSet) => cmd.toggleRequired() },
  { id: 'readonly', label: 'Solo lectura', icon: <Lock size={14} />, action: (cmd: SelectionCommandSet) => cmd.toggleReadOnly() },
  { id: 'bring-forward', label: 'Traer al frente', icon: <ArrowUp size={14} />, action: (cmd: SelectionCommandSet) => cmd.bringForward() },
  { id: 'send-back', label: 'Enviar atrás', icon: <ArrowDown size={14} />, action: (cmd: SelectionCommandSet) => cmd.sendBackward() },
  { id: 'align', label: 'Alinear', icon: <AlignLeft size={14} />, action: (cmd: SelectionCommandSet) => cmd.alignSelection('center') },
  { id: 'distribute', label: 'Distribuir', icon: <AlignJustify size={14} />, action: (cmd: SelectionCommandSet) => cmd.distributeSelection('horizontal') },
  { id: 'properties', label: 'Propiedades', icon: <AlignCenter size={14} />, action: (cmd: SelectionCommandSet) => cmd.openProperties() },
];

type SelectionContextToolbarProps = {
  position: { top: number; left: number } | null;
  commands?: SelectionCommandSet;
  activeElements: HTMLElement[];
};

const SelectionContextToolbar = ({ position, commands, activeElements }: SelectionContextToolbarProps) => {
  if (!position || !commands || !activeElements.length) return null;

  return (
    <div
      className="pdfme-ui-selection-context-toolbar"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {buttonConfig.map((btn) => (
        <button
          key={btn.id}
          type="button"
          title={btn.label}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            btn.action(commands);
          }}>
          {btn.icon}
        </button>
      ))}
    </div>
  );
};

export default SelectionContextToolbar;

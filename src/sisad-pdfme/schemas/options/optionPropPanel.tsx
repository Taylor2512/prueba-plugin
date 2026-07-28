import React from 'react';
import type { OptionItem } from './optionTypes';

// Minimal React wrapper for option list editing used in propPanel widgets.
// The existing codebase relies heavily on DOM widgets; keep a thin React bridge.

type Props = {
  value: OptionItem[];
  onChange: (next: OptionItem[]) => void;
};

export const OptionListEditor: React.FC<Props> = ({ value, onChange }) => {
  const handleLabel = (index: number, label: string) => {
    const next = value.slice();
    next[index] = { ...next[index], label };
    onChange(next);
  };

  return (
    <div className="option-list-editor">
      {value.map((opt, idx) => (
        <div key={opt.optionId} className="option-item">
          <input
            value={opt.label}
            onChange={(e) => handleLabel(idx, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

import React from 'react';
import OptionListEditor from './optionPropPanel.js';
import type { OptionItem } from './optionTypes.js';

type Props = {
  value: OptionItem[];
  onChange: (next: OptionItem[]) => void;
};

export const OptionListWidget: React.FC<Props> = ({ value, onChange }) => {
  return <OptionListEditor value={value} onChange={onChange} />;
};

export default OptionListWidget;

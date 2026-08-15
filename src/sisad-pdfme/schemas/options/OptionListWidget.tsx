import React from 'react';
import { OptionListEditor } from '@sisad-pdfme/schemas/options/optionPropPanel';
import type { OptionItem } from '@sisad-pdfme/schemas/options/optionTypes';

type Props = {
  value: OptionItem[];
  onChange: (next: OptionItem[]) => void;
};

export const OptionListWidget: React.FC<Props> = ({ value, onChange }) => {
  return <OptionListEditor value={value} onChange={onChange} />;
};

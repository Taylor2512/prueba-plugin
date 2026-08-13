export type OptionItem = {
  optionId: string;
  label: string;
  value?: string;
  disabled?: boolean;
};

type OptionSelectionMode = 'single' | 'multiple';

export interface OptionGroupConfig {
  type: string;
  mode: OptionSelectionMode;
  defaultOptions?: OptionItem[];
  labels?: {
    group?: string;
    optionPrefix?: string;
    addOption?: string;
  };
}

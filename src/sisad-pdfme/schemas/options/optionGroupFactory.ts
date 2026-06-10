import type { Plugin } from '@sisad-pdfme/common';
import type { OptionGroupConfig } from './optionTypes';

// Minimal factory that will be expanded. For now it only returns a thin wrapper
// plugin that can be used by specific option group implementations.

export const createOptionGroupPlugin = (
  config: OptionGroupConfig,
): Plugin<any> => {
  return {
    ui: (arg) => {
      // Delegate to existing schema implementation for now.
      const { schema, rootElement } = arg;
      rootElement.innerHTML = `OptionGroup(${config.type})`;
    },
  } as any;
};

export default createOptionGroupPlugin;

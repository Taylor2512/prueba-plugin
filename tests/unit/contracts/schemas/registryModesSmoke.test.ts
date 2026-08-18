import { describe, expect, it, vi } from 'vitest';
import {
  getBuiltInFields,
  getSchemaPluginByType,
  createDefaultSchema,
} from '../../../../src/sisad-pdfme/schemas';

const modes = ['designer', 'form', 'viewer'] as const;

describe('registered schema mode smoke matrix', () => {
  for (const definition of getBuiltInFields()) {
    for (const mode of modes) {
      it(`${definition.type} mounts in ${mode}`, async () => {
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
        const plugin = getSchemaPluginByType(definition.type);
        const rootElement = document.createElement('div');
        const schema = createDefaultSchema(definition.type, {
          schemaUid: `${definition.type}-${mode}`,
          id: `${definition.type}-${mode}`,
        });

        expect(plugin, `missing plugin for ${definition.type}`).toBeDefined();
        try {
          await plugin?.ui({
            schema,
            basePdf: '',
            mode,
            value: String(schema.content ?? ''),
            rootElement,
            options: {},
            theme: { colorPrimaryBg: '#ffffff', colorPrimary: '#1677ff', colorWhite: '#ffffff' },
            i18n: (key: string) => key,
            scale: 1,
            _cache: new Map(),
            onChange: () => undefined,
            stopEditing: () => undefined,
          } as never);

          expect(rootElement).toBeTruthy();
          expect(consoleError).not.toHaveBeenCalled();
        } finally {
          consoleError.mockRestore();
        }
      });
    }
  }
});

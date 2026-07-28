import { describe, expect, it } from 'vitest';
import date from '@/sisad-pdfme/schemas/date/date';
import dateTime from '@/sisad-pdfme/schemas/date/dateTime';
import time from '@/sisad-pdfme/schemas/date/time';
import checkbox from '@/sisad-pdfme/schemas/checkbox/index';
import signature from '@/sisad-pdfme/schemas/signature/index';

const i18n = (key: string) => key;

const buildPropPanelSchema = (plugin: { propPanel: { schema: unknown } }) => {
  const factory = plugin.propPanel.schema as (props: unknown) => Record<string, unknown>;
  return factory({
    i18n,
    options: { font: { Roboto: { data: '', fallback: true } } },
    activeSchema: {},
    theme: {},
  });
};

/**
 * Contrato de campos de captura: todo tipo que rellena un destinatario debe
 * poder marcarse como obligatorio y documentarse desde el inspector.
 */
describe('capture fields inspector contract', () => {
  const capturePlugins: Array<[string, { propPanel: { schema: unknown; defaultSchema: Record<string, unknown> } }]> = [
    ['date', date as never],
    ['dateTime', dateTime as never],
    ['time', time as never],
    ['checkbox', checkbox as never],
  ];

  for (const [name, plugin] of capturePlugins) {
    it(`${name} expone obligatorio, solo lectura, ayuda y clave de datos`, () => {
      const properties = buildPropPanelSchema(plugin);
      expect(Object.keys(properties)).toEqual(
        expect.arrayContaining(['required', 'readOnly', 'tooltip', 'helpText', 'dataLabel', 'fieldKey']),
      );
    });

    it(`${name} arranca con obligatorio y solo lectura definidos`, () => {
      expect(plugin.propPanel.defaultSchema.required).toBe(false);
      expect(plugin.propPanel.defaultSchema.readOnly).toBe(false);
    });
  }

  it('fecha conserva sus campos propios de formato', () => {
    const properties = buildPropPanelSchema(date as never);
    expect(Object.keys(properties)).toEqual(
      expect.arrayContaining(['format', 'locale', 'defaultValueStrategy', 'validationMessage']),
    );
  });

  it('casilla conserva color y grupo', () => {
    const properties = buildPropPanelSchema(checkbox as never);
    expect(Object.keys(properties)).toEqual(expect.arrayContaining(['color', 'groupId']));
  });

  it('firma puede marcarse como obligatoria sin perder sus campos de proveedor', () => {
    const properties = buildPropPanelSchema(signature as never);
    expect(Object.keys(properties)).toEqual(
      expect.arrayContaining(['required', 'readOnly', 'signatureMode', 'signatureProviderKey']),
    );
    const defaults = (signature as never as { propPanel: { defaultSchema: Record<string, unknown> } }).propPanel
      .defaultSchema;
    expect(defaults.required).toBe(false);
    expect(defaults.readOnly).toBe(false);
  });
});

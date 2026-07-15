import { describe, expect, it, vi } from 'vitest';
import { propPanel } from '@/sisad-pdfme/schemas/signature/propPanel';

describe('sisad-pdfme/schemas/signature/propPanel widgets', () => {
  it('marks the signature mode widget as interactive and syncs signatureMode on mode change', () => {
    const rootElement = document.createElement('div');
    const changeSchemas = vi.fn();

    const widget = propPanel.widgets?.SignatureModeWidget;
    expect(widget).toBeTypeOf('function');
    widget?.({
      rootElement,
      activeSchema: {
        id: 'schema-1',
        signatureMode: 'draw',
        ownerRecipientId: null,
      } as never,
      changeSchemas,
      options: {
        designerEngine: {
          collaboration: {
            recipientOptions: [],
          },
        },
      } as never,
    } as never);

    expect(rootElement.getAttribute('data-sisad-inspector-interactive')).toBe('true');

    const select = rootElement.querySelector('select');
    expect(select).toBeTruthy();

    if (!select) return;

    select.value = 'provider';
    select.dispatchEvent(new Event('change', { bubbles: true }));

    expect(changeSchemas).toHaveBeenCalledTimes(1);
    expect(changeSchemas.mock.calls[0][0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'signatureMode', value: 'provider', schemaId: 'schema-1' }),
      ]),
    );
  });

  it('does not expose signatureType as an inspector field', () => {
    const schema = propPanel.schema({
      activeSchema: {
        id: 'schema-1',
        signatureMode: 'draw',
        ownerRecipientId: null,
      } as never,
      options: {} as never,
    } as never);

    expect(propPanel.inspector?.propertyMap.signatureType).toBeUndefined();
    expect(propPanel.defaultSchema).not.toHaveProperty('signatureType');
    expect(schema).not.toHaveProperty('signatureType');
    expect(schema.signatureMode).toBeTruthy();
    expect(schema.signatureProviderKey).toBeTruthy();
    expect(propPanel.inspector?.propertyMap.signatureMode).toBe('data');
    expect(propPanel.inspector?.propertyMap.signatureProviderKey).toBe('data');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { propPanel } from '@/sisad-pdfme/schemas/signature/propPanel';

describe('sisad-pdfme/schemas/signature/propPanel widgets', () => {
  it('marks the signature mode widget as interactive and syncs signatureType on mode change', () => {
    const rootElement = document.createElement('div');
    const changeSchemas = vi.fn();

    const widget = propPanel.widgets?.SignatureModeWidget;
    expect(widget).toBeTypeOf('function');
    widget?.({
      rootElement,
      activeSchema: {
        id: 'schema-1',
        signatureMode: 'draw',
        signatureType: 'legacy-draw',
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
        expect.objectContaining({ key: 'signatureType', value: 'provider', schemaId: 'schema-1' }),
      ]),
    );
  });
});

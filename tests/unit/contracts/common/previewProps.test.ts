import { describe, expect, it } from 'vitest';
import { checkPreviewProps } from '../../../../src/sisad-pdfme/common/helper';

describe('PreviewProps runtime contract', () => {
  it('accepts the optional Form export callback', () => {
    const container = document.createElement('div');
    const template = {
      basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
      schemas: [[{ name: 'field', type: 'text', content: 'value', position: { x: 0, y: 0 }, width: 10, height: 10 }]],
    };

    expect(() => checkPreviewProps({
      domContainer: container,
      template,
      inputs: [{ field: 'value' }],
      onExport: () => undefined,
    })).not.toThrow();
  });
});

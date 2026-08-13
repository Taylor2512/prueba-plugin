import { describe, expect, it } from 'vitest';
import { getInputFromTemplate } from '@sisad-pdfme/common/helper';
import { normalizeHostData } from '@sisad-pdfme/integration/normalizeHostData';

const template = {
  schemas: [[
    {
      name: 'firstName',
      type: 'text',
      content: 'Ada',
      position: { x: 0, y: 0 },
      width: 120,
      height: 24,
    },
  ]],
};

describe('normalizeHostData', () => {
  it('falls back to template-derived inputs when the host passes an empty array', () => {
    const normalized = normalizeHostData({ template, inputs: [] });

    expect(normalized.inputs).toEqual(getInputFromTemplate(template));
    expect(normalized.inputs).toHaveLength(1);
    expect(normalized.inputs[0]).toMatchObject({ firstName: 'Ada' });
  });

  it('keeps non-empty inputs untouched', () => {
    const normalized = normalizeHostData({
      template,
      inputs: [{ firstName: 'Grace' }],
    });

    expect(normalized.inputs).toEqual([{ firstName: 'Grace' }]);
  });
});

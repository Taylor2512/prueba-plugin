import { describe, expect, it } from 'vitest';
import { getSchemaFamily } from '@sisad-pdfme/schemas';
import { buildExpandedFormTemplate } from '@/examples/builders.js';

describe('expanded DigitalAgreements lab form', () => {
  it('derives non-barcode coverage from the registry', () => {
    const template = buildExpandedFormTemplate({ templateFields: [] });
    const types = template.schemas.flat().map((schema) => schema.type);
    expect(types).toEqual(expect.arrayContaining(['image', 'svg', 'signature', 'initials', 'attachment', 'table']));
    expect(types.filter((type) => getSchemaFamily(type) === 'barcode')).toEqual([]);
    expect(new Set(types).size).toBeGreaterThan(15);
  });
});

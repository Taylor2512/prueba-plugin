import { describe, expect, it } from 'vitest';
import { getBuiltInFields } from '@/sisad-pdfme/schemas';
import { buildSchemaRuntimeManifest } from '@/sisad-pdfme/runtime/schemaManifest';

describe('schema runtime manifest', () => {
  it('derives coverage from the live registry definitions', () => {
    const manifest = buildSchemaRuntimeManifest(getBuiltInFields(), { select: ['dropdown'] });
    expect(manifest.length).toBeGreaterThan(10);
    expect(manifest.find((entry) => entry.type === 'number')).toMatchObject({ codec: 'number', interactionKind: 'input' });
    expect(manifest.find((entry) => entry.type === 'signature')).toMatchObject({ completion: 'signing' });
    expect(manifest.find((entry) => entry.type === 'image')).toMatchObject({ interactionKind: 'visual', completion: 'none' });
  });
});

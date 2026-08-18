import { describe, expect, it } from 'vitest';
import { createSchemaCapabilityResolver } from '@sisad-pdfme/config';
import { isOptionBasedSchema, isSigningSchema, getSchemaOptions } from '@sisad-pdfme/schemas';

describe('schema capability public surfaces', () => {
  it('exposes resolver and boundary guards through semantic entrypoints', () => {
    expect(typeof createSchemaCapabilityResolver).toBe('function');
    expect(typeof isOptionBasedSchema).toBe('function');
    expect(typeof isSigningSchema).toBe('function');
    expect(typeof getSchemaOptions).toBe('function');
  });
});

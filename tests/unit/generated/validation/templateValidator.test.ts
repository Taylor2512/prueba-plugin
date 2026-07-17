import { describe, expect, it } from 'vitest';
import { isTemplateValid, validateTemplate } from '@/sisad-pdfme/shared/templateValidator';

const base = (overrides: Record<string, unknown> = {}) => ({
  id: 's1', name: 'field_1', type: 'text', position: { x: 0, y: 0 }, width: 20, height: 10,
  ...overrides,
});

describe('template validator', () => {
  it('detecta nombres duplicados case-insensitive', () => {
    const result = validateTemplate({ schemasByPage: [[base({ name: 'Name' })], [base({ id: 's2', name: 'name' })]] });
    expect(result.valid).toBe(false);
    expect(result.errors.map((issue) => issue.code)).toContain('FIELD_NAME_DUPLICATE');
  });

  it('detecta firma sin provider y hidden+required', () => {
    const result = validateTemplate({ schemasByPage: [[
      base({ type: 'signature', name: 'signature' }),
      base({ id: 's2', name: 'hidden', hidden: true, required: true }),
    ]] });
    expect(result.errors.map((issue) => issue.code)).toEqual(expect.arrayContaining([
      'FIELD_SIGNATURE_NO_PROVIDER', 'FIELD_HIDDEN_REQUIRED',
    ]));
  });

  it('detecta out-of-bounds y páginas vacías', () => {
    const result = validateTemplate({
      schemasByPage: [[base({ position: { x: 95, y: 95 }, width: 10, height: 10 })], []],
      pageSizes: [{ width: 100, height: 100 }, { width: 100, height: 100 }],
      recipients: [{ id: 'r1', name: 'Cliente' }],
    });
    expect(result.warnings.map((issue) => issue.code)).toEqual(expect.arrayContaining(['FIELD_OUT_OF_BOUNDS', 'PAGE_NO_FIELDS']));
  });

  it('avisa recipient-scoped sin owner y recipients sin required', () => {
    const result = validateTemplate({
      schemasByPage: [[base({ __designer: { schemaUid: 's1', assignment: { scope: 'recipient' } } })]],
      recipients: [{ id: 'r1', name: 'Cliente' }],
    });
    expect(result.warnings.map((issue) => issue.code)).toContain('FIELD_NO_RECIPIENT');
    expect(result.infos.map((issue) => issue.code)).toContain('RECIPIENT_NO_REQUIRED_FIELDS');
  });

  it('considera válido un template limpio', () => {
    const input = {
      schemasByPage: [[base({ required: true, ownerRecipientId: 'r1' })]],
      pageSizes: [{ width: 100, height: 100 }],
      recipients: [{ id: 'r1', name: 'Cliente' }],
    };
    expect(validateTemplate(input).valid).toBe(true);
    expect(isTemplateValid(input)).toBe(true);
  });
});

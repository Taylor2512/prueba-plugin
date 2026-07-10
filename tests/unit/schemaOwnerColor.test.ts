import { describe, expect, it } from 'vitest';
import {
  resolveSchemaOwnerColorValue,
  resolveSchemaOwnerTone,
} from '../../src/sisad-pdfme/schemas/shared/fieldChrome';

describe('resolveSchemaOwnerColorValue (single source of ownership color)', () => {
  it('prefers explicit ownerColor over everything else', () => {
    expect(
      resolveSchemaOwnerColorValue({
        ownerColor: '#D97706',
        userColor: '#2563EB',
        recipientColor: '#16A34A',
        __designer: { collaboration: { recipientColor: '#DC2626' } },
      }),
    ).toBe('#D97706');
  });

  it('falls back through userColor → recipientColor → __designer paths', () => {
    expect(resolveSchemaOwnerColorValue({ userColor: '#2563EB' })).toBe('#2563EB');
    expect(resolveSchemaOwnerColorValue({ recipientColor: '#16A34A' })).toBe('#16A34A');
    expect(
      resolveSchemaOwnerColorValue({ __designer: { collaboration: { recipientColor: '#DC2626' } } }),
    ).toBe('#DC2626');
    expect(resolveSchemaOwnerColorValue({ __designer: { recipientColor: '#7C3AED' } })).toBe('#7C3AED');
  });

  it('returns empty string when the schema has no ownership color (never invents one)', () => {
    expect(resolveSchemaOwnerColorValue({})).toBe('');
    expect(resolveSchemaOwnerColorValue(null)).toBe('');
    expect(resolveSchemaOwnerColorValue({ color: '#000000', borderColor: '#111111' })).toBe('');
  });

  it('ignores semantic/content colors (color, borderColor, strokeColor)', () => {
    // A checkbox mark color must never leak into the ownership accent.
    expect(
      resolveSchemaOwnerColorValue({ color: '#06D6A0', strokeColor: '#118AB2', borderColor: '#4F8EF7' }),
    ).toBe('');
  });
});

describe('resolveSchemaOwnerTone', () => {
  it('uses the caller fallback when the schema has no owner', () => {
    expect(resolveSchemaOwnerTone({}, '#0891B2')).toBe('#0891B2');
  });

  it('uses the safe default when neither schema nor fallback provide a color', () => {
    expect(resolveSchemaOwnerTone({}, null)).toBe('#2563EB');
  });

  it('schema ownership always beats the fallback', () => {
    expect(resolveSchemaOwnerTone({ ownerColor: '#D97706' }, '#0891B2')).toBe('#D97706');
  });
});

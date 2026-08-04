import { describe, it, expect } from 'vitest';
import {
  resolveSchemaTone,
  resolveSchemaToneSurface,
} from '@/sisad-pdfme/ui/components/Designer/shared/schemaTone.js';
import { resolveSchemaVisualTone } from '@/sisad-pdfme/schemas/shared/fieldChrome.js';

const schema = (overrides: Record<string, unknown> = {}) =>
  ({ type: 'text', ...overrides } as Parameters<typeof resolveSchemaTone>[0]);

describe('resolveSchemaTone', () => {
  it('prefers ownerColor over userColor (prioridad del sistema colaborativo)', () => {
    // DEFAULT_PRIORITY en schemaOwnershipAppearance pone ownerColor primero:
    // el color del OWNER asignado gana sobre el color del último editor.
    const s = schema({ userColor: '#FF0000', ownerColor: '#00FF00', type: 'text' });
    expect(resolveSchemaTone(s, '#000')).toBe('#00FF00');
  });

  it('returns ownerColor when userColor absent', () => {
    const s = schema({ ownerColor: '#AABBCC', type: 'text' });
    expect(resolveSchemaTone(s, '#000')).toBe('#AABBCC');
  });

  it('keeps the owner color ahead of semantic chrome colors', () => {
    const s = schema({
      ownerColor: '#00FF00',
      color: '#FF0000',
      borderColor: '#123456',
      strokeColor: '#654321',
      type: 'text',
    });
    expect(resolveSchemaTone(s, '#000')).toBe('#00FF00');
  });

  it('uses borderColor when the schema has no ownerColor', () => {
    const s = schema({ borderColor: '#4F8EF7' });
    expect(resolveSchemaTone(s, '#111')).toBe('#4F8EF7');
  });

  it('uses strokeColor when borderColor is absent', () => {
    const s = schema({ strokeColor: '#F59E0B' });
    expect(resolveSchemaTone(s, '#111')).toBe('#F59E0B');
  });

  it('uses color when ownerColor, borderColor and strokeColor are absent', () => {
    const s = schema({ color: '#7B61FF' });
    expect(resolveSchemaTone(s, '#111')).toBe('#7B61FF');
  });

  it('returns fallback when the schema has no color at all', () => {
    const s = schema({ type: 'unknown_type_xyz' });
    expect(resolveSchemaTone(s, '#FALLBK')).toBe('#FALLBK');
  });

  it('ownerColor does NOT change when a different recipient is active (identity preserved)', () => {
    const s = schema({ ownerColor: '#111111', type: 'text' });
    expect(resolveSchemaTone(s, '#000')).toBe('#111111');
  });
});

describe('resolveSchemaToneSurface', () => {
  it('returns the same owner surface used by the field chrome contract', () => {
    const s = schema({ userColor: '#FF0000' });
    const surface = resolveSchemaToneSurface(s, '#000');
    expect(surface).toBe(
      resolveSchemaVisualTone(s, { fallbackColor: '#000' }).ownerBackground,
    );
  });

  it('applies default alpha 0.14 through color-mix instead of opacity', () => {
    const s = schema({ userColor: '#0000FF' });
    const surface = resolveSchemaToneSurface(s, '#000');
    expect(surface).toMatch(/^color-mix\(in srgb,/);
    expect(surface).toContain('14%');
  });

  it('accepts custom alpha', () => {
    const s = schema({ userColor: '#00FF00' });
    const surface = resolveSchemaToneSurface(s, '#000', 0.5);
    expect(surface).toBe('color-mix(in srgb, #00FF00 50%, white)');
  });

  it('clamps alpha to max 1', () => {
    const s = schema({ userColor: '#FFFFFF' });
    const surface = resolveSchemaToneSurface(s, '#000', 2.0);
    expect(surface).toBe('color-mix(in srgb, #FFFFFF 100%, white)');
  });

  it('clamps alpha to min 0', () => {
    const s = schema({ userColor: '#FFFFFF' });
    const surface = resolveSchemaToneSurface(s, '#000', -0.1);
    expect(surface).toBe('color-mix(in srgb, #FFFFFF 0%, white)');
  });
});

import { describe, it, expect } from 'vitest';
import {
  resolveSchemaTone,
  resolveSchemaToneSurface,
} from '@/sisad-pdfme/ui/components/Designer/shared/schemaTone.js';

const schema = (overrides: Record<string, unknown> = {}) =>
  ({ type: 'text', ...overrides } as Parameters<typeof resolveSchemaTone>[0]);

describe('resolveSchemaTone', () => {
  it('returns userColor when set (highest priority)', () => {
    const s = schema({ userColor: '#FF0000', ownerColor: '#00FF00', type: 'text' });
    expect(resolveSchemaTone(s, '#000')).toBe('#FF0000');
  });

  it('returns ownerColor when userColor absent', () => {
    const s = schema({ ownerColor: '#AABBCC', type: 'text' });
    expect(resolveSchemaTone(s, '#000')).toBe('#AABBCC');
  });

  it('falls through to type tone for text schema', () => {
    const s = schema({ type: 'text' });
    expect(resolveSchemaTone(s, '#111')).toBe('#4F8EF7');
  });

  it('returns type tone for number', () => {
    const s = schema({ type: 'number' });
    expect(resolveSchemaTone(s, '#111')).toBe('#F59E0B');
  });

  it('returns type tone for signature', () => {
    const s = schema({ type: 'signature' });
    expect(resolveSchemaTone(s, '#111')).toBe('#F59E0B');
  });

  it('returns fallback for unknown type with no color', () => {
    const s = schema({ type: 'unknown_type_xyz' });
    expect(resolveSchemaTone(s, '#FALLBK')).toBe('#FALLBK');
  });

  it('returns borderColor when present and userColor/ownerColor absent', () => {
    const s = schema({ borderColor: '#123456', type: 'text' });
    expect(resolveSchemaTone(s, '#000')).toBe('#123456');
  });

  it('ownerColor does NOT change when a different recipient is active (identity preserved)', () => {
    const s = schema({ ownerColor: '#111111', type: 'text' });
    expect(resolveSchemaTone(s, '#000')).toBe('#111111');
  });
});

describe('resolveSchemaToneSurface', () => {
  it('returns rgba string from hex tone', () => {
    const s = schema({ userColor: '#FF0000' });
    const surface = resolveSchemaToneSurface(s, '#000');
    expect(surface).toMatch(/^rgba\(255, 0, 0,/);
  });

  it('applies default alpha 0.14', () => {
    const s = schema({ userColor: '#0000FF' });
    const surface = resolveSchemaToneSurface(s, '#000');
    expect(surface).toContain('0.14');
  });

  it('accepts custom alpha', () => {
    const s = schema({ userColor: '#00FF00' });
    const surface = resolveSchemaToneSurface(s, '#000', 0.5);
    expect(surface).toContain('0.5');
  });

  it('clamps alpha to max 1', () => {
    const s = schema({ userColor: '#FFFFFF' });
    const surface = resolveSchemaToneSurface(s, '#000', 2.0);
    expect(surface).toContain('1)');
  });

  it('clamps alpha to min 0', () => {
    const s = schema({ userColor: '#FFFFFF' });
    const surface = resolveSchemaToneSurface(s, '#000', -0.1);
    expect(surface).toContain('0)');
  });
});

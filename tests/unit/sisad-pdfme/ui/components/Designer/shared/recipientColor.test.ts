import { describe, it, expect } from 'vitest';
import {
  normalizeHexColor,
  resolveRecipientColor,
  resolveAllRecipientColors,
} from '@/sisad-pdfme/ui/components/Designer/shared/recipientColor.js';

// ─── normalizeHexColor ────────────────────────────────────────────────────────

describe('normalizeHexColor', () => {
  it('normalizes 6-digit hex to uppercase', () => {
    expect(normalizeHexColor('#2563eb')).toBe('#2563EB');
  });

  it('expands 3-digit shorthand to 6-digit', () => {
    expect(normalizeHexColor('#ABC')).toBe('#AABBCC');
  });

  it('strips alpha from 8-digit hex', () => {
    expect(normalizeHexColor('#2563EBFF')).toBe('#2563EB');
  });

  it('returns null for invalid input', () => {
    expect(normalizeHexColor('red')).toBeNull();
    expect(normalizeHexColor('')).toBeNull();
    expect(normalizeHexColor(null)).toBeNull();
    expect(normalizeHexColor(123)).toBeNull();
  });

  it('returns null when no leading #', () => {
    expect(normalizeHexColor('AABBCC')).toBeNull();
  });
});

// ─── resolveRecipientColor ────────────────────────────────────────────────────

describe('resolveRecipientColor', () => {
  const recipients = [
    { id: 'rec-1', color: '#FF0000' },
    { id: 'rec-2', color: null },
    { id: 'rec-3' },
  ];

  it('returns explicit color with source=explicit', () => {
    const token = resolveRecipientColor('rec-1', recipients);
    expect(token.color).toBe('#FF0000');
    expect(token.source).toBe('explicit');
  });

  it('returns palette color for recipient without explicit color', () => {
    const token = resolveRecipientColor('rec-2', recipients);
    expect(token.source).toBe('palette');
    expect(typeof token.color).toBe('string');
    expect(token.color).toMatch(/^#/);
  });

  it('returns fallback for unknown recipientId', () => {
    const token = resolveRecipientColor('rec-unknown', recipients);
    expect(token.source).toBe('fallback');
  });

  it('returns fallback for null/empty recipientId', () => {
    expect(resolveRecipientColor(null, recipients).source).toBe('fallback');
    expect(resolveRecipientColor('', recipients).source).toBe('fallback');
  });

  it('palette color is stable across calls (deterministic)', () => {
    const a = resolveRecipientColor('rec-2', recipients);
    const b = resolveRecipientColor('rec-2', recipients);
    expect(a.color).toBe(b.color);
  });

  it('honors custom fallbackColor', () => {
    const token = resolveRecipientColor('rec-unknown', recipients, { fallbackColor: '#CUSTOM' });
    expect(token.color).toBe('#CUSTOM');
  });
});

// ─── resolveAllRecipientColors ────────────────────────────────────────────────

describe('resolveAllRecipientColors', () => {
  it('returns one token per recipient', () => {
    const recipients = [
      { id: 'a', color: '#FF0000' },
      { id: 'b' },
      { id: 'c' },
    ];
    const tokens = resolveAllRecipientColors(recipients);
    expect(tokens).toHaveLength(3);
  });

  it('keeps explicit colors', () => {
    const recipients = [{ id: 'a', color: '#FF0000' }];
    const tokens = resolveAllRecipientColors(recipients);
    expect(tokens[0].color).toBe('#FF0000');
    expect(tokens[0].source).toBe('explicit');
  });

  it('all tokens have a color starting with #', () => {
    const recipients = Array.from({ length: 5 }, (_, i) => ({ id: `r-${i}` }));
    const tokens = resolveAllRecipientColors(recipients);
    expect(tokens.every((t) => t.color.startsWith('#'))).toBe(true);
  });

  it('returns empty array for empty recipients', () => {
    expect(resolveAllRecipientColors([])).toHaveLength(0);
  });
});

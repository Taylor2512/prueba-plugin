import { normalizeText } from '@sisad-pdfme/shared/text';

export const normalizeHexColor = (rawColor: unknown) => {
  const value = normalizeText(rawColor);
  if (!value || value[0] !== '#') return null;

  const shorthand = /^#([0-9a-fA-F]{3})$/;
  const standard = /^#([0-9a-fA-F]{6})$/;
  const alpha = /^#([0-9a-fA-F]{8})$/;

  if (shorthand.test(value)) {
    const match = value.match(shorthand);
    if (!match) return null;
    const hex = match[1];
    return `#${hex
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
      .toUpperCase()}`;
  }

  if (standard.test(value)) {
    const match = value.match(standard);
    return match ? `#${match[1].toUpperCase()}` : null;
  }

  if (alpha.test(value)) {
    const match = value.match(alpha);
    return match ? `#${match[1].slice(0, 6).toUpperCase()}` : null;
  }

  return null;
};

// ── Recipient color resolution ─────────────────────────────────────────────

const DEFAULT_RECIPIENT_PALETTE: readonly string[] = [
  '#2563EB',
  '#DC2626',
  '#16A34A',
  '#D97706',
  '#7C3AED',
  '#0891B2',
  '#DB2777',
  '#65A30D',
  '#EA580C',
  '#0D9488',
];

const DEFAULT_FALLBACK_COLOR = '#6B7280';

export type RecipientColorToken = {
  recipientId: string;
  color: string;
  source: 'explicit' | 'palette' | 'fallback';
};

/**
 * Resolves a stable, unique color for a recipient.
 *
 * Priority:
 *  1. Explicit color on the recipient model.
 *  2. Deterministic palette slot based on position in the recipients array.
 *  3. Fallback color.
 *
 * The result is stable: calling this with the same arguments always returns
 * the same color, regardless of render order or component lifecycle.
 */
export function resolveRecipientColor(
  recipientId: string | null | undefined,
  recipients: ReadonlyArray<{ id: string; color?: string | null }>,
  options?: {
    fallbackColor?: string;
    palette?: string[];
  },
): RecipientColorToken {
  const id = normalizeText(recipientId);
  const fallback = options?.fallbackColor ?? DEFAULT_FALLBACK_COLOR;
  const palette = options?.palette ?? DEFAULT_RECIPIENT_PALETTE;

  if (!id) {
    return { recipientId: '', color: fallback, source: 'fallback' };
  }

  const index = recipients.findIndex((r) => r.id === id);
  const recipient = index >= 0 ? recipients[index] : null;

  const explicit = normalizeHexColor(recipient?.color);
  if (explicit) {
    return { recipientId: id, color: explicit, source: 'explicit' };
  }

  if (index >= 0 && palette.length > 0) {
    const paletteColor = palette[index % palette.length];
    return { recipientId: id, color: paletteColor, source: 'palette' };
  }

  return { recipientId: id, color: fallback, source: 'fallback' };
}

/**
 * Resolves colors for all recipients, ensuring uniqueness across palette slots.
 * Recipients with explicit colors keep them. The rest get palette slots by
 * their position, skipping colors already taken by explicit recipients.
 */
export function resolveAllRecipientColors(
  recipients: ReadonlyArray<{ id: string; color?: string | null }>,
  options?: {
    fallbackColor?: string;
    palette?: string[];
  },
): RecipientColorToken[] {
  const fallback = options?.fallbackColor ?? DEFAULT_FALLBACK_COLOR;
  const palette = options?.palette ?? DEFAULT_RECIPIENT_PALETTE;

  const explicitColors = new Set<string>();
  for (const r of recipients) {
    const hex = normalizeHexColor(r.color);
    if (hex) explicitColors.add(hex.toUpperCase());
  }

  const availablePaletteSlots = palette.filter(
    (c) => !explicitColors.has(c.toUpperCase()),
  );

  let paletteIndex = 0;
  return recipients.map((r) => {
    const id = normalizeText(r.id);
    if (!id) return { recipientId: id, color: fallback, source: 'fallback' as const };

    const explicit = normalizeHexColor(r.color);
    if (explicit) {
      return { recipientId: id, color: explicit, source: 'explicit' as const };
    }

    if (paletteIndex < availablePaletteSlots.length) {
      const color = availablePaletteSlots[paletteIndex++];
      return { recipientId: id, color, source: 'palette' as const };
    }

    return { recipientId: id, color: fallback, source: 'fallback' as const };
  });
}

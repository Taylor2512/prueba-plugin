import type { CSSProperties } from 'react';
import type { CollaboratorUser } from './recipientPalette.js';

const normalizeId = (value: unknown): string =>
  typeof value === 'string' ? value.trim() : '';

/** Finds a collaborator by id (trimmed match). Returns null when not found. */
export function resolveCollaboratorById<T extends CollaboratorUser>(
  collaboratorId: unknown,
  users: T[] = [],
): T | null {
  const normalizedId = normalizeId(collaboratorId);
  if (!normalizedId) return null;
  return users.find((user) => normalizeId(user?.id) === normalizedId) || null;
}

/**
 * Returns an rgba() string for a #RRGGBB color at the given alpha. Non-6-digit
 * colors are returned unchanged.
 */
export function withAlpha(color: string, alpha: number): string {
  if (typeof color !== 'string') return color;
  const normalized = color.trim();
  if (!/^#([0-9a-fA-F]{6})$/.test(normalized)) return normalized;

  const hex = normalized.slice(1);
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

/**
 * Builds the inline style for a collaborator chip (text color + translucent
 * background + inset ring). Returns undefined for an empty/invalid color.
 */
export function buildCollaboratorChipStyle(
  color: string,
  isActive = false,
): CSSProperties | undefined {
  if (typeof color !== 'string') return undefined;

  const normalized = color.trim();
  if (!normalized) return undefined;

  const alpha = isActive ? 0.18 : 0.1;
  const ringAlpha = isActive ? 0.45 : 0.25;

  return {
    color: normalized,
    backgroundColor: withAlpha(normalized, alpha),
    boxShadow: `inset 0 0 0 1px ${withAlpha(normalized, ringAlpha)}`,
  };
}

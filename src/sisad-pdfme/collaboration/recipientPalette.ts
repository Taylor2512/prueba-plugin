import { normalizeHexColor } from '../ui/components/Designer/shared/recipientColor.js';

/**
 * Default collaborator palette inherited from the lab. Preserved verbatim so
 * migrating from `features/pdfcomponent` does not shift any recipient color.
 */
export const LAB_COLLABORATOR_PALETTE: readonly string[] = [
  '#2563EB',
  '#D946EF',
  '#F97316',
  '#0F766E',
  '#CA8A04',
  '#7C3AED',
  '#DC2626',
  '#0891B2',
  '#65A30D',
  '#DB2777',
];

export type CollaboratorUser = {
  id?: string | null;
  color?: string | null;
  [key: string]: unknown;
};

export type RecipientAppearanceOptions = {
  /** Palette used to assign colors. Defaults to `LAB_COLLABORATOR_PALETTE`. */
  palette?: readonly string[];
  /** Keep an explicit (valid hex) color already set on a user. Default true. */
  preserveExplicitColor?: boolean;
};

/**
 * Assigns a stable color to each collaborator. Users with a valid explicit hex
 * keep it (normalized to #RRGGBB); the rest get palette slots that skip colors
 * already claimed by explicit users. Behavior matches the  lab
 * `decorateCollaborationUsers` when called with the default palette.
 */
export function decorateCollaborationUsers<T extends CollaboratorUser>(
  users: T[] = [],
  options: RecipientAppearanceOptions = {},
): T[] {
  const palette = options.palette ?? LAB_COLLABORATOR_PALETTE;
  const preserveExplicit = options.preserveExplicitColor ?? true;

  const explicitColors = new Set<string>();
  if (preserveExplicit) {
    for (const user of users) {
      const hex = normalizeHexColor(user?.color);
      if (hex) explicitColors.add(hex.toUpperCase());
    }
  }

  const availableSlots = palette.filter(
    (c) => !explicitColors.has(c.toUpperCase()),
  );

  let paletteIndex = 0;
  return users.map((user) => {
    const explicit = preserveExplicit ? normalizeHexColor(user?.color) : null;
    if (explicit) return { ...user, color: explicit };

    const assigned =
      availableSlots[paletteIndex % availableSlots.length] ||
      palette[paletteIndex % palette.length];
    paletteIndex += 1;
    return { ...user, color: assigned };
  });
}

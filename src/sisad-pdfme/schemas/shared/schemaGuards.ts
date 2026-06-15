/**
 * Type guards for sisad-pdfme schema families.
 * Replace `(schema as any).options` patterns with safe narrowing.
 *
 * All guards operate on `Record<string, unknown>` so they work at
 * JSON/snapshot boundaries without requiring the full `Schema` zod type.
 */

export type MinimalSchema = Record<string, unknown>;

// ─── option-based ─────────────────────────────────────────────────────────────

export type OptionGroupSchemaLike = MinimalSchema & {
  type: 'checkboxGroup' | 'radioGroup';
  options?: unknown[];
};

export type CheckboxGroupSchemaLike = OptionGroupSchemaLike & {
  type: 'checkboxGroup';
};

export type RadioGroupSchemaLike = OptionGroupSchemaLike & {
  type: 'radioGroup';
};

export function isOptionGroupSchema(
  schema: MinimalSchema,
): schema is OptionGroupSchemaLike {
  return schema.type === 'checkboxGroup' || schema.type === 'radioGroup';
}

export function isCheckboxGroupSchema(
  schema: MinimalSchema,
): schema is CheckboxGroupSchemaLike {
  return schema.type === 'checkboxGroup';
}

export function isRadioGroupSchema(
  schema: MinimalSchema,
): schema is RadioGroupSchemaLike {
  return schema.type === 'radioGroup';
}

export function isSelectSchema(schema: MinimalSchema): boolean {
  return schema.type === 'select' || schema.type === 'dropdown';
}

export function isOptionBasedSchema(schema: MinimalSchema): boolean {
  return (
    isOptionGroupSchema(schema) ||
    isSelectSchema(schema)
  );
}

// ─── boolean ─────────────────────────────────────────────────────────────────

export function isCheckboxSchema(schema: MinimalSchema): boolean {
  return schema.type === 'checkbox';
}

// ─── action-based ─────────────────────────────────────────────────────────────

export type ActionKind = 'approve' | 'decline' | 'note' | 'attachment';

export function isActionSchema(
  schema: MinimalSchema,
): schema is MinimalSchema & { type: ActionKind } {
  return (
    schema.type === 'approve' ||
    schema.type === 'decline' ||
    schema.type === 'note' ||
    schema.type === 'attachment'
  );
}

// ─── signing-based ───────────────────────────────────────────────────────────

export type SigningKind = 'signature' | 'initials' | 'dateSigned';

export function isSigningSchema(
  schema: MinimalSchema,
): schema is MinimalSchema & { type: SigningKind } {
  return (
    schema.type === 'signature' ||
    schema.type === 'initials' ||
    schema.type === 'dateSigned'
  );
}

// ─── text-like ────────────────────────────────────────────────────────────────

export type TextLikeKind =
  | 'text'
  | 'number'
  | 'date'
  | 'dateTime'
  | 'time'
  | 'fullName'
  | 'email'
  | 'company'
  | 'title';

export function isTextLikeSchema(
  schema: MinimalSchema,
): schema is MinimalSchema & { type: TextLikeKind } {
  const TEXT_LIKE_TYPES: ReadonlySet<string> = new Set([
    'text', 'number', 'date', 'dateTime', 'time',
    'fullName', 'email', 'company', 'title',
  ]);
  return typeof schema.type === 'string' && TEXT_LIKE_TYPES.has(schema.type);
}

// ─── Options array ────────────────────────────────────────────────────────────

export type RawOptionItem = {
  optionId: string;
  label: string;
  value?: string;
  disabled?: boolean;
};

/** Narrows an unknown item to RawOptionItem if it has the required optionId+label. */
export function isRawOptionItem(item: unknown): item is RawOptionItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as Record<string, unknown>).optionId === 'string' &&
    typeof (item as Record<string, unknown>).label === 'string'
  );
}

/** Returns schema.options as RawOptionItem[] — safe at JSON boundaries. */
export function getSchemaOptions(schema: MinimalSchema): RawOptionItem[] {
  if (!Array.isArray(schema.options)) return [];
  return schema.options.filter(isRawOptionItem);
}

// ─── Identity lookup ────────────────────────────────────────────────────────

export type SchemaIdentityLike = MinimalSchema & {
  type?: string;
  name?: string | null;
  position?: { x?: number | null; y?: number | null } | null;
};

/**
 * Resolves a schema id from the most common identity fields.
 * Useful for prop panels where the active schema may not carry `id`
 * but the surrounding list does.
 */
export function resolveSchemaIdByIdentity(
  schemas: SchemaIdentityLike[],
  schema: SchemaIdentityLike,
): string | undefined {
  if (typeof schema.id === 'string' && schema.id.trim()) return schema.id;

  return schemas.find(
    (candidate) =>
      candidate.type === schema.type &&
      candidate.name === schema.name &&
      candidate.position?.x === schema.position?.x &&
      candidate.position?.y === schema.position?.y,
  )?.id as string | undefined;
}

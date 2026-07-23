/**
 * Shared TypeScript types for sisad-pdfme schemas.
 * Reduces `any` usage across schemas without breaking existing contracts.
 */

// ─── Utility ──────────────────────────────────────────────────────────────────

type UnknownRecord = Record<string, unknown>;

// ─── Branded primitives ───────────────────────────────────────────────────────
// Brand<T, B> prevents passing a raw string where a typed ID is expected.
// Opt-in: existing code uses `string` everywhere; these are additive.

type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand };

type SchemaUid   = Brand<string, 'SchemaUid'>;
type DocumentId  = Brand<string, 'DocumentId'>;
type RecipientId = Brand<string, 'RecipientId'>;
type OptionId    = Brand<string, 'OptionId'>;
type GroupId     = Brand<string, 'GroupId'>;

// ─── Visual taxonomy ──────────────────────────────────────────────────────────

export type SchemaVisualFamily =
  | 'text-like'
  | 'option-based'
  | 'boolean'
  | 'signing-based'
  | 'action-based'
  | 'media'
  | 'shape'
  | 'table'
  | 'advanced';

export type SchemaVisualState =
  | 'idle'
  | 'hover'
  | 'selected'
  | 'multi-selected'
  | 'readonly'
  | 'locked'
  | 'invalid'
  | 'required';

// ─── Field groups ─────────────────────────────────────────────────────────────

type SchemaGeometryFields = {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rotation?: number;
};

type SchemaIdentityFields = {
  schemaUid?: string;
  id?: string;
  type?: string;
  name?: string;
  label?: string;
};

type SchemaOwnershipFields = {
  ownerRecipientId?: string;
  recipientId?: string;
  ownerColor?: string;
  recipientColor?: string;
};

type SchemaDocumentFields = {
  documentId?: string;
  pageNumber?: number;
  pageIndex?: number;
};

type SchemaBehaviorFields = {
  required?: boolean;
  readOnly?: boolean;
  readonly?: boolean;
  locked?: boolean;
  hidden?: boolean;
};

// ─── Base schema ──────────────────────────────────────────────────────────────

/**
 * `BaseSchema<TType>` — lightweight typed base for schema objects.
 * Includes required `type` for discriminated unions. Use when creating
 * new schema types or factory functions. Does NOT carry the index signature
 * required by `Plugin<T>` — pair with `& Schema` at plugin definition sites.
 */
type BaseSchema<TType extends string = string> = {
  type: TType;
  id?: string;
  schemaUid?: string;
  name?: string;
  label?: string;
  documentId?: string;
  pageNumber?: number;
  pageIndex?: number;
  ownerRecipientId?: string;
  recipientId?: string;
  ownerColor?: string;
  recipientColor?: string;
  required?: boolean;
  readOnly?: boolean;
  readonly?: boolean;
  locked?: boolean;
  hidden?: boolean;
};

export type SisadSchemaBase<TExtra extends UnknownRecord = UnknownRecord> =
  SchemaIdentityFields &
  SchemaGeometryFields &
  SchemaOwnershipFields &
  SchemaDocumentFields &
  SchemaBehaviorFields &
  TExtra &
  UnknownRecord;

// ─── Option schemas ───────────────────────────────────────────────────────────

type OptionItem<TValue extends string = string> = {
  optionId: string;
  label: string;
  value: TValue;
  order?: number;
  disabled?: boolean;
};

type OptionSelectionMode = 'single' | 'multiple';

type OptionBasedSchema<
  TValue extends string = string,
  TOption extends OptionItem<TValue> = OptionItem<TValue>,
  TExtra extends UnknownRecord = UnknownRecord,
> = SisadSchemaBase<TExtra> & {
  options: TOption[];
  selectionMode?: OptionSelectionMode;
  selectedOptionId?: TValue | null;
  selectedOptionIds?: TValue[];
  selectedValue?: TValue | null;
  defaultValue?: TValue | null;
  placeholder?: string;
  groupId?: string;
};

// ─── Action schema base ───────────────────────────────────────────────────────

export type ActionSchemaBase<TExtra extends UnknownRecord = UnknownRecord> =
  SisadSchemaBase<TExtra> & {
    label?: string;
    buttonColor?: string;
    buttonTextColor?: string;
    fontSize?: number;
  };

export type ActionSchemaKind = 'approve' | 'decline' | 'note' | 'attachment';

export type SemanticTone = 'success' | 'danger' | 'info' | 'warning' | 'neutral';

// ─── Signing schema base ──────────────────────────────────────────────────────

type SigningSchemaBase<TExtra extends UnknownRecord = UnknownRecord> =
  SisadSchemaBase<TExtra> & {
    signatureKind?: 'signature' | 'initials' | 'date';
    placeholderText?: string;
    strokeColor?: string;
    borderColor?: string;
    backgroundColor?: string;
  };

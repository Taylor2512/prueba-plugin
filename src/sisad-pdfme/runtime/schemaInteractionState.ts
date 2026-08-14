export type SchemaInteractionOrigin =
  | 'initial'
  | 'user'
  | 'host'
  | 'prefill'
  | 'restore'
  | 'migration'
  | 'system';

export type SchemaCompletionPolicy = {
  required?: boolean;
  interactionRequired?: boolean;
  validate?: (value: unknown) => boolean;
  complete?: (value: unknown, state: SchemaInteractionState) => boolean;
};

export type SchemaInteractionState = {
  schemaUid: string;
  schemaName: string;
  schemaType: string;
  touched: boolean;
  dirty: boolean;
  committed: boolean;
  valid: boolean;
  completed: boolean;
  interactionCount: number;
  initialValue: unknown;
  currentValue: unknown;
  lastOrigin: SchemaInteractionOrigin;
  revision: number;
  lastTransactionId?: string;
};

const hasValue = (value: unknown): boolean => {
  if (value === undefined || value === null || value === '') return false;
  return !Array.isArray(value) || value.length > 0;
};

export const resolveSchemaCompletion = (
  value: unknown,
  state: SchemaInteractionState,
  policy: SchemaCompletionPolicy = {},
): boolean => {
  if (policy.complete) return policy.complete(value, state);
  if (policy.interactionRequired && !state.touched) return false;
  return !policy.required || hasValue(value);
};

export const resolveSchemaValidity = (
  value: unknown,
  policy: SchemaCompletionPolicy = {},
): boolean => policy.validate ? policy.validate(value) : !policy.required || hasValue(value);

export const createSchemaInteractionState = (input: {
  schemaUid: string;
  schemaName: string;
  schemaType: string;
  initialValue: unknown;
  revision?: number;
  policy?: SchemaCompletionPolicy;
}): SchemaInteractionState => {
  const state: SchemaInteractionState = {
    schemaUid: input.schemaUid,
    schemaName: input.schemaName,
    schemaType: input.schemaType,
    touched: false,
    dirty: false,
    committed: false,
    valid: resolveSchemaValidity(input.initialValue, input.policy),
    completed: false,
    interactionCount: 0,
    initialValue: input.initialValue,
    currentValue: input.initialValue,
    lastOrigin: 'initial',
    revision: input.revision ?? 0,
  };
  state.completed = resolveSchemaCompletion(input.initialValue, state, input.policy);
  return state;
};

export const applySchemaInteraction = (
  previous: SchemaInteractionState,
  value: unknown,
  origin: SchemaInteractionOrigin,
  policy: SchemaCompletionPolicy = {},
  transaction?: { revision?: number; transactionId?: string; committed?: boolean },
): SchemaInteractionState => {
  const next: SchemaInteractionState = {
    ...previous,
    currentValue: value,
    touched: previous.touched || origin === 'user',
    dirty: value !== previous.initialValue,
    committed: transaction?.committed ?? (previous.committed || origin !== 'initial'),
    valid: resolveSchemaValidity(value, policy),
    interactionCount: previous.interactionCount + (origin === 'user' ? 1 : 0),
    lastOrigin: origin,
    revision: transaction?.revision ?? previous.revision + 1,
    lastTransactionId: transaction?.transactionId ?? previous.lastTransactionId,
  };
  next.completed = resolveSchemaCompletion(value, next, policy);
  return next;
};

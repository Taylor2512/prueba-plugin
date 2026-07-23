// Utilities to adapt legacy schema storage shapes into typed values

type SchemaRecord = Record<string, unknown>;

const getSchemaTextValue = (schema: SchemaRecord): string => {
  if (schema == null) return '';
  if (typeof schema.content === 'string') return schema.content;
  if (schema.checked != null) return schema.checked ? 'true' : 'false';
  return '';
};

export const getSchemaNumberValue = (schema: SchemaRecord): number | undefined => {
  const raw = schema?.content;
  if (raw == null || raw === '') return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const getSchemaBooleanValue = (schema: SchemaRecord): boolean => {
  if (schema == null) return false;
  if (typeof schema.checked === 'boolean') return schema.checked;
  const c = schema.content;
  if (typeof c === 'string') return c === 'true' || c === '1';
  return Boolean(c);
};

export const getSchemaOptionSelection = (schema: SchemaRecord): { single?: string | null; multiple?: string[] } => {
  const rawSingle = schema?.selectedOptionId ?? schema?.content ?? null;
  const single = typeof rawSingle === 'string' ? rawSingle : null;

  const rawMultiple = schema?.selectedOptionIds;
  if (Array.isArray(rawMultiple)) {
    return { single, multiple: rawMultiple as string[] };
  }

  const content = schema?.content;
  if (typeof content === 'string' && content.includes(',')) {
    return { single, multiple: content.split(',').map((s) => s.trim()).filter(Boolean) };
  }

  return { single };
};


// Utilities to adapt legacy schema storage shapes into typed values

export const getSchemaTextValue = (schema: Record<string, any>): string => {
  if (schema == null) return '';
  if (typeof schema.content === 'string') return schema.content;
  if (schema.checked != null) return schema.checked ? 'true' : 'false';
  return '';
};

export const getSchemaNumberValue = (schema: Record<string, any>): number | undefined => {
  const raw = schema?.content;
  if (raw == null || raw === '') return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const getSchemaBooleanValue = (schema: Record<string, any>): boolean => {
  if (schema == null) return false;
  if (typeof schema.checked === 'boolean') return schema.checked;
  const c = schema.content;
  if (typeof c === 'string') return c === 'true' || c === '1';
  return Boolean(c);
};

export const getSchemaOptionSelection = (schema: Record<string, any>): { single?: string | null; multiple?: string[] } => {
  const single = schema?.selectedOptionId || schema?.content || null;
  const multiple = Array.isArray(schema?.selectedOptionIds)
    ? schema.selectedOptionIds
    : typeof schema?.content === 'string' && schema.content.includes(',')
    ? schema.content.split(',').map((s: string) => s.trim()).filter(Boolean)
    : undefined;

  return { single, multiple };
};

export default {
  getSchemaTextValue,
  getSchemaNumberValue,
  getSchemaBooleanValue,
  getSchemaOptionSelection,
};

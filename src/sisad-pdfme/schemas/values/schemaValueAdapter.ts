/**
 * Adapta las formas de almacenamiento de un schema a valores tipados.
 *
 * Ámbito real: hoy solo lo consume `generator/preflight`. El runtime de
 * formulario NO pasa por aquí — sus valores viajan como `string` por
 * `PreviewUI.inputs` —, así que este módulo decide sobre validación previa a
 * la generación de PDF, no sobre lo que el usuario ve mientras escribe.
 */

type SchemaRecord = Record<string, unknown>;

export const getSchemaNumberValue = (schema: SchemaRecord): number | undefined => {
  const raw = schema?.content;
  if (raw == null || raw === '') return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
};

/**
 * Resuelve el valor booleano de un schema.
 *
 * `checked` manda cuando existe: un `false` explícito es un valor, no un vacío.
 * Para el resto se decide por tipo en lugar de por truthiness, porque
 * `Boolean(value)` daba `true` para `[]` y `{}` — formas que aquí significan
 * "sin selección", no "marcado".
 */
export const getSchemaBooleanValue = (schema: SchemaRecord): boolean => {
  if (schema == null) return false;
  if (typeof schema.checked === 'boolean') return schema.checked;
  const c = schema.content;
  if (typeof c === 'boolean') return c;
  if (typeof c === 'string') return c === 'true' || c === '1';
  if (typeof c === 'number') return Number.isFinite(c) && c !== 0;
  if (Array.isArray(c)) return c.length > 0;
  return false;
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


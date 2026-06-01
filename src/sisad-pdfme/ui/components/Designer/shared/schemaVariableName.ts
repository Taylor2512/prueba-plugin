const KNOWN_PREFIXES: Record<string, string> = {
  text: 'texto',
  image: 'imagen',
  signature: 'firma',
  radioGroup: 'radio',
  checkbox: 'casilla',
  select: 'lista',
  date: 'fecha',
  time: 'hora',
  rectangle: 'rectangulo',
  line: 'linea',
};

const sanitizePrefix = (value: unknown) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'campo';

export const getSchemaVariablePrefix = (schemaType: unknown) => {
  const normalizedType = String(schemaType || '').trim();
  if (!normalizedType) return 'campo';
  return KNOWN_PREFIXES[normalizedType] || sanitizePrefix(normalizedType);
};

export const createUniqueSchemaVariableName = (
  schemaType: unknown,
  existingNames: string[] = [],
  minDigits = 2,
) => {
  const prefix = getSchemaVariablePrefix(schemaType);
  const normalizedPrefix = prefix.toLowerCase();
  const matcher = new RegExp(`^${normalizedPrefix}_(\\d+)$`, 'i');

  const maxIndex = existingNames.reduce((max, currentName) => {
    const match = String(currentName || '').trim().match(matcher);
    if (!match?.[1]) return max;
    const parsed = Number(match[1]);
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);

  const nextIndex = maxIndex + 1;
  const digits = Math.max(1, Number(minDigits) || 2);
  return `${prefix}_${String(nextIndex).padStart(digits, '0')}`;
};

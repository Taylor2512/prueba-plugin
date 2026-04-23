const DEFAULT_SCHEMA_PREFIX = 'campo';

const TYPE_PREFIX_MAP: Record<string, string> = {
  text: 'texto',
  multivariabletext: 'texto',
  textarea: 'texto',
  image: 'imagen',
  signature: 'firma',
  checkbox: 'check',
  radiogroup: 'radio',
  select: 'seleccion',
  date: 'fecha',
  table: 'tabla',
  qrcode: 'qr',
  barcode: 'codigo',
  line: 'linea',
  rectangle: 'rectangulo',
  ellipse: 'elipse',
};

const normalizeTypeKey = (value: unknown): string => String(value || '').trim().toLowerCase();

const sanitizePrefix = (value: string): string => {
  const normalized = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();

  return normalized || DEFAULT_SCHEMA_PREFIX;
};

export const getSchemaVariablePrefix = (schemaType: unknown): string => {
  const typeKey = normalizeTypeKey(schemaType);
  if (!typeKey) return DEFAULT_SCHEMA_PREFIX;
  const mapped = TYPE_PREFIX_MAP[typeKey] || typeKey;
  return sanitizePrefix(mapped);
};

export const createUniqueSchemaVariableName = (
  schemaType: unknown,
  existingNames: unknown[] = [],
  minDigits = 2,
): string => {
  const prefix = getSchemaVariablePrefix(schemaType);
  const currentNames = new Set(
    existingNames
      .map((name) => String(name || '').trim().toLowerCase())
      .filter(Boolean),
  );

  let index = 1;
  while (index <= 9999) {
    const nextName = `${prefix}_${String(index).padStart(minDigits, '0')}`;
    if (!currentNames.has(nextName.toLowerCase())) return nextName;
    index += 1;
  }

  return `${prefix}_${Date.now()}`;
};

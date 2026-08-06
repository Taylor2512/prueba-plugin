import { getBuiltInFields, getSchemaFamily } from '@sisad-pdfme/schemas';

export const FAMILY_META = {
  text: {
    slug: 'text',
    title: 'Texto y campos simples',
    description: 'Ejemplos de texto, texto ampliado, prefills y campos de datos simples.',
  },
  multiVariableText: {
    slug: 'multi-variable-text',
    title: 'Texto multivariable',
    description: 'Un ejemplo dedicado al campo de texto multilineal y sus variantes de contenido.',
  },
  choice: {
    slug: 'choice',
    title: 'Selección',
    description: 'Select, radioGroup, checkbox y checkboxGroup con la misma base runtime.',
  },
  boolean: {
    slug: 'boolean',
    title: 'Booleanos',
    description: 'Checkbox como caso aislado para validar el flujo booleano con una ruta propia.',
  },
  dateTime: {
    slug: 'date-time',
    title: 'Fecha y hora',
    description: 'Casos de fecha, hora y fecha-hora renderizados como runtime editable.',
  },
  signature: {
    slug: 'signature',
    title: 'Firma',
    description: 'Firma dibujada, iniciales y fecha de firma en un mismo flujo de ejemplo.',
  },
  table: {
    slug: 'table',
    title: 'Tablas',
    description: 'La familia tabular con un layout compacto y repetible.',
  },
  barcode: {
    slug: 'barcode',
    title: 'Códigos de barras',
    description: 'Códigos 1D/2D agrupados de forma genérica y totalmente data-driven.',
  },
  media: {
    slug: 'media',
    title: 'Media',
    description: 'Imagen y SVG como campos visuales reutilizables.',
  },
  shape: {
    slug: 'shape',
    title: 'Formas',
    description: 'Línea, rectángulo y elipse como soporte de composición visual.',
  },
  action: {
    slug: 'action',
    title: 'Acciones',
    description: 'Attachment, note, approve y decline como acciones de flujo.',
  },
};

export const FAMILY_TYPE_ORDER = {
  text: ['text', 'number', 'fullName', 'emailAddress', 'company', 'title'],
  multiVariableText: ['multiVariableText'],
  choice: ['select', 'dropdown', 'radioGroup', 'checkboxGroup'],
  boolean: ['checkbox'],
  dateTime: ['date', 'time', 'dateTime'],
  signature: ['signature', 'initials', 'dateSigned'],
  table: ['table'],
  barcode: ['qrcode', 'japanpost', 'ean13', 'ean8', 'code39', 'code128', 'nw7', 'itf14', 'upca', 'upce', 'gs1datamatrix', 'pdf417'],
  media: ['image', 'svg'],
  shape: ['line', 'rectangle', 'ellipse'],
  action: ['attachment', 'note', 'approve', 'decline'],
};

const buildFamily = () => {
  const schemaTypesByFamily = new Map(Object.keys(FAMILY_META).map((key) => [key, []]));

  getBuiltInFields().forEach((definition) => {
    const family = getSchemaFamily(definition.type);
    if (!schemaTypesByFamily.has(family)) return;
    schemaTypesByFamily.get(family).push(definition.type);
  });

  return Object.entries(FAMILY_META).map(([key, meta]) => {
    const discoveredTypes = schemaTypesByFamily.get(key) ?? [];
    const seededTypes = FAMILY_TYPE_ORDER[key] || [];
    const types = Array.from(new Set([...seededTypes, ...discoveredTypes]));

    return {
      key,
      slug: meta.slug,
      title: meta.title,
      description: meta.description,
      types,
    };
  });
};

export const FAMILY = buildFamily();

export const typesOf = (keys) =>
  FAMILY.filter((family) => keys.includes(family.key)).flatMap((family) => family.types);

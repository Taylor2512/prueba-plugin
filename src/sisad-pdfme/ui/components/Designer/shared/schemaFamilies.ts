import { Schema } from '@sisad-pdfme/common';

/**
 * Familias de schemas que determinan capacidades de edición y comportamiento UI.
 */
export type SchemaFamily = 'static' | 'interactive' | 'layout' | 'dynamic';

/**
 * Mapeo de tipos de plugin a sus respectivas familias.
 */
const PLUGIN_FAMILY_MAP: Record<string, SchemaFamily> = {
  // Static: Solo lectura o puramente visuales
  text: 'static',
  number: 'static',
  multivariabletext: 'static',
  image: 'static',
  svg: 'static',
  line: 'static',
  rectangle: 'static',
  ellipse: 'static',
  
  // Interactive: Tienen estados internos o requieren interacción (ej: firmas, inputs)
  signature: 'interactive',
  checkbox: 'interactive',
  checkboxgroup: 'interactive',
  radio: 'interactive',
  dropdown: 'interactive',
  datepicker: 'interactive',
  
  // Layout: Contenedores que afectan a otros schemas
  'ui-section': 'layout',
  'ui-group': 'layout',
  
  // Dynamic: Contenido generado o dependiente de datos externos
  table: 'dynamic',
};

/**
 * Resuelve la familia a la que pertenece un schema según su tipo (type).
 */
export function resolveSchemaFamily(schema: Schema): SchemaFamily {
  return PLUGIN_FAMILY_MAP[schema.type] || 'static';
}

/**
 * Determina si un schema es un contenedor de layout.
 */
export function isLayoutSchema(schema: Schema): boolean {
  return resolveSchemaFamily(schema) === 'layout';
}

/**
 * Determina si un schema es de tipo interactivo.
 */
export function isInteractiveSchema(schema: Schema): boolean {
  return resolveSchemaFamily(schema) === 'interactive';
}

/**
 * Determina si un schema permite edición de contenido vs solo propiedades.
 */
export function canEditContent(schema: Schema): boolean {
  const family = resolveSchemaFamily(schema);
  return family === 'static' || family === 'interactive';
}

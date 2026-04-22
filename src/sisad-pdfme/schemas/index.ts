import multiVariableText from './multiVariableText/index.js';
import text from './text/index.js';
import image from './graphics/image.js';
import svg from './graphics/svg.js';
import barcodes from './barcodes/index.js';
import line from './shapes/line.js';
import table from './tables/index.js';
import { rectangle, ellipse } from './shapes/rectAndEllipse.js';
import dateTime from './date/dateTime.js';
import date from './date/date.js';
import time from './date/time.js';
import select from './select/index.js';
import radioGroup from './radioGroup/index.js';
import checkbox from './checkbox/index.js';
import signature from './signature/index.js';
import { flattenSchemaPlugins, listSchemaDefinitions } from './schemaBuilder.js';
import type { SchemaPluginMap } from './schemaBuilder.js';

const schemaPlugins: SchemaPluginMap = {
  text,
  multiVariableText,
  image,
  svg,
  signature,
  table,
  barcodes,
  line,
  rectangle,
  ellipse,
  dateTime,
  date,
  time,
  select,
  radioGroup,
  checkbox,
};
const flatSchemaPlugins = flattenSchemaPlugins(schemaPlugins);
const builtInPlugins = flatSchemaPlugins;
const builtInSchemaDefinitions = listSchemaDefinitions(schemaPlugins);
const builtInSchemaDefinitionsByType = Object.fromEntries(
  builtInSchemaDefinitions.map((definition) => [definition.type, definition]),
);

export {
  builtInPlugins,
  schemaPlugins,
  flatSchemaPlugins,
  builtInSchemaDefinitions,
  builtInSchemaDefinitionsByType,
  // schemas
  text,
  multiVariableText,
  image,
  svg,
  signature,
  table,
  barcodes,
  line,
  rectangle,
  ellipse,
  dateTime,
  date,
  time,
  select,
  radioGroup,
  checkbox,
};

export {
  createSchemaPlugin,
  renderLucideIcon as createLucideIcon,
  getSchemaDefinition,
  flattenSchemaPlugins,
  listSchemaDefinitions,
} from './schemaBuilder.js';
export type {
  SchemaDefinition,
  SchemaPluginWithMetadata,
  SchemaCapability,
  SchemaPluginMap,
  SchemaPluginEntry,
} from './schemaBuilder.js';

// Export utility functions
export {
  getDynamicHeightsForTable
} from './tables/dynamicTemplate.js';

export {
  createSvgStr,
  isEditable,
  readFile,
  convertForPdfLayoutProps,
  rotatePoint,
  addAlphaToHex,
  hex2RgbColor,
  hex2PrintingColor,
} from './utils.js';

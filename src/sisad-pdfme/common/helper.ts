/**
 * @file helper.ts
 *
 * Helpers comunes para conversión de unidades, fuentes, PDF base64, migración versionada
 * y validación Zod de contratos públicos.
 *
 * Responsabilidades:
 * - convertir mm/pt/px;
 * - cargar PDF base en data URI;
 * - validar template/inputs/options/props;
 * - migrar schemas  keyed-object a arreglo por página;
 * - validar fuentes y fallback font.
 */

import { z } from 'zod';
import {
  Schema,
  Template,
  Font,
  BasePdf,
  Plugins,
  BlankPdf,
  SchemaPageArray,
} from '@sisad-pdfme/common/types';
import {
  Inputs as InputsSchema,
  UIOptions as UIOptionsSchema,
  Template as TemplateSchema,
  PreviewProps as PreviewPropsSchema,
  DesignerProps as DesignerPropsSchema,
  GenerateProps as GeneratePropsSchema,
  UIProps as UIPropsSchema,
  BlankPdf as BlankPdfSchema,
} from '@sisad-pdfme/common/schema';
import {
  MM_TO_PT_RATIO,
  PT_TO_MM_RATIO,
  PT_TO_PX_RATIO,
  DEFAULT_FONT_NAME,
  DEFAULT_FONT_VALUE,
} from '@sisad-pdfme/common/constants';

/**
 * Clonado profundo usado como política común de inmutabilidad.
 *
 * `structuredClone` es la vía rápida, pero lanza `DataCloneError` ante valores
 * no estructurables —y `SisadPdfmeGlobalConfig.events` acepta callbacks del
 * host por contrato—. Un `config` legal con handlers hacía fallar
 * `migrateSisadPdfmeConfig` y `SisadPdfmeConfigService.update` (RTP-435).
 *
 * El fallback clona la estructura y pasa POR REFERENCIA lo que no es
 * clonable: una función es identidad del host, no dato a duplicar.
 */
const cloneStructural = <T>(value: T, seen: WeakMap<object, unknown>): T => {
  if (!value || typeof value !== 'object') return value;
  const objectValue = value as unknown as object;
  const cached = seen.get(objectValue);
  if (cached !== undefined) return cached as T;

  if (Array.isArray(value)) {
    const next: unknown[] = [];
    seen.set(objectValue, next);
    value.forEach((entry) => next.push(cloneStructural(entry, seen)));
    return next as unknown as T;
  }
  // Tipos estructurables comunes: se clonan de verdad. Aliasarlos sería un
  // riesgo real —mutar el clon mutaría el original— y basta con que el objeto
  // contenga UNA función en cualquier rama para caer aquí.
  if (value instanceof Date) return new Date(value.getTime()) as unknown as T;
  if (value instanceof RegExp) return new RegExp(value.source, value.flags) as unknown as T;
  if (value instanceof Map) {
    const next = new Map<unknown, unknown>();
    seen.set(objectValue, next);
    value.forEach((entry, key) => next.set(cloneStructural(key, seen), cloneStructural(entry, seen)));
    return next as unknown as T;
  }
  if (value instanceof Set) {
    const next = new Set<unknown>();
    seen.set(objectValue, next);
    value.forEach((entry) => next.add(cloneStructural(entry, seen)));
    return next as unknown as T;
  }
  if (ArrayBuffer.isView(value)) {
    const view = value as unknown as { slice?: () => unknown };
    if (typeof view.slice === 'function') return view.slice() as unknown as T;
    return value;
  }
  if (value instanceof ArrayBuffer) return value.slice(0) as unknown as T;

  if (Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    // Instancias de clase, nodos DOM, Blob: no se pueden reconstruir sin
    // conocer su constructor. Se conserva la referencia antes que producir
    // una copia estructuralmente incorrecta.
    return value;
  }

  const next: Record<string, unknown> = {};
  seen.set(objectValue, next);
  Object.entries(value as Record<string, unknown>).forEach(([key, entry]) => {
    next[key] = cloneStructural(entry, seen);
  });
  return next as unknown as T;
};

export const cloneDeep = <T>(value: T): T => {
  try {
    return structuredClone(value);
  } catch {
    return cloneStructural(value, new WeakMap<object, unknown>());
  }
};

/** Elimina duplicados preservando el primer orden de aparición. */
const uniq = <T,>(array: Array<T>) => Array.from(new Set(array));

/** Convierte bytes a base64 sin depender del `Buffer` de Node. */
const uint8ArrayToBase64 = (bytes: Uint8Array<ArrayBufferLike>): string => {
  if (typeof globalThis.btoa === 'function') {
    const chunkSize = 0x8000;
    let binary = '';
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return globalThis.btoa(binary);
  }

  if (typeof globalThis.Buffer !== 'undefined') {
    return globalThis.Buffer.from(bytes).toString('base64');
  }

  throw Error('[@sisad-pdfme/common] base64 encoding is not available in this environment.');
};

/** Convierte base64 a bytes sin depender del `Buffer` de Node. */
const base64ToUint8Array = (base64: string): Uint8Array<ArrayBuffer> => {
  if (typeof globalThis.atob === 'function') {
    const binary = globalThis.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes as Uint8Array<ArrayBuffer>;
  }

  if (typeof globalThis.Buffer !== 'undefined') {
    return new Uint8Array(globalThis.Buffer.from(base64, 'base64')) as Uint8Array<ArrayBuffer>;
  }

  throw Error('[@sisad-pdfme/common] base64 decoding is not available in this environment.');
};

/** Devuelve el nombre de la única fuente marcada como fallback. */
export const getFallbackFontName = (font: Font) => {
  const initial = '';
  const fallbackFontName = Object.entries(font).reduce((acc, cur) => {
    const [fontName, fontValue] = cur as [string, { data: string | ArrayBuffer | Uint8Array; fallback?: boolean; subset?: boolean }];

    return !acc && fontValue.fallback ? fontName : acc;
  }, initial);
  if (fallbackFontName === initial) {
    throw Error(
      `[@sisad-pdfme/common] fallback flag is not found in font. true fallback flag must be only one.`,
    );
  }

  return fallbackFontName;
};

/** Construye el mapa de fuente por defecto usando DEFAULT_FONT_VALUE. */
export const getDefaultFont = (): Font => ({
  [DEFAULT_FONT_NAME]: { data: b64toUint8Array(DEFAULT_FONT_VALUE), fallback: true },
});

/** Convierte milímetros a puntos PDF. */
export const mm2pt = (mm: number): number => {
  return parseFloat(String(mm)) * MM_TO_PT_RATIO;
};

/** Convierte puntos PDF a milímetros. */
export const pt2mm = (pt: number): number => {
  return pt * PT_TO_MM_RATIO;
};

/** Convierte puntos PDF a píxeles CSS aproximados. */
export const pt2px = (pt: number): number => {
  return pt * PT_TO_PX_RATIO;
};

/** Convierte píxeles CSS a milímetros aproximados. */
export const px2mm = (px: number): number => {
  // http://www.endmemo.com/sconvert/millimeterpixel.php
  const ratio = 0.26458333333333;
  return parseFloat(String(px)) * ratio;
};

/** Lee un Blob PDF y lo convierte a data URI base64 validado. */
const blob2Base64Pdf = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if ((reader.result as string).startsWith('data:application/pdf;')) {
        resolve(reader.result as string);
      } else {
        reject(Error('[@sisad-pdfme/common] template.basePdf must be pdf data.'));
      }
    };
    reader.readAsDataURL(blob);
  });
};

/** Valida colores HEX de 3/4/6/8 dígitos. */
export const isHexValid = (hex: string): boolean => {
  return /^#(?:[A-Fa-f0-9]{3,4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/i.test(hex);
};

/**
 * Migrate from  keyed object format to array format
 * @param template Template
 */
export const migrateTemplate = (template: Template) => {
  if (!template.schemas) {
    return;
  }

  if (
    Array.isArray(template.schemas) &&
    template.schemas.length > 0 &&
    !Array.isArray(template.schemas[0])
  ) {
    template.schemas = (template.schemas as unknown as Array<Record<string, Schema>>).map(
      (page) =>
        Object.entries(page).map(([key, value]) => ({
          ...value,
          name: key,
        })),
    );
  }
};

/** Genera input inicial desde schemas no readOnly del template. */
export const getInputFromTemplate = (template: Template): { [key: string]: string }[] => {
  migrateTemplate(template);

  const input: { [key: string]: string } = {};
  template.schemas.forEach((page) => {
    page.forEach((schema) => {
      if (!schema.readOnly) {
        input[schema.name] = schema.content || '';
      }
    });
  });

  return [input];
};

/** Normaliza PDF base desde URL/string/ArrayBuffer/Uint8Array hacia data URI PDF base64. */
export const getB64BasePdf = async (
  customPdf: ArrayBuffer | Uint8Array | string,
): Promise<string> => {
  if (
    typeof customPdf === 'string' &&
    !customPdf.startsWith('data:application/pdf;') &&
    typeof window !== 'undefined'
  ) {
    const response = await fetch(customPdf);
    const blob = await response.blob();
    return blob2Base64Pdf(blob);
  }

  if (typeof customPdf === 'string') {
    return customPdf;
  }

  const uint8Array = (customPdf instanceof Uint8Array ? customPdf : new Uint8Array(customPdf)) as Uint8Array<ArrayBuffer>;
  return 'data:application/pdf;base64,' + uint8ArrayToBase64(uint8Array);
};

/** Type guard para detectar basePdf tipo BlankPdf. */
export const isBlankPdf = (basePdf: BasePdf): basePdf is BlankPdf =>
  BlankPdfSchema.safeParse(basePdf).success;

/** Convierte base64/data URI a Uint8Array. */
export const b64toUint8Array = (base64: string): Uint8Array<ArrayBuffer> => {
  const data = base64.split(';base64,')[1] ? base64.split(';base64,')[1] : base64;
  return base64ToUint8Array(data);
};

/** Extrae nombres de fuentes usados por los schemas. */
const getFontNamesInSchemas = (schemas: SchemaPageArray) =>
  uniq(
    schemas
      .map((p) => p.map((v) => (v as Schema & { fontName?: string }).fontName ?? ''))
      .reduce((acc, cur) => acc.concat(cur), [] as (string | undefined)[])
      .filter(Boolean) as string[],
  );

/** Valida que font tenga un único fallback y cubra las fuentes usadas por el template. */
export const checkFont = (arg: { font: Font; template: Template }) => {
  const {
    font,
    template: { schemas },
  } = arg;
  const fontValues = Object.values(font);
  const fallbackFontNum = fontValues.reduce((acc, cur) => (cur.fallback ? acc + 1 : acc), 0 as number);
  if (fallbackFontNum === 0) {
    throw Error(
      `[@sisad-pdfme/common] fallback flag is not found in font. true fallback flag must be only one.
Check this document: https://sisad-pdfme.com/docs/custom-fonts#about-font-type`,
    );
  }
  if (fallbackFontNum > 1) {
    throw Error(
      `[@sisad-pdfme/common] ${fallbackFontNum} fallback flags found in font. true fallback flag must be only one.
Check this document: https://sisad-pdfme.com/docs/custom-fonts#about-font-type`,
    );
  }

  const fontNamesInSchemas = getFontNamesInSchemas(schemas);
  const fontNames = Object.keys(font);
  if (fontNamesInSchemas.some((f) => !fontNames.includes(f))) {
    throw Error(
      `[@sisad-pdfme/common] ${fontNamesInSchemas
        .filter((f) => !fontNames.includes(f))
        .join()} of template.schemas is not found in font.
Check this document: https://sisad-pdfme.com/docs/custom-fonts`,
    );
  }
};

export const checkPlugins = (arg: { plugins: Plugins; template: Template }) => {
  const {
    plugins,
    template: { schemas },
  } = arg;
  const allSchemaTypes = uniq(schemas.map((p) => p.map((v) => v.type)).flat());

  const pluginsSchemaTypes = Object.values(plugins).map((p) =>
    p ? (p.propPanel.defaultSchema as Schema).type : undefined,
  );

  if (allSchemaTypes.some((s) => !pluginsSchemaTypes.includes(s))) {
    throw Error(
      `[@sisad-pdfme/common] ${allSchemaTypes
        .filter((s) => !pluginsSchemaTypes.includes(s))
        .join()} of template.schemas is not found in plugins.`,
    );
  }
};

function checkProps<T>(data: unknown, zodSchema: z.ZodType<T>) {
  try {
    zodSchema.parse(data);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const messages = e.issues.map(
        (issue) => `ERROR POSITION: ${issue.path.join('.')}
ERROR MESSAGE: ${issue.message}
--------------------------`,
      );
      throw Error(`[@sisad-pdfme/common] Invalid argument:
--------------------------
${messages.join('\n')}`);
    } else {
      throw Error(
        `[@sisad-pdfme/common] Unexpected parsing error: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  }

  // Check fonts if template and options exist
  if (data && typeof data === 'object' && 'template' in data && 'options' in data) {
    const { template, options } = data as { template: Template; options: { font?: Font } };
    if (options && options.font) {
      checkFont({ font: options.font, template });
    }
  }

  // Check plugins if template and plugins exist
  if (data && typeof data === 'object' && 'template' in data && 'plugins' in data) {
    const { template, plugins } = data as { template: Template; plugins: Plugins };
    if (plugins) {
      checkPlugins({ plugins, template });
    }
  }
};

/** Valida inputs del generator/runtime con Zod. */
export const checkInputs = (data: unknown) => checkProps(data, InputsSchema);
/** Valida opciones UI compartidas de Designer/Form/Viewer. */
export const checkUIOptions = (data: unknown) => checkProps(data, UIOptionsSchema);
/** Valida props de Preview. */
export const checkPreviewProps = (data: unknown) => checkProps(data, PreviewPropsSchema);
/** Valida props de Designer. */
export const checkDesignerProps = (data: unknown) => checkProps(data, DesignerPropsSchema);
/** Valida props comunes UI. */
export const checkUIProps = (data: unknown) => {
  if (typeof data === 'object' && data !== null && 'template' in data) {
    migrateTemplate(data.template as Template);
  }
  checkProps(data, UIPropsSchema);
};
/** Valida y migra un Template antes de usarlo. */
export const checkTemplate = (template: unknown) => {
  migrateTemplate(template as Template);
  checkProps(template, TemplateSchema);
};
/** Valida props de Generator. */
export const checkGenerateProps = (data: unknown) => {
  if (typeof data === 'object' && data !== null && 'template' in data) {
    migrateTemplate(data.template as Template);
  }
  checkProps(data, GeneratePropsSchema);
};

/**
 * designerLabels — resolver de etiquetas de PRESENTACIÓN del Designer.
 *
 * Rol arquitectónico:
 * - Traduce identificadores técnicos (`schema.type`, `state`, modo de firma, rol)
 *   a la etiqueta visible del idioma activo.
 * - Es el único resolver de display metadata del Designer: no crear mapas de
 *   etiquetas paralelos en componentes.
 *
 * Contrato clave — IDENTITY != PRESENTATION:
 * - Los identificadores que entran (`fullName`, `emailAddress`, `pending`, `p12`, …)
 *   son contratos técnicos estables: se leen, nunca se reescriben ni se traducen
 *   dentro del template, snapshots o API pública.
 * - Estas funciones sólo eligen cómo se muestran.
 *
 * Autoridad de idioma:
 * - Todas reciben `translate`, la función publicada por `I18nContext`, que ya
 *   resuelve `options.labels` > idioma explícito > `DEFAULT_LANG`. Este módulo no
 *   guarda diccionarios propios ni ramifica por idioma.
 */
import { normalizeLooseText } from '@sisad-pdfme/shared/text';
import { resolveSchemaTypeLabel, type Translate } from '@sisad-pdfme/ui/i18n';
import type { Dict } from '@sisad-pdfme/common';

const normalizeKey = (value: unknown) => normalizeLooseText(value).toLowerCase();

const titleCaseFallback = (value: string) =>
  value
    .split(/[\s_-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

/**
 * `schema.type` puede llegar en cualquier casing desde templates antiguos o
 * desde el host, pero las keys de `Dict` usan el casing canónico del tipo.
 * Este mapa normaliza sólo la BÚSQUEDA de la etiqueta; el `type` del schema no
 * se toca nunca.
 */
const CANONICAL_TYPE_BY_NORMALIZED: Record<string, string> = {
  text: 'text',
  multivariabletext: 'multiVariableText',
  image: 'image',
  svg: 'svg',
  signature: 'signature',
  initials: 'initials',
  datesigned: 'dateSigned',
  fullname: 'fullName',
  emailaddress: 'emailAddress',
  email: 'emailAddress',
  company: 'company',
  title: 'title',
  table: 'table',
  line: 'line',
  rectangle: 'rectangle',
  ellipse: 'ellipse',
  datetime: 'dateTime',
  date: 'date',
  time: 'time',
  number: 'number',
  select: 'select',
  dropdown: 'select',
  radiogroup: 'radioGroup',
  checkbox: 'checkbox',
  checkboxgroup: 'checkboxGroup',
  attachment: 'attachment',
  note: 'note',
  approve: 'approve',
  approval: 'approve',
  decline: 'decline',
  reject: 'decline',
  qrcode: 'qrcode',
  japanpost: 'japanpost',
  ean13: 'ean13',
  ean8: 'ean8',
  code39: 'code39',
  code128: 'code128',
  nw7: 'nw7',
  itf14: 'itf14',
  upca: 'upca',
  upce: 'upce',
  gs1datamatrix: 'gs1datamatrix',
  pdf417: 'pdf417',
};

/**
 * Etiqueta visible de un `schema.type`.
 *
 * Los tipos built-in salen del diccionario activo; un tipo desconocido (plugin
 * del host) cae en un title-case de su identificador para no mostrar `undefined`
 * ni un valor vacío.
 */
export const getSchemaTypeLabel = (translate: Translate, type: unknown): string => {
  const key = normalizeKey(type);
  if (!key) return translate('catalog.defaultFieldLabel');
  const canonicalType = CANONICAL_TYPE_BY_NORMALIZED[key];
  if (canonicalType) return resolveSchemaTypeLabel(translate, canonicalType);
  return titleCaseFallback(key);
};

/**
 * Traduce una key de un grupo `<prefijo>.<valor>` de `Dict`.
 *
 * Devuelve `null` cuando el valor no pertenece al grupo, para que el llamador
 * decida su propio fallback.
 */
const translateEnumLabel = (
  translate: Translate,
  prefix: string,
  value: string,
  allowed: readonly string[],
): string | null => {
  if (!allowed.includes(value)) return null;
  const translated = String(translate(`${prefix}.${value}` as keyof Dict) || '').trim();
  return translated || null;
};

const SCHEMA_STATES = [
  'pending',
  'draft',
  'ready',
  'completed',
  'merged',
  'locked',
  'review',
  'rejected',
  'error',
] as const;

/** Alias históricos de estado que comparten etiqueta con un estado canónico. */
const STATE_ALIASES: Record<string, string> = {
  ok: 'ready',
  success: 'completed',
};

/** Etiqueta visible del estado de un schema. */
export const getSchemaStateLabel = (translate: Translate, state: unknown): string => {
  const key = normalizeKey(state);
  if (!key) return translate('catalog.defaultFieldLabel');
  const canonical = STATE_ALIASES[key] || key;
  return translateEnumLabel(translate, 'schemaStates', canonical, SCHEMA_STATES) || titleCaseFallback(key);
};

const SIGNATURE_MODES = ['image', 'drawn', 'p12', 'provider'] as const;

/** Etiqueta visible del método de adquisición de firma. */
export const getSignatureModeLabel = (translate: Translate, mode: unknown): string => {
  const key = normalizeKey(mode);
  if (!key) return resolveSchemaTypeLabel(translate, 'signature');
  return translateEnumLabel(translate, 'signatureModes', key, SIGNATURE_MODES) || titleCaseFallback(key);
};

/** Título de la vista de firma delegada a un proveedor externo. */
export const getProviderViewLabel = (translate: Translate): string => translate('signature.providerView');

const RECIPIENT_ROLES = ['owner', 'recipient'] as const;

/** Etiqueta visible del rol de un destinatario. */
export const getFriendlyRecipientRoleLabel = (translate: Translate, value: unknown): string => {
  const key = normalizeKey(value);
  if (!key) return '';
  return translateEnumLabel(translate, 'recipientRoles', key, RECIPIENT_ROLES) || titleCaseFallback(key);
};

/**
 * Etiqueta visible de una entrada del catálogo.
 *
 * Para entradas custom del host se conserva su etiqueta tal cual la declaró; para
 * built-ins manda el diccionario del idioma activo.
 */
export const getCatalogLabel = (
  translate: Translate,
  label: unknown,
  type: unknown,
  source?: 'builtin' | 'custom',
): string => {
  const normalizedLabel = typeof label === 'string' ? label.trim() : '';
  if (source === 'custom' && normalizedLabel) return normalizedLabel;
  return getSchemaTypeLabel(translate, type) || normalizedLabel || translate('catalog.defaultFieldLabel');
};

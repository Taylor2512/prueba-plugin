import { normalizeLooseText } from '../../../../shared/text.js';

const DEFAULT_LABEL = 'Campo';

const TYPE_LABELS: Record<string, string> = {
  text: 'Texto',
  number: 'Número',
  multivariabletext: 'Texto dinámico',
  signature: 'Firma',
  image: 'Imagen',
  svg: 'SVG',
  checkbox: 'Casilla',
  checkboxgroup: 'Grupo de Casillas',
  radiogroup: 'Opción',
  select: 'Lista Desplegable',
  dropdown: 'Lista Desplegable',
  date: 'Fecha',
  datetime: 'Fecha Y Hora',
  time: 'Hora',
  qrcode: 'Código QR',
  ean13: 'Código de barras',
  ean8: 'Código de barras',
  code39: 'Código de barras',
  code128: 'Código de barras',
  itf14: 'Código de barras',
  upca: 'Código de barras',
  upce: 'Código de barras',
  gs1datamatrix: 'DataMatrix',
  pdf417: 'PDF417',
  japanpost: 'Japan Post',
  nw7: 'NW7',
  line: 'Línea',
  rectangle: 'Rectángulo',
  ellipse: 'Óvalo',
  table: 'Tabla',
  // Tipos de flujos de firma/routing: se localizan aquí para que el filtro de
  // tipos y las filas no mezclen español e inglés (Attachment/Approve/…).
  attachment: 'Adjunto',
  approve: 'Aprobar',
  approval: 'Aprobar',
  decline: 'Rechazar',
  reject: 'Rechazar',
  note: 'Nota',
  title: 'Título',
  email: 'Correo electrónico',
  emailaddress: 'Correo electrónico',
  initials: 'Iniciales',
  datesigned: 'Fecha de firma',
};

const STATE_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  draft: 'Borrador',
  ok: 'Listo',
  ready: 'Listo',
  success: 'Completado',
  completed: 'Completado',
  merged: 'Fusionado',
  locked: 'Bloqueado',
  review: 'Requiere revisión',
  rejected: 'Rechazado',
  error: 'Error',
};

const SIGNATURE_MODE_LABELS: Record<string, string> = {
  image: 'Firma por imagen',
  drawn: 'Firma dibujada',
  p12: 'Certificado P12',
  provider: 'Proveedor externo',
};

const normalizeKey = (value: unknown) => normalizeLooseText(value).toLowerCase();

const titleCaseFallback = (value: string) =>
  value
    .split(/[\s_-]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const getSchemaTypeLabel = (type: unknown): string => {
  const key = normalizeKey(type);
  if (!key) return DEFAULT_LABEL;
  return TYPE_LABELS[key] || titleCaseFallback(key);
};

export const getSchemaStateLabel = (state: unknown): string => {
  const key = normalizeKey(state);
  if (!key) return DEFAULT_LABEL;
  return STATE_LABELS[key] || titleCaseFallback(key);
};

export const getSignatureModeLabel = (mode: unknown): string => {
  const key = normalizeKey(mode);
  if (!key) return 'Firma';
  return SIGNATURE_MODE_LABELS[key] || titleCaseFallback(key);
};

export const getProviderViewLabel = (): string => 'Vista de firma externa';

export const getFriendlyRecipientRoleLabel = (value: unknown): string => {
  const key = normalizeKey(value);
  if (!key) return '';
  if (key === 'owner') return 'Propietario';
  if (key === 'recipient') return 'Destinatario';
  return titleCaseFallback(key);
};

export const getCatalogLabel = (label: unknown, type: unknown, source?: 'builtin' | 'custom'): string => {
  const normalizedLabel = typeof label === 'string' ? label.trim() : '';
  if (source === 'custom' && normalizedLabel) return normalizedLabel;
  return getSchemaTypeLabel(type) || normalizedLabel || DEFAULT_LABEL;
};

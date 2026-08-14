/**
 * Autorrelleno de schemas a partir de los datos del Usuario.
 *
 * Los presets de `schemas/textLike/textLikePresets.ts` declaran un
 * `prefillSource` (`user.name`, `user.email`…). Este módulo es quien lo
 * consume: traduce esa fuente al dato real del Usuario propietario del schema
 * y devuelve el parche a aplicar sobre el schema.
 *
 * ## Frontera User / Recipient (RTP-525)
 *
 * `User` es el concepto del core reusable. `Recipient` pertenece al host y
 * sólo sobrevive aquí como ALIAS de compatibilidad: las plantillas ya
 * persistidas llevan `prefillSource: 'recipient.email'` dentro de su JSON, así
 * que dejar de aceptarlo rompería documentos existentes.
 *
 * La regla es asimétrica a propósito: se ACEPTA `recipient.*` al leer, pero se
 * EMITE siempre `user.*` al escribir.
 *
 * Reglas:
 * - Solo se autorrellena cuando hay un valor real. Un campo sin fuente resuelta
 *   se deja editable y vacío; bloquear un campo vacío dejaría al destinatario
 *   sin forma de completarlo.
 * - El valor autorrellenado es de solo lectura: es un dato del sistema, no una
 *   entrada del formulario.
 * - La resolución es idempotente: aplicarla dos veces sobre el mismo schema y
 *   el mismo destinatario no produce cambios.
 */

import type { SchemaForUI } from '@sisad-pdfme/common';
import { normalizeText } from '../shared/text.js';
import type { CollaborationRecipientOption } from './collaborationContext.js';

/** Fuentes canónicas, mapeadas a la clave del Usuario. */
const PREFILL_SOURCE_FIELD = {
  'user.name': 'name',
  'user.email': 'email',
  'user.company': 'company',
  'user.title': 'title',
} as const;

export type UserPrefillSource = keyof typeof PREFILL_SOURCE_FIELD;

/**
 * Alias legacy → canónico.
 *
 * Sólo se consulta al LEER. Nada en el core vuelve a escribir `recipient.*`.
 */
const LEGACY_SOURCE_ALIAS: Record<string, UserPrefillSource> = {
  'recipient.name': 'user.name',
  'recipient.email': 'user.email',
  'recipient.company': 'user.company',
  'recipient.title': 'user.title',
};

/** Compatibilidad de tipo para consumidores previos al rename. */
export type RecipientPrefillSource = UserPrefillSource;

/** Tipos de schema que se autorrellenan aunque no declaren `prefillSource`. */
const TYPE_FALLBACK_SOURCE: Record<string, UserPrefillSource> = {
  fullname: 'user.name',
  emailaddress: 'user.email',
  company: 'user.company',
  title: 'user.title',
};

type PrefillableSchema = SchemaForUI & {
  prefillSource?: string;
  ownerRecipientId?: string;
  content?: string;
  readOnly?: boolean;
  required?: boolean;
};

/**
 * Resuelve la fuente de autorrelleno de un schema.
 *
 * Prioriza `prefillSource` (lo que declara el preset) y cae al tipo para
 * schemas creados antes de que el preset lo declarara.
 */
export const resolvePrefillSource = (schema: PrefillableSchema | null): UserPrefillSource | null => {
  if (!schema) return null;
  const declared = normalizeText(schema.prefillSource);
  if (declared) {
    if (declared in PREFILL_SOURCE_FIELD) return declared as UserPrefillSource;
    // Plantilla anterior al rename: se acepta y se resuelve al canónico.
    const alias = LEGACY_SOURCE_ALIAS[declared];
    if (alias) return alias;
  }
  const type = normalizeText(schema.type).toLowerCase();
  return TYPE_FALLBACK_SOURCE[type] || null;
};

/** Normaliza una fuente declarada al espacio canónico. `null` si no existe. */
export const normalizePrefillSource = (value: unknown): UserPrefillSource | null => {
  const declared = normalizeText(value);
  if (!declared) return null;
  if (declared in PREFILL_SOURCE_FIELD) return declared as UserPrefillSource;
  return LEGACY_SOURCE_ALIAS[declared] || null;
};

/**
 * Valor del destinatario para una fuente dada, o `null` si no hay dato.
 *
 * `company` y `title` no tienen origen en el paso 1 hoy: el modelo de
 * destinatario no expone un cargo y la empresa está oculta en el formulario.
 * Devuelven `null` y el campo queda editable hasta que exista la fuente.
 */
export const resolveUserPrefillValue = (
  source: UserPrefillSource | null,
  recipient: CollaborationRecipientOption | null | undefined,
): string | null => {
  if (!source || !recipient) return null;
  const field = PREFILL_SOURCE_FIELD[source];
  return normalizeText((recipient as Record<string, unknown>)[field]) || null;
};

/**
 * Devuelve el schema autorrellenado, o el mismo objeto si nada cambia.
 *
 * Preservar la identidad cuando no hay cambio es lo que permite llamar a esto
 * en un efecto sin provocar un ciclo de renders ni eventos de colaboración
 * espurios.
 */
export const applyRecipientPrefill = <T extends PrefillableSchema>(
  schema: T,
  recipient: CollaborationRecipientOption | null | undefined,
): T => {
  const source = resolvePrefillSource(schema);
  if (!source) return schema;

  const value = resolveUserPrefillValue(source, recipient);
  if (!value) return schema;

  if (schema.content === value && schema.readOnly === true && schema.required !== true) {
    return schema;
  }

  return {
    ...schema,
    content: value,
    readOnly: true,
    // Un campo de solo lectura no puede ser obligatorio para quien firma: no
    // tiene forma de rellenarlo y bloquearía el envío.
    required: false,
  };
};

/**
 * Busca el destinatario propietario de un schema dentro de las opciones.
 *
 * Cae al destinatario activo cuando el schema aún no tiene owner asignado, que
 * es el caso de un campo recién soltado en el lienzo.
 */
export const resolveSchemaPrefillRecipient = (
  schema: PrefillableSchema,
  recipientOptions: CollaborationRecipientOption[],
  activeRecipient: CollaborationRecipientOption | null,
): CollaborationRecipientOption | null => {
  const ownerId = normalizeText(schema.ownerRecipientId);
  if (!ownerId) return activeRecipient;
  return recipientOptions.find((recipient) => recipient.id === ownerId) || activeRecipient;
};

/** Alias de compatibilidad para consumidores previos al rename (RTP-525). */
export const resolveRecipientPrefillValue = resolveUserPrefillValue;

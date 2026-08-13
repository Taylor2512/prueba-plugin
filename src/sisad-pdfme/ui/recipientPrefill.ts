/**
 * Autorrelleno de schemas a partir de los datos del destinatario.
 *
 * Los presets de `schemas/textLike/textLikePresets.ts` declaran un
 * `prefillSource` (`recipient.name`, `recipient.email`…). Este módulo es quien
 * lo consume: traduce esa fuente al dato real del destinatario propietario del
 * schema y devuelve el parche a aplicar sobre el schema.
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

/** Fuentes declaradas por los presets, mapeadas a la clave del destinatario. */
const PREFILL_SOURCE_FIELD = {
  'recipient.name': 'name',
  'recipient.email': 'email',
  'recipient.company': 'company',
  'recipient.title': 'title',
} as const;

export type RecipientPrefillSource = keyof typeof PREFILL_SOURCE_FIELD;

/** Tipos de schema que se autorrellenan aunque no declaren `prefillSource`. */
const TYPE_FALLBACK_SOURCE: Record<string, RecipientPrefillSource> = {
  fullname: 'recipient.name',
  emailaddress: 'recipient.email',
  company: 'recipient.company',
  title: 'recipient.title',
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
export const resolvePrefillSource = (schema: PrefillableSchema | null): RecipientPrefillSource | null => {
  if (!schema) return null;
  const declared = normalizeText(schema.prefillSource);
  if (declared && declared in PREFILL_SOURCE_FIELD) {
    return declared as RecipientPrefillSource;
  }
  const type = normalizeText(schema.type).toLowerCase();
  return TYPE_FALLBACK_SOURCE[type] || null;
};

/**
 * Valor del destinatario para una fuente dada, o `null` si no hay dato.
 *
 * `company` y `title` no tienen origen en el paso 1 hoy: el modelo de
 * destinatario no expone un cargo y la empresa está oculta en el formulario.
 * Devuelven `null` y el campo queda editable hasta que exista la fuente.
 */
export const resolveRecipientPrefillValue = (
  source: RecipientPrefillSource | null,
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

  const value = resolveRecipientPrefillValue(source, recipient);
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

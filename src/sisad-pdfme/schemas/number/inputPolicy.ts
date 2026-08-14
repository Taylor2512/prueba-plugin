/**
 * Política de entrada del schema `number`.
 *
 * El campo se pinta como `contenteditable` (lo comparte con `text`), así que la
 * única forma de impedir que se teclee una letra es cancelar el `beforeinput`
 * antes de que el carácter llegue al DOM. Este módulo concentra la única
 * decisión que hace falta para eso —qué texto puede existir en el campo— y la
 * deja como función pura para que la capa de UI solo tenga que aplicarla.
 *
 * Reglas:
 * - solo dígitos, con un único separador decimal `.` o `,`;
 * - el signo `-` depende de `allowNegative` (permitido si no se configura);
 * - un único símbolo de moneda cuando `format === 'currency'`.
 *
 * El símbolo de moneda forma parte del valor canónico: se conserva en `content`
 * y llega al PDF sin que el renderer tenga que formatear nada.
 */

export type NumberInputPolicy = {
  format?: string;
  allowNegative?: boolean;
};

/**
 * Lo que hace falta para decidir si un valor confirmado es aceptable. Se declara
 * aparte del `Schema` completo porque la comprobación no necesita geometría ni
 * identidad, y exigirlas obliga a construir un schema entero para probarla.
 */
export type NumberBoundsPolicy = NumberInputPolicy & {
  decimals?: number;
  validationMin?: number;
  validationMax?: number;
};

/** Categoría Unicode `Sc` — cubre `$`, `€`, `£`, `¥`, `₡`, `₹`, `₿`… */
const CURRENCY_SYMBOL = /\p{Sc}/u;
const EVERY_CURRENCY_SYMBOL = /\p{Sc}/gu;

/** Tramo numérico dentro de un draft con moneda: `"$ 12,50"` → `"12,50"`. */
const NUMERIC_RUN = /-?[\d.,]+/;

const NUMERIC_DRAFT = /^-?(?:\d+(?:[.,]\d*)?|[.,]\d*)?$/;
const NUMERIC_DRAFT_UNSIGNED = /^(?:\d+(?:[.,]\d*)?|[.,]\d*)?$/;

export const allowsCurrencySymbol = (schema: NumberInputPolicy): boolean =>
  schema.format === 'currency';

/** Sin configurar equivale a permitido: es el comportamiento previo del campo. */
export const allowsNegative = (schema: NumberInputPolicy): boolean =>
  schema.allowNegative !== false;

export type CurrencySplit = { symbol: string; numeric: string };

/**
 * Separa el símbolo de moneda del resto del draft.
 *
 * Devuelve `null` cuando el texto no puede ser un número: más de un símbolo, o
 * un símbolo en un campo que no está configurado como moneda.
 */
export const splitCurrency = (raw: string, schema: NumberInputPolicy): CurrencySplit | null => {
  const symbols = raw.match(EVERY_CURRENCY_SYMBOL) ?? [];
  if (symbols.length === 0) return { symbol: '', numeric: raw };
  if (symbols.length > 1 || !allowsCurrencySymbol(schema)) return null;
  return { symbol: symbols[0], numeric: raw.replace(CURRENCY_SYMBOL, '') };
};

/** ¿El tramo sin moneda es un draft numérico admisible? */
export const isNumericDraftPart = (numeric: string, schema: NumberInputPolicy): boolean =>
  (allowsNegative(schema) ? NUMERIC_DRAFT : NUMERIC_DRAFT_UNSIGNED).test(numeric.trim());

/**
 * ¿Puede este texto existir en el campo, aunque sea como estado intermedio?
 *
 * Acepta drafts incompletos (`-`, `,`, `12,`, `$`) a propósito: bloquearlos
 * impediría escribir el valor completo carácter a carácter. Lo que un draft
 * incompleto no hace es superar `isNumberWithinBounds` al confirmar.
 */
export const isAcceptableNumberInput = (raw: string, schema: NumberInputPolicy): boolean => {
  if (/[\r\n\t]/.test(raw)) return false;
  const split = splitCurrency(raw, schema);
  if (!split) return false;
  return isNumericDraftPart(split.numeric, schema);
};

/**
 * Reconstruye el draft con el tramo numérico ya canonicalizado, conservando el
 * símbolo de moneda y el espaciado tal como se escribieron: `"$ 12,50"` →
 * `"$ 12.5"`, `"12,50 €"` → `"12.5 €"`.
 *
 * El símbolo mantiene su posición relativa a la cifra —delante o detrás—, pero
 * el signo siempre queda pegado al número: `"-$12,5"` → `"$-12.5"`. Sustituir
 * sobre el texto original no sirve, porque un signo separado del número por el
 * símbolo queda fuera del tramo y acabaría duplicado.
 */
export const withCanonicalNumber = (
  raw: string,
  split: CurrencySplit,
  canonical: string,
): string => {
  const body = NUMERIC_RUN.test(split.numeric)
    ? split.numeric.replace(NUMERIC_RUN, canonical)
    : canonical;
  if (!split.symbol) return body;

  const firstDigit = raw.search(/\d/);
  const symbolAt = raw.indexOf(split.symbol);
  return firstDigit === -1 || symbolAt < firstDigit
    ? `${split.symbol}${body}`
    : `${body}${split.symbol}`;
};

/**
 * OptionValue — valores tipados de opción y política de selección ausente.
 *
 * ## Dos defectos que este módulo impide
 *
 * 1. **Coerción a texto.** Una opción cuyo valor es `0`, `false` o `null` no
 *    puede convertirse en `'0'`, `'false'` o `''`: al enviarse de vuelta a una
 *    API el tipo importa, y `''` es indistinguible de «sin seleccionar».
 *
 * 2. **`options[0]` como fallback silencioso.** Con opciones remotas
 *    paginadas, que el valor seleccionado no esté en la página actual NO
 *    significa que no exista. Elegir la primera opción «para que haya algo»
 *    corrompe el dato del usuario sin avisar. Está prohibido por contrato y
 *    aquí no hay ningún camino que lo haga.
 */

/** Valor transportable de una opción. Conserva el tipo de origen. */
export type OptionValue = string | number | boolean | null;

export type ResolvedOption = {
  value: OptionValue;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: string;
};

export const isOptionValue = (value: unknown): value is OptionValue =>
  value === null ||
  typeof value === 'string' ||
  typeof value === 'number' ||
  typeof value === 'boolean';

/**
 * Normaliza un valor crudo a `OptionValue`.
 *
 * `undefined` pasa a `null` porque `null` es el «sin valor» transportable;
 * objetos y arrays no son valores de opción y también dan `null`.
 */
export const toOptionValue = (raw: unknown): OptionValue => {
  if (raw === undefined) return null;
  if (isOptionValue(raw)) return raw;
  return null;
};

/**
 * Igualdad de valores de opción.
 *
 * Estricta por tipo salvo el caso número/cadena numérica, que aparece
 * constantemente cuando una API devuelve `1` y la plantilla guarda `"1"`.
 * `false` y `'false'` NO se consideran iguales: ahí la ambigüedad sí es un
 * error del emisor.
 */
export const optionValuesEqual = (left: OptionValue, right: OptionValue): boolean => {
  if (left === right) return true;
  if (left === null || right === null) return false;
  const numericPair =
    (typeof left === 'number' && typeof right === 'string') ||
    (typeof left === 'string' && typeof right === 'number');
  if (numericPair) {
    const a = Number(left);
    const b = Number(right);
    return Number.isFinite(a) && Number.isFinite(b) && a === b;
  }
  return false;
};

/**
 * Qué hacer cuando el valor seleccionado no está en la página actual.
 *
 * - `keep-stale` (por defecto) — se conserva el valor y se marca como no
 *   resuelto. Es lo correcto con paginación: ausente de la página ≠ inexistente.
 * - `invalidate` — se conserva el valor pero se marca inválido para que la
 *   validación lo señale.
 * - `clear` — se descarta. Sólo para catálogos cerrados y completos.
 */
export type SelectedMissingPolicy = 'keep-stale' | 'invalidate' | 'clear';

export const DEFAULT_SELECTED_MISSING_POLICY: SelectedMissingPolicy = 'keep-stale';

export type SelectedResolution = {
  /** Valor efectivo tras aplicar la política. */
  value: OptionValue;
  /** La opción encontrada, si estaba en la página. */
  option: ResolvedOption | null;
  /** `true` si el valor existe pero no se encontró entre las opciones. */
  stale: boolean;
  /** Etiqueta a mostrar. Determinista incluso sin resolver la opción. */
  displayValue: string;
  /** `true` cuando la política exige marcarlo inválido. */
  invalid: boolean;
};

/**
 * Etiqueta determinista para un valor.
 *
 * Sin opción resuelta se usa la representación del propio valor, nunca una
 * cadena vacía: el usuario debe seguir viendo lo que tiene seleccionado
 * aunque el catálogo remoto no esté disponible.
 */
export const optionDisplayValue = (value: OptionValue, option?: ResolvedOption | null): string => {
  if (option) return option.label;
  if (value === null) return '';
  return String(value);
};

/**
 * Resuelve el valor seleccionado contra las opciones disponibles.
 *
 * Nunca cae a `options[0]`. Si el valor no está, lo dice.
 */
export const resolveSelectedOption = (
  value: OptionValue,
  options: ResolvedOption[],
  policy: SelectedMissingPolicy = DEFAULT_SELECTED_MISSING_POLICY,
  /** Etiqueta conocida de una carga anterior, si la hay. */
  knownLabel?: string,
): SelectedResolution => {
  const option = options.find((candidate) => optionValuesEqual(candidate.value, value)) ?? null;

  if (option) {
    return { value, option, stale: false, displayValue: option.label, invalid: false };
  }
  if (value === null) {
    return { value: null, option: null, stale: false, displayValue: '', invalid: false };
  }

  // El valor existe pero no está en esta página de opciones.
  if (policy === 'clear') {
    return { value: null, option: null, stale: false, displayValue: '', invalid: false };
  }
  return {
    value,
    option: null,
    stale: true,
    displayValue: knownLabel ?? optionDisplayValue(value),
    invalid: policy === 'invalidate',
  };
};

/** Normaliza opciones crudas, descartando las que no tienen valor utilizable. */
export const normalizeOptions = (
  raw: Array<Record<string, unknown> | OptionValue>,
  mapping: { value?: string; label?: string; disabled?: string; description?: string; icon?: string } = {},
): ResolvedOption[] =>
  raw
    .map((entry): ResolvedOption | null => {
      if (isOptionValue(entry)) {
        return { value: entry, label: optionDisplayValue(entry) };
      }
      if (!entry || typeof entry !== 'object') return null;
      const record = entry as Record<string, unknown>;
      const value = toOptionValue(mapping.value ? record[mapping.value] : record.value);
      // Una opción sin valor no es seleccionable; se descarta en vez de
      // inventarle uno derivado de la etiqueta.
      if (value === null && !('value' in record) && !mapping.value) return null;
      const labelSource = mapping.label ? record[mapping.label] : record.label;
      return {
        value,
        label:
          typeof labelSource === 'string' || typeof labelSource === 'number'
            ? String(labelSource)
            : optionDisplayValue(value),
        disabled: Boolean(mapping.disabled ? record[mapping.disabled] : record.disabled) || undefined,
        description: mapping.description
          ? String(record[mapping.description] ?? '') || undefined
          : undefined,
        icon: mapping.icon ? String(record[mapping.icon] ?? '') || undefined : undefined,
      };
    })
    .filter((option): option is ResolvedOption => option !== null);

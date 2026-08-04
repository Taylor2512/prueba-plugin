/**
 * Reusable field definitions for the inspector sidebar.
 * Import specific groups and spread into any schema's propPanel.schema().
 * All fields map to  sections via the inspector propertyMap.
 */

import type { PropPanelSchema } from '@sisad-pdfme/common';

// ── Behavior / basics ──────────────────────────────────────────────────────

const requiredField = (): PropPanelSchema => ({
  title: 'Obligatorio',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

const readOnlyField = (): PropPanelSchema => ({
  title: 'Solo lectura',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

const lockedField = (): PropPanelSchema => ({
  title: 'Bloqueado',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

const restrictChangesField = (): PropPanelSchema => ({
  title: 'Restringir cambios',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

/** Convenience: required + readOnly together */
export const basicsFields = (): Record<string, PropPanelSchema> => ({
  required: requiredField(),
  readOnly: readOnlyField(),
});

// ── Content ────────────────────────────────────────────────────────────────

const placeholderTextField = (label = 'Placeholder'): PropPanelSchema => ({
  title: label,
  type: 'string',
  widget: 'input',
  span: 24,
});

const defaultValueField = (label = 'Valor por defecto'): PropPanelSchema => ({
  title: label,
  type: 'string',
  widget: 'input',
  span: 24,
});

const maxLengthField = (): PropPanelSchema => ({
  title: 'Máximo caracteres',
  type: 'number',
  widget: 'inputNumber',
  span: 12,
  props: { min: 0, precision: 0 },
});

const maskedField = (): PropPanelSchema => ({
  title: 'Ocultar con asteriscos',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

const fixedWidthField = (): PropPanelSchema => ({
  title: 'Anchura fija',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

// ── Help / tooltip ─────────────────────────────────────────────────────────

const tooltipField = (): PropPanelSchema => ({
  title: 'Ayuda del campo',
  type: 'string',
  widget: 'textarea',
  span: 24,
  props: { maxLength: 2000, autoSize: { minRows: 2, maxRows: 4 } },
});

const helpTextField = (): PropPanelSchema => ({
  title: 'Descripción del campo',
  type: 'string',
  widget: 'textarea',
  span: 24,
  props: { maxLength: 2000, autoSize: { minRows: 2, maxRows: 4 } },
});

/** Convenience: tooltip + helpText */
export const helpFields = (): Record<string, PropPanelSchema> => ({
  tooltip: tooltipField(),
  helpText: helpTextField(),
});

// ── Data label / integrations ──────────────────────────────────────────────

const dataLabelField = (): PropPanelSchema => ({
  title: 'Etiqueta de datos',
  type: 'string',
  widget: 'input',
  span: 12,
  props: { autoComplete: 'off' },
});

const tabLabelField = (): PropPanelSchema => ({
  title: 'Etiqueta de pestaña',
  type: 'string',
  widget: 'input',
  span: 12,
  props: { autoComplete: 'off' },
});

const fieldKeyField = (): PropPanelSchema => ({
  title: 'Clave del campo',
  type: 'string',
  widget: 'input',
  span: 12,
  props: { autoComplete: 'off' },
});

/** Convenience: dataLabel + tabLabel + fieldKey */
export const dataLabelFields = (): Record<string, PropPanelSchema> => ({
  dataLabel: dataLabelField(),
  tabLabel: tabLabelField(),
  fieldKey: fieldKeyField(),
});

// ── Validation ─────────────────────────────────────────────────────────────

export const validationTypeField = (): PropPanelSchema => ({
  title: 'Tipo de validación',
  type: 'string',
  widget: 'select',
  // Full-width trigger so the selected label never truncates ("Sin val…").
  span: 24,
  props: {
    // Sin valor persistido el trigger quedaba en blanco y no se entendía si
    // faltaba configurar la validación o si el control estaba roto.
    placeholder: 'Selecciona una validación',
    // Let the dropdown size to its content (≥220px via CSS) instead of matching
    // the trigger width — keeps option labels fully readable.
    popupMatchSelectWidth: false,
    classNames: {
      popup: {
        root: 'sisad-inspector-select-popup',
      },
    },
    options: [
      { label: 'Sin validación', value: 'none' },
      { label: 'Correo electrónico', value: 'email' },
      { label: 'Solo números', value: 'number' },
      { label: 'Solo letras', value: 'letters' },
      { label: 'Fecha', value: 'date' },
      { label: 'Cédula / identificación', value: 'id' },
      { label: 'Código personalizado', value: 'regex' },
    ],
  },
});

const validationPatternField = (): PropPanelSchema => ({
  title: 'Patrón (regex)',
  type: 'string',
  widget: 'input',
  span: 24,
  props: { autoComplete: 'off' },
  hidden: '{{formData["validation.type"] !== "regex"}}',
});

export const validationMessageField = (): PropPanelSchema => ({
  title: 'Mensaje de error',
  type: 'string',
  widget: 'input',
  span: 24,
  hidden: '{{!(formData.required || formData.mandatory || (formData["validation.type"] && formData["validation.type"] !== "none"))}}',
});

export const validationMinField = (): PropPanelSchema => ({
  title: 'Mín.',
  type: 'number',
  widget: 'inputNumber',
  span: 8,
});

export const validationMaxField = (): PropPanelSchema => ({
  title: 'Máx.',
  type: 'number',
  widget: 'inputNumber',
  span: 8,
});

/** Convenience: full validation block for text-like fields */
export const textValidationFields = (): Record<string, PropPanelSchema> => ({
  'validation.type': validationTypeField(),
  'validation.pattern': validationPatternField(),
  'validation.message': validationMessageField(),
});

// ── Number format ──────────────────────────────────────────────────────────

const numberFormatField = (): PropPanelSchema => ({
  title: 'Formato',
  type: 'string',
  widget: 'select',
  span: 12,
  props: {
    options: [
      { label: 'Libre', value: 'free' },
      { label: 'Moneda', value: 'currency' },
      { label: 'Porcentaje', value: 'percent' },
      { label: 'Entero', value: 'integer' },
    ],
  },
});

const currencyField = (): PropPanelSchema => ({
  title: 'Moneda',
  type: 'string',
  widget: 'input',
  span: 8,
  props: { placeholder: 'USD', maxLength: 8 },
});

const decimalsField = (): PropPanelSchema => ({
  title: 'Decimales',
  type: 'number',
  widget: 'inputNumber',
  span: 6,
  props: { min: 0, max: 10, precision: 0 },
});

const thousandSeparatorField = (): PropPanelSchema => ({
  title: 'Sep. miles',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

const allowNegativeField = (): PropPanelSchema => ({
  title: 'Permitir negativo',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

const positiveFormatField = (): PropPanelSchema => ({
  title: 'Formato positivo',
  type: 'string',
  widget: 'input',
  span: 12,
  props: { placeholder: '#,##0.00' },
});

const negativeFormatField = (): PropPanelSchema => ({
  title: 'Formato negativo',
  type: 'string',
  widget: 'input',
  span: 12,
  props: { placeholder: '(#,##0.00)' },
});

/** Convenience: full number format block */
export const numberFormatFields = (): Record<string, PropPanelSchema> => ({
  format: numberFormatField(),
  currency: currencyField(),
  decimals: decimalsField(),
  thousandSeparator: thousandSeparatorField(),
  allowNegative: allowNegativeField(),
  positiveFormat: positiveFormatField(),
  negativeFormat: negativeFormatField(),
});

// ── Permissions ────────────────────────────────────────────────────────────

const mandatoryField = (): PropPanelSchema => ({
  title: 'Obligatorio',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

const editableBySenderField = (): PropPanelSchema => ({
  title: 'Editable por remitente',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

const editableByRecipientField = (): PropPanelSchema => ({
  title: 'Editable por destinatario',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

/** Convenience: sender permissions block */
const permissionsFields = (): Record<string, PropPanelSchema> => ({
  mandatory: mandatoryField(),
  editableBySender: editableBySenderField(),
  editableByRecipient: editableByRecipientField(),
  restrictChanges: restrictChangesField(),
});

/**
 * Section-to-property mapping for `buildInspectorSections` propertyMap.
 * Merge this with your schema-specific propertyMap to route fields correctly.
 */
export const COMMON_PROPERTY_MAP: Partial<Record<string, 'general' | 'layout' | 'style' | 'data' | 'connections' | 'help' | 'collaboration' | 'validation' | 'advanced' | 'comments'>> = {
  // basics → explicit sections
  required: 'validation',
  readOnly: 'data',
  locked: 'collaboration',
  restrictChanges: 'collaboration',
  // content → data
  placeholder: 'data',
  defaultValue: 'data',
  maxLength: 'data',
  masked: 'data',
  fixedWidth: 'data',
  // help → help section
  tooltip: 'help',
  helpText: 'help',
  // dataLabel → connections
  dataLabel: 'connections',
  tabLabel: 'connections',
  fieldKey: 'connections',
  // validation → validation
  'validation.type': 'validation',
  'validation.pattern': 'validation',
  'validation.message': 'validation',
  // number format → data
  currency: 'data',
  thousandSeparator: 'data',
  allowNegative: 'data',
  positiveFormat: 'data',
  negativeFormat: 'data',
  // permissions → cada concepto en su única sección:
  // obligatoriedad en Reglas de llenado, capacidad de edición en Interacción,
  // y solo ownership/lock quedan en Asignación y bloqueo.
  mandatory: 'validation',
  editableBySender: 'data',
  editableByRecipient: 'data',
};
// ── Shared typography / color definitions ────────────────────────────────

type I18n = (key: string) => string;

const fontNameField = ({
  title,
  fallbackFontName,
  fontNames,
}: {
  title: string;
  fallbackFontName: string;
  fontNames: string[];
}): PropPanelSchema => ({
  title,
  type: 'string',
  widget: 'select',
  default: fallbackFontName,
  placeholder: fallbackFontName,
  props: { options: fontNames.map((name) => ({ label: name, value: name })) },
  span: 12,
});

const fontSizeField = (
  title: string,
  options: { disabled?: boolean; span?: number } = {},
): PropPanelSchema => ({
  title,
  type: 'number',
  widget: 'inputNumber',
  props: { min: 0 },
  span: options.span ?? 6,
  disabled: options.disabled,
});

const characterSpacingField = (title: string): PropPanelSchema => ({
  title,
  type: 'number',
  widget: 'inputNumber',
  props: { min: 0 },
  span: 6,
});

export const hexColorField = ({
  title,
  pattern,
  message,
  required = false,
}: {
  title: string;
  pattern: string | RegExp;
  message: string;
  required?: boolean;
}): PropPanelSchema => ({
  title,
  type: 'string',
  widget: 'color',
  props: { disabledAlpha: true },
  ...(required ? { required: true } : {}),
  rules: [{ pattern, message }],
});

type HexColorFieldDefinition =
  | string
  | { title: string; span?: number; required?: boolean };

export const hexColorFields = (
  fields: Record<string, HexColorFieldDefinition>,
  options: { pattern: string | RegExp; message: string },
): Record<string, PropPanelSchema> =>
  Object.fromEntries(
    Object.entries(fields).map(([key, definition]) => {
      const normalized =
        typeof definition === 'string' ? { title: definition } : definition;
      return [
        key,
        {
          ...hexColorField({
            title: normalized.title,
            pattern: options.pattern,
            message: options.message,
            required: normalized.required,
          }),
          ...(normalized.span == null ? {} : { span: normalized.span }),
        },
      ];
    }),
  );

export const typographyFields = ({
  i18n,
  fallbackFontName,
  fontNames,
  fontSizeDisabled = false,
}: {
  i18n: I18n;
  fallbackFontName: string;
  fontNames: string[];
  fontSizeDisabled?: boolean;
}): Record<string, PropPanelSchema> => ({
  fontName: fontNameField({
    title: i18n('schemas.text.fontName'),
    fallbackFontName,
    fontNames,
  }),
  fontSize: fontSizeField(i18n('schemas.text.size'), { disabled: fontSizeDisabled }),
  characterSpacing: characterSpacingField(i18n('schemas.text.spacing')),
});

export const horizontalAlignmentOptions = (
  i18n: I18n,
  values: { left: string; center: string; right: string },
) => [
  { label: i18n('schemas.left'), value: values.left },
  { label: i18n('schemas.center'), value: values.center },
  { label: i18n('schemas.right'), value: values.right },
];

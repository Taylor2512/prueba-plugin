/**
 * Reusable field definitions for the inspector sidebar.
 * Import specific groups and spread into any schema's propPanel.schema().
 * All fields map to canonical sections via the inspector propertyMap.
 */

import type { PropPanelSchema } from '@sisad-pdfme/common';

// ── Behavior / basics ──────────────────────────────────────────────────────

export const requiredField = (): PropPanelSchema => ({
  title: 'Campo obligatorio',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

export const readOnlyField = (): PropPanelSchema => ({
  title: 'Solo lectura',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

export const lockedField = (): PropPanelSchema => ({
  title: 'Bloqueado',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

export const restrictChangesField = (): PropPanelSchema => ({
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

export const placeholderTextField = (label = 'Placeholder'): PropPanelSchema => ({
  title: label,
  type: 'string',
  widget: 'input',
  span: 24,
});

export const defaultValueField = (label = 'Valor por defecto'): PropPanelSchema => ({
  title: label,
  type: 'string',
  widget: 'input',
  span: 24,
});

export const maxLengthField = (): PropPanelSchema => ({
  title: 'Máximo caracteres',
  type: 'number',
  widget: 'inputNumber',
  span: 12,
  props: { min: 0, precision: 0 },
});

export const maskedField = (): PropPanelSchema => ({
  title: 'Ocultar con asteriscos',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

export const fixedWidthField = (): PropPanelSchema => ({
  title: 'Anchura fija',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

// ── Help / tooltip ─────────────────────────────────────────────────────────

export const tooltipField = (): PropPanelSchema => ({
  title: 'Texto de ayuda (tooltip)',
  type: 'string',
  widget: 'textarea',
  span: 24,
  props: { maxLength: 2000, autoSize: { minRows: 2, maxRows: 4 } },
});

export const helpTextField = (): PropPanelSchema => ({
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

export const dataLabelField = (): PropPanelSchema => ({
  title: 'Etiqueta de datos',
  type: 'string',
  widget: 'input',
  span: 12,
  props: { autoComplete: 'off' },
});

export const tabLabelField = (): PropPanelSchema => ({
  title: 'Etiqueta de pestaña',
  type: 'string',
  widget: 'input',
  span: 12,
  props: { autoComplete: 'off' },
});

export const fieldKeyField = (): PropPanelSchema => ({
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
  span: 12,
  props: {
    options: [
      { label: 'Ninguna', value: 'none' },
      { label: 'Correo electrónico', value: 'email' },
      { label: 'Solo números', value: 'number' },
      { label: 'Solo letras', value: 'letters' },
      { label: 'Fecha', value: 'date' },
      { label: 'Código postal', value: 'zip' },
      { label: 'Código postal ext.', value: 'zipExtended' },
      { label: 'SSN', value: 'ssn' },
      { label: 'Expresión regular', value: 'regex' },
    ],
  },
});

export const validationPatternField = (): PropPanelSchema => ({
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

export const numberFormatField = (): PropPanelSchema => ({
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

export const currencyField = (): PropPanelSchema => ({
  title: 'Moneda',
  type: 'string',
  widget: 'input',
  span: 8,
  props: { placeholder: 'USD', maxLength: 8 },
});

export const decimalsField = (): PropPanelSchema => ({
  title: 'Decimales',
  type: 'number',
  widget: 'inputNumber',
  span: 6,
  props: { min: 0, max: 10, precision: 0 },
});

export const thousandSeparatorField = (): PropPanelSchema => ({
  title: 'Sep. miles',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

export const allowNegativeField = (): PropPanelSchema => ({
  title: 'Permitir negativo',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

export const positiveFormatField = (): PropPanelSchema => ({
  title: 'Formato positivo',
  type: 'string',
  widget: 'input',
  span: 12,
  props: { placeholder: '#,##0.00' },
});

export const negativeFormatField = (): PropPanelSchema => ({
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

export const mandatoryField = (): PropPanelSchema => ({
  title: 'Obligatorio para remitente',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

export const editableBySenderField = (): PropPanelSchema => ({
  title: 'Editable por remitente',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

export const editableByRecipientField = (): PropPanelSchema => ({
  title: 'Editable por destinatario',
  type: 'boolean',
  widget: 'switch',
  span: 12,
});

/** Convenience: sender permissions block */
export const permissionsFields = (): Record<string, PropPanelSchema> => ({
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
  // basics → behavior (data)
  required: 'data',
  readOnly: 'data',
  locked: 'data',
  restrictChanges: 'data',
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
  // permissions → advanced
  mandatory: 'advanced',
  editableBySender: 'advanced',
  editableByRecipient: 'advanced',
};

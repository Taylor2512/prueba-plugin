import React from 'react';
import { Button, Input, Modal } from 'antd';
import { DESIGNER_CLASSNAME } from '../../constants.js';

export type CustomFieldDef = {
  id: string;
  name: string;
  type: string;
  initialValue: string;
  required: boolean;
  readOnly: boolean;
  shared: boolean;
  collaborative: boolean;
  font: string;
  fontColor: string;
  fontSize: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  fixedWidth: boolean;
  maskAsterisks: boolean;
  width: string;
  height: string;
  maxChars: string;
  validation: string;
  helpText: string;
  autoPlaceText: string;
};

export const CUSTOM_FIELD_TYPE_OPTIONS = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'checkbox', label: 'Casilla de verificación' },
  { value: 'select', label: 'Menú desplegable' },
  { value: 'radioGroup', label: 'Opción' },
  { value: 'date', label: 'Fecha' },
  { value: 'email', label: 'Correo electrónico' },
  { value: 'name', label: 'Nombre' },
  { value: 'line', label: 'Línea' },
];

type Props = {
  open: boolean;
  draft: CustomFieldDef;
  onCancel: () => void;
  onSave: () => void;
  onChange: <K extends keyof CustomFieldDef>(_key: K, _value: CustomFieldDef[K]) => void;
};

const FONT_OPTIONS = [
  { value: '__DEFAULT__', label: '-- Predeterminada --' },
  { value: 'arial', label: 'Arial' },
  { value: 'calibri', label: 'Calibri' },
  { value: 'couriernew', label: 'Courier New' },
  { value: 'lucidaconsole', label: 'Lucida Console' },
  { value: 'tahoma', label: 'Tahoma' },
];

const FONT_COLOR_OPTIONS = [
  { value: '__DEFAULT__', label: '-- Predeterminada --' },
  { value: 'black', label: 'Negro' },
  { value: 'purple', label: 'Morado' },
  { value: 'darkred', label: 'Rojo oscuro' },
  { value: 'green', label: 'Verde' },
];

const FONT_SIZE_OPTIONS = [
  { value: '__DEFAULT__', label: '-- Predeterminada --' },
  { value: '9', label: '9' },
  { value: '10', label: '10' },
  { value: '11', label: '11' },
  { value: '12', label: '12' },
  { value: '14', label: '14' },
];

const VALIDATION_OPTIONS = [
  { value: 'None', label: 'Ninguno' },
  { value: 'Email', label: 'Correo electrónico' },
  { value: 'Number', label: 'Números' },
  { value: 'Date', label: 'Fecha' },
];

const Section = ({
  title,
  children,
  fieldset = false,
}: {
  title: string;
  children: React.ReactNode;
  fieldset?: boolean;
}) => {
  const id = `${DESIGNER_CLASSNAME}custom-field-section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  if (fieldset) {
    return (
      <fieldset className={`${DESIGNER_CLASSNAME}custom-field-section`} aria-labelledby={id}>
        <legend id={id} className={`${DESIGNER_CLASSNAME}custom-field-section-legend`}>
          {title}
        </legend>
        {children}
      </fieldset>
    );
  }

  return (
    <section className={`${DESIGNER_CLASSNAME}custom-field-section`} aria-labelledby={id}>
      <h4 id={id}>{title}</h4>
      {children}
    </section>
  );
};

const TextField = ({
  label,
  value,
  placeholder,
  onChange,
  name,
}: {
  label?: string;
  value: string;
  placeholder?: string;
  onChange: (_value: string) => void;
  name?: string;
}) => {
  const generatedId = React.useId();
  const id = name ? `${DESIGNER_CLASSNAME}custom-field-${name}` : generatedId;
  return (
    <div className={`${DESIGNER_CLASSNAME}custom-field-control`}>
      {label ? (
        <label htmlFor={id} className={`${DESIGNER_CLASSNAME}custom-field-label`}>
          {label}
        </label>
      ) : null}
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={label || name} />
    </div>
  );
};

const SelectField = ({
  label,
  value,
  options,
  onChange,
  name,
}: {
  label?: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (_value: string) => void;
  name?: string;
}) => {
  const generatedId = React.useId();
  const id = name ? `${DESIGNER_CLASSNAME}custom-field-${name}` : generatedId;
  return (
    <div className={`${DESIGNER_CLASSNAME}custom-field-control`}>
      {label ? (
        <label htmlFor={id} className={`${DESIGNER_CLASSNAME}custom-field-label`}>
          {label}
        </label>
      ) : null}
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)} className={`${DESIGNER_CLASSNAME}custom-field-select`} aria-label={label || name}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

const CheckboxField = ({
  label,
  checked,
  onChange,
  name,
}: {
  label: string;
  checked: boolean;
  onChange: (_value: boolean) => void;
  name?: string;
}) => {
  const generatedId = React.useId();
  const id = name ? `${DESIGNER_CLASSNAME}custom-field-${name}` : generatedId;
  return (
    <div className={`${DESIGNER_CLASSNAME}custom-field-checkbox`}>
      <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

const CustomFieldModal = ({ open, draft, onCancel, onSave, onChange }: Props) => (
  <Modal
    open={open}
    title="Detalles de campos personalizados"
    onCancel={onCancel}
    footer={null}
    width="min(760px, calc(100vw - 1rem))"
    className={`${DESIGNER_CLASSNAME}custom-field-modal`}
  >
    <div className={`${DESIGNER_CLASSNAME}custom-field-form`}>
      <div className={`${DESIGNER_CLASSNAME}custom-field-form-scroll`}>
        <Section title="Identidad">
          <div className={`${DESIGNER_CLASSNAME}custom-field-grid`}>
            <TextField
              label="Nombre *"
              name="name"
              value={draft.name}
              placeholder="Nombre del campo"
              onChange={(value) => onChange('name', value)}
            />
            <SelectField
              label="Tipo"
              name="type"
              value={draft.type}
              options={CUSTOM_FIELD_TYPE_OPTIONS}
              onChange={(value) => onChange('type', value)}
            />
            <TextField
              label="Valor inicial"
              name="initialValue"
              value={draft.initialValue}
              placeholder="Valor inicial"
              onChange={(value) => onChange('initialValue', value)}
            />
          </div>
        </Section>

        <Section title="Opciones" fieldset>
          <CheckboxField name="required" label="Obligatorio" checked={draft.required} onChange={(value) => onChange('required', value)} />
          <CheckboxField name="readOnly" label="Solo lectura" checked={draft.readOnly} onChange={(value) => onChange('readOnly', value)} />
          <CheckboxField name="shared" label="Compartido" checked={draft.shared} onChange={(value) => onChange('shared', value)} />
        </Section>

        <Section title="Colaboración" fieldset>
          <CheckboxField
            name="collaborative"
            label="Los destinatarios pueden colaborar"
            checked={draft.collaborative}
            onChange={(value) => onChange('collaborative', value)}
          />
        </Section>

        <Section title="Aplicar formato">
          <div className={`${DESIGNER_CLASSNAME}custom-field-grid`}>
            <SelectField label="Fuente" name="font" value={draft.font} options={FONT_OPTIONS} onChange={(value) => onChange('font', value)} />
            <SelectField
              label="Color de fuente"
              name="fontColor"
              value={draft.fontColor}
              options={FONT_COLOR_OPTIONS}
              onChange={(value) => onChange('fontColor', value)}
            />
            <SelectField
              label="Tamaño de fuente"
              name="fontSize"
              value={draft.fontSize}
              options={FONT_SIZE_OPTIONS}
              onChange={(value) => onChange('fontSize', value)}
            />
          </div>
          <div className={`${DESIGNER_CLASSNAME}custom-field-inline-checks`}>
            <CheckboxField name="bold" label="Negrita" checked={draft.bold} onChange={(value) => onChange('bold', value)} />
            <CheckboxField name="italic" label="Cursiva" checked={draft.italic} onChange={(value) => onChange('italic', value)} />
            <CheckboxField name="underline" label="Subrayado" checked={draft.underline} onChange={(value) => onChange('underline', value)} />
            <CheckboxField
              name="maskAsterisks"
              label="Ocultar texto con asteriscos"
              checked={draft.maskAsterisks}
              onChange={(value) => onChange('maskAsterisks', value)}
            />
            <CheckboxField name="fixedWidth" label="Anchura fija" checked={draft.fixedWidth} onChange={(value) => onChange('fixedWidth', value)} />
          </div>
        </Section>

        <Section title="Tamaño">
          <div className={`${DESIGNER_CLASSNAME}custom-field-grid`}>
            <TextField name="width" label="Ancho" value={draft.width} onChange={(value) => onChange('width', value)} />
            <TextField name="height" label="Altura" value={draft.height} onChange={(value) => onChange('height', value)} />
            <TextField
              name="maxChars"
              label="N.º máx. de caracteres"
              value={draft.maxChars}
              onChange={(value) => onChange('maxChars', value)}
            />
          </div>
        </Section>

        <Section title="Validación predeterminada">
          <SelectField
            name="validation"
            value={draft.validation}
            options={VALIDATION_OPTIONS}
            onChange={(value) => onChange('validation', value)}
          />
        </Section>

        <Section title="Avanzado predeterminado">
          <div className={`${DESIGNER_CLASSNAME}custom-field-grid`}>
            <TextField
              name="helpText"
              label="Información de ayuda sobre el campo"
              value={draft.helpText}
              onChange={(value) => onChange('helpText', value)}
            />
            <TextField
              name="autoPlaceText"
              label="Colocar automáticamente texto"
              value={draft.autoPlaceText}
              onChange={(value) => onChange('autoPlaceText', value)}
            />
          </div>
        </Section>
      </div>

      <div className={`${DESIGNER_CLASSNAME}custom-field-footer`}>
        <Button type="primary" onClick={onSave} disabled={!draft.name.trim()}>
          Guardar
        </Button>
        <Button onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  </Modal>
);

export default CustomFieldModal;

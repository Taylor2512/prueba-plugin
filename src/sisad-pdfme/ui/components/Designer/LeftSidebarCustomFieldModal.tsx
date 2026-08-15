import React from 'react';
import { Button, Input, Modal } from 'antd';
import { DESIGNER_CLASSNAME } from '@sisad-pdfme/ui/constants';
import { mergeClassNames } from '@sisad-pdfme/ui/components/Designer/shared/className';

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
  options: string;
};
// Historically `options` was a string in persisted drafts; runtime expects an
// array. Ensure callers can rely on the hook returning a string[] by normalizing
// defaults in the hook that consumes CustomFieldDef. Keep the modal contract
// backward compatible here by accepting `options` as `string` and parsing it
// where needed.

const CUSTOM_FIELD_TYPE_OPTIONS = [
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

/** Valida el contrato mínimo antes de persistir un draft de campo custom. */
const isCustomFieldDraftValid = (draft: Pick<CustomFieldDef, 'name'>): boolean =>
  draft.name.trim().length > 0;

const FieldControl = ({
  label,
  name,
  children,
}: {
  label?: string;
  name?: string;
  children: (_id: string) => React.ReactNode;
}) => {
  const generatedId = React.useId();
  const id = name ? `${DESIGNER_CLASSNAME}custom-field-${name}` : generatedId;

  return (
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}custom-field-control`, 'space-y-1')}>
      {label ? (
        <label htmlFor={id} className={mergeClassNames(`${DESIGNER_CLASSNAME}custom-field-label`, 'block text-xs font-medium text-slate-600')}>
          {label}
        </label>
      ) : null}
      {children(id)}
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const id = `${DESIGNER_CLASSNAME}custom-field-section-${title.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <section
      className={mergeClassNames(
        `${DESIGNER_CLASSNAME}custom-field-section`,
        'border-b border-slate-200/80 pb-3 last:border-b-0 last:pb-0',
      )}
      aria-labelledby={id}
    >
      <h4 id={id} className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-slate-900">
        {title}
      </h4>
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
  return (
    <FieldControl label={label} name={name}>
      {(id) => (
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label || name}
        className="rounded-xl border-slate-200 bg-white shadow-sm"
      />
      )}
    </FieldControl>
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
  return (
    <FieldControl label={label} name={name}>
      {(id) => (
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}custom-field-select`,
          'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm',
        )}
        aria-label={label || name}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      )}
    </FieldControl>
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
    <div className={mergeClassNames(`${DESIGNER_CLASSNAME}custom-field-checkbox`, 'flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2')}>
      <input id={id} type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <label htmlFor={id} className="text-sm text-slate-700">
        {label}
      </label>
    </div>
  );
};

const CustomFieldModal = ({ open, draft, onCancel, onSave, onChange }: Props) => (
  <Modal
    open={open}
    title="Detalles de campos personalizados"
    centered
    onCancel={onCancel}
    footer={null}
    width="min(720px, calc(100vw - 1rem))"
    maskClosable
    classNames={{
      wrapper: 'backdrop-blur-[1px]',
      mask: 'bg-slate-950/45',
      content:
        'overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.16)]',
      header: 'border-b border-slate-200/80 px-5 py-4',
      body: 'bg-slate-50/70 p-0',
    }}
  >
    <div className={mergeClassNames(
      `${DESIGNER_CLASSNAME}custom-field-form`,
      'flex max-h-[80dvh] flex-col rounded-b-3xl bg-slate-50/70 p-3',
    )}>
      <div className={mergeClassNames(
        `${DESIGNER_CLASSNAME}custom-field-form-scroll`,
        'min-h-0 flex-1 space-y-3 overflow-y-auto pr-0.5',
      )}>
        <Section title="Identidad">
          <div className={mergeClassNames(`${DESIGNER_CLASSNAME}custom-field-grid`, 'grid gap-2.5 md:grid-cols-2')}>
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

        <Section title="Opciones">
          <div className="grid gap-2 md:grid-cols-3">
            <CheckboxField name="required" label="Obligatorio" checked={draft.required} onChange={(value) => onChange('required', value)} />
            <CheckboxField name="readOnly" label="Solo lectura" checked={draft.readOnly} onChange={(value) => onChange('readOnly', value)} />
            <CheckboxField name="shared" label="Compartido" checked={draft.shared} onChange={(value) => onChange('shared', value)} />
          </div>
        </Section>

        <Section title="Tamaño">
          <div className={mergeClassNames(`${DESIGNER_CLASSNAME}custom-field-grid`, 'grid gap-2.5 md:grid-cols-2')}>
            <TextField name="width" label="Ancho" value={draft.width} onChange={(value) => onChange('width', value)} />
            <TextField name="height" label="Altura" value={draft.height} onChange={(value) => onChange('height', value)} />
          </div>
        </Section>

        <Section title="Colocación automática">
          <TextField
            name="autoPlaceText"
            label="Colocar automáticamente texto"
            value={draft.autoPlaceText}
            onChange={(value) => onChange('autoPlaceText', value)}
          />
        </Section>

        {(draft.type === 'select' || draft.type === 'radioGroup') && (
          <Section title="Opciones de Selección">
            <TextField
              label="Opciones (una por línea o separadas por comas)"
              name="options"
              value={draft.options || ''}
              placeholder="Ej: Opción 1, Opción 2, Opción 3"
              onChange={(value) => onChange('options', value)}
            />
            <p className="mt-1 text-[0.625rem] text-slate-500">
              Define las opciones disponibles para este campo.
            </p>
          </Section>
        )}
      </div>

      <div
        className={mergeClassNames(
          `${DESIGNER_CLASSNAME}custom-field-footer`,
          'mt-3 flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 pt-3',
        )}
      >
        <Button
          type="primary"
          onClick={onSave}
          disabled={!isCustomFieldDraftValid(draft)}
          className="inline-flex h-9 items-center rounded-full border border-sky-500/70 bg-sky-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:border-sky-400 hover:bg-sky-500 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
        >
          Guardar
        </Button>
        <Button
          onClick={onCancel}
          className="inline-flex h-9 items-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        >
          Cancelar
        </Button>
      </div>
    </div>
  </Modal>
);

export default CustomFieldModal;

/**
 * Clase pública `Form` del runtime UI.
 *
 * Rol arquitectónico:
 * - Renderiza el modo interactivo de llenado usando el componente `Preview`.
 * - Hereda de `PreviewUI`, por lo que comparte template, plugins, opciones, fuentes e inputs.
 * - Expone callbacks granulares para cambios de input, cambios masivos de inputs,
 *   cambios del JSON de formulario y cambio de página.
 *
 * Diferencia frente a Viewer:
 * - `Form` sí permite modificar inputs.
 * - `Viewer` solo muestra contenido en modo lectura.
 *
 * Notas de mantenimiento:
 * - `setInputs` calcula diferencias para notificar cambios por campo.
 * - Cada notificación declara su `origin`: `user` si nació de una interacción
 *   dentro del runtime, `host` si es consecuencia de un `setInputs` externo.
 *   Sin ese dato el consumidor no puede distinguir una edición real del eco de
 *   su propia escritura, y termina marcando como `touched` campos que el propio
 *   host acaba de rellenar.
 * - Evitar reglas de negocio del host; la clase debe seguir siendo runtime genérico.
 */

import type { PreviewProps } from '@sisad-pdfme/common';
import { PagedPreviewUI } from './PagedPreviewUI';
import type { FormJsonEnvelope } from './designerEngine';

/** Procedencia de un cambio de input notificado por el runtime. */
export type FormInputChangeOrigin = 'user' | 'host';

/** Payload emitido por `onChangeInput`. */
export type FormInputChange = {
  index: number;
  value: string;
  name: string;
  origin: FormInputChangeOrigin;
};

export type FormSchemaInteractionState = {
  schemaUid: string;
  schemaName: string;
  schemaType: string;
  pageIndex: number;
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  committed: boolean;
  completed: boolean;
  interactionCount: number;
  origin: FormInputChangeOrigin | 'initial';
  revision: number;
  transactionId: string | null;
  initialValue: string;
  currentValue: string;
};

/**
 * Merge controlled rows without turning omitted sibling fields into clears.
 * Form callers can still clear a field explicitly with an empty value.
 */
export const mergeFormInputRows = (
  previous: Array<Record<string, string>>,
  next: Array<Record<string, string>>,
): Array<Record<string, string>> =>
  next.map((row, index) => ({ ...(previous[index] || {}), ...(row || {}) }));

/** Runtime interactivo para llenar campos del template. */
class Form extends PagedPreviewUI {
  private onChangeInputCallback?: (arg: FormInputChange) => void;
  private onChangeInputsCallback?: (arg: { index: number; values: Record<string, string> }) => void;
  private onChangeFormJsonCallback?: (json: FormJsonEnvelope | null) => void;
  private lastFormJson: FormJsonEnvelope | null = null;
  private readonly interactionStates = new Map<string, FormSchemaInteractionState>();
  private readonly initialInputValues: { [key: string]: string }[];
  private interactionRevision = 0;

  constructor(props: PreviewProps) {
    super(props);
    this.initialInputValues = this.getInputs().map((input) => ({ ...input }));
    this.initializeInteractionStates();
  }

  private initializeInteractionStates() {
    this.template.schemas.forEach((page, pageIndex) => {
      page.forEach((schema) => {
        const schemaRecord = schema as { schemaUid?: string; id?: string; required?: boolean };
        const schemaUid = String(schemaRecord.schemaUid || schemaRecord.id || schema.name);
        const initialValue = String(this.initialInputValues[pageIndex]?.[schema.name] ?? schema.content ?? '');
        this.interactionStates.set(`${pageIndex}:${schemaUid}`, {
          schemaUid,
          schemaName: schema.name,
          schemaType: schema.type,
          pageIndex,
          touched: false,
          dirty: false,
          valid: schemaRecord.required ? initialValue !== '' : true,
          committed: false,
          completed: initialValue !== '',
          interactionCount: 0,
          origin: 'initial',
          revision: 0,
          transactionId: null,
          initialValue,
          currentValue: initialValue,
        });
      });
    });
  }

  public getSchemaInteractionStates(): FormSchemaInteractionState[] {
    return Array.from(this.interactionStates.values()).map((state) => ({ ...state }));
  }

  public getSchemaInteractionState(index: number, name: string): FormSchemaInteractionState | null {
    const schema = this.template.schemas[index]?.find((candidate) => candidate.name === name);
    const schemaUid = String(
      (schema as { schemaUid?: string; id?: string } | undefined)?.schemaUid ||
        (schema as { id?: string } | undefined)?.id ||
        name,
    );
    const state = this.interactionStates.get(`${index}:${schemaUid}`);
    return state ? { ...state } : null;
  }

  private resolveInteractionState(index: number, name: string, value: string) {
    const schema = this.template.schemas[index]?.find((candidate) => candidate.name === name);
    const schemaRecord = schema as { schemaUid?: string; id?: string; type?: string; required?: boolean } | undefined;
    const schemaUid = String(schemaRecord?.schemaUid || schemaRecord?.id || name);
    const key = `${index}:${schemaUid}`;
    const previous = this.interactionStates.get(key);
    const initialValue = previous?.initialValue ?? String(this.initialInputValues[index]?.[name] ?? '');
    return { key, schema, schemaUid, initialValue, previous };
  }

  private recordInteraction(index: number, name: string, value: string, origin: FormInputChangeOrigin) {
    const resolved = this.resolveInteractionState(index, name, value);
    const schemaRecord = resolved.schema as { type?: string; required?: boolean } | undefined;
    const revision = ++this.interactionRevision;
    const completed = value !== '';
    const valid = schemaRecord?.required ? completed : true;
    this.interactionStates.set(resolved.key, {
      schemaUid: resolved.schemaUid,
      schemaName: name,
      schemaType: String(schemaRecord?.type || 'unknown'),
      pageIndex: index,
      touched: origin === 'user' ? true : resolved.previous?.touched || false,
      dirty: value !== resolved.initialValue,
      valid,
      committed: true,
      completed,
      interactionCount: (resolved.previous?.interactionCount || 0) + (origin === 'user' ? 1 : 0),
      origin,
      revision,
      transactionId: `form-${revision}`,
      initialValue: resolved.initialValue,
      currentValue: value,
    });
  }

  public onChangeInput(cb: (arg: FormInputChange) => void) {
    this.onChangeInputCallback = cb;
  }

  public onChangeInputs(cb: (arg: { index: number; values: Record<string, string> }) => void) {
    this.onChangeInputsCallback = cb;
  }

  public onChangeFormJson(cb: (json: FormJsonEnvelope | null) => void) {
    this.onChangeFormJsonCallback = cb;
  }

  public getFormJson() {
    return this.lastFormJson;
  }

  /** Reemplaza inputs y emite eventos por campo cambiado. */
  public setInputs(inputs: { [key: string]: string }[]): void {
    const previousInputs = this.getInputs();
    const mergedInputs = mergeFormInputRows(previousInputs, inputs);

    super.setInputs(mergedInputs);

    const changedInputs: Array<{ index: number; name: string; value: string }> = [];

    mergedInputs.forEach((input, index) => {
      const prevInput = previousInputs[index] || {};

      const allKeys = new Set([...Object.keys(input), ...Object.keys(prevInput)]);

      allKeys.forEach((name) => {
        const newValue = input[name];
        const oldValue = prevInput[name];

        if (newValue !== oldValue) {
          changedInputs.push({ index, name, value: newValue });
          this.recordInteraction(index, name, newValue, 'host');
        }
      });
    });

    changedInputs.forEach((input) => {
      if (this.onChangeInputCallback) {
        this.onChangeInputCallback({ ...input, origin: 'host' });
      }
    });
  }

  /** Renderiza Preview en modo formulario y sincroniza inputs/formJson. */
  protected render() {
    this.renderPreview({
      onFormJsonChange: (json: FormJsonEnvelope | null) => {
        this.lastFormJson = json;
        this.onChangeFormJsonCallback?.(json);
      },
      onChangeInput: (arg: { index: number; value: string; name: string }) => {
        const { index, value, name } = arg;
        const currentInput = this.inputs?.[index];
        if (currentInput && currentInput[name] !== value) {
          currentInput[name] = value;
        }
        this.recordInteraction(index, name, value, 'user');
        this.onChangeInputCallback?.({ index, value, name, origin: 'user' });
      },
    });
  }
}

export default Form;

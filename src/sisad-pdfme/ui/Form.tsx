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
import { cloneDeep } from '@sisad-pdfme/common';
import { PagedPreviewUI } from '@sisad-pdfme/ui/PagedPreviewUI';
import type { FormJsonEnvelope } from '@sisad-pdfme/ui/designerEngine';
import {
  applySchemaInteraction,
  createSchemaInteractionState,
} from '@sisad-pdfme/runtime/schemaInteractionState';
import type {
  SchemaInteractionOrigin,
  SchemaInteractionState,
} from '@sisad-pdfme/runtime/schemaInteractionState';

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
  origin: SchemaInteractionOrigin;
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

/**
 * Diferencia por campo entre dos conjuntos de filas de inputs.
 *
 * Una clave presente sólo en `previous` cuenta como cambio a `undefined`: el
 * consumidor necesita distinguir «campo borrado» de «campo ausente del patch».
 * Vive fuera de `setInputs` porque es lógica pura y era la única parte del
 * diff que no se podía ejercer sin montar un runtime completo.
 */
export const collectChangedInputs = (
  previous: Array<Record<string, string>>,
  next: Array<Record<string, string>>,
): Array<{ index: number; name: string; value: string }> => {
  const changed: Array<{ index: number; name: string; value: string }> = [];
  next.forEach((row, index) => {
    const previousRow = previous[index] || {};
    const names = new Set([...Object.keys(row || {}), ...Object.keys(previousRow)]);
    names.forEach((name) => {
      const nextValue = (row || {})[name];
      if (nextValue !== previousRow[name]) {
        changed.push({ index, name, value: nextValue });
      }
    });
  });
  return changed;
};

/** Runtime interactivo para llenar campos del template. */
class Form extends PagedPreviewUI {
  private onExportCallback?: PreviewProps['onExport'];
  private onChangeInputCallback?: (arg: FormInputChange) => void;
  private onChangeInputsCallback?: (arg: { index: number; values: Record<string, string> }) => void;
  private onChangeFormJsonCallback?: (json: FormJsonEnvelope | null) => void;
  private lastFormJson: FormJsonEnvelope | null = null;
  private readonly interactionStates = new Map<string, FormSchemaInteractionState>();
  private readonly initialInputValues: { [key: string]: string }[];
  private interactionRevision = 0;

  constructor(props: PreviewProps) {
    super(props);
    this.onExportCallback = props.onExport;
    this.initialInputValues = this.getInputs().map((input) => ({ ...input }));
    this.initializeInteractionStates();
  }

  private initializeInteractionStates() {
    this.template.schemas.forEach((page, pageIndex) => {
      page.forEach((schema) => {
        const schemaRecord = schema as { schemaUid?: string; id?: string; required?: boolean };
        const schemaUid = String(schemaRecord.schemaUid || schemaRecord.id || schema.name);
        const initialValue = String(this.initialInputValues[pageIndex]?.[schema.name] ?? schema.content ?? '');
        const state = createSchemaInteractionState({
          schemaUid,
          schemaName: schema.name,
          schemaType: schema.type,
          initialValue,
          policy: { required: schemaRecord.required },
        });
        this.interactionStates.set(`${pageIndex}:${schemaUid}`, {
          schemaUid,
          schemaName: schema.name,
          schemaType: schema.type,
          pageIndex,
          touched: state.touched,
          dirty: state.dirty,
          valid: state.valid,
          committed: state.committed,
          completed: state.completed,
          interactionCount: state.interactionCount,
          origin: state.lastOrigin,
          revision: state.revision,
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
    const prevState: SchemaInteractionState = resolved.previous
      ? {
          schemaUid: resolved.previous.schemaUid,
          schemaName: resolved.previous.schemaName,
          schemaType: resolved.previous.schemaType,
          touched: resolved.previous.touched,
          dirty: resolved.previous.dirty,
          committed: resolved.previous.committed,
          valid: resolved.previous.valid,
          completed: resolved.previous.completed,
          interactionCount: resolved.previous.interactionCount,
          initialValue: resolved.previous.initialValue,
          currentValue: resolved.previous.currentValue,
          lastOrigin: resolved.previous.origin,
          revision: resolved.previous.revision,
          lastTransactionId: resolved.previous.transactionId ?? undefined,
        }
      : createSchemaInteractionState({
          schemaUid: resolved.schemaUid,
          schemaName: name,
          schemaType: String(schemaRecord?.type || 'unknown'),
          initialValue: resolved.initialValue,
        });
    const next = applySchemaInteraction(
      prevState,
      value,
      origin,
      { required: schemaRecord?.required },
      { revision, transactionId: `form-${revision}`, committed: true },
    );
    this.interactionStates.set(resolved.key, {
      schemaUid: resolved.schemaUid,
      schemaName: name,
      schemaType: String(schemaRecord?.type || 'unknown'),
      pageIndex: index,
      touched: next.touched,
      dirty: next.dirty,
      valid: next.valid,
      committed: next.committed,
      completed: next.completed,
      interactionCount: next.interactionCount,
      origin,
      revision: next.revision,
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

    const changedInputs = collectChangedInputs(previousInputs, mergedInputs);

    changedInputs.forEach((input) => {
      this.recordInteraction(input.index, input.name, input.value, 'host');
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
      onExport: () => {
        const exportCallback = this.onExportCallback;
        if (!exportCallback) return;
        void exportCallback({
          // Capture by value before the async generator starts. The live Form
          // remains editable while PDF #1 is being rendered.
          template: cloneDeep(this.getTemplate()),
          inputs: cloneDeep(this.getInputs()),
          plugins: this.getPluginsRegistry() as unknown as PreviewProps['plugins'],
          options: cloneDeep(this.getOptions()),
        });
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

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
 * - Evitar reglas de negocio del host; la clase debe seguir siendo runtime genérico.
 */

import type { PreviewProps } from '@sisad-pdfme/common';
import { PagedPreviewUI } from './PagedPreviewUI';
import type { FormJsonEnvelope } from './designerEngine';

export type FormInputChange = { index: number; name: string; value: unknown };

export const collectChangedInputs = (
  previousInputs: { [key: string]: string }[] = [],
  nextInputs: { [key: string]: string }[] = [],
): FormInputChange[] => {
  const changedInputs: FormInputChange[] = [];
  const maxLength = Math.max(previousInputs.length, nextInputs.length);

  for (let index = 0; index < maxLength; index += 1) {
    const prevInput = previousInputs[index] || {};
    const nextInput = nextInputs[index] || {};

    const seenNames = new Set<string>();

    for (const name of Object.keys(prevInput)) {
      seenNames.add(name);
      if (prevInput[name] !== nextInput[name]) {
        changedInputs.push({ index, name, value: nextInput[name] });
      }
    }

    for (const name of Object.keys(nextInput)) {
      if (seenNames.has(name)) continue;
      changedInputs.push({ index, name, value: nextInput[name] });
    }
  }

  return changedInputs;
};

/** Runtime interactivo para llenar campos del template. */
class Form extends PagedPreviewUI {
  private onChangeInputCallback?: (arg: { index: number; value: unknown; name: string }) => void;
  private onChangeInputsCallback?: (arg: { index: number; values: Record<string, string> }) => void;
  private onChangeFormJsonCallback?: (json: FormJsonEnvelope | null) => void;
  private lastFormJson: FormJsonEnvelope | null = null;

  constructor(props: PreviewProps) {
    super(props);
  }

  public onChangeInput(cb: (arg: { index: number; value: unknown; name: string }) => void) {
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
    const changedInputs = collectChangedInputs(previousInputs, inputs);

    if (changedInputs.length === 0) return;

    super.setInputs(inputs);

    changedInputs.forEach((input) => {
      if (this.onChangeInputCallback) {
        this.onChangeInputCallback(input);
      }
    });
  }

  /** Renderiza Preview en modo formulario y sincroniza inputs/formJson. */
  protected render() {
    this.renderPreview({
      onChangeInputs: (arg: { index: number; values: Record<string, string> }) => {
        const nextInputs = this.getInputs().map((input, index) =>
          index === arg.index ? { ...input, ...arg.values } : input,
        );
        this.setInputs(nextInputs);
        this.onChangeInputsCallback?.(arg);
      },
      onFormJsonChange: (json: FormJsonEnvelope | null) => {
        this.lastFormJson = json;
        this.onChangeFormJsonCallback?.(json);
      },
      onChangeInput: (arg: { index: number; value: string; name: string }) => {
        const { index, value, name } = arg;
        const currentInput = this.inputs?.[index];
        if (currentInput && currentInput[name] === value) return;
        this.onChangeInputCallback?.({ index, value, name });
        if (currentInput && currentInput[name] !== value) {
          currentInput[name] = value;
          this.render();
        }
      },
    });
  }
}

export default Form;

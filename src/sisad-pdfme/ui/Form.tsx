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

/** Runtime interactivo para llenar campos del template. */
class Form extends PagedPreviewUI {
  private onChangeInputCallback?: (arg: { index: number; value: string; name: string }) => void;
  private onChangeInputsCallback?: (arg: { index: number; values: Record<string, string> }) => void;
  private onChangeFormJsonCallback?: (json: FormJsonEnvelope | null) => void;
  private lastFormJson: FormJsonEnvelope | null = null;

  constructor(props: PreviewProps) {
    super(props);
  }

  public onChangeInput(cb: (arg: { index: number; value: string; name: string }) => void) {
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

    super.setInputs(inputs);

    const changedInputs: Array<{ index: number; name: string; value: string }> = [];

    inputs.forEach((input, index) => {
      const prevInput = previousInputs[index] || {};

      const allKeys = new Set([...Object.keys(input), ...Object.keys(prevInput)]);

      allKeys.forEach((name) => {
        const newValue = input[name];
        const oldValue = prevInput[name];

        if (newValue !== oldValue) {
          changedInputs.push({ index, name, value: newValue });
        }
      });
    });

    changedInputs.forEach((input) => {
      if (this.onChangeInputCallback) {
        this.onChangeInputCallback(input);
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
        this.onChangeInputCallback?.({ index, value, name });
      },
    });
  }
}

export default Form;

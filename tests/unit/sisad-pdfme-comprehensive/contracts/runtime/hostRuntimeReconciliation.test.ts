/**
 * RTP-040 — Origin/revision y controlled/uncontrolled reconciliation.
 *
 * Contrato bajo prueba:
 * - un cambio originado en el runtime no debe volver a empujarse al runtime
 *   (evita perder caret/IME en cada pulsación);
 * - un cambio originado en el host SIEMPRE debe llegar al runtime, incluso si
 *   ocurre inmediatamente después de un cambio del usuario;
 * - un `setInputs` del host no puede re-emitirse como interacción de usuario.
 */
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  usePdfmeRuntimeInstance,
  type UsePdfmeRuntimeInstanceConfig,
} from '@sisad-pdfme/runtime/usePdfmeRuntimeInstance';

type Inputs = Record<string, string>[];
type InputHandler = (payload: { index: number; name: string; value: unknown }) => void;

/** Doble ligero del runtime Form: registra lo que el adapter le empuja. */
class FakeForm {
  static last: FakeForm | null = null;

  public setInputsCalls: Inputs[] = [];
  public inputs: Inputs;
  private handler: InputHandler | null = null;

  constructor(props: { inputs?: unknown }) {
    this.inputs = (props.inputs as Inputs) || [];
    FakeForm.last = this;
  }

  destroy() {}
  updateOptions() {}
  updateTemplate() {}
  setInputs(inputs: unknown) {
    this.inputs = inputs as Inputs;
    this.setInputsCalls.push(inputs as Inputs);
  }
  onChangeInput(handler: InputHandler) {
    this.handler = handler;
  }
  /** Simula que el usuario editó un campo dentro del runtime. */
  emitUserChange(payload: { index: number; name: string; value: unknown }) {
    this.inputs = this.inputs.map((row, i) =>
      i === payload.index ? { ...row, [payload.name]: String(payload.value) } : row,
    );
    // The InputHandler type does not include 'origin' historically; tests
    // expect an extra 'origin' field — provide it but keep the handler call
    // compatible by casting to unknown.
    this.handler?.(({
      index: payload.index,
      name: payload.name,
      value: payload.value,
      origin: 'user',
    } as unknown) as { index: number; name: string; value: unknown });
  }

  /** Simula el diff que `Form.setInputs` emite tras una escritura del host. */
  emitHostEcho(payload: { index: number; name: string; value: unknown }) {
    this.handler?.(({
      index: payload.index,
      name: payload.name,
      value: payload.value,
      origin: 'host',
    } as unknown) as { index: number; name: string; value: unknown });
  }
}

class FakeNoop {
  constructor(_props: unknown) {}
  destroy() {}
  updateOptions() {}
  updateTemplate() {}
  setInputs() {}
  onChangeTemplate() {}
  onChangeInput() {}
  onPageChange() {}
}

const RUNTIME = {
  Designer: FakeNoop as never,
  Form: FakeForm as never,
  Viewer: FakeNoop as never,
};

const TEMPLATE = { basePdf: null, schemas: [] };
const OPTIONS = {};
const PLUGINS = {};

const buildConfig = (
  inputs: Inputs,
  onInputChange: UsePdfmeRuntimeInstanceConfig['onInputChange'],
  containerRef: { current: HTMLElement | null },
  isolationKey?: string | null,
  inputsRevision?: number,
): UsePdfmeRuntimeInstanceConfig => ({
  containerRef: containerRef as never,
  mode: 'form',
  isolationKey,
  template: TEMPLATE,
  inputs,
  options: OPTIONS,
  plugins: PLUGINS,
  runtime: RUNTIME,
  onTemplateChange: () => undefined,
  onInputChange,
  inputsRevision,
});

describe('RTP-040 host ↔ runtime input reconciliation', () => {
  let containerRef: { current: HTMLElement | null };
  let onInputChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    FakeForm.last = null;
    containerRef = { current: document.createElement('div') };
    onInputChange = vi.fn();
  });

  const mount = (inputs: Inputs) =>
    renderHook(
      (props: { inputs: Inputs }) =>
        usePdfmeRuntimeInstance(buildConfig(props.inputs, onInputChange, containerRef)),
      { initialProps: { inputs } },
    );

  it('monta el runtime Form con los inputs iniciales', () => {
    mount([{ nombre: '' }]);
    expect(FakeForm.last).not.toBeNull();
    expect(FakeForm.last?.setInputsCalls).toHaveLength(0);
  });

  it('no reenvía al runtime el eco de un cambio originado por el usuario', () => {
    const { rerender } = mount([{ nombre: '' }]);
    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'John' });
    expect(onInputChange).toHaveBeenCalledWith(
      expect.objectContaining({ index: 0, name: 'nombre', value: 'John' }),
    );

    // El host aplica el cambio y devuelve una identidad nueva con el mismo valor.
    rerender({ inputs: [{ nombre: 'John' }] });

    expect(FakeForm.last?.setInputsCalls).toHaveLength(0);
  });

  it('aplica un update del host que llega justo después de un cambio del usuario', () => {
    const { rerender } = mount([{ nombre: '', empresa: '' }]);
    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'John' });

    // Prefill/restore legítimo del host sobre OTRO campo, encadenado al anterior.
    rerender({ inputs: [{ nombre: 'John', empresa: 'ACME' }] });

    expect(FakeForm.last?.setInputsCalls).toHaveLength(1);
    expect(FakeForm.last?.setInputsCalls[0]).toEqual([{ nombre: 'John', empresa: 'ACME' }]);
  });

  it('aplica un update del host que corrige el valor recién escrito por el usuario', () => {
    const { rerender } = mount([{ nombre: '' }]);
    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'John' });

    // El host normaliza/rechaza el valor del usuario.
    rerender({ inputs: [{ nombre: 'JOHN' }] });

    expect(FakeForm.last?.setInputsCalls).toHaveLength(1);
    expect(FakeForm.last?.setInputsCalls[0]).toEqual([{ nombre: 'JOHN' }]);
  });

  it('no aplica un host push con revisión anterior a la edición local', () => {
    const { rerender } = renderHook(
      (props: { inputs: Inputs; inputsRevision: number }) =>
        usePdfmeRuntimeInstance(
          buildConfig(props.inputs, onInputChange, containerRef, null, props.inputsRevision),
        ),
      { initialProps: { inputs: [{ nombre: '' }], inputsRevision: 0 } },
    );

    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'local' });
    rerender({ inputs: [{ nombre: 'stale-host' }], inputsRevision: 0 });

    expect(FakeForm.last?.setInputsCalls).toHaveLength(0);
    expect(FakeForm.last?.inputs).toEqual([{ nombre: 'local' }]);
  });

  it('aplica un update del host sin cambio previo del usuario', () => {
    const { rerender } = mount([{ nombre: '' }]);
    rerender({ inputs: [{ nombre: 'prefill' }] });
    expect(FakeForm.last?.setInputsCalls).toHaveLength(1);
  });

  it('ignora una identidad nueva cuyo contenido ya está en el runtime', () => {
    const { rerender } = mount([{ nombre: 'igual' }]);
    rerender({ inputs: [{ nombre: 'igual' }] });
    expect(FakeForm.last?.setInputsCalls).toHaveLength(0);
  });

  it('propaga al runtime el alta de una fila nueva', () => {
    const { rerender } = mount([{ nombre: 'a' }]);
    rerender({ inputs: [{ nombre: 'a' }, { nombre: 'b' }] });
    expect(FakeForm.last?.setInputsCalls).toHaveLength(1);
  });

  it('propaga al runtime la baja de un campo', () => {
    const { rerender } = mount([{ nombre: 'a', extra: 'x' }]);
    rerender({ inputs: [{ nombre: 'a' }] });
    expect(FakeForm.last?.setInputsCalls).toHaveLength(1);
  });

  it('no notifica al host el eco de su propio setInputs', () => {
    mount([{ nombre: '' }]);
    FakeForm.last?.emitHostEcho({ index: 0, name: 'nombre', value: 'prefill' });
    expect(onInputChange).not.toHaveBeenCalled();
  });

  it('sigue notificando los cambios de origen usuario', () => {
    mount([{ nombre: '' }]);
    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'John' });
    expect(onInputChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'nombre', value: 'John', origin: 'user' }),
    );
  });

  it('un eco del host no invalida el espejo ni fuerza un push posterior', () => {
    const { rerender } = mount([{ nombre: '' }]);
    FakeForm.last?.emitHostEcho({ index: 0, name: 'nombre', value: 'prefill' });
    rerender({ inputs: [{ nombre: '' }] });
    expect(FakeForm.last?.setInputsCalls).toHaveLength(0);
  });

  it('no reenvía el eco tras varias pulsaciones rápidas del usuario', () => {
    const { rerender } = mount([{ nombre: '' }]);
    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'J' });
    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'Jo' });
    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'Joh' });
    rerender({ inputs: [{ nombre: 'Joh' }] });
    expect(FakeForm.last?.setInputsCalls).toHaveLength(0);
    expect(onInputChange).toHaveBeenCalledTimes(3);
  });
});

describe('aislamiento por contexto de ejecución (isolationKey)', () => {
  let containerRef: { current: HTMLElement | null };
  let onInputChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    FakeForm.last = null;
    containerRef = { current: document.createElement('div') };
    onInputChange = vi.fn();
  });

  const mountIsolated = (inputs: Inputs, isolationKey: string) =>
    renderHook(
      (props: { inputs: Inputs; isolationKey: string }) =>
        usePdfmeRuntimeInstance(
          buildConfig(props.inputs, onInputChange, containerRef, props.isolationKey),
        ),
      { initialProps: { inputs, isolationKey } },
    );

  it('remonta el runtime al cambiar de destinatario', () => {
    const { rerender } = mountIsolated([{ nombre: 'de A' }], 'A::D1');
    const instanceForA = FakeForm.last;

    rerender({ inputs: [{ nombre: 'de B' }], isolationKey: 'B::D1' });

    expect(FakeForm.last).not.toBe(instanceForA);
    expect(FakeForm.last?.inputs).toEqual([{ nombre: 'de B' }]);
  });

  it('remonta el runtime al cambiar de documento', () => {
    const { rerender } = mountIsolated([{ nombre: 'en D1' }], 'A::D1');
    const instanceForD1 = FakeForm.last;

    rerender({ inputs: [{ nombre: 'en D2' }], isolationKey: 'A::D2' });

    expect(FakeForm.last).not.toBe(instanceForD1);
  });

  it('no arrastra al nuevo contexto lo que el usuario escribió en el anterior', () => {
    const { rerender } = mountIsolated([{ nombre: '' }], 'A::D1');
    FakeForm.last?.emitUserChange({ index: 0, name: 'nombre', value: 'secreto de A' });

    rerender({ inputs: [{ nombre: '' }], isolationKey: 'B::D1' });

    expect(FakeForm.last?.inputs).toEqual([{ nombre: '' }]);
    expect(FakeForm.last?.setInputsCalls).toHaveLength(0);
  });

  it('conserva la instancia si el contexto no cambia', () => {
    const { rerender } = mountIsolated([{ nombre: 'a' }], 'A::D1');
    const instance = FakeForm.last;
    rerender({ inputs: [{ nombre: 'b' }], isolationKey: 'A::D1' });
    expect(FakeForm.last).toBe(instance);
    expect(FakeForm.last?.setInputsCalls).toHaveLength(1);
  });
});

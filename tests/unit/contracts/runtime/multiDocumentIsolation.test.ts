/**
 * RTP-510.A — aislamiento multi-documento desde la API pública.
 *
 * Este spec NO usa el wrapper del laboratorio (`src/examples`): ejercita
 * `useSisadPdfmeInstance`, que es la superficie reusable que un host integra.
 * Es deliberado: el lab puede demostrar un uso correcto, pero el componente no
 * puede depender de él para aislar valores.
 *
 * Contrato bajo prueba: cambiar `activeDocumentId` cambia el conjunto de
 * valores visible, y volver a un documento ya visitado recupera exactamente lo
 * que se escribió en él.
 */
import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

/**
 * Las superficies se sustituyen por marcadores.
 *
 * Lo que se prueba aquí es el scope de valores que el hook resuelve, no el
 * render del Designer; montarlo de verdad arrastraría antd entero y haría el
 * contrato dependiente de la UI que no participa en la decisión.
 */
vi.mock('@sisad-pdfme/react/index.js', () => ({
  SisadPdfmeDesigner: () => null,
  SisadPdfmeForm: () => null,
  SisadPdfmeViewer: () => null,
}));

const { useSisadPdfmeInstance } = await import('@sisad-pdfme/integration/useSisadPdfmeInstance');

const TEMPLATE = {
  basePdf: { width: 210, height: 297, padding: [0, 0, 0, 0] },
  schemas: [[
    { name: 'text', type: 'text', position: { x: 0, y: 0 }, width: 40, height: 10 },
    { name: 'asignado', type: 'text', position: { x: 0, y: 20 }, width: 40, height: 10, ownerMode: 'single' },
    { name: 'firma', type: 'signature', position: { x: 0, y: 40 }, width: 40, height: 15, ownerMode: 'single' },
    { name: 'iniciales', type: 'initials', position: { x: 0, y: 60 }, width: 20, height: 15, ownerMode: 'single' },
  ]],
};

const BASE_INPUTS = [{ text: 'plantilla', asignado: 'plantilla', firma: '', iniciales: '' }];

type Scope = { activeRecipientId?: string | null; activeDocumentId?: string | null };

const renderInstance = (initial: Scope) =>
  renderHook(
    (scope: Scope) =>
      useSisadPdfmeInstance({
        instanceKey: 'multi-document-isolation',
        definition: {
          mode: 'form',
          template: TEMPLATE,
          defaultState: { inputs: BASE_INPUTS },
          state: {
            activeRecipientId: scope.activeRecipientId ?? null,
            activeDocumentId: scope.activeDocumentId ?? null,
          },
        },
        resources: {},
        handlers: {},
      }),
    { initialProps: initial },
  );

/** Valor que la instancia expone hoy para un schema de la primera fila. */
const valueOf = (result: { current: { props: Record<string, unknown> } }, name: string) => {
  const inputs = result.current.props.inputs as Record<string, unknown>[] | undefined;
  return inputs?.[0]?.[name];
};

const type = (
  result: { current: { props: Record<string, unknown> } },
  name: string,
  value: unknown,
) => {
  const onInputChange = result.current.props.onInputChange as (p: {
    index: number;
    name: string;
    value: unknown;
  }) => void;
  act(() => {
    onInputChange({ index: 0, name, value });
  });
};

describe('multi-documento desde la API pública', () => {
  it('el Form recibe los inputs de partida', () => {
    const { result } = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });
    expect(valueOf(result, 'text')).toBe('plantilla');
  });

  it('D1 → D2 → D1 conserva el valor de cada documento', () => {
    const { result, rerender } = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });

    type(result, 'text', 'valor D1');
    expect(valueOf(result, 'text')).toBe('valor D1');

    // D2 nunca se escribió: no puede heredar lo de D1.
    rerender({ activeRecipientId: 'alice', activeDocumentId: 'D2' });
    expect(valueOf(result, 'text')).toBe('plantilla');

    type(result, 'text', 'valor D2');
    expect(valueOf(result, 'text')).toBe('valor D2');

    rerender({ activeRecipientId: 'alice', activeDocumentId: 'D1' });
    expect(valueOf(result, 'text')).toBe('valor D1');

    rerender({ activeRecipientId: 'alice', activeDocumentId: 'D2' });
    expect(valueOf(result, 'text')).toBe('valor D2');
  });

  it('la matriz Alice/Bob × D1/D2 no se contamina en un schema asignado', () => {
    const { result, rerender } = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });
    const matriz = [
      ['alice', 'D1'],
      ['alice', 'D2'],
      ['bob', 'D1'],
      ['bob', 'D2'],
    ] as const;

    matriz.forEach(([activeRecipientId, activeDocumentId]) => {
      rerender({ activeRecipientId, activeDocumentId });
      type(result, 'asignado', `${activeRecipientId}-${activeDocumentId}`);
    });

    matriz.forEach(([activeRecipientId, activeDocumentId]) => {
      rerender({ activeRecipientId, activeDocumentId });
      expect(
        valueOf(result, 'asignado'),
        `celda ${activeRecipientId}/${activeDocumentId}`,
      ).toBe(`${activeRecipientId}-${activeDocumentId}`);
    });
  });

  it('un schema sin asignación sigue siendo compartido entre usuarios del mismo documento', () => {
    const { result, rerender } = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });

    type(result, 'text', 'escrito por Alice');
    rerender({ activeRecipientId: 'bob', activeDocumentId: 'D1' });

    // No es una fuga: sin asignación el modelo concede edición a todos, así que
    // la celda es una sola. Fijarlo aquí hace que un cambio a scope per-user
    // rompa el test en vez de pasar inadvertido.
    expect(valueOf(result, 'text')).toBe('escrito por Alice');
  });

  it('cambiar de documento no arrastra el valor a un usuario distinto', () => {
    const { result, rerender } = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });

    type(result, 'asignado', 'de Alice en D1');

    rerender({ activeRecipientId: 'bob', activeDocumentId: 'D1' });
    expect(valueOf(result, 'asignado')).toBe('plantilla');

    rerender({ activeRecipientId: 'alice', activeDocumentId: 'D2' });
    expect(valueOf(result, 'asignado')).toBe('plantilla');

    rerender({ activeRecipientId: 'alice', activeDocumentId: 'D1' });
    expect(valueOf(result, 'asignado')).toBe('de Alice en D1');
  });

  it('el artifact de firma de un usuario no aparece en el de otro', () => {
    const { result, rerender } = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });

    // Un artifact es un valor más: viaja por el mismo scope que el resto.
    type(result, 'firma', 'data:image/png;base64,FIRMA-DE-ALICE');
    type(result, 'iniciales', 'data:image/png;base64,INICIALES-DE-ALICE');

    rerender({ activeRecipientId: 'bob', activeDocumentId: 'D1' });
    expect(valueOf(result, 'firma')).toBe('');
    expect(valueOf(result, 'iniciales')).toBe('');

    type(result, 'firma', 'data:image/png;base64,FIRMA-DE-BOB');

    rerender({ activeRecipientId: 'alice', activeDocumentId: 'D1' });
    expect(valueOf(result, 'firma')).toBe('data:image/png;base64,FIRMA-DE-ALICE');
    expect(valueOf(result, 'iniciales')).toBe('data:image/png;base64,INICIALES-DE-ALICE');
  });

  it('firma e iniciales son artifacts independientes aunque compartan estilo', () => {
    const { result } = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });

    type(result, 'firma', 'artifact-firma');
    expect(valueOf(result, 'iniciales'), 'firmar no rellena las iniciales').toBe('');

    type(result, 'iniciales', 'artifact-iniciales');
    expect(valueOf(result, 'firma')).toBe('artifact-firma');
    expect(valueOf(result, 'iniciales')).toBe('artifact-iniciales');
  });

  it('la firma de un documento no se arrastra al siguiente', () => {
    const { result, rerender } = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });

    type(result, 'firma', 'firma-en-D1');
    rerender({ activeRecipientId: 'alice', activeDocumentId: 'D2' });
    expect(valueOf(result, 'firma')).toBe('');

    rerender({ activeRecipientId: 'alice', activeDocumentId: 'D1' });
    expect(valueOf(result, 'firma')).toBe('firma-en-D1');
  });

  it('dos instancias en el mismo realm no comparten celdas', () => {
    const primera = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });
    const segunda = renderInstance({ activeRecipientId: 'alice', activeDocumentId: 'D1' });

    type(primera.result, 'text', 'sólo en la primera');

    // El store pertenece a la instancia: no hay singleton de módulo.
    expect(valueOf(segunda.result, 'text')).toBe('plantilla');
    expect(valueOf(primera.result, 'text')).toBe('sólo en la primera');
  });
});

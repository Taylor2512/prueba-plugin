/**
 * PRT-140 — Caracterización del chevron del schema `select` por superficie.
 *
 * Contrato bajo prueba:
 * - el chevron es decorativo y se dibuja en Designer, Form y Viewer, para que
 *   el campo se lea siempre como desplegable;
 * - el `<select>` nativo (interactivo) sólo se monta en Form y sólo si el
 *   campo no es de sólo lectura: en Designer capturaría los eventos de puntero
 *   y bloquearía arrastre y selección.
 *
 * Estos dos ejes se caracterizan juntos porque se confundieron: al mover la
 * condición del chevron a `mode !== 'form'` se ocultó justo en la superficie
 * donde el usuario despliega el campo, y el `padding` derecho reservado en Form
 * quedó como un hueco vacío.
 */
import { describe, expect, it } from 'vitest';
import type { Mode, Schema } from '@sisad-pdfme/common';
import selectSchema from '@sisad-pdfme/schemas/select';

type SelectSchema = Schema & { options: string[] };

const buildSchema = (overrides: Partial<SelectSchema> = {}): SelectSchema =>
  ({
    name: 'estado',
    type: 'select',
    position: { x: 0, y: 0 },
    width: 40,
    height: 8,
    options: ['Aprobado', 'Rechazado'],
    fontSize: 12,
    ...overrides,
  }) as SelectSchema;

/** Renderiza la UI del plugin en un contenedor aislado y devuelve la raíz. */
const renderSelect = async (
  mode: Mode,
  { value = '', schema = buildSchema() }: { value?: string; schema?: SelectSchema } = {},
): Promise<HTMLElement> => {
  const rootElement = document.createElement('div');
  rootElement.style.position = 'relative';
  document.body.appendChild(rootElement);

  await selectSchema.ui({
    schema,
    value,
    mode,
    rootElement,
    onChange: () => undefined,
    stopEditing: () => undefined,
    tabIndex: 0,
    theme: { colorPrimary: '#1677ff', colorPrimaryBg: '#e6f4ff' },
    i18n: (key: string) => key,
    _cache: new Map(),
    options: {},
  } as unknown as Parameters<typeof selectSchema.ui>[0]);

  return rootElement;
};

const chevronOf = (root: HTMLElement) => root.querySelector('.sisad-pdfme-select-chevron');
const nativeSelectOf = (root: HTMLElement) => root.querySelector('select');

const UI_MODES: Mode[] = ['designer', 'form', 'viewer'];

describe('PRT-140 — el chevron se dibuja en las tres superficies de UI', () => {
  it.each(UI_MODES)('lo dibuja en modo %s', async (mode) => {
    const root = await renderSelect(mode);
    expect(chevronOf(root)).not.toBeNull();
  });

  it('lo dibuja también con el campo ya seleccionado', async () => {
    const root = await renderSelect('form', { value: 'Aprobado' });
    expect(chevronOf(root)).not.toBeNull();
  });

  it('lo dibuja en un campo de sólo lectura, que sigue leyéndose como desplegable', async () => {
    const root = await renderSelect('form', { schema: buildSchema({ readOnly: true } as Partial<SelectSchema>) });
    expect(chevronOf(root)).not.toBeNull();
    expect(nativeSelectOf(root)).toBeNull();
  });

  it('lo mantiene decorativo: nunca captura eventos de puntero', async () => {
    for (const mode of UI_MODES) {
      const chevron = chevronOf(await renderSelect(mode)) as HTMLElement | null;
      expect(chevron?.style.pointerEvents).toBe('none');
    }
  });
});

describe('PRT-140 — el overlay interactivo sigue siendo exclusivo de Form', () => {
  it('monta el <select> nativo sólo en modo form', async () => {
    expect(nativeSelectOf(await renderSelect('form'))).not.toBeNull();
    expect(nativeSelectOf(await renderSelect('designer'))).toBeNull();
    expect(nativeSelectOf(await renderSelect('viewer'))).toBeNull();
  });

  it('reserva a la derecha en Form el espacio que ocupa el chevron', async () => {
    const root = await renderSelect('form');
    const chevron = chevronOf(root) as HTMLElement;
    // El hueco reservado por el contenedor y el ancho del chevron son el mismo
    // número: si uno cambia sin el otro, el icono se solapa con el texto.
    expect(root.style.padding).toBe('0px 22px 0px 0px');
    expect(chevron.style.width).toBe('22px');
  });
});

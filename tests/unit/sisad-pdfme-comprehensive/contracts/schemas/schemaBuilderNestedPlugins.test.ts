/**
 * Contrato de composición de plugins en `createSchemaPlugin`.
 *
 * Varios schemas se construyen reutilizando el `ui` de otro plugin ya
 * construido — el patrón de los presets `textLike` (`ui: text.ui`) y de
 * `select`, `date` y `dateSigned`, que invocan `text.ui` desde dentro.
 *
 * `createSchemaPlugin` añade una capa de deduplicación por
 * `(rootElement, schema.id)`. Aplicada dos veces sobre la misma emisión, la
 * capa externa graba la firma y la interna la reconoce como duplicado: el
 * `onChange` real nunca se ejecuta y el valor se queda como draft DOM-only.
 */
import { describe, expect, it, vi } from 'vitest';
import type { Plugin } from '@sisad-pdfme/common';
import { createSchemaPlugin } from '@sisad-pdfme/schemas/schemaBuilder';

const definition = (type: string) => ({
  key: type,
  type,
  label: type,
  category: 'Test',
});

/** Plugin base: emite el valor recibido, como hace `text` al escribir. */
const buildBase = () =>
  createSchemaPlugin(
    {
      pdf: () => undefined,
      ui: ({ onChange, value }) => onChange?.([{ key: 'content', value }]),
      propPanel: { defaultSchema: { type: 'base', name: '' } },
    } as unknown as Plugin,
    definition('base'),
  );

/** Preset que reutiliza el `ui` ya construido del base (patrón textLike). */
const buildPreset = (base: ReturnType<typeof buildBase>) =>
  createSchemaPlugin(
    {
      pdf: () => undefined,
      ui: base.ui,
      propPanel: { defaultSchema: { type: 'preset', name: '' } },
    } as unknown as Plugin,
    definition('preset'),
  );

const renderPreset = (
  preset: ReturnType<typeof buildPreset>,
  root: HTMLDivElement,
  onChange: () => void,
  value: string,
) =>
  preset.ui({
    schema: { id: 'preset-1', type: 'preset', name: 'fullName' },
    rootElement: root,
    onChange,
    value,
  } as never);

describe('createSchemaPlugin — plugins compuestos sobre otro plugin', () => {
  it('emite el primer cambio aunque el ui reutilizado ya venga envuelto', async () => {
    const preset = buildPreset(buildBase());
    const onChange = vi.fn();

    await renderPreset(preset, document.createElement('div'), onChange, 'Ada');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([{ key: 'content', value: 'Ada' }]);
  });

  it('emite cada valor distinto al escribir carácter a carácter', async () => {
    const preset = buildPreset(buildBase());
    const onChange = vi.fn();
    const root = document.createElement('div');

    await renderPreset(preset, root, onChange, '3');
    await renderPreset(preset, root, onChange, '33');
    await renderPreset(preset, root, onChange, '333');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith([{ key: 'content', value: '333' }]);
  });

  it('sigue descartando una emisión idéntica repetida dentro del mismo root', async () => {
    const preset = buildPreset(buildBase());
    const onChange = vi.fn();
    const root = document.createElement('div');

    await renderPreset(preset, root, onChange, 'Ada');
    await renderPreset(preset, root, onChange, 'Ada');

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('no cruza el estado de dedupe entre dos roots distintos', async () => {
    const preset = buildPreset(buildBase());
    const first = vi.fn();
    const second = vi.fn();

    await renderPreset(preset, document.createElement('div'), first, 'Ada');
    await renderPreset(preset, document.createElement('div'), second, 'Ada');

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
  });
});

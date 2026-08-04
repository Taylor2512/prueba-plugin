import { describe, expect, it } from 'vitest';
import { validationTypeField } from '../../src/sisad-pdfme/schemas/propPanel/commonInspectorFields';

type Option = { label: string; value: string };

const getOptions = (): Option[] => {
  const field = validationTypeField() as { props?: { options?: Option[] } };
  return field.props?.options ?? [];
};

describe('validationTypeField', () => {
  it('exposes full, human-readable Spanish labels (never truncated)', () => {
    const labels = getOptions().map((option) => option.label);
    expect(labels).toEqual([
      'Sin validación',
      'Correo electrónico',
      'Solo números',
      'Solo letras',
      'Fecha',
      'Cédula / identificación',
      'Código personalizado',
    ]);
  });

  it('does not expose SSN or other US-centric validations by default', () => {
    const values = getOptions().map((option) => option.value);
    expect(values).not.toContain('ssn');
    expect(values).not.toContain('zip');
    expect(values).not.toContain('zipExtended');
  });

  it('muestra un placeholder cuando todavía no hay validación elegida', () => {
    const field = validationTypeField() as { props?: { placeholder?: string } };

    // Sin valor persistido el trigger quedaba vacío y no se distinguía de un
    // control roto.
    expect(field.props?.placeholder).toBe('Selecciona una validación');
  });

  it('uses a full-width trigger and a content-sized popup so labels never clip', () => {
    const field = validationTypeField() as {
      span?: number;
      props?: { popupMatchSelectWidth?: boolean; classNames?: { popup?: { root?: string } } };
    };
    expect(field.span).toBe(24);
    expect(field.props?.popupMatchSelectWidth).toBe(false);
    expect(field.props?.classNames?.popup?.root).toBe('sisad-inspector-select-popup');
  });
});

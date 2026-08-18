/**
 * Contrato de OptionValue y política de selección ausente (RTP-480).
 *
 * Dos prohibiciones explícitas del contrato de campaña:
 * 1. no coercionar valores tipados a texto;
 * 2. no caer nunca a `options[0]` cuando el valor seleccionado no está en la
 *    página remota actual.
 */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SELECTED_MISSING_POLICY,
  isOptionValue,
  normalizeOptions,
  optionDisplayValue,
  optionValuesEqual,
  resolveSelectedOption,
  toOptionValue,
  type ResolvedOption,
} from '../../../../src/sisad-pdfme/integration/data/optionValue';

const OPCIONES: ResolvedOption[] = [
  { value: 1, label: 'Uno' },
  { value: 2, label: 'Dos' },
  { value: false, label: 'No' },
  { value: 0, label: 'Cero' },
];

describe('valores tipados', () => {
  it('acepta cadena, número, booleano y null', () => {
    [1, 'a', true, false, 0, null].forEach((value) => expect(isOptionValue(value), String(value)).toBe(true));
    expect(isOptionValue({})).toBe(false);
    expect(isOptionValue([])).toBe(false);
  });

  it('no coerciona a texto', () => {
    expect(toOptionValue(0)).toBe(0);
    expect(toOptionValue(false)).toBe(false);
    expect(toOptionValue(null)).toBeNull();
    expect(toOptionValue(undefined)).toBeNull();
  });

  it('la igualdad tolera número frente a cadena numérica', () => {
    expect(optionValuesEqual(1, '1')).toBe(true);
    expect(optionValuesEqual('2', 2)).toBe(true);
    expect(optionValuesEqual(0, '0')).toBe(true);
  });

  it('pero no confunde false con "false" ni con 0', () => {
    expect(optionValuesEqual(false, 'false')).toBe(false);
    expect(optionValuesEqual(false, 0)).toBe(false);
    expect(optionValuesEqual(null, 0)).toBe(false);
    expect(optionValuesEqual(null, '')).toBe(false);
  });
});

describe('valor seleccionado presente', () => {
  it('resuelve la opción y su etiqueta', () => {
    const resolution = resolveSelectedOption(2, OPCIONES);
    expect(resolution.option?.label).toBe('Dos');
    expect(resolution.stale).toBe(false);
    expect(resolution.displayValue).toBe('Dos');
  });

  it('resuelve valores falsy sin tratarlos como ausencia', () => {
    expect(resolveSelectedOption(0, OPCIONES).displayValue).toBe('Cero');
    expect(resolveSelectedOption(false, OPCIONES).displayValue).toBe('No');
    expect(resolveSelectedOption(0, OPCIONES).stale).toBe(false);
  });
});

describe('valor seleccionado ausente de la página', () => {
  it('keep-stale es el default y conserva el valor', () => {
    expect(DEFAULT_SELECTED_MISSING_POLICY).toBe('keep-stale');
    const resolution = resolveSelectedOption(99, OPCIONES);
    expect(resolution.value).toBe(99);
    expect(resolution.stale).toBe(true);
    expect(resolution.invalid).toBe(false);
  });

  it('NUNCA cae a la primera opción', () => {
    const resolution = resolveSelectedOption(99, OPCIONES);
    expect(resolution.value).not.toBe(OPCIONES[0].value);
    expect(resolution.option).toBeNull();
  });

  it('invalidate conserva el valor pero lo marca inválido', () => {
    const resolution = resolveSelectedOption(99, OPCIONES, 'invalidate');
    expect(resolution.value).toBe(99);
    expect(resolution.invalid).toBe(true);
  });

  it('clear descarta sólo cuando se pide explícitamente', () => {
    const resolution = resolveSelectedOption(99, OPCIONES, 'clear');
    expect(resolution.value).toBeNull();
    expect(resolution.stale).toBe(false);
  });

  it('la etiqueta sigue siendo determinista sin catálogo', () => {
    expect(resolveSelectedOption(99, []).displayValue).toBe('99');
    expect(resolveSelectedOption(99, [], 'keep-stale', 'Pikachu').displayValue).toBe('Pikachu');
    expect(optionDisplayValue(null)).toBe('');
  });

  it('una lista de opciones vacía no vacía la selección', () => {
    const resolution = resolveSelectedOption(7, []);
    expect(resolution.value).toBe(7);
    expect(resolution.stale).toBe(true);
  });
});

describe('normalización de opciones', () => {
  it('acepta escalares sueltos', () => {
    expect(normalizeOptions([1, 'a', false])).toEqual([
      { value: 1, label: '1' },
      { value: 'a', label: 'a' },
      { value: false, label: 'false' },
    ]);
  });

  it('aplica el mapeo declarado', () => {
    const options = normalizeOptions(
      [{ id: 25, nombre: 'Pikachu', bloqueado: true }],
      { value: 'id', label: 'nombre', disabled: 'bloqueado' },
    );
    expect(options).toEqual([{ value: 25, label: 'Pikachu', disabled: true, description: undefined, icon: undefined }]);
  });

  it('descarta un objeto sin valor en vez de inventarlo desde la etiqueta', () => {
    expect(normalizeOptions([{ label: 'sin valor' }])).toEqual([]);
  });

  it('un null suelto es la opción «ninguno», no basura', () => {
    // `null` pertenece a OptionValue: es la forma canónica de «sin selección»
    // dentro de un catálogo, y descartarlo impediría ofrecerla.
    expect(normalizeOptions([null])).toEqual([{ value: null, label: '' }]);
  });

  it('conserva un valor cero declarado explícitamente', () => {
    expect(normalizeOptions([{ value: 0, label: 'Cero' }])).toEqual([
      { value: 0, label: 'Cero', disabled: undefined, description: undefined, icon: undefined },
    ]);
  });
});

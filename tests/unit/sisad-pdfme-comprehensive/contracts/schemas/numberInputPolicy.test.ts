/**
 * Política de entrada del schema `number`.
 *
 * El campo es un `contenteditable`, no un `<input type="number">`, así que nada
 * filtra los caracteres por sí solo. Estas pruebas fijan qué texto puede existir
 * en el campo y qué llega al valor canónico, que es lo que consume el guard de
 * `beforeinput` y lo que acaba en el PDF.
 */
import { describe, expect, it } from 'vitest';
import {
  isNumberDraft,
  isNumberWithinBounds,
  normalizeNumberDraft,
} from '../../../../../src/sisad-pdfme/schemas/number/index';
import {
  isAcceptableNumberInput,
  splitCurrency,
  withCanonicalNumber,
} from '../../../../../src/sisad-pdfme/schemas/number/inputPolicy';

const free = { format: 'free' };
const money = { format: 'currency' };

describe('number — solo caracteres numéricos', () => {
  it.each(['abc', '12a', 'a12', '1e5', '12 34', '1..2', '1,,2', '1.2,3'])(
    'rechaza %s',
    (raw) => {
      expect(isNumberDraft(raw, free)).toBe(false);
      expect(normalizeNumberDraft(raw, free)).toBeNull();
    },
  );

  it.each(['\n', '\t', '12\n34'])('rechaza el salto de línea o tabulador: %j', (raw) => {
    expect(isAcceptableNumberInput(raw, free)).toBe(false);
  });

  it.each(['0', '42', '-7', '12.5', '12,5'])('acepta %s', (raw) => {
    expect(isNumberDraft(raw, free)).toBe(true);
  });
});

describe('number — coma decimal', () => {
  it.each([
    ['12,5', '12.5'],
    ['12,50', '12.5'],
    ['0,25', '0.25'],
    ['-3,75', '-3.75'],
    [',5', '0.5'],
  ])('canonicaliza %s a %s', (raw, expected) => {
    expect(normalizeNumberDraft(raw, free)).toBe(expected);
  });

  it.each(['12,', ',', '-,'])('deja escribir el draft intermedio %j', (raw) => {
    expect(isNumberDraft(raw, free)).toBe(true);
  });

  it('admite un único separador decimal', () => {
    expect(isNumberDraft('12,5', free)).toBe(true);
    expect(isNumberDraft('12,5,5', free)).toBe(false);
    expect(isNumberDraft('12.5,5', free)).toBe(false);
  });
});

describe('number — símbolo de moneda', () => {
  it('solo lo admite cuando el formato es moneda', () => {
    expect(isNumberDraft('$12', money)).toBe(true);
    expect(isNumberDraft('$12', free)).toBe(false);
    expect(normalizeNumberDraft('$12', free)).toBeNull();
  });

  it.each(['$', '€', '£', '¥', '₡', '₹'])('acepta cualquier símbolo monetario: %s', (symbol) => {
    expect(isNumberDraft(`${symbol}100`, money)).toBe(true);
  });

  it.each([
    ['$12,50', '$12.5'],
    ['$ 12,50', '$ 12.5'],
    ['12,50 €', '12.5 €'],
    ['€12', '€12'],
  ])('conserva símbolo, posición y espaciado: %s → %s', (raw, expected) => {
    expect(normalizeNumberDraft(raw, money)).toBe(expected);
  });

  it('pega el signo al número aunque se escriba antes del símbolo', () => {
    expect(normalizeNumberDraft('-$12,5', money)).toBe('$-12.5');
    expect(normalizeNumberDraft('$-12,5', money)).toBe('$-12.5');
  });

  it('rechaza más de un símbolo', () => {
    expect(isNumberDraft('$12$', money)).toBe(false);
    expect(isNumberDraft('$12€', money)).toBe(false);
  });

  it('deja teclear el símbolo antes que la cifra', () => {
    expect(isNumberDraft('$', money)).toBe(true);
    expect(normalizeNumberDraft('$', money)).toBeNull();
  });

  it('ignora el símbolo al comparar contra min/max', () => {
    const schema = { ...money, validationMin: 0, validationMax: 100, decimals: 2 };
    expect(isNumberWithinBounds('$12,50', schema)).toBe(true);
    expect(isNumberWithinBounds('$100,01', schema)).toBe(false);
    expect(isNumberWithinBounds('$-1', schema)).toBe(false);
  });

  it('separa el símbolo del tramo numérico', () => {
    expect(splitCurrency('$ 12,50', money)).toEqual({ symbol: '$', numeric: ' 12,50' });
    expect(splitCurrency('12,50', money)).toEqual({ symbol: '', numeric: '12,50' });
    expect(splitCurrency('$12$', money)).toBeNull();
    expect(splitCurrency('$12', free)).toBeNull();
  });
});

describe('number — signo negativo', () => {
  it('lo permite mientras no se configure lo contrario', () => {
    expect(isNumberDraft('-5', {})).toBe(true);
    expect(isNumberDraft('-5', { allowNegative: true })).toBe(true);
  });

  it('lo bloquea cuando allowNegative es false', () => {
    const noNegatives = { allowNegative: false };
    expect(isNumberDraft('-5', noNegatives)).toBe(false);
    expect(normalizeNumberDraft('-5', noNegatives)).toBeNull();
    expect(isNumberDraft('5', noNegatives)).toBe(true);
  });
});

describe('withCanonicalNumber', () => {
  it('sustituye solo el tramo numérico', () => {
    expect(withCanonicalNumber('$ 12,50', { symbol: '$', numeric: ' 12,50' }, '12.5')).toBe(
      '$ 12.5',
    );
    expect(withCanonicalNumber('12,50 €', { symbol: '€', numeric: '12,50 ' }, '12.5')).toBe(
      '12.5 €',
    );
  });

  it('devuelve la forma canónica cuando no hay tramo que sustituir', () => {
    expect(withCanonicalNumber('$', { symbol: '$', numeric: '' }, '0')).toBe('$0');
    expect(withCanonicalNumber('', { symbol: '', numeric: '' }, '0')).toBe('0');
  });
});

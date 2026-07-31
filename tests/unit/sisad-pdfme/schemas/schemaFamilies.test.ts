import { describe, it, expect } from 'vitest';
import {
  resolveSchemaFamily,
  resolveSchemaSemanticFamily,
  normalizeSchemaFamily,
} from '@/sisad-pdfme/schemas/schemaFamilies.js';

describe('resolveSchemaFamily', () => {
  it('text family', () => {
    expect(resolveSchemaFamily('text')).toBe('text');
    expect(resolveSchemaFamily('number')).toBe('text');
    expect(resolveSchemaFamily('select')).toBe('text');
    expect(resolveSchemaFamily('dropdown')).toBe('text');
    expect(resolveSchemaFamily('date')).toBe('text');
    expect(resolveSchemaFamily('time')).toBe('text');
    expect(resolveSchemaFamily('datetime')).toBe('text');
    expect(resolveSchemaFamily('signature')).toBe('text');
    expect(resolveSchemaFamily('initials')).toBe('text');
    expect(resolveSchemaFamily('dateSigned')).toBe('text');
    expect(resolveSchemaFamily('fullName')).toBe('text');
    expect(resolveSchemaFamily('emailAddress')).toBe('text');
    expect(resolveSchemaFamily('company')).toBe('text');
    expect(resolveSchemaFamily('title')).toBe('text');
    expect(resolveSchemaFamily('attachment')).toBe('text');
    expect(resolveSchemaFamily('note')).toBe('text');
    expect(resolveSchemaFamily('approve')).toBe('text');
    expect(resolveSchemaFamily('decline')).toBe('text');
  });

  it('boolean family', () => {
    expect(resolveSchemaFamily('checkbox')).toBe('boolean');
    expect(resolveSchemaFamily('radioGroup')).toBe('boolean');
    expect(resolveSchemaFamily('checkboxGroup')).toBe('boolean');
  });

  it('mediaVisual family', () => {
    expect(resolveSchemaFamily('image')).toBe('mediaVisual');
    expect(resolveSchemaFamily('svg')).toBe('mediaVisual');
  });

  it('table family', () => {
    expect(resolveSchemaFamily('table')).toBe('table');
  });

  it('shapeBarcode family', () => {
    expect(resolveSchemaFamily('line')).toBe('shapeBarcode');
    expect(resolveSchemaFamily('rectangle')).toBe('shapeBarcode');
    expect(resolveSchemaFamily('qrcode')).toBe('shapeBarcode');
    expect(resolveSchemaFamily('code128')).toBe('shapeBarcode');
  });

  it('unknown type falls back to text', () => {
    expect(resolveSchemaFamily('unknown-xyz')).toBe('text');
  });

  it('case-insensitive', () => {
    expect(resolveSchemaFamily('TEXT')).toBe('text');
    expect(resolveSchemaFamily('RadioGroup')).toBe('boolean');
  });
});

describe('resolveSchemaSemanticFamily', () => {
  it('resolves signing types', () => {
    expect(resolveSchemaSemanticFamily('signature')).toBe('signature');
    expect(resolveSchemaSemanticFamily('initials')).toBe('signature');
    expect(resolveSchemaSemanticFamily('dateSigned')).toBe('signature');
  });

  it('resolves textLike presets', () => {
    expect(resolveSchemaSemanticFamily('fullName')).toBe('text');
    expect(resolveSchemaSemanticFamily('emailAddress')).toBe('text');
    expect(resolveSchemaSemanticFamily('company')).toBe('text');
    expect(resolveSchemaSemanticFamily('title')).toBe('text');
  });

  it('resolves action types', () => {
    expect(resolveSchemaSemanticFamily('attachment')).toBe('action');
    expect(resolveSchemaSemanticFamily('note')).toBe('action');
    expect(resolveSchemaSemanticFamily('approve')).toBe('action');
    expect(resolveSchemaSemanticFamily('decline')).toBe('action');
  });

  it('resolves multiVariableText', () => {
    expect(resolveSchemaSemanticFamily('multiVariableText')).toBe('multiVariableText');
  });

  it('resolves dateTime types', () => {
    expect(resolveSchemaSemanticFamily('date')).toBe('dateTime');
    expect(resolveSchemaSemanticFamily('time')).toBe('dateTime');
    expect(resolveSchemaSemanticFamily('datetime')).toBe('dateTime');
  });

  it('resolves choice types', () => {
    expect(resolveSchemaSemanticFamily('select')).toBe('choice');
    expect(resolveSchemaSemanticFamily('radioGroup')).toBe('choice');
    expect(resolveSchemaSemanticFamily('checkboxGroup')).toBe('choice');
  });

  it('resolves boolean', () => {
    expect(resolveSchemaSemanticFamily('checkbox')).toBe('boolean');
  });
});

describe('normalizeSchemaFamily', () => {
  it('maps source aliases to normalized families', () => {
    expect(normalizeSchemaFamily('textual')).toBe('text');
    expect(normalizeSchemaFamily('media')).toBe('mediaVisual');
    expect(normalizeSchemaFamily('signature')).toBe('text');
    expect(normalizeSchemaFamily('choice')).toBe('boolean');
    expect(normalizeSchemaFamily('shape')).toBe('shapeBarcode');
    expect(normalizeSchemaFamily('barcode')).toBe('shapeBarcode');
    expect(normalizeSchemaFamily('table')).toBe('table');
  });

  it('passthrough for normalized families', () => {
    expect(normalizeSchemaFamily('text')).toBe('text');
    expect(normalizeSchemaFamily('boolean')).toBe('boolean');
    expect(normalizeSchemaFamily('mediaVisual')).toBe('mediaVisual');
    expect(normalizeSchemaFamily('shapeBarcode')).toBe('shapeBarcode');
  });
});

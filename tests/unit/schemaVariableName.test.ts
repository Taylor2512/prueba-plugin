import { describe, expect, it } from 'vitest';
import {
  createUniqueSchemaVariableName,
  getSchemaVariablePrefix,
} from '../../src/sisad-pdfme/ui/components/Designer/shared/schemaVariableName.js';

describe('schema variable names', () => {
  it('maps known schema types to stable spanish prefixes', () => {
    expect(getSchemaVariablePrefix('text')).toBe('texto');
    expect(getSchemaVariablePrefix('image')).toBe('imagen');
    expect(getSchemaVariablePrefix('signature')).toBe('firma');
    expect(getSchemaVariablePrefix('radioGroup')).toBe('radio');
  });

  it('creates unique names with two-digit indexes by default', () => {
    expect(createUniqueSchemaVariableName('text', [])).toBe('texto_01');
    expect(createUniqueSchemaVariableName('text', ['texto_01', 'texto_02'])).toBe('texto_03');
  });

  it('falls back to sanitized type prefix or campo when type is empty', () => {
    expect(createUniqueSchemaVariableName('Custom Box', [])).toBe('custom_box_01');
    expect(createUniqueSchemaVariableName('', [])).toBe('campo_01');
  });

  it('normalizes accents and special chars for custom prefixes', () => {
    expect(createUniqueSchemaVariableName('Firma Óptica++', [])).toBe('firma_optica_01');
  });

  it('supports custom minDigits and name comparisons without case sensitivity', () => {
    expect(createUniqueSchemaVariableName('text', ['TEXTO_001'], 3)).toBe('texto_002');
  });
});

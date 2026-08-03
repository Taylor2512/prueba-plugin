import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/schemas/multiVariableText/helper';

describe('sisad-pdfme/schemas/multiVariableText/helper.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });

  it('ignora contenido de variables que no es JSON válido', ()=>{
    expect(moduleUnderTest.parseVariablesInput('Linea 1\nLinea 2')).toEqual({});
  });

  it('acepta objetos de variables ya normalizados', ()=>{
    expect(moduleUnderTest.parseVariablesInput({ foo: 'bar' })).toEqual({ foo: 'bar' });
  });
});

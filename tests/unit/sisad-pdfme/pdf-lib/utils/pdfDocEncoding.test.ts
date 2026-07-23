import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/pdfDocEncoding';

describe('sisad-pdfme/pdf-lib/utils/pdfDocEncoding.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

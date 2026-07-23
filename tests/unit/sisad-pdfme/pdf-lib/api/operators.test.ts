import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/operators';

describe('sisad-pdfme/pdf-lib/api/operators.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/operations';

describe('sisad-pdfme/pdf-lib/api/operations.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

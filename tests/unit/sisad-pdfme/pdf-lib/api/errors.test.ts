import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/errors';

describe('sisad-pdfme/pdf-lib/api/errors.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

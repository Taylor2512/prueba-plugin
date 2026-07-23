import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/core/crypto';

describe('sisad-pdfme/pdf-lib/core/crypto.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

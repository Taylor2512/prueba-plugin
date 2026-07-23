import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/sizes';

describe('sisad-pdfme/pdf-lib/api/sizes.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

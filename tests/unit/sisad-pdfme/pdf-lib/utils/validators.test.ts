import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/validators';

describe('sisad-pdfme/pdf-lib/utils/validators.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

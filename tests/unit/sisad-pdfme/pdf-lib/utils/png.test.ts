import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/png';

describe('sisad-pdfme/pdf-lib/utils/png.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

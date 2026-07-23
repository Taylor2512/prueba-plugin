import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/elements/Plot';

describe('sisad-pdfme/pdf-lib/utils/elements/Plot.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

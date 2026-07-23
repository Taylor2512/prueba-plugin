import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/utils/maths';

describe('sisad-pdfme/pdf-lib/utils/maths.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

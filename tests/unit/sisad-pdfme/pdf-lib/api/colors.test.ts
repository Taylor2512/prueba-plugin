import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/colors';

describe('sisad-pdfme/pdf-lib/api/colors.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

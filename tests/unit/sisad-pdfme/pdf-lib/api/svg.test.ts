import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from 'pdf-lib/api/svg';

describe('sisad-pdfme/pdf-lib/api/svg.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

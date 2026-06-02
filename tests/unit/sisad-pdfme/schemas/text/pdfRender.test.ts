import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/schemas/text/pdfRender';

describe('sisad-pdfme/schemas/text/pdfRender.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

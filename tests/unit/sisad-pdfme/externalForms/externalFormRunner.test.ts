import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/externalForms/externalFormRunner';

describe('sisad-pdfme/externalForms/externalFormRunner.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

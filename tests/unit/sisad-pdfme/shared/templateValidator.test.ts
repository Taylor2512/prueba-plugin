import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/shared/templateValidator';

describe('sisad-pdfme/shared/templateValidator.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

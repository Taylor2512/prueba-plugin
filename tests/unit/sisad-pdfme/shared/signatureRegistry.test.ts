import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/shared/signatureRegistry';

describe('sisad-pdfme/shared/signatureRegistry.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/contracts/schema';

describe('sisad-pdfme/contracts/schema.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

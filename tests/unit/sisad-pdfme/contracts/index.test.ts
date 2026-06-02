import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/contracts/index';

describe('sisad-pdfme/contracts/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

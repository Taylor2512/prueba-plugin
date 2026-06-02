import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/contracts/plugins';

describe('sisad-pdfme/contracts/plugins.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

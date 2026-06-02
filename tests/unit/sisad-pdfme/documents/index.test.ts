import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/documents/index';

describe('sisad-pdfme/documents/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

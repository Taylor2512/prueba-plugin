import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/assignments/index';

describe('sisad-pdfme/assignments/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

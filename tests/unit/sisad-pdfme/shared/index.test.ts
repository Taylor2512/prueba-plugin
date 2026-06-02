import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/shared/index';

describe('sisad-pdfme/shared/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

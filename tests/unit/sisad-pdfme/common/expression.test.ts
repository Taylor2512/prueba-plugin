import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/common/expression';

describe('sisad-pdfme/common/expression.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

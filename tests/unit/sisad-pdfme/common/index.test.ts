import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/common/index';

describe('sisad-pdfme/common/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

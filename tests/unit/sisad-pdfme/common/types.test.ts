import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/common/types';

describe('sisad-pdfme/common/types.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

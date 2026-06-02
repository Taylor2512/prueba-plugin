import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/common/dynamicTemplate';

describe('sisad-pdfme/common/dynamicTemplate.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

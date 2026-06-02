import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/annotation/index';

describe('sisad-pdfme/pdf-lib/core/annotation/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

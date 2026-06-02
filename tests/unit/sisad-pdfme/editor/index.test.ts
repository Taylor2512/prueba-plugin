import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/editor/index';

describe('sisad-pdfme/editor/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

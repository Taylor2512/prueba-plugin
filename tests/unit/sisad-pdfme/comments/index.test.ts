import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/comments/index';

describe('sisad-pdfme/comments/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

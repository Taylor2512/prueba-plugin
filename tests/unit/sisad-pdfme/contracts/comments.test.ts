import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/contracts/comments';

describe('sisad-pdfme/contracts/comments.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

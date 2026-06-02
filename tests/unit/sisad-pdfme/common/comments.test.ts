import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/common/comments';

describe('sisad-pdfme/common/comments.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

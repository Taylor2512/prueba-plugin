import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/collaboration/index';

describe('sisad-pdfme/collaboration/index.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

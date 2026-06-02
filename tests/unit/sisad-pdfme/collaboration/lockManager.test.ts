import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/collaboration/lockManager';

describe('sisad-pdfme/collaboration/lockManager.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

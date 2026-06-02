import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/collaboration/schemaLockGuard';

describe('sisad-pdfme/collaboration/schemaLockGuard.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});

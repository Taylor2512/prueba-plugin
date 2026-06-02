import { describe, it, expect } from 'vitest';
import * as moduleUnderTest from '@/sisad-pdfme/pdf-lib/core/streams/DecryptStream';

describe('sisad-pdfme/pdf-lib/core/streams/DecryptStream.ts', ()=>{
  it('imports without crashing', ()=>{
    expect(moduleUnderTest).toBeTruthy();
  });
});
